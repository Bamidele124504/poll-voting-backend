import {
    Injectable,
    BadRequestException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  
  import { Repository } from 'typeorm';
  
  import { Poll } from './entities/poll.entity';
  import { PollOption } from './entities/poll-option.entity';
  import { Vote } from '../votes/entities/vote.entity';
  import { CreatePollDto } from './dto/create-poll.dto';
  
  @Injectable()
  export class PollsService {
  
    constructor(
  
      @InjectRepository(Vote)
      private voteRepository: Repository<Vote>,

      @InjectRepository(Poll)
      private pollRepository: Repository<Poll>,
  
      @InjectRepository(PollOption)
      private optionRepository: Repository<PollOption>,
  
    ) {}
  
    // CREATE POLL
    async create(createPollDto: CreatePollDto) {
  
      // Create poll
      const poll = this.pollRepository.create({
        title: createPollDto.title,
        description: createPollDto.description,
      });
  
      const savedPoll = await this.pollRepository.save(poll);
  
      // Create options
      for (const optionText of createPollDto.options) {
  
        const option = this.optionRepository.create({
          optionText,
          poll: savedPoll,
        });
  
        await this.optionRepository.save(option);
      }
  
      return {
        message: 'Poll created successfully',
      };
    }
  
    // GET ALL POLLS
    async findAll() {
  
      return this.pollRepository.find({
        relations: ['options'],
      });
    }
  
    // GET RESULTS
    async getResults(
      pollId: number,
      state?: string,
    ) {
  
      const poll = await this.pollRepository.findOne({
        where: { id: pollId },
        relations: ['options'],
      });
  
      if (!poll) {
        throw new BadRequestException('Poll not found');
      }
  
      // Results array
      const results: any[] = [];
  
      for (const option of poll.options) {
  
              const whereCondition: any = {
              option: {
                id: option.id,
              },
            };

            if (state) {
              whereCondition.state = state;
            }

            const count =
              await this.voteRepository.count({
                where: whereCondition,
        });
  
        results.push({
          option: option.optionText,
          votes: count,
        });
      }
  
      return {
        poll: poll.title,
        stateFilter: state || 'All States',
        results,
      };
    }
  
    // CLOSE POLL
    async closePoll(id: number) {
  
      const poll = await this.pollRepository.findOne({
        where: { id },
      });
  
      if (!poll) {
        throw new BadRequestException('Poll not found');
      }
  
      // Change status
      poll.status = 'closed';
  
      // Save updated poll
      await this.pollRepository.save(poll);
  
      return {
        message: 'Poll closed successfully',
      };
    }
    
    async remove(id: number) {

      const poll = await this.pollRepository.findOne({
        where: { id },
      });
    
      if (!poll) {
        throw new BadRequestException(
          'Poll not found',
        );
      }
    
      await this.pollRepository.remove(poll);
    
      return {
        message: 'Poll deleted successfully',
      };
    }

    async findOne(id: number) {

      const poll = await this.pollRepository.findOne({
        where: { id },
        relations: ['options'],
      });
    
      if (!poll) {
        throw new BadRequestException(
          'Poll not found',
        );
      }
    
      return poll;
    }

    async toggleStatus(id: number) {

      const poll =
        await this.pollRepository.findOne({
          where: { id },
        });
    
      if (!poll) {
        throw new BadRequestException(
          'Poll not found',
        );
      }
    
      // Toggle status
      poll.status =
        poll.status === 'active'
          ? 'closed'
          : 'active';
    
      await this.pollRepository.save(poll);
    
      return {
        message:
          `Poll is now ${poll.status}`,
      };
    }
  
  }