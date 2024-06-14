import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { SignInReqDTO } from 'src/auth/auth.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {}

  findAll(): Promise<UserEntity[]> {
    return this.userRepository.find();
  }

  findOneSignIn(signInReqDTO: SignInReqDTO): Promise<any> {
    return this.userRepository.findOne({
      where: { id: signInReqDTO.id },
      relations: ['familyMembers'],
    });
  }

  findOneById(id: string): Promise<boolean> {
    return this.userRepository.existsBy({ id: id });
  }
}
