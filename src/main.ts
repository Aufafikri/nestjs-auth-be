import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    next();
});

  app.enableCors({
    origin: ["http://localhost:3000", "https://evstauth.vercel.app"],
    methods: "GET, POST, PUT, DELETE",
    allowedHeaders: "Content-Type, Accept",
    credentials: true
  })
  await app.listen(5000);
}
bootstrap();
