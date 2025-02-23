import Box from "../../../Components/Box";
import { gameState } from "../../gameState";

export const TaskQueue = () => {
  return (
    <Box className="w-lg">
      <div className="px-4 py-2">
        <span className="text-lg font-bold">Queue</span>
      </div>
      <div>
        {gameState.taskQueue.tasks.value.map((task, i) => {
          return (
            <div key={`${task.name}-${i}`}>
              <span>{task.name}</span>
              <button
                className="bg-gray-500 p-1 rounded-md active:bg-gray-600 hover:bg-gray-600"
                onClick={() => {
                  gameState.taskQueue.removeTask(i);
                }}
              >
                X
              </button>
            </div>
          );
        })}
      </div>
    </Box>
  );
};
