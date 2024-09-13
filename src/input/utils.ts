import { gamepadButtons } from './gamepad';
import { keys } from './keyboard';

export const resetInputs = (): void => {
  keys.clear();
  gamepadButtons.clear();
};

export const isAnyInputDown = (): boolean => {
  return keys.isAnyDown() || gamepadButtons.isAnyDown();
};
