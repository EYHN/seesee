import * as React from 'react';
import Seesee, { SeeseeProps } from './Seesee';
import ModelView from './ModelView';
import Overdrive from '../Components/Overdrive';

const modelViewMountNode = document.body;

export interface SeeseeListProps {
  open: string | number;
  onNext?: () => void;
  onPrev?: () => void;
  onExit?: React.ReactEventHandler<HTMLButtonElement>;
}

export default class SeeseeList extends React.PureComponent<SeeseeListProps> {
  private findSeeseeInChildren(identifier: string | number, children: React.ReactChildren | React.ReactChild[]) {
    let res: React.ReactElement<SeeseeProps>;
    React.Children.forEach(children, (child: React.ReactElement<SeeseeProps>) => {
      if (React.isValidElement(child) && child.type === Seesee) {
        if ((child).props.identifier === identifier) {
          res = child;
        }
      }
    });
    if (typeof res === 'undefined') {
      throw Error(`an't find <Seesee/> by identifier(${identifier}).`);
    }
    return res;
  }

  // tslint:disable-next-line:member-ordering
  public render() {
    const {
      children: childrenProps,
      open,
      onExit,
      onNext,
      onPrev
    } = this.props;
    let targetIndex: number;
    const children = React.Children.map(childrenProps, (child: React.ReactElement<SeeseeProps>, index) => {
      if (React.isValidElement(child) && child.type === Seesee) {
        if (child.props.identifier === open) {
          targetIndex = index;
        }
        const c = React.cloneElement(child as React.ReactElement<any>, {
          ...child.props,
          parent: this,
          open: child.props.identifier === open
        });
        return c;
      } else {
        return child;
      }
    });
    const now: React.ReactElement<SeeseeProps> = children[targetIndex];
    const next: React.ReactElement<SeeseeProps> =
      children[targetIndex + 1] ? children[targetIndex + 1].props.children : undefined;
    const prev: React.ReactElement<SeeseeProps> =
      children[targetIndex - 1] ? children[targetIndex - 1].props.children : undefined;
    const overdrived = (
      <Overdrive id={open} duration={300}>
        {now && (now as any).props.children}
      </Overdrive>
    );
    return (
      <>
        {children}
        <ModelView
          mountNode={modelViewMountNode}
          onClickBackButton={onExit}
          title={now ? now.props.title : ''}
          next={next}
          prev={prev}
          onNext={onNext}
          onPrev={onPrev}
        >
          {now && overdrived}
        </ModelView>
        {open && <style>{'body {overflow: hidden}'}</style>}
      </>
    );
  }
}
