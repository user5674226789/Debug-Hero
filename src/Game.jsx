import React, { useState, useEffect, useRef } from 'react';
// Проверь, что путь до data/gameConfig верный! 
// Судя по скриншоту, папка data находится внутри src, значит путь './data/gameConfig' правильный.
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  // Проверка на наличие данных, чтобы проект не падал
  if (!worlds || !worlds[0]) {
    return <div style={{color: 'white'}}>Ошибка: Данные миров не найдены в gameConfig.js</div>;
  }

  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showWorldTitle, setShowWorldTitle] = useState(true);

  const worldData = worlds[currentWorld];
  const levelData = worldData?.levels[currentLevel];
  const mobX = 2500;
  const portalX = 3000;
  const cameraX = Math.max(0, playerX - 300);

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

  // Основной цикл игры
  const update = () => {
    let nextX = pos.current.x;
    let nextY = pos.current.y;

    let moveDir = 0;
    if (!isNearMob) {
      if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) moveDir += 1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) moveDir -= 1;
    }
    
    const speed = isOnGround.current ? MOVE_SPEED : MOVE_SPEED * 0.8;
    nextX += moveDir * speed;

    if (!isNearMob && (keys.current['Space'] || keys.current['KeyW'] || keys.current['ArrowUp'] || keys.current['w']) 
        && isOnGround.current && !jumpCooldown.current) {
      velocityY.current = JUMP_FORCE;
      isOnGround.current = false;
      jumpCooldown.current = true;
    }

    velocityY.current -= GRAVITY;
    nextY += velocityY.current;

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

    if (!showPortal && Math.abs(nextX - mobX) < 70 && nextY < 80) {
      setIsNearMob(true);
    }
    
    if (showPortal && nextX > portalX - 50) {
      handleNextLevel();
      return; 
    }

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
    }
  };

  useEffect(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    
    pos.current = { x: 100, y: 0 };
    velocityY.current = 0;
    isOnGround.current = true;
    jumpCooldown.current = false;
    
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

  useEffect(() => {
    const onDown = (e) => { keys.current[e.code] = true; keys.current[e.key.toLowerCase()] = true; };
    const onUp = (e) => { keys.current[e.code] = false; keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
    };
  }, []);

  return (
    <div className="game-screen" style={{ background: worldData?.theme?.bg || '#1a1a1a', height: '100vh', width: '100vw', position: 'relative', overflow: 'hidden' }}>
      <div className={`world-title-anim ${showWorldTitle ? 'active' : ''}`} style={{
        position: 'absolute', top: '40%', left: '50%', transform: 'translate(-50%, -50%)',
        zIndex: 10, pointerEvents: 'none', opacity: showWorldTitle ? 1 : 0, transition: 'opacity 0.5s'
      }}>
        <h1 style={{ color: worldData?.theme?.accent || '#00ff41', fontSize: '3rem' }}>{worldData?.name}</h1>
      </div>

      <div className="world-layer" style={{ transform: `translateX(-${cameraX}px)`, width: '5000px', height: '100%', position: 'relative' }}>
        <div className="ground-line" style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: 'rgba(255,255,255,0.2)' }}></div>
        {levelData?.obstacles?.map((obsPos, i) => (
          <div key={`lvl-${currentLevel}-obj-${i}`} className="brick" style={{ left: obsPos, bottom: '40px', width: '70px', height: '70px', position: 'absolute', background: '#444' }}></div>
        ))}
        
        {!showPortal ? (
          <div className="mob-wrapper" style={{ left: mobX, bottom: '40px', position: 'absolute' }}>
            <MobDisplay image={levelData?.mob} />
          </div>
        ) : (
          <div className="portal-effect" style={{ left: portalX, bottom: '40px', position: 'absolute' }}>
            <div className="portal-core" style={{ width: '60px', height: '100px', backgroundColor: worldData?.theme?.accent || '#00ff41', borderRadius: '50%', boxShadow: '0 0 20px #00ff41' }} />
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

      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`} style={{
          position: 'fixed', bottom: 0, width: '100%', height: isNearMob ? '40%' : '0', 
          background: '#000', transition: 'height 0.3s', overflow: 'hidden', zIndex: 100
      }}>
        {isNearMob && (
          <div className="terminal-inner" style={{ padding: '20px', color: '#fff' }}>
            <h2 style={{ color: worldData?.theme?.accent || '#00ff41' }}>DEBUG: Уровень {currentLevel + 1}</h2>
            <p>{levelData?.task}</p>
            <CodeEditor 
              key={`ed-${currentWorld}-${currentLevel}`}
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