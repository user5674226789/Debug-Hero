import React, { useState, useEffect, useRef } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  
  const levelData = worlds[0].levels[currentLevel];
  const mobX = 2500; 
  const cameraX = Math.max(0, playerX - 300);

  // --- ФИЗИКА (КОНСТАНТЫ) ---
  const MOVE_SPEED = 7;
  const JUMP_FORCE = 14;
  const GRAVITY = 0.6;
  const PLAYER_WIDTH = 40;
  const BRICK_WIDTH = 70;
  const BRICK_HEIGHT = 70;

  const keys = useRef({}); 
  const pos = useRef({ x: 100, y: 0 });
  const velocityY = useRef(0);
  const isOnGround = useRef(true);
  const jumpCooldown = useRef(false);
  const requestRef = useRef(); // Реф для контроля цикла

  // 1. СБРОС СОСТОЯНИЯ (Выполняется строго при смене уровня)
  useEffect(() => {
    // Останавливаем старый цикл перед сбросом
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    // Сброс физических показателей
    pos.current = { x: 100, y: 0 };
    velocityY.current = 0;
    isOnGround.current = true;
    jumpCooldown.current = false;
    keys.current = {}; // Очищаем нажатые клавиши
    
    setPlayerX(100);
    setPlayerY(0);
    setIsNearMob(false);

    // Запускаем цикл заново для нового уровня
    requestRef.current = requestAnimationFrame(update);

    return () => cancelAnimationFrame(requestRef.current);
  }, [currentLevel]);

  // 2. ИГРОВОЙ ЦИКЛ (Вынесен отдельно)
  const update = () => {
    let nextX = pos.current.x;
    let nextY = pos.current.y;

    // Горизонтальное движение
    let moveDir = 0;
    if (keys.current['KeyD'] || keys.current['ArrowRight']) moveDir += 1;
    if (keys.current['KeyA'] || keys.current['ArrowLeft']) moveDir -= 1;
    
    const speed = isOnGround.current ? MOVE_SPEED : MOVE_SPEED * 0.9;
    nextX += moveDir * speed;

    // Прыжок
    if ((keys.current['Space'] || keys.current['KeyW'] || keys.current['ArrowUp']) 
        && isOnGround.current && !jumpCooldown.current) {
      velocityY.current = JUMP_FORCE;
      isOnGround.current = false;
      jumpCooldown.current = true;
    }

    // Гравитация
    velocityY.current -= GRAVITY;
    nextY += velocityY.current;

    // Коллизии (берем препятствия текущего уровня напрямую из стейта в момент вызова)
    let currentGround = 0;
    let hitWall = false;

    // Защита от ошибок, если данные уровня не прогрузились
    const obstacles = worlds[0].levels[currentLevel]?.obstacles || [];

    obstacles.forEach(obsX => {
      const isWithinX = nextX + PLAYER_WIDTH > obsX + 5 && nextX < obsX + BRICK_WIDTH - 5;
      if (isWithinX && nextY < BRICK_HEIGHT) {
        if (pos.current.y >= BRICK_HEIGHT && velocityY.current <= 0) {
          currentGround = BRICK_HEIGHT;
        } else {
          hitWall = true;
        }
      }
    });

    if (nextY <= currentGround) {
      nextY = currentGround;
      velocityY.current = 0;
      if (!isOnGround.current) {
        isOnGround.current = true;
        setTimeout(() => { jumpCooldown.current = false; }, 100);
      }
    }

    // Проверка на моба
    if (Math.abs(nextX - mobX) < 70 && nextY < 80) {
      setIsNearMob(true);
    }

    // Применение координат
    if (!hitWall) {
      pos.current.x = Math.max(0, nextX);
      setPlayerX(pos.current.x);
    }
    pos.current.y = nextY;
    setPlayerY(nextY);

    requestRef.current = requestAnimationFrame(update);
  };

  // Слушатели клавиатуры (один раз при монтировании)
  useEffect(() => {
    const onDown = (e) => { keys.current[e.code] = true; };
    const onUp = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  const handleWin = () => {
    if (currentLevel < worlds[0].levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else {
      alert("FINAL LEVEL CLEARED!");
    }
  };

  return (
    <div className="game-screen" style={{ background: levelData?.bg || '#000' }}>
      <div className="world-layer" style={{ transform: `translateX(-${cameraX}px)`, position: 'relative', width: '5000px', height: '100%' }}>
        <div className="ground-line"></div>
        {levelData?.obstacles.map((pos, i) => (
          <div key={`lvl-${currentLevel}-obj-${i}`} className="brick" style={{ left: pos, bottom: '40px' }}></div>
        ))}
        
        <div className="mob-wrapper" style={{ left: mobX, bottom: '40px' }}>
          <MobDisplay image={levelData?.mob} />
        </div>

        <div className="player-hero" style={{ 
          left: playerX, 
          bottom: `${40 + playerY}px`,
          position: 'absolute',
          fontSize: '40px',
          transform: `rotate(${velocityY.current * 2}deg)`,
          transition: 'transform 0.1s linear'
        }}>
          🤖
        </div>
      </div>

      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <h2 style={{ color: '#00ff41' }}>LEVEL {currentLevel + 1} DEBUG MODE</h2>
            <p className="task-text">{levelData?.task}</p>
            <CodeEditor 
              key={`editor-lvl-${currentLevel}`} // Гарантирует смену задания
              initialCode={levelData?.code}
              solution={levelData?.fix}
              onSuccess={handleWin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;