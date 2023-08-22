import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const PORT = config.get<number>('API_PORT');
  app.setGlobalPrefix('api');
  await app.listen(PORT || 3030);
  console.log(`Servier is listening on ${PORT} port  ✅`);
}
bootstrap();
