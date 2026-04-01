import React, { useState, useEffect } from 'react';

const CodeEditor = ({ initialCode, solution, onSuccess }) => {
  const [userInput, setUserInput] = useState(initialCode);

  useEffect(() => {
    setUserInput(initialCode);
  }, [initialCode]);

  const checkCode = () => {
    // Очищаємо пробіли для точної перевірки
    const cleanInput = userInput.replace(/\s+/g, '');
    const cleanSolution = solution.replace(/\s+/g, '');

    // Перевіряємо, чи виправив користувач потрібну ділянку
    if (cleanInput.includes(cleanSolution) && !cleanInput.includes("i--")) {
      onSuccess();
    } else {
      alert("❌ Помилка! Знайди i-- та заміни на i++");
    }
  };

  return (
    <div className="code-editor-box">
      <textarea
        className="w-full h-32 bg-black text-green-400 p-2 font-mono border border-green-900"
        value={userInput}
        onChange={(e) => setUserInput(e.target.value)}
      />
      <button onClick={checkCode} className="mt-2 bg-green-600 px-4 py-2 text-black font-bold">
        RUN DEBUG
      </button>
    </div>
  );
};

export default CodeEditor;