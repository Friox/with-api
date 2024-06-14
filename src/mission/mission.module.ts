import { Module } from '@nestjs/common';
import { MissionController } from './mission.controller';
import { MissionService } from './mission.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MissionEntity } from 'src/entities/mission.entity';
import { ToolsService } from 'src/shared/tools.service';
import { FamilyModule } from 'src/family/family.module';
import { UserEntity } from 'src/entities/user.entity';

@Module({
  imports: [
    FamilyModule,
    TypeOrmModule.forFeature([MissionEntity, UserEntity]),
  ],
  controllers: [MissionController],
  providers: [MissionService, ToolsService],
})
export class MissionModule {}
