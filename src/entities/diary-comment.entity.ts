import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { DiaryEntity } from './diary.entity';
import { UserEntity } from './user.entity';

@Index('pk', ['pk'], { unique: true })
@Index('diary_uid', ['diaryUid'], {})
@Index('user_uid', ['userUid'], {})
@Entity('diary_comment', { schema: 'with_new' })
export class DiaryCommentEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'diary_uid', nullable: true, length: 16 })
  diaryUid: string | null;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('varchar', { name: 'contents', nullable: true, length: 1000 })
  contents: string | null;

  @Column('timestamp', { name: 'create_date', nullable: true })
  createDate: Date | null;

  @ManyToOne(() => DiaryEntity, (diary) => diary.diaryComments, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'diary_uid', referencedColumnName: 'uid' }])
  diaryU: DiaryEntity;

  @ManyToOne(() => UserEntity, (user) => user.diaryComments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
