import { useCallback, useRef } from "react";

import dynamic from "next/dynamic";

import { Monaco } from "@monaco-editor/react";
import { Loader2, PlayIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

import { IStandaloneCodeEditor } from "../lib/types";
import { useSqlData } from "../lib/use-sql-data";
import { useParams } from "next/navigation";
import { useSqlContext } from "./sql-context";

const MonacoEditor = dynamic(() => import("./monaco-editor"), { ssr: false });

export default function SqlToRest() {
  const { id } = useParams<{ id: string }>();
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
      <div className="flex items-center justify-between gap-2 p-[5.5px]">
        <div className="text-base font-medium">SQL Editor</div>
        <div className="flex gap-2">
          <Button variant="default" size="sm" onClick={() => executeQuery()} disabled={isLoading}>
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
      </div>
      <div className="h-[calc(20vh)] w-full overflow-hidden border-y">
        <MonacoEditor
          id={id}
          editorRef={editorRef}
          monacoRef={monacoRef}
          executeQuery={executeQuery}
        />
      </div>
    </>
  );
}
