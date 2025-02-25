import type { TaskQueueSaveData } from "../Task/TaskQueue/taskQueue";
import { db } from "./db";

export const saveTaskQueue = async (data: TaskQueueSaveData) => {
  await db.taskQueue.put({
    id: "taskQueue",
    data,
  });
};

export const loadTaskQueue = async (): Promise<
  TaskQueueSaveData | undefined
> => {
  const data = await db.taskQueue.get("taskQueue");
  return data?.data;
};
