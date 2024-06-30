import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInReqDTO, SignInResDTO, SignUpDTO } from './auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(signInReqDTO: SignInReqDTO): Promise<SignInResDTO> {
    const user = await this.userService.findOneSignIn(signInReqDTO);
    if (!user || (await bcrypt.compare(signInReqDTO.pw, user?.pw)) == false) {
      throw new UnauthorizedException();
    }
    const userUID = user.uid;
    const familyUID = user.familyMembers[0]?.familyUid;

    const payload = {
      user_uid: userUID,
      family_uid: familyUID,
    };

    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(signUpDTO: SignUpDTO): Promise<UserEntity> {
    if (await this.userService.findOneById(signUpDTO.id)) {
      throw new ConflictException('already use id');
    }
    signUpDTO.uid = uuidv4().replace(/-/g, '').substring(0, 16);
    signUpDTO.signupDate = new Date();
    signUpDTO.pw = await bcrypt.hash(signUpDTO.pw, 10);
    const userEntity = this.userRepository.create(signUpDTO);
    console.log(signUpDTO);
    return this.userRepository.save(userEntity);
  }

  getProfile(userUID: string) {
    return this.userRepository.findOne({
      where: {
        uid: userUID,
      },
      select: {
        uid: true,
        nickname: true,
        realname: true,
        signupDate: true,
        profileUid: true,
        exp: true,
      },
    });
  }
}
