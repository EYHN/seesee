import * as React from 'react';
import { pure } from 'recompose';

export interface AppbarProps {
  leftIcon?: React.ReactNode;
  titleText?: React.ReactNode;
  rightIcon?: React.ReactNode | React.ReactNode[];
  color?: string;
}

const Appbar: React.SFC<AppbarProps> = ({ leftIcon, titleText, rightIcon, color }) => (
    <div style={styles.root}>
      {leftIcon}
      <span style={{...styles.title, color}}>
        {titleText}
      </span>
      <span style={styles.full} />
      {rightIcon}
    </div>
);

const styles: {[key: string]: React.CSSProperties} = {
  root: {
    display: 'flex',
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    minHeight: '56px',
    boxSizing: 'border-box',
    color: '#fff',
    background: 'rgba(0,0,0,.6)'
  },
  full: {
    flexGrow: 1
  },
  title: {
    position: 'absolute',
    left: '72px',
    fontFamily: 'Roboto-medium',
    fontSize: '20px',
    lineHeight: '28px',
    color: 'rgba(0,0,0,.87)',
    fontWeight: 'normal'
  }
};

export default pure(Appbar);
