import { computed } from "@preact/signals-react";
import { ProgressBar } from "../../../Components/ProgressBar";
import { gameState } from "../../gameState";
import type { Task } from "../../Task/task";
import { tasks } from "../../Data/tasks";
import Box from "../../../Components/Box";

const availableTasks = computed<Task[]>(() => {
  return Object.values(tasks).filter((task) => task.available.value);
});

const TaskItem = ({ task }: { task: Task }) => {
  return (
    <div className="bg-gray-700 border-y-2 border-gray-500 w-full items-center radius-md flex flex-col">
      <div className="text-white text-md font-bold p-2 flex flex-row w-full">
        <span>{task.name}</span>
        <div className="ml-auto" />
        <div className="flex flex-row">
          <button
            className="bg-gray-500 p-1 rounded-md active:bg-gray-600 hover:bg-gray-600"
            onClick={() => {
              gameState.taskQueue.addTask(task);
            }}
          >
            Add
          </button>
        </div>
      </div>
      <ProgressBar
        barClassName="h-2"
        backgroundClassName="bg-gray-800"
        value={task.progress.value.currentXp}
        maxValue={task.xpCost}
        fillClassName="bg-green-500"
      />
    </div>
  );
};

export const TaskList = () => {
  return (
    <Box className="w-lg">
      <span className="text-white text-lg font-bold p-2">Tasks</span>
      <div className="flex flex-col gap-2 w-full items-start">
        {availableTasks.value.map((task) => (
          <TaskItem key={task.name} task={task} />
        ))}
      </div>
    </Box>
  );
};
