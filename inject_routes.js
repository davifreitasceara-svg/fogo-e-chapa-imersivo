const fs = require('fs');

const indexTsxPath = 'src/routes/index.tsx';
const routesJsonPath = 'routes_output.json';

const code = fs.readFileSync(indexTsxPath, 'utf8');
const routes = fs.readFileSync(routesJsonPath, 'utf8');

const regex = /const MOCK_ROUTES = \[[\s\S]*?\];\n\nfunction Index\(\)/;
const replacement = `const MOCK_ROUTES = ${routes};\n\nfunction Index()`;

const newCode = code.replace(regex, replacement);

if (code === newCode) {
  console.log("No replacement made! Regex failed to match.");
} else {
  fs.writeFileSync(indexTsxPath, newCode, 'utf8');
  console.log("Successfully injected real OSRM routes!");
}
