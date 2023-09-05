import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { MongooseErrorsFilter } from './common/filters/mongoose-errors.filter'
import { NestExpressApplication } from '@nestjs/platform-express'
import { join } from 'path'

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule, {
        logger: ['log'],
        cors: { origin: '*' },
    })
    const configService = app.get(ConfigService)
    const port = configService.get('PORT')
    app.useGlobalFilters(new MongooseErrorsFilter())
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    )
    await app.listen(port)
}
bootstrap()
