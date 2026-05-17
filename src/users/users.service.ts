import {
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  
  import { Repository } from 'typeorm';
  
  import { User } from './entities/user.entity';
  
  @Injectable()
  export class UsersService {
  
    constructor(
  
      @InjectRepository(User)
      private userRepository: Repository<User>,
  
    ) {}
  
    async getProfile(id: number) {
  
      const user =
        await this.userRepository.findOne({
          where: { id },
        });
  
      if (!user) {
        throw new BadRequestException(
          'User not found',
        );
      }
  
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        state: user.state,
        role: user.role,
      };
    }
  
  }