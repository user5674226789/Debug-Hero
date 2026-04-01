import React, { useState, useEffect } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  // Стейт для навігації по світах та рівнях
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  
  // Стейт персонажа
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [isNearMob, setIsNearMob] = useState(false);
  
  // Отримуємо поточні дані з конфігу
  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  
  const mobX = 2500; 
  const cameraX = Math.max(0, playerX - 300);

  // Константи фізики
  const PLAYER_WIDTH = 60;
  const BRICK_WIDTH = 70;
  const BRICK_HEIGHT = 70;

  // 1. УПРАВЛІННЯ ТА КОЛІЗІЇ
  useEffect(() => {
    const handleKeys = (e) => {
      const key = e.key.toLowerCase();
      
      // Блокуємо рух, якщо гравець біля моба (відкритий термінал)
      if (isNearMob) return;

      // Рух A/D або стрілки
      if (['d', 'arrowright', 'a', 'arrowleft'].includes(key)) {
        const direction = (key === 'd' || key === 'arrowright') ? 30 : -30;
        const nextX = playerX + direction;

        // Перевірка удару об стінку блоку
        const hitsWall = levelData.obstacles.some(obsX => 
          nextX + PLAYER_WIDTH > obsX && 
          nextX < obsX + BRICK_WIDTH && 
          playerY < BRICK_HEIGHT - 10
        );

        if (!hitsWall) {
          setPlayerX(Math.max(0, nextX));
        }
      }

      // Стрибок W / Space / Up
      if (['w', ' ', 'arrowup'].includes(key) && !isJumping) {
        setIsJumping(true);
        setPlayerY(180);
        setTimeout(() => setIsJumping(false), 400); 
      }
    };

    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [playerX, playerY, isJumping, isNearMob, levelData.obstacles]);

  // 2. ГРАВІТАЦІЯ ТА ПРИЗЕМЛЕННЯ НА БЛОКИ
  useEffect(() => {
    if (!isJumping) {
      const blockUnderneath = levelData.obstacles.find(obsX => 
        playerX + PLAYER_WIDTH > obsX + 5 && 
        playerX < obsX + BRICK_WIDTH - 5
      );

      if (blockUnderneath) {
        setPlayerY(BRICK_HEIGHT);
      } else {
        setPlayerY(0);
      }
    }
  }, [playerX, isJumping, levelData.obstacles]);

  // 3. ПЕРЕВІРКА НА МОБА
  useEffect(() => {
    if (Math.abs(playerX - mobX) < 130) {
      setIsNearMob(true);
    } else {
      setIsNearMob(false);
    }
  }, [playerX]);

  // 4. ЛОГІКА ПЕРЕМОГИ ТА ПЕРЕХОДУ
  const handleWin = () => {
    // Якщо в поточному світі ще є рівні (їх по 3 на світ)
    if (currentLevel < worldData.levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
      alert("РІВЕНЬ ПРОЙДЕНО! ПЕРЕХІД ДО НАСТУПНОГО БАГУ...");
    } 
    // Якщо рівні закінчились, але є ще світи
    else if (currentWorld < worlds.length - 1) {
      alert(`СВІТ ${worldData.name} ОЧИЩЕНО! ВХІД У ${worlds[currentWorld + 1].name}...`);
      setCurrentWorld(prev => prev + 1);
      setCurrentLevel(0);
    } 
    // Фінал гри
    else {
      alert("ВІТАЮ, DEBUG HERO! ТИ ВРЯТУВАВ ГОЛОВНИЙ СЕРВЕР!");
    }

    // Скидаємо позицію для нового рівня
    setPlayerX(100);
    setPlayerY(0);
    setIsNearMob(false);
  };

  return (
    <div className="game-screen" style={{ background: worldData.bg || levelData.bg }}>
      {/* Інтерфейс світу */}
      <div className="world-info" style={{ position: 'absolute', top: 20, left: 20, zIndex: 100 }}>
        <h1 style={{ color: '#00ff41', margin: 0, fontSize: '20px' }}>{worldData.name}</h1>
        <p style={{ color: '#ccc', margin: 0 }}>Рівень {currentLevel + 1} / 3</p>
      </div>

      <div 
        className="world-layer" 
        style={{ 
          transform: `translateX(-${cameraX}px)`,
          width: '4000px',
          height: '100%'
        }}
      >
        <div className="ground-line"></div>
        
        {/* Перешкоди */}
        {levelData.obstacles.map((pos, i) => (
          <div key={i} className="brick" style={{ left: pos, bottom: '40px' }}></div>
        ))}

        {/* Моб */}
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

      {/* Термінал (спливає, коли isNearMob = true) */}
      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <h2 className="status-red">[!] {levelData.difficulty} ERROR DETECTED</h2>
            <p className="task-text">{levelData.task}</p>
            <CodeEditor 
              // Ключ змушує React перестворити редактор при зміні рівня
              key={`${currentWorld}-${currentLevel}`} 
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