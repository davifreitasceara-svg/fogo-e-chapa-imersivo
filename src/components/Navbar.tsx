import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Flame, Menu, X } from "lucide-react";

const links = [
  { label: "Início", href: "#inicio" },
  { label: "Cardápio", href: "#cardapio" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

export function Navbar({ onOpenLogin }: { onOpenLogin: () => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-panel border-x-0 border-t-0 py-3" : "border-transparent py-5"
      }`}
    >
      <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5">
        <a href="#inicio" className="group flex items-center gap-2.5">
          <span className="relative grid size-10 place-items-center rounded-xl bg-fire shadow-[var(--shadow-fire)]">
            <Flame className="size-5 text-primary-foreground" strokeWidth={2.5} />
          </span>
          <span className="font-display text-xl leading-none tracking-wide uppercase">
            <span className="text-fire">Fogo</span>{" "}
            <span className="text-foreground/70 text-sm">e</span>{" "}
            <span className="text-foreground">Chapa</span>
          </span>
        </a>

        <ul className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="relative text-sm font-medium tracking-wide text-muted-foreground uppercase transition-colors hover:text-foreground after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:w-full after:scale-x-0 after:bg-fire after:transition-transform after:duration-300 hover:after:scale-x-100"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <motion.button
            onClick={onOpenLogin}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.96 }}
            className="hidden rounded-full bg-fire px-6 py-2.5 text-sm font-semibold text-primary-foreground uppercase transition-shadow duration-300 hover:shadow-[0_0_35px_-4px_var(--flame)] sm:block"
          >
            Entrar / Cadastrar
          </motion.button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Abrir menu"
            className="grid size-10 place-items-center rounded-lg border border-border text-foreground md:hidden"
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden md:hidden"
          >
            <ul className="mx-5 mt-3 space-y-1 rounded-2xl border border-border bg-card/95 p-3">
              {links.map((l) => (
                <li key={l.href}>
                  <a
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-4 py-3 text-sm font-medium uppercase hover:bg-secondary"
                  >
                    {l.label}
                  </a>
                </li>
              ))}
              <li>
                <button
                  onClick={() => {
                    setOpen(false);
                    onOpenLogin();
                  }}
                  className="mt-1 w-full rounded-lg bg-fire px-4 py-3 text-sm font-semibold text-primary-foreground uppercase"
                >
                  Entrar / Cadastrar
                </button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
