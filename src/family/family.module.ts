import { Module } from '@nestjs/common';
import { FamilyController } from './family.controller';
import { FamilyService } from './family.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FamilyEntity } from 'src/entities/family.entity';
import { ToolsService } from 'src/shared/tools.service';
import { FamilyMemberEntity } from 'src/entities/family-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FamilyEntity, FamilyMemberEntity])],
  controllers: [FamilyController],
  providers: [FamilyService, ToolsService],
  exports: [FamilyService],
})
export class FamilyModule {}
