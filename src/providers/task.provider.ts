import TaskEntity from "@/entity/task.entity.js";
import IDatabase from "@shared/interfaces/index.js";
import { NewTask, Task } from "@shared/types/index.js";

class TaskProvider {
  static TABLE = "tasks";

  private db: IDatabase;

  constructor(database: IDatabase) {
    this.db = database;
  }

  async getTasks(): Promise<Array<TaskEntity>> {
    return (await this.db.get<Task>(TaskProvider.TABLE)).map(task => new TaskEntity(task));
  }

  async getTaskById(id: number): Promise<TaskEntity | null> {
    const task = await this.db.findById<Task>(TaskProvider.TABLE, id);

    if (!task) {
      return null;
    }

    return new TaskEntity(task);
  }

  async createTask(newTask: NewTask): Promise<TaskEntity> {
    TaskEntity.validate(newTask);

    if (newTask.dueDate && new Date(newTask.dueDate) < new Date()) {
      throw new Error("Due date must be in the future");
    }

    const createdTask = await this.db.create<Task, NewTask>(TaskProvider.TABLE, newTask);

    return new TaskEntity(createdTask);
  }

  async updateTask(id: number, task: Omit<Task, "id">): Promise<TaskEntity> {
    TaskEntity.validate(task);

    const updatedTask = await this.db.update<Task>(TaskProvider.TABLE, id, task);

    return new TaskEntity(updatedTask);
  }

  async deleteTask(id: number) {
    return await this.db.delete(TaskProvider.TABLE, id);
  }
}

export default TaskProvider