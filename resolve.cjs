const fs = require('fs');
let code = fs.readFileSync('src/routes/index.tsx', 'utf-8');

const headRegex = /<<<<<<< HEAD[\s\S]*?=======\r?\n/;
const originRegex = />>>>>>> origin\/main\r?\n/;

code = code.replace(headRegex, `<div className="flex-1 min-w-0">
  <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">Destino</p>
  <p className="text-sm font-semibold text-gray-900 truncate">{mockRoute.address}</p>
</div>
`);
code = code.replace(originRegex, '');

fs.writeFileSync('src/routes/index.tsx', code);
