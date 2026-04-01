// src/data/gameConfig.js

export const worlds = [
  {
    id: 1,
    name: "Світ Алгоритмів",
    bg: "/assets/bgs/algo_world.png",
    levels: [
      { id: "1-1", difficulty: "Easy", mob: "/assets/mobs/bug_green.png", code: "for(let i=0; i<=5; i--)", fix: "i++", task: "Виправ нескінченний цикл" },
      { id: "1-2", difficulty: "Medium", mob: "/assets/mobs/bug_yellow.png", code: "if(x = 5)", fix: "if(x === 5)", task: "Виправ помилку присвоювання" },
      { id: "1-3", difficulty: "Hard", mob: "/assets/mobs/bug_red.png", code: "function rec(){ return rec() }", fix: "return", task: "Зупини рекурсію" },
    ]
  },
  {
    id: 2,
    name: "Світ Баз Даних",
    bg: "/assets/bgs/db_world.png",
    levels: [
      { id: "2-1", difficulty: "Easy", mob: "/assets/mobs/sql_imp.png", code: "SELECT * FROM users", fix: "SELECT", task: "Базовий запит" },
      { id: "2-2", difficulty: "Medium", mob: "/assets/mobs/sql_ghost.png", code: "JOIN users ON id=id", fix: "u.id=p.user_id", task: "Виправ JOIN" },
      { id: "2-3", difficulty: "Hard", mob: "/assets/mobs/sql_demon.png", code: "DROP TABLE users;--", fix: "", task: "Захисти від SQL-ін'єкції" },
    ]
  },
  // Світи 3 (Веб) та 4 (Системний код) додаються аналогічно
];
