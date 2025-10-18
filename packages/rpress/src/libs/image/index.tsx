import loader from "./client";

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
  const resolvedSrc = loader({ url: src, width, height, quality });
  return (
    <img src={resolvedSrc} width={width} height={height} alt={alt} {...props} />
  );
};

export default Image;
