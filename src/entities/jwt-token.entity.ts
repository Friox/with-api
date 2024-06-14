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
@Entity('jwt_token', { schema: 'with_new' })
export class JwtTokenEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'pk' })
  pk: string;

  @Column('char', { name: 'user_uid', nullable: true, length: 16 })
  userUid: string | null;

  @Column('char', { name: 'refresh_token', nullable: true, length: 16 })
  refreshToken: string | null;

  @ManyToOne(() => UserEntity, (user) => user.jwtTokens, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn([{ name: 'user_uid', referencedColumnName: 'uid' }])
  userU: UserEntity;
}
