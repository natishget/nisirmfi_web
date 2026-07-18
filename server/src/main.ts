import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

import * as dotenv from 'dotenv';
dotenv.config();

const PORT = Number(process.env.PORT) || 3001;

function normalizeOrigin(value: string): string {
  return value
    .trim()
    .replace(/^['\"]|['\"]$/g, '')
    .replace(/\/+$/, '')
    .toLowerCase();
}

function withDefaultProtocol(value: string): string {
  if (/^[a-z][a-z0-9+.-]*:\/\//i.test(value)) {
    return value;
  }
  return `http://${value}`;
}

function extractHost(value: string): string | null {
  try {
    return new URL(withDefaultProtocol(value)).host.toLowerCase();
  } catch {
    return null;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.use(cookieParser());

  const allowedOrigin = (process.env.ALLOWED_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((origin) => normalizeOrigin(origin))
    .filter(Boolean);

  const allowedOriginSet = new Set(allowedOrigin);
  const allowedHostSet = new Set(
    allowedOrigin
      .map((origin) => extractHost(origin))
      .filter((host): host is string => Boolean(host)),
  );

  app.enableCors({
    // when credentials are used, origin must be explicit
    origin: (
      requestOrigin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // allow requests with no origin (e.g., curl, mobile apps)
      if (!requestOrigin) return callback(null, true);

      const normalizedRequestOrigin = normalizeOrigin(requestOrigin);
      const requestHost = extractHost(normalizedRequestOrigin);
      const isAllowed =
        allowedOriginSet.has(normalizedRequestOrigin) ||
        (requestHost !== null && allowedHostSet.has(requestHost));

      if (isAllowed) {
        return callback(null, true);
      } else {
        return callback(new Error('Not allowed by CORS'), false);
      }
    },
    credentials: true,
  });

  await app.listen(PORT);
  console.log('server listening on port', PORT, 'for', allowedOrigin);
}
bootstrap();
