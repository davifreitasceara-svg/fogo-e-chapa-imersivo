import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Trash2, Plus, Minus, ArrowLeft, Store, Truck, CreditCard, Banknote, QrCode, CheckCircle2 } from "lucide-react";
import { CreditCardForm } from "./ui/credit-card-form";
import { PixPayment } from "./ui/pix-payment";

export function CartCheckoutSheet({ cart, products, updateQuantity, handleCheckout, currentTheme }: any) {
  const [step, setStep] = useState<"cart" | "type" | "details" | "review" | "payment" | "credit_card" | "pix">("cart");
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<string | null>(null);
  const [changeAmount, setChangeAmount] = useState<string>("");
  const [address, setAddress] = useState("");
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [complement, setComplement] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);

  const cartCount = Object.entries(cart).reduce((sum, [id, count]) => {
    if (products.some((p: any) => p.id === parseInt(id))) return sum + (count as number);
    return sum;
  }, 0);

  const subtotal = Object.entries(cart).reduce((total, [id, qty]) => {
    const product = products.find((p: any) => p.id === parseInt(id));
    return total + (product ? product.price * (qty as number) : 0);
  }, 0);

  const deliveryFee = orderType === "delivery" ? 8 : 0;
  const discountAmount = discountApplied ? deliveryFee : 0;
  const totalPrice = subtotal - discountAmount + deliveryFee;

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleNext = () => {
    if (step === "cart") setStep("type");
    else if (step === "type") {
      if (orderType === "delivery") setStep("details");
      else if (orderType === "pickup") setStep("review");
    }
    else if (step === "details") {
      if (!name.trim() || !address.trim() || !number.trim()) {
        setDetailsError("Informacoes incompletas");
        return;
      }
      setDetailsError("");
        setStep("review");
    }
    else if (step === "review") {
      setStep("payment");
    }
    else if (step === "payment") {
      if (paymentMethod === "credit_card") {
        setStep("credit_card");
      } else if (paymentMethod === "pix") {
        setStep("pix");
      } else if (paymentMethod) {
        finishOrder();
      }
    }
  };

  const finishOrder = () => {
    handleCheckout(address, orderType);
    setStep("cart");
    setPaymentMethod(null);
    setOrderType(null);
  };

  const handleBack = () => {
    if (step === "credit_card" || step === "pix") {
      setStep("payment");
    } else if (step === "payment") {
      setStep("review");
    } else if (step === "review") {
      setStep(orderType === "delivery" ? "details" : "type");
    } else if (step === "details") {
      setStep("type");
    } else if (step === "type") {
      setStep("cart");
    }
  };

  return (
    <SheetContent 
      style={{ backgroundColor: currentTheme.bgDark, color: currentTheme.bgLight, borderColor: currentTheme.secondaryAlpha }} 
      className={`flex w-full flex-col sm:max-w-md border-l-[1px] p-0 font-sans shadow-2xl transition-all duration-500 ease-in-out`}
    >
      <SheetHeader className="px-8 pt-10 pb-4 text-left flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          {step !== "cart" && (
            <button onClick={handleBack} className="p-2 -ml-2 bg-white/5 hover:bg-white/10 rounded-full transition-all duration-300 opacity-80 hover:opacity-100 flex items-center justify-center">
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          <SheetTitle className="font-bold text-3xl tracking-tight m-0 text-white" style={{ fontFamily: "'Manrope', sans-serif" }}>
            {step === "cart" ? "Carrinho" : step === "type" ? "Entrega ou Retirada?" : step === "details" ? "Onde entregar?" : step === "review" ? "Conferir Pedido" : step === "payment" ? "Pagamento" : step === "credit_card" ? "Cartao de Credito" : "Pagamento via Pix"}
          </SheetTitle>
        </div>
      </SheetHeader>

      <div className="flex-1 overflow-y-auto px-8 pb-8 font-sans">
        {step === "cart" && (
          <div className="space-y-4">
            {cartCount === 0 ? (
              <div className="text-center py-16 opacity-50 flex flex-col items-center justify-center h-full">
                <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4">
                   <Truck className="w-10 h-10 opacity-50" />
                </div>
                <p className="text-xl font-bold tracking-tight text-white">Seu carrinho esta vazio</p>
                <p className="text-sm font-medium mt-2 text-white/70">Bateu a fome? Adicione algo delicioso!</p>
              </div>
            ) : (
              Object.entries(cart).map(([idStr, quantity]) => {
                const product = products.find((p: any) => p.id === parseInt(idStr));
                if (!product) return null;
                return (
                  <div key={product.id} className="relative flex gap-5 items-center p-4 rounded-3xl bg-white/5 border border-white/10 group transition-all duration-300 hover:bg-white/10 hover:border-white/20">
                    <button 
                      onClick={() => updateQuantity(product.id, -(quantity as number))} 
                      className="absolute -top-2 -right-2 w-8 h-8 bg-black border border-white/10 text-white/60 rounded-full flex items-center justify-center transition-all duration-300 hover:bg-red-500 hover:text-white hover:border-red-500 hover:scale-110 z-10 shadow-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-black/20 shadow-inner border border-white/5">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110" />
                    </div>
                    <div className="flex-1 py-1">
                      <h4 className="font-bold text-lg text-white leading-tight tracking-tight">{product.name}</h4>
                      <p className="text-sm mt-1 text-[#ff9d00] font-bold">{formatPrice(product.price)}</p>
                      
                      <div className="flex items-center gap-4 mt-3 bg-black/40 w-fit rounded-full px-1 py-1 border border-white/10">
                        <button onClick={() => updateQuantity(product.id, -1)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all p-1.5"><Minus className="w-3.5 h-3.5" /></button>
                        <div className="w-5 text-center overflow-hidden flex items-center justify-center"><AnimatePresence mode="popLayout" initial={false}><motion.span key={quantity as number} initial={{ y: 8, opacity: 0, scale: 0.7 }} animate={{ y: 0, opacity: 1, scale: 1 }} exit={{ y: -8, opacity: 0, scale: 0.7 }} transition={{ type: "spring", stiffness: 500, damping: 25 }} className="text-sm font-black text-white inline-block">{quantity as number}</motion.span></AnimatePresence></div>
                        <button onClick={() => updateQuantity(product.id, 1)} className="text-white/80 hover:text-white hover:bg-white/20 rounded-full transition-all p-1.5"><Plus className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {step === "type" && (
          <div className="space-y-4 mt-6">
            <button
              onClick={() => setOrderType("delivery")}
              className={`w-full relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-300 ease-out ${orderType === "delivery" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 scale-[1.02] shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${orderType === "delivery" ? "bg-[#ff9d00]" : "bg-white/10"}`}>
                 <Truck className={`w-7 h-7 ${orderType === "delivery" ? "text-white" : "opacity-70 text-white"}`} />
              </div>
              <div className="text-left flex-1">
                <h4 className={`font-bold text-xl tracking-tight transition-colors duration-300 ${orderType === "delivery" ? "text-[#ff9d00]" : "text-white"}`}>Receber em casa</h4>
              </div>
              {orderType === "delivery" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-7 h-7 text-[#ff9d00]" />
                </div>
              )}
            </button>

            <button
              onClick={() => setOrderType("pickup")}
              className={`w-full relative overflow-hidden flex items-center gap-5 p-6 rounded-2xl border-2 transition-all duration-300 ease-out ${orderType === "pickup" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 scale-[1.02] shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10"}`}
            >
              <div className={`w-14 h-14 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${orderType === "pickup" ? "bg-[#ff9d00]" : "bg-white/10"}`}>
                 <Store className={`w-7 h-7 ${orderType === "pickup" ? "text-white" : "opacity-70 text-white"}`} />
              </div>
              <div className="text-left flex-1">
                <h4 className={`font-bold text-xl tracking-tight transition-colors duration-300 ${orderType === "pickup" ? "text-[#ff9d00]" : "text-white"}`}>Pegue no local</h4>
              </div>
              {orderType === "pickup" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-7 h-7 text-[#ff9d00]" />
                </div>
              )}
            </button>
          </div>
        )}

        {step === "details" && (
          <div className="space-y-6 mt-4 text-white">
            <div>
              <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">NOME COMPLETO</label>
              <input value={name} onChange={e => setName(e.target.value)} type="text" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal" placeholder="Seu nome" />
            </div>
            <div>
              <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">ENDERECO</label>
              <input value={address} onChange={e => setAddress(e.target.value)} type="text" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal" placeholder="Rua, Avenida..." />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">NUMERO</label>
                <input value={number} onChange={e => setNumber(e.target.value)} type="text" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal" placeholder="123" />
              </div>
              <div className="col-span-2">
                <label className="text-[11px] font-bold text-white/60 ml-2 mb-2 block uppercase tracking-wider">COMPLEMENTO</label>
                <input value={complement} onChange={e => setComplement(e.target.value)} type="text" className="w-full bg-white/5 border-2 border-white/10 rounded-2xl px-5 py-4 text-base font-medium focus:border-white/40 focus:bg-white/10 focus:outline-none transition-all duration-300 placeholder:text-white/20 placeholder:font-normal" placeholder="Apto, bloco (opcional)" />
              </div>
            </div>
          </div>
        )}

        
        {step === "review" && (
          <div className="space-y-6 mt-4 text-white">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider mb-2">Resumo do Pedido</h3>
              {Object.entries(cart).map(([idStr, quantity]) => {
                const product = products.find((p: any) => p.id === parseInt(idStr));
                if (!product) return null;
                return (
                  <div key={product.id} className="flex justify-between text-sm">
                    <span>{quantity as number}x {product.name}</span>
                    <span className="font-medium text-[#ff9d00]">{formatPrice(product.price * (quantity as number))}</span>
                  </div>
                );
              })}
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-3">
              <h3 className="font-bold text-sm text-white/60 uppercase tracking-wider mb-2">Cupom de Desconto</h3>
              <div className="flex gap-2">
                <input 
                  value={couponCode} 
                  onChange={e => setCouponCode(e.target.value.toUpperCase())} 
                  disabled={discountApplied}
                  type="text" 
                  className="flex-1 bg-black/40 border-2 border-white/10 rounded-xl px-4 py-3 text-sm font-medium focus:border-white/40 focus:bg-black/60 focus:outline-none transition-all duration-300 placeholder:text-white/30 uppercase" 
                  placeholder="DIGITE O CUPOM" 
                />
                {!discountApplied ? (
                  <button 
                    onClick={() => {
                      if (couponCode.toUpperCase() === "DVSCODES") {
                        setDiscountApplied(true);
                      } else {
                        alert("Cupom invalido");
                      }
                    }}
                    className="bg-white/10 hover:bg-white/20 text-white font-bold px-4 rounded-xl transition-colors"
                  >
                    Aplicar
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      setDiscountApplied(false);
                      setCouponCode("");
                    }}
                    className="bg-red-500/20 text-red-400 hover:bg-red-500/30 font-bold px-4 rounded-xl transition-colors"
                  >
                    Remover
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 space-y-2">
              <div className="flex justify-between text-sm text-white/80">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-white/80">
                <span>Taxa de Entrega</span>
                <span>{orderType === "delivery" ? formatPrice(deliveryFee) : "Gratis"}</span>
              </div>
              {discountApplied && (
                <div className="flex justify-between text-sm text-green-400 font-bold">
                  <span>Desconto (Frete Gratis)</span>
                  <span>-{formatPrice(discountAmount)}</span>
                </div>
              )}
              <div className="h-[1px] w-full bg-white/10 my-2" />
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-[#ff9d00]">{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-2.5 mt-4 text-white">
            <button 
              onClick={() => {
                setPaymentMethod("pix");
                setStep("pix");
              }}
              className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "pix" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "pix" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}>
                <QrCode className={`w-4 h-4 ${paymentMethod === "pix" ? "text-white" : "opacity-80 group-hover:opacity-100"}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm tracking-tight ${paymentMethod === "pix" ? "text-[#ff9d00]" : ""}`}>Pix</h4>
                <p className="text-xs opacity-60 font-medium mt-0">Aprovacao imediata</p>
              </div>
              {paymentMethod === "pix" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                </div>
              )}
            </button>
            
            <button 
              onClick={() => {
                setPaymentMethod("credit_card");
                setStep("credit_card"); // Maximiza na hora
              }}
              className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "credit_card" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "credit_card" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}>
                <CreditCard className={`w-4 h-4 ${paymentMethod === "credit_card" ? "text-white" : "opacity-80 group-hover:opacity-100"}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm tracking-tight ${paymentMethod === "credit_card" ? "text-[#ff9d00]" : ""}`}>Cartao de Credito</h4>
                <p className="text-xs opacity-60 font-medium mt-0">Pague online com seguranca</p>
              </div>
              {paymentMethod === "credit_card" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                </div>
              )}
            </button>

            <button 
              onClick={() => setPaymentMethod("nubank")}
              className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "nubank" ? "bg-[#8A05BE]/10 border-[#8A05BE]/50 shadow-[0_0_20px_rgba(138,5,190,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "nubank" ? "bg-[#8A05BE]" : "bg-[#8A05BE]/20 group-hover:bg-[#8A05BE]/30"}`}>
                <span className={`font-bold text-[14px] ${paymentMethod === "nubank" ? "text-white" : "text-[#8A05BE]"}`}>nu</span>
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm tracking-tight ${paymentMethod === "nubank" ? "text-[#8A05BE]" : ""}`}>Nubank Pay</h4>
                <p className="text-xs opacity-60 font-medium mt-0">Direto pelo app</p>
              </div>
              {paymentMethod === "nubank" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#8A05BE]" />
                </div>
              )}
            </button>

            <button 
              onClick={() => setPaymentMethod("money")}
              className={`w-full relative overflow-hidden flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all duration-300 text-left group ${paymentMethod === "money" ? "bg-[#ff9d00]/10 border-[#ff9d00]/50 shadow-[0_0_20px_rgba(255,157,0,0.15)]" : "bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10"}`}
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 transition-colors duration-300 ${paymentMethod === "money" ? "bg-[#ff9d00]" : "bg-white/10 group-hover:bg-white/20"}`}>
                <Banknote className={`w-4 h-4 ${paymentMethod === "money" ? "text-white" : "opacity-80 group-hover:opacity-100"}`} />
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm tracking-tight ${paymentMethod === "money" ? "text-[#ff9d00]" : ""}`}>Dinheiro</h4>
                <p className="text-xs opacity-60 font-medium mt-0">Pagamento na entrega</p>
              </div>
              {paymentMethod === "money" && (
                <div className="absolute right-4 animate-in zoom-in duration-300">
                  <CheckCircle2 className="w-5 h-5 text-[#ff9d00]" />
                </div>
              )}
            </button>
            {paymentMethod === "money" && (
              <div className="mt-3 p-4 rounded-xl border border-white/10 bg-white/5 animate-in slide-in-from-top-2 duration-300">
                <label className="text-sm font-medium text-white/80 mb-2 block">
                  Troco para quanto? (opcional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50">R$</span>
                  <input
                    type="number"
                    value={changeAmount}
                    onChange={(e) => setChangeAmount(e.target.value)}
                    placeholder="Ex: 50"
                    className="w-full bg-black/20 border border-white/10 rounded-lg py-2.5 pl-9 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff9d00]/50 focus:ring-1 focus:ring-[#ff9d00]/50 transition-all"
                  />
                </div>
                {changeAmount && parseFloat(changeAmount) >= totalPrice && (
                  <p className="text-sm text-[#ff9d00] mt-3 font-medium">
                    Troco: {formatPrice(parseFloat(changeAmount) - totalPrice)}
                  </p>
                )}
                {changeAmount && parseFloat(changeAmount) < totalPrice && (
                  <p className="text-xs text-red-400 mt-2 font-medium">
                    Valor menor que o total
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {step === "credit_card" && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <CreditCardForm 
              showSubmit={false} 
              onSubmit={() => finishOrder()} 
            />
          </div>
        )}

        {step === "pix" && (
          <div className="mt-4 animate-in fade-in slide-in-from-bottom-4 duration-500 w-full flex justify-center">
            <PixPayment totalPrice={totalPrice} onFinish={finishOrder} />
          </div>
        )}
      </div>

      <div className="p-8 pt-6 border-t border-white/10 bg-black/20 backdrop-blur-md">
        <div className="flex justify-between items-baseline mb-6 text-white">
          <span className="text-base font-semibold opacity-70 tracking-tight">Total da compra</span>
          <span className="text-3xl font-bold tracking-tighter" style={{ fontFamily: "'Barlow Condensed', 'Manrope', sans-serif" }}>{formatPrice(["review", "payment", "credit_card", "pix"].includes(step) ? totalPrice : subtotal)}</span>
        </div>
        
        {step === "credit_card" ? (
          <button 
            onClick={finishOrder} 
            className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out"
          >
            Pagar e Finalizar Pedido
          </button>
        ) : step === "pix" ? (
          <button 
            onClick={finishOrder} 
            className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out"
          >
            Ja realizei o pagamento
          </button>
        ) : step === "payment" ? (
          <button 
            onClick={handleNext} 
            disabled={!paymentMethod}
            className="w-full py-5 rounded-2xl text-lg font-bold bg-[#ff9d00] text-black hover:bg-[#ffaa22] hover:scale-[1.02] shadow-[0_0_40px_rgba(255,157,0,0.3)] transition-all duration-300 ease-out disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {paymentMethod === "credit_card" ? "Preencher Cartao" : paymentMethod === "pix" ? "Pagar com Pix" : "Finalizar Pedido"}
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            disabled={cartCount === 0 || (step === "type" && !orderType)}
            className="w-full py-5 rounded-2xl text-lg font-bold bg-white text-black hover:bg-white/90 hover:scale-[1.02] transition-all duration-300 ease-out disabled:opacity-40 disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            Continuar
          </button>
        )}
      </div>
    </SheetContent>
  );
}
