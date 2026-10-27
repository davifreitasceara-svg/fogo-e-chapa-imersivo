import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/PolicyLayout";
import { ShieldCheck, Lock, Eye, Database, UserCheck, Bell } from "lucide-react";

export const Route = createFileRoute("/privacidade")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <PolicyLayout
      title="Política de Privacidade"
      subtitle="Saiba como a Fogo & Chapa coleta, utiliza, armazena e protege os seus dados pessoais em total conformidade com a LGPD (Lei Geral de Proteção de Dados - Lei nº 13.709/2018)."
      badge="Segurança & Transparência"
      activeTab="privacidade"
    >
      {/* 1. Compromisso com a sua Privacidade */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <ShieldCheck className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              1. Compromisso com a sua Privacidade
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Protegendo seus dados com a mesma dedicação com que grelhamos nossos hambúrgueres
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          A <strong className="text-white font-semibold">Fogo & Chapa Hamburgueria Artesanal</strong>, sediada em Fortaleza - CE, preza pela transparência, sigilo e segurança absoluta das informações compartilhadas pelos nossos clientes e visitantes da plataforma digital.
        </p>
        <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
          Esta Política de Privacidade descreve as práticas adotadas em nosso site e sistema de pedidos online em relação à coleta, tratamento, armazenamento e proteção de seus dados pessoais, assegurando o pleno cumprimento dos preceitos da Lei Federal nº 13.709/2018 (LGPD).
        </p>
      </div>

      {/* 2. Quais Dados Coletamos */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Database className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              2. Quais Dados Coletamos
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Apenas as informações estritamente necessárias para a melhor experiência gastronômica
            </p>
          </div>
        </div>

        <ul className="space-y-4 text-zinc-300 font-sans text-sm sm:text-base">
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Dados de Identificação e Contato:</strong>
            Nome completo, e-mail e telefone/WhatsApp fornecidos voluntariamente para confirmação de pedidos e suporte.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Dados de Entrega:</strong>
            Endereço completo em Fortaleza e Região Metropolitana (rua, número, complemento, bairro, CEP e referências) para o delivery.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Histórico e Preferências:</strong>
            Hambúrgueres escolhidos, ponto da carne, acompanhamentos, bebidas e restrições alérgicas para personalização do seu pedido.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Dados Financeiros Protegidos:</strong>
            Processados diretamente por gateways com certificação PCI-DSS. A Fogo & Chapa não armazena números de cartões em seus servidores.
          </li>
        </ul>
      </div>

      {/* 3. Finalidade do Tratamento */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Eye className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              3. Finalidade do Tratamento de Dados
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Utilização ética e transparente para executar nossos serviços
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="font-display font-black text-white text-base uppercase mb-1">Processamento e Entrega</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Produzir artesanalmente seu hambúrguer e direcionar o entregador até o endereço informado com máxima agilidade.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="font-display font-black text-white text-base uppercase mb-1">Comunicação e Rastreio</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Notificar o status do preparo, avisar a saída para entrega e prestar suporte caso haja imprevistos.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="font-display font-black text-white text-base uppercase mb-1">Segurança e Antifraude</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Validar transações e prevenir acessos não autorizados no checkout com protocolos de tokenização.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <h3 className="font-display font-black text-white text-base uppercase mb-1">Promoções Exclusivas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Enviar novidades da brasa e cupons apenas com prévio consentimento, com descadastramento a qualquer momento.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Armazenamento e Criptografia */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Lock className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              4. Armazenamento e Criptografia
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Padrões avançados de segurança digital
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          Utilizamos camadas avançadas de proteção, incluindo certificados SSL/TLS de 256 bits para todas as conexões, garantindo que suas comunicações e seleções de cardápio trafeguem criptografadas entre seu navegador e nossos servidores.
        </p>
        <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
          Nenhum dado é comercializado, alugado ou cedido a terceiros para fins publicitários externos. O compartilhamento ocorre única e exclusivamente com parceiros operacionais indispensáveis (provedores de pagamento e entregadores em rota).
        </p>
      </div>

      {/* 5. Seus Direitos (LGPD) */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <UserCheck className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              5. Seus Direitos como Titular de Dados
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Você está sempre no controle das suas informações
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          Nos termos do artigo 18 da LGPD, você pode a qualquer momento solicitar:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-zinc-300">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            Confirmação da existência de tratamento
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            Acesso aos dados coletados
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            Correção de dados incompletos ou inexatos
          </div>
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-white/[0.03] border border-white/10">
            <span className="size-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            Exclusão ou revogação de consentimento
          </div>
        </div>
      </div>

      {/* 6. Canal de Atendimento do Titular (DPO) */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Bell className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              6. Canal de Atendimento do Titular (DPO)
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Solicitações respondidas com agilidade
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
          Para exercer qualquer um dos seus direitos ou esclarecer dúvidas sobre esta Política de Privacidade, envie uma mensagem para nosso canal de atendimento:{" "}
          <strong className="text-orange-400 font-semibold">privacidade@fogoechapa.com.br</strong> ou dirija-se ao nosso ponto presencial na <strong className="text-white font-semibold">Av. Beira Mar, 3120 - Meireles, Fortaleza - CE</strong>.
        </p>
      </div>
    </PolicyLayout>
  );
}
