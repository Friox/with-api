import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateFamilyDTO {
  uid: string;
  inviteCode: string;

  @ApiProperty({
    description: '패밀리 이름',
    required: true,
  })
  @IsNotEmpty()
  name: string;

  createDate: Date;

  @ApiProperty({
    description: '패밀리에서 자신의 역할 (문자열로 바꿀까 생각중)',
    required: true,
  })
  @IsNotEmpty()
  role: number;
}
