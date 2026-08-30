import { Direction, DirectionCallback } from "../interfaces";
import { isTouchDevice } from "./helpers";
import KeyManager from "./keyManager";
import SwipeManager from "./SwipeManager";

class InputManager {
  private manager: KeyManager | SwipeManager;

  constructor(callback?: DirectionCallback) {
    this.manager = isTouchDevice()
      ? new SwipeManager(callback)
      : new KeyManager(callback);
  }

  get currentDirection(): Direction | null {
    return this.manager.currentDirection;
  }

  mount() {
    this.manager.mount();
  }

  unmount() {
    this.manager.unmount();
  }
}

export default InputManager;
