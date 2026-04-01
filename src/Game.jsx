import React, { useState, useEffect, useRef, useCallback } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showWorldTitle, setShowWorldTitle] = useState(true);

  // Данные текущего мира и уровня
  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  const mobX = 2500;
  const portalX = 3000;
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
  const requestRef = useRef();

  // 1. Сброс при смене уровня/мира
  useEffect(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    pos.current = { x: 100, y: 0 };
    velocityY.current = 0;
    isOnGround.current = true;
    jumpCooldown.current = false;
    keys.current = {};
    
    setPlayerX(100);
    setPlayerY(0);
    setIsNearMob(false);
    setShowPortal(false);
    setShowWorldTitle(true);

    const timer = setTimeout(() => setShowWorldTitle(false), 3000);
    
    requestRef.current = requestAnimationFrame(update);
    return () => {
        cancelAnimationFrame(requestRef.current);
        clearTimeout(timer);
    };
  }, [currentLevel, currentWorld]);

  // 2. Игровой цикл
  const update = () => {
    let nextX = pos.current.x;
    let nextY = pos.current.y;

    // Горизонтальное движение (блокируем, если открыт терминал)
    let moveDir = 0;
    if (!isNearMob) {
        if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) moveDir += 1;
        if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) moveDir -= 1;
    }
    
    const speed = isOnGround.current ? MOVE_SPEED : MOVE_SPEED * 0.9;
    nextX += moveDir * speed;

    // Прыжок
    if (!isNearMob && (keys.current['Space'] || keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w']) 
        && isOnGround.current && !jumpCooldown.current) {
      velocityY.current = JUMP_FORCE;
      isOnGround.current = false;
      jumpCooldown.current = true;
    }

    // Гравитация
    velocityY.current -= GRAVITY;
    nextY += velocityY.current;

    // Коллизии
    let currentGround = 0;
    let hitWall = false;
    const obstacles = levelData?.obstacles || [];

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
        setTimeout(() => { jumpCooldown.current = false; }, 500);
      }
    }

    // Проверка моба и портала
    if (!showPortal && Math.abs(nextX - mobX) < 70 && nextY < 80) {
      setIsNearMob(true);
    }
    
    if (showPortal && nextX > portalX - 50) {
      handleNextLevel();
      return; // Останавливаем цикл, handleNextLevel перезапустит его
    }

    // Применение
    if (!hitWall) {
      pos.current.x = Math.max(0, nextX);
      setPlayerX(pos.current.x);
    }
    pos.current.y = nextY;
    setPlayerY(nextY);

    requestRef.current = requestAnimationFrame(update);
  };

  const handleNextLevel = () => {
    if (currentLevel < worldData.levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else if (currentWorld < worlds.length - 1) {
      setCurrentWorld(prev => prev + 1);
      setCurrentLevel(0);
    } else {
      alert("ПОЗДРАВЛЯЮ! ВСЕ МИРЫ ОЧИЩЕНЫ!");
    }
  };

  // Слушатели клавиш
  useEffect(() => {
    const onDown = (e) => { keys.current[e.code] = true; keys.current[e.key.toLowerCase()] = true; };
    const onUp = (e) => { keys.current[e.code] = false; keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  return (
    <div className="game-screen" style={{ background: worldData.theme?.bg || levelData?.bg }}>
      <div className="ui-overlay">
        <div className="ui-world">{worldData.name}</div>
        <div className="ui-level">СЕКТОР: {currentLevel + 1}</div>
      </div>

      <div className={`world-title-anim ${showWorldTitle ? 'active' : ''}`}>
        <h1 style={{ color: worldData.theme?.accent }}>{worldData.name}</h1>
      </div>

      <div className="world-layer" style={{ transform: `translateX(-${cameraX}px)`, width: '5000px', height: '100%', position: 'relative' }}>
        <div className="ground-line"></div>
        
        {levelData?.obstacles.map((pos, i) => (
          <div key={`lvl-${currentLevel}-obj-${i}`} className="brick" style={{ left: pos, bottom: '40px' }}></div>
        ))}
        
        {!showPortal ? (
          <div className="mob-wrapper" style={{ left: mobX, bottom: '40px' }}>
            <MobDisplay image={levelData?.mob} />
          </div>
        ) : (
          <div className="portal-effect" style={{ left: portalX, bottom: '40px' }}>
            <div className="portal-core" style={{ backgroundColor: worldData.theme?.accent }} />
          </div>
        )}

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
            <h2 style={{ color: worldData.theme?.accent || '#00ff41' }}>DEBUG: {levelData.difficulty}</h2>
            <p className="task-text">{levelData?.task}</p>
            <CodeEditor 
              key={`editor-${currentWorld}-${currentLevel}`}
              initialCode={levelData?.code}
              solution={levelData?.fix}
              onSuccess={() => {
                setIsNearMob(false);
                setShowPortal(true);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;