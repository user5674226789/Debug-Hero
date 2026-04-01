import React, { useState, useEffect, useRef } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor'; 

const Game = () => {
  if (!worlds || !worlds[0] || !worlds[0].levels) {
    return (
      <div style={{ color: 'white', background: '#222', height: '100vh', padding: '20px' }}>
        Ошибка загрузки gameConfig.js
      </div>
    );
  }

  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  HEAD
  const [playerX, setPlayerX] = useState(100);
  const [playerY, setPlayerY] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showWorldTitle, setShowWorldTitle] = useState(true);
  const [isSuckingIn, setIsSuckingIn] = useState(false);

  const isNearMobRef = useRef(false);
  const showPortalRef = useRef(false);
  const isSuckingInRef = useRef(false);

  const worldData = worlds[currentWorld] || worlds[0];
  const levelData = worldData.levels[currentLevel];

  const mobX = 1800;
  const portalX = 2200;
  const cameraX = Math.min(playerX - 100, portalX - 400);

  const keys = useRef({});
  const pos = useRef({ x: 100, y: 0 });
  const velocityY = useRef(0);
  const isOnGround = useRef(true);
  const requestRef = useRef();

  useEffect(() => { isNearMobRef.current = isNearMob; }, [isNearMob]);
  useEffect(() => { showPortalRef.current = showPortal; }, [showPortal]);
  useEffect(() => { isSuckingInRef.current = isSuckingIn; }, [isSuckingIn]);

  const handleNextLevel = () => {
    if (currentLevel < worldData.levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else if (currentWorld < worlds.length - 1) {
      setCurrentWorld(prev => prev + 1);
      setCurrentLevel(0);
    } else {
      alert("ПОЗДРАВЛЯЮ! ВСЕ МИРЫ ПРОЙДЕНЫ!");
      setCurrentWorld(0);
      setCurrentLevel(0);
    }
  };

  const update = () => {
    if (isSuckingInRef.current) {
      requestRef.current = requestAnimationFrame(update);
      return;
    }

    let nextX = pos.current.x;
    let nextY = pos.current.y;

    let moveDir = 0;

    if (!isNearMobRef.current) {
      if (keys.current['KeyD'] || keys.current['ArrowRight'] || keys.current['d']) moveDir += 1;
      if (keys.current['KeyA'] || keys.current['ArrowLeft'] || keys.current['a']) moveDir -= 1;
    }

    nextX += moveDir * 7;

    if (
      !isNearMobRef.current &&
      (keys.current['Space'] || keys.current['KeyW'] || keys.current['w']) &&
      isOnGround.current
    ) {
      velocityY.current = 14;
      isOnGround.current = false;
    }

    velocityY.current -= 0.6;
    nextY += velocityY.current;

    if (nextY <= 0) {
      nextY = 0;
      velocityY.current = 0;
      isOnGround.current = true;
    }

    // моб
    if (
      !showPortalRef.current &&
      !isNearMobRef.current &&
      Math.abs(nextX - mobX) < 80
    ) {
      setIsNearMob(true);
    }

    // портал
    if (
      showPortalRef.current &&
      !isSuckingInRef.current &&
      Math.abs(nextX - portalX) < 60
    ) {
      isSuckingInRef.current = true;
      setIsSuckingIn(true);

      setTimeout(() => {
        handleNextLevel();
      }, 700);

      return;
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
    velocityY.current = 0;

    setPlayerX(100);
    setPlayerY(0);

    setIsNearMob(false);
    setShowPortal(false);
    setIsSuckingIn(false);

    isNearMobRef.current = false;
    showPortalRef.current = false;
    isSuckingInRef.current = false;

    setShowWorldTitle(true);

    const timer = setTimeout(() => setShowWorldTitle(false), 3000);

    requestRef.current = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(requestRef.current);
      clearTimeout(timer);
    };
  }, [currentLevel, currentWorld]);

  useEffect(() => {
    const down = (e) => {
      keys.current[e.code] = true;
      keys.current[e.key.toLowerCase()] = true;
    };
    const up = (e) => {
      keys.current[e.code] = false;
      keys.current[e.key.toLowerCase()] = false;
    };

    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);

    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);

return (
  <div
    className="game-screen"
    style={{
      background: worldData?.theme?.bg || '#1a1a1a',
      width: '100vw',
      height: '100vh',
      overflow: 'hidden',
      position: 'relative'
    }}
  >
    {/* название мира */}
    <div
      style={{
        position: 'absolute',
        top: '30%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: showWorldTitle ? 1 : 0,
        transition: 'opacity 1s',
        zIndex: 10,
        pointerEvents: 'none',
        color: worldData?.theme?.accent || 'cyan',
        fontSize: '3.5rem',
        fontWeight: 'bold'
      }}
    >
      {worldData?.name}
    </div>

    <div
      className="world-layer"
      style={{
        transform: `translateX(-${Math.max(0, cameraX)}px)`,
        width: '5000px',
        height: '100%',
        position: 'relative'
      }}
    >
      {/* земля */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          width: '100%',
          height: '2px',
          background: 'white',
          opacity: 0.1
        }}
      />

      {/* моб */}
      {!showPortal && (
        <div style={{ position: 'absolute', left: mobX, bottom: '40px' }}>
          <MobDisplay image={levelData?.mob} />
        </div>
      )}

      {/* портал */}
      {showPortal && (
        <div
          style={{
            position: 'absolute',
            left: portalX,
            bottom: '40px',
            width: '120px',
            height: '200px',
            background: `radial-gradient(ellipse, ${worldData?.theme?.accent || 'cyan'} 0%, transparent 80%)`,
            borderRadius: '50%',
            boxShadow: `0 0 40px ${worldData?.theme?.accent || 'cyan'}`,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <div style={{ color: 'white', fontSize: '18px', animation: 'pulse 1.5s infinite' }}>
            ENTER
          </div>
        </div>
      )}

      {/* игрок */}
      <div
        style={{
          left: isSuckingIn ? portalX + 35 : playerX,
          bottom: isSuckingIn ? '120px' : `${40 + playerY}px`,
          position: 'absolute',
          fontSize: '50px',
          transition: isSuckingIn ? 'all 0.8s ease-in' : 'transform 0.1s linear',
          transform: isSuckingIn
            ? 'rotate(1080deg) scale(0)'
            : `rotate(${velocityY.current * 2}deg)`,
          opacity: isSuckingIn ? 0 : 1
        }}
      >
        🤖
      </div>
    </div>

    {/* терминал */}
    {isNearMob && levelData && (
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: '100%',
          height: '45%',
          background: 'rgba(0,0,0,0.95)',
          borderTop: `2px solid ${worldData?.theme?.accent || 'cyan'}`,
          padding: '20px',
          color: '#fff',
          zIndex: 100
        }}
      >
        <h2 style={{ color: worldData?.theme?.accent || 'cyan' }}>
          LEVEL {currentLevel + 1}
        </h2>

        <p>{levelData.task}</p>

        <CodeEditor
          key={`${currentWorld}-${currentLevel}`}
          initialCode={levelData.code}
          solution={levelData.fix}
          onSuccess={() => {
            setIsNearMob(false);
            isNearMobRef.current = false;

            setShowPortal(true);
            showPortalRef.current = true;
          }}
        />
      </div>
    )}

    <style>{`
      @keyframes pulse {
        0% { transform: scale(1); opacity: 0.8; }
        50% { transform: scale(1.1); opacity: 1; }
        100% { transform: scale(1); opacity: 0.8; }
      }
    `}</style>
  </div>
);
};

export default Game;