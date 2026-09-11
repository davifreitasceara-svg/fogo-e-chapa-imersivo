import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { useCart } from "@/context/CartContext";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowLeft, Store, Truck, MapPin, CreditCard, Banknote, QrCode } from "lucide-react";
import { toast } from "sonner";

export function CartSidebar() {
  const { isOpen, setIsOpen, items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState<"cart" | "type" | "details" | "payment">("cart");
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | null>(null);

  const formatPrice = (price: number) => {
    return price.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const handleNext = () => {
    if (step === "cart") setStep("type");
    else if (step === "type") {
      if (orderType === "delivery") setStep("details");
      else if (orderType === "pickup") setStep("payment");
    }
    else if (step === "details") setStep("payment");
  };

  const handleBack = () => {
    if (step === "payment") {
      setStep(orderType === "delivery" ? "details" : "type");
    } else if (step === "details") {
      setStep("type");
    } else if (step === "type") {
      setStep("cart");
    }
  };

  const finishOrder = () => {
    toast.success("Pedido finalizado com sucesso!");
    clearCart();
    setStep("cart");
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) setTimeout(() => setStep("cart"), 300);
    }}>
      <SheetContent className="w-full sm:max-w-md bg-background border-l border-white/10 p-0 flex flex-col">
        <SheetHeader className="p-6 border-b border-white/10 text-left flex flex-row items-center justify-between">
          <div className="flex items-center gap-3">
            {step !== "cart" && (
              <button onClick={handleBack} className="p-1 hover:bg-white/10 rounded-md transition-colors">
                <ArrowLeft className="w-5 h-5 text-muted-foreground" />
              </button>
            )}
            <SheetTitle className="text-xl font-display uppercase tracking-wider text-foreground m-0">
              {step === "cart" ? "Seu Carrinho" : step === "type" ? "Tipo de Pedido" : step === "details" ? "Entrega" : "Pagamento"}
            </SheetTitle>
          </div>
          <SheetDescription className="hidden">Carrinho de compras</SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {step === "cart" && (
            <div className="space-y-6">
              {items.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                  <p>Seu carrinho est vazio.</p>
                </div>
              ) : (
                items.map((item) => (
                  <div key={item.id} className="flex gap-4 items-center bg-white/5 p-3 rounded-lg border border-white/10">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-md object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm">{item.name}</h4>
                      <p className="text-primary font-bold">{item.price}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <button onClick={() => removeFromCart(item.id)} className="text-muted-foreground hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <div className="flex items-center gap-2 bg-background rounded-md border border-white/10 px-2 py-1">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus className="w-3 h-3" /></button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus className="w-3 h-3" /></button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {step === "type" && (
            <div className="space-y-4">
              <button
                onClick={() => setOrderType("delivery")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${orderType === "delivery" ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                <div className={`p-3 rounded-full ${orderType === "delivery" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>
                  <Truck className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold uppercase text-lg tracking-wider">Entrega</h4>
                  <p className="text-sm text-muted-foreground">Receba em casa</p>
                </div>
              </button>

              <button
                onClick={() => setOrderType("pickup")}
                className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 ${orderType === "pickup" ? "bg-primary/20 border-primary" : "bg-white/5 border-white/10 hover:bg-white/10"}`}
              >
                <div className={`p-3 rounded-full ${orderType === "pickup" ? "bg-primary text-primary-foreground" : "bg-white/10"}`}>
                  <Store className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <h4 className="font-bold uppercase text-lg tracking-wider">Retirada</h4>
                  <p className="text-sm text-muted-foreground">Pegue no balco</p>
                </div>
              </button>
            </div>
          )}

          {step === "details" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nome Completo</label>
                <input type="text" className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary focus:outline-none" placeholder="Joo Silva" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Endereo</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input type="text" className="w-full bg-background border border-white/10 rounded-lg p-3 pl-10 text-sm focus:border-primary focus:outline-none" placeholder="Rua das Brasas, 123" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Nmero</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary focus:outline-none" placeholder="123" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Complemento</label>
                  <input type="text" className="w-full bg-background border border-white/10 rounded-lg p-3 text-sm focus:border-primary focus:outline-none" placeholder="Apt 42" />
                </div>
              </div>
            </div>
          )}

          {step === "payment" && (
            <div className="space-y-4">
              <button className="w-full flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <QrCode className="w-6 h-6 text-[#32BCAD]" />
                  <span className="font-bold tracking-wider">PIX</span>
                </div>
                <span className="text-xs text-[#32BCAD] border border-[#32BCAD] px-2 py-1 rounded">Aprovao rpida</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-6 h-6 text-blue-400" />
                  <span className="font-bold tracking-wider">Carto de Crdito</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#8A05BE] rounded flex items-center justify-center text-white font-bold text-xs">nu</div>
                  <span className="font-bold tracking-wider">Nubank</span>
                </div>
              </button>

              <button className="w-full flex items-center justify-between p-4 rounded-xl border bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <div className="flex items-center gap-3">
                  <Banknote className="w-6 h-6 text-green-500" />
                  <span className="font-bold tracking-wider">Dinheiro na Entrega</span>
                </div>
              </button>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-white/10 bg-card">
          <div className="flex justify-between items-center mb-4">
            <span className="font-bold uppercase tracking-wider text-muted-foreground">Total</span>
            <span className="text-2xl font-black text-primary">{formatPrice(totalPrice)}</span>
          </div>
          
          {step === "payment" ? (
            <Button onClick={finishOrder} className="w-full py-6 text-lg font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_-5px_var(--primary)]">
              Finalizar Pedido
            </Button>
          ) : (
            <Button 
              onClick={handleNext} 
              disabled={items.length === 0 || (step === "type" && !orderType)}
              className="w-full py-6 text-lg font-black uppercase tracking-widest bg-white text-black hover:bg-white/90"
            >
              Continuar
            </Button>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
