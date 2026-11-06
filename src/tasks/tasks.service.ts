import { Injectable, NotFoundException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

export interface Task {
    id: string; 
    title: string; 
    description?: string;
    completed: boolean;
}

@Injectable()
export class TasksService {
    private readonly filePath = path.resolve(process.cwd(), 'scr/data/tasks.json');

    contructor() {
        this.ensureFileExists();  
    }

    private ensureFileExists() {
        const dir = path.dirname(this.filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true});
        }
        if (!fs.existsSync(this.filePath)) {
            fs.writeFileSync(this.filePath, JSON.stringify([]), 'utf-8');
        }
    }

    private readData(): Task[] {
        this.ensureFileExists();
        const data = fs.readFileSync(this.filePath, 'utf-8');
        return JSON.parse(data || '[]');
    }

    private writeData(data: Task[]) {
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2), 'utf-8');
    }

    findAll(): Task[] {
        return this.readData();
    }

    findOne(id: string): Task {
        const tasks = this.readData();
        const task = tasks.find((t) => t.id == id);
        if (!task) throw new NotFoundException('Task com ID ${id} não encontrada.');
        return task;
    }

    create(taskData: Omit<Task, 'id'>): Task {
        const tasks = this.readData();
        const newTask: Task = {
                id: Date.now().toString(),
                ...taskData,
                completed: taskData.completed ?? false,
        };
        tasks.push(newTask);
        this.writeData(tasks);
        return newTask;
    }

    update(id: string, updateData: Partial<Task>): Task {
        const tasks = this.readData();
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new NotFoundException('Task com ID ${id} não encontrada.');

        // PUT substitui/ redefine os campos
        tasks[index] = {
            id,
            title: updateData.title ?? tasks[index].title,
            description: updateData.description ?? tasks[index].description,
            completed: updateData.completed ?? tasks[index].completed,
        };

        this.writeData(tasks);
        return tasks[index];
    }

    patch(id: string, patchData: Partial<Task>): Task {
        const tasks = this.readData();
        const index = tasks.findIndex((t) => t.id === id);
        if (index === -1) throw new NotFoundException('Task com ID ${id} não encontrada.');

        // PATCH atualiza apenas os campos fornecidos
        tasks[index] = {
            ...tasks[index],
            ...patchData,
        };

        this.writeData(tasks);
        return tasks[index];
    }

    remove(id: string): void {
        const tasks = this.readData();
        const filteredTasks = tasks.filter((t) => t.id !== id);
        if (tasks.length === filteredTasks.length) {
            throw new NotFoundException('Task com ID ${id} não encontrada.');
        }
        this.writeData(filteredTasks);
    }
}