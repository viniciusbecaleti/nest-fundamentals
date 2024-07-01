import { Injectable, NotFoundException } from '@nestjs/common';
import { FindAllParams, TaskDto } from './tasks.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TasksService {
  private tasks: TaskDto[] = [];

  create(task: TaskDto) {
    this.tasks.push({
      ...task,
      id: randomUUID(),
    });
  }

  findAll(params: FindAllParams) {
    const tasks = this.tasks.filter((task) => {
      if (params.title && !task.title.includes(params.title)) {
        return false;
      }

      if (params.status && !task.status.includes(params.status)) {
        return false;
      }

      return true;
    });

    return tasks;
  }

  findById(id: string) {
    const task = this.tasks.find((task) => task.id === id);

    if (!task) {
      throw new NotFoundException('Task not found');
    }

    return task;
  }

  update(task: TaskDto) {
    const taskIndex = this.tasks.findIndex((t) => t.id === task.id);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    const updatedData = {
      ...this.tasks[taskIndex],
      ...task,
    };

    this.tasks[taskIndex] = updatedData;
  }

  delete(id: string) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    if (taskIndex === -1) {
      throw new NotFoundException('Task not found');
    }

    this.tasks.splice(taskIndex, 1);
  }
}
