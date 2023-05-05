import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ConflictException,
    ExceptionFilter,
} from '@nestjs/common'
import { Response } from 'express'
import { MongoError } from 'mongoose/node_modules/mongodb'
@Catch(MongoError)
export class MongooseErrorsFilter implements ExceptionFilter {
    catch(exception: MongoError, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        console.log(exception)
        switch (exception.code) {
            case 11000:
                response
                    .status(409)
                    .json(
                        new ConflictException(
                            'Object is already existed',
                        ).getResponse(),
                    )
        }
    }
}

