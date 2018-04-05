import { Touches, TouchHistory, TOUCH_TYPE_END } from './TouchEventManager';

export function isSingleFinger(touches: Touches) {
  return touches.size === 1;
}

export function isTwoFingers(touches: Touches) {
  return touches.size === 2;
}

export function isMultipleFingers(touches: Touches) {
  return touches.size > 1;
}

export function isEnded(touch: TouchHistory) {
  return touch[touch.length - 1].type === TOUCH_TYPE_END;
}

export function isSingleTap(touches: Touches, changeTouches: Touches) {
  if (touches.size === 0 && changeTouches.size === 1) {
    const finger = getFirstFinger(changeTouches);
    if (isEnded(finger)) {
      return getTotalDistanceMoved(changeTouches) < 5;
    }
  }
  return false;
}

export function getSlidingAngle(touch: TouchHistory) {
  const touchStart = touch[0].touch;
  const touchEnd = touch[5 > touch.length - 1 ? touch.length - 1 : 5].touch;

  const x = touchStart.clientX - touchEnd.clientX;
  const y = touchStart.clientY - touchEnd.clientY;
  const angle = Math.atan2(y, x) * 180 / Math.PI;
  return ((touchStart.clientY < touchEnd.clientY ? 360 + angle : angle) + 270) % 360;
}

export function isHorizontal(touch: TouchHistory) {
  const angle = getSlidingAngle(touch);
  return (angle > 60 && angle < 120) || (angle > 240 && angle < 300);
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

/**
 * 获取所有手指当前位置距离起点距离的平均值
 */
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

/**
 * 获取所有手指总共移动距离的平均值
 */
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
