/// <reference types="react" />
import * as React from 'react';
export interface OverdriveProps {
    id: string;
    /**
     * The event of animation end.
     */
    onAnimationEnd?: () => void;
    style?: React.CSSProperties;
    /**
     * The animation duration milliseconds.
     */
    duration?: number;
    /**
     * Delay milliseconds before the animation.
     */
    animationDelay?: number;
    /**
     * Prevent browsers from scrolling.
     */
    lockscroll?: boolean;
}
export interface OverdrivePosition {
    top: number;
    left: number;
    width: number;
    height: number;
    margin: string;
    padding: string;
    borderRadius: string;
    position: 'absolute';
}
export default class Overdrive extends React.PureComponent<OverdriveProps> {
    state: {
        loading: boolean;
    };
    bodyElement: HTMLDivElement;
    animationDelayTimeout: number;
    animationRequest: number;
    element: HTMLElement;
    onShowLock: boolean;
    constructor(props: OverdriveProps);
    animate(prevPosition: OverdrivePosition, prevElement: React.ReactElement<any>): void;
    animateEnd: () => void;
    onHide(): void;
    onShow(): void;
    componentDidMount(): void;
    clearAnimations(): void;
    componentWillUnmount(): void;
    getPosition(addOffset: boolean): OverdrivePosition;
    render(): React.ReactElement<any>;
}
