import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: 'Secret Text',
      signOptions: {
        expiresIn: 60 * 60, // 토큰 유효시간 (1시간)
      },
    }),
    TypeOrmModule.forFeature([User]),
  ],
  controllers: [AuthController],
  //JwtStrategy를 이 Auth 모듈에서 사용할 수 있도록 import
  providers: [AuthService, JwtStrategy],
  //JwtStrategy, PassportModule을 다른 모듈에서 사용할 수 있도록 등록
  exports: [JwtStrategy, PassportModule],
})
export class AuthModule {}
