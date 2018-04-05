import * as React from 'react';
import Seesee, { SeeseeProps } from './Seesee';
import ModelView from './ModelView';
import Overdrive from '../Components/Overdrive';

const modelViewMountNode = document.body;

export interface SeeseeListProps {
  open: string;
  onNext?: () => void;
  onPrev?: () => void;
  onExit?: React.ReactEventHandler<HTMLButtonElement>;
}

export default class SeeseeList extends React.PureComponent<SeeseeListProps> {
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
    let prevIndex: number;
    let nextIndex: number;
    const children = React.Children.map(childrenProps, (child: React.ReactElement<SeeseeProps>, index) => {
      if (React.isValidElement(child) && child.type === Seesee) {
        if (child.props.identifier === open && typeof targetIndex === 'undefined') {
          targetIndex = index;
        } else if (typeof targetIndex === 'undefined') {
          prevIndex = index;
        } else if (typeof targetIndex !== 'undefined' && typeof nextIndex === 'undefined') {
          nextIndex = index;
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
      children[nextIndex] ? children[nextIndex].props.children : undefined;
    const nextIdentifier = children[nextIndex] ? children[nextIndex].props.identifier : undefined;

    const prev: React.ReactElement<SeeseeProps> =
      children[prevIndex] ? children[prevIndex].props.children : undefined;
    const prevIdentifier = children[prevIndex] ? children[prevIndex].props.identifier : undefined;
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
          identifier={open}
          nextIdentifier={nextIdentifier}
          prevIdentifier={prevIdentifier}
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
