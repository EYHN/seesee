/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeInQuad(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  return c * (t /= 1) * t + b;
}

/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeOutQuad(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  return -c * (t /= 1) * (t - 2) + b;
}

/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeInOutQuad(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  t /= 1 / 2;
  if ((t) < 1) { return c / 2 * t * t + b; }
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeInCubic(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  return c * (t /= 1) * t * t + b;
}

/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeOutCubic(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  return c * ((t = t / 1 - 1) * t * t + 1) + b;
}

/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
export function easeInOutCubic(t: number, b: number, c: number) {
  if (b === c) { return b; }
  c -= b;
  t /= 1 / 2;
  if (t < 1) { return c / 2 * t * t * t + b; }
  return c / 2 * ((t -= 2) * t * t + 2) + b;
}

export function lerp(t: number, v0: number, v1: number) {
  if (v0 === v1) { return v1; }
  return v0 * (1 - t) + v1 * t;
}
