/// <reference types="react" />
import * as React from 'react';
export interface SeeseeProps {
    open: boolean;
}
export default class Seesee extends React.PureComponent<SeeseeProps> {
    childrenElement: HTMLElement;
    render(): JSX.Element;
}
