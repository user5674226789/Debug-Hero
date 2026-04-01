export const worlds = [
  {
    name: "Світ Алгоритмів",
    bg: "linear-gradient(to bottom, #1a1a2e, #050505)",
    levels: [
      {
        difficulty: "Easy",
        task: "Нескінченний цикл! Зміни i-- на i++",
        code: "for (let i = 0; i < 5; i--) {\n  console.log(i);\n}",
        fix: "i++",
        mob: "bug_small.png",
        obstacles: [600, 1200]
      },
      {
        difficulty: "Medium",
        task: "Помилка індексу! Масив має 3 елементи, а звертаємось до 10. Зміни 10 на 0",
        code: "const arr = [1, 2, 3];\nconsole.log(arr[10]);",
        fix: "arr[0]",
        mob: "bug_medium.png",
        obstacles: [500, 1000, 1500]
      },
      {
        difficulty: "Hard",
        task: "Логічна помилка: функція має повертати a + b. Виправ '-' на '+'",
        code: "function sum(a, b) {\n  return a - b;\n}",
        fix: "a + b",
        mob: "bug_boss.png",
        obstacles: [400, 800, 1200, 1800]
      }
    ]
  },
  {
    name: "Світ Баз Даних",
    bg: "linear-gradient(to bottom, #0a2e1a, #050505)",
    levels: [
      {
        difficulty: "Easy",
        task: "SQL: Пропущено SELECT. Додай його на початок",
        code: "* FROM users WHERE id = 1;",
        fix: "SELECT *",
        mob: "bug_small.png",
        obstacles: [700, 1400]
      },
      {
        difficulty: "Medium",
        task: "SQL: Помилка в DELETE. Потрібно додати WHERE, щоб не видалити все!",
        code: "DELETE FROM users;",
        fix: "WHERE id =",
        mob: "bug_medium.png",
        obstacles: [600, 1100, 1700]
      },
      {
        difficulty: "Hard",
        task: "SQL: Неправильний JOIN. Зміни LEFT JOIN на INNER JOIN",
        code: "SELECT name FROM users\nLEFT JOIN orders ON users.id = orders.id",
        fix: "INNER JOIN",
        mob: "bug_boss.png",
        obstacles: [500, 900, 1300, 1900]
      }
    ]
  },
  {
    name: "Світ Веб-додатків",
    bg: "linear-gradient(to bottom, #2e2e0a, #050505)",
    levels: [
      {
        difficulty: "Easy",
        task: "JS: Пропущено оголошення змінної. Додай 'const'",
        code: "user = 'Ilia';",
        fix: "const user",
        mob: "bug_small.png",
        obstacles: [800, 1500]
      },
      {
        difficulty: "Medium",
        task: "React: Хук викликано неправильно. Зміни usestate на useState",
        code: "const [val, setVal] = usestate(0);",
        fix: "useState",
        mob: "bug_medium.png",
        obstacles: [400, 900, 1400, 2000]
      },
      {
        difficulty: "Hard",
        task: "API: Пропущено await перед fetch. Додай його",
        code: "async function get() {\n  const res = fetch('/api');\n}",
        fix: "await fetch",
        mob: "bug_boss.png",
        obstacles: [500, 1000, 1500, 2200]
      }
    ]
  },
  {
    name: "Світ Системного Коду",
    bg: "linear-gradient(to bottom, #2e0a0a, #050505)",
    levels: [
      {
        difficulty: "Easy",
        task: "C++ Style: Пропущено ';' в кінці рядка",
        code: "int x = 5\nreturn x;",
        fix: "int x = 5;",
        mob: "bug_small.png",
        obstacles: [600, 1300]
      },
      {
        difficulty: "Medium",
        task: "Memory: Потрібно звільнити пам'ять. Додай free(ptr)",
        code: "int* ptr = malloc(10);\n// Помилка тут",
        fix: "free(ptr)",
        mob: "bug_medium.png",
        obstacles: [400, 800, 1200, 1600]
      },
      {
        difficulty: "Hard",
        task: "Thread Conflict: Виправ Lock. Зміни unlock() на lock()",
        code: "mutex.unlock();\nshared_data++;\nmutex.unlock();",
        fix: "mutex.lock()",
        mob: "bug_boss.png",
        obstacles: [300, 600, 900, 1200, 1500, 1800]
      }
    ]
  }
];