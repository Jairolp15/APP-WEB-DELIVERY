// ═══════════════════════════════════════════
//   BOCADOS APP – Main App Logic
// ═══════════════════════════════════════════

// ── STATE ──────────────────────────────────
let state = {
    user: null,
    cart: [],
    orderType: 'pickup',
    selectedTimeSlot: '12:30',
    useLoyaltyPts: false,
    promoDiscount: 0,
    currentScreen: 'home',
    activeCategory: 'Hamburguesas',
    pushIdx: 0,
    orderCounter: 4588,
    mapInstance: null,
    deliveryMap: null,
    riderMarker: null,
    etaInterval: null,
    carouselIdx: 0,
    selectedProduct: null,
    selectedModifiers: {},
    selectedQty: 1,
    selectedReward: null,
    currentOrders: [...PAST_ORDERS],
};

// ── INIT ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    // Splash
    setTimeout(() => {
        document.getElementById('splash-screen').style.opacity = '0';
        document.getElementById('splash-screen').style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.getElementById('splash-screen').remove();
            document.getElementById('app').classList.remove('hidden');
        }, 500);
    }, 2000);

    startCarousel();
    startCountdown();
    buildMenuTabs();
    renderProducts('Hamburguesas');
    renderFeatured();
    renderReorderList();
    renderBranches();
    renderOrders();
    renderWallet();
    renderTimeSlots();
    schedulePushDemo();
    
    // Check if there is an active user directly
    initAuth();
});

// ── AUTH ─────────────────────────────────────
function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.getElementById('form-' + tab).classList.add('active');
}

function initAuth() {
    const active = localStorage.getItem('bocados_active_user');
    if (active) {
        loginUser(JSON.parse(active));
    }
}

function doLogin() {
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-pass').value;
    if (!email || !pass) { showToast('Ingresa tus credenciales'); return; }

    const users = JSON.parse(localStorage.getItem('bocados_users') || '[]');
    const existing = users.find(u => u.email === email && u.pass === pass);
    if (existing) {
        loginUser(existing);
    } else if (email === 'jairo@bocados.com') { // Fallback/demo user
        loginUser({ name: 'Jairo Paz', email: email });
    } else {
        showToast('Credenciales incorrectas');
    }
}

function doRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-pass').value;
    if (!name || !email || !pass) { showToast('Completa todos los campos'); return; }

    const users = JSON.parse(localStorage.getItem('bocados_users') || '[]');
    if (users.find(u => u.email === email)) {
        showToast('El usuario ya existe');
        return;
    }

    const newUser = { name, email, pass };
    users.push(newUser);
    localStorage.setItem('bocados_users', JSON.stringify(users));
    
    // Auto login
    loginUser(newUser);
}

function doSocialLogin(provider) {
    loginUser({ name: 'Usuario ' + provider, email: 'usuario@' + provider.toLowerCase() + '.com' });
}

function loginUser(user) {
    state.user = user;
    localStorage.setItem('bocados_active_user', JSON.stringify(user));
    
    // Load specific user orders
    const userOrders = localStorage.getItem('bocados_orders_' + user.email);
    state.currentOrders = userOrders ? JSON.parse(userOrders) : [...PAST_ORDERS];

    document.getElementById('screen-auth').classList.add('hidden');
    document.getElementById('main-shell').classList.remove('hidden');
    document.getElementById('profile-name').textContent = user.name;
    document.getElementById('profile-email').textContent = user.email;
    document.getElementById('profile-avatar').textContent = user.name.charAt(0).toUpperCase();
    document.getElementById('pts-available').textContent = '350 puntos disponibles';
    
    renderOrders(); // Refresh order menu with user's specific history
    renderReorderList();

    showToast('¡Bienvenido, ' + user.name.split(' ')[0] + '! 👋');
    navigateTo('home');
}

function doLogout() {
    state.user = null;
    localStorage.removeItem('bocados_active_user');
    window.location.reload(); // Reload to reset the state cleanly
}

// ── NAVIGATION ────────────────────────────────
function navigateTo(screen, categoryFilter) {
    document.querySelectorAll('.screen-main').forEach(s => {
        s.classList.remove('active');
        s.style.transform = 'translateX(30px)';
    });
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

    const el = document.getElementById('screen-' + screen);
    if (!el) return;
    el.classList.add('active');
    el.style.transform = 'translateX(0)';
    state.currentScreen = screen;

    const navEl = document.getElementById('nav-' + screen);
    if (navEl) navEl.classList.add('active');

    if (screen === 'menu' && categoryFilter) {
        setActiveCategory(categoryFilter);
    }
    if (screen === 'tracking') {
        initTrackingMap();
    }
    if (screen === 'cart') {
        renderCart();
    }
}

// ── CAROUSEL ──────────────────────────────────
function startCarousel() {
    const slides = document.querySelectorAll('.promo-slide');
    const dotsContainer = document.getElementById('carousel-dots');
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    });

    setInterval(() => {
        state.carouselIdx = (state.carouselIdx + 1) % slides.length;
        goToSlide(state.carouselIdx);
    }, 4000);
}

function goToSlide(idx) {
    document.querySelectorAll('.promo-slide').forEach((s, i) => {
        s.classList.toggle('active', i === idx);
    });
    document.querySelectorAll('.carousel-dot').forEach((d, i) => {
        d.classList.toggle('active', i === idx);
    });
    state.carouselIdx = idx;
}

// ── COUNTDOWN TIMER ───────────────────────────
function startCountdown() {
    let secs = 2 * 3600 + 45 * 60 + 32;
    function tick() {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0');
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        const el = document.getElementById('timer1');
        if (el) el.textContent = `⏱ ${h}:${m}:${s}`;
        if (secs > 0) secs--;
    }
    tick();
    setInterval(tick, 1000);
}

// ── MENU / PRODUCTS ───────────────────────────
function buildMenuTabs() {
    const container = document.getElementById('menu-tabs');
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-tab' + (cat === 'Hamburguesas' ? ' active' : '');
        btn.textContent = catEmoji(cat) + ' ' + cat;
        btn.onclick = () => setActiveCategory(cat);
        container.appendChild(btn);
    });
}

function catEmoji(cat) {
    const map = { Hamburguesas: '🍔', Bebidas: '🥤', Combos: '🍟', Postres: '🍦', Snacks: '🌮' };
    return map[cat] || '🍽️';
}

function setActiveCategory(cat) {
    state.activeCategory = cat;
    document.querySelectorAll('.menu-tab').forEach(t => {
        t.classList.toggle('active', t.textContent.includes(cat));
    });
    renderProducts(cat);
}

function filterProducts(query) {
    const q = query.toLowerCase();
    const filtered = PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
    );
    renderProductsArray(filtered);
}

function renderProducts(cat) {
    const filtered = cat ? PRODUCTS.filter(p => p.cat === cat) : PRODUCTS;
    renderProductsArray(filtered);
}

function renderProductsArray(products) {
    const grid = document.getElementById('products-grid');
    grid.innerHTML = '';
    products.forEach(p => {
        const card = createProductCard(p);
        grid.appendChild(card);
    });
}

function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    const popular = PRODUCTS.filter(p => p.popular);
    popular.forEach(p => {
        const card = createProductCard(p);
        grid.appendChild(card);
    });
}

function createProductCard(p) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
    <div class="product-card-img">${p.emoji}</div>
    <div class="product-card-body">
      <div class="product-card-name">${p.name}</div>
      <div class="product-card-price">$${p.price.toFixed(2)}</div>
      <div class="product-card-add">
        <span class="product-card-rating">⭐ ${p.rating}</span>
        <button class="product-card-btn" onclick="openProduct(${p.id}, event)">+</button>
      </div>
    </div>`;
    card.onclick = () => openProduct(p.id);
    return card;
}

function renderReorderList() {
    const list = document.getElementById('reorder-list');
    list.innerHTML = '';
    const orders = state.currentOrders.length ? state.currentOrders : PAST_ORDERS;
    orders.slice(0, 3).forEach(o => {
        const div = document.createElement('div');
        div.className = 'reorder-item';
        div.innerHTML = `
      <div class="reorder-emoji">${o.emoji}</div>
      <div class="reorder-info">
        <div class="reorder-name">${o.items}</div>
        <div class="reorder-price">$${o.total.toFixed(2)}</div>
      </div>
      <button class="reorder-btn" onclick="reorderItem('${o.id}')">Reordenar</button>`;
        list.appendChild(div);
    });
}

function renderBranches() {
    const list = document.getElementById('branches-list');
    BRANCHES.forEach(b => {
        const div = document.createElement('div');
        div.className = 'branch-item';
        div.innerHTML = `
      <div class="branch-icon">🏪</div>
      <div class="branch-info">
        <div class="branch-name">${b.name}</div>
        <div class="branch-meta">${b.address} · ⏱ ${b.wait}</div>
      </div>
      <div class="branch-dist">${b.dist} km</div>`;
        list.appendChild(div);
    });
}

function renderOrders() {
    const list = document.getElementById('orders-list');
    list.innerHTML = '';
    state.currentOrders.forEach(o => {
        const statusLabel = { delivered: 'Entregado', preparing: 'Preparando', received: 'Recibido', on_the_way: 'En camino' };
        const pillClass = { delivered: 'pill-delivered', preparing: 'pill-preparing', received: 'pill-received', on_the_way: 'pill-preparing' };
        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
      <div class="order-item-header">
        <span class="order-num">#${o.id}</span>
        <span class="order-status-pill ${pillClass[o.status] || 'pill-received'}">${statusLabel[o.status] || o.status}</span>
      </div>
      <div class="order-item-name">${o.emoji} ${o.items}</div>
      <div class="order-item-meta">${o.date} · +${o.pts} pts ganados</div>
      <div class="order-item-footer">
        <span class="order-total-val">$${o.total.toFixed(2)}</span>
        <button class="reorder-mini-btn" onclick="reorderItem('${o.id}')">🔄 Reordenar</button>
      </div>`;
        div.onclick = () => { if (o.status !== 'delivered') navigateTo('tracking'); };
        list.appendChild(div);
    });
}

function renderTimeSlots() {
    const wrap = document.getElementById('time-slots');
    const times = ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30'];
    times.forEach(t => {
        const slot = document.createElement('div');
        slot.className = 'time-slot' + (t === state.selectedTimeSlot ? ' active' : '');
        slot.textContent = t;
        slot.onclick = () => {
            document.querySelectorAll('.time-slot').forEach(s => s.classList.remove('active'));
            slot.classList.add('active');
            state.selectedTimeSlot = t;
        };
        wrap.appendChild(slot);
    });
}

// ── PRODUCT MODAL ──────────────────────────────
function openProduct(id, e) {
    if (e) e.stopPropagation();
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    state.selectedProduct = p;
    state.selectedModifiers = {};
    state.selectedQty = 1;

    document.getElementById('pm-emoji').textContent = p.emoji;
    document.getElementById('pm-name').textContent = p.name;
    document.getElementById('pm-desc').textContent = p.desc;
    document.getElementById('pm-base-price').textContent = '$' + p.price.toFixed(2);
    document.getElementById('pm-qty').textContent = '1';
    document.getElementById('pm-notes').value = '';
    renderModifiers(p);
    updateModalTotal();
    document.getElementById('product-modal').classList.remove('hidden');
}

function renderModifiers(p) {
    const container = document.getElementById('modifiers-section');
    container.innerHTML = '';
    const mods = MODIFIERS_MAP[p.cat] || [];
    mods.forEach(group => {
        const div = document.createElement('div');
        div.className = 'modifier-group';
        div.innerHTML = `<div class="modifier-group-title">${group.group}</div>`;
        const opts = document.createElement('div');
        opts.className = 'modifier-options';
        group.options.forEach((opt, i) => {
            const chip = document.createElement('div');
            chip.className = 'modifier-chip';
            const price = group.prices[i];
            chip.innerHTML = opt + (price > 0 ? `<span class="chip-price">+$${price.toFixed(2)}</span>` : '');
            chip.onclick = () => {
                if (group.type === 'choice') {
                    opts.querySelectorAll('.modifier-chip').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                    state.selectedModifiers[group.group] = { label: opt, price };
                } else {
                    chip.classList.toggle('selected');
                    if (!state.selectedModifiers[group.group]) state.selectedModifiers[group.group] = [];
                    const arr = state.selectedModifiers[group.group];
                    const idx = arr.findIndex(x => x.label === opt);
                    if (idx >= 0) arr.splice(idx, 1);
                    else arr.push({ label: opt, price });
                }
                updateModalTotal();
            };
            opts.appendChild(chip);
        });
        div.appendChild(opts);
        container.appendChild(div);
    });
}

function changeQty(delta) {
    state.selectedQty = Math.max(1, Math.min(10, state.selectedQty + delta));
    document.getElementById('pm-qty').textContent = state.selectedQty;
    updateModalTotal();
}

function updateModalTotal() {
    if (!state.selectedProduct) return;
    let extra = 0;
    Object.values(state.selectedModifiers).forEach(v => {
        if (Array.isArray(v)) v.forEach(x => extra += x.price);
        else if (v) extra += v.price;
    });
    const total = (state.selectedProduct.price + extra) * state.selectedQty;
    const el = document.getElementById('pm-total-price');
    if (el) el.textContent = '$' + total.toFixed(2);
}

function closeProductModal(e) {
    if (e && e.target !== document.getElementById('product-modal')) return;
    document.getElementById('product-modal').classList.add('hidden');
}

function addToCartFromModal() {
    if (!state.selectedProduct) return;
    let extra = 0;
    const modLabels = [];
    Object.values(state.selectedModifiers).forEach(v => {
        if (Array.isArray(v)) v.forEach(x => { extra += x.price; modLabels.push(x.label); });
        else if (v) { extra += v.price; modLabels.push(v.label); }
    });
    const unitPrice = state.selectedProduct.price + extra;

    const existing = state.cart.find(c => c.id === state.selectedProduct.id && JSON.stringify(c.mods) === JSON.stringify(modLabels));
    if (existing) {
        existing.qty += state.selectedQty;
    } else {
        state.cart.push({
            id: state.selectedProduct.id,
            name: state.selectedProduct.name,
            emoji: state.selectedProduct.emoji,
            unitPrice,
            qty: state.selectedQty,
            mods: modLabels,
            notes: document.getElementById('pm-notes').value,
            pts: state.selectedProduct.pts,
        });
    }
    updateCartBadge();
    document.getElementById('product-modal').classList.add('hidden');
    showToast(state.selectedProduct.emoji + ' Añadido al carrito');
}

// ── CART ──────────────────────────────────────
function updateCartBadge() {
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('nav-cart-badge');
    const menuBadge = document.getElementById('cart-badge-menu');
    if (badge) { badge.textContent = count; badge.classList.toggle('visible', count > 0); }
    if (menuBadge) menuBadge.textContent = count;
}

function renderCart() {
    const list = document.getElementById('cart-items-list');
    const emptyEl = document.getElementById('cart-empty');
    const promoRow = document.getElementById('promo-code-row');
    const loyaltyRow = document.getElementById('loyalty-row');
    const footer = document.getElementById('cart-footer');

    list.innerHTML = '';
    if (state.cart.length === 0) {
        emptyEl.classList.remove('hidden');
        promoRow.style.display = 'none';
        loyaltyRow.style.display = 'none';
        footer.style.display = 'none';
        document.getElementById('cart-totals').innerHTML = '';
        return;
    }
    emptyEl.classList.add('hidden');
    promoRow.style.display = 'flex';
    loyaltyRow.style.display = 'flex';
    footer.style.display = 'block';

    state.cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
      <div class="ci-emoji">${item.emoji}</div>
      <div class="ci-info">
        <div class="ci-name">${item.name}</div>
        ${item.mods.length ? `<div class="ci-mods">${item.mods.join(' · ')}</div>` : ''}
        <div class="ci-qty">
          <button class="ci-qty-btn" onclick="changeCartQty(${idx}, -1)">−</button>
          <span class="ci-qty-val">${item.qty}</span>
          <button class="ci-qty-btn" onclick="changeCartQty(${idx}, 1)">+</button>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:8px;">
        <button class="ci-remove" onclick="removeCartItem(${idx})">🗑️</button>
        <div class="ci-price">$${(item.unitPrice * item.qty).toFixed(2)}</div>
      </div>`;
        list.appendChild(div);
    });
    renderTotals();
}

function changeCartQty(idx, delta) {
    state.cart[idx].qty = Math.max(1, state.cart[idx].qty + delta);
    renderCart();
    updateCartBadge();
}

function removeCartItem(idx) {
    state.cart.splice(idx, 1);
    renderCart();
    updateCartBadge();
}

function clearCart() {
    state.cart = [];
    renderCart();
    updateCartBadge();
}

function renderTotals() {
    const subtotal = state.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const tax = subtotal * 0.16;
    const deliveryFee = state.orderType === 'delivery' ? 2.50 : 0;
    const promoOff = state.promoDiscount;
    const loyaltyOff = state.useLoyaltyPts ? Math.min(3.50, subtotal * 0.1) : 0;
    const total = subtotal + tax + deliveryFee - promoOff - loyaltyOff;
    const ptsEarned = Math.floor(total * 10);

    document.getElementById('cart-totals').innerHTML = `
    <div class="total-row"><span>Subtotal</span><span>$${subtotal.toFixed(2)}</span></div>
    <div class="total-row"><span>Impuestos (16%)</span><span>$${tax.toFixed(2)}</span></div>
    ${deliveryFee > 0 ? `<div class="total-row"><span>Envío</span><span>$${deliveryFee.toFixed(2)}</span></div>` : ''}
    ${promoOff > 0 ? `<div class="total-row" style="color:var(--success)"><span>Descuento promo</span><span>-$${promoOff.toFixed(2)}</span></div>` : ''}
    ${loyaltyOff > 0 ? `<div class="total-row" style="color:var(--accent)"><span>Puntos canjeados</span><span>-$${loyaltyOff.toFixed(2)}</span></div>` : ''}
    <div class="total-row main">
      <span>Total</span>
      <span>$${total.toFixed(2)} <span class="pts-earn">+${ptsEarned} pts</span></span>
    </div>`;
    const checkoutBtn = document.getElementById('checkout-total');
    if (checkoutBtn) checkoutBtn.textContent = '$' + total.toFixed(2);
}

function setOrderType(type) {
    state.orderType = type;
    document.getElementById('ot-pickup').classList.toggle('active', type === 'pickup');
    document.getElementById('ot-delivery').classList.toggle('active', type === 'delivery');
    document.getElementById('pickup-options').classList.toggle('hidden', type !== 'pickup');
    document.getElementById('delivery-options').classList.toggle('hidden', type !== 'delivery');
    renderTotals();
}

function applyPromo() {
    const code = document.getElementById('promo-input').value.toUpperCase().trim();
    if (code === 'QUICKBITE30') {
        state.promoDiscount = 3.00;
        showToast('✅ Código aplicado: -$3.00');
    } else if (code === 'GRATIS') {
        state.promoDiscount = 0;
        showToast('Código no válido');
    } else {
        showToast('Código inválido');
    }
    renderTotals();
}

function toggleLoyaltyPoints() {
    state.useLoyaltyPts = document.getElementById('use-pts-toggle').checked;
    renderTotals();
}

// ── ORDER ─────────────────────────────────────
function placeOrder() {
    if (state.cart.length === 0) { showToast('Agrega productos al carrito'); return; }
    state.orderCounter++;
    const subtotal = state.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const tax = subtotal * 0.16;
    const deliveryFee = state.orderType === 'delivery' ? 2.50 : 0;
    const total = subtotal + tax + deliveryFee - state.promoDiscount - (state.useLoyaltyPts ? Math.min(3.50, subtotal * 0.1) : 0);
    const pts = Math.floor(total * 10);

    const newOrder = {
        id: 'QB-' + state.orderCounter,
        items: state.cart.map(i => i.name).join(' + '),
        total: total,
        emoji: state.cart[0].emoji,
        status: 'received',
        date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }),
        pts: pts,
    };
    state.currentOrders.unshift(newOrder);
    const ptsEarned = pts;

    document.getElementById('order-num').textContent = newOrder.id;
    document.getElementById('conf-eta').textContent = state.orderType === 'delivery' ? '25–35 min' : state.selectedTimeSlot;
    
    // Get Payment Method UI
    let paymentText = "Tarjeta **** 4242";
    if (state.orderType === 'delivery') {
        const selectedPay = document.querySelector('input[name="pay"]:checked');
        if (selectedPay && selectedPay.value === 'cash') paymentText = "Pago en efectivo";
        if (selectedPay && selectedPay.value === 'transfer') paymentText = "Pago Móvil / Transferencias";
        if (selectedPay && selectedPay.value === 'new') paymentText = "Nueva tarjeta";
    }
    
    // We update the third CD-ROW manually:
    const paymentRow = document.querySelectorAll('.cd-row')[2];
    if (paymentRow) {
        paymentRow.innerHTML = `<span>💳 Método de pago</span><strong>${paymentText}</strong>`;
    }

    document.getElementById('conf-pts').textContent = '+' + ptsEarned + ' pts';
    document.getElementById('order-confirmed-modal').classList.remove('hidden');

    // Update pts
    const ptsBig = Number(document.getElementById('pts-big').textContent) + ptsEarned;
    document.getElementById('pts-big').textContent = ptsBig;
    document.getElementById('header-pts').textContent = ptsBig + ' pts';

    // Save to localStorage
    if (state.user) {
        localStorage.setItem('bocados_orders_' + state.user.email, JSON.stringify(state.currentOrders));
    }

    state.cart = [];
    updateCartBadge();
    renderOrders();
    renderReorderList();

    // Push notification queue
    setTimeout(() => triggerPush(1), 4000);
    setTimeout(() => triggerPush(2), 12000);
}

function openDeliveryMap() {
    document.getElementById('delivery-modal').classList.remove('hidden');
    setTimeout(() => {
        if (!state.deliveryMap) {
            state.deliveryMap = L.map('delivery-map', { zoomControl: false }).setView([10.1367, -71.2611], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(state.deliveryMap);
            
            // Reverse Geocoding on Map Move End
            state.deliveryMap.on('moveend', function() {
                const center = state.deliveryMap.getCenter();
                fetchAddressFromCoords(center.lat, center.lng);
            });
            
            // Add Enter Key listener for search
            const searchInput = document.getElementById('delivery-search-input');
            if(searchInput) {
                searchInput.addEventListener('keydown', function(event) {
                    if (event.key === 'Enter') {
                        event.preventDefault();
                        searchDeliveryAddress();
                    }
                });
            }
            // Initial fetch
            fetchAddressFromCoords(10.1367, -71.2611);
        } else {
            state.deliveryMap.invalidateSize();
            // Fetch for current center whenever opened
            const center = state.deliveryMap.getCenter();
            fetchAddressFromCoords(center.lat, center.lng);
        }
    }, 100);
}

async function fetchAddressFromCoords(lat, lng) {
    const titleEl = document.getElementById('delivery-addr-title');
    const subEl = document.getElementById('delivery-addr-subtitle');
    try {
        titleEl.textContent = 'Buscando...';
        subEl.textContent = 'Obteniendo dirección precisa';
        
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=es&email=jairo@bocados.com`);
        const data = await response.json();
        
        if (data && data.address) {
            const road = data.address.road || data.address.pedestrian || data.address.suburb || data.address.neighbourhood || 'Ubicación seleccionada';
            const city = data.address.city || data.address.town || data.address.village || data.address.county || 'Lagunillas';
            const stateName = data.address.state || 'estado Zulia';
            
            titleEl.textContent = road;
            subEl.textContent = `${city}, ${stateName}`;
            
            // Save exactly this text to use in checkout
            state.currentDeliveryAddress = { title: road, subtitle: `${city}, ${stateName}` };
        } else {
            titleEl.textContent = 'Ubicación Desconocida';
            subEl.textContent = 'Mueve el mapa para intentar de nuevo';
            state.currentDeliveryAddress = { title: 'Ubicación Personalizada', subtitle: 'Coordenadas seleccionadas' };
        }
    } catch (e) {
        titleEl.textContent = 'Ubicación seleccionada';
        subEl.textContent = 'Lagunillas, estado Zulia';
        state.currentDeliveryAddress = { title: 'Ubicación seleccionada', subtitle: 'Lagunillas, estado Zulia' };
    }
}

async function searchDeliveryAddress() {
    const query = document.getElementById('delivery-search-input').value;
    if (!query) return;
    
    // Add Lagunillas Zulia to context if user types too broad
    const fullQuery = query.toLowerCase().includes('lagunillas') ? query : query + ', Lagunillas, Zulia';
    
    showToast('Buscando...');
    try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(fullQuery)}&limit=1&accept-language=es&email=jairo@bocados.com`);
        const data = await response.json();
        if (data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lon = parseFloat(data[0].lon);
            state.deliveryMap.flyTo([lat, lon], 16); // This will trigger 'moveend' and fetchAddressFromCoords automatically
        } else {
            showToast('No se encontró la dirección');
        }
    } catch (e) {
        showToast('Error en la búsqueda');
        console.error("Geocoding Error: ", e);
    }
}

function locateDeliveryUser() {
    if ("geolocation" in navigator) {
        showToast('Obteniendo tu ubicación...');
        navigator.geolocation.getCurrentPosition((position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            state.deliveryMap.flyTo([lat, lng], 16);
        }, (error) => {
            showToast('No se pudo acceder a tu GPS');
            console.error(error);
        });
    } else {
        showToast('Geolocalización no soportada');
    }
}

function confirmDeliveryAddress() {
    document.getElementById('delivery-modal').classList.add('hidden');
    state.orderType = 'delivery';
    
    // Update the Checkout Address Card
    const addrElem = document.getElementById('checkout-address');
    if (addrElem && state.currentDeliveryAddress) {
        addrElem.innerHTML = `<div><strong>📍 ${state.currentDeliveryAddress.title}</strong><br><span style="font-size:12px;color:var(--text2)">${state.currentDeliveryAddress.subtitle}</span></div> <span style="font-size:20px;">›</span>`;
    }
    showToast('Dirección confirmada');
}

function goToTracking() {
    document.getElementById('order-confirmed-modal').classList.add('hidden');
    navigateTo('tracking');
}

function closeConfirmedModal() {
    document.getElementById('order-confirmed-modal').classList.add('hidden');
    navigateTo('home');
}

function reorderItem(orderId) {
    const order = state.currentOrders.find(o => o.id === orderId) || PAST_ORDERS.find(o => o.id === orderId);
    if (!order) return;
    // Add a sampled product to cart
    const p = PRODUCTS.find(x => x.cat === 'Combos') || PRODUCTS[0];
    state.cart.push({ id: p.id, name: order.items.split(' + ')[0], emoji: order.emoji, unitPrice: order.total / 1.16, qty: 1, mods: [], notes: '', pts: order.pts });
    updateCartBadge();
    showToast('✅ Pedido añadido al carrito');
    navigateTo('cart');
}

// ── DELIVERY MAP ──────────────────────────────
function openDeliveryMap() {
    document.getElementById('delivery-modal').classList.remove('hidden');
    setTimeout(() => {
        if (!state.deliveryMap) {
            state.deliveryMap = L.map('delivery-map', { zoomControl: false }).setView([10.1367, -71.2611], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '' }).addTo(state.deliveryMap);
        } else {
            state.deliveryMap.invalidateSize();
        }
    }, 100);
}

function closeDeliveryModal(e) {
    if (e && e.target !== document.getElementById('delivery-modal')) return;
    document.getElementById('delivery-modal').classList.add('hidden');
}

function confirmDeliveryAddress() {
    document.getElementById('delivery-modal').classList.add('hidden');
    showToast('📍 Dirección confirmada');
}

// ── TRACKING MAP ──────────────────────────────
function initTrackingMap() {
    setTimeout(() => {
        const container = document.getElementById('map-container');
        if (!container) return;
        if (state.mapInstance) {
            state.mapInstance.invalidateSize();
            return;
        }
        const LAGUNILLAS = [10.1367, -71.2611];
        const map = L.map('map-container', { zoomControl: false, attributionControl: false }).setView(LAGUNILLAS, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
        state.mapInstance = map;

        // Restaurant marker
        const restIcon = L.divIcon({ html: '<div style="font-size:28px;line-height:1">🏪</div>', className: '', iconAnchor: [14, 28] });
        const destIcon = L.divIcon({ html: '<div style="font-size:28px;line-height:1">🏠</div>', className: '', iconAnchor: [14, 28] });
        const riderIconEl = L.divIcon({ html: '<div style="font-size:28px;line-height:1">🛵</div>', className: '', iconAnchor: [14, 14] });

        const restLatLng = [10.1380, -71.2630];
        const destLatLng = [10.1340, -71.2580];
        L.marker(restLatLng, { icon: restIcon }).addTo(map);
        L.marker(destLatLng, { icon: destIcon }).addTo(map);
        state.riderMarker = L.marker([10.1385, -71.2620], { icon: riderIconEl }).addTo(map);

        // Dashed route line
        L.polyline([restLatLng, destLatLng], { color: '#FF416C', weight: 3, dashArray: '8 8', opacity: 0.8 }).addTo(map);

        // Animate rider
        let t = 0;
        const riderPath = [
            [10.1385, -71.2620], [10.1378, -71.2608], [10.1365, -71.2590], [10.1350, -71.2582], [10.1340, -71.2580]
        ];
        clearInterval(state.etaInterval);
        let eta = 18;
        state.etaInterval = setInterval(() => {
            t++;
            if (t < riderPath.length) {
                state.riderMarker.setLatLng(riderPath[t]);
                map.panTo(riderPath[t], { animate: true, duration: 1 });
            }
            if (eta > 0) {
                eta--;
                const etaEl = document.getElementById('eta-value');
                if (etaEl) etaEl.textContent = eta + ' min';
            }
            if (eta === 0) {
                clearInterval(state.etaInterval);
                const etaEl = document.getElementById('eta-value');
                if (etaEl) etaEl.textContent = '¡Llegó!';
                triggerPush(3);
            }
        }, 3000);
    }, 200);
}

// ── WALLET / REWARDS ──────────────────────────
function renderWallet() {
    const grid = document.getElementById('rewards-grid');
    REWARDS.forEach(r => {
        const card = document.createElement('div');
        card.className = 'reward-card';
        card.innerHTML = `
      <div class="reward-card-icon">${r.icon}</div>
      <div class="reward-card-name">${r.name}</div>
      <div class="reward-card-pts">${r.ptsReq} pts</div>`;
        card.onclick = () => openRewardModal(r);
        grid.appendChild(card);
    });

    const hist = document.getElementById('pts-history');
    LOYALTY_HISTORY.forEach(h => {
        const div = document.createElement('div');
        div.className = 'ph-item';
        div.innerHTML = `
      <div class="ph-icon ${h.type}">${h.icon}</div>
      <div class="ph-info">
        <div class="ph-desc">${h.desc}</div>
        <div class="ph-date">${h.date} · 2026</div>
      </div>
      <div class="ph-pts ${h.type}">${h.pts > 0 ? '+' : ''}${h.pts}</div>`;
        hist.appendChild(div);
    });
}

function openRewardModal(r) {
    state.selectedReward = r;
    document.getElementById('rm-icon').textContent = r.icon;
    document.getElementById('rm-title').textContent = r.name;
    document.getElementById('rm-desc').textContent = r.desc;
    document.getElementById('rm-pts').textContent = r.ptsReq;
    const pts = Number(document.getElementById('pts-big').textContent);
    const btn = document.getElementById('rm-redeem-btn');
    btn.textContent = pts >= r.ptsReq ? 'Canjear ahora ✨' : 'Puntos insuficientes';
    btn.disabled = pts < r.ptsReq;
    btn.style.opacity = pts < r.ptsReq ? '0.5' : '1';
    document.getElementById('reward-modal').classList.remove('hidden');
}

function closeRewardModal(e) {
    if (e && e.target !== document.getElementById('reward-modal')) return;
    document.getElementById('reward-modal').classList.add('hidden');
}

function redeemReward() {
    if (!state.selectedReward) return;
    const r = state.selectedReward;
    let pts = Number(document.getElementById('pts-big').textContent);
    if (pts < r.ptsReq) { showToast('Puntos insuficientes'); return; }
    pts -= r.ptsReq;
    document.getElementById('pts-big').textContent = pts;
    document.getElementById('header-pts').textContent = pts + ' pts';
    document.getElementById('reward-modal').classList.add('hidden');
    showToast('🎉 ¡' + r.name + ' canjeado!');
}

// ── PUSH NOTIFICATIONS ────────────────────────
let pushIdx = 0;
function triggerPush(idx) {
    const msg = PUSH_MESSAGES[idx % PUSH_MESSAGES.length];
    const el = document.getElementById('push-notif');
    document.getElementById('push-title').textContent = msg.title;
    document.getElementById('push-text').textContent = msg.text;
    el.querySelector('.push-icon').textContent = msg.icon;
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5000);
}

function closePush() {
    document.getElementById('push-notif').classList.add('hidden');
}

function showPushDemo() {
    triggerPush(pushIdx++);
}

function schedulePushDemo() {
    setTimeout(() => triggerPush(3), 8000);
}

// ── TOAST ─────────────────────────────────────
let toastTimer;
function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2500);
}

// ── PROFILE OPTIONS ───────────────────────────
function showAddressModal() {
    // Populate saved addresses modal
    const list = document.getElementById('saved-addresses-list');
    list.innerHTML = '';
    
    // Fake Address Items
    const addrs = [
        { title: 'Hogar', sub: 'Campo Grande, Lagunillas' },
        { title: 'Trabajo', sub: 'Casco Central, Lagunillas' }
    ];
    
    addrs.forEach(a => {
        list.innerHTML += `
        <div style="background:var(--surface); padding:15px; border-radius:12px; display:flex; align-items:center; justify-content:space-between; cursor:pointer;" onclick="document.getElementById('address-modal').classList.add('hidden'); showToast('Dirección principal cambiada');">
          <div style="display:flex; align-items:center; gap:12px;">
            <span style="font-size:24px;">📍</span>
            <div>
              <div style="font-weight:600;">${a.title}</div>
              <div style="font-size:13px; color:var(--text-muted);">${a.sub}</div>
            </div>
          </div>
          <span style="color:var(--primary); font-size:18px;">›</span>
        </div>`;
    });
    
    document.getElementById('address-modal').classList.remove('hidden');
}

function showPaymentMethods() {
    document.getElementById('payment-modal').classList.remove('hidden');
}

function shareGivenOrder(orderNum, orderTotal) {
    // Determine sharing text
    const num = orderNum || (state.currentOrders.length > 0 ? state.currentOrders[0].id : "#0000");
    const total = orderTotal || (state.currentOrders.length > 0 ? "$" + state.currentOrders[0].total.toFixed(2) : "$0.00");
    
    const text = encodeURIComponent(`¡Mira mi orden de BOCADOS APP!\nPedido: ${num}\nTotal: ${total}\n😋 ¡Pide tú también!`);
    const link = `https://wa.me/?text=${text}`;
    window.open(link, '_blank');
}

// ── MISC ──────────────────────────────────────
function requestSupport() { showToast('Soporte activado'); }
function openSettings() { showToast('Ajustes abiertos'); }
function showLegal() { showToast('Mostrando legales'); }
