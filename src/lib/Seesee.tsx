import * as React from 'react';
import ModelView from './ModelView';
import Overdrive from './Overdrive';

const modelViewMountNode = document.body;

export interface SeeseeProps {
  open: boolean;
}

export default class Seesee extends React.PureComponent<SeeseeProps> {

  childrenElement: HTMLElement;

  public render() {
    const {
      children: childrenProps,
      open
    } = this.props;
    const onlyChild = React.Children.only(childrenProps);
    if (!React.isValidElement(onlyChild)) {
      return null;
    }
    const children = React.cloneElement(onlyChild as React.ReactElement<any>, {
      ref: (el: HTMLElement) => {
        this.childrenElement = el;
      }
    });
    const overdrived = (
      <Overdrive id={'1'} duration={250}>
        {children}
      </Overdrive>
    );
    const content = open ? (
    <ModelView mountNode={modelViewMountNode} childrenElement={this.childrenElement}>
      {overdrived}
    </ModelView>
    ) : overdrived;
    return (content);
  }
}
