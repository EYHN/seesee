
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change In value
 */
export function easeInOutQuad(t: number, b: number, c: number) {
  t /= 1 / 2;
  if (t < 1) { return c / 2 * t * t + b; }
  return -c / 2 * ((--t) * (t - 2) - 1) + b;
}

function lerp(v0: number, v1: number, t: number) {
  return v0 * (1 - t) + v1 * t;
}
