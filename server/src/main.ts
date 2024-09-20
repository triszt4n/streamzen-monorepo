import { ClassSerializerInterceptor, Logger, RequestMethod, ValidationPipe } from "@nestjs/common"
import { NestFactory, Reflector } from "@nestjs/core"
import { NestExpressApplication } from "@nestjs/platform-express"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { AppModule } from "./app.module"
import { ConfigService } from "@nestjs/config"

async function bootstrap() {
  const isProduction = process.env.NODE_ENV === "production"
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: isProduction ? ["log", "error", "warn"] : ["log", "error", "warn", "debug"],
  })

  app.setGlobalPrefix("api", {
    exclude: [{ path: "", method: RequestMethod.GET }],
  })
  const configService = app.get(ConfigService)

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    })
  )
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))

  const config = new DocumentBuilder()
    .setTitle("Stream:zen API")
    .setDescription("Stream:zen API")
    .setVersion(process.env.npm_package_version || "0.1.0")
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  if (!isProduction) {
    SwaggerModule.setup("api", app, document)
  }

  app.enableCors({
    origin: configService.get<string>("FRONTEND_CALLBACK"),
    credentials: true,
  })
  app.enableShutdownHooks()

  const port = configService.get<number>("PORT")
  await app.listen(port, () => {
    Logger.debug(`Listening at http://localhost:${port}`)
  })
}

bootstrap()
