import React, { useState, useEffect, useRef, useCallback } from 'react';
import { worlds } from './data/gameConfig';
import CodeEditor from './CodeEditor';
import MobDisplay from './MobDisplay';
import Intro from './Intro';

// Допоміжний компонент для сюжетного переходу між світами
const WorldTransition = ({ nextWorldName, onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="transition-screen">
      <div className="glitch-wrapper">
        <div className="log-line">INITIALIZING NEURAL LINK... [OK]</div>
        <div className="log-line">DECRYPTING SECTOR DATA... [OK]</div>
        <div className="log-line">BYPASSING FIREWALL... [DONE]</div>
        <h1 className="next-world-title">ВХІД У: {nextWorldName}</h1>
        <div className="loading-bar-container">
          <div className="loading-bar-fill"></div>
        </div>
      </div>
    </div>
  );
};

const Game = () => {
  // СТАНИ ГРИ: intro, playing, transitioning, dead
  const [gameState, setGameState] = useState('intro');
  const [currentWorld, setCurrentWorld] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isNearMob, setIsNearMob] = useState(false);
  const [showPortal, setShowPortal] = useState(false);
  const [showTitle, setShowTitle] = useState(false);

  // РЕФЕРИ ДЛЯ ФІЗИКИ
  const playerRef = useRef({ x: 100, y: 0 });
  const [renderPos, setRenderPos] = useState({ x: 100, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const keys = useRef({});
  const timerInterval = useRef(null);

  const worldData = worlds[currentWorld];
  const levelData = worldData.levels[currentLevel];
  
  const mobX = 4000;
  const portalX = 4600;

  // ГЕНЕРАЦІЯ ПЕРЕШКОД
  const generateObstacles = useCallback(() => {
    const obs = [];
    let last = 800;
    for (let i = 0; i < worldData.config.obstacleCount; i++) {
      last += Math.floor(Math.random() * (worldData.config.maxGap - worldData.config.minGap)) + worldData.config.minGap;
      if (last < mobX - 300) obs.push(last);
    }
    setObstacles(obs);
  }, [worldData.config, mobX]);

  // СКИДАННЯ РІВНЯ
  const resetLevel = useCallback(() => {
    playerRef.current = { x: 100, y: 0 };
    velocity.current = { x: 0, y: 0 };
    setIsNearMob(false);
    setShowPortal(false);
    setTimeLeft(levelData?.time || 20);
    generateObstacles();
    setShowTitle(true);
    const t = setTimeout(() => setShowTitle(false), 3000);
    return () => clearTimeout(t);
  }, [levelData, generateObstacles]);

  useEffect(() => {
    if (gameState === 'playing') resetLevel();
  }, [currentWorld, currentLevel, gameState, resetLevel]);

  // ЛОГІКА ПЕРЕХОДУ
  const handleNextAction = useCallback(() => {
    const isLastLevelInWorld = currentLevel >= worldData.levels.length - 1;
    const isLastWorld = currentWorld >= worlds.length - 1;

    if (isLastLevelInWorld && !isLastWorld) {
      setGameState('transitioning');
    } else if (!isLastLevelInWorld) {
      setCurrentLevel(prev => prev + 1);
    } else {
      alert("🏆 ВІТАЮ! ГОЛОВНИЙ СЕРВЕР ПОВНІСТЮ ОЧИЩЕНО!");
      window.location.reload();
    }
  }, [currentLevel, currentWorld, worldData.levels.length]);

  // GAME LOOP (ФІЗИКА)
  useEffect(() => {
    if (gameState !== 'playing' || isNearMob) return;
    
    let frameId;
    const update = () => {
      const p = playerRef.current;
      const v = velocity.current;

      if (keys.current['d'] || keys.current['arrowright']) v.x = 11;
      else if (keys.current['a'] || keys.current['arrowleft']) v.x = -11;
      else v.x *= 0.8;

      const isOnGround = p.y <= 0;
      const onBrick = obstacles.some(ox => p.x + 50 > ox && p.x < ox + 70 && Math.abs(p.y - 70) < 10);

      if ((keys.current['w'] || keys.current[' '] || keys.current['arrowup']) && (isOnGround || onBrick)) {
        v.y = 17;
      }

      v.y -= 0.8; 
      p.x += v.x;
      p.y += v.y;

      if (p.y < 0) { p.y = 0; v.y = 0; }
      if (p.x < 0) p.x = 0;

      // Зустріч з багом
      if (Math.abs(p.x - mobX) < 100 && !showPortal) {
        setIsNearMob(true);
        v.x = 0;
      }

      // Вхід у портал
      if (showPortal && p.x > portalX - 50) {
        handleNextAction();
      }

      setRenderPos({ x: p.x, y: p.y });
      frameId = requestAnimationFrame(update);
    };

    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, [gameState, isNearMob, obstacles, showPortal, handleNextAction]);

  // ТАЙМЕР ДЛЯ ТЕРМІНАЛУ
  useEffect(() => {
    if (isNearMob && timeLeft > 0) {
      timerInterval.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setGameState('dead');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerInterval.current);
  }, [isNearMob, timeLeft]);

  // КЕРУВАННЯ КЛАВІАТУРОЮ
  useEffect(() => {
    const dn = (e) => { keys.current[e.key.toLowerCase()] = true; };
    const up = (e) => { keys.current[e.key.toLowerCase()] = false; };
    window.addEventListener('keydown', dn);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', dn);
      window.removeEventListener('keyup', up);
    };
  }, []);

  // ВІДОБРАЖЕННЯ ЕКРАНІВ
  if (gameState === 'intro') return <Intro onStart={() => setGameState('playing')} />;
  
  if (gameState === 'transitioning') {
    return (
      <WorldTransition 
        nextWorldName={worlds[currentWorld + 1]?.name} 
        onComplete={() => {
          setCurrentWorld(w => w + 1);
          setCurrentLevel(0);
          setGameState('playing');
        }} 
      />
    );
  }

  if (gameState === 'dead') return (
    <div className="death-screen">
      <h1>[ SYSTEM CRASH ]</h1>
      <p>ChaosCompiler виявив вашу присутність і видалив ядро.</p>
      <button className="start-btn" onClick={() => window.location.reload()}>REBOOT SYSTEM</button>
    </div>
  );

  return (
    <div className={`game-screen ${isNearMob ? 'animate-shake' : ''}`} style={{ background: worldData.theme.bg }}>
      {/* HUD ІНТЕРФЕЙС */}
      <div className="game-hud">
        <div className="hud-item">{worldData.name} | СЕКТОР {currentLevel + 1}</div>
        <div className="hud-item">score: <span style={{color: worldData.theme.accent}}>{score}</span></div>
        {isNearMob && <div className="hud-timer">ВІРУС АКТИВНИЙ: {timeLeft}s</div>}
      </div>

      {/* НАЗВА СВІТУ (АНОНС) */}
      <div className={`world-title-overlay ${showTitle ? 'active' : ''}`}>
        <h1 style={{ color: worldData.theme.accent }}>{worldData.name}</h1>
      </div>

      {/* ІГРОВИЙ СВІТ */}
      <div className="world-layer" style={{ transform: `translateX(-${Math.max(0, renderPos.x - 400)}px)`, transition: 'none' }}>
        <div className="ground-line" style={{ borderColor: worldData.theme.ground }} />
        
        {obstacles.map((pos, i) => (
          <div key={`brick-${i}`} className="brick" style={{ left: pos }}>🧱</div>
        ))}
        
        {!showPortal ? (
          <div style={{ position: 'absolute', left: mobX, bottom: '40px' }}>
            <MobDisplay image={levelData.enemy} />
          </div>
        ) : (
          <div className="portal-wrapper" style={{ left: portalX, bottom: '40px' }}>
             <div className="portal-ring" style={{ borderColor: worldData.theme.accent }} />
             <div className="interact-hint">ПОРТАЛ ВІДКРИТО</div>
          </div>
        )}

        {/* ГЕРОЙ */}
        <div className="player-hero" style={{ left: renderPos.x, bottom: `${40 + renderPos.y}px`, transition: 'none' }}>🤖</div>
      </div>

      {/* ТЕРМІНАЛ ДЕБАГУ */}
      <div className={`bottom-terminal ${isNearMob ? 'open' : ''}`}>
        {isNearMob && levelData && (
          <div className="terminal-inner">
            <div className="terminal-header">
              {`>>> ОБ'ЄКТ: ${levelData.enemy.replace('.png', '').toUpperCase()}`}
            </div>
            <div className="task-text">{levelData.task}</div>
            <CodeEditor 
              key={`${currentWorld}-${currentLevel}`} 
              initialCode={levelData.code} 
              solution={levelData.fix} 
              onSuccess={() => {
                setIsNearMob(false);
                setShowPortal(true);
                setScore(s => s + (timeLeft * 100));
                clearInterval(timerInterval.current);
              }} 
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Game;