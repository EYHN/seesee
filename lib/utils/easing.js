"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeInQuad(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    return c * (t /= 1) * t + b;
}
exports.easeInQuad = easeInQuad;
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeOutQuad(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    return -c * (t /= 1) * (t - 2) + b;
}
exports.easeOutQuad = easeOutQuad;
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeInOutQuad(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    t /= 1 / 2;
    if ((t) < 1) {
        return c / 2 * t * t + b;
    }
    return -c / 2 * ((--t) * (t - 2) - 1) + b;
}
exports.easeInOutQuad = easeInOutQuad;
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeInCubic(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    return c * (t /= 1) * t * t + b;
}
exports.easeInCubic = easeInCubic;
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeOutCubic(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    return c * ((t = t / 1 - 1) * t * t + 1) + b;
}
exports.easeOutCubic = easeOutCubic;
/**
 * @param t current time from 0 to 1.0
 * @param b begin value
 * @param c change to value
 */
function easeInOutCubic(t, b, c) {
    if (b === c) {
        return b;
    }
    c -= b;
    t /= 1 / 2;
    if (t < 1) {
        return c / 2 * t * t * t + b;
    }
    return c / 2 * ((t -= 2) * t * t + 2) + b;
}
exports.easeInOutCubic = easeInOutCubic;
function lerp(t, v0, v1) {
    if (v0 === v1) {
        return v1;
    }
    return v0 * (1 - t) + v1 * t;
}
exports.lerp = lerp;
//# sourceMappingURL=easing.js.map