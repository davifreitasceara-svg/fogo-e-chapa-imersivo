/**
 * Fogo e Chapa - Carrinho de Compras
 */

(function () {
  // Configurações
  const CONFIG = {
    whatsappNumber: '5511999999999', // WhatsApp do restaurante
    storageKey: 'fogo_chapa_cart_v1',
    deliveryFee: 5.00,
    freeDeliveryThreshold: 60.00
  };

  // Preços padrão para bebidas em destaque (ORDER NOW)
  const DRINKS_PRICES = {
    'COLA TRADICIONAL': 6.50,
    'SUCO DE LARANJA': 8.00,
    'LIMONADA SUÍÇA': 9.00,
    'CHOPP GELADO': 12.00,
    'CHÁ GELADO': 7.50,
    'GUARANÁ NATURAL': 6.50
  };

  // Estado do Carrinho
  let state = {
    items: [],
    orderType: 'entrega',
    paymentMethod: 'pix',
    clientName: '',
    clientPhone: '',
    addressStreet: '',
    addressNumber: '',
    addressNeighborhood: '',
    addressComplement: '',
    cashChange: '',
    notes: ''
  };

  // Carregar dados salvos
  function loadCart() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.items)) state.items = parsed.items;
        if (parsed.orderType) state.orderType = parsed.orderType;
        if (parsed.paymentMethod) state.paymentMethod = parsed.paymentMethod;
        if (parsed.clientName) state.clientName = parsed.clientName;
        if (parsed.clientPhone) state.clientPhone = parsed.clientPhone;
        if (parsed.addressStreet) state.addressStreet = parsed.addressStreet;
        if (parsed.addressNumber) state.addressNumber = parsed.addressNumber;
        if (parsed.addressNeighborhood) state.addressNeighborhood = parsed.addressNeighborhood;
        if (parsed.addressComplement) state.addressComplement = parsed.addressComplement;
      }
    } catch (e) {
      console.error('Erro ao ler carrinho do localStorage:', e);
    }
  }

  // Salvar no localStorage
  function saveCart() {
    try {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify(state));
    } catch (e) {
      console.error('Erro ao salvar carrinho:', e);
    }
  }

  function formatMoney(val) {
    return 'R$ ' + Number(val || 0).toFixed(2).replace('.', ',');
  }

  function getSubtotal() {
    return state.items.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }

  function getDeliveryFee() {
    if (state.orderType === 'retirada') return 0;
    const subtotal = getSubtotal();
    if (subtotal >= CONFIG.freeDeliveryThreshold || subtotal === 0) return 0;
    return CONFIG.deliveryFee;
  }

  function getTotal() {
    return getSubtotal() + getDeliveryFee();
  }

  function getTotalCount() {
    return state.items.reduce((acc, it) => acc + it.quantity, 0);
  }

  function addItem(name, price) {
    name = (name || '').trim();
    price = parseFloat(price) || 0;
    if (!name || price <= 0) return;

    const existing = state.items.find(it => it.name.toLowerCase() === name.toLowerCase());
    if (existing) {
      existing.quantity += 1;
    } else {
      state.items.push({
        id: 'item_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        name: name,
        price: price,
        quantity: 1
      });
    }

    saveCart();
    renderCart();
    bumpBadges();
    showToast(`🍔 "${name}" adicionado ao carrinho!`);
  }

  function updateQuantity(id, delta) {
    const item = state.items.find(it => it.id === id);
    if (!item) return;

    item.quantity += delta;
    if (item.quantity <= 0) {
      state.items = state.items.filter(it => it.id !== id);
    }

    saveCart();
    renderCart();
  }

  function removeItem(id) {
    state.items = state.items.filter(it => it.id !== id);
    saveCart();
    renderCart();
  }

  function clearCart() {
    if (state.items.length === 0) return;
    if (confirm('Deseja realmente esvaziar seu carrinho?')) {
      state.items = [];
      saveCart();
      renderCart();
      showToast('Carrinho esvaziado.');
    }
  }

  function showToast(msg) {
    let container = document.getElementById('cart-toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'cart-toast-container';
      container.className = 'cart-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'cart-toast';
    toast.innerHTML = `
      <span>${msg}</span>
      <button style="background:transparent;border:none;color:#4ade80;cursor:pointer;font-weight:800;font-size:0.75rem;margin-left:auto;text-transform:uppercase;">Ver</button>
    `;
    toast.querySelector('button').addEventListener('click', () => {
      openDrawer();
      toast.remove();
    });

    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }

  function bumpBadges() {
    document.querySelectorAll('.cart-badge, .floating-cart-count').forEach(b => {
      b.classList.remove('bump');
      void b.offsetWidth;
      b.classList.add('bump');
    });
  }

  function openDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeDrawer() {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    if (drawer && overlay) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  function renderCart() {
    const count = getTotalCount();
    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();

    document.querySelectorAll('.cart-badge').forEach(el => {
      el.textContent = count;
      el.style.display = count > 0 ? 'inline-flex' : 'none';
    });

    const floatingCount = document.getElementById('floating-cart-count');
    if (floatingCount) floatingCount.textContent = count;

    const floatingTotal = document.getElementById('floating-cart-total');
    if (floatingTotal) {
      floatingTotal.textContent = count > 0 ? `• ${formatMoney(total)}` : '';
    }

    const drawerBody = document.getElementById('cart-drawer-body');
    const drawerFooter = document.getElementById('cart-drawer-footer');
    if (!drawerBody || !drawerFooter) return;

    if (state.items.length === 0) {
      drawerBody.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">🛒</div>
          <h4 class="cart-empty-title">Seu carrinho está vazio</h4>
          <p class="cart-empty-desc">Adicione hambúrgueres artesanais, pizzas e bebidas deliciosas do nosso cardápio!</p>
          <button class="cart-explore-btn" id="cart-explore-btn">Explorar Cardápio</button>
        </div>
      `;
      drawerFooter.style.display = 'none';

      const expBtn = document.getElementById('cart-explore-btn');
      if (expBtn) {
        expBtn.addEventListener('click', () => {
          closeDrawer();
          const menu = document.getElementById('menu') || document.querySelector('section[id="menu"]');
          if (menu) menu.scrollIntoView({ behavior: 'smooth' });
        });
      }
      return;
    }

    drawerFooter.style.display = 'flex';

    let itemsHtml = `
      <div class="cart-items-list">
        ${state.items.map(it => `
          <div class="cart-item" data-id="${it.id}">
            <div class="cart-item-info">
              <div class="cart-item-name">${escapeHtml(it.name)}</div>
              <div class="cart-item-unit-price">${formatMoney(it.price)} un.</div>
            </div>
            <div class="cart-item-actions">
              <div class="cart-qty-ctrl">
                <button class="cart-qty-btn cart-qty-minus" data-id="${it.id}" aria-label="Diminuir">-</button>
                <span class="cart-qty-val">${it.quantity}</span>
                <button class="cart-qty-btn cart-qty-plus" data-id="${it.id}" aria-label="Aumentar">+</button>
              </div>
              <div class="cart-item-total">${formatMoney(it.price * it.quantity)}</div>
              <button class="cart-item-del" data-id="${it.id}" title="Remover item" aria-label="Remover item">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
    `;

    let optionsHtml = `
      <div class="cart-section-box">
        <div class="cart-section-title">
          <span>🛵 Modo de Pedido</span>
        </div>
        <div class="cart-mode-toggle">
          <button class="cart-mode-btn ${state.orderType === 'entrega' ? 'active' : ''}" data-type="entrega">
            🛵 Entrega
          </button>
          <button class="cart-mode-btn ${state.orderType === 'retirada' ? 'active' : ''}" data-type="retirada">
            🛍️ Retirada
          </button>
        </div>

        <div class="cart-input-group">
          <input type="text" class="cart-input" id="cart-input-name" placeholder="Seu Nome completo *" value="${escapeHtml(state.clientName)}"/>
          <input type="tel" class="cart-input" id="cart-input-phone" placeholder="WhatsApp / Telefone *" value="${escapeHtml(state.clientPhone)}"/>
        </div>

        ${state.orderType === 'entrega' ? `
          <div class="cart-input-group" id="cart-address-fields">
            <div class="cart-input-row">
              <input type="text" class="cart-input" id="cart-input-street" placeholder="Rua / Avenida *" value="${escapeHtml(state.addressStreet)}"/>
              <input type="text" class="cart-input" id="cart-input-number" placeholder="Nº *" value="${escapeHtml(state.addressNumber)}"/>
            </div>
            <div class="cart-input-row">
              <input type="text" class="cart-input" id="cart-input-neighborhood" placeholder="Bairro *" value="${escapeHtml(state.addressNeighborhood)}"/>
              <input type="text" class="cart-input" id="cart-input-complement" placeholder="Apt / Bloco (opcional)" value="${escapeHtml(state.addressComplement)}"/>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="cart-section-box">
        <div class="cart-section-title">
          <span>💳 Forma de Pagamento</span>
        </div>
        <div class="cart-payment-options">
          <button class="cart-pay-btn ${state.paymentMethod === 'pix' ? 'active' : ''}" data-pay="pix">
            <span style="font-size:1.1rem">⚡</span>
            <span>PIX</span>
          </button>
          <button class="cart-pay-btn ${state.paymentMethod === 'cartao' ? 'active' : ''}" data-pay="cartao">
            <span style="font-size:1.1rem">💳</span>
            <span>Cartão</span>
          </button>
          <button class="cart-pay-btn ${state.paymentMethod === 'dinheiro' ? 'active' : ''}" data-pay="dinheiro">
            <span style="font-size:1.1rem">💵</span>
            <span>Dinheiro</span>
          </button>
        </div>
        ${state.paymentMethod === 'dinheiro' ? `
          <div class="cart-input-group" style="margin-top:8px">
            <input type="text" class="cart-input" id="cart-input-change" placeholder="Troco para quanto? (Ex: R$ 50,00)" value="${escapeHtml(state.cashChange)}"/>
          </div>
        ` : ''}
      </div>

      <div class="cart-section-box">
        <div class="cart-section-title">
          <span>📝 Observações do Pedido</span>
        </div>
        <textarea class="cart-input" id="cart-input-notes" rows="2" placeholder="Ex: Sem cebola, ponto da carne, molho à parte..." style="resize:none">${escapeHtml(state.notes)}</textarea>
      </div>
    `;

    drawerBody.innerHTML = itemsHtml + optionsHtml;

    const feeText = state.orderType === 'retirada' 
      ? '<span style="color:#4ade80">Grátis (Retirada)</span>' 
      : (deliveryFee === 0 ? '<span style="color:#4ade80">Grátis</span>' : formatMoney(deliveryFee));

    drawerFooter.innerHTML = `
      <div class="cart-summary-row">
        <span>Subtotal</span>
        <span>${formatMoney(subtotal)}</span>
      </div>
      <div class="cart-summary-row">
        <span>Taxa de Entrega</span>
        <span>${feeText}</span>
      </div>
      <div class="cart-summary-row total">
        <span>Total</span>
        <span class="cart-total-value">${formatMoney(total)}</span>
      </div>
      <button class="cart-checkout-btn" id="cart-checkout-btn">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
        </svg>
        <span>Finalizar no WhatsApp</span>
      </button>
      <button class="cart-clear-btn" id="cart-clear-btn">Esvaziar Carrinho</button>
    `;

    attachDrawerEvents(drawerBody, drawerFooter);
  }

  function escapeHtml(str) {
    if (!str) return '';
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function attachDrawerEvents(body, footer) {
    body.querySelectorAll('.cart-qty-minus').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(btn.dataset.id, -1));
    });
    body.querySelectorAll('.cart-qty-plus').forEach(btn => {
      btn.addEventListener('click', () => updateQuantity(btn.dataset.id, 1));
    });
    body.querySelectorAll('.cart-item-del').forEach(btn => {
      btn.addEventListener('click', () => removeItem(btn.dataset.id));
    });

    body.querySelectorAll('.cart-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.orderType = btn.dataset.type;
        saveCart();
        renderCart();
      });
    });

    const bindInput = (id, key) => {
      const el = body.querySelector('#' + id);
      if (el) {
        el.addEventListener('input', (e) => {
          state[key] = e.target.value;
          saveCart();
        });
      }
    };

    bindInput('cart-input-name', 'clientName');
    bindInput('cart-input-phone', 'clientPhone');
    bindInput('cart-input-street', 'addressStreet');
    bindInput('cart-input-number', 'addressNumber');
    bindInput('cart-input-neighborhood', 'addressNeighborhood');
    bindInput('cart-input-complement', 'addressComplement');
    bindInput('cart-input-change', 'cashChange');
    bindInput('cart-input-notes', 'notes');

    body.querySelectorAll('.cart-pay-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        state.paymentMethod = btn.dataset.pay;
        saveCart();
        renderCart();
      });
    });

    const checkoutBtn = footer.querySelector('#cart-checkout-btn');
    if (checkoutBtn) {
      checkoutBtn.addEventListener('click', handleCheckout);
    }

    const clearBtn = footer.querySelector('#cart-clear-btn');
    if (clearBtn) {
      clearBtn.addEventListener('click', clearCart);
    }
  }

  function handleCheckout() {
    if (state.items.length === 0) {
      alert('Seu carrinho está vazio!');
      return;
    }

    if (!state.clientName.trim()) {
      alert('Por favor, informe seu nome.');
      const nameInput = document.getElementById('cart-input-name');
      if (nameInput) nameInput.focus();
      return;
    }

    if (state.orderType === 'entrega') {
      if (!state.addressStreet.trim() || !state.addressNumber.trim()) {
        alert('Por favor, preencha o endereço de entrega (Rua e Número).');
        const stInput = document.getElementById('cart-input-street');
        if (stInput) stInput.focus();
        return;
      }
    }

    const subtotal = getSubtotal();
    const deliveryFee = getDeliveryFee();
    const total = getTotal();

    let msg = `🔥 *NOVO PEDIDO - FOGO E CHAPA* 🔥\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Cliente:* ${state.clientName.trim()}\n`;
    if (state.clientPhone.trim()) {
      msg += `📞 *Contato:* ${state.clientPhone.trim()}\n`;
    }
    msg += `🛵 *Tipo:* ${state.orderType === 'entrega' ? 'Entrega em domicílio' : 'Retirada no local'}\n`;

    if (state.orderType === 'entrega') {
      msg += `📍 *Endereço:* ${state.addressStreet.trim()}, Nº ${state.addressNumber.trim()}`;
      if (state.addressNeighborhood.trim()) msg += ` - ${state.addressNeighborhood.trim()}`;
      if (state.addressComplement.trim()) msg += ` (${state.addressComplement.trim()})`;
      msg += `\n`;
    }

    msg += `------------------------------------\n`;
    msg += `📋 *ITENS DO PEDIDO:*\n`;
    state.items.forEach(it => {
      msg += `• ${it.quantity}x ${it.name} (${formatMoney(it.price * it.quantity)})\n`;
    });

    if (state.notes && state.notes.trim()) {
      msg += `------------------------------------\n`;
      msg += `📝 *Observações:* ${state.notes.trim()}\n`;
    }

    const payNames = {
      'pix': 'PIX ⚡',
      'cartao': 'Cartão (na entrega) 💳',
      'dinheiro': 'Dinheiro 💵'
    };
    msg += `------------------------------------\n`;
    msg += `💳 *Forma de Pagamento:* ${payNames[state.paymentMethod] || state.paymentMethod}\n`;
    if (state.paymentMethod === 'dinheiro' && state.cashChange.trim()) {
      msg += `💵 *Troco para:* ${state.cashChange.trim()}\n`;
    }

    msg += `------------------------------------\n`;
    msg += `Subtotal: ${formatMoney(subtotal)}\n`;
    if (state.orderType === 'entrega') {
      msg += `Taxa de Entrega: ${deliveryFee === 0 ? 'GRÁTIS' : formatMoney(deliveryFee)}\n`;
    }
    msg += `*VALOR TOTAL: ${formatMoney(total)}*\n`;
    msg += `------------------------------------\n`;
    msg += `Obrigado por escolher o Fogo e Chapa! 🔥`;

    const encoded = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${CONFIG.whatsappNumber}?text=${encoded}`;

    window.open(whatsappUrl, '_blank');
  }

  // Injetar Botão de Carrinho no Header após hidratação
  function injectHeaderCartButton() {
    if (document.getElementById('header-cart-btn')) return;

    // Buscar container do Contact Us
    const buttons = Array.from(document.querySelectorAll('header button'));
    const contactBtn = buttons.find(b => b.textContent.includes('Contact Us'));

    const cartBtn = document.createElement('button');
    cartBtn.id = 'header-cart-btn';
    cartBtn.className = 'header-cart-btn';
    cartBtn.setAttribute('aria-label', 'Abrir Carrinho');
    cartBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="8" cy="21" r="1"/>
        <circle cx="19" cy="21" r="1"/>
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
      </svg>
      <span>Carrinho</span>
      <span class="cart-badge" style="display:none">0</span>
    `;

    cartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openDrawer();
    });

    if (contactBtn && contactBtn.parentNode) {
      const parent = contactBtn.parentNode;
      parent.classList.add('flex', 'items-center', 'gap-3');
      parent.insertBefore(cartBtn, contactBtn);
    } else {
      const headerContainer = document.querySelector('header > div');
      if (headerContainer) headerContainer.appendChild(cartBtn);
    }

    renderCart();
  }

  // Inicializar Componentes na Página
  function init() {
    loadCart();

    // 1. Injetar Drawer e Overlay no DOM se não existirem
    if (!document.getElementById('cart-drawer')) {
      const drawerHtml = `
        <div class="cart-overlay" id="cart-overlay"></div>
        <aside class="cart-drawer" id="cart-drawer" aria-label="Carrinho de Compras">
          <div class="cart-header">
            <div class="cart-header-title">
              <span>🔥</span>
              <span>Seu Pedido</span>
              <span class="cart-badge" style="margin-left:4px">0</span>
            </div>
            <button class="cart-close-btn" id="cart-close-btn" aria-label="Fechar Carrinho">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="cart-body" id="cart-drawer-body"></div>
          <div class="cart-footer" id="cart-drawer-footer"></div>
        </aside>

        <!-- Botão Flutuante (Mobile & Desktop) -->
        <button class="floating-cart-btn" id="floating-cart-btn" aria-label="Abrir Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="8" cy="21" r="1"/>
            <circle cx="19" cy="21" r="1"/>
            <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
          </svg>
          <span>Carrinho</span>
          <span class="floating-cart-count" id="floating-cart-count">0</span>
          <span id="floating-cart-total" style="font-size:0.85rem;opacity:0.9"></span>
        </button>
      `;

      const wrapper = document.createElement('div');
      wrapper.id = 'fogo-chapa-cart-root';
      wrapper.innerHTML = drawerHtml;
      document.body.appendChild(wrapper);
    }

    // 2. Eventos de abrir/fechar drawer
    const overlay = document.getElementById('cart-overlay');
    if (overlay) overlay.addEventListener('click', closeDrawer);

    const closeBtn = document.getElementById('cart-close-btn');
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    const floatingBtn = document.getElementById('floating-cart-btn');
    if (floatingBtn) floatingBtn.addEventListener('click', openDrawer);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrawer();
    });

    // 3. Injetar botão de carrinho no Header após um pequeno delay para não conflitar com hidratação
    setTimeout(injectHeaderCartButton, 500);

    // 4. Vincular botões "ORDER NOW +" das bebidas
    bindDrinksButtons();

    // 5. Vincular itens do CARDÁPIO (#menu)
    bindMenuItems();

    // 6. Vincular botões CTA
    bindCtaButtons();

    // Reexecutar bindings se o conteúdo renderizar assincronamente
    setTimeout(() => {
      injectHeaderCartButton();
      bindDrinksButtons();
      bindMenuItems();
      bindCtaButtons();
    }, 1500);

    // Render inicial
    renderCart();
  }

  function bindDrinksButtons() {
    const buttons = document.querySelectorAll('button');
    buttons.forEach(btn => {
      if (btn.textContent.includes('ORDER NOW +') && !btn.dataset.cartBound) {
        btn.dataset.cartBound = 'true';
        let titleEl = btn.parentElement ? btn.parentElement.querySelector('h3') : null;
        if (!titleEl) {
          const card = btn.closest('div[class*="flex"]');
          if (card) titleEl = card.querySelector('h3');
        }

        let drinkName = titleEl ? titleEl.innerText.replace(/\n/g, ' ').trim() : '';
        if (!drinkName) {
          const parentText = btn.parentElement ? btn.parentElement.innerText : '';
          for (let name of Object.keys(DRINKS_PRICES)) {
            if (parentText.toUpperCase().includes(name.toUpperCase())) {
              drinkName = name;
              break;
            }
          }
        }

        const price = DRINKS_PRICES[drinkName.toUpperCase()] || 7.00;

        btn.style.cursor = 'pointer';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          addItem(drinkName || 'Bebida Gelada', price);
        });
      }
    });
  }

  function bindMenuItems() {
    const itemRows = document.querySelectorAll('#menu .group, section .group');
    itemRows.forEach(row => {
      const text = row.innerText || '';
      if (text.includes('R$')) {
        const nameEl = row.querySelector('span');
        let itemName = nameEl ? nameEl.textContent.trim() : '';
        
        const priceMatch = text.match(/R\$\s*([0-9]+[,\.][0-9]{2})/);
        if (!priceMatch) return;
        const price = parseFloat(priceMatch[1].replace(',', '.'));

        if (!itemName) {
          itemName = text.split('R$')[0].replace(/[🌶️★♥]/g, '').trim();
        }

        const priceBadge = Array.from(row.querySelectorAll('span')).find(s => s.textContent.includes('R$'));
        if (priceBadge && !row.dataset.cartBound) {
          row.dataset.cartBound = 'true';
          row.classList.add('menu-item-clickable');

          const addBtn = document.createElement('button');
          addBtn.type = 'button';
          addBtn.className = 'menu-add-badge';
          addBtn.title = 'Adicionar ' + itemName + ' ao carrinho';
          addBtn.innerHTML = '+';
          addBtn.setAttribute('aria-label', 'Adicionar ' + itemName + ' ao carrinho');

          priceBadge.parentElement.appendChild(addBtn);

          addBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(itemName, price);
          });

          priceBadge.style.cursor = 'pointer';
          priceBadge.title = 'Clique para adicionar ao carrinho';
          priceBadge.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            addItem(itemName, price);
          });
        }
      }
    });
  }

  function bindCtaButtons() {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.ctaBound) return;
      const text = btn.textContent.trim().toUpperCase();
      if (text.includes('PEDIR AGORA') || text.includes('FAZER PEDIDO')) {
        btn.dataset.ctaBound = 'true';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          if (state.items.length > 0) {
            openDrawer();
          } else {
            const menu = document.getElementById('menu') || document.querySelector('section[id="menu"]');
            if (menu) menu.scrollIntoView({ behavior: 'smooth' });
          }
        });
      } else if (text.includes('VER CARDÁPIO') || text.includes('VIEW MENU') || text.includes('VIEW ALL MENU')) {
        btn.dataset.ctaBound = 'true';
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const menu = document.getElementById('menu') || document.querySelector('section[id="menu"]');
          if (menu) menu.scrollIntoView({ behavior: 'smooth' });
        });
      }
    });
  }

  window.FogoChapaCart = {
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    openDrawer,
    closeDrawer,
    getState: () => state
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
