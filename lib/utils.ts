import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const getImageSize = (url: string): number[] => {
  const sizeMatch = url.match(/-(\d+)x(\d+)\./);
  if (sizeMatch) {
    const width = parseInt(sizeMatch[1]);
    const height = parseInt(sizeMatch[2]);
    return [width, height];
  }
  return [0, 0]; // If no size is found, return [0, 0]
};

export const getLargestImage = (sizes: { sourceUrl: string }[]) => {
  return sizes.reduce((largest, current) => {
    const [currentWidth, currentHeight] = getImageSize(current.sourceUrl);
    const [largestWidth, largestHeight] = getImageSize(largest.sourceUrl);

    const currentArea = currentWidth * currentHeight;
    const largestArea = largestWidth * largestHeight;

    return currentArea > largestArea ? current : largest;
  });
};
