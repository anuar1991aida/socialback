#!/usr/bin/env python3
import os
import json
import psycopg2
from psycopg2.extras import execute_values
from instagrapi import Client
from instagrapi.exceptions import TwoFactorRequired, ChallengeRequired, ClientError


# --- Конфигурация ---
DB_CONFIG = {
    "dbname": "social",
    "user": "postgres",
    "password": "147258",
    "host": "192.168.5.42",
    "port": "5432"
}
SESSION_FILE = "session.json"
USERNAME = "kzo_bas"
PASSWORD = "S@ken2018"
# --------------------


def save_session(client: Client, path: str = SESSION_FILE):
    client.dump_settings(path)
    print(f"[+] Сессия сохранена в {path}")


def load_session(client: Client, path: str = SESSION_FILE) -> bool:
    if os.path.exists(path):
        client.load_settings(path)
        print(f"[+] Сессия загружена из {path}")
        return True
    return False


def login(client: Client, username: str, password: str):
    try:
        client.login(username, password)
        print("[+] Успешный логин")
        save_session(client)
    except TwoFactorRequired:
        print("[!] Требуется 2FA.")
        code = input("Введите код 2FA: ").strip()
        client.two_factor_login(code=code)
        save_session(client)
    except ChallengeRequired as e:
        print("[!] Требуется подтверждение входа:", e)
        raise
    except ClientError as e:
        print("[!] Ошибка клиента:", e)
        raise
    except Exception as e:
        print("[!] Ошибка логина:", e)
        raise


def fetch_all_comments(client: Client, media_pk: str, amount: int = 0):
    print(f"[+] media_pk = {media_pk}")
    try:
        comments = client.media_comments(media_pk, amount=amount)
    except Exception as e:
        print("[!] Ошибка при получении комментариев:", e)
        comments = []
    print(f"[+] Получено комментариев: {len(comments)}")
    return comments


def fetch_all_posts(cl: Client, user_id: str, db_user_id: int, conn, amount: int = 50):
    posts = []
    max_posts = amount
    max_id = None

    while True:
        if len(posts) >= max_posts:
            break

        params = {"count": 50}
        if max_id:
            params["max_id"] = max_id

        try:
            medias = cl.private_request(f"feed/user/{user_id}/", params=params)
        except Exception as e:
            print("[!] Ошибка запроса постов:", e)
            break

        for item in medias.get("items", []):
            caption = item.get("caption", {})
            content = caption.get("text", "") #.split("\n")[0] if caption else ""
            media_pk = item.get("id")
            
            image_url = None
            if "image_versions2" in item:
                candidates = item["image_versions2"].get("candidates", [])
                if candidates:
                    image_url = candidates[0]["url"]

            video_url = None
            if "video_versions" in item:
                video_versions = item.get("video_versions", [])
                if video_versions:
                    video_url = video_versions[0]["url"]
            
            if media_pk:
                posts.append((db_user_id, content, media_pk, db_user_id, image_url, video_url))

        max_id = medias.get("next_max_id")
        if not max_id:
            break

    if posts:
        try:
            with conn.cursor() as cursor:
                query = """
                    INSERT INTO posts (accounts_id, content, media_pk, db_acc_id, image_url, video_url)
                    VALUES %s
                    ON CONFLICT (media_pk) DO NOTHING
                """
                execute_values(cursor, query, posts)
            conn.commit()
        except Exception as e:
            print("[!] Ошибка вставки постов:", e)
            conn.rollback()

    return len(posts)


def main():
    cl = Client()

    # Загружаем сессию или логинимся
    if not load_session(cl):
        try:
            login(cl, USERNAME, PASSWORD)
        except ChallengeRequired:
            print("Подтвердите вход в Instagram и запустите скрипт снова.")
            return
        except Exception as e:
            print("Не удалось выполнить логин:", e)
            return
    else:
        try:
            if not cl.user_id:
                cl.login(USERNAME, PASSWORD)
                save_session(cl)
        except Exception as e:
            print("[!] Сессия невалидна:", e)
            try:
                login(cl, USERNAME, PASSWORD)
            except Exception as e2:
                print("Ошибка логина:", e2)
                return

    # --- одно соединение на всё выполнение ---
    conn = psycopg2.connect(**DB_CONFIG)

    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT id, username FROM accounts where id=3;")
            accounts = cursor.fetchall()

        for account in accounts:
            account_id, username = account
            print(f"[+] Загружаем посты аккаунта: {username}")

            user_id = cl.user_id_from_username(username)
            
            user = cl.user_info_by_username(username)
            full_name = user.full_name
            media_count = user.media_count
            biography = user.biography
            profile_pic_url = str(user.profile_pic_url)
            
            with conn.cursor() as cursor:
                cursor.execute("""UPDATE accounts
                                    SET full_name = %s,
                                        mediacount = %s,
                                        biography = %s,
                                        profile_pic_url = %s
                                    WHERE id = %s""",  (full_name, media_count, biography, profile_pic_url, account[0]))
                conn.commit()
                        
            fetch_all_posts(cl, user_id, account_id, conn, 20)
            # a = 1/0
            with conn.cursor() as cursor:
                cursor.execute("SELECT media_pk, id FROM posts WHERE db_acc_id  = %s;", (account_id,))
                rows = cursor.fetchall()

            for media_pk, post_id in rows:
                print(f"[+] Обработка поста {media_pk}")
                comments = fetch_all_comments(cl, media_pk, amount=1000)

                if comments:
                    data = []
                    for c in comments:
                        text = c.text.split(":", 1)[-1] if ":" in c.text else c.text
                        if text=='':
                            continue
                        data.append((post_id, text, c.pk))

                    try:
                        with conn.cursor() as cursor:
                            query = """
                                INSERT INTO comments (posts_id, text, comment_pk)
                                VALUES %s
                                ON CONFLICT (comment_pk) DO NOTHING
                            """
                            execute_values(cursor, query, data)
                        conn.commit()
                    except Exception as e:
                        print("[!] Ошибка вставки комментариев:", e)
                        conn.rollback()

    finally:
        conn.close()


if __name__ == "__main__":
    main()
