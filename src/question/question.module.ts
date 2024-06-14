import { Module } from '@nestjs/common';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuestionEntity } from 'src/entities/question.entity';
import { AnswerEntity } from 'src/entities/answer.entity';
import { ToolsService } from 'src/shared/tools.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionEntity, AnswerEntity])],
  controllers: [QuestionController],
  providers: [QuestionService, ToolsService],
})
export class QuestionModule {}
