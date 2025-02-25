import { useSignalEffect } from "@preact/signals-react";
import { EnergyMainBar } from "./Energy/EnergyMainBar";
import { InventoryPanel } from "./Inventory/InventoryPanel";
import { startLoop } from "../Loop/gameLoop";
import { ToggleButton } from "./GameLoop/ToggleButton";
import { SkillsHeader } from "./Skill/SkillsHeader";
import { TaskList } from "./Task/TaskList";
import { TaskQueue } from "./Task/TaskQueue";
import { gameState } from "../gameState";
// import { Test } from "./Test";

const Game = () => {
  useSignalEffect(() => {
    if (gameState.gameLoop.running.value) {
      startLoop();
    }
  });
  return (
    <div className="flex flex-col gap-4">
      <EnergyMainBar />
      <SkillsHeader />
      <div>Game</div>
      <div className="flex flex-row gap-12">
        <TaskList />
        <InventoryPanel />
        <TaskQueue />
      </div>
      <ToggleButton
        pauseComponent={
          <div className="bg-green-800 p-2 rounded-md">Pause</div>
        }
        playComponent={<div className="bg-red-800 p-2 rounded-md">Play</div>}
      />
      {/* <Test /> */}
    </div>
  );
};

export default Game;
