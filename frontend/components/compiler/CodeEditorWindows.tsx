"use client";
import { useState } from "react";
import Editor from "@monaco-editor/react";

interface Props {
  onChange: (key: string, value: string) => void;
  language?: string;
  code?: string;
  theme?: string;
  defaultValue?: string;
}

const CodeEditorWindow = ({ onChange, language, code, theme, defaultValue }: Props) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value: string | undefined) => {
    setValue(value || "");
    onChange("code", value || "");
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-800 bg-ink-950 shadow-2xl shadow-ink-950/20">
      <Editor
        height="58vh"
        width="100%"
        language={language}
        value={value}
        theme={theme}
        defaultValue={defaultValue}
        onChange={handleEditorChange}
        options={{
          fontFamily: "var(--font-geist-mono)",
          fontSize: 14,
          minimap: { enabled: false },
          padding: { top: 18, bottom: 18 },
          scrollBeyondLastLine: false,
        }}
      />
    </div>
  );
};

export default CodeEditorWindow;
