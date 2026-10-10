const fs = require("fs");
let c = fs.readFileSync("src/routes/index.tsx", "utf8");

const replacements = [
  ["MEL GLA\uFFFDADO", "MEL GLAÇADO"],
  ["JALAPE\uFFFD O", "JALAPEÑO"],
  ["\uFFFDx \uFFFD", "🍔"], // Assuming emoji
  ["\uFFFDx\uFFFD9", "✨"], // Assuming sparkle
  ["\uFFFD\uFFFD&", "★"], // For Avaliacao
  ['\uFFFD"\uFFFD', "♥"], // For Favorito
  ["\uFFFDxR\uFFFD️", "🌶️"], // For spicy
  ["HAMB\uFFFDaRGUERES", "HAMBÚRGUERES"],
  ["AN\uFFFD0IS", "ANÉIS"],
  ["HIST\uFFFD RIA", "HISTÓRIA"],
  ["SUÍ\uFFFD!A", "SUÍÇA"],
  ["São Paulo \uFFFD  SP", "São Paulo - SP"],
  ["Ter\uFFFD Qui", "Ter - Qui"],
  ["Sex\uFFFD Dom", "Sex - Dom"],
  ["visual \uFFFD  nenhuma", "visual — nenhuma"],
  ["\uFFFD \uFFFD Apple", " Apple"],
  ["Chapa \uFFFD  início", "Chapa — início"],
  ["15 JUN \uFFFD  18 JUN", "15 JUN - 18 JUN"],
  ["15 JUN   18 JUN", "15 JUN - 18 JUN"],
];

replacements.forEach(([bad, good]) => {
  c = c.split(bad).join(good);
});

// Any leftover \uFFFD should just be removed or replaced safely
// Actually let's just replace all other '\uFFFD' with ''
c = c.replace(/\uFFFD/g, "");

fs.writeFileSync("src/routes/index.tsx", c, "utf8");
console.log("Fixed properly");
