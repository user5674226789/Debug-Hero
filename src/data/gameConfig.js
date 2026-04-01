export const worlds = [
  {
    id: 1,
    name: "Світ Алгоритмів",
    boss: "🐞 Bug Prime",
    theme: { bg: "#0d0221", accent: "#00ff41", ground: "#00ff41" },
    config: { obstacleCount: 10, minGap: 400, maxGap: 800 },
    levels: [
      { 
        enemy: "bug_small.png", 
        task: "Цикл іде в мінус! Виправ i-- на i < 10", 
        code: "for (let i = 0; i >= 0; i--) {\n  process(i);\n}", 
        fix: "i < 10", 
        time: 25 
      },
      { 
        enemy: "bug_medium.png", 
        task: "Умова завжди false. Зміни && на ||", 
        code: "if (user.isAdmin && user.isGuest) {\n  allowAccess();\n}", 
        fix: "||", 
        time: 20 
      }
    ]
  },
  {
    id: 2,
    name: "Світ Баз Даних",
    boss: "🗄️ SQL Corruptor",
    theme: { bg: "#051622", accent: "#00f2ff", ground: "#00f2ff" },
    config: { obstacleCount: 12, minGap: 350, maxGap: 700 },
    levels: [
      { 
        enemy: "bug_medium.png", 
        task: "SQL: Виправ JOIN, щоб побачити замовлення користувачів", 
        code: "SELECT * FROM users LEFT JOIN orders ON users.id = orders.user_id", 
        fix: "INNER JOIN", 
        time: 25 
      }
    ]
  },
  {
    id: 3,
    name: "Світ Системного Коду",
    boss: "👾 ChaosCompiler",
    theme: { bg: "#1a0000", accent: "#ff3e3e", ground: "#ff3e3e" },
    config: { obstacleCount: 15, minGap: 300, maxGap: 600 },
    levels: [
      { 
        enemy: "bug_boss.png", 
        task: "Race Condition: Заблокуй потік (mutex.lock)", 
        code: "// Thread 1\ncounter++;", 
        fix: "mutex.lock()", 
        time: 15 
      }
    ]
  }
];