// ═══════════════════════════════════════════
//  QuickBite – improvements.js
//  All 18 enhancements
// ═══════════════════════════════════════════

/* ══════ STATE EXTENSIONS ══════ */
const IMP = {
    lang: 'es',
    theme: 'dark',
    favorites: new Set(JSON.parse(localStorage.getItem('qb_fav') || '[]')),
    ratingOrder: null,
    deferredInstall: null,
    menuPage: 0,
    menuPageSize: 6,
    menuFilter: 'all',
    flashEnd: null,
    visibleProducts: [],
    upsellTimer: null,
    ratingShown: false,
};

/* ══════ i18n STRINGS ══════ */
const STRINGS = {
    es: {
        home: 'Inicio', menu: 'Menú', cart: 'Carrito', orders: 'Pedidos', profile: 'Perfil',
        search: 'Busca tu favorito...', categories: 'Categorías', seeAll: 'Ver todo →',
        reorder: '🔄 Reordenar', popular: '⭐ Más populares', nearby: '📍 Sucursales cercanas',
        confirmOrder: 'Confirmar Pedido', subtotal: 'Subtotal', tax: 'Impuestos (16%)',
        delivery: 'Costo de envío', discount: 'Descuento', total: 'Total',
        emptyCart: 'Tu carrito está vacío', flashDeals: '⚡ Ofertas Flash', favorites: '❤️ Mis Favoritos',
        pickUp: 'Recoger', deliveryMode: 'Delivery', share: 'Compartir por WhatsApp',
        addToCart: 'Añadir al carrito', calories: 'Calorías est.', lightMode: 'Modo claro',
        darkMode: 'Modo oscuro', language: 'Idioma',
    },
    en: {
        home: 'Home', menu: 'Menu', cart: 'Cart', orders: 'Orders', profile: 'Profile',
        search: 'Search your favorite...', categories: 'Categories', seeAll: 'See all →',
        reorder: '🔄 Reorder', popular: '⭐ Most popular', nearby: '📍 Nearby branches',
        confirmOrder: 'Confirm Order', subtotal: 'Subtotal', tax: 'Taxes (16%)',
        delivery: 'Delivery fee', discount: 'Discount', total: 'Total',
        emptyCart: 'Your cart is empty', flashDeals: '⚡ Flash Deals', favorites: '❤️ My Favorites',
        pickUp: 'Pick-up', deliveryMode: 'Delivery', share: 'Share via WhatsApp',
        addToCart: 'Add to cart', calories: 'Est. Calories', lightMode: 'Light mode',
        darkMode: 'Dark mode', language: 'Language',
    }
};
function t(key) { return STRINGS[IMP.lang][key] || key; }

/* ══════ #11 SERVICE WORKER ══════ */
function registerSW() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/js/sw.js').then(reg => {
            console.log('SW registered:', reg.scope);
        }).catch(() => { });
    }
}

/* ══════ #13 PWA INSTALL PROMPT ══════ */
function initPWAInstall() {
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        IMP.deferredInstall = e;
        const prompt = document.getElementById('install-prompt');
        if (prompt && !localStorage.getItem('qb_install_dismissed')) {
            setTimeout(() => prompt.classList.add('show'), 12000);
        }
    });
    const installBtn = document.getElementById('pwa-install-btn');
    if (installBtn) installBtn.onclick = async () => {
        if (!IMP.deferredInstall) return;
        IMP.deferredInstall.prompt();
        const { outcome } = await IMP.deferredInstall.userChoice;
        if (outcome === 'accepted') document.getElementById('install-prompt').classList.remove('show');
        IMP.deferredInstall = null;
    };
    const dismissBtn = document.getElementById('pwa-dismiss-btn');
    if (dismissBtn) dismissBtn.onclick = () => {
        document.getElementById('install-prompt').classList.remove('show');
        localStorage.setItem('qb_install_dismissed', '1');
    };
}

/* ══════ #8 DARK / LIGHT MODE ══════ */
function initTheme() {
    const saved = localStorage.getItem('qb_theme') || 'dark';
    setTheme(saved);
}
function setTheme(theme) {
    IMP.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('qb_theme', theme);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = theme === 'dark' ? '🌙' : '☀️';
}
function toggleTheme() {
    setTheme(IMP.theme === 'dark' ? 'light' : 'dark');
    showToast(IMP.theme === 'dark' ? '🌙 Modo oscuro' : '☀️ Modo claro');
}

/* ══════ #16 i18n ══════ */
function initI18n() {
    const saved = localStorage.getItem('qb_lang') || 'es';
    setLang(saved);
}
function setLang(lang) {
    IMP.lang = lang;
    localStorage.setItem('qb_lang', lang);
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (STRINGS[lang][key]) el.textContent = STRINGS[lang][key];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = el.getAttribute('data-i18n-ph');
        if (STRINGS[lang][key]) el.placeholder = STRINGS[lang][key];
    });
    document.querySelectorAll('.lang-opt').forEach(el => {
        el.classList.toggle('active', el.dataset.lang === lang);
    });
}
function switchLang(lang) {
    setLang(lang);
    showToast(lang === 'es' ? '🇪🇸 Español activado' : '🇺🇸 English activated');
}

/* ══════ #1 SKELETON LOADERS ══════ */
function showSkeletons(containerId, count = 6) {
    const el = document.getElementById(containerId);
    if (!el) return;
    el.innerHTML = '';
    for (let i = 0; i < count; i++) {
        el.innerHTML += `
      <div class="skeleton-card stagger-item">
        <div class="sk-img skeleton"></div>
        <div class="sk-body">
          <div class="sk-title skeleton"></div>
          <div class="sk-row"><div class="sk-price skeleton"></div><div class="sk-btn skeleton"></div></div>
        </div>
      </div>`;
    }
}

function showSkeletonReorder() {
    const el = document.getElementById('reorder-section');
    if (!el) return;
    el.innerHTML = `
    <div class="sk-reorder-item skeleton-card stagger-item">
      <div class="sk-avatar skeleton"></div>
      <div class="sk-info"><div class="sk-line-long skeleton"></div><div class="sk-line-short skeleton"></div></div>
      <div class="sk-reo-btn skeleton"></div>
    </div>`.repeat(2);
}

/* ══════ #2 LIVE SEARCH DROPDOWN ══════ */
function initLiveSearch() {
    const input = document.getElementById('menu-search');
    const dropdown = document.getElementById('search-dropdown');
    if (!input || !dropdown) return;

    input.addEventListener('input', () => {
        const q = input.value.trim().toLowerCase();
        if (!q) { dropdown.classList.remove('open'); return; }
        const results = PRODUCTS.filter(p =>
            p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q)
        ).slice(0, 6);
        if (!results.length) {
            dropdown.innerHTML = `<div class="sd-empty">Sin resultados para "${input.value}"</div>`;
        } else {
            dropdown.innerHTML = results.map(p => `
        <div class="sd-item" onclick="openProduct(${p.id}); closeSearchDropdown()">
          <div class="sd-emoji">${p.emoji}</div>
          <div class="sd-info">
            <div class="sd-name">${p.name}</div>
            <div class="sd-cat">${p.cat} · ⭐${p.rating}</div>
          </div>
          <div class="sd-price">$${p.price.toFixed(2)}</div>
        </div>`).join('');
        }
        dropdown.classList.add('open');
    });

    document.addEventListener('click', e => {
        if (!e.target.closest('.search-wrapper')) closeSearchDropdown();
    });
}
function closeSearchDropdown() {
    const dd = document.getElementById('search-dropdown');
    if (dd) dd.classList.remove('open');
}

/* ══════ #3 UPSELL POPUP ══════ */
function showUpsell(addedProduct) {
    clearTimeout(IMP.upsellTimer);
    const popup = document.getElementById('upsell-popup');
    if (!popup) return;
    const candidates = PRODUCTS.filter(p =>
        p.id !== addedProduct.id &&
        (p.cat === 'Bebidas' || p.cat === 'Snacks') &&
        p.price < 6
    ).slice(0, 4);
    if (!candidates.length) return;

    popup.querySelector('.upsell-title').textContent = `¿Le añades algo más? 🤔`;
    const grid = popup.querySelector('.upsell-grid');
    grid.innerHTML = candidates.map(p => `
    <div class="upsell-item" onclick="quickAddToCart(${p.id}); closeUpsell()">
      <span class="upsell-item-emoji">${p.emoji}</span>
      <div class="upsell-item-name">${p.name}</div>
      <div class="upsell-item-price">+$${p.price.toFixed(2)}</div>
    </div>`).join('');

    popup.classList.add('show');
    IMP.upsellTimer = setTimeout(closeUpsell, 6000);
}
function closeUpsell() {
    const popup = document.getElementById('upsell-popup');
    if (popup) popup.classList.remove('show');
}
function quickAddToCart(id) {
    const p = PRODUCTS.find(x => x.id === id);
    if (!p) return;
    const ex = state.cart.find(c => c.id === p.id && c.mods.length === 0);
    if (ex) ex.qty++;
    else state.cart.push({ id: p.id, name: p.name, emoji: p.emoji, unitPrice: p.price, qty: 1, mods: [], notes: '', pts: p.pts });
    updateCartBadge(); updateFloatingCart();
    showToast(`${p.emoji} Añadido`);
}

/* ══════ #6 FLOATING CART ══════ */
function updateFloatingCart() {
    const fc = document.getElementById('floating-cart');
    if (!fc) return;
    const count = state.cart.reduce((s, i) => s + i.qty, 0);
    const total = state.cart.reduce((s, i) => s + i.unitPrice * i.qty, 0);
    if (count > 0 && state.currentScreen !== 'cart') {
        fc.querySelector('.fc-badge').textContent = count;
        fc.querySelector('.fc-price').textContent = '$' + total.toFixed(2);
        const items = state.cart.slice(0, 2).map(i => i.emoji).join('');
        fc.querySelector('.fc-text').textContent = items + ' ' + count + (count === 1 ? ' producto' : ' productos');
        fc.classList.add('visible');
    } else {
        fc.classList.remove('visible');
    }
}

/* ══════ #4 ACTIVE ORDER BAR ══════ */
function showActiveOrderBar(orderNum) {
    const bar = document.getElementById('active-order-bar');
    if (!bar) return;
    bar.querySelector('.aob-title').textContent = '🛵 Tu pedido #' + orderNum + ' está en camino';
    bar.querySelector('.aob-sub').textContent = 'Toca para rastrear en el mapa';
    bar.classList.add('show');
    bar.onclick = () => navigateTo('tracking');
    setTimeout(() => bar.classList.remove('show'), 30000);
}

/* ══════ #14 FLASH DEALS ══════ */
function initFlashDeals() {
    const section = document.getElementById('flash-deals-section');
    if (!section) return;
    const now = new Date();
    IMP.flashEnd = new Date(now);
    IMP.flashEnd.setHours(23, 59, 59, 0);

    const deals = [
        { ...PRODUCTS.find(p => p.id === 1), discount: 0.30 },
        { ...PRODUCTS.find(p => p.id === 3), discount: 0.25 },
        { ...PRODUCTS.find(p => p.id === 2), discount: 0.20 },
        { ...PRODUCTS.find(p => p.id === 7), discount: 0.35 },
    ].filter(d => d.id);

    const row = document.getElementById('flash-deals-row');
    if (row) {
        row.innerHTML = deals.map(d => {
            const oldP = d.price; const newP = d.price * (1 - d.discount);
            const pct = Math.floor(d.discount * 100);
            const stock = Math.floor(Math.random() * 15) + 5;
            const used = Math.floor(stock * 0.6);
            return `
        <div class="flash-deal-card stagger-item" onclick="openProduct(${d.id})">
          <div class="flash-deal-img">${d.emoji}</div>
          <div class="flash-deal-badge">-${pct}%</div>
          <div class="flash-deal-body">
            <div class="flash-deal-name">${d.name}</div>
            <div class="flash-deal-prices">
              <span class="flash-deal-new">$${newP.toFixed(2)}</span>
              <span class="flash-deal-old">$${oldP.toFixed(2)}</span>
            </div>
            <div class="flash-deal-bar"><div class="flash-deal-fill" style="width:${Math.round(used / stock * 100)}%"></div></div>
            <div class="flash-deal-stock">${stock - used} disponibles</div>
          </div>
        </div>`;
        }).join('');
    }

    function tick() {
        const diff = IMP.flashEnd - new Date();
        if (diff <= 0) return;
        const h = String(Math.floor(diff / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
        const els = section.querySelectorAll('.flash-num');
        if (els[0]) els[0].textContent = h;
        if (els[1]) els[1].textContent = m;
        if (els[2]) els[2].textContent = s;
    }
    tick();
    setInterval(tick, 1000);
}

/* ══════ #15 FAVORITES / WISHLIST ══════ */
function toggleFavorite(productId, btn) {
    const id = parseInt(productId);
    if (IMP.favorites.has(id)) {
        IMP.favorites.delete(id);
        btn.classList.remove('liked');
        showToast('Eliminado de favoritos');
    } else {
        IMP.favorites.add(id);
        btn.classList.add('liked');
        btn.style.transform = 'scale(1.4)';
        setTimeout(() => btn.style.transform = '', 300);
        showToast('❤️ Añadido a favoritos');
    }
    localStorage.setItem('qb_fav', JSON.stringify([...IMP.favorites]));
    updateFavIcon(id);
}
function updateFavIcon(id) {
    document.querySelectorAll(`[data-fav-id="${id}"]`).forEach(btn => {
        btn.classList.toggle('liked', IMP.favorites.has(id));
    });
}
function isLiked(id) { return IMP.favorites.has(parseInt(id)); }
function renderFavorites() {
    const favProductIds = [...IMP.favorites];
    const products = PRODUCTS.filter(p => favProductIds.includes(p.id));
    const grid = document.getElementById('favorites-grid');
    if (!grid) return;
    if (!products.length) {
        grid.innerHTML = `<div class="favorites-empty"><span class="fe-emoji">❤️</span><p>Aún no tienes favoritos.<br/>Toca ❤️ en cualquier producto.</p></div>`;
        return;
    }
    grid.innerHTML = '';
    products.forEach(p => { const card = createProductCardWithFav(p); grid.appendChild(card); });
}
function createProductCardWithFav(p) {
    const wrap = document.createElement('div');
    wrap.className = 'product-card-wrap stagger-item';
    wrap.innerHTML = `
    <div class="pop-card">
      <div class="pop-card-img" style="position:relative">
        ${p.emoji}
        <button class="heart-btn ${isLiked(p.id) ? 'liked' : ''}" data-fav-id="${p.id}" onclick="toggleFavorite(${p.id},this);event.stopPropagation()"></button>
      </div>
      <div class="pop-card-body">
        <div class="pop-card-name">${p.name}</div>
        <div class="pop-card-row">
          <div class="pop-card-price">$${p.price.toFixed(2)}</div>
          <button class="pop-card-plus" onclick="openProduct(${p.id},event)">+</button>
        </div>
      </div>
    </div>`;
    wrap.querySelector('.pop-card').onclick = () => openProduct(p.id);
    return wrap;
}

/* ══════ #10 STAR RATING ══════ */
function openRatingModal(order) {
    IMP.ratingOrder = order;
    IMP.ratingShown = true;
    const modal = document.getElementById('rating-modal');
    if (!modal) return;
    modal.querySelector('.rating-order-info').textContent = `📦 Pedido #${order?.id || 'reciente'} · ${order?.items?.split(' + ')[0] || 'tu pedido'}`;
    // Reset stars
    modal.querySelectorAll('.star-btn').forEach(s => state.classList.remove('active'));
    modal.querySelector('.rating-comment').value = '';
    modal.querySelectorAll('.rq-chip').forEach(c => c.classList.remove('selected'));
    modal.classList.remove('hidden');
}
function setRating(stars) {
    document.querySelectorAll('.star-btn').forEach((s, i) => {
        state.classList.toggle('active', i < stars);
    });
}
function toggleRatingChip(chip) {
    chip.classList.toggle('selected');
}
function submitRating() {
    const stars = document.querySelectorAll('.star-btn.active').length;
    if (!stars) { showToast('Selecciona una puntuación'); return; }
    const modal = document.getElementById('rating-modal');
    modal.classList.add('hidden');
    state.pts += 15;
    document.getElementById('hh-pts') && (document.getElementById('hh-pts').textContent = state.pts);
    showToast(`⭐ ¡Gracias! +15 pts por tu reseña`);
}

/* ══════ #12 INFINITE SCROLL ══════ */
function initInfiniteScroll() {
    const scrollEl = document.querySelector('.menu-scroll');
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        if (scrollTop + clientHeight >= scrollHeight - 60) loadMoreProducts();
    });
}
function loadMoreProducts() {
    if (IMP.loading) return;
    IMP.loading = true;
    const spinner = document.getElementById('load-more-spinner');
    if (spinner) spinner.style.display = 'flex';
    setTimeout(() => {
        IMP.menuPage++;
        const allInCat = IMP.menuFilter === 'favorites'
            ? PRODUCTS.filter(p => IMP.favorites.has(p.id))
            : PRODUCTS.filter(p => !state.activeCategory || p.cat === state.activeCategory);
        const start = IMP.menuPage * IMP.menuPageSize;
        const more = allInCat.slice(start, start + IMP.menuPageSize);
        const grid = document.getElementById('products-grid');
        more.forEach(p => {
            const card = createProductCardWithFav(p);
            grid.appendChild(card);
        });
        if (spinner) spinner.style.display = 'none';
        IMP.loading = false;
    }, 800);
}

/* ══════ #17 CALORIE CALCULATOR ══════ */
function updateCalorieBar() {
    const bar = document.getElementById('cal-bar');
    const totalEl = document.getElementById('cal-total');
    const fillEl = document.getElementById('cal-fill');
    const labelEl = document.getElementById('cal-label-txt');
    if (!bar) return;
    const totalCal = state.cart.reduce((sum, item) => {
        const p = PRODUCTS.find(x => x.id === item.id);
        return sum + ((p?.calories || 350) * item.qty);
    }, 0);
    const dailyReq = 2000;
    const pct = Math.min(100, Math.round((totalCal / dailyReq) * 100));
    if (totalEl) totalEl.textContent = totalCal + ' kcal';
    if (fillEl) fillEl.style.width = pct + '%';
    if (labelEl) labelEl.textContent = `${pct}% del requerimiento diario (${dailyReq} kcal)`;
    if (fillEl) {
        fillEl.style.background = pct < 40 ? 'linear-gradient(90deg,var(--success),#11998e)'
            : pct < 70 ? 'linear-gradient(90deg,var(--accent),#f07f17)'
                : 'linear-gradient(90deg,var(--danger),#c0392b)';
    }
}

/* ══════ #18 SHARE ══════ */
function shareOrder(orderId, items, total) {
    const msg = `🍔 *QuickBite* – ¡Acabo de pedir!\n📦 Pedido #${orderId}\n🛒 ${items}\n💰 Total: $${total?.toFixed(2) || '--'}\n\n¡Descarga la app! 👉 http://localhost:8080`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    if (navigator.share) {
        navigator.share({ title: 'Mi pedido en QuickBite', text: msg });
    } else {
        window.open(url, '_blank');
    }
}
function shareCurrentOrder() {
    const o = state.orders[0];
    if (!o) { showToast('No hay pedido para compartir'); return; }
    shareOrder(o.id, o.items, o.total);
}

/* ══════ #5 ONE-TAP REORDER ══════ */
function oneTapReorder() {
    const lastOrder = state.orders.find(o => o.status === 'delivered') || PAST_ORDERS[0];
    if (!lastOrder) return;
    const p = PRODUCTS.find(x => x.cat === 'Combos') || PRODUCTS[0];
    state.cart.push({ id: p.id, name: lastOrder.items.split(' + ')[0], emoji: lastOrder.emoji, unitPrice: lastOrder.total / 1.16, qty: 1, mods: [], notes: '', pts: lastOrder.pts });
    updateCartBadge(); updateFloatingCart();
    showToast('✅ Listo para pedir de nuevo');
    navigateTo('cart');
}

/* ══════ ENHANCED renderCart PATCH ══════ */
const _origRenderCart = window.renderCart;
window.renderCart = function () {
    _origRenderCart && _origRenderCart();
    updateCalorieBar();
    updateFloatingCart();
};

/* ══════ ENHANCED addToCartFromModal PATCH ══════ */
const _origAdd = window.addToCartFromModal;
window.addToCartFromModal = function () {
    const p = state.selectedProduct;
    _origAdd && _origAdd();
    if (p) {
        updateFloatingCart();
        setTimeout(() => showUpsell(p), 700);
    }
};

/* ══════ ENHANCED placeOrder PATCH ══════ */
const _origPlace = window.placeOrder;
window.placeOrder = function () {
    _origPlace && _origPlace();
    const order = state.orders[0];
    if (order) {
        setTimeout(() => showActiveOrderBar(order.id), 4000);
        setTimeout(() => { if (!IMP.ratingShown) openRatingModal(order); }, 35000);
    }
};

/* ══════ INJECT NEW PRODUCT CARDS WITH STAGGER & HEART ══════ */
const _origRenderProductsArr = window.renderProductsArr;
window.renderProductsArr = function (products) {
    const grid = document.getElementById('products-grid');
    if (!grid) { _origRenderProductsArr && _origRenderProductsArr(products); return; }
    grid.innerHTML = '';
    IMP.menuPage = 0;
    const toShow = products.slice(0, IMP.menuPageSize);
    toShow.forEach(p => grid.appendChild(createProductCardWithFav(p)));
    IMP.visibleProducts = products;
};

/* ══════ FILTER BUTTONS ══════ */
function setMenuFilter(filter, btn) {
    IMP.menuFilter = filter;
    document.querySelectorAll('.menu-sort-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    if (filter === 'favorites') {
        const favs = PRODUCTS.filter(p => IMP.favorites.has(p.id));
        renderProductsArr(favs);
    } else if (filter === 'popular') {
        renderProductsArr(PRODUCTS.filter(p => p.popular));
    } else {
        renderProducts(state.activeCategory);
    }
}

/* ══════ BOOT ══════ */
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initI18n();
    registerSW();
    initPWAInstall();
    initLiveSearch();
    initFlashDeals();
    initInfiniteScroll();

    // Override navigateTo to hide floating cart when on cart screen
    const origNav = window.navigateTo;
    window.navigateTo = function (screen, ...args) {
        origNav && origNav(screen, ...args);
        updateFloatingCart();
    };
});
