import React, { useState } from 'react';

const CodeEditor = ({ initialCode, solution, onSuccess }) => {
  const [value, setValue] = useState(initialCode);

  const checkCode = () => {
    if (value.includes(solution)) {
      onSuccess();
    } else {
      alert("Помилка! Код все ще не працює.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.ctrlKey && e.key === 'Enter') {
      checkCode();
    }
  };

  return (
    <div className="editor-container">
      <textarea
        className="code-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        spellCheck="false"
      />
      <button className="debug-btn" onClick={checkCode}>
        ЗАПУСТИТИ ДЕБАГ (Ctrl+Enter)
      </button>
    </div>
  );
};

export default CodeEditor;