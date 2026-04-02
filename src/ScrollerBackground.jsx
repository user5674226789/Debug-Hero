import React from 'react';

// Допоміжний компонент для одного шару паралаксу
const ParallaxLayer = ({ playerX, image, speed, opacity = 1, zIndex = -1 }) => {
  // Використовуємо backgroundPosition для створення нескінченного циклу
  const offset = -(playerX * speed);
  
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: zIndex,
        opacity: opacity,
        backgroundImage: `url(${image})`,
        backgroundRepeat: 'repeat-x',
        backgroundSize: 'cover',
        backgroundPosition: `${offset}px center`,
        pointerEvents: 'none',
        transition: 'opacity 0.8s ease-in-out', // Плавна зміна фону при переході
        willChange: 'background-position'
      }}
    />
  );
};

const ScrollBackground = ({ playerX, worldIndex }) => {
  
  // Конфігурація фонів для всіх 4 світів/рівнів
  const layersConfig = {
    0: { // РІВЕНЬ 1: "Нічне місто"
      far: '/assets/bg/world1_stars.png',
      mid: '/assets/bg/world1_buildings.png',
      near: '/assets/bg/world1_wires.png',
      filter: 'rgba(0, 255, 65, 0.05)' // Зеленуватий відтінок
    },
    1: { // РІВЕНЬ 2: "Серверна станція"
      far: '/assets/bg/world2_grid.png',
      mid: '/assets/bg/world2_servers.png',
      near: '/assets/bg/world2_cables.png',
      filter: 'rgba(0, 100, 255, 0.1)' // Синюватий відтінок
    },
    2: { // РІВЕНЬ 3: "Кібер-пустеля"
      far: '/assets/bg/world3_sun.png',
      mid: '/assets/bg/world3_dunes.png',
      near: '/assets/bg/world3_dust.png',
      filter: 'rgba(255, 100, 0, 0.1)' // Помаранчевий
    },
    3: { // РІВЕНЬ 4: "Ядро Системи" (Глітч-світ)
      far: '/assets/bg/world4_void.png',
      mid: '/assets/bg/world4_matrix_rain.png',
      near: '/assets/bg/world4_glitch_blocks.png',
      filter: 'rgba(255, 0, 0, 0.1)' // Червоний
    }
  };

  // Отримуємо налаштування для поточного світу (або дефолтні, якщо індекс не знайдено)
  const currentBG = layersConfig[worldIndex] || layersConfig[0];

  return (
    <div className="scroll-container" style={{
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      zIndex: 0,
      backgroundColor: '#050505'
    }}>
      {/* 1. Далекий план (0.1 - рухається повільно) */}
      <ParallaxLayer 
        playerX={playerX} 
        speed={0.1} 
        image={currentBG.far} 
        opacity={0.4} 
        zIndex={-10} 
      />
      
      {/* 2. Середній план (0.35 - основна атмосфера) */}
      <ParallaxLayer 
        playerX={playerX} 
        speed={0.35} 
        image={currentBG.mid} 
        opacity={0.6} 
        zIndex={-5} 
      />
      
      {/* 3. Близький план (0.7 - деталі, що пролітають швидко) */}
      <ParallaxLayer 
        playerX={playerX} 
        speed={0.7} 
        image={currentBG.near} 
        opacity={1} 
        zIndex={-2} 
      />

      {/* Кольоровий фільтр для атмосфери */}
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: currentBG.filter,
        mixBlendMode: 'overlay',
        pointerEvents: 'none',
        zIndex: -1
      }} />
    </div>
  );
};

export default ScrollBackground;