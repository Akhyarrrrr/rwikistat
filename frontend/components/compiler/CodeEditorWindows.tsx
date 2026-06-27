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
    <div className="overlay overflow-hidden w-full h-full shadow-4xl">
      <Editor height="65vh" width="100%" language={language} value={value} theme={theme} defaultValue={defaultValue}
        onChange={handleEditorChange} options={{ fontSize: 14 }} />
    </div>
  );
};

export default CodeEditorWindow;
