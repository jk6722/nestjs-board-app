import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialDto } from './dto/request/auth-credential.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  //회원 생성
  @Post('/signup')
  createUser(@Body() authCredentialDto: AuthCredentialDto): Promise<void> {
    return this.authService.createUser(authCredentialDto);
  }
}
