import React, { useState, useEffect, useRef, useCallback } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showTitle, setShowTitle] = useState(true);

  // Фізика через Ref для максимальної плавності
  const playerRef = useRef({ x: 100, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 100, y: 0 }); 

  const velocity = useRef({ x: 0, y: 0 });
  const keys = useRef({});
  const timerInterval = useRef(null);
  
  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  const mobX = 2800;
  const portalX = 3200;

  const SPEED = 11;
  const JUMP_FORCE = 18;
  const GRAVITY = 0.8;

  const generateLevel = useCallback(() => {
    const newObs = [];
    let last = 600;
    for (let i = 0; i < worldData.config.obstacleCount; i++) {
      last += Math.floor(Math.random() * (worldData.config.maxGap - worldData.config.minGap)) + worldData.config.minGap;
      if (last < mobX - 200) newObs.push(last);
    }
    setObstacles(newObs);
    setShowTitle(true);
    setTimeout(() => setShowTitle(false), 3000);
  }, [currentWorld, currentLevel, worldData]);

  useEffect(() => {
    generateLevel();
    playerRef.current = { x: 100, y: 0 };
    velocity.current = { x: 0, y: 0 };
    setShowPortal(false);
    setIsNearMob(false);
    setTimeLeft(levelData.time);
  }, [currentWorld, currentLevel, generateLevel, levelData.time]);

  // Таймер
  useEffect(() => {
    if (isNearMob && timeLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerInterval.current);
            alert("SYSTEM CRASHED! ChaosCompiler переміг.");
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerInterval.current);
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

      if (keys.current['d'] || keys.current['arrowright']) v.x = SPEED;
      else if (keys.current['a'] || keys.current['arrowleft']) v.x = -SPEED;
      else v.x *= 0.85;

      const isOnGround = p.y <= 0;
      const blockUnder = obstacles.find(ox => p.x + 40 > ox && p.x < ox + 60 && p.y >= 70 && p.y <= 85);
      
      if ((keys.current['w'] || keys.current[' '] || keys.current['arrowup']) && (isOnGround || blockUnder)) {
        v.y = JUMP_FORCE;
      }
      
      v.y -= GRAVITY;
      p.x += v.x;
      p.y += v.y;

      if (p.y <= 0) { p.y = 0; v.y = 0; }
      if (p.x < 0) p.x = 0;

      obstacles.forEach(ox => {
        if (p.x + 40 > ox && p.x < ox + 60 && p.y >= 70 && v.y <= 0) {
          if (p.y < 70) { p.y = 70; v.y = 0; }
        }
      });

      if (Math.abs(p.x - mobX) < 130 && !showPortal) setIsNearMob(true);
      if (showPortal && p.x > portalX - 40) handlePortalIn();

      setRenderPos({ x: p.x, y: p.y });
      frameId = requestAnimationFrame(update);
    };
    
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [isNearMob, obstacles, showPortal]);

  const handlePortalIn = () => {
    if (currentLevel < worldData.levels.length - 1) {
      setCurrentLevel(l => l + 1);
    } else if (currentWorld < worlds.length - 1) {
      setCurrentWorld(w => w + 1);
      setCurrentLevel(0);
    } else {
      alert("ВІТАЮ! ТИ ВРЯТУВАВ ГОЛОВНИЙ СЕРВЕР!");
    }
  };

  const onDebugSuccess = () => {
    setScore(s => s + 100 + (timeLeft * 10));
    setIsNearMob(false);
    setShowPortal(true);
  };

  useEffect(() => {
    const dn = (e) => keys.current[e.key.toLowerCase()] = true;
    const up = (e) => keys.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, []);

  return (
    <div className="game-screen" style={{ background: worldData.theme.bg }}>
      <div className="game-hud">
        <div className="hud-item">WORLD: <span>{worldData.name}</span></div>
        <div className="hud-item">SCORE: <span>{score}</span></div>
        {isNearMob && <div className="hud-timer">⚠️ SYSTEM CRASH IN: {timeLeft}s</div>}
      </div>

      <div className={`world-title-overlay ${showTitle ? 'active' : ''}`}>
        <h1 style={{ color: worldData.theme.accent }}>{worldData.name}</h1>
        <p>СЕКТОР {currentLevel + 1} / {worldData.levels.length}</p>
      </div>

      <div className="world-layer" style={{ transform: `translateX(-${Math.max(0, renderPos.x - 300)}px)`, width: '4500px' }}>
        <div className="ground-line" />
        {obstacles.map((pos, i) => <div key={i} className="brick" style={{ left: pos, bottom: '40px' }} />)}
        
        {!showPortal ? (
          <div className="mob-wrapper" style={{ left: mobX, bottom: '40px' }}>
            <div className="enemy-tag">{levelData.enemy}</div>
            <MobDisplay image={levelData.mob} />
          </div>
        ) : (
          <div className="portal-wrapper" style={{ left: portalX, bottom: '40px', color: worldData.theme.accent }}>
            <div className="portal-ring" />
            <span>ENTER PORTAL</span>
          </div>
        )}

        <div className="player-hero" style={{ left: renderPos.x, bottom: `${40 + renderPos.y}px` }}>🤖</div>
      </div>

      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            {/* Виправлено помилку парсингу >>> */}
            <div className="terminal-header">{">>> DETECTED: "}{levelData.enemy}</div>
            <p className="task-desc">{levelData.task}</p>
            <CodeEditor 
              key={`${currentWorld}-${currentLevel}`} 
              initialCode={levelData.code} 
              solution={levelData.fix} 
              onSuccess={onDebugSuccess} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;