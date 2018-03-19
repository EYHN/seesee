"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const recompose_1 = require("recompose");
const Appbar = ({ leftIcon, titleText, rightIcon, color }) => (React.createElement("div", { style: styles.root },
    leftIcon,
    React.createElement("span", { style: Object.assign({}, styles.title, { color }) }, titleText),
    React.createElement("span", { style: styles.full }),
    rightIcon));
const styles = {
    root: {
        display: 'flex',
        position: 'relative',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px',
        minHeight: '56px',
        boxSizing: 'border-box',
        color: '#fff',
        background: 'rgba(0,0,0,.6)'
    },
    full: {
        flexGrow: 1
    },
    title: {
        position: 'absolute',
        left: '72px',
        fontFamily: 'Roboto-medium',
        fontSize: '20px',
        lineHeight: '28px',
        color: 'rgba(0,0,0,.87)',
        fontWeight: 'normal'
    }
};
exports.default = recompose_1.pure(Appbar);
//# sourceMappingURL=Appbar.js.map