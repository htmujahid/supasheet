import { useEffect, useState } from "react";

type WindowSize = {
  width: number;
  height: number;
};

type UseWindowSizeProps = {
  defaultWidth?: number;
  defaultHeight?: number;
};

export function useWindowSize({
  defaultWidth = 0,
  defaultHeight = 0,
}: UseWindowSizeProps = {}): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: defaultWidth,
    height: defaultHeight,
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Set initial size after mount to avoid hydration mismatch
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    let timeoutId: NodeJS.Timeout | null = null;

    function onResize() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      }, 150);
    }

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  return windowSize;
}
