import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { lerp, easeOutQuad, easeInQuad, easeOutBack } from '../utils/easing';

export interface OverdriveProps {
  id: string;
  /**
   * The event of animation end.
   */
  onAnimationEnd?: () => void;
  style?: React.CSSProperties;
  /**
   * The animation duration milliseconds.
   */
  duration?: number;
  /**
   * Delay before the animation.
   */
  animationDelay?: boolean;
  /**
   * Prevent browsers from scrolling.
   */
  lockscroll?: boolean;
}

export interface OverdrivePosition {
  top: number;
  left: number;
  width: number;
  height: number;
  margin: string;
  padding: string;
  borderRadius: string;
  position: 'absolute';
}

const renderSubtreeIntoContainer = ReactDOM.unstable_renderSubtreeIntoContainer;
const components: { [id: string]: { prevPosition: OverdrivePosition; prevElement: React.ReactElement<any> } } = {};

export default class Overdrive extends React.PureComponent<OverdriveProps> {

  state = {
    loading: true
  };

  bodyElement: HTMLDivElement;
  animationRequest: number;
  element: HTMLElement;
  onShowLock: boolean;
  onAnimateDelay: boolean;

  constructor(props: OverdriveProps) {
    super(props);
  }

  animate(prevPosition: OverdrivePosition, prevElement: React.ReactElement<any>) {
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

    const subtree: React.SFC<{ style: React.CSSProperties; ref?: React.Ref<HTMLSpanElement> }> = ({ style, ref }) => {
      const children = React.cloneElement(prevElement, {
        style: {
          ...prevElement.props.style,
          width: '100%',
          height: '100%'
        }
      });
      return (
        <span
          key='1'
          ref={ref}
          style={style}
        >
        {children}
        </span>
      );
    };

    const startAnimation = (element: HTMLElement) => {
      const beginDate = Date.now();
      const prevOverflow = document.body.style.overflow;
      const animationUpdate = () => {
        const currentTime = Date.now() - beginDate;
        const current = currentTime / duration;
        const scaleX = easeOutBack(current, 1, 1 / targetScaleX);
        const scaleY = easeOutBack(current, 1, 1 / targetScaleY);
        const translateX = targetTranslateY < 0 ?
          easeOutBack(current, 0, -targetTranslateX) : easeOutBack(current, 0, -targetTranslateX);
        const translateY = targetTranslateY < 0 ?
          easeOutBack(current, 0, -targetTranslateY) : easeOutBack(current, 0, -targetTranslateY);
        element.style.transform = `matrix(${scaleX}, 0, 0, ${scaleY}, ${translateX}, ${translateY})`;
        if (current < 1) {
          this.animationRequest = requestAnimationFrame(animationUpdate);
        } else {
          this.animateEnd();
        }
      };
      this.animationRequest = requestAnimationFrame(animationUpdate);
    };

    renderSubtreeIntoContainer(this, subtree({
      style: {
        ...prevPosition,
        margin: 0,
        opacity: 1,
        zIndex: 1001,
        transform: 'scaleX(1) scaleY(1) translateX(0px) translateY(0px)',
        transformOrigin: '0 0 0',
        willChange: 'transform'
      },
      ref: (c) => startAnimation(c)
    }), bodyElement);
  }

  animateEnd = () => {
    this.onAnimateDelay = false;
    this.setState({ loading: false });
    if (this.props.onAnimationEnd) {
      this.props.onAnimationEnd();
    }
    this.clearAnimations();
    if (this.bodyElement) {
      window.document.body.removeChild(this.bodyElement);
      this.bodyElement = null;
    }
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
      if (animationDelay) {
        this.onAnimateDelay = true;
        this.onShowLock = false;
      } else {
        components[id] = null;
        this.animate(prevPosition, prevElement);
      }
    } else {
      this.setState({ loading: false });
    }
  }

  componentDidUpdate() {
    if (!this.props.animationDelay && this.onAnimateDelay === true) {
      this.onAnimateDelay = false;
      this.onShow();
    }
  }

  componentDidMount() {
    this.onShow();
  }

  clearAnimations() {
    cancelAnimationFrame(this.animationRequest);
  }

  componentWillUnmount() {
    this.onHide();
  }

  getPosition(addOffset: boolean): OverdrivePosition {
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
    const { id, duration = 200, animationDelay, style = {}, children, ...rest } = this.props;
    const onlyChild = React.Children.only(children);

    const newStyle: React.CSSProperties = {
      ...onlyChild.props.style,
      ...style
    };

    if (this.state.loading) {
      newStyle.willChange = 'opacity';
      newStyle.opacity = 0;
    }

    return React.cloneElement(
      onlyChild,
      {
        ref: (c: HTMLElement) => (this.element = c as HTMLElement),
        style: newStyle,
        ...rest
      }
    );
  }
}
