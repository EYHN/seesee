/// <reference types="react" />
import * as React from 'react';
export interface ViewerLayoutProps {
    style?: React.CSSProperties;
    nav?: React.ReactNode;
    content?: React.ReactNode;
    bottom?: React.ReactNode;
    bg?: React.ReactNode;
    className?: string;
}
/**
 * Management components layout.
 *
 * It has a navigation bar, content area, background and bottom navigation.
 */
declare const ViewerLayout: React.SFC<ViewerLayoutProps>;
export default ViewerLayout;
