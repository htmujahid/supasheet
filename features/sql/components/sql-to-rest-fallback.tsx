import dynamic from "next/dynamic";

import { ErrorBoundary, FallbackProps } from "react-error-boundary";

function FallbackComponent({ error }: FallbackProps) {
  if (
    error instanceof Error &&
    error.message === "WebAssembly is not defined"
  ) {
    return (
      <p>
        The translator requires WebAssembly to run. Your browser might be
        outdated or it might have a policy that disables WebAssembly.
      </p>
    );
  }

  return (
    <p>
      <pre>
        {error instanceof Error ? error.message : JSON.stringify(error)}
      </pre>
    </p>
  );
}

const SqlToRest = dynamic(() => import("./sql-to-rest"), { ssr: false });

export default function SqlToRestWithFallback() {
  return (
    <ErrorBoundary FallbackComponent={FallbackComponent}>
      <SqlToRest />
    </ErrorBoundary>
  );
}
