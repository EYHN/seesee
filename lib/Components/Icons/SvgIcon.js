"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const recompose_1 = require("recompose");
const defaultProps = {
    viewBox: '0 0 24 24',
    color: 'inherit',
    height: '24px'
};
const SvgIcon = (props) => (React.createElement("svg", Object.assign({}, Object.assign({}, defaultProps, props))));
exports.default = recompose_1.pure(SvgIcon);
//# sourceMappingURL=SvgIcon.js.map