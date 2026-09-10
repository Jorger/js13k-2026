import { $off, $on } from "../helpers";
import { DirectionCallback, type Direction } from "../../interfaces";
import { EVENT_TYPE, KEY_DIRECTION } from "../constants";

class KeyManager {
  private direction: Direction | null = null;

  private activeKey: string | null = null;

  private callback: DirectionCallback | null = null;

  constructor(callback?: DirectionCallback) {
    this.callback = callback ?? null;

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }

  get currentDirection(): Direction | null {
    return this.direction;
  }

  mount() {
    $on(document, EVENT_TYPE.KEY_DOWN, this.handleKeyDown);
    $on(document, EVENT_TYPE.KEY_UP, this.handleKeyUp);
  }

  unmount() {
    $off(document, EVENT_TYPE.KEY_DOWN, this.handleKeyDown);
    $off(document, EVENT_TYPE.KEY_UP, this.handleKeyUp);

    this.direction = null;
    this.activeKey = null;
  }

  private handleKeyDown(event: KeyboardEvent) {
    const direction = KEY_DIRECTION.get(event.code);

    if (!direction || event.repeat) {
      return;
    }

    this.direction = direction;
    this.activeKey = event.code;

    this.callback?.(this.direction);
  }

  private handleKeyUp(event: KeyboardEvent) {
    if (event.code !== this.activeKey) {
      return;
    }

    this.direction = null;
    this.activeKey = null;

    this.callback?.(null);
  }
}

export default KeyManager;
