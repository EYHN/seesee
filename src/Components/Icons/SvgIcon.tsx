import * as React from 'react';
import { pure } from 'recompose';

export type ISvgIconProps = React.SVGProps<SVGSVGElement>;

const defaultProps = {
  viewBox: '0 0 24 24',
  color: 'inherit',
  height: '24px'
};

const SvgIcon = (props: ISvgIconProps) => (
  <svg
    {
      ...{
        ...defaultProps,
        ...props
      }
    }
  />
);

export default pure(SvgIcon);
