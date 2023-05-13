import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { MongooseErrorsFilter } from './common/filters/mongoose-errors.filter'

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { logger: ['log'] })
    const configService = app.get(ConfigService)
    const port = configService.get('PORT')
    app.useGlobalFilters(new MongooseErrorsFilter())
    app.useGlobalPipes(new ValidationPipe())
    await app.listen(port)
}
bootstrap()

