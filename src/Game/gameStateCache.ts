import type { ItemId } from "./Data/items";
import type { GameData, GameState } from "./gameState";
import type { Task } from "./Task/task";

export const initCache = (_gameState: GameState, gameData: GameData) => {
  const gatherItemTaskMap = new Map<ItemId, Task[]>(
    Object.keys(gameData.items).map((itemId) => {
      return [
        itemId as ItemId,
        Object.values(gameData.tasks).filter(
          (task) =>
            task.gives && task.gives.find((give) => give.item === itemId)
        ),
      ];
    })
  );

  return {
    gatherItemTaskMap,
  } as const;
};

export type GameStateCache = ReturnType<typeof initCache>;
