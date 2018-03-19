/// <reference types="react" />
import * as React from 'react';
export interface ModelViewProps {
    /**
     * The element you want mount to.
     * Viewer will be injected into it.
     *
     * @type {HTMLElement}
     */
    mountNode: HTMLElement;
    onClickBackButton?: React.ReactEventHandler<HTMLButtonElement>;
}
/**
 * Modal image viewer. Full page.
 *
 * @class
 */
export default class ModelView extends React.PureComponent<ModelViewProps> {
    animationRequest: number;
    bgElement: HTMLSpanElement;
    state: {
        fadeInCurrent: number;
        hasShow: boolean;
        display: boolean;
    };
    beginFadeInAnimation: () => void;
    beginFadeOutAnimation: () => void;
    componentDidMount(): void;
    componentWillUnmount(): void;
    componentWillReceiveProps(nextProps: {
        children: React.ReactNode;
    } & ModelViewProps): void;
    render(): React.ReactPortal;
}
