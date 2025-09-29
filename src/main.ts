import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  // Конфигурация Swagger
  const config = new DocumentBuilder()
    .setTitle('API документация')
    .setDescription('Документация для API')
    .setVersion('1.0')
    .addBearerAuth() // если используете JWT
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  app.enableCors({ 
    origin: ['http://localhost:4200','http://192.168.10.237:4200','http://192.168.10.49:4200','http://192.168.10.49:9999', 'http://192.168.10.62:3000'],
    credentials: true,
  })

  await app.listen(process.env.PORT ?? 3000, '192.168.10.237');
}
bootstrap();
