import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
} from 'typeorm';

import { Poll } from './poll.entity';

@Entity()
export class PollOption {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  optionText: string;

  @ManyToOne(
    () => Poll,
    {
      onDelete: 'CASCADE',
    }
  )
  poll: Poll;
}