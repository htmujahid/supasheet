import { useCallback, useRef } from "react";

import dynamic from "next/dynamic";
import { useParams } from "next/navigation";

import { Monaco } from "@monaco-editor/react";
import { Loader2, PlayIcon } from "lucide-react";

import { DefaultHeader } from "@/components/layouts/default-header";
import { Button } from "@/components/ui/button";

import { IStandaloneCodeEditor } from "../lib/types";
import { useSqlData } from "../lib/use-sql-data";
import { useSqlContext } from "./sql-context";

const MonacoEditor = dynamic(() => import("./monaco-editor"), { ssr: false });

export default function SqlToRest() {
  const { snippet } = useParams<{ snippet: string }>();
  const { isLoading } = useSqlContext();

  const sqlData = useSqlData();

  const editorRef = useRef<IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);

  const executeQuery = useCallback(async () => {
    const value = editorRef.current?.getValue() || "";
    await sqlData(value);
  }, [sqlData]);

  return (
    <>
      <DefaultHeader
        breadcrumbs={[{ title: "SQL Editor" }, { title: snippet }]}
      >
        <div className="flex gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={() => executeQuery()}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <PlayIcon className="size-4" />
                Execute
              </>
            )}
          </Button>
        </div>
      </DefaultHeader>
      <div className="px-4">
        <div className="h-[calc(20vh)] w-full overflow-hidden rounded-md border">
          <MonacoEditor
            id={snippet}
            editorRef={editorRef}
            monacoRef={monacoRef}
            executeQuery={executeQuery}
          />
        </div>
      </div>
    </>
  );
}
