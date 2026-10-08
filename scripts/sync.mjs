// Sincroniza o projeto: traz as mudanças do amigo, junta com as suas e sobe tudo.
// Uso: npm run sync            (mensagem automática)
//      npm run sync -- "minha mensagem"
import { execSync } from "node:child_process";

const BRANCH = "main";
const run = (cmd, opts = {}) =>
  execSync(cmd, { stdio: opts.silent ? "pipe" : "inherit", encoding: "utf8" });

try {
  const message = process.argv.slice(2).join(" ").trim() || `chore: sync ${new Date().toLocaleString("pt-BR")}`;

  // 1. Salva as alterações locais num commit (se houver)
  const pending = run("git status --porcelain", { silent: true }).trim();
  if (pending) {
    run("git add -A");
    run(`git commit -m "${message.replace(/"/g, '\\"')}"`);
  } else {
    console.log("Sem alterações locais novas.");
  }

  // 2. Traz o que o amigo mandou e coloca as suas alterações por cima
  console.log("\nBuscando mudanças do seu amigo...");
  run(`git pull --rebase origin ${BRANCH}`);

  // 3. Sobe tudo (o Vercel publica sozinho a cada push)
  console.log("\nEnviando para o GitHub...");
  run(`git push origin ${BRANCH}`);

  console.log("\n✔ Sincronizado! O Vercel já está publicando.");
} catch (err) {
  console.error("\n✖ Não foi possível sincronizar.");
  console.error("Se houver conflito, resolva os arquivos marcados e rode: git rebase --continue && git push origin main");
  console.error("Para desistir: git rebase --abort");
  process.exit(1);
}
