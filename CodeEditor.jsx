import React, { useState, useEffect } from 'react';

const CodeEditor = ({ initialCode, solution, onSuccess }) => {
  const [userCode, setUserCode] = useState(initialCode);

  // Оновлюємо код, коли змінюється рівень
  useEffect(() => {
    setUserCode(initialCode);
  }, [initialCode]);

  const checkCode = () => {
    // Проста перевірка: чи містить код гравця правильне виправлення?
    // Можна зробити складніше через регулярні вирази
    if (userCode.includes(solution)) {
      onSuccess();
    } else {
      alert("Помилка не виправлена! Спробуй ще раз.");
    }
  };

  return (
    <div className="flex flex-col gap-4 bg-gray-800 p-4 rounded-lg border border-blue-500">
      <textarea
        className="w-full h-48 p-3 bg-black text-green-400 font-mono focus:outline-none"
        value={userCode}
        onChange={(e) => setUserCode(e.target.value)}
      />
      <button 
        onClick={checkCode}
        className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded transition-all"
      >
        ЗАПУСТИТИ ДЕБАГ 🚀
      </button>
    </div>
  );
};

export default CodeEditor;
