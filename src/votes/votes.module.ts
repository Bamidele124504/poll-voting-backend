import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';

import { Vote } from './entities/vote.entity';

import { User } from '../users/entities/user.entity';
import { Poll } from '../polls/entities/poll.entity';
import { PollOption } from '../polls/entities/poll-option.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Vote,
      User,
      Poll,
      PollOption,
    ]),
  ],
  controllers: [VotesController],
  providers: [VotesService],
})
export class VotesModule {}