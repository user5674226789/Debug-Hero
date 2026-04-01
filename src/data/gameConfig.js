export const worlds = [
  {
    id: 1,
    name: "Світ Алгоритмів",
    boss: "🐞 Bug Prime",
    theme: { bg: "#0d0221", accent: "#00ff41" },
    config: { obstacleCount: 12, minGap: 300, maxGap: 600 },
    levels: [
      { 
        enemy: "🐞 Bug", 
        task: "Цикл іде в мінус! Виправ i-- на i < 10", 
        code: "for (let i = 0; i >= 0; i--) {\n  process(i);\n}", 
        fix: "i < 10", 
        time: 20 
      },
      { 
        enemy: "🧨 Logic Bomb", 
        task: "Умова завжди false. Зміни && на ||", 
        code: "if (user.isAdmin && user.isGuest) {\n  allowAccess();\n}", 
        fix: "||", 
        time: 15 
      }
    ]
  },
  {
    id: 2,
    name: "Світ Баз Даних",
    boss: "🗄️ SQL Corruptor",
    theme: { bg: "#051622", accent: "#00f2ff" },
    config: { obstacleCount: 15, minGap: 250, maxGap: 500 },
    levels: [
      { 
        enemy: "👾 Chaos Fragment", 
        task: "SQL: Виправ JOIN, щоб побачити замовлення користувачів", 
        code: "SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id", 
        fix: "INNER JOIN", 
        time: 20 
      },
      { 
        enemy: "🐞 Bug", 
        task: "SQL: Додай пропущений запит SELECT", 
        code: "name, email FROM users WHERE id = 5;", 
        fix: "SELECT name", 
        time: 15 
      }
    ]
  },
  {
    id: 3,
    name: "Світ Веб-додатків",
    boss: "🌐 API Breaker",
    theme: { bg: "#1a1a00", accent: "#ff00ff" },
    config: { obstacleCount: 18, minGap: 200, maxGap: 450 },
    levels: [
      { 
        enemy: "🧨 Logic Error", 
        task: "JS: Функція не чекає на відповідь сервера. Додай await", 
        code: "const data = fetch('/api/data');\nrender(data);", 
        fix: "await fetch", 
        time: 15 
      },
      { 
        enemy: "🐞 Bug", 
        task: "React: Пропущено масив залежностей []", 
        code: "useEffect(() => {\n  getData();\n});", 
        fix: "}, []);", 
        time: 12 
      }
    ]
  },
  {
    id: 4,
    name: "Світ Системного Коду",
    boss: "👾 ChaosCompiler",
    theme: { bg: "#1a0000", accent: "#ff3e3e" },
    config: { obstacleCount: 22, minGap: 150, maxGap: 400 },
    levels: [
      { 
        enemy: "🧨 Memory Leak", 
        task: "C++: Пам'ять виділена, але не звільнена. Додай delete", 
        code: "int* buf = new int[100];\n// ... work\nreturn 0;", 
        fix: "delete[] buf", 
        time: 15 
      },
      { 
        enemy: "👾 ChaosCompiler", 
        task: "Race Condition: Заблокуй потік перед зміною змінної", 
        code: "thread_safe_op();\ncounter++;", 
        fix: "mutex.lock()", 
        time: 10 
      }
    ]
  }
];