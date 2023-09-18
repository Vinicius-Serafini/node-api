import express from "express";
import { SQLite } from "@database/sqlite.js";
import TaskController from "./controllers/task.controller.js";
import TaskProvider from "@providers/task.provider.js";
import path from "node:path";
import url from "node:url";

async function createServer() {
  const app = express();
  app.use(express.json());

  const rootDir = path.dirname(path.resolve()).split(path.sep).slice(0, -1).join(path.sep);

  const database = await SQLite.initDatabase(rootDir + '/tmp/db/');

  const taskProvider = new TaskProvider(database);
  const taskController = new TaskController(taskProvider);

  app.use(taskController.getRoutes());
  app.get('tasks', taskController.getTasks);

  app.get('/', (req: express.Request, res: express.Response) => {
    res.send('Hello World!!!');
  });

  app.listen(3000, () => {
    console.log("Server running on port 3000");
  });
}

createServer();

