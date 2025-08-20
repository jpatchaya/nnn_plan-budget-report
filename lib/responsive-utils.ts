import { useEffect, useState } from "react";

export const breakpoints = {
  xs: 480,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;

export type Breakpoint = keyof typeof breakpoints;

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>("xl");

  useEffect(() => {
    const getBreakpoint = (width: number): Breakpoint => {
      if (width < breakpoints.xs) return "xs";
      if (width < breakpoints.sm) return "sm";
      if (width < breakpoints.md) return "md";
      if (width < breakpoints.lg) return "lg";
      if (width < breakpoints.xl) return "xl";
      return "2xl";
    };

    const handleResize = () => {
      setCurrentBreakpoint(getBreakpoint(window.innerWidth));
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return currentBreakpoint;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    
    if (media.matches !== matches) {
      setMatches(media.matches);
    }

    const listener = (e: MediaQueryListEvent) => setMatches(e.matches);
    
    if (media.addEventListener) {
      media.addEventListener("change", listener);
    } else {
      media.addListener(listener);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", listener);
      } else {
        media.removeListener(listener);
      }
    };
  }, [matches, query]);

  return matches;
}

export function useIsTablet() {
  return useMediaQuery(`(min-width: ${breakpoints.md}px) and (max-width: ${breakpoints.lg - 1}px)`);
}

export function useIsDesktop() {
  return useMediaQuery(`(min-width: ${breakpoints.lg}px)`);
}

export const responsiveClasses = {
  padding: {
    base: "p-4 sm:p-6 lg:p-8",
    x: "px-4 sm:px-6 lg:px-8",
    y: "py-4 sm:py-6 lg:py-8",
  },
  margin: {
    base: "m-4 sm:m-6 lg:m-8",
    x: "mx-4 sm:mx-6 lg:mx-8",
    y: "my-4 sm:my-6 lg:my-8",
  },
  gap: {
    small: "gap-2 sm:gap-3 lg:gap-4",
    base: "gap-4 sm:gap-6 lg:gap-8",
    large: "gap-6 sm:gap-8 lg:gap-10",
  },
  grid: {
    cols2: "grid-cols-1 md:grid-cols-2",
    cols3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    cols4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  },
  text: {
    heading: "text-2xl sm:text-3xl lg:text-4xl",
    subheading: "text-xl sm:text-2xl lg:text-3xl",
    body: "text-sm sm:text-base",
    small: "text-xs sm:text-sm",
  },
  container: {
    full: "w-full",
    prose: "max-w-prose mx-auto",
    narrow: "max-w-2xl mx-auto",
    base: "max-w-4xl mx-auto",
    wide: "max-w-7xl mx-auto",
  },
  stack: {
    horizontal: "flex flex-col sm:flex-row",
    vertical: "flex flex-col",
    responsive: "flex flex-col lg:flex-row",
  },
  hide: {
    mobile: "hidden sm:block",
    tablet: "hidden md:block",
    desktop: "hidden lg:block",
  },
  show: {
    mobile: "block sm:hidden",
    tablet: "block md:hidden",
    desktop: "block lg:hidden",
  },
} as const;