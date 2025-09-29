from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline
import psycopg2

conn = psycopg2.connect(
    dbname="social",
    user="postgres",
    password="147258",
    host="192.168.5.42",
    port="5432"
)
cursor = conn.cursor()


# # Загрузка модели
# tokenizer = AutoTokenizer.from_pretrained("cointegrated/rubert-tiny-sentiment-balanced")
# model = AutoModelForSequenceClassification.from_pretrained("cointegrated/rubert-tiny-sentiment-balanced")

tokenizer = AutoTokenizer.from_pretrained("ai-forever/mGPT-1.3B-kazakh")
model = AutoModelForSequenceClassification.from_pretrained("ai-forever/mGPT-1.3B-kazakh")

# Пайплайн для анализа тональности
sentiment = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer)

cursor.execute("SELECT id, text FROM comments where score isnull;")
rows = cursor.fetchall()

positive_emojis = ["👏", "👍", "😂", "🔥", "😍", "🎊", "🌹", "😘", "🤗", "😀", "🫶", "❤",  "💚", "💙", "🎀", "🙌", "💪", "💐", "💓"]
for row in rows:
    id, text = row
    if text=='':
        continue
    
    if any(emoji in text for emoji in positive_emojis):
        posneg = 'positive'
        cursor.execute(
            "UPDATE comments SET label = %s, score = %s WHERE id = %s",
            (posneg, 0.99, id)
        )
        conn.commit()
    else:
        result = sentiment(text)[0] 
        print(f"{id} | {text} -> {result}")
        posneg = 'neutral'
        if result['label']=='LABEL_1' and result['score']>0.55:
            posneg = 'negative'
        elif result['label']=='LABEL_0' and result['score']>0.55:
            posneg = 'positive'
        else:
            posneg = 'neutral'
        cursor.execute(
            "UPDATE comments SET label = %s, score = %s WHERE id = %s",
            (posneg, float(result['score']), id)
        )
        conn.commit()
cursor.close()
conn.close()
# comments = []
# for c in comments:
#     print(c, "->", sentiment(c)[0])
