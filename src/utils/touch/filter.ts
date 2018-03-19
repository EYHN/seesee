import { Touches } from './TouchEventManager';

export function isSingleFinger(touches: Touches) {
  return touches.size === 1;
}

export function isTwoFingers(touches: Touches) {
  return touches.size === 2;
}

export function isFingers(touches: Touches) {
  return touches.size > 1;
}

export function getFirstFinger(touches: Touches) {
  return touches.values().next().value;
}

export function getMoveDistance(changedTouches: Touches) {
  let moveX = 0, moveY = 0;
  for (const touchHistory of changedTouches.values()) {
    if (touchHistory.length < 2) { continue; }
    moveX += touchHistory[touchHistory.length - 1].touch.clientX - touchHistory[touchHistory.length - 2].touch.clientX;
    moveY += touchHistory[touchHistory.length - 1].touch.clientY - touchHistory[touchHistory.length - 2].touch.clientY;
  }
  moveX /= changedTouches.size;
  moveY /= changedTouches.size;
  return { moveX, moveY };
}

export function getTouchesCenter(touches: Touch[]) {
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

export function getDistanceBetweenTouches(touches: Touch[]) {
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

export function getTouches(touches: Touches, timeIndex: number = -1) {
  const res: Touch[] = [];
  for (const touch of touches.values()) {
    const index = timeIndex < 0 ? touch.length + timeIndex : timeIndex;
    res.push(touch[index].touch);
  }
  return res;
}

export function getScalingDistance(touches: Touches) {
  const oldTouches: Touch[] = [];
  const newTouches: Touch[] = [];
  for (const touch of touches.values()) {
    if (touch.length < 2) { continue; }
    oldTouches.push(touch[touch.length - 2].touch);
    newTouches.push(touch[touch.length - 1].touch);
  }
  const oldDistance = getDistanceBetweenTouches(oldTouches);
  const newDistance = getDistanceBetweenTouches(newTouches);
  return newDistance.distance - oldDistance.distance;
}
