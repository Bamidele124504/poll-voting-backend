import {
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  
  import { Repository } from 'typeorm';
  
  import { Vote } from './entities/vote.entity';
  
  import { User } from '../users/entities/user.entity';
  import { Poll } from '../polls/entities/poll.entity';
  import { PollOption } from '../polls/entities/poll-option.entity';
  
  import { CreateVoteDto } from './dto/create-vote.dto';
  
  @Injectable()
  export class VotesService {
  
    constructor(
  
      @InjectRepository(Vote)
      private voteRepository: Repository<Vote>,
  
      @InjectRepository(User)
      private userRepository: Repository<User>,
  
      @InjectRepository(Poll)
      private pollRepository: Repository<Poll>,
  
      @InjectRepository(PollOption)
      private optionRepository: Repository<PollOption>,
  
    ) {}
  
    async createVote(
      createVoteDto: CreateVoteDto,
      userId: number,
    ) {
  
      // Find user
      const user = await this.userRepository.findOne({
        where: { id: userId },
      });
  
      if (!user) {
        throw new BadRequestException('User not found');
      }
  
      // Find poll
      const poll = await this.pollRepository.findOne({
        where: { id: createVoteDto.pollId },
      });
  
      if (!poll) {
        throw new BadRequestException('Poll not found');
      }
      if (poll.status === 'closed') {
        throw new BadRequestException(
          'This poll is closed',
        );
      }
  
      // Find option
      const option = await this.optionRepository.findOne({
        where: { id: createVoteDto.optionId },
      });
  
      if (!option) {
        throw new BadRequestException('Option not found');
      }
  
      // Prevent duplicate voting
      const existingVote = await this.voteRepository.findOne({
        where: {
          user: { id: userId },
          poll: { id: createVoteDto.pollId },
        },
        relations: ['user', 'poll'],
      });
  
      if (existingVote) {
        throw new BadRequestException(
          'You already voted on this poll',
        );
      }
  
      // Create vote
      const vote = this.voteRepository.create({
        user,
        poll,
        option,
        state: user.state,
      });
  
      await this.voteRepository.save(vote);
  
      return {
        message: 'Vote submitted successfully',
      };
    }
  
  }