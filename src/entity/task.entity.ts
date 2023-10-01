import { NewTask, Task } from "@shared/types/index.js";

export default class TaskEntity {
  id: number;
  title: string;
  description: string;
  done: boolean;
  dueDate?: Date;

  constructor({ id, title, description, done, dueDate }: Task) {
    this.title = title;
    this.description = description;
    this.done = done;
    this.id = id;

    if (dueDate) {
      this.dueDate = new Date(dueDate);
    }
  }

  static validate(task: Partial<Task | NewTask>): boolean {
    if (typeof task.title !== 'string' || task.title.length === 0) {
      throw new Error("Title is required");
    }

    if (typeof task.description !== "string" || task.description.length === 0) {
      throw new Error("Description is required");
    }

    if (typeof task.done !== "boolean") {
      throw new Error("Done is required");
    }

    return true;
  }

  serialize(): Task {
    const task: Task = {
      id: this.id,
      title: this.title,
      description: this.description,
      done: this.done
    }

    if (this.dueDate) {
      task.dueDate = this.dueDate.toISOString();
    }

    return task;
  }
}