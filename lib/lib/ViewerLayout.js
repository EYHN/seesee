"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
/**
 * Management components layout.
 *
 * It has a navigation bar, content area, background and bottom navigation.
 */
const ViewerLayout = ({ children, nav, content, bottom, bg, style, fadeInCurrent, className }) => {
    const backgroundStyle = Object.assign({}, styles.bg, { opacity: fadeInCurrent });
    const navStyle = Object.assign({}, styles.nav, { transform: `translateY(${(fadeInCurrent - 1) * 100}%)` });
    return (React.createElement("div", { style: Object.assign({}, styles.root, style), className: className },
        React.createElement("div", { role: 'background', style: backgroundStyle }, bg),
        React.createElement("nav", { style: navStyle }, nav),
        React.createElement("div", { style: styles.content, role: 'content' }, children),
        React.createElement("footer", { style: styles.footer }, bottom)));
};
exports.default = ViewerLayout;
const styles = {
    root: {
        position: 'relative',
        height: '100%',
        width: '100%'
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
        width: '100%',
        height: '100%',
        zIndex: 0
    },
    nav: {
        flexShrink: 0,
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 1
    },
    footer: {
        flexShrink: 0,
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        zIndex: 1
    }
};
//# sourceMappingURL=ViewerLayout.js.map