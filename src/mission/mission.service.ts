import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MissionEntity } from 'src/entities/mission.entity';
import { UserEntity } from 'src/entities/user.entity';
import { ToolsService } from 'src/shared/tools.service';
import { DataSource, Repository } from 'typeorm';

interface CreateMissionOptions {
  familyUID: string;
  createUserUID: string;
  targetUsersUID: Array<string>;
  contents: string;
  expirationDate: Date;
  exp: number;
}

@Injectable()
export class MissionService {
  constructor(
    @InjectRepository(MissionEntity)
    private missionRepository: Repository<MissionEntity>,

    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,

    private toolsService: ToolsService,
    private dataSource: DataSource,
  ) {}

  async createMission(options: CreateMissionOptions) {
    let successCount = 0;
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      for (let i = 0; i < options.targetUsersUID.length; i++) {
        const userUID = options.targetUsersUID[i];
        const missionUID = this.toolsService.createUID();
        const missionEntity = this.missionRepository.create({
          uid: missionUID,
          familyUid: options.familyUID,
          createUserUid: options.createUserUID,
          targetUserUid: userUID,
          contents: options.contents,
          expirationDate: options.expirationDate,
          exp: options.exp,
          status: false,
        });
        try {
          await this.missionRepository.save(missionEntity);
          successCount++;
        } catch (e) {
          console.log(e);
        }
      }
      await queryRunner.commitTransaction();
      return successCount;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  getMissionInfo(missionUID: string, userUID: string) {
    return this.missionRepository.find({
      where: [
        {
          uid: missionUID,
          createUserUid: userUID,
        },
        {
          uid: missionUID,
          targetUserUid: userUID,
        },
      ],
    });
  }

  deleteMission(missionUID: string, userUID: string) {
    return this.missionRepository.delete({
      uid: missionUID,
      createUserUid: userUID,
    });
  }

  getMissionList(userUID: string, type: number) {
    if (type == 1) {
      // 내가 생성한 미션
      return this.missionRepository.find({
        where: {
          createUserUid: userUID,
        },
        relations: ['createUserU', 'targetUserU'],
        select: {
          uid: true,
          createUserUid: true,
          targetUserUid: true,
          contents: true,
          expirationDate: true,
          exp: true,
          status: true,
          createUserU: {
            nickname: true,
            realname: true,
          },
          targetUserU: {
            nickname: true,
            realname: true,
          },
        },
        order: {
          pk: 'DESC',
        },
      });
    } else {
      // 나에게 부여된 미션
      return this.missionRepository.find({
        where: {
          targetUserUid: userUID,
        },
        relations: ['createUserU', 'targetUserU'],
        select: {
          uid: true,
          createUserUid: true,
          targetUserUid: true,
          contents: true,
          expirationDate: true,
          exp: true,
          status: true,
          createUserU: {
            nickname: true,
            realname: true,
          },
          targetUserU: {
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

  async completeMission(missionUID: string, userUID: string) {
    const missionEntity = await this.missionRepository.findOne({
      where: {
        uid: missionUID,
        createUserUid: userUID,
      },
    });
    if (missionEntity == null || missionEntity.status) return false;

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.missionRepository.update(
        { uid: missionUID },
        { status: true },
      );
      await this.missionRepository
        .createQueryBuilder()
        .where('uid = :target', { target: missionEntity.targetUserUid })
        .update(UserEntity)
        .set({ exp: () => `exp + ${missionEntity.exp}` })
        .execute();
      await queryRunner.commitTransaction();
      return true;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      return false;
    } finally {
      await queryRunner.release();
    }
  }
}
