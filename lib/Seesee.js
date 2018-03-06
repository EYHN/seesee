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
var ModelView_1 = require("./ModelView");
var modelViewMountNode = document.body;
var Seesee = /** @class */ (function (_super) {
    __extends(Seesee, _super);
    function Seesee() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Seesee.prototype.render = function () {
        var _this = this;
        var _a = this.props, childrenProps = _a.children, open = _a.open;
        React.Children.only(childrenProps);
        var children = React.Children.map(childrenProps, function (child) {
            if (!React.isValidElement(childrenProps)) {
                return null;
            }
            return React.cloneElement(child, {
                ref: function (el) {
                    _this.childrenElement = el;
                }
            });
        });
        var content = open ? (React.createElement(ModelView_1.default, { mountNode: modelViewMountNode }, children)) : children;
        return (content);
    };
    return Seesee;
}(React.PureComponent));
exports.default = Seesee;
//# sourceMappingURL=Seesee.js.map