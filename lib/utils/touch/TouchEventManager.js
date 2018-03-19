"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TouchEventManager {
    constructor() {
        this.touches = new Map();
        this.updateEventLinsteners = [];
        this.handleTouchEvent = (e) => {
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
        };
        /**
         * @function
         * 处理 TouchStart 事件
         */
        this.handleTouchStart = (e) => {
            const changedTouches = new Map();
            if (e.changedTouches && e.changedTouches.length > 0) {
                Array.prototype.forEach.call(e.changedTouches, (changedTouch) => {
                    this.touches.set(changedTouch.identifier, [{ time: Date.now(), touch: changedTouch }]);
                    changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
                });
            }
            this.emitUpdateEvent(e, changedTouches);
        };
        /**
         * @function
         * 处理 TouchMove 事件
         */
        this.handleTouchMove = (e) => {
            const changedTouches = new Map();
            if (e.changedTouches && e.changedTouches.length > 0) {
                Array.prototype.forEach.call(e.changedTouches, (changedTouch) => {
                    this.touches.get(changedTouch.identifier).push({ time: Date.now(), touch: changedTouch });
                    changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
                });
            }
            this.emitUpdateEvent(e, changedTouches);
        };
        /**
         * @function
         * 处理 TouchEnd 事件
         */
        this.handleTouchEnd = (e) => {
            const changedTouches = new Map();
            if (e.changedTouches && e.changedTouches.length > 0) {
                Array.prototype.forEach.call(e.changedTouches, (changedTouch) => {
                    this.touches.get(changedTouch.identifier).push({ time: Date.now(), touch: changedTouch });
                    changedTouches.set(changedTouch.identifier, this.touches.get(changedTouch.identifier));
                    this.touches.delete(changedTouch.identifier);
                });
            }
            this.emitUpdateEvent(e, changedTouches);
        };
        this.addUpdateEventListener = (handler) => {
            this.updateEventLinsteners.push(handler);
        };
        this.removeUpdateEventListener = (handler) => {
            this.updateEventLinsteners.splice(this.updateEventLinsteners.indexOf(handler), 1);
        };
        this.getNextUpdateEvent = () => new Promise((resolve) => {
            const listener = (e, touches, changedTouches) => {
                const res = { event, touches, changedTouches };
                resolve(res);
                this.removeUpdateEventListener(listener);
            };
            this.addUpdateEventListener(listener);
        });
        this.emitUpdateEvent = (e, changedTouches) => {
            this.updateEventLinsteners.forEach((listener) => {
                listener(e, this.touches, changedTouches);
            });
        };
    }
}
exports.default = TouchEventManager;
//# sourceMappingURL=TouchEventManager.js.map