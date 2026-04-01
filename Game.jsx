import React, { useState } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './components/CodeEditor';
import MobDisplay from './components/MobDisplay';

const DebugHeroGame = () => {
  const [currentWorldIdx, setCurrentWorldIdx] = useState(0);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);

  const currentWorld = worlds[currentWorldIdx];
  const currentLevel = currentWorld.levels[currentLevelIdx];

  const handleLevelComplete = () => {
    if (currentLevelIdx < currentWorld.levels.length - 1) {
      // Перехід на наступний рівень (Easy -> Medium -> Hard)
      setCurrentLevelIdx(currentLevelIdx + 1);
      setScore(score + 100);
    } else if (currentWorldIdx < worlds.length - 1) {
      // Перехід у наступний світ
      setCurrentWorldIdx(currentWorldIdx + 1);
      setCurrentLevelIdx(0);
      alert(`Вітаємо! Ви очистили ${currentWorld.name}!`);
    } else {
      alert("ГРУ ЗАКІНЧЕНО! ChaosCompiler переможений!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-8 flex flex-col items-center">
      {/* HUD: Інформація про прогрес */}
      <div className="w-full max-w-4xl flex justify-between mb-4 border-b border-green-900 pb-2">
        <div>СВІТ: {currentWorld.name}</div>
        <div>РІВЕНЬ: {currentLevel.difficulty}</div>
        <div>SCORE: {score}</div>
      </div>

      <div className="flex w-full max-w-4xl gap-8">
        {/* Ліва частина: Моб (PNG картинка) */}
        <div className="flex-1 flex flex-col items-center justify-center bg-gray-900 rounded-lg p-4">
          <MobDisplay 
            image={currentLevel.mob} 
            isBoss={currentLevel.difficulty === "Hard"} 
          />
          <p className="mt-4 text-center text-red-400 underline">{currentLevel.task}</p>
        </div>

        {/* Права частина: Редактор коду */}
        <div className="flex-1">
          <CodeEditor 
            initialCode={currentLevel.code} 
            solution={currentLevel.fix} 
            onSuccess={handleLevelComplete} 
          />
        </div>
      </div>
    </div>
  );
};

export default DebugHeroGame;
