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
}

export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
  prevTouchList: TouchList;

  // s: 'height' | 'width';

  // componentDidMount() {
  //   window.addEventListener('resize', this.handleWindowResize);
  // }

  // componentWillUnmount() {
  //   window.removeEventListener('resize', this.handleWindowResize);
  // }

  private handleRef: React.Ref<HTMLElement> = (el) => {
    if (!el) { return; }
    el.addEventListener('touchstart', this.props.onTouchStart, { passive: false });
    el.addEventListener('touchend', this.props.onTouchEnd, { passive: false });
    el.addEventListener('touchmove', this.props.onTouchMove, { passive: false });
    el.addEventListener('touchcancel', this.props.onTouchCancel, { passive: false });
    if (typeof this.props.rootref === 'function') {
      this.props.rootref(el);
    }
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children: childrenProps,
      style: styleProp,
      scaleX = 0,
      scaleY = 0,
      offsetX = 0,
      offsetY = 0
    } = this.props;
    if (!childrenProps) { return <div style={styles.root} />; }
    React.Children.only(childrenProps);
    if (React.isValidElement(childrenProps)) {
      const children = React.cloneElement(childrenProps as any, {
        style: {
          ...(childrenProps as any).props.style,
          maxHeight: '100%',
          maxWidth: '100%',
          width: '100vh',
          // tslint:disable-next-line:max-line-length
          transform: `matrix(${scaleX}, 0, 0, ${scaleY}, ${offsetX}, ${offsetY})`
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
