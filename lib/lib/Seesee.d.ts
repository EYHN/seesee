/// <reference types="react" />
import * as React from 'react';
export interface SeeseeProps {
    open: boolean;
    onExit?: React.ReactEventHandler<HTMLButtonElement>;
}
export default class Seesee extends React.PureComponent<SeeseeProps> {
    render(): JSX.Element;
}
