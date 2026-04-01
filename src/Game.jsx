import React, { useState, useEffect, useRef } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  // Проверка: загрузились ли миры вообще
  if (!worlds || !Array.isArray(worlds) || worlds.length === 0) {
    return <div style={{color: 'white', padding: '20px'}}>Ошибка: worlds не найден в gameConfig.js</div>;
  }

  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showWorldTitle, setShowWorldTitle] = useState(true);
  const [isSuckingIn, setIsSuckingIn] = useState(false);

  // Безопасное получение данных (чтобы не было черного экрана)
  const worldData = worlds[currentWorld] || worlds[0];
  const levels = worldData.levels || [];
  const levelData = levels[currentLevel] || (levels[0] ? levels[0] : null);

  const mobX = 1800;
  const portalX = 2200;
  const cameraX = Math.max(0, playerX - 300);

  const keys = useRef({});
  const pos = useRef({ x: 100, y: 0 });
  const velocityY = useRef(0);
  const isOnGround = useRef(true);
  const requestRef = useRef();

  const handleNextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else if (currentWorld < worlds.length - 1) {
      setCurrentWorld(prev => prev + 1);
      setCurrentLevel(0);
    }
    setIsSuckingIn(false);
  };

  const update = () => {
    if (isSuckingIn) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }
    let nextX = pos.current.x;
    let nextY = pos.current.y;
    let moveDir = 0;
    if (!isNearMob) {
      if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) moveDir += 1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) moveDir -= 1;
    }
    nextX += moveDir * 7;

    if (!isNearMob && (keys.current['Space'] || keys.current['KeyW'] || keys.current['w']) && isOnGround.current) {
      velocityY.current = 14;
      isOnGround.current = false;
    }
    velocityY.current -= 0.6;
    nextY += velocityY.current;
    if (nextY <= 0) { nextY = 0; velocityY.current = 0; isOnGround.current = true; }

    // Проверка портала
    if (showPortal && Math.abs(nextX - portalX) < 60) {
      setIsSuckingIn(true);
      setTimeout(() => handleNextLevel(), 800);
      return;
    }
    // Проверка моба
    if (!showPortal && !isNearMob && Math.abs(nextX - mobX) < 80) {
      setIsNearMob(true);
    }

    pos.current.x = Math.max(0, nextX);
    pos.current.y = nextY;
    setPlayerX(pos.current.x);
    setPlayerY(nextY);
    requestRef.current = requestAnimationFrame(update);
  };

  useEffect(() => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    pos.current = { x: 100, y: 0 };
    setPlayerX(100); setPlayerY(0);
    setIsNearMob(false); setShowPortal(false); setIsSuckingIn(false); setShowWorldTitle(true);
    const timer = setTimeout(() => setShowWorldTitle(false), 3000);
    requestRef.current = requestAnimationFrame(update);
    return () => { cancelAnimationFrame(requestRef.current); clearTimeout(timer); };
  }, [currentLevel, currentWorld]);

  useEffect(() => {
    const onDown = (e) => { keys.current[e.code] = true; keys.current[e.key.toLowerCase()] = true; };
    const onUp = (e) => { keys.current[e.code] = false; keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => { window.removeEventListener('keydown', onDown); window.removeEventListener('keyup', onUp); };
  }, []);

  return (
    <div style={{ background: worldData?.theme?.bg || '#111', width: '100vw', height: '100vh', overflow: 'hidden', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '30%', left: '50%', transform: 'translate(-50%, -50%)', opacity: showWorldTitle ? 1 : 0, transition: 'opacity 1s', color: worldData?.theme?.accent || 'cyan', fontSize: '3rem', pointerEvents: 'none' }}>
        <h1>{worldData?.name}</h1>
      </div>
      <div style={{ transform: `translateX(-${cameraX}px)`, width: '5000px', height: '100%', position: 'relative' }}>
        <div style={{ position: 'absolute', bottom: '40px', width: '100%', height: '2px', background: 'white', opacity: 0.1 }}></div>
        {!showPortal && <div style={{ position: 'absolute', left: mobX, bottom: '40px' }}><MobDisplay image={levelData?.mob} /></div>}
        {showPortal && <div style={{ position: 'absolute', left: portalX - 50, bottom: '40px', width: '100px', height: '180px', background: `radial-gradient(circle, ${worldData?.theme?.accent || 'cyan'} 0%, transparent 80%)`, borderRadius: '50%', boxShadow: `0 0 40px ${worldData?.theme?.accent || 'cyan'}`, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white' }}>ENTER</div>}
        <div style={{ left: isSuckingIn ? portalX : playerX, bottom: isSuckingIn ? '100px' : `${40 + playerY}px`, position: 'absolute', fontSize: '50px', transition: isSuckingIn ? 'all 0.8s ease-in' : 'transform 0.1s linear', transform: isSuckingIn ? 'rotate(1080deg) scale(0)' : `rotate(${velocityY.current * 2}deg)`, opacity: isSuckingIn ? 0 : 1 }}>🤖</div>
      </div>
      {isNearMob && levelData && (
        <div style={{ position: 'fixed', bottom: 0, width: '100%', height: '40%', background: 'rgba(0,0,0,0.9)', padding: '20px', zIndex: 100, color: 'white', borderTop: '2px solid cyan' }}>
          <h2>УРОВЕНЬ {currentLevel + 1}</h2>
          <p>{levelData.task}</p>
          <CodeEditor initialCode={levelData.code} solution={levelData.fix} onSuccess={() => { setIsNearMob(false); setShowPortal(true); }} />
        </div>
      )}
    </div>
  );
};

export default Game;