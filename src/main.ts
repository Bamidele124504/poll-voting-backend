import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

import {
  SwaggerModule,
  DocumentBuilder,
} from '@nestjs/swagger';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  // Swagger config
  const config = new DocumentBuilder()

    .setTitle('Poll Voting API')

    .setDescription(
      'API documentation for Poll & Voting System',
    )

    .setVersion('1.0')

    .addBearerAuth()

    .build();

  // Create swagger document
  const document = SwaggerModule.createDocument(
    app,
    config,
  );

  // Swagger route
  SwaggerModule.setup(
    'api',
    app,
    document,
  );

  app.enableCors({
    origin: 'http://localhost:4200',
  });
  
  await app.listen(3000);

  console.log(
    `Application running on: http://localhost:3000`,
  );

  console.log(
    `Swagger docs: http://localhost:3000/api`,
  );
}

bootstrap();