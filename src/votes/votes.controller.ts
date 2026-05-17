import {
    Controller,
    Post,
    Body,
    UseGuards,
    Req,
  } from '@nestjs/common';
  
  import { VotesService } from './votes.service';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  
  import { CreateVoteDto } from './dto/create-vote.dto';
  
  @Controller('votes')
  export class VotesController {
  
    constructor(
      private votesService: VotesService,
    ) {}
  
    @Post()
    @UseGuards(JwtAuthGuard)
    createVote(
      @Body() createVoteDto: CreateVoteDto,
      @Req() req: any,
    ) {
  
      return this.votesService.createVote(
        createVoteDto,
        req.user.id,
      );
    }
  
  }