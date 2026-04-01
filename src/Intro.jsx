import React, { useState, useEffect, useRef } from 'react';
// Імпортуйте звуки. Переконайтеся, що файли є в assets/sounds/
import typingSoundUrl from './assets/sounds/typing.mp3';
import ambientBgUrl from './assets/sounds/ambient_bg.mp3';

const Intro = ({ onStart }) => {
  // Весь текст одним рядком, поділений переносом \n
  const fullStory = 
    `>> СИСТЕМА: КРИТИЧНИЙ ЗБІЙ...\n` +
    `>> 2:41 AM. Головний Сервер Знань атаковано.\n` +
    `роз’їдає ядро системи.\n` +
    `>> Ти — Debug Hero. Твій код — остання надія.\n` +
    `>> Знайди помилки. Виправ логіку.\n` +
    `ВРЯТУЙ МЕРЕЖУ._`;

  const [displayedText, setDisplayedText] = useState('');
  const [isDone, setIsDone] = useState(false);
  const [audioEnabled, setAudioEnabled] = useState(false);

  const typingAudioRef = useRef(new Audio(typingSoundUrl));
  const bgAudioRef = useRef(new Audio(ambientBgUrl));

  useEffect(() => {
    // Не запускаємо нічого, поки не ввімкнено аудіо
    if (!audioEnabled) return;

    // 1. Фоновий звук (гул)
    bgAudioRef.current.loop = true;
    bgAudioRef.current.volume = 0.3;
    bgAudioRef.current.play().catch(() => {});

    // 2. Звук друку (гучніше)
    typingAudioRef.current.volume = 0.6;

    let charIndex = 0;
    
    // 3. Основний цикл друку (простий Інтервал)
    const typeTicker = setInterval(() => {
      // Якщо закінчилися символи
      if (charIndex >= fullStory.length) {
        clearInterval(typeTicker);
        setIsDone(true);
        return;
      }

      // Оновлюємо текст (беремо підрядок від 0 до поточного символу)
      setDisplayedText(fullStory.slice(0, charIndex + 1));

      // Відтворюємо звук клацання (перериваємо попередній, якщо він грає)
      if (typingAudioRef.current.paused) {
        typingAudioRef.current.play().catch(() => {});
      } else {
        typingAudioRef.current.currentTime = 0; // перезапускаємо звук
      }

      charIndex++;
    }, 45); // Швидкість друку

    // Очищення звуку та інтервалу при розмонтуванні
    return () => {
      clearInterval(typeTicker);
      bgAudioRef.current.pause();
      typingAudioRef.current.pause();
    };
  }, [audioEnabled]); // Запускаємо ефект тільки коли audioEnabled === true

  // --- ЕКРАН 1: АКТИВАЦІЯ ЗВУКУ ---
  if (!audioEnabled) {
    return (
      <div className="intro-container crt-overlay">
        <div className="terminal-border startup-box">
          <div className="terminal-header-bar">INITIALIZATION_REQUIRED</div>
          <div className="intro-content">
            <h2 style={{textShadow: '0 0 10px var(--accent-purple)'}}>
              ВСТАНОВЛЕННЯ НЕЙРОЗВ'ЯЗКУ...
            </h2>
            <p style={{color: '#fff'}}>Для повного занурення потрібен аудіоканал.</p>
            <button className="start-btn activate-btn" onClick={() => setAudioEnabled(true)}>
              АКТИВУВАТИ АУДІО ТА ПОЧАТИ ДРУК
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- ЕКРАН 2: ОСНОВНЕ ІНТРО ---
  return (
    <div className="intro-container crt-overlay">
      <div className="terminal-border">
        <div className="terminal-header-bar">SYSTEM_BOOT_SEQUENCE // SECTOR_ZERO</div>
        <div className="intro-content holographic-glow">
          {/* pre-wrap зберігає переноси рядків та пробіли */}
          <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>
            {displayedText}
          </pre>

          {/* Кнопка з'являється плавно в кінці */}
          {isDone && (
            <button className="start-btn animate-fadeIn" onClick={onStart}>
              УВІЙТИ В МЕРЕЖУ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Intro;