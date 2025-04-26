
import { config } from 'dotenv';
import { resolve } from 'path';

config({path:resolve('./config/.env')})
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cors from 'cors'



async function bootstrap() {
  const port=process.env.PORT ?? 5000

  const app = await NestFactory.create(AppModule);
  app.enableCors()
    await app.listen(port,()=>{
    console.log(port)
  });
}
bootstrap();
