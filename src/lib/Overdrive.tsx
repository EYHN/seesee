import * as React from 'react';
import * as ReactDOM from 'react-dom';

export interface OverdriveProps {
  id: string;
  element?: string;
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
   * Delay milliseconds before the animation.
   */
  animationDelay?: number;
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

export default class Overdrive extends React.Component<OverdriveProps> {

  state = {
    loading: true
  };

  bodyElement: HTMLDivElement;
  animationTimeout: number;
  animationDelayTimeout: number;
  element: HTMLElement;
  onShowLock: boolean;

  constructor(props: OverdriveProps) {
    super(props);
  }

  animate(prevPosition: OverdrivePosition, prevElement: React.ReactElement<any>) {
    const { duration = 200 } = this.props;

    prevPosition.top += (window.pageYOffset || document.documentElement.scrollTop);
    const nextPosition = this.getPosition(true);
    const noTransform = 'scaleX(1) scaleY(1) translateX(0px) translateY(0px)';
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

    const transition = {
      // tslint:disable-next-line:max-line-length
      transition: `transform ${duration / 1000}s cubic-bezier(0, 0, .2, 1), opacity ${duration / 1000}s cubic-bezier(0, 0, .2, 1)`,
      transformOrigin: '0 0 0'
    };

    const sourceStart = React.cloneElement(prevElement, {
      key: '1',
      style: {
        ...transition,
        ...prevPosition,
        opacity: 1,
        transform: noTransform,
        zIndex: 1000
      }
    });

    const sourceEnd = React.cloneElement(prevElement, {
      key: '1',
      style: {
        ...transition,
        ...prevPosition,
        margin: nextPosition.margin,
        opacity: 1,
        transform: `matrix(${1 / targetScaleX}, 0, 0, ${1 / targetScaleY}, ${-targetTranslateX}, ${-targetTranslateY})`,
        zIndex: 1000
      }
    });

    const start = <div>{sourceStart}</div>;
    const end = <div>{sourceEnd}</div>;

    this.setState({ loading: true });

    const bodyElement = document.createElement('div');
    window.document.body.appendChild(bodyElement);
    this.bodyElement = bodyElement;
    renderSubtreeIntoContainer(this, start, bodyElement);

    this.animationTimeout = requestAnimationFrame(() => {
      renderSubtreeIntoContainer(this, end, bodyElement);
      this.animationTimeout = setTimeout(this.animateEnd, duration);
    });
  }

  animateEnd = () => {
    this.animationTimeout = null;
    this.setState({ loading: false });
    if (this.props.onAnimationEnd) {
      this.props.onAnimationEnd();
    }
    if (this.bodyElement) {
      window.document.body.removeChild(this.bodyElement);
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
      components[id] = null;
      if (animationDelay) {
        this.animationDelayTimeout = setTimeout(this.animate.bind(this, prevPosition, prevElement), animationDelay);
      } else {
        requestAnimationFrame(() => this.animate(prevPosition, prevElement));
      }
    } else {
      this.setState({ loading: false });
    }
  }

  componentDidMount() {
    this.onShow();
  }

  clearAnimations() {
    clearTimeout(this.animationDelayTimeout);
    clearTimeout(this.animationTimeout);

    if (this.animationTimeout) {
      this.animateEnd();
    }
  }

  componentWillUnmount() {
    this.onHide();
  }

  componentWillReceiveProps() {
    this.onShowLock = false;
    this.onHide();
  }

  componentDidUpdate() {
    this.onShow();
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
    const { id, duration = 200, animationDelay, style = {}, children, element = 'div', ...rest } = this.props;
    const newStyle = {
      ...style,
      opacity: (this.state.loading ? 0 : 1)
    };
    const onlyChild = React.Children.only(children);

    return React.createElement(
      element,
      {
        ref: c => (this.element = c && c.firstChild as HTMLElement),
        style: newStyle,
        ...rest
      },
      onlyChild
    );
  }
}
