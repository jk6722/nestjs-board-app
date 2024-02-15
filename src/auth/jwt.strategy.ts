import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as config from 'config';

const jwtConfig = config.get('jwt');

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {
    //passes two important options
    super({
      //토큰이 유효한지 체크하기 위한 Secret Text
      //토큰을 생성할 때 사용한 Secret Text와 동일한 값을 써야 한다.
      secretOrKey: jwtConfig.secret,
      //토큰을 어디서 꺼내오는지를 명시
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  /*
  위에서 토큰이 유효한지 체크가 되면 validate 메서드에서 payload에 있는 유저 이름이
  데이터베이스에 있는 유저인지 확인 후, 있다면 유저 객체를 return 값으로 던져준다.
  return 값은 @UseGuards(AuthGuard())를 이용한 모든 요청의 Request Object에 들어간다.
  */
  async validate(payload) {
    const { username } = payload;
    const user: User = await this.userRepository.findOneBy({ username });

    if (!user) {
      //유효하지 않은 토큰
      throw new UnauthorizedException();
    }

    return user;
  }
}
