import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/entities/diary.entity';
import { Repository } from 'typeorm';
import { CreateDiaryDTO, ReplyDiaryDTO } from './diary.dto';
import { DiaryCommentEntity } from 'src/entities/diary-comment.entity';

@Injectable()
export class DiaryService {
  constructor(
    @InjectRepository(DiaryEntity)
    private diaryRepository: Repository<DiaryEntity>,

    @InjectRepository(DiaryCommentEntity)
    private diaryCommentRepository: Repository<DiaryCommentEntity>,
  ) {}

  isOwn(userUID: string, diaryUID: string) {
    return this.diaryRepository.existsBy({
      uid: diaryUID,
      userUid: userUID,
    });
  }

  getMyDiaryList(req: Request) {
    const userUID = req['user'].user_uid;
    return this.diaryRepository.find({
      where: {
        userUid: userUID,
      },
    });
  }

  getFamilyDiaryList(userUID: string, familyUID: string) {
    if (familyUID == null) return [];
    return this.diaryRepository.find({
      where: {
        userUid: userUID,
        familyUid: familyUID,
        private: false,
      },
    });
  }

  createDiary(createDiaryDTO: CreateDiaryDTO) {
    const diaryEntity = this.diaryRepository.create(createDiaryDTO);
    return this.diaryRepository.save(diaryEntity);
  }

  getDiary(diaryUID: string) {
    return this.diaryRepository.findOne({
      where: {
        uid: diaryUID,
      },
    });
  }

  deleteDiary(diaryUID: string) {
    return this.diaryRepository.delete({
      uid: diaryUID,
    });
  }

  replyDiary(replyDiaryDTO: ReplyDiaryDTO) {
    const diaryCommentEntity =
      this.diaryCommentRepository.create(replyDiaryDTO);
    return this.diaryCommentRepository.save(diaryCommentEntity);
  }

  getReplyList(diaryUID: string) {
    return this.diaryCommentRepository.find({
      where: {
        diaryUid: diaryUID,
      },
      order: {
        pk: 'DESC',
      },
    });
  }
}
