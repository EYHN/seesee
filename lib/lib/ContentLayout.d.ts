/// <reference types="react" />
import * as React from 'react';
import TouchEventManager from '../utils/touch/TouchEventManager';
export interface ContentLayoutProps {
    enable: boolean;
    style?: React.CSSProperties;
}
export default class ContentLayout extends React.PureComponent<ContentLayoutProps> {
    prevTouchList: TouchList;
    animationRequest: number;
    childrenElement: HTMLElement;
    touchEventManager: TouchEventManager;
    state: {
        offsetX: number;
        offsetY: number;
        scaleX: number;
        scaleY: number;
    };
    constructor(props: ContentLayoutProps);
    startAnimationFrame: (c: FrameRequestCallback) => void;
    returnOrigin: () => void;
    private handleTouch;
    private handleRef;
    render(): JSX.Element;
}
