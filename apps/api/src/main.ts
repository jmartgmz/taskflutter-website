import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Environment configuration
  const port = process.env.PORT || 3000;
  const host = process.env.HOST || '0.0.0.0';
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';

  // Development logging
  if (process.env.NODE_ENV !== 'production') {
    console.log('Backend Configuration:');
    console.log(`   Port: ${port}`);
    console.log(`   Host: ${host}`);
    console.log(`   Frontend URL: ${frontendUrl}`);
    console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  }

  // CORS Configuration
  const allowedOrigins = [
    frontendUrl,
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, Postman, etc.)
      if (!origin) return callback(null, true);

      if (typeof origin === 'string' && allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.warn(`CORS blocked origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  await app.listen(port, host);
  console.log(`Backend server running on http://${host}:${port}`);
}

void bootstrap();
