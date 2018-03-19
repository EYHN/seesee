"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const recompose_1 = require("recompose");
const iconButtonStyle = {
    padding: '0px',
    border: '0px',
    outline: 'none',
    WebkitTapHighlightColor: 'transparent',
    background: 'transparent'
};
const IconButton = (_a) => {
    var { icon } = _a, otherProps = __rest(_a, ["icon"]);
    return (React.createElement("button", Object.assign({}, Object.assign({}, otherProps, { style: Object.assign({}, iconButtonStyle, otherProps) })), icon));
};
exports.default = recompose_1.pure(IconButton);
//# sourceMappingURL=IconButton.js.map