export const worlds = [
  {
    name: "Світ Алгоритмів",
    levels: [
      {
        difficulty: "Easy",
        task: "Виправ нескінченний цикл! Зміни i-- на i++",
        code: "for (let i = 0; i <= 5; i--) {\n  console.log(i);\n}",
        fix: "i++",
        mob: "bug_easy.png",
        bg: "linear-gradient(to bottom, #1a1a2e, #050505)",
        obstacles: [500, 900] // Позиції X для блоків
      },
      {
        difficulty: "Medium",
        task: "Додай перевірку на довжину масиву: data.length > 0",
        code: "const data = [];\nprocess(data[0]);",
        fix: "data.length > 0",
        mob: "bug_medium.png", 
        bg: "linear-gradient(to bottom, #2e1a1a, #050505)",
        obstacles: [400, 700, 1100]
      },
      {
        difficulty: "Hard",
        task: "Оброби помилку промісу: додай .catch(err => ...)",
        code: "api.getData().then(res => show(res))",
        fix: ".catch",
        mob: "bug_boss.png",
        bg: "linear-gradient(to bottom, #1a2e1a, #050505)",
        obstacles: [300, 600, 900, 1200]
      }
    ]
  }
];