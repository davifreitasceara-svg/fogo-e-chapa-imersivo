const fs = require("fs");

let c = fs.readFileSync("src/routes/index.tsx", "utf-8");

// Replace restaurant coordinates
c = c.replace("const restaurant = [-23.562, -46.655];", "const restaurant = [-3.7319, -38.5267];");

// Create interpolation function to make smooth routes
function interpolate(start, end, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push([
      start[0] + (end[0] - start[0]) * (i / steps),
      start[1] + (end[1] - start[1]) * (i / steps),
    ]);
  }
  return pts;
}

const mockRoutes = `const MOCK_ROUTES = [
  {
    start: [-3.7300, -38.5250],
    customer: [-3.7350, -38.5200],
    address: "Av. Beira Mar, 2500 - Meireles",
    route1: ${JSON.stringify(interpolate([-3.73, -38.525], [-3.7319, -38.5267], 20))},
    route2: ${JSON.stringify(interpolate([-3.7319, -38.5267], [-3.735, -38.52], 30))}
  },
  {
    start: [-3.7340, -38.5280],
    customer: [-3.7400, -38.5300],
    address: "Rua Monsenhor Tabosa, 100 - Praia de Iracema",
    route1: ${JSON.stringify(interpolate([-3.734, -38.528], [-3.7319, -38.5267], 20))},
    route2: ${JSON.stringify(interpolate([-3.7319, -38.5267], [-3.74, -38.53], 30))}
  }
];`;

// We know MOCK_ROUTES starts at `const MOCK_ROUTES = [` and ends at `];\n\nconst AnimatedBag`
const startIdx = c.indexOf("const MOCK_ROUTES = [");
const endIdx = c.indexOf("];\n\nconst AnimatedBag") + 2;

if (startIdx !== -1 && endIdx !== -1) {
  c = c.substring(0, startIdx) + mockRoutes + c.substring(endIdx);
} else {
  console.log("Could not find MOCK_ROUTES block");
}

fs.writeFileSync("src/routes/index.tsx", c);
