import * as React from 'react';
import Overdrive from '../Components/Overdrive';

export interface ContentLayoutProps {
  enable: boolean;
  style?: React.CSSProperties;
  onTouchStart?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchMove?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchEnd?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchCancel?: (this: ApplicationCache, ev: TouchEvent) => any;
  onWheel?: (this: ApplicationCache, ev: WheelEvent) => any;
  onMouseDown?: (this: ApplicationCache, ev: MouseEvent) => any;
  onMouseMove?: (this: ApplicationCache, ev: MouseEvent) => any;
  onMouseUp?: (this: ApplicationCache, ev: MouseEvent) => any;
  onMouseOver?: (this: ApplicationCache, ev: MouseEvent) => any;
  onMouseEnter?: (this: ApplicationCache, ev: MouseEvent) => any;
  onMouseLeave?: (this: ApplicationCache, ev: MouseEvent) => any;
  rootref?: React.Ref<HTMLElement>;
  scaleX?: number;
  scaleY?: number;
  containerOffsetX?: string;
  containerOffsetY?: string;
  offsetX?: string;
  offsetY?: string;
  opacity?: number;
  willChange?: boolean;
  identifier?: string;
}

const ratioCache: Map<string, {
  childrenRatio: number;
}> = new Map();

export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
  prevTouchList: TouchList;
  rootElement: HTMLElement;

  state = {
    childrenReady: false,
    childrenRatio: 1,
    childrenWidth: '',
    childrenHeight: ''
  };

  constructor(props: ContentLayoutProps) {
    super(props);
    this.state = {
      ...this.state
    };
  }

  componentWillReceiveProps(nextProps: { children: React.ReactNode } & ContentLayoutProps) {
    if (nextProps.children !== this.props.children) {
      this.setState({
        childrenReady: false,
        childrenRatio: 1,
        childrenWidth: '',
        childrenHeight: ''
      });
    }
  }

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
    if (this.rootElement) {
      this.rootElement.removeEventListener('touchstart', this.props.onTouchStart);
      this.rootElement.removeEventListener('touchend', this.props.onTouchEnd);
      this.rootElement.removeEventListener('touchmove', this.props.onTouchMove);
      this.rootElement.removeEventListener('touchcancel', this.props.onTouchCancel);
      this.rootElement.removeEventListener('wheel', this.props.onWheel);
    }
  }

  private handleWindowResize = (e: UIEvent) => {
    if (this.state.childrenReady) {
      this.updateSize();
    }
  }

  private updateSize = () => {
    if (this.state.childrenReady) {
      const { height, width } = this.getChildrenSize(this.state.childrenRatio);
      this.setState({
        ...this.state,
        childrenHeight: height,
        childrenWidth: width
      });
      if (this.props.identifier) {
        ratioCache.set(this.props.identifier, {
          ...ratioCache.get(this.props.identifier)
        });
      }
    }
  }

  private updateChildrenRatio() {
    if (!this.rootElement) { return; }
    const children = this.rootElement.firstElementChild;
    let ratio;
    const rect = children.getBoundingClientRect();
    ratio = rect.width / rect.height;
    const { height, width } = this.getChildrenSize(ratio);
    this.setState({
      ...this.state,
      childrenReady: true,
      childrenRatio: ratio,
      childrenHeight: height,
      childrenWidth: width
    });
    if (this.props.identifier) {
      ratioCache.set(this.props.identifier, {
        childrenRatio: ratio
      });
    }
  }

  private findCache(identifier: string) {
    const style = ratioCache.get(identifier);
    if (typeof style !== 'object') { return; }
    const { height, width } = this.getChildrenSize(style.childrenRatio);
    return {
      childrenReady: true,
      ...style,
      childrenHeight: height,
      childrenWidth: width
    };
  }

  private handleChildComplete = () => {
    if (this.state.childrenReady) {
      this.updateSize();
    } else {
      this.updateChildrenRatio();
    }
  }

  private handleRef: React.Ref<HTMLElement> = (el) => {
    if (!el) { return; }
    this.rootElement = el;
    el.addEventListener('touchstart', this.props.onTouchStart, { passive: false });
    el.addEventListener('touchend', this.props.onTouchEnd, { passive: false });
    el.addEventListener('touchmove', this.props.onTouchMove, { passive: false });
    el.addEventListener('touchcancel', this.props.onTouchCancel, { passive: false });
    el.addEventListener('wheel', this.props.onWheel, { passive: false });
    el.addEventListener('mousedown', this.props.onMouseDown);
    el.addEventListener('mouseenter', this.props.onMouseEnter);
    el.addEventListener('mouseleave', this.props.onMouseLeave);
    el.addEventListener('mousemove', this.props.onMouseMove);
    el.addEventListener('mouseover', this.props.onMouseOver);
    el.addEventListener('mouseup', this.props.onMouseUp);
    const child = el.firstElementChild;
    let cache;
    if (this.props.identifier) {
      cache = this.findCache(this.props.identifier);
    }
    if (cache) {
      this.setState({
        ...this.state,
        ...cache
      });
    } else if (child instanceof HTMLImageElement) {
      if (child.complete === true) {
        this.handleChildComplete();
      }
      child.addEventListener('onload', this.handleChildComplete);
    }
    if (typeof this.props.rootref === 'function') {
      this.props.rootref(el);
    }
  }

  private getChildrenSize(ratio: number) {
    const clientHeight = this.rootElement.getBoundingClientRect().height;
    const clientWidth = this.rootElement.getBoundingClientRect().width;
    const clientRatio = clientWidth / clientHeight;
    const childrenRatio = ratio;
    return clientRatio > childrenRatio ? {
      height: '100vh',
      width: 'auto'
    } : {
        width: '100vw',
        height: 'auto'
      };
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children: childrenProps,
      style: styleProp,
      scaleX = 1,
      scaleY = 1,
      offsetX = '0px',
      offsetY = '0px',
      containerOffsetX = '0px',
      containerOffsetY = '0px',
      opacity = 1,
      willChange = false
    } = this.props;
    const containerStyle = {
      ...styles.root,
      ...styleProp,
      transform: `translate(${containerOffsetX}, ${containerOffsetY})`
    };
    if (!childrenProps) { return <div style={containerStyle} />; }
    React.Children.only(childrenProps);
    if (React.isValidElement(childrenProps)) {
      const childrenStyle: React.CSSProperties = {
        opacity,
        ...(childrenProps as any).props.style
      };
      if (this.state.childrenReady) {
        childrenStyle.transform = `translate(${offsetX}, ${offsetY})` +
          `scale(${scaleX}, ${scaleY}) `;
        childrenStyle.maxWidth = '100%';
      }
      if (this.state.childrenWidth && this.state.childrenHeight) {
        childrenStyle.width = this.state.childrenWidth;
        childrenStyle.maxWidth = '100%';
        childrenStyle.height = this.state.childrenHeight;
        childrenStyle.maxHeight = '100%';
      }
      if (willChange) {
        childrenStyle.willChange = 'transform, opacity';
      }
      const children = React.cloneElement(childrenProps as any, {
        style: childrenStyle,
        ...childrenProps.type === Overdrive && {
          animationDelay: !this.state.childrenReady
        }
      });
      return (
        <div
          style={containerStyle}
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
