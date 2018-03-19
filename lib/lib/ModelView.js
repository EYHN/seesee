"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const ViewerLayout_1 = require("./ViewerLayout");
const ContentLayout_1 = require("./ContentLayout");
const easing_1 = require("../utils/easing");
const Appbar_1 = require("../Components/Appbar");
const IconButton_1 = require("../Components/Icons/IconButton");
const ArrawBack_1 = require("../Components/Icons/ArrawBack");
/**
 * Modal image viewer. Full page.
 *
 * @class
 */
class ModelView extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.state = {
            fadeInCurrent: 0,
            hasShow: false,
            display: false
        };
        this.beginFadeInAnimation = () => {
            if (this.animationRequest) {
                cancelAnimationFrame(this.animationRequest);
            }
            const beginDate = Date.now();
            const duration = 250;
            const animationUpdate = () => {
                const currentTime = Date.now() - beginDate;
                const current = easing_1.easeOutCubic(currentTime / duration, 0, 1);
                this.setState(Object.assign({}, this.state, { fadeInCurrent: current, hasShow: true, display: true }));
                if (currentTime < duration) {
                    this.animationRequest = requestAnimationFrame(animationUpdate);
                }
            };
            this.animationRequest = requestAnimationFrame(animationUpdate);
        };
        this.beginFadeOutAnimation = () => {
            if (this.animationRequest) {
                cancelAnimationFrame(this.animationRequest);
            }
            const beginDate = Date.now();
            const duration = 250;
            const animationUpdate = () => {
                const currentTime = Date.now() - beginDate;
                const current = 1 - easing_1.easeInCubic(currentTime / duration, 0, 1);
                this.setState(Object.assign({}, this.state, { fadeInCurrent: current, hasShow: false, display: currentTime < duration }));
                if (currentTime < duration) {
                    this.animationRequest = requestAnimationFrame(animationUpdate);
                }
            };
            this.animationRequest = requestAnimationFrame(animationUpdate);
        };
    }
    // handleClickBack: React.ReactEventHandler<HTMLButtonElement> = (e) => {
    //   this.setState({
    //   })
    // };
    componentDidMount() {
        if (this.state.hasShow !== !!this.props.children) {
            if (!!this.props.children) {
                this.beginFadeInAnimation();
            }
            else {
                this.beginFadeOutAnimation();
            }
        }
    }
    componentWillUnmount() {
        cancelAnimationFrame(this.animationRequest);
    }
    componentWillReceiveProps(nextProps) {
        if (this.state.hasShow !== !!nextProps.children) {
            if (!!nextProps.children) {
                this.beginFadeInAnimation();
            }
            else {
                this.beginFadeOutAnimation();
            }
        }
    }
    render() {
        const { children, mountNode, onClickBackButton } = this.props;
        const appbar = (React.createElement(Appbar_1.default, { titleText: 'Seesee \u56FE\u7247\u67E5\u770B\u5668', color: '#fff', leftIcon: React.createElement(IconButton_1.default, { onClick: onClickBackButton, icon: React.createElement(ArrawBack_1.default, { fill: '#fff' }) }) }));
        return ReactDOM.createPortal(React.createElement(ViewerLayout_1.default, { bg: React.createElement("span", { ref: c => this.bgElement = c, style: styles.bg }), nav: appbar, fadeInCurrent: this.state.fadeInCurrent, style: Object.assign({}, styles.root, { visibility: !this.state.display && 'hidden' }) },
            React.createElement(ContentLayout_1.default, { enable: true }, children)), mountNode);
    }
}
exports.default = ModelView;
const styles = {
    root: {
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
        background: '#000',
        opacity: 1,
        willChange: 'opacity'
    }
};
//# sourceMappingURL=ModelView.js.map