export default ({
  url,
  width,
  height,
  quality,
}: {
  url: string;
  width?: number;
  height?: number;
  quality?: number;
}) => {
  const params = new URLSearchParams();
  params.set("url", url);
  if (width) params.set("w", width.toString());
  if (height) params.set("h", height.toString());
  if (quality) params.set("q", quality.toString());
  return `/optimized?${params.toString()}`;
};
