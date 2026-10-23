import { createFileRoute } from "@tanstack/react-router";
import { PolicyLayout } from "@/components/PolicyLayout";
import { FileText, ShoppingBag, Truck, CreditCard, Flame, AlertCircle } from "lucide-react";

export const Route = createFileRoute("/termos")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <PolicyLayout
      title="Termos de Serviço"
      subtitle="Condições gerais de navegação, pedidos online, entregas e atendimento da Fogo & Chapa Hamburgueria Artesanal em Fortaleza/CE."
      badge="Regras & Condições"
      activeTab="termos"
    >
      {/* 1. Aceitação dos Termos */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <FileText className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              1. Aceitação dos Termos
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Regras claras para uma experiência gastronômica impecável
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-4 font-sans text-sm sm:text-base">
          Ao acessar a plataforma digital, visualizar nosso cardápio ou realizar pedidos na <strong className="text-white font-semibold">Fogo & Chapa</strong>, você declara ter lido, compreendido e concordado integralmente com as condições estipuladas nestes Termos de Serviço.
        </p>
        <p className="text-zinc-400 leading-relaxed font-sans text-sm sm:text-base">
          Estes termos aplicam-se a todos os usuários, clientes e visitantes, regendo a relação de consumo entre você e nossa hamburgueria conforme o Código de Defesa do Consumidor (Lei Federal nº 8.078/1990).
        </p>
      </div>

      {/* 2. Pedidos, Cardápio e Disponibilidade */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <ShoppingBag className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              2. Pedidos, Cardápio e Disponibilidade
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Hambúrgueres artesanais na brasa preparados sob demanda
            </p>
          </div>
        </div>

        <ul className="space-y-4 text-zinc-300 font-sans text-sm sm:text-base">
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Preparo Artesanal sob Demanda:</strong>
            Cada blend de carne é moído fresco e grelhado na brasa viva após a confirmação do seu pedido, respeitando rigorosamente o ponto da carne e as observações culinárias selecionadas.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Preços e Atualizações:</strong>
            Os valores exibidos no cardápio online estão em Reais (BRL) e podem ser atualizados periodicamente para refletir sazonalidade e promoções ativas. O valor cobrado será sempre o vigente no momento da finalização do checkout.
          </li>
          <li className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-orange-500/30 transition-all">
            <strong className="text-white block mb-1 font-display uppercase tracking-wide text-sm sm:text-base">Disponibilidade de Insumos:</strong>
            Por trabalharmos com cortes nobres e ingredientes frescos, itens específicos podem ter estoque limitado ao longo da noite. Em caso de indisponibilidade superveniente, nossa equipe entrará em contato imediato para sugerir uma substituição equivalente ou cancelamento do item.
          </li>
        </ul>
      </div>

      {/* 3. Entregas e Delivery em Fortaleza */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Truck className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              3. Entregas, Raio de Atendimento e Prazos
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Sabor e temperatura preservados até a sua porta
            </p>
          </div>
        </div>

        <p className="text-zinc-300 leading-relaxed mb-5 font-sans text-sm sm:text-base">
          Nossa operação de delivery atende os principais bairros de Fortaleza/CE (Meireles, Aldeota, Varjota, Praia de Iracema, Dionísio Torres, Cocó, Papicu e adjacências).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3.5 items-start">
            <AlertCircle className="size-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-display uppercase tracking-wide text-sm mb-1">Precisão do Endereço</strong>
              <p className="text-xs text-zinc-400 leading-relaxed">
                É de responsabilidade do cliente fornecer dados completos de entrega (bloco, apto e ponto de referência), além de manter o telefone informado disponível para contato.
              </p>
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white/[0.03] border border-white/10 flex gap-3.5 items-start">
            <AlertCircle className="size-5 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block font-display uppercase tracking-wide text-sm mb-1">Estimativa de Tempo</strong>
              <p className="text-xs text-zinc-400 leading-relaxed">
                O tempo médio informado no checkout é calculado com base no fluxo da grelha e trânsito da cidade, podendo oscilar pontualmente em dias de chuva ou horários de pico.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Formas de Pagamento */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <CreditCard className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              4. Pagamentos e Cobrança
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Métodos rápidos, seguros e sem burocracia
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">PIX Instantâneo</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">QR Code dinâmico e Chave Copia e Cola com confirmação automática imediata.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">Aprovação em segundos</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">Cartões de Crédito</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">Principais bandeiras com criptografia e tokenização de segurança PCI-DSS.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">Online ou na Entrega</div>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 text-center flex flex-col justify-between">
            <div>
              <span className="font-display font-black text-white text-base uppercase block mb-1">Dinheiro em Espécie</span>
              <span className="text-xs text-zinc-400 leading-relaxed block">Pagamento direto ao entregador com troco informado no ato do pedido.</span>
            </div>
            <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-orange-400 font-bold uppercase tracking-wider">Troco facilitado</div>
          </div>
        </div>
      </div>

      {/* 5. Propriedade Intelectual */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <div className="flex items-start sm:items-center gap-4 mb-5">
          <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-600/20 border border-orange-500/30 flex items-center justify-center text-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.25)] shrink-0 group-hover:scale-105 transition-transform">
            <Flame className="size-6" />
          </div>
          <div>
            <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight">
              5. Propriedade Intelectual
            </h2>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-wider text-orange-400 mt-0.5">
              Marcas, receitas e identidade visual exclusivas
            </p>
          </div>
        </div>
        <p className="text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
          A marca <strong className="text-white font-semibold">Fogo & Chapa</strong>, logotipos, renderizações e modelos 3D dos hambúrgueres, textos do cardápio, layout visual e fotografias são de propriedade exclusiva da empresa. É vedada a reprodução total ou parcial sem autorização prévia por escrito.
        </p>
      </div>

      {/* 6. Foro e Jurisdição */}
      <div className="bg-gradient-to-b from-zinc-900/80 via-black/90 to-zinc-950/90 border border-white/10 hover:border-orange-500/40 rounded-3xl p-6 sm:p-10 shadow-[0_15px_45px_rgba(0,0,0,0.7)] relative overflow-hidden group transition-all duration-300">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-orange-500/70 to-transparent group-hover:via-orange-400 transition-all duration-500" />
        
        <h2 className="font-display font-black text-xl sm:text-2xl md:text-3xl text-white uppercase tracking-tight mb-3">
          6. Legislação Aplicável e Foro
        </h2>
        <p className="text-zinc-300 leading-relaxed font-sans text-sm sm:text-base">
          Estes Termos são regidos pelas leis da República Federativa do Brasil. Para a resolução de eventuais controvérsias decorrentes destes termos, fica eleito o <strong className="text-white font-semibold">Foro da Comarca de Fortaleza, Estado do Ceará</strong>, com renúncia expressa a qualquer outro, por mais privilegiado que seja.
        </p>
      </div>
    </PolicyLayout>
  );
}
