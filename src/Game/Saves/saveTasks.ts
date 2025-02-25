import type { Task, TaskSaveData } from "../Task/task";
import { db } from "./db";

export const saveTasks = async (tasks: Task[]) => {
  await db.tasks.put({
    id: "tasks",
    data: tasks.map((task) => task.toData()),
  });
};

export const loadTasks = async (): Promise<
  { data: TaskSaveData[] } | undefined
> => {
  const tasks = await db.tasks.get("tasks");
  return tasks;
};
