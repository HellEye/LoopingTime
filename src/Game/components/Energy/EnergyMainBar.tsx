import { NumberDisplay } from "../../../Components/Number";
import { ProgressBar } from "../../../Components/ProgressBar";
import { Time } from "../../../Components/Time";
import { gameState } from "../../gameState";

export const EnergyMainBar = () => {
  return (
    <ProgressBar
      value={gameState.energy.energy}
      maxValue={gameState.energy.energyMax}
      barClassName="h-12"
      fillClassName="bg-green-700"
      label={
        <div className="flex flex-row gap-4 w-full h-full items-center justify-center font-bold text-lg">
          <div>
            <Time value={gameState.gameLoop.loopTime} />
          </div>
          <div>
            Energy: <NumberDisplay value={gameState.energy.energy} /> /{" "}
            <NumberDisplay value={gameState.energy.energyMax} />
          </div>
          <div className="text-gray-400">
            +({gameState.energy.totalEnergyIncreaseAfterLoop})
          </div>
          <div>
            Decay: <NumberDisplay value={gameState.energy.totalDecay} />
          </div>
          <div>
            Debug{" "}
            <button
              className="border-2 border-gray-500"
              onClick={() => gameState.energy.reset()}
            >
              reset
            </button>
          </div>
        </div>
      }
      backgroundClassName="bg-gray-800"
    />
  );
};
