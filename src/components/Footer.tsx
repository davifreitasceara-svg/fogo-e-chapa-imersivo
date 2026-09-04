import { Clock, Facebook, Flame, Instagram, MapPin, Phone, Twitter } from "lucide-react";

const quickLinks = [
  { label: "Início", href: "#inicio" },
  { label: "Cardápio", href: "#cardapio" },
  { label: "Sobre Nós", href: "#sobre" },
  { label: "Contato", href: "#contato" },
];

const socials = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
];

export function Footer() {
  return (
    <footer id="contato" className="relative border-t border-border bg-charcoal/60 pt-20 pb-10">
      <div className="ember-glow absolute inset-x-0 top-0 h-40 opacity-30" />

      <div className="relative mx-auto grid w-full max-w-7xl gap-12 px-5 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5">
            <span className="grid size-10 place-items-center rounded-xl bg-fire">
              <Flame className="size-5 text-primary-foreground" strokeWidth={2.5} />
            </span>
            <span className="font-display text-xl uppercase">
              <span className="text-fire">Fogo</span> e Chapa
            </span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Hamburgueria premium na brasa. Carne fresca, fogo honesto e nenhum atalho.
          </p>
          <div className="mt-5 flex gap-3">
            {socials.map((s) => (
              <a
                key={s.label}
                href="#"
                aria-label={s.label}
                className="grid size-10 place-items-center rounded-xl border border-border text-muted-foreground transition-all hover:border-flame hover:text-flame hover:shadow-[0_0_25px_-8px_var(--flame)]"
              >
                <s.icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-display text-lg uppercase">Links rápidos</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-muted-foreground">
            {quickLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="transition-colors hover:text-flame">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg uppercase">Onde nos achar</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-flame" />
              Rua da Brasa, 512 — Aldeota, Fortaleza/CE
            </li>
            <li className="flex gap-3">
              <Phone className="mt-0.5 size-4 shrink-0 text-flame" />
              (85) 3222-9090
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-lg uppercase">Horário</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-3">
              <Clock className="mt-0.5 size-4 shrink-0 text-flame" />
              <span>
                Ter a Qui — 18h às 23h
                <br />
                Sex e Sáb — 18h às 01h
                <br />
                Dom — 17h às 23h
              </span>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative mx-auto mt-14 flex w-full max-w-7xl flex-col items-center justify-between gap-3 border-t border-border px-5 pt-6 text-xs text-muted-foreground sm:flex-row">
        <p>© {new Date().getFullYear()} Fogo e Chapa. Todos os direitos grelhados.</p>
        <p>Feito com brasa em Fortaleza.</p>
      </div>
    </footer>
  );
}
