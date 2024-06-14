import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateDiaryDTO {
  uid: string;
  familyUid: string;
  userUid: string;

  @ApiProperty({
    description: '일기 제목',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    description: '일기 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;

  createDate: Date;

  @ApiProperty({
    description: '기분 (0 ~ 5, 아직 미정)',
    required: true,
  })
  @IsNotEmpty()
  sentiment: number;

  @ApiProperty({
    description: '비공개 여부 (0: 공개, 1: 비공개)',
    required: true,
    type: Number,
  })
  @IsNotEmpty()
  private: boolean;
}

export class ReplyDiaryDTO {
  uid: string;
  diaryUid: string;
  userUid: string;

  @ApiProperty({
    description: '댓글 내용',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  contents: string;

  createDate: Date;
}
