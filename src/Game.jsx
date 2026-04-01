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
  const mobX = 2500; 
  const cameraX = Math.max(0, playerX - 300);

  // Константи для фізики (мають збігатися з CSS)
  const PLAYER_WIDTH = 50;
  const BRICK_WIDTH = 70;
  const BRICK_HEIGHT = 70;

  useEffect(() => {
    const handleKeys = (e) => {
      const key = e.key.toLowerCase();

      // 1. РУХ (A / D)
      if (['d', 'arrowright', 'a', 'arrowleft'].includes(key)) {
        const direction = (key === 'd' || key === 'arrowright') ? 25 : -25;
        const nextX = playerX + direction;

        // Перевірка бокових стінок
        const hitsWall = levelData.obstacles.some(obsX => 
          nextX + PLAYER_WIDTH > obsX && 
          nextX < obsX + BRICK_WIDTH && 
          playerY < BRICK_HEIGHT - 10 // Віднімаємо 10px для легкого "застрибування"
        );

        if (!hitsWall) {
          setPlayerX(Math.max(0, nextX));
        }
      }

      // 2. СТРИБОК (W / Space)
      if (['w', ' ', 'arrowup'].includes(key) && !isJumping) {
        setIsJumping(true);
        setPlayerY(180);

        setTimeout(() => {
          setIsJumping(false);
        }, 400); // Час "підйому"
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [playerX, playerY, isJumping, levelData.obstacles]);

  // 3. СИСТЕМА ГРАВІТАЦІЇ ТА ПРИЗЕМЛЕННЯ
  useEffect(() => {
    if (!isJumping) {
      // Перевіряємо, чи є під нами блок
      const blockUnderneath = levelData.obstacles.find(obsX => 
        playerX + PLAYER_WIDTH > obsX + 5 && // +5 для кращого відчуття краю
        playerX < obsX + BRICK_WIDTH - 5
      );

      if (blockUnderneath) {
        if (playerY !== BRICK_HEIGHT) setPlayerY(BRICK_HEIGHT);
      } else {
        if (playerY !== 0) setPlayerY(0);
      }
    }
  }, [playerX, isJumping, playerY, levelData.obstacles]);

  // 4. ПЕРЕВІРКА НА МОБА
  useEffect(() => {
    if (Math.abs(playerX - mobX) < 120) {
      setIsNearMob(true);
    } else {
      setIsNearMob(false);
    }
  }, [playerX]);

  const handleWin = () => {
    alert("SYSTEM SECURED! BUG ELIMINATED.");
    setIsNearMob(false);
    setPlayerX(100);
    setPlayerY(0);
    if (currentLevel < worlds[0].levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      alert("YOU ARE THE ULTIMATE DEBUG HERO!");
    }
  };

  return (
    <div className="game-screen" style={{ background: levelData.bg }}>
      {/* Світ рухається за допомогою cameraX */}
      <div 
        className="world-layer" 
        style={{ 
          transform: `translateX(-${cameraX}px)`,
          width: '5000px', // Довгий рівень
          height: '100%'
        }}
      >
        <div className="ground-line"></div>
        
        {/* Рендеримо перешкоди */}
        {levelData.obstacles.map((pos, i) => (
          <div key={i} className="brick" style={{ left: pos, bottom: '40px' }}></div>
        ))}

        {/* Ворог */}
        <div className="mob-wrapper" style={{ left: mobX, bottom: '40px' }}>
          <MobDisplay image={levelData.mob} />
        </div>

        {/* Гравець */}
        <div className="player-hero" style={{ 
          left: playerX, 
          bottom: `${40 + playerY}px`,
          transition: isJumping ? 'bottom 0.4s ease-out' : 'bottom 0.3s ease-in'
        }}>
          🤖
        </div>
      </div>

      {/* Термінал дебагу */}
      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <h2 style={{ color: '#00ff41', marginBottom: '10px' }}>[!] DETECTED MALWARE IN LEVEL {currentLevel + 1}</h2>
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