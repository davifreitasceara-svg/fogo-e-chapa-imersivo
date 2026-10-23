import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/PolicyLayout";
import { RotateCcw, CheckCircle2, AlertTriangle, Clock, RefreshCw, MessageCircle } from "lucide-react";

export const Route = createFileRoute("/reembolso")({
  component: RefundPage,
});

function RefundPage() {
  return (
    <PolicyLayout
      title="Política de Reembolso & Troca"
      subtitle="Regras de cancelamento, devolução e estorno de pedidos da Fogo & Chapa Hamburgueria Artesanal, pautadas pelo Código de Defesa do Consumidor e respeito total aos nossos clientes."
      badge="Garantia de Satisfação"
      activeTab="reembolso"
    >
      {/* 1. Compromisso com o Sabor e a Qualidade */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <RotateCcw className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              1. Compromisso com o Sabor e a Qualidade
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Seu hambúrguer na brasa perfeito, exatamente como você pediu
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          Na <strong className="text-white font-semibold">Fogo & Chapa</strong>, nossa missão é entregar uma experiência gastronômica memorável: carne suculenta, queijo derretido no ponto, pão tostado na medida e acompanhamentos crocantes.
        </p>
        <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
          Por se tratar de produtos alimentícios frescos e perecíveis preparados sob encomenda, nossa política de cancelamento, troca e reembolso segue diretrizes específicas alinhadas ao Código de Defesa do Consumidor (Lei Federal nº 8.078/1990) e às boas práticas de segurança dos alimentos.
        </p>
      </div>

      {/* 2. Cancelamento do Pedido */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Clock className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              2. Cancelamento do Pedido
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Regras e prazos para solicitar cancelamento
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 text-emerald-400 font-display font-bold uppercase text-sm mb-2">
              <CheckCircle2 className="size-4" /> Antes de entrar na Grelha (Até 5 min)
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              O cancelamento pode ser feito de forma imediata com <strong className="text-white">estorno de 100%</strong> do valor pago, sem qualquer taxa ou penalidade.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2 text-amber-400 font-display font-bold uppercase text-sm mb-2">
              <AlertTriangle className="size-4" /> Após o Início do Preparo na Brasa
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Por serem itens perecíveis preparados individualmente, o cancelamento após o início do cozimento ou saída do entregador não permite estorno integral, salvo em casos de erro comprovado da hamburgueria.
            </p>
          </div>
        </div>
      </div>

      {/* 3. Hipóteses com Reembolso Integral ou Troca */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <RefreshCw className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              3. Quando Você Tem Direito a Reembolso ou Troca Imediata
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Garantimos a reposição sem custo ou estorno nos seguintes casos:
            </p>
          </div>
        </div>

        <ul className="space-y-4 text-zinc-300 font-sans text-sm sm:text-base">
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Item Divergente ou Erro no Pedido:</strong>
            Você recebeu um lanche diferente daquele solicitado (ex: ponto da carne trocado, queijo trocado ou ingrediente retirado no pedido que veio no item).
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Itens Faltantes:</strong>
            Bebida na lata, molho especial ou porção de batata que constava na nota e não foi entregue na sacola térmica. O cliente pode optar pelo envio prioritário ou estorno proporcional do valor.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Embalagem Violada ou Alimento Danificado:</strong>
            Danos estruturais durante o transporte pelo motoboy que comprometam a integridade e apresentação do lanche.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Atraso Excessivo Injustificado:</strong>
            Atrasos superiores a 40 minutos além da estimativa máxima sem comunicação prévia por parte do atendimento.
          </li>
        </ul>
      </div>

      {/* 4. Prazos e Métodos de Estorno */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight mb-2">
          4. Prazos e Métodos de Estorno
        </h2>
        <p className="text-zinc-300 leading-relaxed mb-6 font-sans text-sm sm:text-base">
          Após a aprovação do reembolso pelo nosso time de suporte, a devolução dos valores ocorrerá conforme o meio original de pagamento:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">PIX</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">Estornado em até <strong className="text-white font-semibold">30 minutos</strong> diretamente na mesma conta de origem da chave PIX.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">Imediato</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">Cartão de Crédito</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">Solicitação enviada à operadora em até 24h. O crédito constará na fatura atual ou seguinte conforme as regras da emissora.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">Fatura do Cartão</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">Crédito na Loja</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">Crédito imediato + bônus de 10% para utilizar no seu próximo pedido na Fogo & Chapa.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">+10% de Bônus</div>
          </div>
        </div>
      </div>

      {/* 5. Como Acionar o Suporte */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <MessageCircle className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              5. Como Solicitar Ajuda ou Troca Rápida
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Atendimento prioritário em tempo real durante o expediente
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          Ao receber seu pedido, caso verifique qualquer não conformidade:
        </p>
        <ol className="list-decimal list-inside space-y-2.5 text-xs sm:text-sm text-zinc-300 mb-5 font-sans">
          <li>Tire uma foto nítida do item recebido ou da embalagem com a etiqueta do pedido;</li>
          <li>Entre em contato pelo e-mail <strong className="text-orange-400 font-semibold">reembolso@fogoechapa.com.br</strong> ou fale diretamente pelo canal de atendimento;</li>
          <li>Informe o número do seu pedido ou nome cadastrado.</li>
        </ol>
        <p className="text-zinc-400 text-xs leading-relaxed font-sans">
          Nossa equipe em Fortaleza dará retorno imediato para resolver a situação da forma mais vantajosa e justa para você!
        </p>
      </div>
    </PolicyLayout>
  );
}
