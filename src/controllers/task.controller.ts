import TaskEntity from "@/entity/task.entity.js";
import TaskProvider from "@providers/task.provider.js";
import { NewTask, Task } from "@shared/types/index.js";
import { Request, Response, Router } from "express";

class TaskController {
  taskProvider: TaskProvider;
  basePath = "/tasks";

  constructor(taskProvider: TaskProvider) {
    this.taskProvider = taskProvider;

    this.createTask = this.createTask.bind(this);
    this.getTasks = this.getTasks.bind(this);
    this.getTaskById = this.getTaskById.bind(this);
    this.updateTask = this.updateTask.bind(this);
    this.deleteTask = this.deleteTask.bind(this);
  }

  getRoutes() {
    const router = Router();

    router.get(`${this.basePath}`, this.getTasks);
    router.get(`${this.basePath}/:id`, this.getTaskById);
    router.post(`${this.basePath}`, this.createTask);
    router.put(`${this.basePath}/:id`, this.updateTask);
    router.delete(`${this.basePath}/:id`, this.deleteTask);

    return router;
  }

  async getTasks(_: Request, res: Response<Array<Task>>) {
    const tasks = await this.taskProvider.getTasks();

    return res.json(tasks.map(task => task.serialize()));
  }

  async getTaskById(req: Request, res: Response<Task | { message: string }>) {
    const { id } = req.params;

    const task = await this.taskProvider.getTaskById(Number(id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task.serialize());
  }

  async createTask(req: Request<{}, Task, NewTask>, res: Response<Task>) {
    const taskBody = req.body;

    try {
      TaskEntity.validate(taskBody);
    } catch (error) {
      return res.status(400).json(error);
    }

    const task = await this.taskProvider.createTask(taskBody);

    return res.json(task.serialize()).status(201);
  }

  async updateTask(req: Request<{ id: Number }, Task, NewTask>, res: Response<Task | { message: string }>) {
    const { id } = req.params;

    const task = req.body;

    try {
      TaskEntity.validate(task);
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!id || Number(id) < 1) {
      return res.status(404).json({ message: "Task not found" });
    }

    try {
      const updatedTask = await this.taskProvider.updateTask(Number(id), task);
      return res.json(updatedTask.serialize());

    } catch (error) {
      return res.status(404).json({ message: "Task not found" });
    }
  }

  async deleteTask(req: Request<{ id: number }>, res: Response<{ message: string }>) {
    const { id } = req.params;

    if (!id || id < 1) {
      return res.status(404).json({ message: "Task not found" });
    }

    try {
      await this.taskProvider.deleteTask(id);

      return res.json().status(204);
    } catch (error) {
      return res.status(404).json({ message: "Task not found" });
    }
  }
}

export default TaskController;