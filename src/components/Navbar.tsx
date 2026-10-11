import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Menu, X } from "lucide-react";
import { useNavigate, useRouter } from "@tanstack/react-router";
import { useCart } from "@/context/CartContext";

const navLinks = [
  { href: "/#about", label: "About" },
  { href: "/#menu", label: "Menu" },
  { href: "/#delivery", label: "Delivery" },
  { href: "/drinks", label: "Drinks" },
];

export function Navbar({ onOpenLogin }: { onOpenLogin?: () => void }) {
  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [currentPath, setCurrentPath] = useState("");
  const { items, setIsOpen } = useCart();
  const navigate = useNavigate();
  const router = useRouter();
  const cartCount = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname);
    }
  }, []);

  const handleNavClick = (e: React.MouseEvent, href: string) => {
    if (href === "/drinks") {
      e.preventDefault();
      navigate({ to: "/drinks" });
    } else if (href === "/" || href === "") {
      e.preventDefault();
      navigate({ to: "/" });
    } else if (href.startsWith("/#")) {
      e.preventDefault();
      const targetId = href.replace("/#", "");
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate({ to: "/" }).then(() => {
          setTimeout(() => {
            document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" });
          }, 120);
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
            <ShoppingBag className="size-5" />
            {cartCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-amber-400 text-[10px] font-black text-black shadow-md"
              >
                {cartCount}
              </motion.span>
            )}
          </button>

          <a
            href="/#contato"
            onClick={(e) => {
              if (onOpenLogin && typeof window !== "undefined" && window.location.pathname.includes("drinks")) {
                onOpenLogin();
                return;
              }
              handleNavClick(e, "/#contato");
            }}
            className="hidden sm:flex items-center justify-center rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 py-2 text-sm transition-colors cursor-pointer"
          >
            Contact Us
          </a>

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
                <a
                  href="/#contato"
                  onClick={(e) => {
                    setOpen(false);
                    handleNavClick(e, "/#contato");
                  }}
                  className="block text-center rounded-full border-2 border-white text-white hover:bg-white hover:text-black py-2.5 text-sm font-bold uppercase transition-colors cursor-pointer"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
