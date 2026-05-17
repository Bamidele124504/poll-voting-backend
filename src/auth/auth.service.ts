import {
    Injectable,
    BadRequestException,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { JwtService } from '@nestjs/jwt';
  
  import * as bcrypt from 'bcrypt';
  
  import { User } from '../users/entities/user.entity';
  
  import { SignupDto } from './dto/signup.dto';
  import { LoginDto } from './dto/login.dto';
  
  @Injectable()
  export class AuthService {
  
    constructor(
  
      @InjectRepository(User)
      private userRepository: Repository<User>,
  
      private jwtService: JwtService,
  
    ) {}
  
    // SIGNUP
    async signup(signupDto: SignupDto) {
  
      const existingUser = await this.userRepository.findOne({
        where: {
          email: signupDto.email,
        },
      });
  
      if (existingUser) {
        throw new BadRequestException('Email already exists');
      }
  
      const hashedPassword = await bcrypt.hash(signupDto.password, 10);
  
      const user = this.userRepository.create({
        ...signupDto,
        password: hashedPassword,
      });
  
      await this.userRepository.save(user);
  
      const payload = {
        sub: user.id,
        email: user.email,
        role: user.role,
      };
      
      return {
        access_token:
          this.jwtService.sign(payload),
      
        user: {
          email: user.email,
          role: user.role,
        },
      };
    }
  
    // LOGIN
    async login(
      loginDto: LoginDto,
    ) {
    
      const user =
        await this.userRepository.findOne({
          where: {
            email: loginDto.email,
          },
        });
    
      if (!user) {
        throw new UnauthorizedException(
          'Invalid credentials'
        );
      }
    
      const passwordMatch =
        await bcrypt.compare(
          loginDto.password,
          user.password,
        );
    
      if (!passwordMatch) {
        throw new UnauthorizedException(
          'Invalid credentials'
        );
      }
    
      const token =
        this.jwtService.sign({
          id: user.id,
          email: user.email,
          role: user.role,
        });
    
      return {
    
        access_token: token,
    
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          state: user.state,
          role: user.role,
        },
    
      };
    }
  
  }