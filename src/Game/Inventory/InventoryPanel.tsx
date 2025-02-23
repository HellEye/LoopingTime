import Box from "../../Components/Box";
import { NumberDisplay } from "../../Components/Number";
import { gameState } from "../gameState";
import type { ItemStack } from "./items/item";
/**
 * Individual item display component
 */
const InventoryItem = ({ itemStack }: { itemStack: ItemStack }) => {
  if (!itemStack || !itemStack.item) {
    return null;
  }
  return (
    <div key={itemStack.item.name} className="flex flex-row gap-4 items-center">
      <span>{itemStack.item.name}</span>
      <span>({itemStack.count})</span>
      {itemStack.cooldown.value > 0 && (
        <NumberDisplay value={itemStack.cooldown} precision={1} />
      )}
      <button
        className="px-2 py-0 border-2 border-gray-500"
        onClick={() => {
          gameState.inventory.addItem(itemStack.item, 1);
        }}
      >
        +
      </button>
      <button
        className="px-2 py-0 border-2 border-gray-500"
        onClick={() => {
          gameState.inventory.removeItem(itemStack.item);
        }}
      >
        –
      </button>
    </div>
  );
};
/**
 * Entire inventory panel display
 */
export const InventoryPanel = () => {
  return (
    <Box className="w-lg">
      <div className="text-xl font-bold border-b-2 border-gray-500 p-6">
        Inventory{" "}
        <button
          className="bg-gray-700 border-2 border-gray-500"
          onClick={() => gameState.inventory.reset()}
        >
          Reset
        </button>
      </div>
      <div className="text-lg p-6 border-b-2 border-gray-500">
        <span>
          {gameState.inventory.count}/{gameState.inventory.capacity}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        {gameState.inventory.items.value.length === 0 && (
          <span className="text-gray-400">Nothing yet</span>
        )}
        {gameState.inventory.items.value.map((stack) => (
          <InventoryItem key={stack.item.name} itemStack={stack} />
        ))}
      </div>
    </Box>
  );
};
