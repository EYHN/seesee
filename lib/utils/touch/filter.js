"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function isSingleFinger(touches) {
    return touches.size === 1;
}
exports.isSingleFinger = isSingleFinger;
function isTwoFingers(touches) {
    return touches.size === 2;
}
exports.isTwoFingers = isTwoFingers;
function isFingers(touches) {
    return touches.size > 1;
}
exports.isFingers = isFingers;
function getFirstFinger(touches) {
    return touches.values().next().value;
}
exports.getFirstFinger = getFirstFinger;
function getMoveDistance(changedTouches) {
    let moveX = 0, moveY = 0;
    for (const touchHistory of changedTouches.values()) {
        if (touchHistory.length < 2) {
            continue;
        }
        moveX += touchHistory[touchHistory.length - 1].touch.clientX - touchHistory[touchHistory.length - 2].touch.clientX;
        moveY += touchHistory[touchHistory.length - 1].touch.clientY - touchHistory[touchHistory.length - 2].touch.clientY;
    }
    moveX /= changedTouches.size;
    moveY /= changedTouches.size;
    return { moveX, moveY };
}
exports.getMoveDistance = getMoveDistance;
function getTouchesCenter(touches) {
    let centerX = 0;
    let centerY = 0;
    touches.forEach((touch) => {
        centerX += touch.clientX;
        centerY += touch.clientY;
    });
    centerX /= touches.length;
    centerY /= touches.length;
    return {
        x: centerX,
        y: centerY
    };
}
exports.getTouchesCenter = getTouchesCenter;
function getDistanceBetweenTouches(touches) {
    let distance = 0, distanceX = 0, distanceY = 0, i = 0;
    if (touches.length >= 2) {
        for (const touchA of touches) {
            for (const touchB of touches) {
                if (touchA !== touchB) {
                    const X = Math.abs(touchA.clientX - touchB.clientX);
                    const Y = Math.abs(touchA.clientY - touchB.clientY);
                    distanceX += X;
                    distanceY += Y;
                    distance += Math.sqrt(X * X + Y * Y);
                    i++;
                }
            }
        }
        distance /= i;
        distanceX /= i;
        distanceY /= i;
    }
    return {
        distance,
        distanceX,
        distanceY
    };
}
exports.getDistanceBetweenTouches = getDistanceBetweenTouches;
function getTouches(touches, timeIndex = -1) {
    const res = [];
    for (const touch of touches.values()) {
        const index = timeIndex < 0 ? touch.length + timeIndex : timeIndex;
        res.push(touch[index].touch);
    }
    return res;
}
exports.getTouches = getTouches;
function getScalingDistance(touches) {
    const oldTouches = [];
    const newTouches = [];
    for (const touch of touches.values()) {
        if (touch.length < 2) {
            continue;
        }
        oldTouches.push(touch[touch.length - 2].touch);
        newTouches.push(touch[touch.length - 1].touch);
    }
    const oldDistance = getDistanceBetweenTouches(oldTouches);
    const newDistance = getDistanceBetweenTouches(newTouches);
    return newDistance.distance - oldDistance.distance;
}
exports.getScalingDistance = getScalingDistance;
//# sourceMappingURL=filter.js.map