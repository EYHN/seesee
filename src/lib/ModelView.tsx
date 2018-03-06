import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ViewerLayout from './ViewerLayout';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import ContentLayout from './ContentLayout';

export interface ModelViewProps {
  /**
   * The element you want mount to.
   * Viewer will be injected into it.
   *
   * @type {HTMLElement}
   */
  mountNode: HTMLElement;
  childrenElement: HTMLElement;
}

/**
 * Modal image viewer. Full page.
 *
 * @class
 */
export default class ModelView extends React.PureComponent<ModelViewProps> {

  public render() {
    const {
      children,
      childrenElement,
      mountNode
    } = this.props;
    return ReactDOM.createPortal(
      <ViewerLayout
        bg={<span className={css(styles.bg)} />}
        className={css(styles.root)}
      >
        <ContentLayout childrenElement={childrenElement} enable>
          {children}
        </ContentLayout>
      </ViewerLayout>,
      mountNode
    );
  }
}

const fadeInAnimation: StyleDeclaration = {
  '0%': {
    opacity: 0
  },
  '100%': {
    opacity: 1
  }
};

const styles = StyleSheet.create({
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
    transition: 'opacity 0.25s cubic-bezier(0, 0, .2, 1)',
    animationName: [fadeInAnimation],
    animationDuration: '.25s',
    animationTimingFunction: 'cubic-bezier(0, 0, .2, 1)'
  }
});
