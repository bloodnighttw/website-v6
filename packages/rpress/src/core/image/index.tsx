import loader from "virtual:rpress:image";

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  width?: number;
  height?: number;
  alt?: string;
}

const Image: React.FC<ImageProps> = ({ src, width, height, alt, ...props }) => {
  const resolvedSrc = loader({ url: src, width, height });
  return (
    <img src={resolvedSrc} width={width} height={height} alt={alt} {...props} />
  );
};

export default Image;
