export const worlds = [
  {
    name: "Світ Алгоритмів",
    theme: { bg: "#0d0221", accent: "#00ff41" },
    config: { obstacleCount: 6, minGap: 400, maxGap: 800 },
    levels: [
      { enemy: "🐞 Bug", task: "ЦИКЛ ЗАЦИКЛИВСЯ! Виправ i-- на i++", code: "for (let i = 0; i < 5; i--) {\n  console.log(i);\n}", fix: "i++", time: 25, difficulty: "Easy" },
      { enemy: "🧨 Logic Bomb", task: "НЕ ТОЙ ІНДЕКС! Зміни 10 на 0", code: "const data = [1, 2, 3];\nprocess(data[10]);", fix: "data[0]", time: 20, difficulty: "Medium" },
      { enemy: "👾 Chaos Fragment", task: "ЛОГІЧНИЙ ХАОС! Зміни '-' на '+'", code: "return a - b;", fix: "a + b", time: 15, difficulty: "Hard" }
    ]
  },
  {
    name: "Світ Баз Даних",
    theme: { bg: "#051622", accent: "#00f2ff" },
    config: { obstacleCount: 7, minGap: 350, maxGap: 700 },
    levels: [
      { enemy: "🐞 Bug", task: "SQL: Пропущено SELECT *", code: "FROM users WHERE id = 1;", fix: "SELECT *", time: 25 },
      { enemy: "🧨 Logic Bomb", task: "SQL: Додай WHERE id =", code: "DELETE FROM users;", fix: "WHERE id =", time: 20 },
      { enemy: "👾 ChaosCompiler", task: "SQL: Зміни LEFT на INNER", code: "SELECT * FROM users LEFT JOIN orders", fix: "INNER JOIN", time: 15 }
    ]
  },
  {
    name: "Світ Веб-додатків",
    theme: { bg: "#1a1a00", accent: "#ff00ff" },
    config: { obstacleCount: 8, minGap: 300, maxGap: 600 },
    levels: [
      { enemy: "🐞 Bug", task: "JS: Додай 'const'", code: "user = 'Ilia';", fix: "const user", time: 20 },
      { enemy: "🧨 Logic Bomb", task: "React: Виправ usestate на useState", code: "const [v, setV] = usestate(0);", fix: "useState", time: 15 },
      { enemy: "👾 ChaosCompiler", task: "API: Додай await перед fetch", code: "const res = fetch('/api');", fix: "await fetch", time: 12 }
    ]
  },
  {
    name: "Світ Системного Коду",
    theme: { bg: "#1a0000", accent: "#ff3e3e" },
    config: { obstacleCount: 10, minGap: 250, maxGap: 500 },
    levels: [
      { enemy: "🐞 Bug", task: "C++: Додай ';' в кінці", code: "int x = 5", fix: "x = 5;", time: 15 },
      { enemy: "🧨 Memory Leak", task: "Memory: Додай free(ptr)", code: "malloc(10);\n// fix here", fix: "free(ptr)", time: 12 },
      { enemy: "👾 ChaosCompiler", task: "Threads: Зміни unlock на lock", code: "mutex.unlock();\ndata++;", fix: "mutex.lock()", time: 10 }
    ]
  }
];