import React, { useState, useEffect } from 'react';

const CodeEditor = ({ initialCode, solution, onSuccess, onWrong }) => {
  const [value, setValue] = useState(initialCode);
  const [isError, setIsError] = useState(false);

  const checkCode = () => {
    // Логіка перевірки: чи містить введений код правильну відповідь
    if (value.replace(/\s/g, '').includes(solution.replace(/\s/g, ''))) {
      setIsError(false);
      onSuccess();
    } else {
      setIsError(true);
      if (onWrong) onWrong(); // Віднімаємо HP у Game.jsx
      setTimeout(() => setIsError(false), 500);
    }
  };

  return (
    <div className={`editor-container ${isError ? 'animate-shake' : ''}`}>
      <div className="editor-toolbar">
        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>
        <span className="file-name">main.js — Debug Mode</span>
      </div>
      <textarea
        className="code-input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        spellCheck="false"
      />
      <div className="editor-footer">
        {isError && <span className="error-msg">SyntaxError: Unexpected logic in sector.</span>}
        <button className="debug-btn" onClick={checkCode}>
          RUN DEBUGGER (Ctrl+Enter)
        </button>
      </div>
    </div>
  );
};

export default CodeEditor;