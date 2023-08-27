/*
https://docs.nestjs.com/pipes
*/

import {
    PipeTransform,
    Injectable,
    ArgumentMetadata,
    BadRequestException,
} from '@nestjs/common'
import { ObjectId } from 'mongodb'

@Injectable()
export class MongoIdParamPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if (ObjectId.isValid(value)) {
            console.log(value)
            if (String(new ObjectId(value)) === value) return value
            throw new BadRequestException('Bad or not provided id parameter')
        }
        throw new BadRequestException('Bad or not provided id parameter')
    }
}
