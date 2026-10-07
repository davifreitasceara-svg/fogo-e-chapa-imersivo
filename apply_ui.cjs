const fs = require('fs');
let c = fs.readFileSync('src/routes/index.tsx', 'utf-8');

const replacement = `<div className="relative flex-1 overflow-hidden">
             <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
             <Button 
               onClick={() => setIsMapExpanded(!isMapExpanded)}
               className="absolute top-6 right-6 z-[9999] bg-white hover:bg-gray-100 text-black shadow-lg rounded-full size-12"
               size="icon"
               variant="ghost"
             >
               {isMapExpanded ? <Minimize2 className="size-5" /> : <Maximize2 className="size-5" />}
             </Button>

             <AnimatePresence>
                {isMapExpanded && stage !== "delivered" && (
                   <motion.div 
                     initial={{ opacity: 0, y: 50 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: 50 }}
                     className="absolute bottom-6 left-6 right-6 z-[9999] bg-gray-950 border border-gray-800 rounded-3xl p-4 shadow-2xl flex items-center justify-between"
                   >
                      <div className="flex items-center gap-4 overflow-hidden">
                         <div className="bg-gray-900 p-3 rounded-full flex-shrink-0">
                            <MapPin className="size-6 text-white" />
                         </div>
                         <div className="truncate">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">Destino</p>
                            <p className="text-sm font-semibold text-white truncate pr-4">{MOCK_ROUTES[activeRoute]?.address}</p>
                         </div>
                      </div>
                      <div className="text-right flex-shrink-0 pl-3 border-l border-gray-800">
                         <div className="text-xl font-black font-display tracking-tighter" style={{ color: currentTheme.secondary }}>
                           {stage === "picking_up" ? "3 min" : "18:45"}
                         </div>
                         <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500 mt-0.5">
                           {stage === "picking_up" ? "Chegada" : "Entrega"}
                         </p>
                      </div>
                   </motion.div>
                )}
             </AnimatePresence>
           </div>
           
           {/* Status Card (Bottom sheet style) - PREMIUM DARK MODE */}
           <AnimatePresence>
           {!isMapExpanded && (
           <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="bg-gray-950 border-t border-gray-800 p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-y-auto max-h-[60vh]"`;

const oldStr = `<div className="relative flex-1 overflow-hidden">
             <div ref={mapRef} className="absolute inset-0 w-full h-full z-0" />
           </div>
           
           {/* Status Card (Bottom sheet style) - PREMIUM DARK MODE */}
           <div className="bg-gray-950 border-t border-gray-800 p-6 sm:p-8 rounded-t-[2.5rem] -mt-6 relative z-30 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] overflow-hidden"`;

c = c.replace(oldStr, replacement);

// And we need to add the closing tags for AnimatePresence
const endOfDriverCard = `<Mail className="size-5" />
                             </Button>
                          </div>
                       </div>

                       {stage === "delivered" && (`;

const replaceEndOfDriverCard = `<Mail className="size-5" />
                             </Button>
                          </div>
                       </div>

                       <div className="mt-4 bg-gray-900 rounded-3xl p-5 flex flex-col gap-1 border border-gray-800 shadow-sm relative">
                         <div className="flex items-center gap-2 mb-1">
                           <MapPin className="size-4 text-gray-400" />
                           <p className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Entregando em</p>
                         </div>
                         <p className="text-sm font-semibold text-white">{MOCK_ROUTES[activeRoute]?.address}</p>
                       </div>

                       {stage === "delivered" && (`;
                       
c = c.replace(endOfDriverCard, replaceEndOfDriverCard);

const endOfModalStr = `                     </div>
                  )}
               </div>
            </div>
          </>
       )}
       
       {/* Close Button`;

const replaceEndOfModalStr = `                     </div>
                  )}
               </div>
            </motion.div>
            )}
            </AnimatePresence>
          </>
       )}
       
       {/* Close Button`;

c = c.replace(endOfModalStr, replaceEndOfModalStr);

fs.writeFileSync('src/routes/index.tsx', c);
