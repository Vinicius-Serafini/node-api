import { NewTask, Task } from "@shared/types/index.js";

export default class TaskEntity {
  static validate(task: Partial<NewTask>): { sucess: boolean, errors?: Map<string, string> } {
    const errors = new Map();

    if (typeof task.title !== 'string' || task.title.length === 0) {
      errors.set("title", "Title is required");
    }

    if (typeof task.description !== "string" || task.description.length === 0) {
      errors.set("description", "Description is required");
    }

    if (typeof task.done !== "boolean") {
      errors.set("done", "Done is required");
    }

    if (errors.size > 0) {
      return { sucess: false, errors };
    }

    return { sucess: true };
  }

  static create(task: Partial<NewTask>): NewTask {
    return {
      title: task.title,
      description: task.description,
      done: false
    }
  }

  static serialize(json: any): Task {
    return {
      id: json.id,
      title: json.title,
      description: json.description,
      done: Boolean(json.done)
    }
  }
}