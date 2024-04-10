import { NestFactory } from '@nestjs/core'
import { ValidationPipe } from '~/common/pipes/validation.pipe'
import { AppModule } from './app.module'

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule)
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(3000)
    console.log(`Application is running on: ${await app.getUrl()}`)
  } catch (err) {}
}
bootstrap()
