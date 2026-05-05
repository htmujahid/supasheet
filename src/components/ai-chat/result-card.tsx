import type { AIResponse } from "#/lib/ai/types"

import { ResultScalar } from "./result-scalar"
import { ResultTable } from "./result-table"
import { ResultText } from "./result-text"

export function ResultCard({ result }: { result: AIResponse }) {
  switch (result.type) {
    case "json":
      return <ResultTable rows={result.value} summary={result.summary} />
    case "scalar":
      return <ResultScalar value={result.value} summary={result.summary} />
    case "text":
      return <ResultText summary={result.summary} />
  }
}
