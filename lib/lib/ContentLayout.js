"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const easing_1 = require("../utils/easing");
const TouchEventManager_1 = require("../utils/touch/TouchEventManager");
const filter_1 = require("../utils/touch/filter");
function squareWithSigned(x) {
    return x < 0 ? -Math.pow(x, 2) : Math.pow(x, 2);
}
class ContentLayout extends React.PureComponent {
    // componentDidMount() {
    //   window.addEventListener('resize', this.handleWindowResize);
    // }
    // componentWillUnmount() {
    //   window.removeEventListener('resize', this.handleWindowResize);
    // }
    constructor(props) {
        super(props);
        this.touchEventManager = new TouchEventManager_1.default();
        // s: 'height' | 'width';
        this.state = {
            offsetX: 0,
            offsetY: 0,
            scaleX: 1,
            scaleY: 1
        };
        this.startAnimationFrame = (c) => {
            if (typeof this.animationRequest !== 'undefined') {
                cancelAnimationFrame(this.animationRequest);
            }
            this.animationRequest = requestAnimationFrame(c);
        };
        this.returnOrigin = () => {
            const startTime = Date.now();
            // The animation duration milliseconds.
            const duration = 200;
            const { offsetX: beginOffsetX, offsetY: beginOffsetY, scaleX: beginScaleX, scaleY: beginScaleY } = this.state;
            const update = () => {
                const current = (Date.now() - startTime) / duration;
                this.setState(Object.assign({}, this.state, { offsetX: easing_1.easeOutQuad(current, beginOffsetX, 0), offsetY: easing_1.easeOutQuad(current, beginOffsetY, 0), scaleX: easing_1.lerp(current, beginScaleX, 1), scaleY: easing_1.lerp(current, beginScaleY, 1) }));
                if (current < 1) {
                    this.animationRequest = requestAnimationFrame(update);
                }
            };
            this.startAnimationFrame(update);
        };
        // private getWindowShortestEdge = () => {
        //   return document.documentElement.clientHeight < document.documentElement.clientWidth ? 'height' : 'width';
        // }
        // private handleWindowResize = (e: UIEvent) => {
        //   this.forceUpdate();
        // }
        this.handleTouch = () => __awaiter(this, void 0, void 0, function* () {
            while (true) {
                const { event, touches, changedTouches } = yield this.touchEventManager.getNextUpdateEvent();
                if (filter_1.isSingleFinger(touches)) {
                    const { moveX, moveY } = filter_1.getMoveDistance(changedTouches);
                    this.startAnimationFrame(() => {
                        this.setState(Object.assign({}, this.state, { offsetX: this.state.offsetX + moveX, offsetY: this.state.offsetY + moveY }));
                    });
                }
                else if (filter_1.isFingers(touches)) {
                    // const clientDiagonal =
                    //   Math.sqrt(
                    //     Math.pow(document.documentElement.clientHeight, 2) +
                    //     Math.pow(document.documentElement.clientWidth, 2));
                    const clientHeight = document.documentElement.clientHeight;
                    const clientWidth = document.documentElement.clientWidth;
                    const scalingRatio = (filter_1.getScalingDistance(touches) || 0) /
                        Math.min(clientHeight, clientWidth);
                    const { x: centerX, y: centerY } = filter_1.getTouchesCenter(filter_1.getTouches(touches));
                    const centerOffsetX = (centerX - (clientWidth / 2)) * this.state.scaleX * -1;
                    const centerOffsetY = (centerY - (clientHeight / 2)) * this.state.scaleY * -1;
                    // const { moveX, moveY } = getMoveDistance(changedTouches);
                    this.startAnimationFrame(() => {
                        this.setState(Object.assign({}, this.state, { scaleX: this.state.scaleX * Math.pow((scalingRatio + 1), 2), scaleY: this.state.scaleY * Math.pow((scalingRatio + 1), 2), offsetX: centerOffsetX, offsetY: centerOffsetY }));
                    });
                }
                else {
                    this.returnOrigin();
                }
                event.preventDefault();
            }
        });
        this.handleRef = (el) => {
            if (!el) {
                return;
            }
            el.addEventListener('touchstart', this.touchEventManager.handleTouchEvent, { passive: false });
            el.addEventListener('touchend', this.touchEventManager.handleTouchEvent, { passive: false });
            el.addEventListener('touchmove', this.touchEventManager.handleTouchEvent, { passive: false });
            el.addEventListener('touchcancel', this.touchEventManager.handleTouchEvent, { passive: false });
        };
        this.handleTouch();
    }
    // tslint:disable-next-line:member-ordering
    render() {
        const { children: childrenProps, style: styleProp } = this.props;
        if (!childrenProps) {
            return React.createElement("div", { style: styles.root });
        }
        React.Children.only(childrenProps);
        if (React.isValidElement(childrenProps)) {
            // if (this.s) {
            //   this.s = this.getWindowShortestEdge();
            // }
            const children = React.cloneElement(childrenProps, {
                style: Object.assign({}, childrenProps.props.style, { maxHeight: '100%', maxWidth: '100%', width: '100vh', 
                    // tslint:disable-next-line:max-line-length
                    transform: `matrix(${this.state.scaleX}, 0, 0, ${this.state.scaleY}, ${this.state.offsetX}, ${this.state.offsetY})` })
            });
            return (React.createElement("div", { style: Object.assign({}, styles.root, styleProp), ref: this.handleRef }, children));
        }
        else {
            throw new Error('Only one *react element* is allowed.');
        }
    }
}
exports.default = ContentLayout;
const styles = {
    root: {
        display: 'flex',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    }
};
//# sourceMappingURL=ContentLayout.js.map