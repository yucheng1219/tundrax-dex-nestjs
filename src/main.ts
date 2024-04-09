import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const validationPipeService = require("@pipets/validation-pipes");

async function bootstrap() {
  try {
    validationPipeService();
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(3000);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (err) {}
}
bootstrap();
