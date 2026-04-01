import React, { useState, useEffect } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isNearMob, setIsNearMob] = useState(false);
  
  const levelData = worlds[0].levels[currentLevel];
  const mobX = 1400; // Позиція моба в кінці рівня

  // Камера: зміщуємо світ, щоб гравець був лівіше центру
  const cameraX = Math.max(0, playerX - 200);

  useEffect(() => {
    const handleKeys = (e) => {
      if (e.key === 'd' || e.key === 'ArrowRight') setPlayerX(prev => prev + 25);
      if (e.key === 'a' || e.key === 'ArrowLeft') setPlayerX(prev => Math.max(0, prev - 25));
      if ((e.key === 'w' || e.key === ' ') && !isJumping) {
        setIsJumping(true);
        setPlayerY(160); // Висота стрибка
        setTimeout(() => setPlayerY(0), 400);
        setTimeout(() => setIsJumping(false), 800);
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isJumping]);

  useEffect(() => {
    // Перевірка наближення до моба
    const dist = Math.abs(playerX - mobX);
    if (dist < 150) setIsNearMob(true);
    else setIsNearMob(false);
  }, [playerX]);

  const handleWin = () => {
    if (currentLevel < worlds[0].levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      setPlayerX(100);
      setIsNearMob(false);
    } else {
      alert("ГРУ ПРОЙДЕНО! ТИ МАЙСТЕР ДЕБАГУ!");
    }
  };

  return (
    <div className="game-screen" style={{ background: levelData.bg }}>
      <div className="world-layer" style={{ transform: `translateX(-${cameraX}px)` }}>
        <div className="ground-line"></div>
        
        {/* Перешкоди */}
        {levelData.obstacles.map((pos, i) => (
          <div key={i} className="brick" style={{ left: pos }}></div>
        ))}

        {/* Моб розміром з гравця */}
        <div className="mob-wrapper" style={{ left: mobX }}>
          <MobDisplay image={levelData.mob} />
        </div>

        {/* Гравець */}
        <div className="player-hero" style={{ 
          left: playerX, 
          bottom: `${40 + playerY}px`,
          transition: isJumping ? 'bottom 0.4s ease-out' : 'bottom 0.4s ease-in'
        }}>
          🤖
        </div>
      </div>

      {/* Термінал, що випливає автоматично */}
      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <h3 className="status-red">Target: {levelData.difficulty} Bug</h3>
            <p className="task-text">{levelData.task}</p>
            <CodeEditor 
              key={currentLevel}
              initialCode={levelData.code}
              solution={levelData.fix}
              onSuccess={handleWin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;