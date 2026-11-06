import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.categoriesService.findOne(id);
  }

  @Post()
  create(@Body() body: { name: string; color?: string }) {
    return this.categoriesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: { name: string; color?: string }) {
    return this.categoriesService.update(id, body);
  }

  @Patch(':id')
  patch(@Param('id') id: string, @Body() body: Partial<{ name: string; color?: string }>) {
    return this.categoriesService.patch(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    this.categoriesService.remove(id);
    return { message: `Categoria ${id} removida com sucesso.` };
  }
}