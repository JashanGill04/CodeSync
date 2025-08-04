"use client";

import Editor from "@monaco-editor/react";
import { useEffect, useRef } from "react";

interface Props {
  code: string;
  language: string;
  onCodeChange: (value: string | undefined) => void;
  editorTypingUsers: string[];
  output: string;
}

export default function LiveCodeEditor({
  code,
  language,
  onCodeChange,
  editorTypingUsers,
  output,
}: Props) {
  const outputRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll output to bottom
  useEffect(() => {
    outputRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [output]);

  return (
    <>
      <div className="flex-1 border border-white/10 rounded overflow-hidden relative">
        {editorTypingUsers.length > 0 && (
          <div className="absolute top-2 left-2 z-10 text-xs text-white bg-black/50 px-3 py-1 rounded">
            {editorTypingUsers.join(", ")}{" "}
            {editorTypingUsers.length > 1 ? "are" : "is"} editing...
          </div>
        )}
        <Editor
          height="100%"
          language={language.toLowerCase()}
          value={code}
          theme="vs-dark"
          onChange={onCodeChange}
          options={{
            fontSize: 14,
            fontFamily: "Fira Code, monospace",
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
          }}
        />
      </div>

      {output && (
        <div
          ref={outputRef}
          className="mt-4 p-3 bg-black text-green-400 rounded text-sm max-h-60 overflow-y-auto whitespace-pre-wrap"
        >
          <strong>Output:</strong>
          <pre>{output}</pre>
        </div>
      )}
    </>
  );
}
