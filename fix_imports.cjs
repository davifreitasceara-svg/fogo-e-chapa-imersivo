const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf-8');
code = code.replace(', ChefHat } from "lucide-react";', ', ChefHat, Maximize2, Minimize2 } from "lucide-react";');
fs.writeFileSync('src/routes/index.tsx', code);
