export type Task = {
  id: number;
  title: string;
  description: string;
  done: boolean;
  dueDate?: string;
}

export type NewTask = Omit<Task, "id">
