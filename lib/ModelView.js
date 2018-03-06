"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var ReactDOM = require("react-dom");
var ViewerLayout_1 = require("./ViewerLayout");
/**
 * Modal image viewer. Full page.
 *
 * @class
 */
var ModelView = /** @class */ (function (_super) {
    __extends(ModelView, _super);
    function ModelView() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ModelView.prototype.render = function () {
        var _a = this.props, children = _a.children, mountNode = _a.mountNode;
        return ReactDOM.createPortal(React.createElement(ViewerLayout_1.default, { style: styles.fullPage, bg: React.createElement("span", { style: styles.bg }) }, children), mountNode);
    };
    return ModelView;
}(React.PureComponent));
exports.default = ModelView;
var styles = {
    fullPage: {
        position: 'fixed',
        zIndex: 1000,
        width: '100%',
        height: '100%',
        top: '0px',
        left: '0px'
    },
    bg: {
        display: 'block',
        height: '100%',
        width: '100%',
        background: '#000'
    }
};
//# sourceMappingURL=ModelView.js.map