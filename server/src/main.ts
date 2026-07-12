import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const allowedOrigin = (
    process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000'
  ).split(',');

  app.enableCors({
    // when credentials are used, origin must be explicit
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // allow requests with no origin (e.g., curl, mobile apps)
      if (!requestOrigin) return callback(null, true);
      if (allowedOrigin.includes(requestOrigin)) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });
  await app.listen(PORT);
  console.log(
    `Server is running on http://localhost:${PORT} for ${allowedOrigin.join(', ')}`,
  );
}
bootstrap();
