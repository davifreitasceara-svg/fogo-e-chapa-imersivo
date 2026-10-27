import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X, LogIn } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

const navLinks = [
  { href: "/#menu", label: "Cardápio" },
  { href: "/#drinks", label: "Bebidas" },
  { href: "/drinks", label: "Latas 3D" },
  { href: "/#contato", label: "Onde Estamos" },
];

export function Navbar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const { user } = useAuth();
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { items, setIsOpen } = useCart();
  const navigate = useNavigate();
  const router = useRouter();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const [cartBumping, setCartBumping] = useState(false);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setCartBumping(true);
      const timer = setTimeout(() => setCartBumping(false), 650);
      prevCount.current = cartCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = cartCount;
    return undefined;
  }, [cartCount]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    if (href === "/drinks") {
      if (typeof window !== "undefined" && window.location.pathname === "/drinks") {
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
      }
      navigate({ to: "/drinks" });
      return;
    } 
    
    if (href === "/" || href === "") {
      navigate({ to: "/" });
      return;
    } 
    
    if (href.startsWith("/#")) {
      const targetId = href.replace("/#", "");
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ to: "/" }).then(() => {
          let attempts = 0;
          const interval = setInterval(() => {
            attempts++;
            const el = document.getElementById(targetId);
            if (el) {
              el.scrollIntoView({ behavior: "smooth" });
              clearInterval(interval);
            } else if (attempts > 12) {
              clearInterval(interval);
            }
          }, 80);
        });
      }
    }
  };

  const handleMouseEnter = (href: string) => {
    setHoveredNav(href);
    if (href === "/drinks") {
      try {
        router.preloadRoute({ to: "/drinks" });
      } catch (err) {}
    } else if (href === "/" || href.startsWith("/#")) {
      try {
        router.preloadRoute({ to: "/" });
      } catch (err) {}
    }
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10 transition-colors duration-700">
      <div className="mx-auto flex h-20 sm:h-24 max-w-7xl items-center justify-between px-5 lg:px-8">
        {/* Left: Brand Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <a
            href="/"
            onClick={(e) => handleNavClick(e, "/")}
            className="font-display text-xl sm:text-2xl font-black tracking-tighter text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            FOGO E CHAPA
          </a>
        </motion.div>

        {/* Center: Floating Navigation Pill */}
        <motion.nav
          className="hidden md:flex items-center gap-1 text-sm font-bold text-white bg-white/10 backdrop-blur-sm rounded-full px-2 py-1.5 border border-white/10 shadow-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          onMouseLeave={() => setHoveredNav(null)}
        >
          {navLinks.map((link) => {
            const isActive = currentPath === link.href || (link.href === "/drinks" && currentPath.includes("drinks"));
            return (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="relative px-5 py-2 rounded-full z-10 transition-colors text-white cursor-pointer"
                onMouseEnter={() => handleMouseEnter(link.href)}
              >
                {hoveredNav === link.href ? (
                  <motion.span
                    layoutId="navPill"
                    className="absolute inset-0 bg-white/20 rounded-full"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                ) : isActive ? (
                  <span className="absolute inset-0 bg-white/15 rounded-full" />
                ) : null}
                <span className="relative z-10">{link.label}</span>
              </a>
            );
          })}
        </motion.nav>

        {/* Right: Shopping Bag & Contact Us */}
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={() => setIsOpen(true)}
            aria-label={`Sacola de compras com ${cartCount} itens`}
            className="relative flex items-center justify-center size-10 rounded-full text-white hover:bg-white/20 transition-colors cursor-pointer"
          >
            {/* Shockwave Rings on Impact */}
            <AnimatePresence>
              {cartBumping && (
                <>
                  <motion.span
                    key="navbar-shockwave-1"
                    initial={{ scale: 0.8, opacity: 0.95 }}
                    animate={{ scale: 2.5, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="absolute inset-0 rounded-full border-2 border-amber-400 pointer-events-none"
                  />
                  <motion.span
                    key="navbar-shockwave-2"
                    initial={{ scale: 0.9, opacity: 0.75 }}
                    animate={{ scale: 3.2, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.75, ease: "easeOut", delay: 0.08 }}
                    className="absolute inset-0 rounded-full bg-gradient-to-r from-orange-500/40 to-amber-400/40 blur-sm pointer-events-none"
                  />
                </>
              )}
            </AnimatePresence>

            {/* Shopping Bag Icon with Squash & Stretch Bounce */}
            <motion.div
              animate={
                cartBumping
                  ? {
                      scale: [1, 1.45, 0.82, 1.2, 0.95, 1],
                      rotate: [0, -16, 14, -8, 2, 0],
                      y: [0, -3, 2, -1, 0],
                    }
                  : { scale: 1, rotate: 0, y: 0 }
              }
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
              className="relative flex items-center justify-center"
            >
              <ShoppingBag
                className={`size-5 transition-colors duration-300 ${
                  cartBumping ? "text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.9)]" : "text-white"
                }`}
              />
            </motion.div>

            {/* Cart Count Badge with Spring Pop */}
            <AnimatePresence mode="popLayout">
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 2.2, opacity: 0, rotate: -20 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 14 }}
                  className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-[10px] font-black text-black shadow-[0_0_12px_rgba(245,158,11,0.6)] z-10"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {user ? (
            <button
              onClick={() => {
                if (onOpenLogin) onOpenLogin();
              }}
              className="hidden sm:flex items-center justify-center gap-2 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/50 hover:bg-amber-500/25 font-bold px-4 py-1.5 text-xs transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm"
              title="Acessar meu perfil e endereços"
            >
              {(user.user_metadata as Record<string, any> | undefined)?.["avatar_url"] ||
              (user.user_metadata as Record<string, any> | undefined)?.["picture"] ? (
                <img
                  src={
                    ((user.user_metadata as Record<string, any> | undefined)?.["avatar_url"] as string) ||
                    ((user.user_metadata as Record<string, any> | undefined)?.["picture"] as string)
                  }
                  alt="Avatar"
                  className="size-5 rounded-full object-cover border border-amber-400"
                />
              ) : null}
              <span className="max-w-[120px] truncate">
                {((user.user_metadata as Record<string, any> | undefined)?.["full_name"] as string)?.split(" ")[0] || "Minha Conta"}
              </span>
            </button>
          ) : (
            <button
              onClick={() => {
                if (onOpenLogin) {
                  onOpenLogin();
                } else {
                  document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="hidden sm:flex items-center justify-center gap-2 rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 py-2 text-sm transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            >
              <LogIn className="size-4" /> Entrar
            </button>
          )}

          {/* Mobile hamburger menu */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="grid size-10 place-items-center rounded-lg border border-white/20 text-white md:hidden hover:bg-white/10 transition-colors"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </motion.div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden bg-black/90 backdrop-blur-xl border-b border-white/10"
          >
            <div className="mx-5 py-4 space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => {
                    setOpen(false);
                    handleNavClick(e, link.href);
                  }}
                  className="block rounded-xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-2 border-t border-white/10">
                <button
                  onClick={() => {
                    setOpen(false);
                    if (onOpenLogin) {
                      onOpenLogin();
                    } else {
                      document.getElementById("contato")?.scrollIntoView({ behavior: "smooth" });
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-white text-white hover:bg-white hover:text-black py-2.5 text-sm font-bold uppercase transition-all duration-300 active:scale-95 cursor-pointer"
                >
                  {user ? (
                    <span>Minha Conta ({((user.user_metadata as Record<string, any> | undefined)?.["full_name"] as string)?.split(" ")[0] || "Conectado"})</span>
                  ) : (
                    <>
                      <LogIn className="size-4" /> Entrar com Google
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
