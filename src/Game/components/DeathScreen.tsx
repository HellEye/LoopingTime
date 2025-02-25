import type { ReactNode } from "react";
import { gameState, prestigeGame } from "../gameState";

const DeathScreen = ({ children }: { children: ReactNode }) => {
  return (
    <div className="relative w-full h-dvh">
      {children}
      {!gameState.gameLoop.alive.value && (
        <div className="absolute z-[1000] inset-0 bg-gray-800 w-full h-full items-center px-20 py-20">
          <div className="flex flex-col gap-20">
            <div className="flex flex-col items-center gap-4">
              <span className="text-white text-4xl font-bold">
                System malfunction
              </span>
              <span className="text-xl">Uploading data to server...</span>
              <span className="text-xl">Skill increases here or something</span>
            </div>

            <div className="flex flex-col gap-4 w-full items-center justify-center">
              <button
                className="bg-green-700 text-white px-12 py-8 rounded-md text-4xl"
                onClick={() => {
                  prestigeGame();
                }}
              >
                Restart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeathScreen;
