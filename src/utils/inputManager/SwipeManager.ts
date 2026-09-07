import { $off, $on } from "../helpers";
import { EDirections, EVENT_TYPE } from "../constants";
import type { Direction, DirectionCallback } from "../../interfaces";

const MIN_SWIPE_DISTANCE = 30;

class SwipeManager {
  private startX = 0;

  private startY = 0;

  private direction: Direction | null = null;

  private isActive = false;

  private callback: DirectionCallback | null = null;

  constructor(callback?: DirectionCallback) {
    this.callback = callback ?? null;

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchMove = this.handleTouchMove.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
  }

  get currentDirection(): Direction | null {
    return this.direction;
  }

  mount() {
    $on(document, EVENT_TYPE.MOUSE_DOWN, this.handleMouseDown);
    $on(document, EVENT_TYPE.MOUSE_MOVE, this.handleMouseMove);
    $on(document, EVENT_TYPE.MOUSE_UP, this.handleMouseUp);

    $on(document, EVENT_TYPE.TOUCH_START, this.handleTouchStart, {
      passive: true,
    });

    $on(document, EVENT_TYPE.TOUCH_MOVE, this.handleTouchMove, {
      passive: true,
    });

    $on(document, EVENT_TYPE.TOUCH_END, this.handleTouchEnd, {
      passive: true,
    });
  }

  unmount() {
    $off(document, EVENT_TYPE.MOUSE_DOWN, this.handleMouseDown);
    $off(document, EVENT_TYPE.MOUSE_MOVE, this.handleMouseMove);
    $off(document, EVENT_TYPE.MOUSE_UP, this.handleMouseUp);

    $off(document, EVENT_TYPE.TOUCH_START, this.handleTouchStart);
    $off(document, EVENT_TYPE.TOUCH_MOVE, this.handleTouchMove);
    $off(document, EVENT_TYPE.TOUCH_END, this.handleTouchEnd);

    this.reset();
  }

  private handleMouseDown(event: MouseEvent) {
    if (event.button !== 0) {
      return;
    }

    this.start(event.clientX, event.clientY);
  }

  private handleMouseMove(event: MouseEvent) {
    if (!this.isActive) {
      return;
    }

    this.updateDirection(event.clientX, event.clientY);
  }

  private handleMouseUp(event: MouseEvent) {
    if (!this.isActive) {
      return;
    }

    this.updateDirection(event.clientX, event.clientY);
    this.reset();
  }

  private handleTouchStart(event: TouchEvent) {
    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    this.start(touch.clientX, touch.clientY);
  }

  private handleTouchMove(event: TouchEvent) {
    if (!this.isActive) {
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    this.updateDirection(touch.clientX, touch.clientY);
  }

  private handleTouchEnd(event: TouchEvent) {
    if (!this.isActive) {
      return;
    }

    const touch = event.changedTouches[0];

    if (!touch) {
      return;
    }

    this.updateDirection(touch.clientX, touch.clientY);
    this.reset();
  }

  private start(x: number, y: number) {
    this.startX = x;
    this.startY = y;
    this.direction = null;
    this.isActive = true;
  }

  private updateDirection(x: number, y: number) {
    const deltaX = x - this.startX;
    const deltaY = y - this.startY;

    const distanceX = Math.abs(deltaX);
    const distanceY = Math.abs(deltaY);

    if (distanceX < MIN_SWIPE_DISTANCE && distanceY < MIN_SWIPE_DISTANCE) {
      return;
    }

    const direction = this.getDirection(deltaX, deltaY);

    // No hacemos nada si la dirección no cambió.
    if (direction === this.direction) {
      return;
    }

    this.direction = direction;

    // El punto donde cambió la dirección
    // pasa a ser el nuevo origen.
    this.startX = x;
    this.startY = y;

    this.callback?.(direction);
  }

  private getDirection(deltaX: number, deltaY: number): Direction {
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      return deltaX > 0 ? EDirections.right : EDirections.left;
    }

    return deltaY > 0 ? EDirections.down : EDirections.up;
  }

  private reset() {
    this.isActive = false;
    this.startX = 0;
    this.startY = 0;

    if (this.direction === null) {
      return;
    }

    this.direction = null;
    this.callback?.(null);
  }
}

export default SwipeManager;
