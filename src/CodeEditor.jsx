import React, { useState, useEffect } from 'react';

const CodeEditor = ({ initialCode, solution, onSuccess }) => {
  // ПЕРШИМ ділом оголошуємо стейт
  const [userInput, setUserInput] = useState(initialCode);

  useEffect(() => {
    setUserInput(initialCode);
  }, [initialCode]);

  const checkCode = () => {
    if (userInput.replace(/\s+/g, '') === solution.replace(/\s+/g, '')) {
      onSuccess();
    } else {
      alert("❌ Код все ще містить помилку!");
    }
  };

  // Тільки ПІСЛЯ оголошення стейту додаємо слухач подій
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === 'Enter') {
        checkCode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [userInput]); 

  return (
    <div className="bg-zinc-900 p-4 rounded-lg border border-green-500/30">
      <textarea
        className="w-full h-48 bg-transparent text-green-400 font-mono focus:outline-none resize-none text-sm"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
        spellCheck="false"
      />
      <button onClick={checkCode} className="mt-4 w-full bg-green-600 py-2 rounded font-bold text-black">
        ЗАПУСТИТИ ДЕБАГ (Ctrl+Enter)
      </button>
    </div>
  );
};

export default CodeEditor;