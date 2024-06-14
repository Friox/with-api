import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { QuestionEntity } from './question.entity';
import { UserEntity } from './user.entity';

@Index('pk', ['pk'], { unique: true })
@Index('question_uid', ['questionUid'], {})
@Index('user_uid', ['userUid'], {})
@Entity('answer', { schema: 'with_new' })
export class AnswerEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'question_uid', nullable: true, length: 16 })
  questionUid: string | null;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('varchar', { name: 'contents', nullable: true, length: 1000 })
  contents: string | null;

  @Column('timestamp', { name: 'create_date', nullable: true })
  createDate: Date | null;

  @Column('tinyint', { name: 'private', nullable: true, width: 1 })
  private: boolean | null;

  @ManyToOne(() => QuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'question_uid', referencedColumnName: 'uid' }])
  questionU: QuestionEntity;

  @ManyToOne(() => UserEntity, (user) => user.answers, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
