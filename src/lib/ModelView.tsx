import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ViewerLayout from './ViewerLayout';
import ContentLayout from './ContentLayout';
import { easeOutCubic, easeInCubic } from '../utils/easing';
import Appbar from '../Components/Appbar';
import IconButton from '../Components/Icons/IconButton';
import ArrawBack from '../Components/Icons/ArrawBack';

export interface ModelViewProps {
  /**
   * The element you want mount to.
   * Viewer will be injected into it.
   *
   * @type {HTMLElement}
   */
  mountNode: HTMLElement;
  onClickBackButton?: React.ReactEventHandler<HTMLButtonElement>;
}

/**
 * Modal image viewer. Full page.
 *
 * @class
 */
export default class ModelView extends React.PureComponent<ModelViewProps> {
  animationRequest: number;
  bgElement: HTMLSpanElement;

  state = {
    fadeInCurrent: 0,
    hasShow: false,
    display: false
  };

  public beginFadeInAnimation = () => {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    const beginDate = Date.now();
    const duration = 250;
    const animationUpdate = () => {
      const currentTime = Date.now() - beginDate;
      const current = easeOutCubic(currentTime / duration, 0, 1);
      this.setState({
        ...this.state,
        fadeInCurrent: current,
        hasShow: true,
        display: true
      });
      if (currentTime < duration) {
        this.animationRequest = requestAnimationFrame(animationUpdate);
      }
    };
    this.animationRequest = requestAnimationFrame(animationUpdate);
  }

  public beginFadeOutAnimation = () => {
    if (this.animationRequest) {
      cancelAnimationFrame(this.animationRequest);
    }
    const beginDate = Date.now();
    const duration = 250;
    const animationUpdate = () => {
      const currentTime = Date.now() - beginDate;
      const current = 1 - easeInCubic(currentTime / duration, 0, 1);
      this.setState({
        ...this.state,
        fadeInCurrent: current,
        hasShow: false,
        display: currentTime < duration
      });
      if (currentTime < duration) {
        this.animationRequest = requestAnimationFrame(animationUpdate);
      }
    };
    this.animationRequest = requestAnimationFrame(animationUpdate);
  }

  // handleClickBack: React.ReactEventHandler<HTMLButtonElement> = (e) => {
  //   this.setState({

  //   })
  // };

  componentDidMount() {
    if (this.state.hasShow !== !!this.props.children) {
      if (!!this.props.children) {
        this.beginFadeInAnimation();
      } else {
        this.beginFadeOutAnimation();
      }
    }
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.animationRequest);
  }

  componentWillReceiveProps(nextProps: { children: React.ReactNode } & ModelViewProps) {
    if (this.state.hasShow !== !!nextProps.children) {
      if (!!nextProps.children) {
        this.beginFadeInAnimation();
      } else {
        this.beginFadeOutAnimation();
      }
    }
  }

  public render() {
    const {
      children,
      mountNode,
      onClickBackButton
    } = this.props;
    const appbar = (
      <Appbar
        titleText='Seesee 图片查看器'
        color='#fff'
        leftIcon={<IconButton onClick={onClickBackButton} icon={<ArrawBack fill='#fff' />} />}
      />
    );
    return ReactDOM.createPortal(
      <ViewerLayout
        bg={<span ref={c => this.bgElement = c} style={styles.bg} />}
        nav={appbar}
        fadeInCurrent={this.state.fadeInCurrent}
        style={{ ...styles.root, visibility: !this.state.display && 'hidden' }}
      >
        <ContentLayout enable>
          {children}
        </ContentLayout>
      </ViewerLayout>,
      mountNode
    );
  }
}

const styles: { [key: string]: React.CSSProperties } = {
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
    willChange: 'opacity'
  }
};
