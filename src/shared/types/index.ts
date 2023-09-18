export type Task = {
  id: number;
  title: string;
  description: string;
  done: boolean;
}

export type NewTask = Omit<Task, "id">
