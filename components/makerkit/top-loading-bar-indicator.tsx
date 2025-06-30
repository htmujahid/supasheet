'use client';

import { createRef, useEffect } from 'react';

import type { LoadingBarRef } from 'react-top-loading-bar';
import LoadingBar from 'react-top-loading-bar';

let running = false;

export function TopLoadingBarIndicator() {
  const ref = createRef<LoadingBarRef>();

  useEffect(() => {
    if (!ref.current || running) {
      return;
    }

    running = true;

    const loadingBarRef = ref.current;

    loadingBarRef.continuousStart(0, 300);

    return () => {
      loadingBarRef.complete();
      running = false;
    };
  }, [ref]);

  return (
    <LoadingBar
      className={'bg-primary'}
      height={4}
      waitingTime={0}
      shadow
      color={''}
      ref={ref}
    />
  );
}
