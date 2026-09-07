/**
 * Fogo e Chapa - Carrinho de Compras v2.0
 */
(function () {
  const CONFIG = {
    whatsappNumber: '5585992585042',
    storageKey: 'fogo_chapa_cart_v1',
    deliveryFee: 5.00,
    freeDeliveryThreshold: 60.00,
    autoOpenOnAdd: true
  };

  const DRINKS_PRICES = {
    'COLA TRADICIONAL': 6.50,
    'SUCO DE LARANJA': 8.00,
    'LIMONADA SU\u00cdA': 9.00,
    'LIMONADA SUA': 9.00,
    'CHOPP GELADO': 12.00,
    'CH\u00c1 GELADO': 7.50,
    'CHA GELADO': 7.50,
    'GUARAN\u00c1 NATURAL': 6.50,
    'GUARANA NATURAL': 6.50,
    'CERVEJA': 10.00,
    'BEER': 10.00
  };

  let state = {
    items: [], orderType: 'entrega', paymentMethod: 'pix',
    clientName: '', clientPhone: '',
    addressStreet: '', addressNumber: '', addressNeighborhood: '', addressComplement: '',
    cashChange: '', notes: ''
  };

  let isDrawerOpen = false;

  function loadCart() {
    try {
      const saved = localStorage.getItem(CONFIG.storageKey);
      if (saved) {
        const p = JSON.parse(saved);
        if (Array.isArray(p.items)) state.items = p.items;
        ['orderType','paymentMethod','clientName','clientPhone','addressStreet','addressNumber','addressNeighborhood','addressComplement','notes'].forEach(k => { if (p[k]) state[k] = p[k]; });
      }
    } catch(e) {}
  }

  function saveCart() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); } catch(e) {}
  }

  function fmt(v) { return 'R$ ' + Number(v||0).toFixed(2).replace('.',','); }
  function getSubtotal() { return state.items.reduce((a,i) => a + i.price*i.quantity, 0); }
  function getDelivery() {
    if (state.orderType === 'retirada') return 0;
    const s = getSubtotal();
    return (s >= CONFIG.freeDeliveryThreshold || s === 0) ? 0 : CONFIG.deliveryFee;
  }
  function getTotal() { return getSubtotal() + getDelivery(); }
  function getCount() { return state.items.reduce((a,i) => a + i.quantity, 0); }

  function addItem(name, price) {
    name = (name||'').trim(); price = parseFloat(price)||0;
    if (!name || price <= 0) return;
    const ex = state.items.find(i => i.name.toLowerCase() === name.toLowerCase());
    if (ex) { ex.quantity += 1; }
    else { state.items.push({ id: 'i'+Date.now()+Math.random().toString(36).substr(2,4), name, price, quantity: 1 }); }
    saveCart(); renderCart(); bumpBadges();
    showToast('\uD83D\uDED2 "' + name + '" adicionado!');
    if (CONFIG.autoOpenOnAdd) setTimeout(openDrawer, 250);
  }

  function updateQuantity(id, delta) {
    const it = state.items.find(i => i.id === id);
    if (!it) return;
    it.quantity += delta;
    if (it.quantity <= 0) state.items = state.items.filter(i => i.id !== id);
    saveCart(); renderCart();
  }

  function removeItem(id) {
    state.items = state.items.filter(i => i.id !== id);
    saveCart(); renderCart();
  }

  function clearCart() {
    if (!state.items.length) return;
    if (confirm('Deseja esvaziar o carrinho?')) { state.items = []; saveCart(); renderCart(); showToast('Carrinho esvaziado.'); }
  }

  function clearCartSilent() { state.items = []; saveCart(); renderCart(); }

  function showToast(msg) {
    let c = document.getElementById('cart-toast-container');
    if (!c) { c = document.createElement('div'); c.id = 'cart-toast-container'; c.className = 'cart-toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div'); t.className = 'cart-toast'; t.textContent = msg;
    c.appendChild(t); setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  function bumpBadges() {
    const count = getCount(), total = getTotal();
    document.querySelectorAll('.cart-badge').forEach(b => { b.textContent = count; b.style.display = count > 0 ? 'inline-flex' : 'none'; });
    const fc = document.getElementById('floating-cart-count');
    if (fc) { fc.textContent = count; fc.style.display = count > 0 ? 'inline-flex' : 'none'; }
    const ft = document.getElementById('floating-cart-total');
    if (ft) ft.textContent = count > 0 ? fmt(total) : '';
    const fb = document.getElementById('floating-cart-btn');
    if (fb && count > 0) { fb.classList.add('cart-btn-pulse'); setTimeout(() => fb.classList.remove('cart-btn-pulse'), 600); }
  }

  function openDrawer() {
    const d = document.getElementById('cart-drawer'), o = document.getElementById('cart-overlay');
    if (d) { d.classList.add('open'); isDrawerOpen = true; }
    if (o) o.classList.add('open');
    document.body.style.overflow = 'hidden';
    renderCart();
  }

  function closeDrawer() {
    const d = document.getElementById('cart-drawer'), o = document.getElementById('cart-overlay');
    if (d) { d.classList.remove('open'); isDrawerOpen = false; }
    if (o) o.classList.remove('open');
    document.body.style.overflow = '';
  }

  function renderCart() { renderBody(); renderFooter(); bumpBadges(); }

  function renderBody() {
    const body = document.getElementById('cart-drawer-body');
    if (!body) return;

    if (!state.items.length) {
      body.innerHTML = `<div class="cart-empty"><div class="cart-empty-icon">\uD83D\uDED2</div><p class="cart-empty-title">Carrinho vazio</p><p class="cart-empty-sub">Adicione itens do card\u00e1pio para come\u00e7ar seu pedido!</p><button class="cart-explore-btn" onclick="closeDrawerAndGoMenu()">Ver Card\u00e1pio &rarr;</button></div>`;
      return;
    }

    const itemsHtml = state.items.map(it => `
      <div class="cart-item">
        <div class="cart-item-info">
          <div class="cart-item-name">${it.name}</div>
          <div class="cart-item-unit-price">${fmt(it.price)} / un.</div>
        </div>
        <div class="cart-item-actions">
          <div class="cart-qty-ctrl">
            <button class="cart-qty-btn" onclick="window.FogoChapaCart.updateQuantity('${it.id}',-1)">&minus;</button>
            <span class="cart-qty-val">${it.quantity}</span>
            <button class="cart-qty-btn" onclick="window.FogoChapaCart.updateQuantity('${it.id}',1)">+</button>
          </div>
          <span class="cart-item-total">${fmt(it.price * it.quantity)}</span>
          <button class="cart-item-del" onclick="window.FogoChapaCart.removeItem('${it.id}')">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </button>
        </div>
      </div>`).join('');

    const addrHtml = state.orderType === 'entrega' ? `
      <div class="cart-input-group">
        <input class="cart-input" placeholder="Rua / Avenida" value="${state.addressStreet}" oninput="window.FogoChapaCart._f('addressStreet',this.value)">
        <div class="cart-input-row">
          <input class="cart-input" placeholder="N\u00famero" value="${state.addressNumber}" oninput="window.FogoChapaCart._f('addressNumber',this.value)">
          <input class="cart-input" placeholder="Bairro" value="${state.addressNeighborhood}" oninput="window.FogoChapaCart._f('addressNeighborhood',this.value)">
        </div>
        <input class="cart-input" placeholder="Complemento (opcional)" value="${state.addressComplement}" oninput="window.FogoChapaCart._f('addressComplement',this.value)">
      </div>` : '';

    const cashHtml = state.paymentMethod === 'dinheiro' ? `<div class="cart-input-group"><input class="cart-input" placeholder="Troco para R$..." value="${state.cashChange}" oninput="window.FogoChapaCart._f('cashChange',this.value)"></div>` : '';

    body.innerHTML = `
      <div class="cart-items-list">${itemsHtml}</div>
      <div class="cart-section-box">
        <div class="cart-section-title">\uD83D\uDCE6 Tipo de pedido</div>
        <div class="cart-mode-toggle">
          <button class="cart-mode-btn ${state.orderType==='entrega'?'active':''}" onclick="window.FogoChapaCart._mode('entrega')">\uD83D\uDEF5 Entrega</button>
          <button class="cart-mode-btn ${state.orderType==='retirada'?'active':''}" onclick="window.FogoChapaCart._mode('retirada')">\uD83C\uDFAA Retirada</button>
        </div>${addrHtml}
      </div>
      <div class="cart-section-box">
        <div class="cart-section-title">\uD83D\uDC64 Seus dados</div>
        <div class="cart-input-group">
          <input class="cart-input" placeholder="Seu nome" value="${state.clientName}" oninput="window.FogoChapaCart._f('clientName',this.value)">
          <input class="cart-input" placeholder="WhatsApp" value="${state.clientPhone}" oninput="window.FogoChapaCart._f('clientPhone',this.value)">
        </div>
      </div>
      <div class="cart-section-box">
        <div class="cart-section-title">\uD83D\uDCB3 Pagamento</div>
        <div class="cart-payment-options">
          <button class="cart-pay-btn ${state.paymentMethod==='pix'?'active':''}" onclick="window.FogoChapaCart._pay('pix')">\uD83D\uDCB8 PIX</button>
          <button class="cart-pay-btn ${state.paymentMethod==='cartao'?'active':''}" onclick="window.FogoChapaCart._pay('cartao')">\uD83D\uDCB3 Cart\u00e3o</button>
          <button class="cart-pay-btn ${state.paymentMethod==='dinheiro'?'active':''}" onclick="window.FogoChapaCart._pay('dinheiro')">\uD83D\uDCB5 Dinheiro</button>
        </div>${cashHtml}
      </div>
      <div class="cart-section-box">
        <div class="cart-section-title">\uD83D\uDCDD Observa\u00e7\u00f5es</div>
        <textarea class="cart-input" rows="2" placeholder="Sem cebola, ponto da carne..." style="resize:none" oninput="window.FogoChapaCart._f('notes',this.value)">${state.notes}</textarea>
      </div>`;
  }

  function renderFooter() {
    const footer = document.getElementById('cart-drawer-footer');
    if (!footer) return;
    if (!state.items.length) { footer.innerHTML = ''; return; }
    const sub = getSubtotal(), del = getDelivery(), tot = getTotal(), cnt = getCount();
    const left = CONFIG.freeDeliveryThreshold - sub;
    const freeMsg = del > 0 && left > 0
      ? `<div style="background:rgba(0,161,68,.12);border:1px solid rgba(0,161,68,.25);border-radius:10px;padding:10px 14px;font-size:.8rem;color:#4ade80;text-align:center;font-weight:700;">\uD83C\uDF81 Mais ${fmt(left)} para frete gr\u00e1tis!</div>`
      : del===0 && sub>0
        ? `<div style="background:rgba(0,161,68,.12);border:1px solid rgba(0,161,68,.25);border-radius:10px;padding:10px 14px;font-size:.8rem;color:#4ade80;text-align:center;font-weight:700;">\u2728 Frete gr\u00e1tis aplicado!</div>`
        : '';
    const delRow = state.orderType==='entrega'
      ? `<div class="cart-summary-row"><span>Entrega</span><span>${del===0?'<span style="color:#4ade80">Gr\u00e1tis</span>':fmt(del)}</span></div>`
      : `<div class="cart-summary-row"><span>Retirada no local</span><span style="color:#4ade80">\u2713</span></div>`;
    footer.innerHTML = `
      ${freeMsg}
      <div class="cart-summary-row"><span>Subtotal (${cnt} ${cnt===1?'item':'itens'})</span><span>${fmt(sub)}</span></div>
      ${delRow}
      <div class="cart-summary-row total"><span>Total</span><span class="cart-total-value">${fmt(tot)}</span></div>
      <a href="${buildWALink()}" target="_blank" rel="noopener" class="cart-checkout-btn" onclick="setTimeout(()=>window.FogoChapaCart.clearCartSilent(),500)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.103 1.522 5.83L.057 23.886a.5.5 0 0 0 .611.61l6.217-1.492A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.596 9.596 0 0 1-4.87-1.327l-.35-.206-3.626.87.906-3.51-.228-.362A9.56 9.56 0 0 1 2.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z"/></svg>
        Finalizar pelo WhatsApp
      </a>
      <button class="cart-clear-btn" onclick="window.FogoChapaCart.clearCart()">Esvaziar carrinho</button>`;
  }

  function buildWALink() {
    const sub = getSubtotal(), del = getDelivery(), tot = getTotal();
    let msg = '*\uD83D\uDD25 Novo Pedido \u2014 Fogo e Chapa*\n\n';
    if (state.clientName) msg += `\uD83D\uDC64 *Cliente:* ${state.clientName}\n`;
    if (state.clientPhone) msg += `\uD83D\uDCF1 *Telefone:* ${state.clientPhone}\n`;
    msg += '\n*\uD83D\uDCCB Itens do Pedido:*\n';
    state.items.forEach(it => { msg += `\u2022 ${it.quantity}x ${it.name} \u2014 ${fmt(it.price*it.quantity)}\n`; });
    msg += `\n*Subtotal:* ${fmt(sub)}\n`;
    if (state.orderType==='entrega') msg += `*Entrega:* ${del===0?'Gr\u00e1tis \uD83C\uDF89':fmt(del)}\n`;
    msg += `*TOTAL: ${fmt(tot)}*\n\n`;
    if (state.orderType==='entrega') {
      msg += '\uD83D\uDEF5 *Entrega*\n';
      if (state.addressStreet) msg += `\uD83D\uDCCD ${state.addressStreet}, ${state.addressNumber}`;
      if (state.addressNeighborhood) msg += ` \u2014 ${state.addressNeighborhood}`;
      if (state.addressComplement) msg += ` (${state.addressComplement})`;
      msg += '\n';
    } else { msg += '\uD83C\uDFEA *Retirada no local*\n'; }
    const pLabels = { pix:'PIX \uD83D\uDCB8', cartao:'Cart\u00e3o \uD83D\uDCB3', dinheiro:'Dinheiro \uD83D\uDCB5' };
    msg += `\n\uD83D\uDCB3 *Pagamento:* ${pLabels[state.paymentMethod]||state.paymentMethod}`;
    if (state.paymentMethod==='dinheiro'&&state.cashChange) msg += ` (troco para R$ ${state.cashChange})`;
    if (state.notes) msg += `\n\n\uD83D\uDCDD *Obs:* ${state.notes}`;
    return 'https://wa.me/'+CONFIG.whatsappNumber+'?text='+encodeURIComponent(msg);
  }

  function injectHeaderCartButton() {
    if (document.getElementById('header-cart-btn')) return;
    const contactBtn = document.querySelector('header button');
    if (!contactBtn) return;
    const btn = document.createElement('button');
    btn.id = 'header-cart-btn';
    btn.className = 'inline-flex shrink-0 items-center justify-center gap-2 duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow-fire hover:-translate-y-0.5 h-11 text-sm rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 transition-colors relative';
    btn.setAttribute('aria-label','Carrinho de compras');
    btn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg><span>Carrinho</span><span class="cart-badge" style="display:none;position:absolute;top:-6px;right:-6px;background:#00A144;color:#fff;border-radius:9999px;min-width:20px;height:20px;font-size:.7rem;font-weight:900;align-items:center;justify-content:center;padding:0 4px;">0</span>`;
    btn.addEventListener('click', e => { e.preventDefault(); openDrawer(); });
    if (contactBtn.parentNode) {
      contactBtn.parentNode.classList.add('flex','items-center','gap-3');
      contactBtn.parentNode.insertBefore(btn, contactBtn);
    } else {
      const hd = document.querySelector('header > div'); if (hd) hd.appendChild(btn);
    }
    renderCart();
  }

  function bindDrinksButtons() {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.textContent.includes('ORDER NOW +') || btn.dataset.cartBound) return;
      btn.dataset.cartBound = 'true';
      let h3 = btn.parentElement && btn.parentElement.querySelector('h3');
      if (!h3) { const c = btn.closest('div[class*="flex"]'); if (c) h3 = c.querySelector('h3'); }
      let name = h3 ? h3.innerText.replace(/\n/g,' ').trim() : '';
      if (!name) { const t = btn.parentElement ? btn.parentElement.innerText : ''; for (let k of Object.keys(DRINKS_PRICES)) { if (t.toUpperCase().includes(k)) { name=k; break; } } }
      const price = DRINKS_PRICES[name.toUpperCase()] || 7.00;
      btn.style.cursor = 'pointer';
      btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name||'Bebida Gelada', price); });
    });
  }

  function bindMenuItems() {
    document.querySelectorAll('#menu .group, section .group').forEach(row => {
      const text = row.innerText || '';
      if (!text.includes('R$') || row.dataset.cartBound) return;
      const nameEl = row.querySelector('span');
      let name = nameEl ? nameEl.textContent.trim() : '';
      const m = text.match(/R\$\s*([0-9]+[,\.][0-9]{2})/);
      if (!m) return;
      const price = parseFloat(m[1].replace(',','.'));
      if (!name) name = text.split('R$')[0].replace(/[^\w\s\-\u00c0-\u00ff]/g,'').trim();
      const badge = Array.from(row.querySelectorAll('span')).find(s => s.textContent.includes('R$'));
      if (!badge) return;
      row.dataset.cartBound = 'true';
      row.classList.add('menu-item-clickable');
      const addBtn = document.createElement('button');
      addBtn.type = 'button'; addBtn.className = 'menu-add-badge'; addBtn.innerHTML = '+';
      addBtn.title = 'Adicionar '+name+' ao carrinho';
      addBtn.setAttribute('aria-label','Adicionar '+name+' ao carrinho');
      badge.parentElement.appendChild(addBtn);
      addBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name, price); });
      badge.style.cursor = 'pointer';
      badge.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name, price); });
    });
  }

  function bindCtaButtons() {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.ctaBound) return;
      const t = btn.textContent.trim().toUpperCase();
      if (t.includes('PEDIR AGORA')||t.includes('FAZER PEDIDO')) {
        btn.dataset.ctaBound='true';
        btn.addEventListener('click', e => { e.preventDefault(); state.items.length > 0 ? openDrawer() : scrollToMenu(); });
      } else if (t.includes('VIEW MENU')||t.includes('VIEW ALL MENU')||t.includes('VER CARD')) {
        btn.dataset.ctaBound='true';
        btn.addEventListener('click', e => { e.preventDefault(); scrollToMenu(); });
      }
    });
  }

  function scrollToMenu() {
    const m = document.getElementById('menu'); if (m) m.scrollIntoView({behavior:'smooth'});
  }

  window.closeDrawerAndGoMenu = function() { closeDrawer(); setTimeout(scrollToMenu, 300); };

  window.FogoChapaCart = {
    addItem, updateQuantity, removeItem, clearCart, clearCartSilent,
    openDrawer, closeDrawer,
    _mode(m) { state.orderType=m; saveCart(); renderCart(); },
    _pay(m) { state.paymentMethod=m; saveCart(); renderCart(); },
    _f(k,v) { state[k]=v; saveCart(); },
    getState: () => state
  };

  function init() {
    loadCart();
    if (!document.getElementById('cart-drawer')) {
      const w = document.createElement('div'); w.id='fogo-chapa-cart-root';
      w.innerHTML = `
        <div class="cart-overlay" id="cart-overlay"></div>
        <aside class="cart-drawer" id="cart-drawer" aria-label="Carrinho de Compras">
          <div class="cart-header">
            <div class="cart-header-title"><span>\uD83D\uDED2</span><span>Seu Pedido</span><span class="cart-badge" style="margin-left:4px">0</span></div>
            <button class="cart-close-btn" id="cart-close-btn" aria-label="Fechar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="cart-body" id="cart-drawer-body"></div>
          <div class="cart-footer" id="cart-drawer-footer"></div>
        </aside>
        <button class="floating-cart-btn" id="floating-cart-btn" aria-label="Abrir Carrinho">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
          <span>Carrinho</span>
          <span class="floating-cart-count" id="floating-cart-count" style="display:none">0</span>
          <span id="floating-cart-total" style="font-size:.85rem;opacity:.9"></span>
        </button>`;
      document.body.appendChild(w);
    }
    const ov = document.getElementById('cart-overlay'); if (ov) ov.addEventListener('click', closeDrawer);
    const cb = document.getElementById('cart-close-btn'); if (cb) cb.addEventListener('click', closeDrawer);
    const fb = document.getElementById('floating-cart-btn'); if (fb) fb.addEventListener('click', openDrawer);
    document.addEventListener('keydown', e => { if (e.key==='Escape') closeDrawer(); });
    setTimeout(injectHeaderCartButton, 500);
    bindDrinksButtons(); bindMenuItems(); bindCtaButtons();
    setTimeout(() => { injectHeaderCartButton(); bindDrinksButtons(); bindMenuItems(); bindCtaButtons(); }, 1500);
    renderCart();
  }

  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
