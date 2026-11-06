import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { TasksService, CreateTaskDto } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateTaskDto) {
    return this.tasksService.create(body);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() body: { title: string; description?: string; completed: boolean },
  ) {
    return this.tasksService.update(id, body);
  }

  @Patch(':id')
  patch(
    @Param('id') id: string,
    @Body() body: Partial<{ title: string; description?: string; completed: boolean }>,
  ) {
    return this.tasksService.patch(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.tasksService.remove(id);
    return { message: `Task ${id} removida com sucesso.` };
  }
}