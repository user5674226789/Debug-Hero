import React, { useState, useEffect } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerPos, setPlayerPos] = useState({ x: 50, y: 80 }); // Позиція у %
  const [isNearMob, setIsNearMob] = useState(false);
  
  const levelData = worlds[0].levels[currentLevel];
  const mobPos = { x: 80, y: 75 }; // Фіксована позиція моба на рівні

  // Логіка руху
  useEffect(() => {
    const handleMove = (e) => {
      setPlayerPos(prev => {
        let newX = prev.x;
        let newY = prev.y;
        const speed = 2;

        if (e.key === 'ArrowLeft' || e.key === 'a') newX -= speed;
        if (e.key === 'ArrowRight' || e.key === 'd') newX += speed;
        if (e.key === 'ArrowUp' || e.key === 'w') newY -= speed;
        if (e.key === 'ArrowDown' || e.key === 's') newY += speed;

        // Обмеження поля
        newX = Math.max(5, Math.min(90, newX));
        newY = Math.max(20, Math.min(90, newY));

        // Перевірка дистанції до моба
        const dist = Math.sqrt(Math.pow(newX - mobPos.x, 2) + Math.pow(newY - mobPos.y, 2));
        setIsNearMob(dist < 15);

        return { x: newX, y: newY };
      });
    };

    window.addEventListener('keydown', handleMove);
    return () => window.removeEventListener('keydown', handleMove);
  }, []);

  return (
    <div className="game-container">
      <div className="game-world">
        {/* Гравець */}
        <div 
          className="player" 
          style={{ left: `${playerPos.x}%`, top: `${playerPos.y}%` }}
        >
          <div className="player-sprite">🤖</div>
        </div>

        {/* Моб */}
        <div 
          className="mob-container" 
          style={{ left: `${mobPos.x}%`, top: `${mobPos.y}%` }}
        >
          <MobDisplay image={levelData.mob} />
          {isNearMob && <div className="interact-hint font-mono">PRESS [ENTER] TO DEBUG</div>}
        </div>
      </div>

      {/* Редактор з'являється тільки якщо підійшов близько */}
      <div className={`editor-side ${!isNearMob ? 'opacity-20 pointer-events-none' : ''}`}>
        <div className="task-card">
          <h3 className="text-green-500 font-bold">TARGET DETECTED: {levelData.difficulty}</h3>
          <p className="text-sm italic text-zinc-400">{levelData.task}</p>
        </div>
        <CodeEditor 
          key={currentLevel}
          initialCode={levelData.code}
          solution={levelData.fix}
          onSuccess={() => {
            setCurrentLevel(prev => prev + 1);
            setIsNearMob(false);
          }}
        />
      </div>
    </div>
  );
};

export default Game;