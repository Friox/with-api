import { Body, Controller, Post, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInReqDTO, SignUpDTO } from './auth.dto';
import { Public } from 'src/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @Post('signin')
  @ApiOperation({
    summary: '로그인',
    description: '로그인합니다, 토큰을 반환합니다.',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: SignInReqDTO })
  async signin(@Body() signInReqDTO: SignInReqDTO) {
    return this.authService.signIn(signInReqDTO);
  }

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: '회원가입',
    description: '회원가입합니다.',
  })
  @ApiConsumes('application/x-www-form-urlencoded')
  @ApiBody({ type: SignUpDTO })
  async signup(@Body() signUpDTO: SignUpDTO) {
    return this.authService.signUp(signUpDTO);
  }

  @Post('getprofile')
  @ApiBearerAuth()
  @ApiOperation({
    summary: '본인 프로필 조회',
    description: '나의 프로필을 조회합니다.',
  })
  async getProfile(@Request() req: Request) {
    const userUID = req['user'].user_uid;
    return this.authService.getProfile(userUID);
  }
}
