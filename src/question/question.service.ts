import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AnswerEntity } from 'src/entities/answer.entity';
import { QuestionEntity } from 'src/entities/question.entity';
import { Repository } from 'typeorm';
import { CreateAnswerDTO, CreateQuestionDTO } from './question.dto';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private questionRepository: Repository<QuestionEntity>,

    @InjectRepository(AnswerEntity)
    private answerRepository: Repository<AnswerEntity>,
  ) {}

  createQuestion(createQuestionDTO: CreateQuestionDTO) {
    const questionEntity = this.questionRepository.create(createQuestionDTO);
    return this.questionRepository.save(questionEntity);
  }

  getQuestionInfo(questionUID: string, userUID: string) {
    return this.questionRepository.find({
      where: {
        uid: questionUID,
        targetUserUid: userUID,
      },
    });
  }

  deleteQuestion(questionUID: string, userUID: string) {
    return this.questionRepository.delete({
      uid: questionUID,
      createUserUid: userUID,
    });
  }

  getQuestionList(userUID: string, type: number) {
    if (type == 1) {
      // 내가 쓴 질문
      return this.questionRepository.find({
        where: {
          createUserUid: userUID,
        },
        relations: ['createUserU', 'targetUserU'],
        select: {
          uid: true,
          createUserUid: true,
          targetUserUid: true,
          contents: true,
          createUserU: {
            nickname: true,
            realname: true,
          },
        },
      });
    } else {
      return this.questionRepository.find({
        where: {
          targetUserUid: userUID,
        },
        relations: ['createUserU', 'targetUserU'],
        select: {
          uid: true,
          createUserUid: true,
          targetUserUid: true,
          contents: true,
          createUserU: {
            nickname: true,
            realname: true,
          },
        },
      });
    }
  }

  createAnswer(createAnswerDTO: CreateAnswerDTO) {
    const answerEntity = this.answerRepository.create(createAnswerDTO);
    return this.answerRepository.save(answerEntity);
  }

  deleteAnswer(answerUID: string, userUID: string) {
    return this.answerRepository.delete({
      uid: answerUID,
      userUid: userUID,
    });
  }

  getAnswerList(questionUID: string) {
    return this.answerRepository.find({
      where: {
        questionUid: questionUID,
      },
      relations: ['userU'],
      select: {
        uid: true,
        userUid: true,
        contents: true,
        createDate: true,
        private: true,
        userU: {
          nickname: true,
          realname: true,
        },
      },
      order: {
        pk: 'DESC',
      },
    });
  }
}
