import { Injectable, Request } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FamilyEntity } from 'src/entities/family.entity';
import { DataSource, Repository } from 'typeorm';
import { CreateFamilyDTO } from './family.dto';
import { ToolsService } from 'src/shared/tools.service';
import { FamilyMemberEntity } from 'src/entities/family-member.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(FamilyEntity)
    private familyRepository: Repository<FamilyEntity>,

    @InjectRepository(FamilyMemberEntity)
    private familyMemberRepository: Repository<FamilyMemberEntity>,

    private toolsService: ToolsService,
    private dataSource: DataSource,
  ) {}

  async hasFamily(userUID: string): Promise<string | undefined> {
    const familyMemberEntities = await this.familyMemberRepository.find({
      where: {
        userUid: userUID,
      },
      select: ['familyUid'],
    });
    console.log(familyMemberEntities);
    if (familyMemberEntities.length == 0) return undefined;
    return familyMemberEntities[0].familyUid;
  }

  async createFamily(createFamilyDTO: CreateFamilyDTO, req: Request) {
    const reqUserUID = req['user'].user_uid;
    createFamilyDTO.uid = this.toolsService.createUID();
    createFamilyDTO.createDate = new Date();
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const familyEntity = this.familyRepository.create(createFamilyDTO);
      const result = await this.familyRepository.save(familyEntity);
      const familyMemberEntity = this.familyMemberRepository.create({
        familyUid: createFamilyDTO.uid,
        userUid: reqUserUID,
        role: createFamilyDTO.role,
      });
      await this.familyMemberRepository.save(familyMemberEntity);
      await queryRunner.commitTransaction();
      return result;
    } catch (e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  async readFamily(reqFamilyUID: string) {
    return this.familyRepository.findOne({
      where: {
        uid: reqFamilyUID,
      },
    });
  }

  async getFamilyInfo(userUID: string) {
    const familyUID = await this.hasFamily(userUID);
    if (familyUID) {
      return this.readFamily(familyUID);
    }
  }

  isMemberOfFamily(userUID: string, familyUID: string) {
    return this.familyMemberRepository.existsBy({
      userUid: userUID,
      familyUid: familyUID,
    });
  }

  getFamilyMemberList(familyUID: string) {
    return this.familyMemberRepository.find({
      where: {
        familyUid: familyUID,
      },
      relations: ['userU'],
      select: {
        userUid: true,
        userU: {
          nickname: true,
          realname: true,
        },
      },
    });
  }
}
