import TaskEntity from "@/entity/task.entity.js";
import TaskProvider from "@providers/task.provider.js";
import { NewTask } from "@shared/types/index.js";
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

  async getTasks(_: Request, res: Response) {
    const tasks = await this.taskProvider.getTasks();

    return res.json(tasks);
  }

  async getTaskById(req: Request, res: Response) {
    const { id } = req.params;

    const task = await this.taskProvider.getTaskById(Number(id));

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    return res.json(task);
  }

  async createTask(req: Request, res: Response) {
    const taskBody: NewTask = TaskEntity.create(req.body);

    const { sucess, errors } = TaskEntity.validate(taskBody);

    if (!sucess) {
      return res.status(400).json(Object.fromEntries(errors.entries()));
    }

    const task = await this.taskProvider.createTask(taskBody);

    return res.json(task);
  }

  async updateTask(req: Request, res: Response) {
    const { id } = req.params;

    const task = TaskEntity.create(req.body);

    const { sucess, errors } = TaskEntity.validate(task);

    if (!sucess) {
      return res.status(400).json(Object.fromEntries(errors.entries()));
    }

    if (!id || Number(id) < 1) {
      return res.status(404).json({ message: "Task not found" });
    }

    try {
      const udatedTask = await this.taskProvider.updateTask(Number(id), task);
      return res.json(udatedTask);

    } catch (error) {
      return res.status(404).json({ message: "Task not found" });
    }
  }

  async deleteTask(req: Request, res: Response) {
    const { id } = req.params;

    if (!id || Number(id) < 1) {
      return res.status(404).json({ message: "Task not found" });
    }

    try {
      await this.taskProvider.deleteTask(Number(id));

      return res.json({ message: "Task deleted" });
    } catch (error) {
      return res.status(404).json({ message: "Task not found" });
    }
  }
}

export default TaskController;