export const TOUCH_TYPE_MOVE = 'move';
export const TOUCH_TYPE_END = 'end';
export const TOUCH_TYPE_START = 'start';

export type TouchHistoryItem = {
  time: number;
  touch: Touch;
  type: typeof TOUCH_TYPE_MOVE | typeof TOUCH_TYPE_START | typeof TOUCH_TYPE_END;
};

export type TouchHistory = TouchHistoryItem[];

export type Touches = Map<number, TouchHistory>;

export type UpdateEventLinstener = (e: TouchEvent, touches: Touches, changedTouches: Touches) => any;

export default class TouchEventManager {

  touches: Touches = new Map();

  private updateEventLinsteners: UpdateEventLinstener[] = [];

  readonly handleTouchEvent = (e: TouchEvent) => {
    switch (e.type) {
      case 'touchstart':
        this.handleTouchStart(e);
        break;
      case 'touchmove':
        this.handleTouchMove(e);
        break;
      case 'touchend':
        this.handleTouchEnd(e);
        break;
    }
  }

  /**
   * @function
   * 处理 TouchStart 事件
   */
  readonly handleTouchStart = (e: TouchEvent) => {
    const changedTouches: Touches = new Map();
    if (e.changedTouches && e.changedTouches.length > 0) {
      Array.prototype.forEach.call(e.changedTouches, (changedTouch: Touch) => {
        this.touches.set(changedTouch.identifier, [{time: Date.now(), touch: changedTouch, type: TOUCH_TYPE_START}]);
        changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
      });
    }
    this.emitUpdateEvent(e, changedTouches);
  }

  /**
   * @function
   * 处理 TouchMove 事件
   */
  readonly handleTouchMove = (e: TouchEvent) => {
    const changedTouches: Touches = new Map();
    if (e.changedTouches && e.changedTouches.length > 0) {
      Array.prototype.forEach.call(e.changedTouches, (changedTouch: Touch) => {
        this.touches.get(changedTouch.identifier).push({time: Date.now(), touch: changedTouch, type: TOUCH_TYPE_MOVE});
        changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
      });
    }
    this.emitUpdateEvent(e, changedTouches);
  }

  /**
   * @function
   * 处理 TouchEnd 事件
   */
  readonly handleTouchEnd = (e: TouchEvent) => {
    const changedTouches: Touches = new Map();
    if (e.changedTouches && e.changedTouches.length > 0) {
      Array.prototype.forEach.call(e.changedTouches, (changedTouch: Touch) => {
        this.touches.get(changedTouch.identifier).push({time: Date.now(), touch: changedTouch, type: TOUCH_TYPE_END});
        changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
        this.touches.delete(changedTouch.identifier);
      });
    }
    this.emitUpdateEvent(e, changedTouches);
  }

  readonly addUpdateEventListener = (handler: UpdateEventLinstener) => {
    this.updateEventLinsteners.push(handler);
  }

  readonly removeUpdateEventListener = (handler: UpdateEventLinstener) => {
    this.updateEventLinsteners.splice(this.updateEventLinsteners.indexOf(handler), 1);
  }

  readonly getNextUpdateEvent = () => new Promise<{ event: TouchEvent; touches: Touches; changedTouches: Touches }>(
    (resolve) => {
      const listener: UpdateEventLinstener = (e, touches, changedTouches) => {
        const res = { event, touches, changedTouches };
        resolve(res as any);
        this.removeUpdateEventListener(listener);
      };
      this.addUpdateEventListener(listener);
    })

  private readonly emitUpdateEvent = (e: TouchEvent, changedTouches: Touches) => {
    this.updateEventLinsteners.forEach((listener) => {
      listener(e, this.touches, changedTouches);
    });
  }
}
