import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common'
import mongoose from 'mongoose'

@Catch(mongoose.mongo.MongoServerError)
export class MongooseErrorsFilter implements ExceptionFilter {
    catch(exception: mongoose.mongo.MongoServerError, host: ArgumentsHost) {}
}

