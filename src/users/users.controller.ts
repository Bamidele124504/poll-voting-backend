import {
    Controller,
    Get,
    Req,
    UseGuards,
  } from '@nestjs/common';
  
  import { UsersService } from './users.service';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  @Controller('users')
  export class UsersController {
  
    constructor(
      private usersService: UsersService,
    ) {}
  
    @Get('profile')
    @UseGuards(JwtAuthGuard)
    getProfile(
      @Req() req: any,
    ) {
  
      return this.usersService.getProfile(
        req.user.id,
      );
    }
  
  }