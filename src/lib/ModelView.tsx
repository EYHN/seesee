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
  getTouches,
  getDistanceFromStart,
  getTotalDistanceMoved,
  isSingleTap,
  getSlidingAngle,
  isHorizontal
} from '../utils/touch/filter';
import { pure } from 'recompose';
import debounce from '../utils/debounce';

export interface ModelViewProps {
  /**
   * The element you want mount to.
   * Viewer will be injected into it.
   *
   * @type {HTMLElement}
   */
  mountNode: HTMLElement;
  onClickBackButton?: React.ReactEventHandler<HTMLButtonElement>;
  title?: string;

  next?: React.ReactElement<any>;
  prev?: React.ReactElement<any>;
  nextIdentifier?: string;
  prevIdentifier?: string;
  identifier?: string;
  onNext?: (next: React.ReactElement<any>) => void;
  onPrev?: (prev: React.ReactElement<any>) => void;
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
    fadeInCurrent: !!this.props.children ? 1 : 0,
    hasShow: !!this.props.children,
    display: !!this.props.children,
    offsetX: 0,
    offsetY: 0,
    scaleX: 1,
    scaleY: 1,
    opacity: 1,
    switchProgress: 0,
    willChange: false
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
    if (this.state.hasShow && nextProps.children !== this.props.children) {
      this.resetTransform();
    }
  }

  onOpen() {
    this.beginFadeInAnimation();
    this.resetState();
  }

  onClose() {
    this.beginFadeOutAnimation();
  }

  enlarge(x: number, y: number) {
    const startTime = Date.now();
    const scale = 3;
    const childrenElement = this.contentLayoutElement.firstElementChild;
    const clientHeight = this.contentLayoutElement.getBoundingClientRect().height;
    const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;
    const { width, height } = childrenElement.getBoundingClientRect();
    x = Math.max(0, Math.min(width, x)) - width / 2;
    y = Math.max(0, Math.min(height, y)) - height / 2;
    const maxOffsetX = width * scale / 2 - clientWidth / 2;
    const maxOffsetY = height * scale / 2 - clientHeight / 2;
    const OffsetX = width * scale > clientWidth ? Math.max(-maxOffsetX, Math.min(maxOffsetX, x * -1 * scale)) : 0;
    const OffsetY = height * scale > clientHeight ? Math.max(-maxOffsetY, Math.min(maxOffsetY, y * -1 * scale)) : 0;

    // The animation duration milliseconds.
    const duration = 200;

    const {
      offsetX: beginOffsetX,
      offsetY: beginOffsetY,
      scaleX: beginScaleX,
      scaleY: beginScaleY,
      fadeInCurrent: beginFadeInCurrent,
      opacity: beginOpacity,
      switchProgress: beginSwitchProgress } = this.state;
    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, OffsetX),
        offsetY: easeOutQuad(current, beginOffsetY, OffsetY),
        scaleX: easeOutQuad(current, beginScaleX, scale),
        scaleY: easeOutQuad(current, beginScaleY, scale),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1),
        opacity: easeOutQuad(current, beginOpacity, 1),
        switchProgress: easeOutQuad(current, beginSwitchProgress, 0)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      } else {
        this.endAnimationFrame();
      }
    };
    this.startAnimationFrame(update);
  }

  public beginFadeInAnimation = () => {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    const beginFadeInCurrent = this.state.fadeInCurrent;
    const beginDate = Date.now();
    const duration = 200;
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
    const duration = 200;
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
      scaleY: 1,
      opacity: 1,
      switchProgress: 0,
      willChange: false
    });
  }

  /**
   * force reset the transform.
   */
  public resetTransform() {
    this.setState({
      ...this.state,
      fadeInCurrent: 1,
      offsetX: 0,
      offsetY: 0,
      scaleX: 1,
      scaleY: 1,
      opacity: 1,
      switchProgress: 0
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
      fadeInCurrent: beginFadeInCurrent,
      opacity: beginOpacity,
      switchProgress: beginSwitchProgress } = this.state;
    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, 0),
        offsetY: easeOutQuad(current, beginOffsetY, 0),
        scaleX: easeOutQuad(current, beginScaleX, 1),
        scaleY: easeOutQuad(current, beginScaleY, 1),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1),
        opacity: easeOutQuad(current, beginOpacity, 1),
        switchProgress: easeOutQuad(current, beginSwitchProgress, 0)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      } else {
        this.endAnimationFrame();
      }
    };
    this.startAnimationFrame(update);
  }

  public stayWithinRange = () => {
    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 150;

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
      fadeInCurrent: beginFadeInCurrent,
      opacity: beginOpacity,
      switchProgress: beginSwitchProgress } = this.state;
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
        targetScaleY = parseFloat((targetScaleX / beginScaleX * beginScaleY).toPrecision(12));
      }
    } else {
      if (beginScaleY < 1) {
        targetScaleY = 1;
        targetScaleX = parseFloat((targetScaleY / beginScaleY * beginScaleX).toPrecision(12));
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
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1),
        opacity: easeOutQuad(current, beginOpacity, 1),
        switchProgress: easeOutQuad(current, beginSwitchProgress, 0)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      } else {
        this.endAnimationFrame();
      }
    };
    this.startAnimationFrame(update);
  }

  public next() {
    if (!this.props.next) { return; }
    const {
      offsetX: beginOffsetX,
      offsetY: beginOffsetY,
      scaleX: beginScaleX,
      scaleY: beginScaleY,
      fadeInCurrent: beginFadeInCurrent,
      opacity: beginOpacity,
      switchProgress: beginSwitchProgress } = this.state;
    const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;

    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 150;

    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, -clientWidth),
        offsetY: easeOutQuad(current, beginOffsetY, 0),
        scaleX: easeOutQuad(current, beginScaleX, 1),
        scaleY: easeOutQuad(current, beginScaleY, 1),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1),
        opacity: easeOutQuad(current, beginOpacity, 1),
        switchProgress: easeOutQuad(current, beginSwitchProgress, 1)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      } else {
        this.endAnimationFrame();
        if (typeof this.props.onNext === 'function') {
          this.props.onNext(this.props.next);
        }
      }
    };
    this.startAnimationFrame(update);
  }

  public prev() {
    if (!this.props.prev) { return; }
    const {
      offsetX: beginOffsetX,
      offsetY: beginOffsetY,
      scaleX: beginScaleX,
      scaleY: beginScaleY,
      fadeInCurrent: beginFadeInCurrent,
      opacity: beginOpacity,
      switchProgress: beginSwitchProgress } = this.state;

    const startTime = Date.now();

    // The animation duration milliseconds.
    const duration = 150;

    const update = () => {
      const current = Math.min((Date.now() - startTime) / duration, 1);
      this.setState({
        ...this.state,
        offsetX: easeOutQuad(current, beginOffsetX, 0),
        offsetY: easeOutQuad(current, beginOffsetY, 0),
        scaleX: easeOutQuad(current, beginScaleX, 0.5),
        scaleY: easeOutQuad(current, beginScaleY, 0.5),
        fadeInCurrent: easeOutQuad(current, beginFadeInCurrent, 1),
        opacity: easeOutQuad(current, beginOpacity, 0),
        switchProgress: easeOutQuad(current, beginSwitchProgress, -1)
      });
      if (current !== 1) {
        this.contentAnimationRequest = requestAnimationFrame(update);
      } else {
        this.endAnimationFrame();
        if (typeof this.props.onPrev === 'function') {
          this.props.onPrev(this.props.prev);
        }
      }
    };
    this.startAnimationFrame(update);
  }

  private startAnimationFrame = (c: FrameRequestCallback) => {
    if (typeof this.contentAnimationRequest !== 'undefined') {
      cancelAnimationFrame(this.contentAnimationRequest);
    }
    this.contentAnimationRequest = requestAnimationFrame(c);
    this.willChange();
  }

  private endAnimationFrame = () => {
    this.contentAnimationRequest = undefined;
    this.willNotChange();
  }

  private willChange = () => {
    if (!this.state.willChange) {
      this.setState({
        ...this.state,
        willChange: true
      });
    }
  }

  /**
   * @function
   */
  // tslint:disable-next-line:member-ordering
  private willNotChange = debounce(() => {
    if (this.state.willChange) {
      this.setState({
        ...this.state,
        willChange: false
      });
    }
  }, 100);

  private handleTouch = async () => {
    let lastTapDate = 0;
    while (true) {
      const { event, touches, changedTouches } = await this.touchEventManager.getNextUpdateEvent();
      if (event.type === 'touchmove' && isSingleFinger(touches) && this.state.scaleX <= 1 && this.state.scaleY <= 1) {
        if (getTotalDistanceMoved(changedTouches) > 5) {
          if (isHorizontal(getFirstFinger(touches))) {
            const { x, y } = getMoveDistance(changedTouches);
            const maxScale = 0.5;
            const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;
            const progress = Math.max(-1, Math.min(1,
              -1 * (this.state.offsetX / clientWidth) -
              (1 - this.state.scaleX) / (1 - maxScale) +
              -1 * x / clientWidth
            ));
            this.startAnimationFrame(() => {
              this.setState({
                ...this.state,
                offsetX: progress > 0 ? -1 * progress * clientWidth : 0,
                offsetY: 0,
                scaleX: progress < 0 ? 1 - Math.abs(progress) * (1 - maxScale) : 1,
                scaleY: progress < 0 ? 1 - Math.abs(progress) * (1 - maxScale) : 1,
                fadeInCurrent: 1,
                opacity: progress < 0 ? 1 - Math.abs(progress) : 1,
                switchProgress: progress
              });
              this.endAnimationFrame();
            });
          } else {
            const { x, y } = getMoveDistance(changedTouches);
            const offsetX = this.state.offsetX + x;
            const offsetY = this.state.offsetY + y;
            const distance = Math.abs(offsetY);

            const exitCurrent = Math.max(0, Math.min(1, distance / 200));

            this.startAnimationFrame(() => {
              this.setState({
                ...this.state,
                offsetX,
                offsetY,
                fadeInCurrent: 1 - exitCurrent,
                opacity: 1,
                switchProgress: 0
              });
              this.endAnimationFrame();
            });
          }
        }
      } else if (event.type === 'touchmove' && isSingleFinger(touches)) {
        // If only one finger touches
        if (getTotalDistanceMoved(changedTouches) > 5) {
          const { x, y } = getMoveDistance(changedTouches);
          this.startAnimationFrame(() => {
            this.setState({
              ...this.state,
              offsetX: this.state.offsetX + x,
              offsetY: this.state.offsetY + y,
              fadeInCurrent: 1,
              opacity: 1,
              switchProgress: 0
            });
            this.endAnimationFrame();
          });
        }
      } else if (event.type === 'touchmove' && isMultipleFingers(touches)) {
        // If there are multiple fingers touching.
        if (getTotalDistanceMoved(changedTouches) > 5) {
          const clientHeight = this.contentLayoutElement.getBoundingClientRect().height;
          const clientWidth = this.contentLayoutElement.getBoundingClientRect().width;

          // Fingers scaling.
          const scalingRatio = getScaling(touches);
          const { x: centerX, y: centerY } = getTouchesCenter(getTouches(touches));

          const centerOffsetX = -(centerX - (clientWidth / 2)) * (scalingRatio - 1) * this.state.scaleX;
          const centerOffsetY = -(centerY - (clientHeight / 2)) * (scalingRatio - 1) * this.state.scaleY;

          const { x, y } = getMoveDistance(changedTouches);
          this.startAnimationFrame(() => {
            this.setState({
              ...this.state,
              scaleX: this.state.scaleX * scalingRatio,
              scaleY: this.state.scaleY * scalingRatio,
              offsetX: this.state.offsetX + x + centerOffsetX,
              offsetY: this.state.offsetY + y + centerOffsetY,
              fadeInCurrent: 1,
              opacity: 1,
              switchProgress: 0
            });
            this.endAnimationFrame();
          });
        }
      } else if (isSingleTap(touches, changedTouches)) {
        if (Date.now() - lastTapDate < 300) {
          // dooble tap
          if (this.state.scaleX === 1 && this.state.scaleY === 1) {
            const { x, y } = getTouchesCenter(getTouches(changedTouches));
            const childrenElement = this.contentLayoutElement.firstElementChild;
            const clientRect = childrenElement.getBoundingClientRect();

            this.enlarge(x - clientRect.left, y - clientRect.top);
          } else {
            this.returnOrigin();
          }
        }
        lastTapDate = Date.now();
      } else {
        if (this.props.prev && this.state.switchProgress < -0.5) {
          this.prev();
        } else if (this.props.next && this.state.switchProgress > 0.5) {
          this.next();
        } else if (this.state.fadeInCurrent < 0.5) {
          this.props.onClickBackButton(null);
        } else {
          this.stayWithinRange();
        }
      }
      event.preventDefault();
    }
  }

  private handleContentRootRef = (el: HTMLElement) => this.contentLayoutElement = el;
  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children,
      mountNode,
      onClickBackButton,
      next: nextProp,
      prev: prevProp,
      prevIdentifier,
      nextIdentifier,
      identifier
    } = this.props;
    const PureAppbar = pure(() => (
      <Appbar
        titleText={this.props.title}
        color='#fff'
        leftIcon={<IconButton onClick={onClickBackButton} icon={<ArrawBack fill='#fff' />} />}
      />
    ));
    const PureBackground = pure(() => (
      <span style={styles.bg} />
    ));
    const content = children && (
      <ContentLayout
        enable
        onTouchCancel={this.touchEventManager.handleTouchEvent}
        onTouchEnd={this.touchEventManager.handleTouchEvent}
        onTouchMove={this.touchEventManager.handleTouchEvent}
        onTouchStart={this.touchEventManager.handleTouchEvent}
        rootref={this.handleContentRootRef}
        scaleX={this.state.scaleX}
        scaleY={this.state.scaleY}
        offsetX={this.state.offsetX + 'px'}
        offsetY={this.state.offsetY + 'px'}
        willChange={this.state.willChange}
        opacity={this.state.opacity}
        identifier={identifier}
      >
        {children}
      </ContentLayout>
    );
    const next = nextProp && (
      <ContentLayout
        enable
        scaleX={0.5 + Math.abs(this.state.switchProgress) * (1 - 0.5)}
        scaleY={0.5 + Math.abs(this.state.switchProgress) * (1 - 0.5)}
        willChange={this.state.switchProgress > 0}
        opacity={this.state.switchProgress}
        identifier={nextIdentifier}
      >
        {nextProp}
      </ContentLayout>
    );
    const prev = prevProp && (
      <ContentLayout
        enable
        offsetX={(-1 - this.state.switchProgress) * 100 + '%'}
        opacity={this.state.switchProgress < 0 ? 1 : 0}
        willChange={this.state.switchProgress < 0}
        identifier={prevIdentifier}
      >
        {prevProp}
      </ContentLayout>
    );
    return ReactDOM.createPortal(
      <ViewerLayout
        bg={<PureBackground />}
        nav={this.props.title && <PureAppbar />}
        fadeInCurrent={this.state.fadeInCurrent}
        next={next}
        prev={prev}
        style={{ ...styles.root, visibility: !this.state.display && 'hidden' }}
      >
        {content}
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
