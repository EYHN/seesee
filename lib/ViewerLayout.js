"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/**
 * Management components layout.
 *
 * It has a navigation bar, content area, background and bottom navigation.
 */
var ViewerLayout = function (_a) {
    var children = _a.children, nav = _a.nav, content = _a.content, bottom = _a.bottom, bg = _a.bg, style = _a.style;
    return (React.createElement("div", { style: __assign({}, styles.root, style) },
        React.createElement("div", { role: 'background', style: styles.bg }, bg),
        React.createElement("nav", { style: styles.nav }, nav),
        React.createElement("div", { style: styles.content, role: 'content' }, children),
        React.createElement("footer", { style: styles.footer }, bottom)));
};
exports.default = ViewerLayout;
var styles = {
    root: {
        display: 'flex',
        position: 'relative',
        height: '100%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column'
    },
    bg: {
        position: 'absolute',
        zIndex: -1,
        top: 0,
        left: 0,
        width: '100%',
        height: '100%'
    },
    content: {
        flexGrow: 1,
        flexShrink: 1,
        width: '100%'
    },
    nav: {
        flexShrink: 0,
        width: '100%'
    },
    footer: {
        flexShrink: 0,
        width: '100%'
    }
};
//# sourceMappingURL=ViewerLayout.js.map