import * as React from 'react';
import ModelView from './ModelView';
import Overdrive from '../Components/Overdrive';
import randomString from '../utils/randomString';

const modelViewMountNode = document.body;

export interface SeeseeProps {
  open: boolean;
  onExit?: React.ReactEventHandler<HTMLButtonElement>;
  title?: string;
}

export default class Seesee extends React.PureComponent<SeeseeProps> {

  public overdriveID = randomString();

  public render() {
    const {
      children,
      open,
      title,
      onExit
    } = this.props;
    const onlyChild = React.Children.only(children);
    if (!React.isValidElement(onlyChild)) {
      return null;
    }
    const overdrived = (
      <Overdrive id={this.overdriveID} duration={300}>
        {children}
      </Overdrive>
    );
    return (
      <>
        <ModelView
          mountNode={modelViewMountNode}
          onClickBackButton={onExit}
          title={title}
        >
          {open && overdrived}
        </ModelView>
        {!open ? overdrived : React.cloneElement(children as any, {style: {opacity: 0}})}
        {open && <style>{'body {overflow: hidden}'}</style>}
      </>
    );
  }
}
//
