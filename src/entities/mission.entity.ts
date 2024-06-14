import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FamilyEntity } from './family.entity';
import { UserEntity } from './user.entity';

@Index('pk', ['pk'], { unique: true })
@Index('uid', ['uid'], { unique: true })
@Index('family_uid', ['familyUid'], {})
@Index('target_user_uid', ['targetUserUid'], {})
@Entity('mission', { schema: 'with_new' })
export class MissionEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'uid', nullable: true, unique: true, length: 16 })
  uid: string | null;

  @Column('char', { name: 'family_uid', nullable: true, length: 16 })
  familyUid: string | null;

  @Column('char', { name: 'create_user_uid', nullable: true, length: 16 })
  createUserUid: string | null;

  @Column('char', { name: 'target_user_uid', nullable: true, length: 16 })
  targetUserUid: string | null;

  @Column('varchar', { name: 'contents', nullable: true, length: 1000 })
  contents: string | null;

  @Column('timestamp', { name: 'expiration_date', nullable: true })
  expirationDate: Date | null;

  @Column('int', { name: 'exp', nullable: true })
  exp: number | null;

  @Column('tinyint', { name: 'status', nullable: true, width: 1 })
  status: boolean | null;

  @ManyToOne(() => FamilyEntity, (family) => family.missions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'family_uid', referencedColumnName: 'uid' }])
  familyU: FamilyEntity;

  @ManyToOne(() => UserEntity, (user) => user.missions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'create_user_uid', referencedColumnName: 'uid' }])
  createUserU: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.missions, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'target_user_uid', referencedColumnName: 'uid' }])
  targetUserU: UserEntity;
}
