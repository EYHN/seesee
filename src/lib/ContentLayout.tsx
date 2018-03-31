import * as React from 'react';

function squareWithSigned(x: number) {
  return x < 0 ? -Math.pow(x, 2) : Math.pow(x, 2);
}

export interface ContentLayoutProps {
  enable: boolean;
  style?: React.CSSProperties;
  onTouchStart?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchMove?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchEnd?: (this: ApplicationCache, ev: TouchEvent) => any;
  onTouchCancel?: (this: ApplicationCache, ev: TouchEvent) => any;
  rootref?: React.Ref<HTMLElement>;
  scaleX?: number;
  scaleY?: number;
  offsetX?: number;
  offsetY?: number;
  willChange?: boolean;
}

export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
  prevTouchList: TouchList;
  rootElement: HTMLElement;

  state = {
    childrenReady: false,
    childrenRatio: 1,
    childrenWidth: '',
    childrenHeight: '',
    onAnimation: false
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleWindowResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  private handleWindowResize = (e: UIEvent) => {
    if (this.state.childrenReady) {
      const {height, width} = this.getChildrenSize(this.state.childrenRatio);
      this.setState({
        ...this.state,
        childrenHeight: height,
        childrenWidth: width
      });
    }
  }

  private updateChildrenRatio() {
    if (!this.rootElement) { return; }
    const rect = this.rootElement.firstElementChild.getBoundingClientRect();
    const ratio = rect.width / rect.height;
    const {height, width} = this.getChildrenSize(ratio);
    this.setState({
      ...this.state,
      childrenReady: true,
      childrenRatio: ratio,
      childrenHeight: height,
      childrenWidth: width
    });
  }

  private handleRef: React.Ref<HTMLElement> = (el) => {
    if (!el) { return; }
    this.rootElement = el;
    el.addEventListener('touchstart', this.props.onTouchStart, { passive: false });
    el.addEventListener('touchend', this.props.onTouchEnd, { passive: false });
    el.addEventListener('touchmove', this.props.onTouchMove, { passive: false });
    el.addEventListener('touchcancel', this.props.onTouchCancel, { passive: false });
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
      scaleX = 0,
      scaleY = 0,
      offsetX = 0,
      offsetY = 0,
      willChange = false
    } = this.props;
    if (!childrenProps) { return <div style={styles.root} />; }
    const childrenStyle: React.CSSProperties = {
      ...(childrenProps as any).props.style,
      maxWidth: '100%',
      transform: `matrix(${scaleX}, 0, 0, ${scaleY}, ${offsetX}, ${offsetY})`
    };
    if (this.state.childrenWidth && this.state.childrenHeight) {
      childrenStyle.width = this.state.childrenWidth;
      childrenStyle.maxWidth = '100%';
      childrenStyle.height = this.state.childrenHeight;
      childrenStyle.maxHeight = '100%';
    }
    if (willChange) {
      childrenStyle.willChange = 'transform';
    }
    React.Children.only(childrenProps);
    if (React.isValidElement(childrenProps)) {
      const children = React.cloneElement(childrenProps as any, {
        style: childrenStyle,
        onLoad: (...args: any[]) => {
          this.updateChildrenRatio();
          if (typeof (childrenProps.props as any).onLoad === 'function') {
            (childrenProps.props as any).onLoad(...args);
          }
        },
        animationDelay: !this.state.childrenReady
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
