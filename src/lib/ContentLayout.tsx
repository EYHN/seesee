import * as React from 'react';
import { easeOutQuad, lerp } from '../utils/easing';
import TouchEventManager from '../utils/touch/TouchEventManager';
import {
  isSingleFinger,
  getFirstFinger,
  getMoveDistance,
  getScalingDistance,
  isFingers,
  getTouchesCenter,
  getTouches
} from '../utils/touch/filter';

function squareWithSigned(x: number) {
  return x < 0 ? -Math.pow(x, 2) : Math.pow(x, 2);
}

export interface ContentLayoutProps {
  enable: boolean;
  style?: React.CSSProperties;
}

export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
  prevTouchList: TouchList;

  animationRequest: number;

  childrenElement: HTMLElement;

  touchEventManager: TouchEventManager = new TouchEventManager();

  // s: 'height' | 'width';

  state = {
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1
  };

  // componentDidMount() {
  //   window.addEventListener('resize', this.handleWindowResize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleWindowResize);
  // }

  constructor(props: ContentLayoutProps) {
    super(props);
    this.handleTouch();
  }

  startAnimationFrame = (c: FrameRequestCallback) => {
    if (typeof this.animationRequest !== 'undefined') {
      cancelAnimationFrame(this.animationRequest);
    }
    this.animationRequest = requestAnimationFrame(c);
  }

  returnOrigin = () => {
    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 200;

    const { offsetX: beginOffsetX, offsetY: beginOffsetY, scaleX: beginScaleX, scaleY: beginScaleY } = this.state;
    const update = () => {
      const current = (Date.now() - startTime) / duration;
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, 0),
        offsetY: easeOutQuad(current, beginOffsetY, 0),
        scaleX: lerp(current, beginScaleX, 1),
        scaleY: lerp(current, beginScaleY, 1)
      });
      if (current < 1) {
        this.animationRequest = requestAnimationFrame(update);
      }
    };
    this.startAnimationFrame(update);
  }

  // private getWindowShortestEdge = () => {
  //   return document.documentElement.clientHeight < document.documentElement.clientWidth ? 'height' : 'width';
  // }

  // private handleWindowResize = (e: UIEvent) => {
  //   this.forceUpdate();
  // }

  private handleTouch = async () => {
    while (true) {
      const { event, touches, changedTouches } = await this.touchEventManager.getNextUpdateEvent();
      if (isSingleFinger(touches)) {
        const { moveX, moveY } = getMoveDistance(changedTouches);
        this.startAnimationFrame(() => {
          this.setState({
            ...this.state,
            offsetX: this.state.offsetX + moveX,
            offsetY: this.state.offsetY + moveY
          });
        });
      } else if (isFingers(touches)) {
        // const clientDiagonal =
        //   Math.sqrt(
        //     Math.pow(document.documentElement.clientHeight, 2) +
        //     Math.pow(document.documentElement.clientWidth, 2));
        const clientHeight = document.documentElement.clientHeight;
        const clientWidth = document.documentElement.clientWidth;
        const scalingRatio = (getScalingDistance(touches) || 0) /
          Math.min(clientHeight, clientWidth);
        const { x: centerX, y: centerY } = getTouchesCenter(getTouches(touches));
        const centerOffsetX = (centerX - (clientWidth / 2)) * this.state.scaleX * -1;
        const centerOffsetY = (centerY - (clientHeight / 2)) * this.state.scaleY * -1;
        // const { moveX, moveY } = getMoveDistance(changedTouches);
        this.startAnimationFrame(() => {
          this.setState({
            ...this.state,
            scaleX: this.state.scaleX * Math.pow((scalingRatio + 1), 2),
            scaleY: this.state.scaleY * Math.pow((scalingRatio + 1), 2),
            offsetX: centerOffsetX,
            offsetY: centerOffsetY
          });
        });
      } else {
        this.returnOrigin();
      }
      event.preventDefault();
    }
  }

  private handleRef: React.Ref<HTMLElement> = (el) => {
    if (!el) { return; }
    el.addEventListener('touchstart', this.touchEventManager.handleTouchEvent, { passive: false });
    el.addEventListener('touchend', this.touchEventManager.handleTouchEvent, { passive: false });
    el.addEventListener('touchmove', this.touchEventManager.handleTouchEvent, { passive: false });
    el.addEventListener('touchcancel', this.touchEventManager.handleTouchEvent, { passive: false });
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children: childrenProps,
      style: styleProp
    } = this.props;
    if (!childrenProps) { return <div style={styles.root} />; }
    React.Children.only(childrenProps);
    if (React.isValidElement(childrenProps)) {
      // if (this.s) {
      //   this.s = this.getWindowShortestEdge();
      // }
      const children = React.cloneElement(childrenProps as any, {
        style: {
          ...(childrenProps as any).props.style,
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100vh',
          // tslint:disable-next-line:max-line-length
          transform: `matrix(${this.state.scaleX}, 0, 0, ${this.state.scaleY}, ${this.state.offsetX}, ${this.state.offsetY})`
        }
      });
      return (
        <div
          style={{ ...styles.root, ...styleProp }}
          ref={this.handleRef}
        >
          {children}
        </div>
      );
    } else {
      throw new Error('Only one *react element* is allowed.');
    }
  }
}

const styles: { [key: string]: React.CSSProperties } = {
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  }
};
