import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryCommentEntity } from './diary-comment.entity';
import { QuestionEntity } from './question.entity';
import { TamagotchiEntity } from './tamagotchi.entity';
import { AnswerEntity } from './answer.entity';
import { MissionEntity } from './mission.entity';
import { JwtTokenEntity } from './jwt-token.entity';
import { FamilyMemberEntity } from './family-member.entity';
import { DiaryEntity } from './diary.entity';

@Index('pk', ['pk'], { unique: true })
@Index('uid', ['uid'], { unique: true })
@Entity('user', { schema: 'with_new' })
export class UserEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, unique: true, length: 16 })
  uid: string | null;

  @Column('varchar', { name: 'id', nullable: true, length: 255 })
  id: string | null;

  @Column('varchar', { name: 'pw', nullable: true, length: 255 })
  pw: string | null;

  @Column('varchar', { name: 'nickname', nullable: true, length: 255 })
  nickname: string | null;

  @Column('varchar', { name: 'realname', nullable: true, length: 255 })
  realname: string | null;

  @Column('timestamp', { name: 'signup_date', nullable: true })
  signupDate: Date | null;

  @Column('char', { name: 'profile_uid', nullable: true, length: 16 })
  profileUid: string | null;

  @Column('bigint', { name: 'exp', nullable: true })
  exp: string | null;

  @OneToMany(() => DiaryCommentEntity, (diaryComment) => diaryComment.userU)
  diaryComments: DiaryCommentEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.createUserU)
  questions: QuestionEntity[];

  @OneToMany(() => QuestionEntity, (question) => question.targetUserU)
  questions2: QuestionEntity[];

  @OneToMany(() => TamagotchiEntity, (tamagotchi) => tamagotchi.userU)
  tamagotchis: TamagotchiEntity[];

  @OneToMany(() => AnswerEntity, (answer) => answer.userU)
  answers: AnswerEntity[];

  @OneToMany(() => MissionEntity, (mission) => mission.targetUserU)
  missions: MissionEntity[];

  @OneToMany(() => JwtTokenEntity, (jwtToken) => jwtToken.userU)
  jwtTokens: JwtTokenEntity[];

  @OneToMany(() => FamilyMemberEntity, (familyMember) => familyMember.userU)
  familyMembers: FamilyMemberEntity[];

  @OneToMany(() => DiaryEntity, (diary) => diary.userU)
  diaries: DiaryEntity[];
}
