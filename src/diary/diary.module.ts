import { Module } from '@nestjs/common';
import { DiaryController } from './diary.controller';
import { DiaryService } from './diary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiaryEntity } from 'src/entities/diary.entity';
import { FamilyModule } from 'src/family/family.module';
import { ToolsService } from 'src/shared/tools.service';
import { DiaryCommentEntity } from 'src/entities/diary-comment.entity';

@Module({
  imports: [
    FamilyModule,
    TypeOrmModule.forFeature([DiaryEntity, DiaryCommentEntity]),
  ],
  controllers: [DiaryController],
  providers: [DiaryService, ToolsService],
})
export class DiaryModule {}
