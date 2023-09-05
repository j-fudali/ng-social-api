import { Controller, Get, Param, Res } from '@nestjs/common'
import { join } from 'path'
import { of } from 'rxjs'

@Controller()
export class AppController {
    @Get('files/:url')
    getFiles(@Param('url') url: string, @Res() res) {
        return of(res.sendFile(join(__dirname, '..', 'files', url)))
    }
}
