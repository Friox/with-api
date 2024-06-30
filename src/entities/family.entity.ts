import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MissionEntity } from './mission.entity';
import { FamilyMemberEntity } from './family-member.entity';
import { DiaryEntity } from './diary.entity';

@Index('pk', ['pk'], { unique: true })
@Index('uid', ['uid'], { unique: true })
@Entity('family', { schema: 'with_new' })
export class FamilyEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, unique: true, length: 16 })
  uid: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('timestamp', { name: 'create_date', nullable: true })
  createDate: Date | null;

  @Column('char', {
    name: 'invite_code',
    nullable: true,
    unique: true,
    length: 6,
  })
  inviteCode: string | null;

  @OneToMany(() => MissionEntity, (mission) => mission.familyU)
  missions: MissionEntity[];

  @OneToMany(() => FamilyMemberEntity, (familyMember) => familyMember.familyU)
  familyMembers: FamilyMemberEntity[];

  @OneToMany(() => DiaryEntity, (diary) => diary.familyU)
  diaries: DiaryEntity[];
}
