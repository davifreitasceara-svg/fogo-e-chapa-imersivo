import React, { useState, useEffect } from "react";
import { CheckCircle2, Copy, QrCode } from "lucide-react";

type Props = {
  totalPrice: number;
  onFinish: () => void;
};

export const PixPayment = ({ totalPrice, onFinish }: Props) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  
  const mockPixCode = "00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540510.005802BR5913Fogo e Chapa6009Sao Paulo62070503***63041A2B";

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(mockPixCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formattedPrice = totalPrice.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // Use a public QR code generator API for the mockup
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(mockPixCode)}&color=000000&bgcolor=ffffff`;

  return (
    <div className="w-full max-w-md mx-auto text-white flex flex-col items-center">
      <div className="bg-[#ff9d00]/10 border border-[#ff9d00]/20 rounded-2xl p-6 w-full text-center flex flex-col items-center relative overflow-hidden">
        {/* Glow effect behind QR */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff9d00]/20 rounded-full blur-[60px]" />
        
        <h3 className="text-xl font-bold mb-1 relative z-10">Escaneie o QR Code</h3>
        <p className="text-white/60 text-sm mb-6 relative z-10">Abra o app do seu banco e escolha pagar via Pix QR Code.</p>

        <div className="relative z-10 bg-white p-4 rounded-3xl shadow-[0_0_40px_rgba(255,157,0,0.2)] mb-6 animate-in zoom-in duration-500">
          <img src={qrCodeUrl} alt="Pix QR Code" className="w-48 h-48 rounded-xl object-contain" />
          <div className="absolute -inset-1 border-2 border-[#ff9d00]/30 rounded-[1.7rem] pointer-events-none animate-pulse" />
        </div>

        <div className="flex flex-col items-center relative z-10 w-full mb-2">
          <p className="text-white/60 text-xs uppercase tracking-wider font-bold mb-2">Pix Copia e Cola</p>
          <button 
            onClick={handleCopy}
            className="w-full flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-4 hover:border-[#ff9d00]/50 hover:bg-black/60 transition-all duration-300 group"
          >
            <span className="truncate text-sm opacity-80 font-mono mr-4">{mockPixCode.slice(0, 25)}...</span>
            {copied ? (
              <span className="flex items-center text-[#ff9d00] font-bold text-sm shrink-0">
                <CheckCircle2 className="w-4 h-4 mr-1" /> Copiado
              </span>
            ) : (
              <span className="flex items-center text-white/80 group-hover:text-[#ff9d00] font-bold text-sm shrink-0 transition-colors">
                <Copy className="w-4 h-4 mr-1" /> Copiar
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 text-center flex flex-col items-center w-full">
        <p className="text-white/50 text-sm mb-1">Aguardando pagamento...</p>
        <div className="text-3xl font-bold tracking-tighter tabular-nums text-[#ff9d00] mb-8" style={{ fontFamily: "'Barlow Condensed', 'Manrope', sans-serif" }}>
          {formatTime(timeLeft)}
        </div>
      </div>
    </div>
  );
};