import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Index('pk', ['pk'], { unique: true })
@Index('user_uid', ['userUid'], {})
@Entity('tamagotchi', { schema: 'with_new' })
export class TamagotchiEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('varchar', { name: 'name', nullable: true, length: 255 })
  name: string | null;

  @Column('int', { name: 'type', nullable: true })
  type: number | null;

  @Column('int', { name: 'exp', nullable: true })
  exp: number | null;

  @ManyToOne(() => UserEntity, (user) => user.tamagotchis, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
