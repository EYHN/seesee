import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';

export interface ContentLayoutProps {
  childrenElement: HTMLElement;
  enable: boolean;
  style?: React.CSSProperties;
}

export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
  public render() {
    const {
      children
    } = this.props;
    return (
      <div className={css(styles.root)}>
        <span className={css(styles.content)}>
          {children}
        </span>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  root: {
    display: 'flex',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  content: {
    display: 'inline-block',
    lineHeight: 0
  }
});
