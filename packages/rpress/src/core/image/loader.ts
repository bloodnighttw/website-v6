export function url2Hash(url: string) {
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return Math.abs(hash).toString(36);
}

export default function loader(url: string) {
  if (import.meta.env.DEV) {
    return "_rpress?url=" + encodeURIComponent(url);
  }
  const hash = url2Hash(url);
  return "/images/" + hash + ".webp";
}
