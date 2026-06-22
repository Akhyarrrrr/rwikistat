// components/TextEditor.tsx

import React from "react";

interface TextEditorProps {
  code: string;
  onChange: (newCode: string) => void;
  onSubmit: (code: string) => void;
  placeholder?: string;
}

const TextEditor: React.FC<TextEditorProps> = ({
  code,
  onChange,
  onSubmit,
  placeholder,
}) => {
  return (
    <div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width: "100%", height: "400px", fontSize: "14px" }}
      />
      <button onClick={() => onSubmit(code)}>Submit</button>
    </div>
  );
};

export default TextEditor;
