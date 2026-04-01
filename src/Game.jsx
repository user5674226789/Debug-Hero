import React, { useState, useEffect } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor'; // файли в одній папці
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentWorldIdx, setCurrentWorldIdx] = useState(0);
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(45); // Трохи більше часу на старт

  const currentWorld = worlds[currentWorldIdx];
  const currentLevel = currentWorld.levels[currentLevelIdx];

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleLevelComplete = () => {
    setScore(prev => prev + 100 + (timeLeft * 2));
    setTimeLeft(45);

    if (currentLevelIdx < currentWorld.levels.length - 1) {
      setCurrentLevelIdx(currentLevelIdx + 1);
    } else if (currentWorldIdx < worlds.length - 1) {
      alert(`Світ ${currentWorld.name} пройдено!`);
      setCurrentWorldIdx(currentWorldIdx + 1);
      setCurrentLevelIdx(0);
    } else {
      alert("ВІТАЄМО! ChaosCompiler видалено назавжди!");
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-500 font-mono p-6">
      <div className="max-w-5xl mx-auto border border-green-900 p-4 rounded-lg bg-zinc-950">
        <div className="flex justify-between mb-6 text-xl border-b border-green-900 pb-2">
          <span>HOST: {currentWorld.name}</span>
          <span className={timeLeft < 10 ? "text-red-500 animate-pulse" : ""}>TIME: {timeLeft}s</span>
          <span>XP: {score}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col items-center justify-center bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <MobDisplay image={currentLevel.mob} isBoss={currentLevel.difficulty === "Hard"} />
            <div className="mt-6 text-center">
              <h3 className="text-red-400 font-bold mb-2">TARGET DETECTED: {currentLevel.difficulty}</h3>
              <p className="text-sm text-gray-300 italic">{currentLevel.task}</p>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="text-xs text-green-800 mb-1 ml-1"># DEBUG_HERO_COMPILER_V1.0</div>
            <CodeEditor 
              initialCode={currentLevel.code} 
              solution={currentLevel.fix} 
              onSuccess={handleLevelComplete} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;