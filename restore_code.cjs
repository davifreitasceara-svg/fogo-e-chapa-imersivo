const fs = require('fs');

let content = fs.readFileSync('src/routes/index.tsx', 'utf-8');

// 1. Add lucide imports
content = content.replace('MapPin,\n', 'MapPin,\n  Maximize2,\n  Minimize2,\n');

// 2. MOCK_ROUTES update
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

const startIdx = content.indexOf('const MOCK_ROUTES = [');
const endIdx = content.indexOf('];\n\nconst AnimatedBag') + 2;
if (startIdx !== -1 && content.indexOf('AnimatedBag') !== -1) {
  content = content.substring(0, startIdx) + mockRoutes + content.substring(endIdx);
}

// 3. Add isMapExpanded state
content = content.replace(
  'const [ratingState, setRatingState] = useState<"none" | "driver" | "restaurant" | "done">("none");',
  'const [ratingState, setRatingState] = useState<"none" | "driver" | "restaurant" | "done">("none");\n  const [isMapExpanded, setIsMapExpanded] = useState(false);'
);

// 4. Update map init
content = content.replace(
  'const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([-23.562, -46.655], 16);',
  'const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([-3.7319, -38.5267], 15);'
);
content = content.replace('const restaurant = [-23.562, -46.655];', 'const restaurant = [-3.7319, -38.5267];');

// 5. Replace bottom sheet wrapper and add maximize button + address pill
const oldBottomSheetRegex = /<\/>\n\s*\)\}\n\s*<\/div>\n\s*<\/div>\n\s*<\/>\n\s*\)\}\n\s*\{\/\* Close Button/s;

const newBottomSheet = `</>
             )}
             
             {isMapExpanded && stage !== "delivered" && (
                <motion.div 
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="absolute bottom-6 left-6 right-6 z-[9999] bg-white rounded-3xl p-4 shadow-xl flex items-center justify-between"
                >
                   <div className="flex items-center gap-4 overflow-hidden">
                      <div className="bg-gray-100 p-3 rounded-full flex-shrink-0">
                         <MapPin className="size-6 text-gray-900" />
                      </div>
                      <div className="truncate">
                         <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-0.5">Destino</p>
                         <p className="text-sm font-semibold text-gray-900 truncate pr-4">{MOCK_ROUTES[activeRoute]?.address}</p>
                      </div>
                   </div>
                   <div className="text-right flex-shrink-0 pl-3 border-l border-gray-100">
                      <div className="text-xl font-black font-display tracking-tighter" style={{ color: currentTheme.secondary }}>
                        {stage === "picking_up" ? "3 min" : "18:45"}
                      </div>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">
                        {stage === "picking_up" ? "Chegada" : "Entrega"}
                      </p>
                   </div>
                </motion.div>
             )}
             
           </AnimatePresence>
         </>
      )}

      {/* Close Button`;

content = content.replace(oldBottomSheetRegex, newBottomSheet);

// Insert Maximize button after map container
content = content.replace(
  '<div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />',
  '<div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />\n              <Button onClick={() => setIsMapExpanded(!isMapExpanded)} className="absolute top-6 right-6 z-[9999] bg-white hover:bg-gray-100 text-black shadow-lg rounded-full size-12" size="icon" variant="ghost">{isMapExpanded ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}</Button>\n              <AnimatePresence>'
);

// Add scroll and hide/show logic to bottom sheet container
content = content.replace(
  'className="bg-white p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.15)]"',
  'className="bg-white p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-[60vh] overflow-y-auto"'
);
content = content.replace(
  '<motion.div \n                 initial={{ y: "100%" }}\n                 animate={{ y: 0 }}\n                 exit={{ y: "100%" }}\n                 transition={{ type: "spring", damping: 25, stiffness: 200 }}\n                 className="bg-white p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-[60vh] overflow-y-auto"',
  '{!isMapExpanded && (\n               <motion.div \n                 initial={{ y: "100%" }}\n                 animate={{ y: 0 }}\n                 exit={{ y: "100%" }}\n                 transition={{ type: "spring", damping: 25, stiffness: 200 }}\n                 className="bg-white p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.15)] max-h-[60vh] overflow-y-auto"'
);

// Find the bottom of the driver info and add the address
const driverEndRegex = /<Mail className="size-5" \/>\n\s*<\/Button>\n\s*<\/div>\n\s*<\/div>/;
content = content.replace(
  driverEndRegex,
  `<Mail className="size-5" />\n                              </Button>\n                           </div>\n                        </div>\n\n                        <div className="mt-4 bg-gray-50 rounded-3xl p-5 flex flex-col gap-1 border border-gray-100 shadow-sm relative">\n                          <div className="flex items-center gap-2 mb-1">\n                            <MapPin className="size-4 text-gray-400" />\n                            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Entregando em</p>\n                          </div>\n                          <p className="text-sm font-semibold text-gray-900">{MOCK_ROUTES[activeRoute]?.address}</p>\n                        </div>`
);

// Add the closing tag for the isMapExpanded conditional
content = content.replace(
  '{stage === "delivered" && (',
  ')}\n\n                        {stage === "delivered" && ('
);

fs.writeFileSync('src/routes/index.tsx', content);
