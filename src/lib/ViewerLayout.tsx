import * as React from 'react';

export interface ViewerLayoutProps {
  style?: React.CSSProperties;
  nav?: React.ReactNode;
  content?: React.ReactNode;
  bottom?: React.ReactNode;
  bg?: React.ReactNode;
  className?: string;
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
  className
}) => (
  <div style={{...styles.root, ...style}} className={className}>
    <div role='background' style={styles.bg}>{bg}</div>
    <nav style={styles.nav}>{nav}</nav>
    <div style={styles.content} role='content'>
      {children}
    </div>
    <footer style={styles.footer}>{bottom}</footer>
  </div>
);

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
    height: '100%'
  },
  nav: {
    flexShrink: 0,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%'
  },
  footer: {
    flexShrink: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '100%'
  }
};
