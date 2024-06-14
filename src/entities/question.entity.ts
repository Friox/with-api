import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { AnswerEntity } from './answer.entity';

@Index('pk', ['pk'], { unique: true })
@Index('uid', ['uid'], { unique: true })
@Index('create_user_uid', ['createUserUid'], {})
@Index('target_user_uid', ['targetUserUid'], {})
@Entity('question', { schema: 'with_new' })
export class QuestionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, unique: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'create_user_uid', nullable: true, length: 16 })
  createUserUid: string | null;

  @Column('char', { name: 'target_user_uid', nullable: true, length: 16 })
  targetUserUid: string | null;

  @Column('varchar', { name: 'contents', nullable: true, length: 1000 })
  contents: string | null;

  @ManyToOne(() => UserEntity, (user) => user.questions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'create_user_uid', referencedColumnName: 'uid' }])
  createUserU: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.questions2, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'target_user_uid', referencedColumnName: 'uid' }])
  targetUserU: UserEntity;

  @OneToMany(() => AnswerEntity, (answer) => answer.questionU)
  answers: AnswerEntity[];
}
