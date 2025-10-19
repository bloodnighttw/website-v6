import generateImageURL from "./generation";
import IS_CLIENT from "virtual:rpress:client-env";
const NeedSSR = (await import("../NeedSSR")).default;

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
      {!IS_CLIENT && (
        <NeedSSR message="You shouldn't use Image component under NoSSR!" />
      )}
      <img
        src={resolvedSrc}
        width={width}
        height={height}
        alt={alt}
        {...props}
      />
    </>
  );
};

export default Image;
