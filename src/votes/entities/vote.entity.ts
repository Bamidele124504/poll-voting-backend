import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
  } from 'typeorm';
  
  import { User } from '../../users/entities/user.entity';
  import { Poll } from '../../polls/entities/poll.entity';
  import { PollOption } from '../../polls/entities/poll-option.entity';
  
  @Entity()
  export class Vote {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => User)
    user: User;
  
    @ManyToOne(
      () => Poll,
      {
        onDelete: 'CASCADE',
      }
    )
    poll: Poll;
  
    @ManyToOne(() => PollOption)
    option: PollOption;
  
    @Column()
    state: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
  }