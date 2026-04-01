export const worlds = [
  {
    name: "Світ алгоритмів",
    levels: [
      {
        difficulty: "Easy",
        mob: "bug_small.png", 
        task: "Виправ нескінченний цикл! Зміни i-- на i++",
        code: "for (let i = 0; i <= 5; i--) {\n  console.log(i);\n}",
        fix: "for (let i = 0; i <= 5; i++) {\n  console.log(i);\n}"
      },
      {
        difficulty: "Medium",
        mob: "logic_error.png",
        task: "ChaosCompiler пошкодив логіку. Довжина масиву має бути більше 0!",
        code: "const data = [];\nif (data.length >= 0) {\n  process(data[0]);\n}",
        fix: "const data = [];\nif (data.length > 0) {\n  process(data[0]);\n}"
      },
      {
        difficulty: "Hard",
        mob: "boss_final.png",
        task: "БОС-РІВЕНЬ: Функція завжди повертає false. Виправ на true!",
        code: "function checkSystem() {\n  return false;\n}",
        fix: "function checkSystem() {\n  return true;\n}"
      }
    ]
  }
];