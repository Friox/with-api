import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class SignUpDTO {
  uid: string;

  @ApiProperty({
    description: '아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pw: string;

  @ApiProperty({
    description: '실명',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  realname: string;

  @ApiProperty({
    description: '닉네임',
    required: false,
  })
  @IsOptional()
  @IsString()
  nickname: string;

  signupDate: Date;
}

export class SignInReqDTO {
  @ApiProperty({
    description: '아이디',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  id: string;

  @ApiProperty({
    description: '비밀번호',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  pw: string;
}

export class SignInResDTO {
  @IsNotEmpty()
  @IsString()
  token: string;
}
