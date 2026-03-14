 // ═══════════════════════════════════════════
//   QuickBite Native – App Logic (Enhanced)
// ═══════════════════════════════════════════

// ── STATE ──────────────────────────────────
let S = {
    user: null,
    cart: [],
    orderType: 'pickup',
    timeSlot: '12:30',
    useLoyaltyPts: false,
    promoDiscount: 0,
    pts: 350,
    currentScreen: 'home',
    activeCategory: 'Hamburguesas',
    selectedProduct: null,
    selectedMods: {},
    selectedQty: 1,
    selectedReward: null,
    orderCounter: 4588,
    orders: [...PAST_ORDERS],
    mapInstance: null,
    deliveryMap: null,
    riderMarker: null,
    etaTimer: null,
    carouselTimer: null,
    carouselIdx: 0,
};

// ── CAPACITOR BRIDGE ────────────────────────
async function initCapacitor() {
    try {
        if (window.Capacitor) {
            const { StatusBar, Style } = await import('@capacitor/status-bar');
            await StatusBar.setStyle({ style: Style.Dark });
            await StatusBar.setBackgroundColor({ color: '#0f0f0f' });
            const { SplashScreen } = await import('@capacitor/splash-screen');
            await SplashScreen.hide();
            const { PushNotifications } = await import('@capacitor/push-notifications');
            await PushNotifications.requestPermissions();
            await PushNotifications.register();
        }
    } catch (e) { /* running as web */ }
}

async function hapticFeedback(type) {
    try {
        if (window.Capacitor) {
            const { Haptics, ImpactStyle } = await import('@capacitor/haptics');
            if (type === 'light') await Haptics.impact({ style: ImpactStyle.Light });
            else if (type === 'success') await Haptics.notification({ type: 'SUCCESS' });
            else await Haptics.impact({ style: ImpactStyle.Medium });
        }
    } catch (e) { }
}

// ── INIT ────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
    initCapacitor();

    // Splash
    const bar = document.querySelector('.splash-bar');
    setTimeout(() => {
        const splash = document.getElementById('splash');
        splash.style.opacity = '0';
        splash.style.transition = 'opacity 0.5s';
        setTimeout(() => { splash.remove(); document.getElementById('app').classList.remove('hidden'); }, 500);
    }, 2100);

    buildMenuTabs();
    renderProducts('Hamburguesas');
    renderPopular();
    renderReorder();
    renderBranches();
    renderOrders();
    renderWallet();
    buildTimeSlots();
    buildCarousel();
    startCountdown();
    scheduleAutoPush();
    updateGreeting();
});

function updateGreeting() {
    const h = new Date().getHours();
    const greet = h < 12 ? '¡Buenos días' : h < 18 ? '¡Buenas tardes' : '¡Buenas noches';
    const el = document.getElementById('greeting-text');
    if (el) el.innerHTML = `${greet}, <span id="greeting-name">Amigo</span>! ${h < 12 ? '☀️' : h < 18 ? '👋' : '🌙'}`;
}

// ── AUTH ─────────────────────────────────────
function switchTab(tab) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.auth-form').forEach(f => f.classList.remove('active'));
    document.getElementById('tab-' + tab).classList.add('active');
    document.getElementById('form-' + tab).classList.add('active');
}

function doLogin() {
    const email = document.getElementById('login-email').value || 'carlos@quickbite.mx';
    loginUser({ name: 'Carlos García', email });
}

function doRegister() {
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    if (!name || !email) { showToast('Completa todos los campos'); return; }
    loginUser({ name, email });
}

function doSocialLogin(p) { loginUser({ name: 'Usuario ' + p, email: 'user@' + p.toLowerCase() + '.com' }); }

function loginUser(user) {
    S.user = user;
    document.getElementById('screen-auth').classList.remove('active');
    document.getElementById('main-shell').classList.remove('hidden');
    document.getElementById('profile-name-n').textContent = user.name;
    document.getElementById('profile-email-n').textContent = user.email;
    document.getElementById('profile-ava-n').textContent = user.name.charAt(0).toUpperCase();
    const fn = user.name.split(' ')[0];
    document.getElementById('greeting-name') && (document.getElementById('greeting-name').textContent = fn);
    showToast('¡Bienvenido, ' + fn + '! 🎉');
    hapticFeedback('success');
    navigateTo('home');
    setTimeout(() => triggerPush(3), 6000);
}

function doLogout() {
    S.user = null;
    document.getElementById('screen-auth').classList.add('active');
    document.getElementById('main-shell').classList.add('hidden');
}

// ── NAVIGATION ─────────────────────────────────
function navigateTo(screen, catFilter) {
    document.querySelectorAll('.smain').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.nav-n-item').forEach(n => n.classList.remove('active'));
    const el = document.getElementById('screen-' + screen);
    if (!el) return;
    el.classList.add('active');
    S.currentScreen = screen;
    const navEl = document.getElementById('nnav-' + screen);
    if (navEl) navEl.classList.add('active');
    if (screen === 'menu') { if (catFilter) setActiveCategory(catFilter); }
    if (screen === 'cart') renderCart();
    if (screen === 'tracking') initTrackingMap();
}

function focusSearch() {
    setTimeout(() => { const el = document.getElementById('menu-search-n'); if (el) el.focus(); }, 300);
}

// ── CAROUSEL ──────────────────────────────────
function buildCarousel() {
    const dots = document.getElementById('carousel-dots-n');
    const track = document.getElementById('carousel-track');
    const slides = track ? track.children.length : 3;
    for (let i = 0; i < slides; i++) {
        const d = document.createElement('div');
        d.className = 'cdot-n' + (i === 0 ? ' active' : '');
        d.onclick = () => { S.carouselIdx = i; syncDots(); };
        dots.appendChild(d);
    }

    track && track.addEventListener('scroll', () => {
        const idx = Math.round(track.scrollLeft / track.offsetWidth);
        if (idx !== S.carouselIdx) { S.carouselIdx = idx; syncDots(); }
    });

    S.carouselTimer = setInterval(() => {
        const slides = track.children.length;
        S.carouselIdx = (S.carouselIdx + 1) % slides;
        track.children[S.carouselIdx]?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
        syncDots();
    }, 4500);
}

function syncDots() {
    document.querySelectorAll('.cdot-n').forEach((d, i) => d.classList.toggle('active', i === S.carouselIdx));
}

// ── COUNTDOWN ─────────────────────────────────
function startCountdown() {
    let secs = 9912;
    const tick = () => {
        const h = String(Math.floor(secs / 3600)).padStart(2, '0');
        const m = String(Math.floor((secs % 3600) / 60)).padStart(2, '0');
        const s = String(secs % 60).padStart(2, '0');
        const el = document.getElementById('ptimer');
        if (el) el.textContent = `⏱ ${h}:${m}:${s}`;
        if (secs > 0) secs--;
    };
    tick();
    setInterval(tick, 1000);
}

// ── MENU / PRODUCTS ──────────────────────────
function buildMenuTabs() {
    const wrap = document.getElementById('menu-tabs-n');
    CATEGORIES.forEach(cat => {
        const btn = document.createElement('button');
        btn.className = 'menu-tab-n' + (cat === 'Hamburguesas' ? ' active' : '');
        btn.textContent = catEmoji(cat) + ' ' + cat;
        btn.onclick = () => setActiveCategory(cat);
        wrap.appendChild(btn);
    });
}

function catEmoji(c) {
    return { Hamburguesas: '🍔', Bebidas: '🥤', Combos: '🍟', Postres: '🍦', Snacks: '🌮' }[c] || '🍽️';
}

function setActiveCategory(cat) {
    S.activeCategory = cat;
    document.querySelectorAll('.menu-tab-n').forEach(t => t.classList.toggle('active', t.textContent.includes(cat)));
    renderProducts(cat);
}

function filterProducts(q) {
    const res = PRODUCTS.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.desc.toLowerCase().includes(q.toLowerCase()));
    renderProductsArr(res);
}

function renderProducts(cat) { renderProductsArr(cat ? PRODUCTS.filter(p => p.cat === cat) : PRODUCTS); }

function renderProductsArr(products) {
    const grid = document.getElementById('products-n');
    grid.innerHTML = '';
    products.forEach(p => grid.appendChild(createMenuCard(p)));
}

function createMenuCard(p) {
    const card = document.createElement('div');
    card.className = 'pop-card';
    card.innerHTML = `
    <div class="pop-card-img">${p.emoji}</div>
    <div class="pop-card-body">
      <div class="pop-card-name">${p.name}</div>
      <div class="pop-card-row">
        <div class="pop-card-price">$${p.price.toFixed(2)}</div>
        <button class="pop-card-plus" onclick="openProduct(${p.id},event)">+</button>
      </div>
    </div>`;
    card.onclick = () => openProduct(p.id);
    return card;
}

function renderPopular() {
    const wrap = document.getElementById('popular-n');
    PRODUCTS.filter(p => p.popular).forEach(p => {
        const card = document.createElement('div');
        card.className = 'pop-card';
        card.innerHTML = `
      <div class="pop-card-img">${p.emoji}</div>
      <div class="pop-card-body">
        <div class="pop-card-name">${p.name}</div>
        <div class="pop-card-row">
          <div class="pop-card-price">$${p.price.toFixed(2)}</div>
          <button class="pop-card-plus" onclick="openProduct(${p.id},event)">+</button>
        </div>
      </div>`;
        card.onclick = () => openProduct(p.id);
        wrap.appendChild(card);
    });
}

function renderReorder() {
    const wrap = document.getElementById('reorder-n');
    PAST_ORDERS.slice(0, 3).forEach(o => {
        const div = document.createElement('div');
        div.className = 'reorder-item-n';
        div.innerHTML = `
      <div class="ri-emoji">${o.emoji}</div>
      <div class="ri-info"><div class="ri-name">${o.items}</div><div class="ri-price">$${o.total.toFixed(2)}</div></div>
      <button class="ri-btn" onclick="reorderItem('${o.id}',event)">🔄 Reordenar</button>`;
        wrap.appendChild(div);
    });
}

function renderBranches() {
    const wrap = document.getElementById('branches-n');
    BRANCHES.forEach(b => {
        const div = document.createElement('div');
        div.className = 'branch-n';
        div.innerHTML = `<div class="branch-n-icon">🏪</div><div class="branch-n-info"><div class="branch-n-name">${b.name}</div><div class="branch-n-meta">${b.address} · ${b.wait}</div></div><div class="branch-n-dist">${b.dist} km</div>`;
        wrap.appendChild(div);
    });
}

function renderOrders() {
    const wrap = document.getElementById('orders-n');
    wrap.innerHTML = '';
    const statusMap = { delivered: 'Entregado', preparing: 'Preparando', received: 'Recibido', on_the_way: 'En camino' };
    const pillMap = { delivered: 'pill-green', preparing: 'pill-orange', received: 'pill-blue', on_the_way: 'pill-orange' };
    S.orders.forEach(o => {
        const div = document.createElement('div');
        div.className = 'order-n';
        div.innerHTML = `
      <div class="order-n-head">
        <span class="order-n-num">#${o.id}</span>
        <span class="status-pill-n ${pillMap[o.status] || 'pill-blue'}">${statusMap[o.status] || o.status}</span>
      </div>
      <div class="order-n-name">${o.emoji} ${o.items}</div>
      <div class="order-n-meta">${o.date} · +${o.pts} pts</div>
      <div class="order-n-footer">
        <span class="order-n-total">$${o.total.toFixed(2)}</span>
        <button class="reorder-btn-n" onclick="reorderItem('${o.id}',event)">🔄 Reordenar</button>
      </div>`;
        div.onclick = () => { if (o.status !== 'delivered') navigateTo('tracking'); };
        wrap.appendChild(div);
    });
}

function buildTimeSlots() {
    const wrap = document.getElementById('time-slots-n');
    ['12:00', '12:15', '12:30', '12:45', '13:00', '13:15', '13:30'].forEach(t => {
        const slot = document.createElement('div');
        slot.className = 'tslot-n' + (t === S.timeSlot ? ' active' : '');
        slot.textContent = t;
        slot.onclick = () => {
            document.querySelectorAll('.tslot-n').forEach(s => s.classList.remove('active'));
            slot.classList.add('active');
            S.timeSlot = t;
            hapticFeedback('light');
        };
        wrap.appendChild(slot);
    });
}

// ── PRODUCT MODAL ──────────────────────────────
function openProduct(id, e) {
    if (e) e.stopPropagation();
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    S.selectedProduct = p; S.selectedMods = {}; S.selectedQty = 1;
    document.getElementById('pm-hero').textContent = p.emoji;
    document.getElementById('pm-name').textContent = p.name;
    document.getElementById('pm-desc').textContent = p.desc;
    document.getElementById('pm-price').textContent = '$' + p.price.toFixed(2);
    document.getElementById('pm-qty').textContent = '1';
    document.getElementById('pm-notes').value = '';
    renderMods(p);
    updateModalTotal();
    document.getElementById('mod-product').classList.remove('hidden');
    hapticFeedback('light');
}

function renderMods(p) {
    const c = document.getElementById('mods-container');
    c.innerHTML = '';
    const mods = MODIFIERS_MAP[p.cat] || [];
    mods.forEach(group => {
        const gDiv = document.createElement('div');
        gDiv.className = 'mods-group';
        gDiv.innerHTML = `<div class="mods-group-title">${group.group}</div>`;
        const chips = document.createElement('div');
        chips.className = 'mods-chips';
        group.options.forEach((opt, i) => {
            const chip = document.createElement('div');
            chip.className = 'mod-chip';
            const pr = group.prices[i];
            chip.innerHTML = opt + (pr > 0 ? `<span class="mod-chip-price">+$${pr.toFixed(2)}</span>` : '');
            chip.onclick = () => {
                if (group.type === 'choice') {
                    chips.querySelectorAll('.mod-chip').forEach(c => c.classList.remove('selected'));
                    chip.classList.add('selected');
                    S.selectedMods[group.group] = { label: opt, price: pr };
                } else {
                    chip.classList.toggle('selected');
                    if (!S.selectedMods[group.group]) S.selectedMods[group.group] = [];
                    const arr = S.selectedMods[group.group];
                    const idx = arr.findIndex(x => x.label === opt);
                    if (idx >= 0) arr.splice(idx, 1); else arr.push({ label: opt, price: pr });
                }
                updateModalTotal();
                hapticFeedback('light');
            };
            chips.appendChild(chip);
        });
        gDiv.appendChild(chips);
        c.appendChild(gDiv);
    });
}

function changeQty(d) {
    S.selectedQty = Math.max(1, Math.min(10, S.selectedQty + d));
    document.getElementById('pm-qty').textContent = S.selectedQty;
    updateModalTotal();
    hapticFeedback('light');
}

function updateModalTotal() {
    if (!S.selectedProduct) return;
    let extra = 0;
    Object.values(S.selectedMods).forEach(v => Array.isArray(v) ? v.forEach(x => extra += x.price) : v && (extra += v.price));
    const total = (S.selectedProduct.price + extra) * S.selectedQty;
    const el = document.getElementById('pm-total');
    if (el) el.textContent = '$' + total.toFixed(2);
    const btn = document.getElementById('btn-add-n');
    if (btn) btn.textContent = 'Añadir · $' + total.toFixed(2);
}

function addToCartFromModal() {
    if (!S.selectedProduct) return;
    let extra = 0; const labels = [];
    Object.values(S.selectedMods).forEach(v => Array.isArray(v) ? v.forEach(x => { extra += x.price; labels.push(x.label); }) : v && (extra += v.price, labels.push(v.label)));
    const uPrice = S.selectedProduct.price + extra;
    const ex = S.cart.find(c => c.id === S.selectedProduct.id && JSON.stringify(c.mods) === JSON.stringify(labels));
    if (ex) { ex.qty += S.selectedQty; } else {
        S.cart.push({ id: S.selectedProduct.id, name: S.selectedProduct.name, emoji: S.selectedProduct.emoji, unitPrice: uPrice, qty: S.selectedQty, mods: labels, notes: document.getElementById('pm-notes').value, pts: S.selectedProduct.pts });
    }
    closeMod('product');
    updateCartBadge();
    showToast(S.selectedProduct.emoji + ' Añadido al carrito');
    hapticFeedback('success');
}

// ── CART ──────────────────────────────────────
function updateCartBadge() {
    const count = S.cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('nnav-badge');
    const counter = document.getElementById('cart-counter');
    if (badge) { badge.textContent = count; badge.classList.toggle('hidden', count === 0); }
    if (counter) counter.textContent = count;
}

function renderCart() {
    const list = document.getElementById('cart-list-n');
    const emptyEl = document.getElementById('cart-empty-n');
    const footer = document.getElementById('cart-footer-n');
    const promoF = document.getElementById('promo-field-n');
    const loyaltyR = document.getElementById('loyalty-n-row');
    list.innerHTML = '';
    if (S.cart.length === 0) {
        emptyEl.classList.remove('hidden');
        if (footer) footer.style.display = 'none';
        if (promoF) promoF.style.display = 'none';
        if (loyaltyR) loyaltyR.style.display = 'none';
        document.getElementById('totals-n').innerHTML = '';
        return;
    }
    emptyEl.classList.add('hidden');
    if (footer) footer.style.display = 'block';
    if (promoF) promoF.style.display = 'flex';
    if (loyaltyR) loyaltyR.style.display = 'flex';

    S.cart.forEach((item, idx) => {
        const div = document.createElement('div');
        div.className = 'cart-item-n';
        div.innerHTML = `
      <div class="cin-emoji">${item.emoji}</div>
      <div class="cin-info">
        <div class="cin-name">${item.name}</div>
        ${item.mods.length ? `<div class="cin-mods">${item.mods.join(' · ')}</div>` : ''}
        <div class="cin-qty-row">
          <button class="cin-qty-btn" onclick="changeCartQty(${idx},-1)">−</button>
          <span class="cin-qty-val">${item.qty}</span>
          <button class="cin-qty-btn" onclick="changeCartQty(${idx},1)">+</button>
        </div>
      </div>
      <div class="cin-right">
        <button class="cin-remove" onclick="removeItem(${idx})">🗑️</button>
        <div class="cin-price">$${(item.unitPrice * item.qty).toFixed(2)}</div>
      </div>`;
        list.appendChild(div);
    });
    renderTotals();
}

function changeCartQty(idx, d) { S.cart[idx].qty = Math.max(1, S.cart[idx].qty + d); renderCart(); updateCartBadge(); hapticFeedback('light'); }
function removeItem(idx) { S.cart.splice(idx, 1); renderCart(); updateCartBadge(); hapticFeedback('light'); }
function clearCart() { S.cart = []; renderCart(); updateCartBadge(); }

function renderTotals() {
    const sub = S.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const tax = sub * 0.16;
    const del = S.orderType === 'delivery' ? 2.50 : 0;
    const promo = S.promoDiscount;
    const loyalty = S.useLoyaltyPts ? Math.min(3.50, sub * 0.1) : 0;
    const total = sub + tax + del - promo - loyalty;
    const pts = Math.floor(total * 10);
    document.getElementById('totals-n').innerHTML = `
    <div class="tn-row"><span>Subtotal</span><span>$${sub.toFixed(2)}</span></div>
    <div class="tn-row"><span>Impuestos (16%)</span><span>$${tax.toFixed(2)}</span></div>
    ${del > 0 ? `<div class="tn-row"><span>Costo de envío</span><span>$${del.toFixed(2)}</span></div>` : ''}
    ${promo > 0 ? `<div class="tn-row" style="color:var(--success)"><span>Descuento</span><span>-$${promo.toFixed(2)}</span></div>` : ''}
    ${loyalty > 0 ? `<div class="tn-row" style="color:var(--accent)"><span>Puntos canjeados</span><span>-$${loyalty.toFixed(2)}</span></div>` : ''}
    <div class="tn-row main"><span>Total</span><span>$${total.toFixed(2)} <span class="tn-pts">+${pts} pts</span></span></div>`;
    const btn = document.getElementById('checkout-total-n');
    if (btn) btn.textContent = '$' + total.toFixed(2);
}

function setOT(type) {
    S.orderType = type;
    document.getElementById('ot-pickup').classList.toggle('active', type === 'pickup');
    document.getElementById('ot-delivery').classList.toggle('active', type === 'delivery');
    document.getElementById('pickup-detail').classList.toggle('hidden', type !== 'pickup');
    document.getElementById('delivery-detail').classList.toggle('hidden', type !== 'delivery');
    renderTotals();
    hapticFeedback('light');
}

function applyPromo() {
    const code = document.getElementById('promo-n-input').value.toUpperCase().trim();
    if (code === 'QUICKBITE30') { S.promoDiscount = 3.00; showToast('✅ Descuento de $3.00 aplicado'); hapticFeedback('success'); }
    else { S.promoDiscount = 0; showToast('Código no válido'); }
    renderTotals();
}

function toggleLoyalty() {
    S.useLoyaltyPts = document.getElementById('pts-toggle').checked;
    renderTotals();
    hapticFeedback('light');
}

// ── ORDER ─────────────────────────────────────
function placeOrder() {
    if (S.cart.length === 0) { showToast('Añade productos al carrito'); return; }
    S.orderCounter++;
    const sub = S.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    const tax = sub * 0.16;
    const del = S.orderType === 'delivery' ? 2.50 : 0;
    const total = sub + tax + del - S.promoDiscount - (S.useLoyaltyPts ? Math.min(3.50, sub * 0.1) : 0);
    const pts = Math.floor(total * 10);

    const newOrder = { id: 'QB-' + S.orderCounter, items: S.cart.map(i => i.name).join(' + '), total, emoji: S.cart[0].emoji, status: 'received', date: 'Hoy', pts };
    S.orders.unshift(newOrder);

    document.getElementById('conf-num').textContent = newOrder.id;
    document.getElementById('conf-eta-n').textContent = S.orderType === 'delivery' ? '25-35 min' : S.timeSlot;
    document.getElementById('conf-pts-n').textContent = '+' + pts + ' pts';
    document.getElementById('mod-confirmed').classList.remove('hidden');

    S.pts += pts;
    document.getElementById('pts-big-n').textContent = S.pts;
    document.getElementById('hh-pts').textContent = S.pts;
    S.cart = []; updateCartBadge(); renderOrders();
    hapticFeedback('success');

    setTimeout(() => triggerPush(0), 3000);
    setTimeout(() => triggerPush(1), 10000);
}

function goToTracking() {
    document.getElementById('mod-confirmed').classList.add('hidden');
    navigateTo('tracking');
}

function closeConfirmed() {
    document.getElementById('mod-confirmed').classList.add('hidden');
    navigateTo('home');
}

function reorderItem(id, e) {
    if (e) e.stopPropagation();
    const o = S.orders.find(x => x.id === id) || PAST_ORDERS.find(x => x.id === id);
    if (!o) return;
    const p = PRODUCTS.find(x => x.cat === 'Combos') || PRODUCTS[0];
    S.cart.push({ id: p.id, name: o.items.split(' + ')[0], emoji: o.emoji, unitPrice: o.total / 1.16, qty: 1, mods: [], notes: '', pts: o.pts });
    updateCartBadge();
    showToast('✅ Añadido al carrito');
    hapticFeedback('success');
    navigateTo('cart');
}

// ── MAPS ──────────────────────────────────────
function initTrackingMap() {
    setTimeout(() => {
        const el = document.getElementById('map-n');
        if (!el) return;
        if (S.mapInstance) { S.mapInstance.invalidateSize(); return; }

        const CDMX = [19.4326, -99.1332];
        S.mapInstance = L.map('map-n', { zoomControl: false, attributionControl: false }).setView(CDMX, 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(S.mapInstance);

        const mkRest = L.divIcon({ html: '<div style="font-size:28px">🏪</div>', className: '', iconAnchor: [14, 28] });
        const mkDest = L.divIcon({ html: '<div style="font-size:28px">🏠</div>', className: '', iconAnchor: [14, 28] });
        const mkRider = L.divIcon({ html: '<div style="font-size:28px">🛵</div>', className: '', iconAnchor: [14, 14] });

        const rest = [19.4340, -99.1360], dest = [19.4300, -99.1290];
        L.marker(rest, { icon: mkRest }).addTo(S.mapInstance);
        L.marker(dest, { icon: mkDest }).addTo(S.mapInstance);
        S.riderMarker = L.marker([19.4345, -99.1350], { icon: mkRider }).addTo(S.mapInstance);
        L.polyline([rest, dest], { color: '#FF416C', weight: 3, dashArray: '8 8', opacity: 0.85 }).addTo(S.mapInstance);

        const path = [[19.4345, -99.1350], [19.4338, -99.1338], [19.4325, -99.1320], [19.4310, -99.1302], [19.4300, -99.1290]];
        let t = 0, eta = 18;
        clearInterval(S.etaTimer);
        S.etaTimer = setInterval(() => {
            t++;
            if (t < path.length) { S.riderMarker.setLatLng(path[t]); S.mapInstance.panTo(path[t], { animate: true, duration: 1 }); }
            if (eta > 0) { eta--; const e = document.getElementById('eta-n'); if (e) e.textContent = eta + ' min'; }
            if (eta === 0) { clearInterval(S.etaTimer); const e = document.getElementById('eta-n'); if (e) e.textContent = '¡Llegó! 🎉'; triggerPush(4); hapticFeedback('success'); }
        }, 3000);
    }, 300);
}

function openDeliveryMap() {
    document.getElementById('mod-delivery').classList.remove('hidden');
    setTimeout(() => {
        if (!S.deliveryMap) {
            S.deliveryMap = L.map('delivery-map-n', { zoomControl: false }).setView([19.4326, -99.1332], 15);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(S.deliveryMap);
            L.marker([19.4326, -99.1332]).addTo(S.deliveryMap);
        } else S.deliveryMap.invalidateSize();
    }, 200);
}

function confirmAddr() {
    closeMod('delivery');
    showToast('📍 Dirección confirmada');
    hapticFeedback('success');
}

// ── WALLET / REWARDS ─────────────────────────
function renderWallet() {
    const grid = document.getElementById('rewards-n');
    REWARDS.forEach(r => {
        const div = document.createElement('div');
        div.className = 'reward-n';
        div.innerHTML = `<div class="reward-n-icon">${r.icon}</div><div class="reward-n-name">${r.name}</div><div class="reward-n-pts">${r.ptsReq} pts</div>`;
        div.onclick = () => openReward(r);
        grid.appendChild(div);
    });
    const hist = document.getElementById('pts-hist-n');
    LOYALTY_HISTORY.forEach(h => {
        const div = document.createElement('div');
        div.className = 'ph-n';
        div.innerHTML = `<div class="ph-n-i ${h.type}">${h.icon}</div><div class="ph-n-info"><div class="ph-n-desc">${h.desc}</div><div class="ph-n-date">${h.date}</div></div><div class="ph-n-pts ${h.type}">${h.pts > 0 ? '+' : ''}${h.pts}</div>`;
        hist.appendChild(div);
    });
}

function openReward(r) {
    S.selectedReward = r;
    document.getElementById('rm-hero').textContent = r.icon;
    document.getElementById('rm-title').textContent = r.name;
    document.getElementById('rm-desc').textContent = r.desc;
    document.getElementById('rm-pts').textContent = r.ptsReq;
    const btn = document.getElementById('rm-btn');
    const canRedeem = S.pts >= r.ptsReq;
    btn.textContent = canRedeem ? 'Canjear recompensa ✨' : `Necesitas ${r.ptsReq - S.pts} pts más`;
    btn.disabled = !canRedeem;
    btn.style.opacity = canRedeem ? '1' : '0.5';
    document.getElementById('mod-reward').classList.remove('hidden');
    hapticFeedback('light');
}

function redeemReward() {
    if (!S.selectedReward || S.pts < S.selectedReward.ptsReq) return;
    S.pts -= S.selectedReward.ptsReq;
    document.getElementById('pts-big-n').textContent = S.pts;
    document.getElementById('hh-pts').textContent = S.pts;
    closeMod('reward');
    showToast('🎉 ¡' + S.selectedReward.name + ' canjeado!');
    hapticFeedback('success');
}

// ── MODALS ────────────────────────────────────
function closeMod(id, e) {
    const overlay = document.getElementById('mod-' + id);
    if (e && e.target !== overlay) return;
    if (overlay) overlay.classList.add('hidden');
}

function showAddressSheet() {
    document.getElementById('mod-address').classList.remove('hidden');
    hapticFeedback('light');
}

// ── PUSH NOTIFICATIONS ────────────────────────
let pushIdx = 0;
function triggerPush(idx) {
    const msg = PUSH_MESSAGES[idx % PUSH_MESSAGES.length];
    document.getElementById('push-title').textContent = msg.title;
    document.getElementById('push-text').textContent = msg.text;
    document.querySelector('.push-app-icon').textContent = msg.icon;
    const el = document.getElementById('push-notif');
    el.classList.remove('hidden');
    setTimeout(() => el.classList.add('hidden'), 5500);
}
function closePush() { document.getElementById('push-notif').classList.add('hidden'); }
function showPushDemo() { triggerPush(pushIdx++); }
function scheduleAutoPush() { setTimeout(() => triggerPush(3), 9000); }

// ── TOAST ─────────────────────────────────────
let toastTimer;
function showToast(msg) {
    const el = document.getElementById('toast');
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}
