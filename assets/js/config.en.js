/* Lalla Warda · site content in English. Everything the brand updates lives here:
   contact details, products and prices, formulas, rituals, ingredient origins, reviews, FAQ and interface text.
   demo: true shows the "fictional data" notice and keeps the WhatsApp and Instagram buttons from leaving the page. */
window.SITE = {
  lang: 'en',
  demo: true,
  marque: { nom: 'Lalla Warda', ar: 'لالة وردة', ville: 'Kenitra', fondatrice: 'Kenza Amrani' },
  contact: {
    whatsapp: '212600000000',                 // international format, no + or spaces
    telephone: '+212 6 00 00 00 00',
    instagram: 'lallawarda.ma',
    atelier: 'Val Fleuri district, Kenitra',
    horaires: [['WhatsApp orders', '7 days a week, reply the same day'], ['Workshop', 'Tuesday to Saturday, by appointment']]
  },
  devise: { symbol: 'MAD', before: false },
  livraison: { prix: 35, offerte: 400, delai: '24 to 72 hours' },

  // forme: dropper, spray, jar, bottle, coffret · contenu: colour of the liquid (or of the paste when opaque)
  produits: [
    {
      id: 'elixir', photo: 'p-elixir', nom: 'Rose Elixir', type: 'visage', categorie: 'Face oil serum', format: '30 ml', prix: 290, badge: 'Best-loved',
      forme: 'dropper', contenu: '#e39a2b', att: .55, sous: 'Face serum · 30 ml',
      accroche: 'The glow of a good night’s sleep, in three drops.',
      texte: 'Argan from the Souss, prickly pear seed oil and Damask rose macerate. A dry oil that nourishes without shine: you wake up to a luminous complexion and supple skin.',
      pour: 'Dry, dull or mature skin; also suits combination skin.',
      texture: 'Dry oil, sinks in within 30 seconds, satin finish.',
      usage: 'In the evening, 3 drops on clean skin still damp with rose water. Massage from the centre of the face outwards and upwards.',
      ingredients: [
        { nom: 'Argan oil', pct: 52, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Prickly pear seed oil', pct: 30, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Damask rose macerate', pct: 15, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Natural vitamin E', pct: 2, origine: 'Sunflower', img: '' },
        { nom: 'Neroli', pct: 1, origine: 'Gharb, near Kenitra', img: 'i-oranger' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis Seed Oil, Rosa Damascena Flower Extract, Tocopherol, Helianthus Annuus Seed Oil, Citrus Aurantium Amara Flower Oil, Citronellol*, Geraniol*, Linalool*. *Naturally present in essential oils.'
    },
    {
      id: 'eau-rose', photo: 'p-eau-rose', nom: 'Rose Water', type: 'visage', categorie: 'Toning mist', format: '200 ml', prix: 75,
      forme: 'spray', contenu: '#ee8fa6', att: 1.6, r: .42, h: 1.25, sous: 'Kelaat M’Gouna · 200 ml',
      accroche: 'Distilled in Kelaat M’Gouna, the valley of roses.',
      texte: 'A pure flower water, steam-distilled from Damask roses picked at dawn in May. It tones, soothes and prepares the skin for what comes next.',
      pour: 'All skin types, even sensitive skin.',
      texture: 'Flower water, fine mist.',
      usage: 'Morning and evening, three sprays 20 cm from the face, eyes closed. Also for mixing the ghassoul mask.',
      ingredients: [{ nom: 'Damask rose flower water', pct: 100, origine: 'Kelaat M’Gouna', img: 'i-rose' }],
      inci: 'Rosa Damascena Flower Water.'
    },
    {
      id: 'masque', photo: 'p-masque', nom: 'Ghassoul & Rose Mask', type: 'visage', categorie: 'Purifying mask', format: '150 g', prix: 95,
      forme: 'jar', contenu: '#a98a72', opaque: true, mat: .95, or: true, sous: 'Rhassoul & rose · 150 g',
      accroche: 'Clay from the Middle Atlas, softened with rose.',
      texte: 'Ghassoul (rhassoul) is found only in Morocco. Mixed with rose petal powder, it absorbs excess sebum and tightens pores without drying the skin.',
      pour: 'Combination to oily skin, dull complexion.',
      texture: 'Powder to mix into a creamy paste.',
      usage: 'One spoonful of powder, a splash of rose water, in a thin layer. Leave on for 10 minutes and rinse before it dries completely. Once or twice a week.',
      ingredients: [
        { nom: 'Ghassoul (rhassoul)', pct: 85, origine: 'Ksabi, Middle Atlas', img: 'i-rhassoul' },
        { nom: 'Rose petal powder', pct: 12, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Orange blossom powder', pct: 3, origine: 'Gharb', img: 'i-oranger' }
      ],
      inci: 'Moroccan Lava Clay, Rosa Damascena Flower Powder, Citrus Aurantium Amara Flower Powder.'
    },
    {
      id: 'baume', photo: 'p-baume', nom: 'Saffron Night Balm', type: 'visage', categorie: 'Rich care', format: '50 ml', prix: 240,
      forme: 'jar', r: .42, h: .36, contenu: '#f0c270', opaque: true, mat: .45, or: true, sous: 'Night care · 50 ml',
      accroche: 'Saffron from Taliouine, melted into argan.',
      texte: 'A balm that melts on contact with the skin: argan, prickly pear and sweet almond, held together by a little beeswax from the Maamora forest. Saffron adds its golden glow.',
      pour: 'Dry to very dry skin, areas that feel tight.',
      texture: 'Melting balm that turns to oil under your fingers.',
      usage: 'In the evening, warm a pea-sized amount between your fingers and press onto the skin. As a four-week course in winter.',
      ingredients: [
        { nom: 'Argan oil', pct: 48, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Prickly pear oil', pct: 20, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Sweet almond oil', pct: 17, origine: 'Haouz', img: '' },
        { nom: 'Beeswax', pct: 12, origine: 'Maamora forest', img: 'i-miel' },
        { nom: 'Saffron macerate', pct: 2, origine: 'Taliouine', img: 'i-safran' },
        { nom: 'Natural vitamin E', pct: 1, origine: 'Sunflower', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Prunus Amygdalus Dulcis Oil, Cera Alba, Crocus Sativus Flower Extract, Tocopherol.'
    },
    {
      id: 'racines', photo: 'p-racines', nom: 'Roots Oil', type: 'cheveux', categorie: 'Strengthening oil bath', format: '100 ml', prix: 160, badge: 'New',
      forme: 'bottle', r: .4, h: 1.1, contenu: '#b8701f', att: .8, or: true, sous: 'Hair oil bath · 100 ml',
      accroche: 'Our grandmothers’ oil bath, made lighter.',
      texte: 'Argan, nigella and castor oils nourish the hair fibre; rosemary from the Oriental and Atlas cedar wake up the scalp. Hair is stronger and glossier, and detangles in one stroke.',
      pour: 'Dry or brittle hair, slow-growing hair; curls and coils.',
      texture: 'Fluid oil with a woody, herbal scent.',
      usage: '8 to 10 drops massaged into the scalp, then smoothed down to the ends. 30 minutes under a warm towel, or overnight, then a gentle shampoo.',
      ingredients: [
        { nom: 'Argan oil', pct: 46, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Nigella oil', pct: 30, origine: 'Saïss plain', img: 'i-nigelle' },
        { nom: 'Castor oil', pct: 21, origine: 'Cold-pressed', img: '' },
        { nom: 'Rosemary essential oil', pct: 2, origine: 'Oriental', img: 'i-romarin' },
        { nom: 'Atlas cedar essential oil', pct: 1, origine: 'Azrou, Middle Atlas', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Ricinus Communis Seed Oil, Rosmarinus Officinalis Leaf Oil, Cedrus Atlantica Wood Oil, Tocopherol, Limonene*, Linalool*. *Naturally present in essential oils.'
    },
    {
      id: 'oranger', photo: 'p-oranger', nom: 'Orange Blossom Mist', type: 'cheveux', categorie: 'Hair and face mist', format: '150 ml', prix: 95,
      forme: 'spray', contenu: '#f1dca6', att: 2.4, sous: 'Hair & face · 150 ml',
      accroche: 'Orange groves of the Gharb, 40 km from the workshop.',
      texte: 'Orange blossom water (the zhar of Moroccan weddings) and aloe vera hydrate without weighing hair down; a touch of argan makes the ends shine. A fresh scent, never overpowering.',
      pour: 'All hair types; a refreshing mist for the face too.',
      texture: 'Light mist, shake before use.',
      usage: 'On dry or damp hair, from 20 cm, lengths to ends. Leave in.',
      ingredients: [
        { nom: 'Orange blossom water', pct: 84, origine: 'Gharb, near Kenitra', img: 'i-oranger' },
        { nom: 'Aloe vera juice', pct: 12, origine: 'Souss', img: 'i-aloe' },
        { nom: 'Vegetable glycerine', pct: 3, origine: 'Rapeseed', img: '' },
        { nom: 'Argan oil', pct: 1, origine: 'Aït Baha, Souss', img: 'i-argan' }
      ],
      inci: 'Citrus Aurantium Amara Flower Water, Aloe Barbadensis Leaf Juice, Glycerin, Argania Spinosa Kernel Oil, Sodium Benzoate, Potassium Sorbate.'
    },
    {
      id: 'savon', photo: 'p-savon', nom: 'Rose Black Soap', type: 'rituel', categorie: 'Hammam scrub', format: '200 g', prix: 65,
      forme: 'jar', r: .46, h: .4, contenu: '#4a2c1c', opaque: true, mat: .25, brillant: true, or: false, capuchon: '#efe0d8', sous: 'Hammam · 200 g',
      accroche: 'Beldi soap, scented with rose.',
      texte: 'A paste of saponified olive oil enriched with rose water. Applied to damp skin and rinsed off, it prepares the skin for scrubbing with a kessa glove.',
      pour: 'Body and face, at the hammam or in the shower.',
      texture: 'Melting paste, light lather.',
      usage: 'On damp skin, leave for 5 minutes, rinse, then scrub with a kessa glove.',
      ingredients: [
        { nom: 'Olive oil black soap', pct: 90, origine: 'Meknes', img: '' },
        { nom: 'Rose water', pct: 8, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Rose petal powder', pct: 2, origine: 'Kelaat M’Gouna', img: 'i-rose' }
      ],
      inci: 'Potassium Olivate, Aqua, Rosa Damascena Flower Water, Glycerin, Rosa Damascena Flower Powder.'
    },
    {
      id: 'coffret', photo: 'p-coffret', nom: 'Lalla Warda Ritual Box', type: 'rituel', categorie: 'Elixir, rose water and mask', format: '3 products', prix: 420, avant: 460, badge: 'Gift',
      forme: 'coffret', contenu_coffret: ['elixir', 'eau-rose', 'masque'],
      accroche: 'The complete face ritual, in a box to give.',
      texte: 'The Rose Elixir, the Rose Water and the Ghassoul & Rose Mask, with the ritual written out by hand.',
      pour: 'A first ritual, or a gift.',
      texture: 'Three products, three textures.',
      usage: 'Mist, mask once or twice a week, nourish every evening.',
      ingredients: [], inci: ''
    }
  ],

  hero: {
    produit: 'elixir',
    ingredients: [
      { nom: 'Damask rose', pct: '15%', origine: 'Kelaat M’Gouna', img: 'i-rose', size: .8 },
      { nom: 'Argan oil', pct: '52%', origine: 'Aït Baha, Souss', img: 'i-argan', size: .52 },
      { nom: 'Orange blossom', pct: '1%', origine: 'Gharb, near Kenitra', img: 'i-oranger', size: .62 },
      { nom: 'Prickly pear', pct: '30%', origine: 'Sidi Ifni', img: 'i-figue', size: .6 },
      { nom: 'Vitamin E', pct: '2%', origine: 'Sunflower', img: '', size: .26 }
    ],
    total: ['5 ingredients', '100% natural origin', 'cold-pressed', 'silicone-free']
  },

  textures: [
    { id: 'huile', produit: 'elixir', nom: 'Dry oil', note: 'Sinks in within 30 s · satin finish' },
    { id: 'baume', produit: 'baume', nom: 'Melting balm', note: 'Turns to oil under your fingers' },
    { id: 'argile', produit: 'masque', nom: 'Clay paste', note: 'Matte, rinses off with warm water' },
    { id: 'brume', produit: 'eau-rose', nom: 'Flower mist', note: 'As fine as dew' }
  ],

  visage: [
    { id: 'brume', titre: 'Mist', produit: 'eau-rose', temps: '10 s', texte: 'Three sprays from 20 cm, eyes closed. Damp skin absorbs the next step better.', zones: ['The whole face'] },
    { id: 'masque', titre: 'Mask', produit: 'masque', temps: '10 min', texte: 'A thin layer, from the centre outwards. Avoid the eye area and the lips, and rinse before the clay dries completely.', zones: ['Forehead', 'T-zone', 'Cheeks', 'Chin'] },
    { id: 'rincer', titre: 'Rinse', produit: '', temps: '1 min', texte: 'With warm water, in small circles: as it lifts away, the ghassoul gently exfoliates.', zones: [] },
    { id: 'nourrir', titre: 'Nourish', produit: 'elixir', temps: '1 min', texte: 'Three drops warmed in your palms, pressed onto the face, then massaged upwards towards the temples.', zones: ['Cheekbones', 'Forehead', 'Chin'] }
  ],
  zonesVisage: { yeux: 'Eye area: avoid it', front: 'Forehead', zoneT: 'T-zone', joues: 'Cheeks', menton: 'Chin' },

  cheveux: {
    microscope: [
      { titre: 'Raised cuticle', texte: 'Open scales: the hair snags, tangles and breaks.' },
      { titre: 'The oil coats the fibre', texte: 'Argan and nigella slip under the scales and nourish them.' },
      { titre: 'Scales sealed', texte: 'Light reflects off a smooth surface: the hair shines and glides.' }
    ],
    diametre: '70 µm, the width of a hair',
    etapes: [
      { titre: 'Warm', temps: '10 s', texte: '8 to 10 drops in your palms: rub them together to warm the oil.' },
      { titre: 'Massage the scalp', temps: '3 min', texte: 'With your fingertips, in small circles: rosemary wakes up the circulation.' },
      { titre: 'Smooth the lengths', temps: '1 min', texte: 'Work down to the ends, where hair is driest.' },
      { titre: 'Leave on', temps: '30 min', texte: 'Under a warm towel, or overnight, then a gentle shampoo.' }
    ]
  },

  quiz: {
    questions: [
      { id: 'peau', titre: 'Your skin?', choix: [['seche', 'Dry, feels tight'], ['mixte', 'Combination'], ['grasse', 'Oily, visible pores'], ['sensible', 'Sensitive, reactive']] },
      { id: 'cheveux', titre: 'Your hair?', choix: [['secs', 'Dry, damaged ends'], ['fins', 'Fine, gets greasy fast'], ['boucles', 'Curly or coily'], ['chute', 'Falling out, slow to grow']] },
      { id: 'envie', titre: 'Your priority?', choix: [['eclat', 'A luminous complexion'], ['confort', 'Comfort and nourishment'], ['purete', 'Clear skin'], ['brillance', 'Shiny hair']] }
    ],
    points: {
      seche: { elixir: 3, baume: 3, 'eau-rose': 1 }, mixte: { elixir: 2, masque: 2, 'eau-rose': 2 }, grasse: { masque: 3, 'eau-rose': 2 }, sensible: { 'eau-rose': 3, elixir: 1 },
      secs: { racines: 3, oranger: 1 }, fins: { oranger: 3 }, boucles: { racines: 2, oranger: 2 }, chute: { racines: 3 },
      eclat: { elixir: 3, masque: 1 }, confort: { baume: 3, elixir: 1 }, purete: { masque: 3, savon: 1 }, brillance: { racines: 2, oranger: 2 }
    },
    matin: 'Morning', soir: 'Evening', hebdo: 'Once or twice a week', cheveux: 'For your hair'
  },

  origines: [
    { id: 'kenitra', nom: 'The workshop', lieu: 'Kenitra', lat: 34.261, lon: -6.580, atelier: true, texte: 'Every bottle is filled and labelled by hand, in batches of 40.' },
    { id: 'maamora', nom: 'Beeswax', lieu: 'Maamora forest', lat: 34.15, lon: -6.35, img: 'i-miel', texte: 'One of the largest cork oak forests in the world, on the edge of Kenitra.' },
    { id: 'gharb', nom: 'Orange blossom', lieu: 'Gharb, Sidi Slimane', lat: 34.264, lon: -5.926, img: 'i-oranger', texte: 'The Gharb orange trees blossom in March: the zhar is distilled within the week.' },
    { id: 'saiss', nom: 'Nigella', lieu: 'Saïss plain', lat: 33.95, lon: -5.35, img: 'i-nigelle', texte: 'The black seeds of habba sawda, cold-pressed.' },
    { id: 'ksabi', nom: 'Ghassoul', lieu: 'Ksabi, Middle Atlas', lat: 32.86, lon: -4.43, img: 'i-rhassoul', texte: 'The only ghassoul deposit mined in the world, in the Moulouya valley.' },
    { id: 'oriental', nom: 'Rosemary', lieu: 'Oriental', lat: 34.06, lon: -2.32, img: 'i-romarin', texte: 'Wild rosemary from the high plateaus, distilled on site.' },
    { id: 'mgouna', nom: 'Damask rose', lieu: 'Kelaat M’Gouna', lat: 31.24, lon: -6.13, img: 'i-rose', texte: 'Picked by hand in May, before 9 am, when its scent is strongest.' },
    { id: 'taliouine', nom: 'Saffron', lieu: 'Taliouine', lat: 30.53, lon: -7.92, img: 'i-safran', texte: 'Three stigmas per flower, separated by hand in autumn.' },
    { id: 'aitbaha', nom: 'Argan', lieu: 'Aït Baha, Souss', lat: 30.07, lon: -9.15, img: 'i-argan', texte: 'Cold-pressed by a women’s cooperative.' },
    { id: 'ifni', nom: 'Prickly pear', lieu: 'Sidi Ifni', lat: 29.38, lon: -10.17, img: 'i-figue', texte: 'It takes nearly a tonne of fruit to make one litre of seed oil.' }
  ],
  km: 'km as the crow flies', kmShort: 'km',

  chiffres: [
    { n: 1000, unite: 'kg', texte: 'of prickly pears for one litre of seed oil' },
    { n: 4000, unite: 'kg', texte: 'of rose petals for one kilo of essential oil' },
    { n: 15, unite: 'h', texte: 'of handwork for one litre of traditional argan oil' },
    { n: 40, unite: '', texte: 'bottles per batch, filled and labelled in Kenitra' }
  ],

  avis: [
    ['The elixir has replaced my night cream. Three drops, and in the morning my skin is as soft as after the hammam.', 'Salma', 'Rabat'],
    ['Roots Oil on my curls: no more frizz, and they smell of cedar all day.', 'Imane', 'Casablanca'],
    ['Ordered on Monday on WhatsApp, delivered on Wednesday in Tangier, paid on delivery. The box was wrapped with petals.', 'Nadia', 'Tangier'],
    ['The ghassoul mask doesn’t pull like other clays. My T-zone stays clear all week.', 'Rim', 'Kenitra']
  ],

  faq: [
    ['How do I order?', 'Add your products to the basket, then tap “Order on WhatsApp”: the message is already written, you just send it. We confirm the same day.'],
    ['How much is delivery?', 'Anywhere in Morocco within 24 to 72 hours: 35 MAD, free from 400 MAD. Free collection from the Kenitra workshop, by appointment.'],
    ['How do I pay?', 'On delivery, in cash, or by bank transfer if you prefer.'],
    ['Are your products natural?', 'Short formulas, ingredients of natural origin, no silicones and no synthetic fragrance. The mists contain a gentle preservative, which is essential whenever there is water.'],
    ['Sensitive skin, pregnancy?', 'Essential oils never exceed 3%. Do a patch test in the crook of your elbow 24 hours before; if you are pregnant or breastfeeding, ask your doctor.'],
    ['How long do they keep?', '12 months after opening for the oils and the balm, 6 months for the mists, away from heat and light.']
  ],

  credits: [
    ['Damask rose', 'Nabil Talibi · Wikimedia Commons, background removed', 'CC BY-SA 4.0'],
    ['Argan kernel', 'Roger Culos · Wikimedia Commons (Toulouse Natural History Museum), background removed', 'CC BY-SA 3.0'],
    ['Prickly pear', 'Jules Verne Times Two · Wikimedia Commons, background removed', 'CC BY-SA 4.0'],
    ['Window of the Mehdia kasbah', 'Fauve · Wikimedia Commons', 'CC BY 4.0'],
    ['Face, hair, petal, hands, nigella, ghassoul, rosemary, orange blossom, saffron, honeycomb, aloe vera', 'Jota Lao, Thalia Ruiz, Meina Yin, Christin Hume, Mockupo, Alex Saks, Jocelyn Morales, Muhammad Ali Khoshkerdar, Mohammad Amiri, Jonas Hensel, pisauikan · Unsplash', 'Unsplash License'],
    ['Coastlines of Morocco', 'Natural Earth', 'Public domain']
  ],

  ui: {
    add: 'Add', added: 'Added to basket', addRoutine: 'Add everything to basket', see: 'View details', close: 'Close',
    cart: 'Basket', cartEmpty: 'Your basket is empty: every ritual starts with a single drop.', qty: 'Quantity', remove: 'Remove',
    less: 'One less', more: 'One more', subtotal: 'Subtotal', delivery: 'Delivery', free: 'free', total: 'Total',
    freeFrom: n => `Free delivery from ${n}`, freeLeft: n => `${n} more for free delivery`,
    name: 'Your first name', city: 'Your city', order: 'Order on WhatsApp', copy: 'Copy the message', copied: 'Message copied',
    selected: 'Text selected: copy it with Cmd+C or Ctrl+C.',
    demoWa: 'Demo: on the real site, WhatsApp opens with your order ready to send.',
    demoInsta: h => `Demo: on the real site, this link opens @${h} on Instagram.`,
    msgHello: 'Hello Lalla Warda! I would like to order:', msgTotal: 'Total', msgDelivery: 'Delivery', msgName: 'Name', msgCity: 'City',
    msgPay: 'Payment on delivery. Thank you!',
    compo: 'Formula', inci: 'INCI list', usage: 'How to use', pour: 'For', texture: 'Texture', origin: 'Origin',
    explode: 'Exploded view', drag: 'Turn the bottle', all: 'All', filters: [['tout', 'All'], ['visage', 'Face'], ['cheveux', 'Hair'], ['rituel', 'Rituals']],
    step: 'Step', of: 'of', menuOpen: 'Open menu', menuClose: 'Close menu', result: 'Your routine', restart: 'Start again',
    deliveryNote: (p, f, d) => `Delivered anywhere in Morocco within ${d}: ${p}, free from ${f}. Cash on delivery, or free collection from the Kenitra workshop.`,
    ocean: 'Atlantic Ocean', med: 'Mediterranean',
    pct: n => `${n}%`,
    before: 'instead of', colon: ': ', seeOnInsta: t => `${t} on Instagram`, replay: 'Replay', cartCount: n => `Basket, ${n} item${n === 1 ? '' : 's'}`
  }
};
