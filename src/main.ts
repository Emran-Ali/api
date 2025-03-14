import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Task Management')
    .setDescription('The task management API Documentation')
    .setVersion('1.0.0')
    .addTag('Task Manages')
    .addBearerAuth()
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);
  app.enableCors('http://localhost:5173');

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
