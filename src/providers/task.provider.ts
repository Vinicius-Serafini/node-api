import TaskEntity from "@/entity/task.entity.js";
import IDatabase from "@shared/interfaces/index.js";
import { NewTask, Task } from "@shared/types/index.js";

class TaskProvider {
  static TABLE = "tasks";

  private db: IDatabase;

  constructor(database: IDatabase) {
    this.db = database;
  }

  async getTasks(): Promise<Array<Task>> {
    return (await this.db.get<Task>(TaskProvider.TABLE)).map(TaskEntity.serialize);
  }

  async getTaskById(id: number): Promise<Task | null> {
    const task = await this.db.findById(TaskProvider.TABLE, id);

    if (!task) {
      return null;
    }

    return TaskEntity.serialize(task);
  }

  async createTask(newTask: NewTask): Promise<Task> {
    return TaskEntity.serialize(await this.db.create<Task, NewTask>(TaskProvider.TABLE, newTask));
  }

  async updateTask(id: number, task: Partial<NewTask>): Promise<Task> {
    return TaskEntity.serialize(await this.db.update<Task>(TaskProvider.TABLE, id, task));
  }

  async deleteTask(id: number) {
    return await this.db.delete(TaskProvider.TABLE, id);
  }
}

export default TaskProvider