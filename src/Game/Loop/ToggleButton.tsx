import { gameState } from "../gameState";

type Props = {
  pauseComponent: React.ReactNode;
  playComponent: React.ReactNode;
};
export const ToggleButton = ({ pauseComponent, playComponent }: Props) => {
  return (
    <button
      onClick={() => {
        gameState.gameLoop.toggle();
      }}
    >
      {gameState.gameLoop.running.value ? pauseComponent : playComponent}
    </button>
  );
};
