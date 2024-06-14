import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryCommentEntity } from './diary-comment.entity';
import { FamilyEntity } from './family.entity';
import { UserEntity } from './user.entity';

@Index('pk', ['pk'], { unique: true })
@Index('uid', ['uid'], { unique: true })
@Index('family_uid', ['familyUid'], {})
@Index('user_uid', ['userUid'], {})
@Entity('diary', { schema: 'with_new' })
export class DiaryEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, unique: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'family_uid', nullable: true, length: 16 })
  familyUid: string | null;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('varchar', { name: 'title', nullable: true, length: 255 })
  title: string | null;

  @Column('varchar', { name: 'contents', nullable: true, length: 1000 })
  contents: string | null;

  @Column('timestamp', { name: 'create_date', nullable: true })
  createDate: Date | null;

  @Column('int', { name: 'sentiment', nullable: true })
  sentiment: number | null;

  @Column('tinyint', { name: 'private', nullable: true, width: 1 })
  private: boolean | null;

  @OneToMany(() => DiaryCommentEntity, (diaryComment) => diaryComment.diaryU)
  diaryComments: DiaryCommentEntity[];

  @ManyToOne(() => FamilyEntity, (family) => family.diaries, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'family_uid', referencedColumnName: 'uid' }])
  familyU: FamilyEntity;

  @ManyToOne(() => UserEntity, (user) => user.diaries, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
