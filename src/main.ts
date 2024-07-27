import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.enableCors({
    origin: ["http://localhost:3000", "https://evstauth.vercel.app"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Accept",
    credentials: true
  })
  await app.listen(5000);
}
bootstrap();
