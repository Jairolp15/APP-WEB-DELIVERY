// ═══════════════════════════════════════════
//   QuickBite – Mock Data
// ═══════════════════════════════════════════

const CATEGORIES = ['Hamburguesas','Bebidas','Combos','Postres','Snacks'];

const PRODUCTS = [
  // Hamburguesas
  { id:1, cat:'Hamburguesas', name:'Classic Burger', desc:'Carne 100% res, lechuga, tomate, queso americano y salsa especial.', price:8.50, emoji:'🍔', rating:4.8, pts:85, popular:true },
  { id:2, cat:'Hamburguesas', name:'BBQ Doble', desc:'Doble carne angus, tocino crujiente, aros de cebolla y salsa BBQ.', price:12.90, emoji:'🥩', rating:4.9, pts:129, popular:true },
  { id:3, cat:'Hamburguesas', name:'Spicy Crispy', desc:'Pollo crujiente picante, jalapeños, queso pepper jack y mayonesa sriracha.', price:10.50, emoji:'🌶️', rating:4.7, pts:105, popular:false },
  { id:4, cat:'Hamburguesas', name:'Mushroom Swiss', desc:'Carne angus, champiñones salteados, queso suizo y salsa de trufa.', price:11.90, emoji:'🍄', rating:4.6, pts:119, popular:false },

  // Bebidas
  { id:5, cat:'Bebidas', name:'Refresco Grande', desc:'Refresco de tu elección en vaso grande con apastante hielo.', price:3.50, emoji:'🥤', rating:4.5, pts:35, popular:true },
  { id:6, cat:'Bebidas', name:'Malteada', desc:'Malteada cremosa de fresa, chocolate o vainilla. Hecha al momento.', price:5.90, emoji:'🍓', rating:4.9, pts:59, popular:true },
  { id:7, cat:'Bebidas', name:'Agua Natural', desc:'Agua embotellada sin gas 500ml.', price:1.50, emoji:'💧', rating:4.3, pts:15, popular:false },
  { id:8, cat:'Bebidas', name:'Café Americano', desc:'Café de grano recién molido, tamaño mediano o grande.', price:4.00, emoji:'☕', rating:4.7, pts:40, popular:false },

  // Combos
  { id:9, cat:'Combos', name:'Combo Classic', desc:'Classic Burger + Papas Medianas + Refresco Grande. El clásico infalible.', price:14.90, emoji:'🍟', rating:4.8, pts:149, popular:true },
  { id:10, cat:'Combos', name:'Combo BBQ Doble', desc:'BBQ Doble + Papas Grandes + Refresco Grande + Postre.', price:19.90, emoji:'🎉', rating:4.9, pts:199, popular:true },
  { id:11, cat:'Combos', name:'Combo Familiar', desc:'4 Classic Burgers + 4 Papas + 4 Refrescos. Para compartir.', price:44.90, emoji:'👨‍👩‍👧‍👦', rating:4.8, pts:449, popular:false },

  // Postres
  { id:12, cat:'Postres', name:'Sundae Chocolate', desc:'Helado de vainilla con salsa de chocolate caliente y crema batida.', price:4.50, emoji:'🍦', rating:4.9, pts:45, popular:true },
  { id:13, cat:'Postres', name:'Apple Pie', desc:'Pay de manzana horneado con canela y azúcar glass. Cálido y crujiente.', price:3.50, emoji:'🥧', rating:4.7, pts:35, popular:false },
  { id:14, cat:'Postres', name:'Brownie Caliente', desc:'Brownie de chocolate con helado de vainilla y nuez.', price:5.90, emoji:'🍫', rating:4.8, pts:59, popular:false },

  // Snacks
  { id:15, cat:'Snacks', name:'Papas Fritas', desc:'Papas doradas y crujientes con sal marina. Disponibles en regular o grande.', price:4.00, emoji:'🍟', rating:4.7, pts:40, popular:true },
  { id:16, cat:'Snacks', name:'Nuggets x8', desc:'Nuggets de pollo crujientes. Elige tu salsa: BBQ, ranch o picante.', price:6.50, emoji:'🐔', rating:4.8, pts:65, popular:true },
  { id:17, cat:'Snacks', name:'Aros de Cebolla', desc:'Aros empanizados dorados con salsa de queso jalapeño.', price:5.00, emoji:'🧅', rating:4.6, pts:50, popular:false },
];

const MODIFIERS_MAP = {
  'Hamburguesas': [
    { group: 'Término de la carne', type:'choice', options:['1/2 Punto','3/4 Punto','Bien cocido'], prices:[0,0,0] },
    { group: 'Extras', type:'add', options:['Extra queso +$1', 'Extra carne +$2.50', 'Tocino extra +$1.50'], prices:[1,2.5,1.5] },
    { group: 'Sin ingredientes', type:'remove', options:['Sin cebolla','Sin pepinillo','Sin lechuga','Sin tomate'], prices:[0,0,0,0] },
  ],
  'Bebidas': [
    { group: 'Tamaño', type:'choice', options:['Mediano','Grande','Extra Grande'], prices:[0,0.5,1] },
    { group: 'Sin hielo', type:'remove', options:['Sin hielo'], prices:[0] },
  ],
  'Combos': [
    { group: 'Tamaño de papas', type:'choice', options:['Regular','Grande','Extra Grande'], prices:[0,0.5,1] },
    { group: 'Bebida', type:'choice', options:['Refresco','Agua Natural','Limonada'], prices:[0,0,0.5] },
  ],
  'Postres': [
    { group: 'Temperatura', type:'choice', options:['Frío','Caliente'], prices:[0,0] },
  ],
  'Snacks': [
    { group: 'Salsa', type:'choice', options:['BBQ','Ranch','Buffalo','Queso'], prices:[0,0,0,0.5] },
    { group: 'Tamaño', type:'choice', options:['Regular','Grande'], prices:[0,1] },
  ],
};

const REWARDS = [
  { id:'r1', icon:'🥤', name:'Bebida Gratis', desc:'Refresco o agua de tu elección completamente gratis.', ptsReq:500, type:'free_product' },
  { id:'r2', icon:'🍟', name:'Papas Gratis', desc:'Papas fritas tamaño regular sin costo adicional.', ptsReq:400, type:'free_product' },
  { id:'r3', icon:'💸', name:'15% OFF', desc:'15% de descuento en tu próximo pedido, sin límite de compra.', ptsReq:300, type:'discount_pct' },
  { id:'r4', icon:'🍔', name:'Burger Gratis', desc:'Classic Burger totalmente gratis en tu siguiente visita.', ptsReq:900, type:'free_product' },
  { id:'r5', icon:'🚗', name:'Envío Gratis', desc:'Delivery sin costo en tu próximo pedido.', ptsReq:200, type:'free_delivery' },
  { id:'r6', icon:'🎂', name:'Postre Gratis', desc:'Sundae o postre a elegir con tu compra.', ptsReq:600, type:'free_product' },
];

const BRANCHES = [
  { id:'b1', name:'Centro Histórico', address:'Av. Juárez 45, Centro', dist:0.8, wait:'15–20 min', open:true },
  { id:'b2', name:'Polanco', address:'Presidente Masaryk 234, Polanco', dist:2.4, wait:'20–30 min', open:true },
  { id:'b3', name:'Condesa', address:'Tamaulipas 156, Condesa', dist:3.1, wait:'25–35 min', open:true },
];

const PAST_ORDERS = [
  { id:'QB-4521', items:'Classic Burger + Papas + Refresco', total:14.90, emoji:'🍔', status:'delivered', date:'28 Feb 2026', pts:149 },
  { id:'QB-4389', items:'Combo BBQ Doble + Sundae', total:24.40, emoji:'🥩', status:'delivered', date:'22 Feb 2026', pts:244 },
  { id:'QB-4201', items:'Nuggets x8 + Malteada x2', total:18.30, emoji:'🐔', status:'delivered', date:'15 Feb 2026', pts:183 },
];

const LOYALTY_HISTORY = [
  { type:'earn', icon:'🍔', desc:'Pedido #QB-4521', date:'28 Feb', pts:+149 },
  { type:'earn', icon:'🍔', desc:'Pedido #QB-4389', date:'22 Feb', pts:+244 },
  { type:'spend', icon:'🎁', desc:'Canje: 15% OFF', date:'20 Feb', pts:-300 },
  { type:'earn', icon:'🍔', desc:'Pedido #QB-4201', date:'15 Feb', pts:+183 },
  { type:'earn', icon:'⭐', desc:'Bono bienvenida', date:'01 Feb', pts:+150 },
];

const PUSH_MESSAGES = [
  { icon:'🍔', title:'¡Pedido Recibido! ✅', text:'Tu pedido #QB-4588 está siendo procesado.' },
  { icon:'🍳', title:'En preparación', text:'Tu comida está siendo preparada con amor 👨‍🍳' },
  { icon:'🛵', title:'¡En camino!', text:'Carlos ya viene con tu pedido. ETA: 18 min 🚀' },
  { icon:'🔥', title:'Oferta cerca de ti', text:'Estás a 200m del local. ¡20% OFF ahora!' },
  { icon:'⭐', title:'¡Puntos por vencer!', text:'Tus 500 puntos expiran en 3 días. ¡Canjéalos!' },
];
