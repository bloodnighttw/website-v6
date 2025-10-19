import { NeedSSR } from "../nossr";
import generateImageURL from "./generation";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  quality?: number; // 1-100
  alt?: string;
}

const Image: React.FC<ImageProps> = ({
  src,
  width,
  height,
  alt,
  quality,
  ...props
}) => {
  const resolvedSrc = generateImageURL({ url: src, width, height, quality });

  return (
    <>
      <img
        src={resolvedSrc}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
      <NeedSSR message="The Image Optimizion Component should only run under ssr enviroment! You shouldn't use it under NoSSR!" />
    </>
  );
};

export default Image;
