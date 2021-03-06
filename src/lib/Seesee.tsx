import * as React from 'react';
import ModelView from './ModelView';
import Overdrive from '../Components/Overdrive';
import SeeseeList from './SeeseeList';

const modelViewMountNode = document.body;

export interface SeeseeProps {
  open?: boolean;
  onExit?: React.ReactEventHandler<HTMLButtonElement>;
  title?: string;
  parent?: SeeseeList;
  identifier?: string;
  overdrive?: boolean;
}

export default class Seesee extends React.PureComponent<SeeseeProps> {

  public children: React.ReactElement<any>;

  constructor(props: SeeseeProps) {
    super(props);
  }

  getChildren() {
    return this.children;
  }

  public render() {
    const {
      children,
      open,
      title,
      onExit,
      parent,
      identifier,
      overdrive = true
    } = this.props;
    const onlyChild = React.Children.only(children);
    if (!React.isValidElement(onlyChild)) {
      return null;
    }

    this.children = onlyChild;

    const overdrived = overdrive ? (
      <Overdrive id={identifier} duration={300}>
        {onlyChild}
      </Overdrive>
    ) : onlyChild;

    const modelView = (
      <ModelView
        mountNode={modelViewMountNode}
        onClickBackButton={onExit}
        identifier={identifier}
        title={title}
      >
        {open && overdrived}
      </ModelView>
    );

    return (
      <>
        {typeof parent === 'undefined' && modelView}
        {!open ? overdrived : React.cloneElement(onlyChild as any, { style: { opacity: 0 } })}
        {typeof parent === 'undefined' && open && <style>{'body {overflow: hidden}'}</style>}
      </>
    );
  }
}
