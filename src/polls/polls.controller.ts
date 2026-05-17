import {
    Controller,
    Get,
    Post,
    Body,
    UseGuards,
    Param,
    Query,
    Delete,
    Patch,
  } from '@nestjs/common';
  
  import { PollsService } from './polls.service';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { RolesGuard } from '../auth/guards/roles.guard';
  
  import { Roles } from '../auth/decorators/roles.decorator';
  
  import { CreatePollDto } from './dto/create-poll.dto';
  
  @Controller('polls')
  export class PollsController {
  
    constructor(
      private pollsService: PollsService,
    ) {}
  
    // GET ALL POLLS
    @Get()
    @UseGuards(JwtAuthGuard)
    findAll() {
      return this.pollsService.findAll();
    }
    @Get(':id/results')
    getResults(
    @Param('id') id: string,
    @Query('state') state?: string,
)  {

  return this.pollsService.getResults(
    Number(id),
    state,
  );
}
  
    // CREATE POLL
    @Post()
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    create(
      @Body() createPollDto: CreatePollDto,
    ) {
      return this.pollsService.create(createPollDto);
    }
    @Patch(':id/close')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    closePoll(
      @Param('id') id: string,
    ) {
    
      return this.pollsService.closePoll(
        Number(id),
      );
    }

    @Delete(':id')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    remove(
      @Param('id') id: string,
    ) {

  return this.pollsService.remove(
    Number(id),
  );
}

    @Get(':id')
      findOne(
        @Param('id') id: string,
      ) {

        return this.pollsService.findOne(
          Number(id),
        );
      }

      @Patch(':id/toggle-status')
      @UseGuards(JwtAuthGuard, RolesGuard)
      @Roles('admin')
      toggleStatus(
        @Param('id') id: string,
      ) {

        return this.pollsService.toggleStatus(
          Number(id),
        );
      }

  }