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
}
/**
 * Modal image viewer. Full page.
 *
 * @class
 */
export default class ModelView extends React.PureComponent<ModelViewProps> {
    render(): React.ReactPortal;
}
