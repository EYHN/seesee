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
const ReactDOM = require("react-dom");
const easing_1 = require("../utils/easing");
const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;
const components = {};
class Overdrive extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
        this.animateEnd = () => {
            this.setState({ loading: false });
            if (this.props.onAnimationEnd) {
                this.props.onAnimationEnd();
            }
            this.clearAnimations();
            if (this.bodyElement) {
                window.document.body.removeChild(this.bodyElement);
                this.bodyElement = null;
            }
        };
    }
    animate(prevPosition, prevElement) {
        const { duration = 200, lockscroll = true } = this.props;
        prevPosition.top += (window.pageYOffset || document.documentElement.scrollTop);
        const nextPosition = this.getPosition(true);
        const targetScaleX = prevPosition.width / nextPosition.width;
        const targetScaleY = prevPosition.height / nextPosition.height;
        const targetTranslateX = prevPosition.left - nextPosition.left;
        const targetTranslateY = prevPosition.top - nextPosition.top;
        if (targetScaleX === 1 &&
            targetScaleY === 1 &&
            targetTranslateX === 0 &&
            targetTranslateY === 0) {
            this.animateEnd();
            return;
        }
        this.setState({ loading: true });
        const bodyElement = document.createElement('div');
        window.document.body.appendChild(bodyElement);
        this.bodyElement = bodyElement;
        const subtree = ({ style, ref }) => {
            const children = React.cloneElement(prevElement, {
                style: Object.assign({}, prevElement.props.style, { width: '100%', height: '100%' })
            });
            return (React.createElement("span", { key: '1', ref: ref, style: style }, children));
        };
        const startAnimation = (element) => {
            const beginDate = Date.now();
            const prevOverflow = document.body.style.overflow;
            // if (lockscroll) {
            //   document.body.style.overflow = 'hidden';
            // }
            const animationUpdate = () => {
                const currentTime = Date.now() - beginDate;
                const current = currentTime / duration;
                const scaleX = easing_1.lerp(current, 1, 1 / targetScaleX);
                const scaleY = easing_1.lerp(current, 1, 1 / targetScaleY);
                const translateX = targetTranslateY < 0 ?
                    easing_1.easeInQuad(current, 0, -targetTranslateX) : easing_1.easeOutQuad(current, 0, -targetTranslateX);
                const translateY = targetTranslateY < 0 ?
                    easing_1.easeOutQuad(current, 0, -targetTranslateY) : easing_1.easeInQuad(current, 0, -targetTranslateY);
                element.style.transform = `matrix(${scaleX}, 0, 0, ${scaleY}, ${translateX}, ${translateY})`;
                if (current < 1) {
                    this.animationRequest = requestAnimationFrame(animationUpdate);
                }
                else {
                    // if (lockscroll) {
                    //   document.body.style.overflow = prevOverflow;
                    // }
                    this.animateEnd();
                }
            };
            this.animationRequest = requestAnimationFrame(animationUpdate);
        };
        renderSubtreeIntoContainer(this, subtree({
            style: Object.assign({}, prevPosition, { margin: 0, opacity: 1, zIndex: 1001, transform: 'scaleX(1) scaleY(1) translateX(0px) translateY(0px)', transformOrigin: '0 0 0' }),
            ref: (c) => startAnimation(c)
        }), bodyElement);
    }
    onHide() {
        const { id } = this.props;
        if (!React.isValidElement(this.props.children)) {
            return;
        }
        const prevElement = React.cloneElement(this.props.children);
        const prevPosition = this.getPosition(false);
        components[id] = {
            prevPosition,
            prevElement
        };
        this.clearAnimations();
        setTimeout(() => {
            components[id] = null;
        }, 100);
    }
    onShow() {
        if (this.onShowLock) {
            return;
        }
        this.onShowLock = true;
        const { id, animationDelay } = this.props;
        if (components[id]) {
            const { prevPosition, prevElement } = components[id];
            components[id] = null;
            if (animationDelay) {
                this.animationDelayTimeout = setTimeout(this.animate.bind(this, prevPosition, prevElement), animationDelay);
            }
            else {
                this.animate(prevPosition, prevElement);
            }
        }
        else {
            this.setState({ loading: false });
        }
    }
    componentDidMount() {
        this.onShow();
    }
    clearAnimations() {
        clearTimeout(this.animationDelayTimeout);
        cancelAnimationFrame(this.animationRequest);
    }
    componentWillUnmount() {
        this.onHide();
    }
    getPosition(addOffset) {
        const node = this.element;
        const rect = node.getBoundingClientRect();
        const computedStyle = getComputedStyle(node);
        const marginTop = parseInt(computedStyle.marginTop, 10);
        const marginLeft = parseInt(computedStyle.marginLeft, 10);
        return {
            top: (rect.top - marginTop) + ((addOffset ? 1 : 0) * (window.pageYOffset || document.documentElement.scrollTop)),
            left: (rect.left - marginLeft),
            width: rect.width,
            height: rect.height,
            margin: computedStyle.margin,
            padding: computedStyle.padding,
            borderRadius: computedStyle.borderRadius,
            position: 'absolute'
        };
    }
    render() {
        const _a = this.props, { id, duration = 200, animationDelay, style = {}, children } = _a, rest = __rest(_a, ["id", "duration", "animationDelay", "style", "children"]);
        const onlyChild = React.Children.only(children);
        const newStyle = Object.assign({}, onlyChild.props.style, style, { opacity: (this.state.loading ? 0 : 1), willChange: 'opacity, transform' });
        return React.cloneElement(onlyChild, Object.assign({ ref: (c) => (this.element = c), style: newStyle }, rest));
    }
}
exports.default = Overdrive;
//# sourceMappingURL=Overdrive.js.map