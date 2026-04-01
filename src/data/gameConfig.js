export const worlds = [
  {
    name: "Світ Алгоритмів",
    theme: { bg: "linear-gradient(to bottom, #1a1a2e, #050505)", accent: "#00ff41" },
    config: { obstacleCount: 6, minGap: 400, maxGap: 800 },
    levels: [
      { difficulty: "Easy", task: "Виправ цикл i-- на i++", code: "for (let i = 0; i < 5; i--) {\n  console.log(i);\n}", fix: "i++", mob: "bug_small.png" },
      { difficulty: "Medium", task: "Зміни індекс 10 на 0", code: "const arr = [1, 2, 3];\nconsole.log(arr[10]);", fix: "arr[0]", mob: "bug_medium.png" },
      { difficulty: "Hard", task: "Зміни '-' на '+'", code: "function sum(a, b) {\n  return a - b;\n}", fix: "a + b", mob: "bug_boss.png" }
    ]
  },
  {
    name: "Світ Баз Даних",
    theme: { bg: "linear-gradient(to bottom, #0a2e1a, #050505)", accent: "#00f2ff" },
    config: { obstacleCount: 7, minGap: 350, maxGap: 700 },
    levels: [
      { difficulty: "Easy", task: "SQL: Додай SELECT *", code: "FROM users WHERE id = 1;", fix: "SELECT *", mob: "bug_small.png" },
      { difficulty: "Medium", task: "SQL: Додай WHERE id =", code: "DELETE FROM users;", fix: "WHERE id =", mob: "bug_medium.png" },
      { difficulty: "Hard", task: "SQL: Зміни LEFT на INNER", code: "SELECT * FROM users LEFT JOIN orders", fix: "INNER JOIN", mob: "bug_boss.png" }
    ]
  },
  {
    name: "Світ Веб-додатків",
    theme: { bg: "linear-gradient(to bottom, #2e2e0a, #050505)", accent: "#ff00ff" },
    config: { obstacleCount: 8, minGap: 300, maxGap: 600 },
    levels: [
      { difficulty: "Easy", task: "Додай 'const'", code: "user = 'Ilia';", fix: "const user", mob: "bug_small.png" },
      { difficulty: "Medium", task: "Виправ usestate на useState", code: "const [v, setV] = usestate(0);", fix: "useState", mob: "bug_medium.png" },
      { difficulty: "Hard", task: "Додай await перед fetch", code: "const res = fetch('/api');", fix: "await fetch", mob: "bug_boss.png" }
    ]
  },
  {
    name: "Світ Системного Коду",
    theme: { bg: "linear-gradient(to bottom, #2e0a0a, #050505)", accent: "#ff3e3e" },
    config: { obstacleCount: 10, minGap: 250, maxGap: 500 },
    levels: [
      { difficulty: "Easy", task: "Додай ';' в кінці", code: "int x = 5", fix: "x = 5;", mob: "bug_small.png" },
      { difficulty: "Medium", task: "Додай free(ptr)", code: "malloc(10);\n// fix leak", fix: "free(ptr)", mob: "bug_medium.png" },
      { difficulty: "Hard", task: "Зміни unlock на lock", code: "mutex.unlock();\ndata++;", fix: "mutex.lock()", mob: "bug_boss.png" }
    ]
  }
];