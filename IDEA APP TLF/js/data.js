// ═══════════════════════════════════════════
//   BOCADOS APP – Data Menu & Config
// ═══════════════════════════════════════════

const CATEGORIES = ['Burguer Menú', 'Dog Menú', 'Kids Menú', 'Bebidas', 'Adicionales', 'Patacones', 'Salchipapas', 'Tacos', 'Arepas Cabimeras', 'Smash Burger', 'Combos'];

const PRODUCTS = [
  // Burguer Menú
  { id: 1, cat: 'Burguer Menú', name: 'Clásica Carne', desc: '100grs de carne, queso de mano, jamón ahumado, tomate, lechuga y papas ralladas', price: 6.00, emoji: '🍔', rating: 4.8, pts: 60, popular: true, calories: 500 },
  { id: 2, cat: 'Burguer Menú', name: 'Doble Carne', desc: '200grs de carne, doble cheddar, queso de mano, doble tocineta, tomate, lechuga y papas ralladas', price: 8.50, emoji: '🍔', rating: 4.9, pts: 85, popular: true, calories: 850 },
  { id: 3, cat: 'Burguer Menú', name: 'Clásica Pollo', desc: '150grs de pollo, queso de mano, jamón ahumado, tocineta, tomate, lechuga y papas ralladas', price: 7.00, emoji: '🍔', rating: 4.7, pts: 70, popular: false, calories: 550 },
  { id: 4, cat: 'Burguer Menú', name: 'Doble Pollo', desc: '300grs de pollo, rueda completa de queso de mano, jamón ahumado, tocineta, tomate, lechuga y papas ralladas', price: 9.00, emoji: '🍔', rating: 4.8, pts: 90, popular: false, calories: 800 },
  { id: 5, cat: 'Burguer Menú', name: 'Mixta', desc: '150grs de pollo, 100gr de carne, queso de mano, jamón ahumado, tocineta, tomate, lechuga y papas ralladas', price: 8.50, emoji: '🍔', rating: 4.9, pts: 85, popular: true, calories: 750 },
  { id: 6, cat: 'Burguer Menú', name: 'Lomipollo', desc: '150grs de pollo, 150gr de lomito, rueda completa de queso de mano, jamón ahumado, tomate, lechuga y papas ralladas', price: 10.00, emoji: '🍔', rating: 4.9, pts: 100, popular: true, calories: 800 },
  { id: 7, cat: 'Burguer Menú', name: 'Especial', desc: '300grs de pollo, 120gr de carne, rueda completa de queso de mano, jamón ahumado, tomate, lechuga y papas ralladas', price: 10.00, emoji: '🍔', rating: 4.9, pts: 100, popular: true, calories: 850 },
  { id: 8, cat: 'Burguer Menú', name: 'La Trifásica', desc: '200grs de pollo, 200gr de lomito, 120gr de carne, queso de mano, jamón ahumado, tomate, lechuga y papas ralladas', price: 13.00, emoji: '🍔', rating: 5.0, pts: 130, popular: true, calories: 1100 },
  { id: 9, cat: 'Burguer Menú', name: 'Crispy', desc: '200grs de pollo crispy, mayonesa, queso de mano, cheddar kraft, jamón ahumado, tocineta, lechuga, tomate y papas ralladas', price: 9.00, emoji: '🍔', rating: 4.8, pts: 90, popular: false, calories: 750 },
  { id: 10, cat: 'Burguer Menú', name: 'Sombrero', desc: '500grs de carne, 600grs de pollo, 4 ruedas de queso de mano, jamón ahumado, lechuga y papas ralladas. Incluye papas fritas familiares y bebida 1.5lts', price: 38.00, emoji: '🍔', rating: 5.0, pts: 380, popular: false, calories: 2500 },

  // Dog Menú
  { id: 11, cat: 'Dog Menú', name: 'Perro Clásico', desc: 'Salchicha, queso de año, repollo, cebolla y papas ralladas', price: 3.50, emoji: '🌭', rating: 4.5, pts: 35, popular: true, calories: 350 },
  { id: 12, cat: 'Dog Menú', name: 'Perro Especial', desc: 'Salchicha, queso de mano, tocineta, repollo, cebolla y papas ralladas', price: 4.50, emoji: '🌭', rating: 4.7, pts: 45, popular: false, calories: 450 },
  { id: 13, cat: 'Dog Menú', name: 'Perro con Pollo', desc: 'Salchicha, 120grs de pollo, tocineta, queso de mano, queso de año, repollo, cebolla y papas ralladas', price: 6.50, emoji: '🌭', rating: 4.8, pts: 65, popular: true, calories: 550 },
  { id: 14, cat: 'Dog Menú', name: 'Perro Polaco', desc: 'Salchicha polaca, queso de mano, tocineta, repollo, cebolla y papas ralladas', price: 5.50, emoji: '🌭', rating: 4.6, pts: 55, popular: false, calories: 500 },
  { id: 15, cat: 'Dog Menú', name: 'El Extasiado', desc: 'Salchicha polaca, 120grs de pollo, tocineta, queso de año, repollo, cebolla y papas ralladas', price: 7.50, emoji: '🌭', rating: 4.9, pts: 75, popular: true, calories: 650 },

  // Kids Menú
  { id: 16, cat: 'Kids Menú', name: 'Servicio de Tequeños', desc: '5 unidades + salsa', price: 4.00, emoji: '🧀', rating: 4.8, pts: 40, popular: true, calories: 400 },
  { id: 17, cat: 'Kids Menú', name: 'Servicio de Tenders', desc: '150grs de tenders + 150grs de papas fritas', price: 6.00, emoji: '🍗', rating: 4.7, pts: 60, popular: false, calories: 500 },

  // Bebidas
  { id: 18, cat: 'Bebidas', name: 'Retornable 1.25lts', desc: 'Refresco retornable 1.25lts', price: 2.00, emoji: '🥤', rating: 4.5, pts: 20, popular: true, calories: 200 },
  { id: 19, cat: 'Bebidas', name: 'Coca Cola 1.5lts', desc: 'Refresco Coca Cola 1.5lts', price: 2.50, emoji: '🥤', rating: 4.8, pts: 25, popular: false, calories: 240 },
  { id: 20, cat: 'Bebidas', name: 'Coca Cola 2lts', desc: 'Refresco Coca Cola 2lts', price: 3.00, emoji: '🥤', rating: 4.9, pts: 30, popular: true, calories: 300 },
  { id: 21, cat: 'Bebidas', name: 'Nestea 22oz', desc: 'Nestea 22oz', price: 2.50, emoji: '🥤', rating: 4.6, pts: 25, popular: false, calories: 150 },
  { id: 22, cat: 'Bebidas', name: 'Refresco 350ml', desc: 'Refresco en lata o botella 350ml', price: 1.00, emoji: '🥤', rating: 4.5, pts: 10, popular: false, calories: 140 },

  // Adicionales
  { id: 23, cat: 'Adicionales', name: 'Pepinillos', desc: 'Porción de pepinillos', price: 0.50, emoji: '🥒', rating: 4.0, pts: 5, popular: false, calories: 10 },
  { id: 24, cat: 'Adicionales', name: 'Papas Fritas', desc: 'Porción de papas fritas', price: 1.50, emoji: '🍟', rating: 4.8, pts: 15, popular: true, calories: 300 },
  { id: 25, cat: 'Adicionales', name: 'Tocineta', desc: 'Porción extra de tocineta', price: 1.00, emoji: '🥓', rating: 4.9, pts: 10, popular: true, calories: 150 },
  { id: 26, cat: 'Adicionales', name: 'Queso de Mano', desc: 'Porción de queso de mano', price: 1.00, emoji: '🧀', rating: 4.7, pts: 10, popular: false, calories: 120 },
  { id: 27, cat: 'Adicionales', name: 'Cebolla Caramelizada', desc: 'Porción de cebolla caramelizada', price: 0.50, emoji: '🧅', rating: 4.5, pts: 5, popular: false, calories: 50 },

  // Patacones
  { id: 28, cat: 'Patacones', name: 'Patacón de Carne', desc: 'Doble patacón, 150grs de carne, 1/2 rueda de queso de mano, jamón ahumado, huevo, queso de año, vegetales y salsa', price: 7.00, emoji: '🌮', rating: 4.8, pts: 70, popular: true, calories: 700 },
  { id: 29, cat: 'Patacones', name: 'Patacón de Pollo', desc: 'Doble patacón, 200grs de pollo, 1/2 rueda de queso de mano, jamón ahumado, huevo, queso de año, vegetales y salsa', price: 8.50, emoji: '🌮', rating: 4.7, pts: 85, popular: false, calories: 650 },
  { id: 30, cat: 'Patacones', name: 'Patacón Mixto', desc: 'Doble patacón, 150grs de pollo, 150grs de carne, 1/2 rueda de queso de mano, jamón ahumado, tocineta, huevo, queso de año, vegetales y salsa', price: 10.00, emoji: '🌮', rating: 4.9, pts: 100, popular: true, calories: 800 },
  { id: 31, cat: 'Patacones', name: 'Patacón de Lomipollo', desc: 'Doble patacón, 150grs de lomito, 150grs de pollo, 1/2 rueda de queso de mano, jamón ahumado, tocineta, huevo, queso de año, vegetales y salsa', price: 12.00, emoji: '🌮', rating: 4.9, pts: 120, popular: false, calories: 850 },

  // Salchipapas
  { id: 32, cat: 'Salchipapas', name: 'Salchipapa Clásica', desc: '200grs de papa fritas, salchichas, queso de mano. Vegetales opcionales', price: 5.00, emoji: '🍟', rating: 4.6, pts: 50, popular: true, calories: 600 },
  { id: 33, cat: 'Salchipapas', name: 'Salchipollo', desc: '200grs de papa fritas, 150grs de pollo, salchichas, queso de mano. Vegetales opcionales', price: 8.00, emoji: '🍟', rating: 4.8, pts: 80, popular: false, calories: 750 },
  { id: 34, cat: 'Salchipapas', name: 'Salchicarne', desc: '200grs de papa fritas, 150grs de carne, salchichas, queso de mano. Vegetales opcionales', price: 8.00, emoji: '🍟', rating: 4.7, pts: 80, popular: false, calories: 750 },
  { id: 35, cat: 'Salchipapas', name: 'Salchi Lomipollo XL', desc: '350grs de papa fritas, 2 salchichas, 150grs de pollo, 150grs de lomito, 2 ruedas de queso de mano. Vegetales opcionales', price: 15.00, emoji: '🍟', rating: 5.0, pts: 150, popular: true, calories: 1200 },

  // Tacos
  { id: 36, cat: 'Tacos', name: 'Taco Pollo', desc: 'Pan árabe, 250grs de pollo, 1/2 rueda de queso de mano, jamón ahumado, tocineta, vegetales, papas ralladas y salsas', price: 8.50, emoji: '🌮', rating: 4.7, pts: 85, popular: false, calories: 600 },
  { id: 37, cat: 'Tacos', name: 'Taco Lomipollo', desc: 'Pan árabe, 150grs de pollo, 150grs de lomito, 1/2 rueda de queso de mano, jamón ahumado, tocineta, vegetales, papas ralladas y salsas', price: 11.00, emoji: '🌮', rating: 4.9, pts: 110, popular: true, calories: 750 },

  // Arepas
  { id: 38, cat: 'Arepas Cabimeras', name: 'Arepa de Carne', desc: 'Arepa frita, 150gr de carne mechada, queso de mano, jamón ahumado, queso de año, huevo, ensalada y salsas', price: 7.00, emoji: '🫓', rating: 4.8, pts: 70, popular: true, calories: 700 },
  { id: 39, cat: 'Arepas Cabimeras', name: 'Arepa de Pollo', desc: 'Arepa frita, 150grs de pollo a la plancha, queso de mano, jamón ahumado, queso de año, huevo, ensalada y salsas', price: 7.00, emoji: '🫓', rating: 4.6, pts: 70, popular: false, calories: 650 },
  { id: 40, cat: 'Arepas Cabimeras', name: 'Arepón Lomipollo', desc: 'Doble arepa frita, 150grs de pollo, 150grs de lomito, rueda completa de queso de mano, jamón ahumado, tocineta, queso de año, huevo, ensalada y salsas', price: 15.00, emoji: '🫓', rating: 5.0, pts: 150, popular: true, calories: 1100 },

  // Smash Burger
  { id: 41, cat: 'Smash Burger', name: 'Smash Clásica', desc: 'Pan de papa, 120grs de carne, cheddar kraft, tocineta, cebolla, pepinillos y salsa tasty. Incluye servicio de papas fritas', price: 7.50, emoji: '🍔', rating: 4.8, pts: 75, popular: true, calories: 750 },
  { id: 42, cat: 'Smash Burger', name: 'Smash Doble Cheese', desc: 'Pan de papa, doble carne, doble cheddar kraft, doble tocineta, cebolla, pepinillos y salsa tasty. Incluye servicio de papas fritas', price: 9.50, emoji: '🍔', rating: 4.9, pts: 95, popular: true, calories: 950 },
  { id: 43, cat: 'Smash Burger', name: 'Smash Crispy', desc: 'Pan de papa, 200gr de pollo crispy, cheddar kraft, tocineta, cebolla, pepinillos y salsa tasty. Incluye servicio de papas fritas', price: 9.00, emoji: '🍔', rating: 4.7, pts: 90, popular: false, calories: 850 },
  { id: 44, cat: 'Smash Burger', name: 'Smash Golden', desc: 'Pan de papa, 150grs de pollo, 1 chuleta ahumada, cheddar kraft, tocineta, cebolla, pepinillos y salsa tasty. Incluye servicio de papas fritas', price: 10.00, emoji: '🍔', rating: 4.8, pts: 100, popular: false, calories: 900 },

  // Combos
  { id: 45, cat: 'Combos', name: 'Combo Carne', desc: '4 hamburguesas sencillas con pan premium + retornable 1.25lts', price: 24.00, emoji: '🥤', rating: 4.9, pts: 240, popular: true, calories: 2200 },
  { id: 46, cat: 'Combos', name: 'Combo Pollo', desc: '4 hamburguesas de pollo sencillas con pan premium + retornable 1.25lts', price: 28.00, emoji: '🥤', rating: 4.8, pts: 280, popular: false, calories: 2000 },
  { id: 47, cat: 'Combos', name: 'Combo Perros', desc: '5 perros + retornable 1.25lts', price: 15.00, emoji: '🌭', rating: 4.7, pts: 150, popular: true, calories: 1800 },
];

const MODIFIERS_MAP = {
  'Burguer Menú': [
    { group: 'Término de la carne', type: 'choice', options: ['1/2 Punto', '3/4 Punto', 'Bien cocido'], prices: [0, 0, 0] },
    { group: 'Extras', type: 'add', options: ['Extra queso +$1', 'Extra carne +$2.50', 'Tocino extra +$1.50'], prices: [1, 2.5, 1.5] },
    { group: 'Sin ingredientes', type: 'remove', options: ['Sin cebolla', 'Sin pepinillo', 'Sin lechuga', 'Sin tomate'], prices: [0, 0, 0, 0] },
  ],
  'Smash Burger': [
    { group: 'Extras', type: 'add', options: ['Extra queso +$1', 'Extra carne +$2.50', 'Tocino extra +$1.50'], prices: [1, 2.5, 1.5] },
  ]
};

const REWARDS = [
  { id: 'r1', icon: '🥤', name: 'Bebida Gratis', desc: 'Refresco o agua de tu elección completamente gratis.', ptsReq: 500, type: 'free_product' },
  { id: 'r2', icon: '🍟', name: 'Papas Gratis', desc: 'Papas fritas tamaño regular sin costo adicional.', ptsReq: 400, type: 'free_product' },
  { id: 'r3', icon: '💸', name: '15% OFF', desc: '15% de descuento en tu próximo pedido, sin límite de compra.', ptsReq: 300, type: 'discount_pct' },
  { id: 'r4', icon: '🍔', name: 'Burger Gratis', desc: 'Clásica Carne totalmente gratis en tu siguiente visita.', ptsReq: 900, type: 'free_product' },
  { id: 'r5', icon: '🚗', name: 'Envío Gratis', desc: 'Delivery sin costo en tu próximo pedido.', ptsReq: 200, type: 'free_delivery' },
  { id: 'r6', icon: '🎂', name: 'Postre Gratis', desc: 'Postre a elegir con tu compra.', ptsReq: 600, type: 'free_product' },
];

const BRANCHES = [
  { id: 'b1', name: 'Campo Grande', address: 'Av. Principal, Campo Grande, Lagunillas', dist: 1.2, wait: '15–20 min', open: true },
  { id: 'b2', name: 'Campo Rojo', address: 'Callejón Sur, Campo Rojo, Lagunillas', dist: 2.1, wait: '20–30 min', open: true },
  { id: 'b3', name: 'El Milagro', address: 'Calle Central, El Milagro, Lagunillas', dist: 3.5, wait: '25–35 min', open: true },
  { id: 'b4', name: 'Las Palmas', address: 'Avenida 4, Las Palmas, Lagunillas', dist: 4.0, wait: '20–30 min', open: true },
  { id: 'b5', name: 'Puerto Nuevo', address: 'Calle 2, Puerto Nuevo, Lagunillas', dist: 5.2, wait: '30–40 min', open: true },
  { id: 'b6', name: 'Carabobo', address: 'Av. Bolívar, Carabobo, Lagunillas', dist: 6.5, wait: '30–45 min', open: true },
  { id: 'b7', name: 'Fabricio', address: 'Sector 5, Fabricio, Lagunillas', dist: 7.8, wait: '35–50 min', open: true },
];

const PAST_ORDERS = [
  { id: 'BCA-4521', items: 'Clásica Carne + Papas Fritas + Refresco 350ml', total: 8.50, emoji: '🍔', status: 'delivered', date: '28 Feb 2026', pts: 85 },
  { id: 'BCA-4389', items: 'Combo Perros + Retornable 1.25lts', total: 17.00, emoji: '🌭', status: 'delivered', date: '22 Feb 2026', pts: 170 },
  { id: 'BCA-4201', items: 'Servicio de Tequeños x2', total: 8.00, emoji: '🧀', status: 'delivered', date: '15 Feb 2026', pts: 80 },
];

const LOYALTY_HISTORY = [
  { type: 'earn', icon: '🍔', desc: 'Pedido #BCA-4521', date: '28 Feb', pts: +85 },
  { type: 'earn', icon: '🌭', desc: 'Pedido #BCA-4389', date: '22 Feb', pts: +170 },
  { type: 'spend', icon: '🎁', desc: 'Canje: 15% OFF', date: '20 Feb', pts: -300 },
  { type: 'earn', icon: '🧀', desc: 'Pedido #BCA-4201', date: '15 Feb', pts: +80 },
  { type: 'earn', icon: '⭐', desc: 'Bono bienvenida', date: '01 Feb', pts: +150 },
];

const PUSH_MESSAGES = [
  { icon: '🍔', title: '¡Pedido Recibido! ✅', text: 'Tu pedido #BCA-4588 está siendo procesado.' },
  { icon: '🍳', title: 'En preparación', text: 'Tu comida está siendo preparada con amor 👨‍🍳' },
  { icon: '🛵', title: '¡En camino!', text: 'El repartidor ya viene con tu pedido. ETA: 18 min 🚀' },
  { icon: '🔥', title: 'Oferta cerca de ti', text: 'Estás a 200m del local. ¡20% OFF ahora!' },
  { icon: '⭐', title: '¡Puntos por vencer!', text: 'Tus 500 puntos expiran en 3 días. ¡Canjéalos!' },
];
