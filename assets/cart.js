/**
 * Fogo e Chapa - Cart v4.0 | Inter font | No emojis | PIX/Nubank/Cartão icons
 */
(function () {
  const CONFIG = {
    whatsappNumber: '5585992585042',
    storageKey: 'fogo_chapa_cart_v2',
    deliveryFee: 5.00,
    freeDeliveryThreshold: 60.00,
    autoOpenOnAdd: true
  };

  const DRINKS_PRICES = {
    'COLA TRADICIONAL':6.50,'SUCO DE LARANJA':8.00,'LIMONADA SU\u00cdA':9.00,
    'LIMONADA SUA':9.00,'CHOPP GELADO':12.00,'CH\u00c1 GELADO':7.50,
    'CHA GELADO':7.50,'GUARAN\u00c1 NATURAL':6.50,'GUARANA NATURAL':6.50,
    'CERVEJA':10.00,'BEER':10.00
  };

  const PAYMENT_CONFIG = {
    pix:    { name:'PIX',            sub:'Pague agora' },
    nubank: { name:'Nubank',         sub:'Pagamento pelo app Nubank' },
    cartao: { name:'Cart\u00e3o de cr\u00e9dito', sub:'Aceitamos as principais bandeiras' }
  };

  let state = {
    items:[], orderType:'entrega', paymentMethod:'pix',
    clientName:'', clientPhone:'',
    addressStreet:'', addressNumber:'', addressNeighborhood:'', addressComplement:'',
    cashChange:'', notes:''
  };

  /* SVG Icons */
  const ICON = {
    cart: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    close: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    trash: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>',
    delivery: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>',
    pickup: '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    user: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
    payment: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    note: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',
    emptyCart: '<svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
    pixSvg: '<svg width="22" height="22" viewBox="0 0 512 512" fill="none"><path d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.384 14.765-5.38 20.145 0l76.989 76.989c14.192 14.192 33.064 22 53.12 22h15.138l-97.127 97.127c-29.355 29.354-76.95 29.354-106.306 0l-97.422-97.424h6.65z" fill="#32BCAD"/><path d="M392.637 120.81c-20.056 0-38.928 7.808-53.12 22l-76.989 76.989c-5.569 5.568-14.576 5.568-20.145 0l-76.693-76.693c-14.192-14.192-33.064-22-53.12-22h-6.65l97.422-97.422c29.354-29.354 76.95-29.354 106.305 0l97.127 97.127h-14.137z" fill="#32BCAD"/><path d="M497.427 209.694l-56.837-56.838h-47.953c-13.576 0-26.613 5.467-36.13 15.13l-76.989 76.989c-7.5 7.5-17.342 11.25-27.185 11.25s-19.685-3.75-27.185-11.25l-76.693-76.693c-9.517-9.663-22.554-15.13-36.13-15.13H76.41L19.573 209.694c-29.354 29.355-29.354 76.95 0 106.306l56.837 56.837h47.218c13.576 0 26.613-5.467 36.13-15.13l76.693-76.692c14.563-14.563 40.807-14.563 55.37 0l76.989 76.989c9.517 9.663 22.554 15.13 36.13 15.13h47.953l56.837-56.837c29.206-29.356 29.206-76.951-.303-106.603z" fill="#32BCAD"/></svg>',
    nubankSvg: '<svg width="22" height="22" viewBox="0 0 100 100" fill="none"><rect width="100" height="100" rx="50" fill="#8A05BE"/><text x="50" y="62" text-anchor="middle" font-family="Inter,sans-serif" font-weight="900" font-size="38" fill="white">nu</text></svg>',
    cardSvg: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4F6CF6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    wa: '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.116.553 4.103 1.522 5.83L.057 23.886a.5.5 0 0 0 .611.61l6.217-1.492A11.94 11.94 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.6a9.596 9.596 0 0 1-4.87-1.327l-.35-.206-3.626.87.906-3.51-.228-.362A9.56 9.56 0 0 1 2.4 12C2.4 6.698 6.698 2.4 12 2.4S21.6 6.698 21.6 12 17.302 21.6 12 21.6z"/></svg>'
  };

  function loadCart() {
    try {
      const s = localStorage.getItem(CONFIG.storageKey);
      if (s) {
        const p = JSON.parse(s);
        if (Array.isArray(p.items)) state.items = p.items;
        ['orderType','paymentMethod','clientName','clientPhone',
         'addressStreet','addressNumber','addressNeighborhood','addressComplement','notes'
        ].forEach(k => { if (p[k]) state[k] = p[k]; });
      }
    } catch(e) {}
  }

  function saveCart() {
    try { localStorage.setItem(CONFIG.storageKey, JSON.stringify(state)); } catch(e) {}
  }

  function fmt(v) { return 'R$\u00a0' + Number(v||0).toFixed(2).replace('.',','); }
  function sub()   { return state.items.reduce((a,i) => a + i.price*i.quantity, 0); }
  function del()   { if(state.orderType==='retirada') return 0; const s=sub(); return (s>=CONFIG.freeDeliveryThreshold||s===0)?0:CONFIG.deliveryFee; }
  function tot()   { return sub()+del(); }
  function cnt()   { return state.items.reduce((a,i) => a+i.quantity, 0); }

  function addItem(name, price) {
    name = (name||'').trim(); price = parseFloat(price)||0;
    if (!name||price<=0) return;
    const ex = state.items.find(i => i.name.toLowerCase()===name.toLowerCase());
    if (ex) ex.quantity+=1;
    else state.items.push({id:'i'+Date.now()+Math.random().toString(36).substr(2,4), name, price, quantity:1});
    saveCart(); renderCart(); bumpBadges();
    showToast('Adicionado: ' + name);
    if (CONFIG.autoOpenOnAdd) setTimeout(openDrawer, 250);
  }

  function updateQuantity(id, delta) {
    const it = state.items.find(i => i.id===id);
    if (!it) return;
    it.quantity += delta;
    if (it.quantity<=0) state.items = state.items.filter(i => i.id!==id);
    saveCart(); renderCart();
  }

  function removeItem(id) {
    state.items = state.items.filter(i => i.id!==id);
    saveCart(); renderCart();
  }

  function clearCart() {
    if (!state.items.length) return;
    if (confirm('Esvaziar o carrinho?')) { state.items=[]; saveCart(); renderCart(); showToast('Carrinho esvaziado.'); }
  }

  function clearCartSilent() { state.items=[]; saveCart(); renderCart(); }

  function showToast(msg) {
    let c = document.getElementById('cart-toast-container');
    if (!c) { c=document.createElement('div'); c.id='cart-toast-container'; c.className='cart-toast-container'; document.body.appendChild(c); }
    const t = document.createElement('div'); t.className='cart-toast';
    t.innerHTML = '<span class="cart-toast-dot"></span>' + msg;
    c.appendChild(t);
    setTimeout(() => { if (t.parentNode) t.parentNode.removeChild(t); }, 3200);
  }

  function bumpBadges() {
    const c=cnt(), t=tot();
    document.querySelectorAll('.cart-badge').forEach(b => { b.textContent=c; b.style.display=c>0?'inline-flex':'none'; });
    const fc=document.getElementById('floating-cart-count');
    if(fc){ fc.textContent=c; fc.style.display=c>0?'inline-flex':'none'; }
    const ft=document.getElementById('floating-cart-total');
    if(ft) ft.textContent=c>0?fmt(t):'';
    const fb=document.getElementById('floating-cart-btn');
    if(fb&&c>0){ fb.classList.add('cart-btn-pulse'); setTimeout(()=>fb.classList.remove('cart-btn-pulse'),600); }
  }

  function openDrawer() {
    const d=document.getElementById('cart-drawer'), o=document.getElementById('cart-overlay');
    if(d){d.classList.add('open');}
    if(o) o.classList.add('open');
    document.body.style.overflow='hidden';
    renderCart();
  }

  function closeDrawer() {
    const d=document.getElementById('cart-drawer'), o=document.getElementById('cart-overlay');
    if(d) d.classList.remove('open');
    if(o) o.classList.remove('open');
    document.body.style.overflow='';
  }

  function renderCart() { renderBody(); renderFooter(); bumpBadges(); }

  function renderBody() {
    const body = document.getElementById('cart-drawer-body');
    if (!body) return;

    if (!state.items.length) {
      body.innerHTML = `
        <div class="cart-empty">
          <div class="cart-empty-icon">${ICON.emptyCart}</div>
          <p class="cart-empty-title">Carrinho vazio</p>
          <p class="cart-empty-sub">Adicione itens do card\u00e1pio para come\u00e7ar seu pedido.</p>
          <button class="cart-explore-btn" onclick="window.closeDrawerAndGoMenu()">Ver Card\u00e1pio</button>
        </div>`;
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
          <span class="cart-item-total">${fmt(it.price*it.quantity)}</span>
          <button class="cart-item-del" onclick="window.FogoChapaCart.removeItem('${it.id}')" aria-label="Remover">${ICON.trash}</button>
        </div>
      </div>`).join('');

    const addrHtml = state.orderType==='entrega' ? `
      <div class="cart-input-group">
        <input class="cart-input" placeholder="Rua / Avenida" value="${state.addressStreet}" oninput="window.FogoChapaCart._f('addressStreet',this.value)">
        <div class="cart-input-row">
          <input class="cart-input" placeholder="N\u00famero" value="${state.addressNumber}" oninput="window.FogoChapaCart._f('addressNumber',this.value)">
          <input class="cart-input" placeholder="Bairro" value="${state.addressNeighborhood}" oninput="window.FogoChapaCart._f('addressNeighborhood',this.value)">
        </div>
        <input class="cart-input" placeholder="Complemento (opcional)" value="${state.addressComplement}" oninput="window.FogoChapaCart._f('addressComplement',this.value)">
      </div>` : '';

    const payRows = Object.entries(PAYMENT_CONFIG).map(([key, cfg]) => {
      const icons = { pix: ICON.pixSvg, nubank: ICON.nubankSvg, cartao: ICON.cardSvg };
      const iconClass = { pix: 'pay-icon-pix', nubank: 'pay-icon-nubank', cartao: 'pay-icon-card' };
      const active = state.paymentMethod===key ? 'active' : '';
      return `
        <div class="cart-pay-row ${active}" onclick="window.FogoChapaCart._pay('${key}')">
          <div class="cart-pay-icon ${iconClass[key]}">${icons[key]}</div>
          <div class="cart-pay-text">
            <div class="cart-pay-name">${cfg.name}</div>
            <div class="cart-pay-sub">${cfg.sub}</div>
          </div>
          <div class="cart-pay-radio"></div>
        </div>`;
    }).join('');

    body.innerHTML = `
      <div class="cart-items-list">${itemsHtml}</div>

      <div class="cart-section-box">
        <div class="cart-section-title">${ICON.delivery} Tipo de pedido</div>
        <div class="cart-mode-toggle">
          <button class="cart-mode-btn ${state.orderType==='entrega'?'active':''}" onclick="window.FogoChapaCart._mode('entrega')">${ICON.delivery} Entrega</button>
          <button class="cart-mode-btn ${state.orderType==='retirada'?'active':''}" onclick="window.FogoChapaCart._mode('retirada')">${ICON.pickup} Retirada</button>
        </div>${addrHtml}
      </div>

      <div class="cart-section-box">
        <div class="cart-section-title">${ICON.user} Seus dados</div>
        <div class="cart-input-group">
          <input class="cart-input" placeholder="Seu nome" value="${state.clientName}" oninput="window.FogoChapaCart._f('clientName',this.value)">
          <input class="cart-input" placeholder="WhatsApp" value="${state.clientPhone}" oninput="window.FogoChapaCart._f('clientPhone',this.value)">
        </div>
      </div>

      <div class="cart-section-box">
        <div class="cart-section-title">${ICON.payment} Pagamento</div>
        <div class="cart-payment-list">${payRows}</div>
      </div>

      <div class="cart-section-box">
        <div class="cart-section-title">${ICON.note} Observa\u00e7\u00f5es</div>
        <textarea class="cart-input" rows="2" placeholder="Sem cebola, ponto da carne..." style="resize:none" oninput="window.FogoChapaCart._f('notes',this.value)">${state.notes}</textarea>
      </div>`;
  }

  function renderFooter() {
    const footer = document.getElementById('cart-drawer-footer');
    if (!footer) return;
    if (!state.items.length) { footer.innerHTML=''; return; }

    const s=sub(), d=del(), t=tot(), c=cnt();
    const left = CONFIG.freeDeliveryThreshold - s;
    const freeBar = d>0&&left>0
      ? `<div class="cart-free-bar">Mais ${fmt(left)} para frete gr\u00e1tis</div>`
      : d===0&&s>0 ? `<div class="cart-free-bar" style="color:#4ade80">Frete gr\u00e1tis aplicado</div>` : '';

    const delRow = state.orderType==='entrega'
      ? `<div class="cart-summary-row"><span>Entrega</span><span>${d===0?'<span style="color:#4ade80">Gr\u00e1tis</span>':fmt(d)}</span></div>`
      : `<div class="cart-summary-row"><span>Retirada no local</span><span style="color:#4ade80">&#x2713;</span></div>`;

    footer.innerHTML = `
      ${freeBar}
      <div class="cart-summary-row"><span>Subtotal (${c} ${c===1?'item':'itens'})</span><span>${fmt(s)}</span></div>
      ${delRow}
      <div class="cart-summary-row total"><span>Total</span><span class="cart-total-value">${fmt(t)}</span></div>
      <a href="${buildWALink()}" target="_blank" rel="noopener" class="cart-checkout-btn" onclick="setTimeout(()=>window.FogoChapaCart.clearCartSilent(),500)">
        ${ICON.wa} Finalizar pelo WhatsApp
      </a>
      <button class="cart-clear-btn" onclick="window.FogoChapaCart.clearCart()">Esvaziar carrinho</button>`;
  }

  function buildWALink() {
    const s=sub(), d=del(), t=tot();
    let msg = '*Novo Pedido \u2014 Fogo e Chapa*\n\n';
    if (state.clientName) msg += `Cliente: ${state.clientName}\n`;
    if (state.clientPhone) msg += `Telefone: ${state.clientPhone}\n`;
    msg += '\nItens:\n';
    state.items.forEach(it => { msg += `- ${it.quantity}x ${it.name} \u2014 ${fmt(it.price*it.quantity)}\n`; });
    msg += `\nSubtotal: ${fmt(s)}\n`;
    if (state.orderType==='entrega') msg += `Entrega: ${d===0?'Gr\u00e1tis':fmt(d)}\n`;
    msg += `*Total: ${fmt(t)}*\n\n`;
    if (state.orderType==='entrega') {
      msg += 'Entrega\n';
      if (state.addressStreet) msg += `${state.addressStreet}, ${state.addressNumber}`;
      if (state.addressNeighborhood) msg += ` \u2014 ${state.addressNeighborhood}`;
      if (state.addressComplement) msg += ` (${state.addressComplement})`;
      msg += '\n';
    } else { msg += 'Retirada no local\n'; }
    const pLabel = {pix:'PIX', nubank:'Nubank', cartao:'Cart\u00e3o de cr\u00e9dito'};
    msg += `\nPagamento: ${pLabel[state.paymentMethod]||state.paymentMethod}`;
    if (state.notes) msg += `\n\nObs: ${state.notes}`;
    return 'https://wa.me/'+CONFIG.whatsappNumber+'?text='+encodeURIComponent(msg);
  }

  function injectHeaderCartButton() {
    if (document.getElementById('header-cart-btn')) return;
    const contactBtn = document.querySelector('header button');
    if (!contactBtn) return;
    const btn = document.createElement('button');
    btn.id='header-cart-btn';
    btn.className='inline-flex shrink-0 items-center justify-center gap-2 duration-300 focus-visible:outline-none disabled:pointer-events-none shadow-fire hover:-translate-y-0.5 h-11 text-sm rounded-full bg-transparent text-white border-2 border-white hover:bg-white hover:text-black font-bold px-6 transition-colors relative';
    btn.setAttribute('aria-label','Carrinho');
    btn.innerHTML = ICON.cart + '<span>Carrinho</span><span class="cart-badge" style="display:none;position:absolute;top:-6px;right:-6px">0</span>';
    btn.addEventListener('click', e => { e.preventDefault(); openDrawer(); });
    if (contactBtn.parentNode) {
      contactBtn.parentNode.classList.add('flex','items-center','gap-3');
      contactBtn.parentNode.insertBefore(btn, contactBtn);
    }
    renderCart();
  }

  function bindDrinksButtons() {
    document.querySelectorAll('button').forEach(btn => {
      if (!btn.textContent.includes('ORDER NOW +') || btn.dataset.cartBound) return;
      btn.dataset.cartBound='true';
      let h3 = btn.parentElement&&btn.parentElement.querySelector('h3');
      if (!h3) { const c=btn.closest('div[class*="flex"]'); if(c) h3=c.querySelector('h3'); }
      let name = h3 ? h3.innerText.replace(/\n/g,' ').trim() : '';
      if (!name) { const t=btn.parentElement?btn.parentElement.innerText:''; for(let k of Object.keys(DRINKS_PRICES)){if(t.toUpperCase().includes(k)){name=k;break;}} }
      const price=DRINKS_PRICES[name.toUpperCase()]||7.00;
      btn.style.cursor='pointer';
      btn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name||'Bebida Gelada',price); });
    });
  }

  function bindMenuItems() {
    document.querySelectorAll('#menu .group, section .group').forEach(row => {
      const text=row.innerText||'';
      if (!text.includes('R$')||row.dataset.cartBound) return;
      const nameEl=row.querySelector('span');
      let name=nameEl?nameEl.textContent.trim():'';
      const m=text.match(/R\$\s*([0-9]+[,\.][0-9]{2})/);
      if (!m) return;
      const price=parseFloat(m[1].replace(',','.'));
      if (!name) name=text.split('R$')[0].replace(/[^\w\s\-\u00c0-\u00ff]/g,'').trim();
      const badge=Array.from(row.querySelectorAll('span')).find(s=>s.textContent.includes('R$'));
      if (!badge) return;
      row.dataset.cartBound='true'; row.classList.add('menu-item-clickable');
      const addBtn=document.createElement('button');
      addBtn.type='button'; addBtn.className='menu-add-badge'; addBtn.innerHTML='+';
      addBtn.title='Adicionar '+name; addBtn.setAttribute('aria-label','Adicionar '+name);
      badge.parentElement.appendChild(addBtn);
      addBtn.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name,price); });
      badge.style.cursor='pointer';
      badge.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); addItem(name,price); });
    });
  }

  function bindCtaButtons() {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.dataset.ctaBound) return;
      const t=btn.textContent.trim().toUpperCase();
      if (t.includes('PEDIR AGORA')||t.includes('FAZER PEDIDO')) {
        btn.dataset.ctaBound='true';
        btn.addEventListener('click', e => { e.preventDefault(); state.items.length>0?openDrawer():scrollToMenu(); });
      } else if (t.includes('VIEW MENU')||t.includes('VIEW ALL MENU')||t.includes('VER CARD')) {
        btn.dataset.ctaBound='true';
        btn.addEventListener('click', e => { e.preventDefault(); scrollToMenu(); });
      }
    });
  }

  function scrollToMenu() { const m=document.getElementById('menu'); if(m) m.scrollIntoView({behavior:'smooth'}); }
  window.closeDrawerAndGoMenu = function() { closeDrawer(); setTimeout(scrollToMenu, 300); };

  window.FogoChapaCart = {
    addItem, updateQuantity, removeItem, clearCart, clearCartSilent,
    openDrawer, closeDrawer,
    _mode(m) { state.orderType=m; saveCart(); renderCart(); },
    _pay(m)  { state.paymentMethod=m; saveCart(); renderCart(); },
    _f(k,v)  { state[k]=v; saveCart(); },
    getState: ()=>state
  };

  function init() {
    loadCart();
    if (!document.getElementById('cart-drawer')) {
      const w=document.createElement('div'); w.id='fogo-chapa-cart-root';
      w.innerHTML=`
        <div class="cart-overlay" id="cart-overlay"></div>
        <aside class="cart-drawer" id="cart-drawer" aria-label="Carrinho de Compras">
          <div class="cart-header">
            <div class="cart-header-title">${ICON.cart}<span>Seu Pedido</span><span class="cart-badge" style="margin-left:6px;display:none">0</span></div>
            <button class="cart-close-btn" id="cart-close-btn" aria-label="Fechar">${ICON.close}</button>
          </div>
          <div class="cart-body" id="cart-drawer-body"></div>
          <div class="cart-footer" id="cart-drawer-footer"></div>
        </aside>
        <button class="floating-cart-btn" id="floating-cart-btn" aria-label="Abrir Carrinho">
          ${ICON.cart}
          <span>Carrinho</span>
          <span class="floating-cart-count" id="floating-cart-count" style="display:none">0</span>
          <span id="floating-cart-total" style="font-size:.82rem;opacity:.85"></span>
        </button>`;
      document.body.appendChild(w);
    }
    const ov=document.getElementById('cart-overlay'); if(ov) ov.addEventListener('click',closeDrawer);
    const cb=document.getElementById('cart-close-btn'); if(cb) cb.addEventListener('click',closeDrawer);
    const fb=document.getElementById('floating-cart-btn'); if(fb) fb.addEventListener('click',openDrawer);
    document.addEventListener('keydown', e => { if(e.key==='Escape') closeDrawer(); });
    setTimeout(injectHeaderCartButton, 500);
    bindDrinksButtons(); bindMenuItems(); bindCtaButtons();
    setTimeout(()=>{ injectHeaderCartButton(); bindDrinksButtons(); bindMenuItems(); bindCtaButtons(); }, 1500);
    renderCart();
  }

  document.readyState==='loading' ? document.addEventListener('DOMContentLoaded',init) : init();
})();