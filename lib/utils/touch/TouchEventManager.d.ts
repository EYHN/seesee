export declare type TouchHistoryItem = {
    time: number;
    touch: Touch;
};
export declare type TouchHistory = TouchHistoryItem[];
export declare type Touches = Map<number, TouchHistory>;
export declare type UpdateEventLinstener = (e: TouchEvent, touches: Touches, changedTouches: Touches) => any;
export default class TouchEventManager {
    touches: Touches;
    private updateEventLinsteners;
    readonly handleTouchEvent: (e: TouchEvent) => void;
    /**
     * @function
     * 处理 TouchStart 事件
     */
    readonly handleTouchStart: (e: TouchEvent) => void;
    /**
     * @function
     * 处理 TouchMove 事件
     */
    readonly handleTouchMove: (e: TouchEvent) => void;
    /**
     * @function
     * 处理 TouchEnd 事件
     */
    readonly handleTouchEnd: (e: TouchEvent) => void;
    readonly addUpdateEventListener: (handler: UpdateEventLinstener) => void;
    readonly removeUpdateEventListener: (handler: UpdateEventLinstener) => void;
    readonly getNextUpdateEvent: () => Promise<{
        event: TouchEvent;
        touches: Map<number, TouchHistoryItem[]>;
        changedTouches: Map<number, TouchHistoryItem[]>;
    }>;
    private readonly emitUpdateEvent;
}
