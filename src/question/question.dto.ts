import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateQuestionDTO {
  uid: string;
  createUserUid: string;

  @ApiProperty({
    description: '질문할 대상유저의 UID',
    required: true,
  })
  @IsNotEmpty()
  targetUserUid: string;

  @ApiProperty({
    description: '질문 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;
}

export class CreateAnswerDTO {
  uid: string;

  @IsNotEmpty()
  questionUid: string;

  userUid: string;

  @ApiProperty({
    description: '답변 내용',
    required: true,
  })
  @IsNotEmpty()
  contents: string;

  createDate: Date;

  @ApiProperty({
    description: '비공개 여부 (0: 공개, 1: 비공개)',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  private: boolean;
}
