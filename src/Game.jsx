import React, { useState, useEffect, useRef, useCallback } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';

const Game = () => {
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [playerPos, setPlayerPos] = useState({ x: 100, y: 0 });
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showWorldTitle, setShowWorldTitle] = useState(true);

  const velocity = useRef({ x: 0, y: 0 });
  const keys = useRef({});
  
  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  const mobX = 3000;
  const portalX = 3400;

  // Фізичні константи
  const SPEED = 10;
  const JUMP_FORCE = 18;
  const GRAVITY = 0.8;
  const FRICTION = 0.8;

  // Генерація рівня
  const generateLevel = useCallback(() => {
    const newObs = [];
    let last = 600;
    const { obstacleCount, minGap, maxGap } = worldData.config;
    for (let i = 0; i < obstacleCount; i++) {
      last += Math.floor(Math.random() * (maxGap - minGap)) + minGap;
      if (last < mobX - 200) newObs.push(last);
    }
    setObstacles(newObs);
    setShowWorldTitle(true);
    setTimeout(() => setShowWorldTitle(false), 3000);
  }, [currentWorld, currentLevel, worldData]);

  useEffect(() => {
    generateLevel();
    setPlayerPos({ x: 100, y: 0 });
    velocity.current = { x: 0, y: 0 };
    setShowPortal(false);
    setIsNearMob(false);
  }, [currentWorld, currentLevel, generateLevel]);

  // Game Loop
  useEffect(() => {
    let frameId;
    const update = () => {
      if (isNearMob) {
        frameId = requestAnimationFrame(update);
        return;
      }

      const v = velocity.current;
      
      // Рух X
      if (keys.current['d'] || keys.current['arrowright']) v.x = SPEED;
      else if (keys.current['a'] || keys.current['arrowleft']) v.x = -SPEED;
      else v.x *= FRICTION;

      // Гравітація та Стрибок
      const isOnGround = playerPos.y <= 0;
      const blockUnder = obstacles.find(ox => playerPos.x + 40 > ox && playerPos.x < ox + 60 && playerPos.y >= 70 && playerPos.y <= 80);
      
      if ((keys.current['w'] || keys.current[' '] || keys.current['arrowup']) && (isOnGround || blockUnder)) {
        v.y = JUMP_FORCE;
      }
      
      v.y -= GRAVITY;

      let nextX = playerPos.x + v.x;
      let nextY = playerPos.y + v.y;

      // Колізії
      const hitsWall = obstacles.some(ox => nextX + 50 > ox && nextX < ox + 70 && nextY < 60);
      if (hitsWall) { nextX = playerPos.x; v.x = 0; }

      if (nextY <= 0) { nextY = 0; v.y = 0; }
      
      // Перевірка приземлення на блок
      obstacles.forEach(ox => {
        if (playerPos.x + 40 > ox && playerPos.x < ox + 60 && playerPos.y >= 70 && v.y <= 0) {
          if (nextY < 70) { nextY = 70; v.y = 0; }
        }
      });

      setPlayerPos({ x: Math.max(0, nextX), y: nextY });
      
      // Моб/Портал
      if (Math.abs(nextX - mobX) < 130 && !showPortal) setIsNearMob(true);
      if (showPortal && nextX > portalX - 40) handleNext();

      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [playerPos, isNearMob, obstacles, showPortal]);

  const handleNext = () => {
    if (currentLevel < 2) setCurrentLevel(l => l + 1);
    else if (currentWorld < 3) { setCurrentWorld(w => w + 1); setCurrentLevel(0); }
  };

  useEffect(() => {
    const dn = (e) => keys.current[e.key.toLowerCase()] = true;
    const up = (e) => keys.current[e.key.toLowerCase()] = false;
    window.addEventListener('keydown', dn); window.addEventListener('keyup', up);
    return () => { window.removeEventListener('keydown', dn); window.removeEventListener('keyup', up); };
  }, []);

  return (
    <div className="game-screen" style={{ background: worldData.theme.bg }}>
      {/* UI: Поточний стан */}
      <div className="ui-overlay" style={{ borderColor: worldData.theme.accent }}>
        <div className="ui-world">{worldData.name}</div>
        <div className="ui-level">СЕКТОР: {currentLevel + 1} / 3</div>
        <div className="ui-status">{showPortal ? "ПОРТАЛ ВІДКРИТО" : "ПОШУК БАГІВ..."}</div>
      </div>

      {/* Величезний напис при старті світу */}
      <div className={`world-title-anim ${showWorldTitle ? 'active' : ''}`}>
        <h1 style={{ color: worldData.theme.accent }}>{worldData.name}</h1>
      </div>

      <div className="world-layer" style={{ transform: `translateX(-${Math.max(0, playerPos.x - 300)}px)`, width: '5000px' }}>
        <div className="ground-line"></div>
        {obstacles.map((pos, i) => <div key={i} className="brick" style={{ left: pos, bottom: '40px' }} />)}
        
        {!showPortal ? (
          <div className="mob-wrapper" style={{ left: mobX, bottom: '40px' }}><MobDisplay image={levelData.mob} /></div>
        ) : (
          <div className="portal-effect" style={{ left: portalX, bottom: '40px', color: worldData.theme.accent }}><div className="portal-core" /></div>
        )}

        <div className="player-hero" style={{ left: playerPos.x, bottom: `${40 + playerPos.y}px` }}>🤖</div>
      </div>

      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && (
          <div className="terminal-inner">
            <h2 style={{ color: worldData.theme.accent }}>DEBUG: {levelData.difficulty}</h2>
            <p>{levelData.task}</p>
            <CodeEditor key={`${currentWorld}-${currentLevel}`} initialCode={levelData.code} solution={levelData.fix} onSuccess={() => { setIsNearMob(false); setShowPortal(true); }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;