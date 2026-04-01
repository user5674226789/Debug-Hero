import React, { useState, useEffect, useRef, useCallback } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor'; 

const Game = () => {
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  // Камера та Фізика
  const playerRef = useRef({ x: 100, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 100, y: 0 }); 
  const velocity = useRef({ x: 0, y: 0 });
  const keys = useRef({});
  const timerInterval = useRef(null);
  
  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  
  const mobX = 4200; // Дистанція до ворога
  const portalX = 4800; // Дистанція до порталу

  const generateLevel = useCallback(() => {
    const newObs = [];
    let last = 600;
    for (let i = 0; i < worldData.config.obstacleCount; i++) {
      last += Math.floor(Math.random() * (worldData.config.maxGap - worldData.config.minGap)) + worldData.config.minGap;
      if (last < mobX - 400) newObs.push(last);
    }
    setObstacles(newObs);
    setShowTitle(true);
    setTimeout(() => setShowTitle(false), 3000);
  }, [currentWorld, currentLevel, worldData]);

  useEffect(() => {
    generateLevel();
    playerRef.current = { x: 100, y: 0 };
    setShowPortal(false);
    setIsNearMob(false);
    setTimeLeft(levelData.time);
  }, [currentWorld, currentLevel, generateLevel, levelData.time]);

  // Таймер зворотного відліку (Hard Reset при 0)
  useEffect(() => {
    if (isNearMob && timeLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerInterval.current);
            alert("❌ SYSTEM CRASHED! ChaosCompiler видалив систему. Починай з 1-го світу!");
            setCurrentWorld(0);
            setCurrentLevel(0);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval.current);
  }, [isNearMob]);

  // Game Loop
  useEffect(() => {
    let frameId;
    const update = () => {
      if (isNearMob) {
        frameId = requestAnimationFrame(update);
        return;
      }
      const v = velocity.current;
      const p = playerRef.current;

      if (keys.current['d'] || keys.current['arrowright']) v.x = 12;
      else if (keys.current['a'] || keys.current['arrowleft']) v.x = -12;
      else v.x *= 0.8;

      const isOnGround = p.y <= 0;
      const blockUnder = obstacles.find(ox => p.x + 40 > ox && p.x < ox + 60 && p.y >= 70 && p.y <= 85);
      
      if ((keys.current['w'] || keys.current[' '] || keys.current['arrowup']) && (isOnGround || blockUnder)) {
        v.y = 18;
      }
      
      v.y -= 0.8; // Gravity
      p.x += v.x;
      p.y += v.y;

      if (p.y <= 0) { p.y = 0; v.y = 0; }
      if (p.x < 0) p.x = 0;

      // Колізії з цеглою
      obstacles.forEach(ox => {
        if (p.x + 40 > ox && p.x < ox + 60 && p.y >= 70 && v.y <= 0) {
          if (p.y < 70) { p.y = 70; v.y = 0; }
        }
      });

      if (Math.abs(p.x - mobX) < 150 && !showPortal) setIsNearMob(true);
      if (showPortal && p.x > portalX - 50) handleLevelUp();

      setRenderPos({ x: p.x, y: p.y });
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isNearMob, obstacles, showPortal]);

  const handleLevelUp = () => {
    if (currentLevel < worldData.levels.length - 1) {
      setCurrentLevel(prev => prev + 1);
    } else if (currentWorld < worlds.length - 1) {
      setCurrentWorld(prev => prev + 1);
      setCurrentLevel(0);
    } else {
      alert("🏆 ВІТАЮ! ТИ ВРЯТУВАВ ГОЛОВНИЙ СЕРВЕР!");
      window.location.reload();
    }
  };

  const onFixSuccess = () => {
    setScore(s => s + 1000 + (timeLeft * 50));
    setIsNearMob(false);
    setShowPortal(true);
    clearInterval(timerInterval.current);
  };

  useEffect(() => {
    const dn = (e) => keys.current[e.key.toLowerCase()] = true;
    const up = (e) => keys.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  return (
    <div className={`game-screen ${isNearMob ? 'animate-shake' : ''}`} style={{ background: worldData.theme.bg }}>
      
      {/* HUD Інтерфейс */}
      <div className="game-hud">
        <div className="hud-item">СВІТ: <span>{worldData.name}</span></div>
        <div className="hud-item">БАЛИ: <span>{score}</span></div>
        {isNearMob && <div className="hud-timer">⚠️ СИСТЕМА ПАДАЄ: {timeLeft}с</div>}
      </div>

      {/* Анонс Світу */}
      <div className={`world-title-overlay ${showTitle ? 'active' : ''}`}>
        <h1 style={{ color: worldData.theme.accent }}>{worldData.name}</h1>
        <p>СЕКТОР {currentLevel + 1} / {worldData.levels.length}</p>
      </div>

      {/* Світ та Камера */}
      <div className="world-layer" style={{ transform: `translateX(-${Math.max(0, renderPos.x - 400)}px)`, width: '6000px' }}>
        <div className="ground-line" />
        
        {obstacles.map((pos, i) => <div key={i} className="brick" style={{ left: pos }}>🧱</div>)}
        
        {!showPortal ? (
          <div className="mob-wrapper" style={{ left: mobX }}>
            <div className="enemy-tag" style={{ background: 'red', color: '#fff', fontSize: '10px', padding: '2px 5px' }}>{levelData.enemy}</div>
            <div style={{ fontSize: '60px' }}>👾</div>
          </div>
        ) : (
          <div className="portal-wrapper" style={{ left: portalX, bottom: '40px' }}>
             <div className="portal-ring" style={{ borderColor: worldData.theme.accent, color: worldData.theme.accent }} />
             <div className="interact-hint">ПОРТАЛ ВІДКРИТО</div>
          </div>
        )}

        {/* Герой */}
        <div className="player-hero" style={{ left: renderPos.x, bottom: `${40 + renderPos.y}px` }}>🤖</div>
      </div>

      {/* Термінал */}
      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <div className="terminal-header">{">>> ФАЙЛ ПОШКОДЖЕНО: "}{levelData.enemy}</div>
            <div className="task-text">{levelData.task}</div>
            <CodeEditor 
              key={`${currentWorld}-${currentLevel}`} 
              initialCode={levelData.code} 
              solution={levelData.fix} 
              onSuccess={onFixSuccess} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;