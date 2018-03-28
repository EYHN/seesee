import { Touches, TouchHistory } from './TouchEventManager';

export function isSingleFinger(touches: Touches) {
  return touches.size === 1;
}

export function isTwoFingers(touches: Touches) {
  return touches.size === 2;
}

export function isMultipleFingers(touches: Touches) {
  return touches.size > 1;
}

export function getFirstFinger(touches: Touches) {
  return touches.values().next().value;
}

export function getMoveDistance(touches: Touches) {
  let x = 0, y = 0;
  for (const touchHistory of touches.values()) {
    if (touchHistory.length < 2) { continue; }
    x += touchHistory[touchHistory.length - 1].touch.clientX - touchHistory[touchHistory.length - 2].touch.clientX;
    y += touchHistory[touchHistory.length - 1].touch.clientY - touchHistory[touchHistory.length - 2].touch.clientY;
  }
  x /= touches.size;
  y /= touches.size;
  return { x, y, length: Math.sqrt(x * x + y * y) };
}

export function getDistanceFromStart(touches: Touches) {
  let x = 0, y = 0;
  for (const touchHistory of touches.values()) {
    if (touchHistory.length < 2) { continue; }
    x += touchHistory[touchHistory.length - 1].touch.clientX - touchHistory[0].touch.clientX;
    y += touchHistory[touchHistory.length - 1].touch.clientY - touchHistory[0].touch.clientY;
  }
  x /= touches.size;
  y /= touches.size;
  return { x, y, length: Math.sqrt(x * x + y * y) };
}

export function getTotalDistanceMoved(touches: Touches) {
  let length = 0;
  for (const touchHistory of touches.values()) {
    if (touchHistory.length < 2) { continue; }
    for (let index = 1; index < touchHistory.length; index++) {
      const x = touchHistory[index].touch.clientX - touchHistory[index - 1].touch.clientX;
      const y = touchHistory[index].touch.clientY - touchHistory[index - 1].touch.clientY;
      length += Math.sqrt(x * x + y * y);
    }
  }
  return length;
}

export function getCurrentTime(touch: TouchHistory) {
  let currentTime = 0;
  for (let index = 1; index < touch.length; index++) {
    currentTime += touch[index - 1].time - touch[index].time;
  }
  currentTime += Date.now() - touch[touch.length - 1].time;
  return currentTime;
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

export function getScaling(touches: Touches) {
  const oldTouches: Touch[] = [];
  const newTouches: Touch[] = [];
  for (const touch of touches.values()) {
    if (touch.length < 2) { continue; }
    oldTouches.push(touch[touch.length - 2].touch);
    newTouches.push(touch[touch.length - 1].touch);
  }
  const oldDistance = getDistanceBetweenTouches(oldTouches);
  const newDistance = getDistanceBetweenTouches(newTouches);
  return (newDistance.distance / oldDistance.distance) || 1;
}
