import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Category {
  id: string;
  name: string;
  color?: string;
}

@Injectable()
export class CategoriesService {
  private readonly filePath = path.resolve(process.cwd(), 'src/data/categories.json');

  constructor() {
    this.ensureFileExists();
  }

  private ensureFileExists() {
    const dir = path.dirname(this.filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
    }
  }

  private readData(): Category[] {
    this.ensureFileExists();
    const data = fs.readFileSync(this.filePath, 'utf-8');
    return JSON.parse(data || '[]');
  }

  private writeData(data: Category[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  findAll(): Category[] {
    return this.readData();
  }

  findOne(id: string): Category {
    const categories = this.readData();
    const category = categories.find((c) => c.id === id);
    if (!category) throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    return category;
  }

  create(categoryData: Omit<Category, 'id'>): Category {
    const categories = this.readData();
    const newCategory: Category = {
      id: Date.now().toString(),
      ...categoryData,
    };
    categories.push(newCategory);
    this.writeData(categories);
    return newCategory;
  }

  update(id: string, updateData: Partial<Category>): Category {
    const categories = this.readData();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);

    categories[index] = {
      id,
      name: updateData.name ?? categories[index].name,
      color: updateData.color ?? categories[index].color,
    };

    this.writeData(categories);
    return categories[index];
  }

  patch(id: string, patchData: Partial<Category>): Category {
    const categories = this.readData();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);

    categories[index] = {
      ...categories[index],
      ...patchData,
    };

    this.writeData(categories);
    return categories[index];
  }

  remove(id: string): void {
    const categories = this.readData();
    const filteredCategories = categories.filter((c) => c.id !== id);
    if (categories.length === filteredCategories.length) {
      throw new NotFoundException(`Categoria com ID ${id} não encontrada.`);
    }
    this.writeData(filteredCategories);
  }
}