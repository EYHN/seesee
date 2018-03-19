import * as React from 'react';
import { easeInOutQuad } from '../utils/easing';

export interface ViewerLayoutProps {
  style?: React.CSSProperties;
  nav?: React.ReactNode;
  content?: React.ReactNode;
  bottom?: React.ReactNode;
  bg?: React.ReactNode;
  className?: string;
  fadeInCurrent?: number;
}

/**
 * Management components layout.
 *
 * It has a navigation bar, content area, background and bottom navigation.
 */
const ViewerLayout: React.SFC<ViewerLayoutProps> = ({
  children,
  nav,
  content,
  bottom,
  bg,
  style,
  fadeInCurrent,
  className
}) => {
  const backgroundStyle: React.CSSProperties = {
    ...styles.bg,
    opacity: fadeInCurrent
  };
  const navStyle: React.CSSProperties = {
    ...styles.nav,
    transform: `translateY(${(fadeInCurrent - 1) * 100}%)`
  };
  return (
    <div style={{...styles.root, ...style}} className={className}>
      <div role='background' style={backgroundStyle}>{bg}</div>
      <nav style={navStyle}>{nav}</nav>
      <div style={styles.content} role='content'>
        {children}
      </div>
      <footer style={styles.footer}>{bottom}</footer>
    </div>
  );
};

export default ViewerLayout;

const styles: {[key: string]: React.CSSProperties} = {
  root: {
    position: 'relative',
    height: '100%',
    width: '100%'
  },
  bg: {
    position: 'absolute',
    zIndex: -1,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  content: {
    flexGrow: 1,
    flexShrink: 1,
    width: '100%',
    height: '100%',
    zIndex: 0
  },
  nav: {
    flexShrink: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    zIndex: 1
  },
  footer: {
    flexShrink: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 1
  }
};
