import React, { type DetailedHTMLProps } from 'react';

// eslint-disable-next-line max-len
interface Props extends DetailedHTMLProps<React.ImgHTMLAttributes<HTMLImageElement>, HTMLImageElement> {
  src: string,
  alt: string,
}

export const Image = React.memo<Props>(({ src, alt, ...props }) => (
  <img
    src={src}
    alt={alt}
    {...props}
  />
));
