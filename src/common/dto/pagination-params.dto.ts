import { Type } from 'class-transformer'
import { IsNumber, Min, IsOptional } from 'class-validator'

export class PaginationParams {
    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(0)
    page?: number

    @Type(() => Number)
    @IsOptional()
    @IsNumber()
    @Min(1)
    limit?: number
}
