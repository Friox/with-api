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
@Index('family_uid', ['familyUid'], {})
@Index('user_uid', ['userUid'], {})
@Entity('family_member', { schema: 'with_new' })
export class FamilyMemberEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'family_uid', nullable: true, length: 16 })
  familyUid: string | null;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('int', { name: 'role', nullable: true })
  role: number | null;

  @ManyToOne(() => FamilyEntity, (family) => family.familyMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'family_uid', referencedColumnName: 'uid' }])
  familyU: FamilyEntity;

  @ManyToOne(() => UserEntity, (user) => user.familyMembers, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
