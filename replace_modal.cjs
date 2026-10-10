const fs = require("fs");
let code = fs.readFileSync("src/routes/index.tsx", "utf-8");

const modalStartRegex = /function DeliveryTrackingModal\(\{[\s\S]*$/;
const match = code.match(modalStartRegex);

if (!match) {
  console.error("Modal not found");
  process.exit(1);
}

const newModal = `function DeliveryTrackingModal({ onClose, currentTheme, activeOrderTime, activeOrderType, activeDriver, activeRoute }: { onClose: () => void, currentTheme: any, activeOrderTime: number, activeOrderType?: "delivery" | "pickup" | null, activeDriver: number, activeRoute: number }) {
  const [ratingState, setRatingState] = useState<"driver" | "food" | "done" | null>(null);
  const [driverRating, setDriverRating] = useState(0);
  const [foodRating, setFoodRating] = useState(0);
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const stage = "delivering"; // Keep hardcoded as in previous logic or use logic if existed
  const pickupCode = "B7F9";
  const mockRoute = MOCK_ROUTES[activeRoute] || MOCK_ROUTES[0];

  useEffect(() => {
    if (activeOrderType === "pickup" || !mapRef.current) return;
    
    // Lazy load Leaflet if needed, assuming L is available globally or imported
    // For this rewrite, we keep the map logic same as before, just UI changes
    if (!mapInstanceRef.current && typeof window !== 'undefined' && (window as any).L) {
      const L = (window as any).L;
      
      const map = L.map(mapRef.current, {
        zoomControl: false,
        attributionControl: false,
      }).setView([-3.7310, -38.5270], 15);
      
      mapInstanceRef.current = map;

      L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
        maxZoom: 19,
        className: 'map-light-theme'
      }).addTo(map);

      // We'll use a style tag to filter the map tiles to look more like 99/Uber (light and clean)
      const style = document.createElement('style');
      style.innerHTML = \`
        .map-light-theme {
          filter: brightness(1.05) contrast(1.1) saturate(0.8) sepia(0.1) hue-rotate(180deg) grayscale(0.1);
        }
      \`;
      document.head.appendChild(style);

      const driverStart = mockRoute.start || [-3.7310, -38.5270];
      const customer = mockRoute.customer || [-3.7350, -38.5200];
      const route1 = mockRoute.route1 || [];
      const route2 = mockRoute.route2 || [];
      const fullRoute = [...route1, ...route2];

      L.polyline(fullRoute, { color: '#9CA3AF', weight: 6, opacity: 0.6, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      
      const activeLineBg = L.polyline([], { color: 'white', weight: 10, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(map);
      const activeLine = L.polyline([], { color: 'black', weight: 5, opacity: 1, lineCap: 'round', lineJoin: 'round' }).addTo(map);

      const createDot = (color: string, icon: string, size=32) => L.divIcon({
        className: 'custom-div-icon',
        html: \`<div style="background-color: white; width: \${size}px; height: \${size}px; border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.15); border: 2px solid \${color}; display: flex; align-items: center; justify-content: center; font-size: \${size/2}px;">\${icon}</div>\`,
        iconSize: [size, size],
        iconAnchor: [size/2, size/2]
      });

      L.marker(driverStart, { icon: createDot('#ef4444', '🍔', 24) }).addTo(map); // Restaurant
      L.marker(customer, { icon: createDot('black', '📍', 36) }).addTo(map);

      const driverIcon = L.divIcon({
        className: 'custom-div-icon',
        html: \`<div style="width: 44px; height: 44px; background-color: white; border-radius: 50%; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; z-index: 10;">
                 <div id="driver-icon-rotation" style="width: 32px; height: 32px; background-color: black; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: transform 0.2s linear;">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" stroke="white" stroke-width="2"><path d="M12 2L22 20L12 16L2 20L12 2Z"/></svg>
                 </div>
               </div>\`,
        iconSize: [44, 44],
        iconAnchor: [22, 22]
      });

      const driverMarker = L.marker(driverStart, { icon: driverIcon }).addTo(map);

      const computeDistances = (path: number[][]) => {
        const dists = [0];
        let total = 0;
        for (let i = 0; i < path.length - 1; i++) {
          const dx = path[i+1][1] - path[i][1];
          const dy = path[i+1][0] - path[i][0];
          total += Math.sqrt(dx*dx + dy*dy);
          dists.push(total);
        }
        return { dists, total };
      };
      
      const r2Data = computeDistances(route2);

      let reqId: number;
      function animate() {
        if (!mapInstanceRef.current) return;
        const now = Date.now();
        let elapsed = now - activeOrderTime;
        const duration = 60000;
        
        let isDone = false;
        if (elapsed >= duration) {
           elapsed = duration;
           isDone = true;
        }

        const progress = elapsed / duration;
        
        const pathInfo = r2Data;
        const path = route2;
        if (path.length < 2) return;

        const targetDist = progress * pathInfo.total;
        let idx = 0;
        for (let i = 0; i < pathInfo.dists.length - 1; i++) {
           if (targetDist >= pathInfo.dists[i] && targetDist <= pathInfo.dists[i+1]) {
             idx = i;
             break;
           }
        }
        if (targetDist >= pathInfo.total) idx = path.length - 2;
        
        const segmentLen = pathInfo.dists[idx+1] - pathInfo.dists[idx];
        const segmentProg = segmentLen === 0 ? 0 : (targetDist - pathInfo.dists[idx]) / segmentLen;
        
        const p1 = path[idx] || [0,0];
        const p2 = path[idx + 1] || p1;
        
        const pt = [
          p1[0] + (p2[0] - p1[0]) * segmentProg,
          p1[1] + (p2[1] - p1[1]) * segmentProg
        ];

        const dy = p2[0] - p1[0]; 
        const dx = p2[1] - p1[1]; 
        const bearing = Math.atan2(dx, dy) * (180 / Math.PI);
        const remaining = [pt, ...path.slice(idx + 1)];

        driverMarker.setLatLng(pt as any);
        activeLineBg.setLatLngs(remaining as any);
        activeLine.setLatLngs(remaining as any);

        const rotIcon = document.getElementById("driver-icon-rotation");
        if (rotIcon) {
          rotIcon.style.transform = \`rotate(\${bearing}deg)\`;
        }

        if (!isDone) {
          map.setView(pt as any, 16, { animate: false });
          reqId = requestAnimationFrame(animate);
        } else {
          map.setView(customer as any, 16, { animate: false });
        }
      }
      
      reqId = requestAnimationFrame(animate);
      (map as any)._animateReqId = reqId;
    }

    return () => {
      if (mapInstanceRef.current) {
        if ((mapInstanceRef.current as any)._animateReqId) {
          cancelAnimationFrame((mapInstanceRef.current as any)._animateReqId);
        }
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [currentTheme, activeOrderTime, activeRoute]);

  const toggleMapSize = () => setIsMapExpanded(!isMapExpanded);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-0 z-[100] flex flex-col bg-gray-100" 
      >
        <div className="relative flex-1 overflow-hidden">
          <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
          
          {/* Overlay Map UI - 99 Style */}
          <div className="absolute top-4 left-4 z-10">
            <button onClick={onClose} className="bg-white rounded-full p-3 shadow-md border border-gray-100 active:scale-95 transition-transform">
              <ChevronLeft className="size-6 text-gray-800" />
            </button>
          </div>

          <div className="absolute top-4 right-4 z-10 flex flex-col gap-3">
             <button onClick={toggleMapSize} className="bg-white rounded-full p-3 shadow-md border border-gray-100 active:scale-95 transition-transform text-black flex items-center justify-center">
               {isMapExpanded ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
             </button>
          </div>

          {isMapExpanded && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-6 left-6 right-6 z-10"
            >
               <div className="bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-4">
                  <div className="bg-gray-100 p-3 rounded-full shrink-0">
                    <MapPin className="size-6 text-black" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-0.5">Destino</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{mockRoute.address}</p>
                  </div>
               </div>
            </motion.div>
          )}
        </div>
        
        {/* Bottom Sheet - White minimalist style like 99 */}
        <motion.div 
          animate={{ height: isMapExpanded ? 0 : 'auto', opacity: isMapExpanded ? 0 : 1, y: isMapExpanded ? 100 : 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="bg-white rounded-t-[32px] -mt-6 relative z-30 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] overflow-hidden flex-shrink-0"
        >
           <div className="max-w-2xl mx-auto relative z-10 px-6 sm:px-8 py-6">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              
              {ratingState !== null ? (
                 <div className="pb-4">
                    <div className="text-center animate-in fade-in slide-in-from-bottom-4">
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-2">Muito Obrigado!</h3>
                      <p className="text-sm font-medium text-gray-500 mb-8">Sua avaliação foi enviada.</p>
                      <Button className="w-full h-14 rounded-xl text-lg font-bold bg-black text-white" onClick={onClose}>Concluir</Button>
                    </div>
                 </div>
              ) : (
                 <div className="pb-4">
                    <div className="flex items-center justify-between mb-8">
                      <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                          A caminho!
                        </h2>
                        <p className="text-sm font-medium text-gray-500 mt-1">
                          Chega em aprox. 15-20 min
                        </p>
                      </div>
                      <div className="text-right bg-gray-50 px-4 py-2.5 rounded-2xl border border-gray-100">
                         <div className="text-2xl font-black text-black">
                           18:45
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">
                           Chegada
                         </p>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-[24px] p-4 flex items-center gap-4 border border-gray-100">
                       <div className="size-14 rounded-full overflow-hidden flex-shrink-0 relative">
                          <img src={MOCK_DRIVERS[activeDriver]?.avatar ?? MOCK_DRIVERS[0].avatar} alt="Entregador" className="w-full h-full object-cover" />
                       </div>
                       <div className="flex-1 min-w-0">
                          <h4 className="text-base font-bold text-gray-900 tracking-tight truncate">{MOCK_DRIVERS[activeDriver]?.name ?? MOCK_DRIVERS[0].name}</h4>
                          <p className="text-xs text-gray-500 flex items-center gap-1.5 mt-0.5 truncate">
                             <Bike className="size-3.5" /> {MOCK_DRIVERS[activeDriver]?.vehicle ?? MOCK_DRIVERS[0].vehicle} • {MOCK_DRIVERS[activeDriver]?.plate ?? MOCK_DRIVERS[0].plate}
                          </p>
                       </div>
                       <div className="flex gap-2">
                          <Button size="icon" className="size-12 rounded-full bg-gray-200 hover:bg-gray-300 text-black shrink-0 transition-transform hover:scale-105 active:scale-95 border-none shadow-none">
                            <Mail className="size-5" />
                          </Button>
                       </div>
                    </div>

                    <div className="w-full mt-6">
                      <Button 
                         className="w-full text-sm font-bold uppercase tracking-widest h-14 rounded-[20px] bg-black text-white shadow-lg transition-transform hover:scale-[1.02] active:scale-95"
                         onClick={() => setRatingState("done")}
                      >
                        Confirmar Recebimento
                      </Button>
                    </div>
                 </div>
              )}
           </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
`;

const newCode = code.replace(modalStartRegex, newModal);
fs.writeFileSync("src/routes/index.tsx", newCode);
console.log("Replaced DeliveryTrackingModal.");
