import type { GameLoop } from "../Loop/gameLoopData";
import { db } from "./db";

export const saveGameLoop = (gameLoop: GameLoop) => {
  db.gameLoop.put({
    id: "gameLoop",
    data: gameLoop.toData(),
  });
};

export const loadGameLoop = async () => {
  const gameLoop = await db.gameLoop.get("gameLoop");
  return gameLoop;
};
