import { motion } from "framer-motion";
import { Beef, Flame, Timer } from "lucide-react";
import grill from "@/assets/about-grill.jpg";

const stats = [
  { icon: Flame, value: "300°C", label: "Chapa sempre escaldante" },
  { icon: Beef, value: "45 dias", label: "Maturação do blend" },
  { icon: Timer, value: "12 min", label: "Do fogo até sua mesa" },
];

export function About() {
  return (
    <section id="sobre" className="relative py-28">
      <div className="mx-auto grid w-full max-w-7xl items-center gap-14 px-5 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-[2rem] bg-fire opacity-20 blur-3xl" />
          <img
            src={grill}
            alt="Chef grelhando hambúrgueres em chapa com labaredas altas"
            loading="lazy"
            width={1200}
            height={900}
            className="relative rounded-3xl border border-border object-cover shadow-[var(--shadow-deep)]"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="text-xs font-semibold tracking-[0.3em] text-flame uppercase">
            Sobre nós
          </span>
          <h2 className="mt-4 font-display text-5xl uppercase sm:text-6xl">
            Fogo alto, <span className="text-fire">alma de bairro</span>
          </h2>
          <p className="mt-5 text-muted-foreground">
            Começamos com uma churrasqueira improvisada na garagem e a teimosia de não usar
            congelados. Hoje moemos a carne todo dia, assamos o pão na casa e mantemos o carvão
            aceso do meio-dia à meia-noite.
          </p>
          <p className="mt-4 text-muted-foreground">
            Cada hambúrguer passa pela chapa e termina na brasa — é daí que vem aquele perfume
            defumado que você sente antes mesmo de entrar.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-2xl border border-border bg-card/70 p-5 transition-colors hover:border-flame/60"
              >
                <s.icon className="size-5 text-flame" />
                <p className="mt-3 font-display text-2xl">{s.value}</p>
                <p className="mt-1 text-xs text-muted-foreground uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
