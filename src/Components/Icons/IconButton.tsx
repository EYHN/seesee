import * as React from 'react';
import { pure } from 'recompose';

export interface IProps {
  icon: React.ReactNode;
}

const iconButtonStyle: React.CSSProperties = {
  padding: '0px',
  border: '0px',
  outline: 'none',
  WebkitTapHighlightColor: 'transparent',
  background: 'transparent'
};

const IconButton = ({icon, ...otherProps}: IProps & React.HTMLProps<HTMLButtonElement>) => (
  <button
    {...{
      ...otherProps,
      style: {
        ...iconButtonStyle,
        ...otherProps
      }
    }}
  >
    {icon}
  </button>
);

export default pure(IconButton);
