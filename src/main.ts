import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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
