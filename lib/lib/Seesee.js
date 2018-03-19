"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ModelView_1 = require("./ModelView");
const Overdrive_1 = require("../Components/Overdrive");
const modelViewMountNode = document.body;
class Seesee extends React.PureComponent {
    render() {
        const { children, open, onExit } = this.props;
        const onlyChild = React.Children.only(children);
        if (!React.isValidElement(onlyChild)) {
            return null;
        }
        const overdrived = (React.createElement(Overdrive_1.default, { id: '1', duration: 250 }, children));
        return (React.createElement(React.Fragment, null,
            React.createElement(ModelView_1.default, { mountNode: modelViewMountNode, onClickBackButton: onExit }, open && overdrived),
            !open ? overdrived : React.cloneElement(children)));
    }
}
exports.default = Seesee;
//# sourceMappingURL=Seesee.js.map