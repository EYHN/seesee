/// <reference types="react" />
import * as React from 'react';
export interface ContentLayoutProps {
    childrenElement: HTMLElement;
    enable: boolean;
    style?: React.CSSProperties;
}
export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
    render(): JSX.Element;
}
