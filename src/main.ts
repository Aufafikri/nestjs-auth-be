import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cors from 'cors'

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.use(function(req, res, next) {
  //   res.header("Access-Control-Allow-Origin", "*");
  //   res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  //   res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
  //   next();
  // });

  // app.enableCors({
  //   origin: ["http://localhost:3000", "https://evstauth.vercel.app"],
  //   methods: ["GET", "POST", "PUT", "DELETE"],
  //   allowedHeaders: ["Content-Type", "Accept"],
  //   credentials: true
  // });

  app.use(cors())

  await app.listen(5000);
}
bootstrap();
