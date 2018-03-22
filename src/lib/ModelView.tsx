import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ViewerLayout from './ViewerLayout';
import ContentLayout from './ContentLayout';
import { easeOutCubic, easeInCubic } from '../utils/easing';
import Appbar from '../Components/Appbar';
import IconButton from '../Components/Icons/IconButton';
import ArrawBack from '../Components/Icons/ArrawBack';
import TouchEventManager from '../utils/touch/TouchEventManager';
import { easeOutQuad, lerp, easeOutBack } from '../utils/easing';
import {
  isSingleFinger,
  getFirstFinger,
  getMoveDistance,
  getScaling,
  isMultipleFingers,
  getTouchesCenter,
  getTouches
} from '../utils/touch/filter';
import { pure } from 'recompose';

export interface ModelViewProps {
  /**
   * The element you want mount to.
   * Viewer will be injected into it.
   *
   * @type {HTMLElement}
   */
  mountNode: HTMLElement;
  onClickBackButton?: React.ReactEventHandler<HTMLButtonElement>;
}

/**
 * Modal image viewer. Full page.
 *
 * @class
 */
export default class ModelView extends React.PureComponent<ModelViewProps> {
  animationRequest: number;
  contentAnimationRequest: number;
  contentLayoutElement: HTMLElement;
  touchEventManager: TouchEventManager = new TouchEventManager();
  state = {
    fadeInCurrent: 0,
    hasShow: false,
    display: false,
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1
  };

  constructor(props: ModelViewProps) {
    super(props);
    this.handleTouch();
  }

  componentDidMount() {
    if (this.state.hasShow !== !!this.props.children) {
      if (!!this.props.children) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationRequest);
  }

  componentWillReceiveProps(nextProps: { children: React.ReactNode } & ModelViewProps) {
    if (this.state.hasShow !== !!nextProps.children) {
      if (!!nextProps.children) {
        this.onOpen();
      } else {
        this.onClose();
      }
    }
  }

  onOpen() {
    this.beginFadeInAnimation();
    this.resetState();
  }

  onClose() {
    this.beginFadeOutAnimation();
  }

  public beginFadeInAnimation = () => {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    const beginFadeInCurrent = this.state.fadeInCurrent;
    const beginDate = Date.now();
    const duration = 250;
    const animationUpdate = () => {
      const currentTime = Date.now() - beginDate;
      const current = easeOutCubic(currentTime / duration, beginFadeInCurrent, 1);
      this.setState({
        ...this.state,
        fadeInCurrent: current,
        hasShow: true,
        display: true
      });
      if (currentTime < duration) {
        this.animationRequest = requestAnimationFrame(animationUpdate);
      }
    };
    this.animationRequest = requestAnimationFrame(animationUpdate);
  }

  public beginFadeOutAnimation = () => {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    const beginFadeInCurrent = this.state.fadeInCurrent;
    const beginDate = Date.now();
    const duration = 250;
    const animationUpdate = () => {
      const currentTime = Date.now() - beginDate;
      const current = easeOutCubic(currentTime / duration, beginFadeInCurrent, 0);
      this.setState({
        ...this.state,
        fadeInCurrent: current,
        hasShow: false,
        display: currentTime < duration
      });
      if (currentTime < duration) {
        this.animationRequest = requestAnimationFrame(animationUpdate);
      }
    };
    this.animationRequest = requestAnimationFrame(animationUpdate);
  }

  /**
   * force reset the state.
   */
  public resetState() {
    this.setState({
      fadeInCurrent: 0,
      hasShow: false,
      display: false,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1
    });
  }

  /**
   * Back to origin with animation.
   */
  public returnOrigin = () => {
    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 200;

    const {
      offsetX: beginOffsetX,
      offsetY: beginOffsetY,
      scaleX: beginScaleX,
      scaleY: beginScaleY,
      fadeInCurrent: beginFadeInCurrent } = this.state;
    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, 0),
        offsetY: easeOutQuad(current, beginOffsetY, 0),
        scaleX: easeOutQuad(current, beginScaleX, 1),
        scaleY: easeOutQuad(current, beginScaleY, 1),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      }
    };
    this.startAnimationFrame(update);
  }

  public stayWithinRange = () => {
    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 200;

    const childrenElement = this.contentLayoutElement.firstElementChild;
    const clientHeight = this.contentLayoutElement.getBoundingClientRect().height;
    const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;
    const clientRect = childrenElement.getBoundingClientRect();
    const left = clientRect.left,
      right = clientWidth - clientRect.right,
      bottom = clientHeight - clientRect.bottom,
      top = clientRect.top;
    const {
      offsetX: beginOffsetX,
      offsetY: beginOffsetY,
      scaleX: beginScaleX,
      scaleY: beginScaleY,
      fadeInCurrent: beginFadeInCurrent } = this.state;
    let targetOffsetX = 0, targetOffsetY = 0, targetScaleX = beginScaleX, targetScaleY = beginScaleY;
    if (left > 0 && right > 0 || left + right > 0) {
      targetOffsetX = 0;
    } else if (left > 0 && right <= 0) {
      targetOffsetX = beginOffsetX - left;
    } else if (right > 0 && left <= 0) {
      targetOffsetX = beginOffsetX + right;
    } else {
      targetOffsetX = beginOffsetX;
    }

    if (top > 0 && bottom > 0 || top + bottom > 0) {
      targetOffsetY = 0;
    } else if (top > 0 && bottom <= 0) {
      targetOffsetY = beginOffsetY - top;
    } else if (bottom > 0 && top <= 0) {
      targetOffsetY = beginOffsetY + bottom;
    } else {
      targetOffsetY = beginOffsetY;
    }

    if (beginScaleX < beginScaleY) {
      if (beginScaleX < 1) {
        targetScaleX = 1;
        targetScaleY = targetScaleX / beginScaleX * beginScaleY;
      }
    } else {
      if (beginScaleY < 1) {
        targetScaleY = 1;
        targetScaleX = targetScaleY / beginScaleY * beginScaleX;
      }
    }

    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, targetOffsetX),
        offsetY: easeOutQuad(current, beginOffsetY, targetOffsetY),
        scaleX: easeOutQuad(current, beginScaleX, targetScaleX),
        scaleY: easeOutQuad(current, beginScaleY, targetScaleY),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      }
    };
    this.startAnimationFrame(update);
  }

  private startAnimationFrame = (c: FrameRequestCallback) => {
    if (typeof this.contentAnimationRequest !== 'undefined') {
      cancelAnimationFrame(this.contentAnimationRequest);
    }
    this.contentAnimationRequest = requestAnimationFrame(c);
  }

  private handleTouch = async () => {
    while (true) {
      const { event, touches, changedTouches } = await this.touchEventManager.getNextUpdateEvent();
      if (isSingleFinger(touches) && this.state.scaleX === 1 && this.state.scaleY === 1) {

        const { moveX, moveY } = getMoveDistance(changedTouches);
        const offsetX = this.state.offsetX + moveX;
        const offsetY = this.state.offsetY + moveY;
        const centerDistance = Math.sqrt(offsetX * offsetX + offsetY * offsetY);

        const exitCurrent = Math.max(0, Math.min(1, centerDistance / 200));

        this.startAnimationFrame(() => {
          this.setState({
            ...this.state,
            offsetX,
            offsetY,
            fadeInCurrent: 1 - exitCurrent
          });
        });
      } else if (isSingleFinger(touches)) {
        // If only one finger touches
        const { moveX, moveY } = getMoveDistance(changedTouches);
        this.startAnimationFrame(() => {
          this.setState({
            ...this.state,
            offsetX: this.state.offsetX + moveX,
            offsetY: this.state.offsetY + moveY
          });
        });
      } else if (isMultipleFingers(touches)) {
        // If there are multiple fingers touching.

        const clientHeight = this.contentLayoutElement.getBoundingClientRect().height;
        const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;

        // Fingers scaling.
        const scalingRatio = getScaling(touches);
        const { x: centerX, y: centerY } = getTouchesCenter(getTouches(touches));

        const centerOffsetX = -(centerX - (clientWidth / 2)) * (scalingRatio - 1) * this.state.scaleX;
        const centerOffsetY = -(centerY - (clientHeight / 2)) * (scalingRatio - 1) * this.state.scaleY;

        const { moveX, moveY } = getMoveDistance(changedTouches);
        this.startAnimationFrame(() => {
          this.setState({
            ...this.state,
            scaleX: this.state.scaleX * scalingRatio,
            scaleY: this.state.scaleY * scalingRatio,
            offsetX: this.state.offsetX + moveX + centerOffsetX,
            offsetY: this.state.offsetY + moveY + centerOffsetY
          });
        });
      } else {
        if (this.state.fadeInCurrent < 0.5) {
          this.props.onClickBackButton(null);
        } else {
          this.stayWithinRange();
        }
      }
      event.preventDefault();
    }
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children,
      mountNode,
      onClickBackButton
    } = this.props;
    const PureAppbar = pure(() => (
      <Appbar
        titleText='Seesee 图片查看器'
        color='#fff'
        leftIcon={<IconButton onClick={onClickBackButton} icon={<ArrawBack fill='#fff' />} />}
      />
    ));
    const PureBackground = pure(() => (
      <span style={styles.bg} />
    ));
    return ReactDOM.createPortal(
      <ViewerLayout
        bg={<PureBackground/>}
        nav={<PureAppbar />}
        fadeInCurrent={this.state.fadeInCurrent}
        style={{ ...styles.root, visibility: !this.state.display && 'hidden' }}
      >
        <ContentLayout
          enable
          onTouchCancel={this.touchEventManager.handleTouchEvent}
          onTouchEnd={this.touchEventManager.handleTouchEvent}
          onTouchMove={this.touchEventManager.handleTouchEvent}
          onTouchStart={this.touchEventManager.handleTouchEvent}
          rootref={(el) => this.contentLayoutElement = el}
          scaleX={this.state.scaleX}
          scaleY={this.state.scaleY}
          offsetX={this.state.offsetX}
          offsetY={this.state.offsetY}
        >
          {children}
        </ContentLayout>
      </ViewerLayout>,
      mountNode
    );
  }
}

const styles: { [key: string]: React.CSSProperties } = {
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
