import { Touches } from './TouchEventManager';
export declare function isSingleFinger(touches: Touches): boolean;
export declare function isTwoFingers(touches: Touches): boolean;
export declare function isFingers(touches: Touches): boolean;
export declare function getFirstFinger(touches: Touches): {
    time: number;
    touch: Touch;
}[];
export declare function getMoveDistance(changedTouches: Touches): {
    moveX: number;
    moveY: number;
};
export declare function getTouchesCenter(touches: Touch[]): {
    x: number;
    y: number;
};
export declare function getDistanceBetweenTouches(touches: Touch[]): {
    distance: number;
    distanceX: number;
    distanceY: number;
};
export declare function getTouches(touches: Touches, timeIndex?: number): Touch[];
export declare function getScalingDistance(touches: Touches): number;
