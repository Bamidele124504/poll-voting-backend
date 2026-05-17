import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany
 } from 'typeorm';
  import { PollOption } from './poll-option.entity';
  
  @Entity()
  export class Poll {
  
    @PrimaryGeneratedColumn()
    id: number;
  
    @Column()
    title: string;
  
    @Column()
    description: string;
  
    @Column({
      default: 'active',
    })
    status: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToMany(
      () => PollOption,
      option => option.poll,
      {
        cascade: true,
        onDelete: 'CASCADE',
      }
    )
    options: PollOption[];
  
  }