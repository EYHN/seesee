import * as React from 'react';
import ModelView from './ModelView';
import Overdrive from '../Components/Overdrive';

const modelViewMountNode = document.body;

export interface SeeseeProps {
  open: boolean;
  onExit?: React.ReactEventHandler<HTMLButtonElement>;
}

export default class Seesee extends React.PureComponent<SeeseeProps> {

  public render() {
    const {
      children,
      open,
      onExit
    } = this.props;
    const onlyChild = React.Children.only(children);
    if (!React.isValidElement(onlyChild)) {
      return null;
    }
    const overdrived = (
      <Overdrive id={'1'} duration={250}>
        {children}
      </Overdrive>
    );
    return (
      <>
        <ModelView
          mountNode={modelViewMountNode}
          onClickBackButton={onExit}
        >
          {open && overdrived}
        </ModelView>
        {!open ? overdrived : React.cloneElement(children as any)}
      </>
    );
  }
}
