import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateMissionDTO {
  @ApiProperty({
    description: '미션 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;

  @ApiProperty({
    description: '만료 날짜 및 시간 (없는 경우도 만들까 생각중)',
    required: true,
  })
  @IsNotEmpty()
  expirationDate: Date;

  @ApiProperty({
    description: '완료시 지급할 경험치',
    required: true,
  })
  @IsNotEmpty()
  @IsNumber()
  exp: number;
}
