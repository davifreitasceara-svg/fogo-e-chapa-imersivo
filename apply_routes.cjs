const fs = require('fs');

function interpolate(start, end, steps) {
  const pts = [];
  for (let i = 0; i <= steps; i++) {
    pts.push([
      start[0] + (end[0] - start[0]) * (i / steps),
      start[1] + (end[1] - start[1]) * (i / steps)
    ]);
  }
  return pts;
}

let c = fs.readFileSync('src/routes/index.tsx', 'utf-8');

const mockRoutes = `const MOCK_ROUTES = [
  {
    start: [-3.7300, -38.5250],
    customer: [-3.7350, -38.5200],
    address: "Av. Beira Mar, 2500 - Meireles",
    route1: ${JSON.stringify(interpolate([-3.7300, -38.5250], [-3.7319, -38.5267], 20))},
    route2: ${JSON.stringify(interpolate([-3.7319, -38.5267], [-3.7350, -38.5200], 30))}
  },
  {
    start: [-3.7340, -38.5280],
    customer: [-3.7400, -38.5300],
    address: "Rua Monsenhor Tabosa, 100 - Praia de Iracema",
    route1: ${JSON.stringify(interpolate([-3.7340, -38.5280], [-3.7319, -38.5267], 20))},
    route2: ${JSON.stringify(interpolate([-3.7319, -38.5267], [-3.7400, -38.5300], 30))}
  }
];`;

// Replace MOCK_ROUTES cleanly
const startIdx = c.indexOf('const MOCK_ROUTES = [');
const endIdx = c.indexOf('];\n\nfunction Index()') + 2;

if (startIdx !== -1 && c.indexOf('function Index()') !== -1) {
  c = c.substring(0, startIdx) + mockRoutes + c.substring(endIdx);
}

// Map center
c = c.replace('setView([-23.562, -46.655], 16)', 'setView([-3.7319, -38.5267], 15)');
c = c.replace('const restaurant = [-23.562, -46.655];', 'const restaurant = [-3.7319, -38.5267];');

// Add Maximize2, Minimize2 to lucide-react imports if not there
if (!c.includes('Maximize2,')) {
    c = c.replace('MapPin,\n', 'MapPin,\n  Maximize2,\n  Minimize2,\n');
}

fs.writeFileSync('src/routes/index.tsx', c);
