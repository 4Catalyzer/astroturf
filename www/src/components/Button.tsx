import React from 'react';
import { css } from 'astroturf/react';

function Button(props: any) {
  const Component = props.href ? 'a' : 'button';
  return (
    <div className="inline-block relative">
      <Component
        type={Component === 'button' ? 'button' : undefined}
        {...props}
        css={css`
          composes: appearance-none, font-brand, inline-block, py-1, px-4, border, border-white, text-white, font-bold, text-shadow from global;

          /*transform: skew(2deg, 1deg); */
        `}
      />
      <div
        className="absolute bg-primary"
        css={css`
          z-index: -1;
          opacity: 0;
          transform: skew(-6deg, -3deg);
          pointer-events: none;
          top: 5px;
          right: -3px;
          bottom: -5px;
          left: 3px;

          *:hover + & {
            opacity: 1;
          }
        `}
      />
    </div>
  );
}

export default Button;
