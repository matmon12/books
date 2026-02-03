export const getImageUrl = (module: string, path: string): string => {
  return new URL(`/src/${module}/assets/images/${path}`, import.meta.url).href;
}
