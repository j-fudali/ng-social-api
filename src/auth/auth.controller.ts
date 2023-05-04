import {
    Controller,
    Post,
    UseGuards,
    Request,
    HttpCode,
    Body,
} from '@nestjs/common'
import { LocalAuthGuard } from './guards/local-auth.guard'
import { AuthService } from './auth.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    register(@Body() body: CreateUserDto) {
        this.authService.register(body)
        return { message: 'User has been created' }
    }
    @UseGuards(LocalAuthGuard)
    @HttpCode(200)
    @Post('login')
    async login(@Request() req) {
        return this.authService.login(req.user)
    }
}

