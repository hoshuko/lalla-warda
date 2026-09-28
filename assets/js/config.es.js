/* Lalla Warda · contenido de la web en español. Todo lo que la marca actualiza está aquí:
   datos de contacto, productos y precios, fórmulas, rituales, origen de los ingredientes, opiniones, preguntas y textos de la interfaz.
   demo: true muestra el aviso de «datos ficticios» e impide que los botones de WhatsApp e Instagram salgan de la página. */
window.SITE = {
  lang: 'es',
  demo: true,
  marque: { nom: 'Lalla Warda', ar: 'لالة وردة', ville: 'Kenitra', fondatrice: 'Kenza Amrani' },
  contact: {
    whatsapp: '212600000000',                 // formato internacional, sin + ni espacios
    telephone: '+212 6 00 00 00 00',
    instagram: 'lallawarda.ma',
    atelier: 'Barrio de Val Fleuri, Kenitra',
    horaires: [['Pedidos por WhatsApp', 'todos los días, respuesta en el día'], ['Taller', 'de martes a sábado, con cita previa']]
  },
  devise: { symbol: 'MAD', before: false },
  livraison: { prix: 35, offerte: 400, delai: '24 a 72 h' },

  // forme: dropper, spray, jar, bottle, coffret · contenu: color del líquido (o de la pasta si es opaca)
  produits: [
    {
      id: 'elixir', photo: 'p-elixir', nom: 'Elixir de rosa', type: 'visage', categorie: 'Sérum facial de aceite', format: '30 ml', prix: 290, badge: 'El favorito',
      forme: 'dropper', contenu: '#e39a2b', att: .55, sous: 'Sérum facial · 30 ml',
      accroche: 'La luminosidad de una buena noche de sueño, en tres gotas.',
      texte: 'Argán del Sus, aceite de semilla de higo chumbo y macerado de rosa de Damasco. Un aceite seco que nutre sin brillos: al despertar, el cutis está luminoso y la piel flexible.',
      pour: 'Pieles secas, apagadas o maduras; también para pieles mixtas.',
      texture: 'Aceite seco, se absorbe en 30 segundos, acabado satinado.',
      usage: 'Por la noche, 3 gotas sobre la piel limpia y aún húmeda de agua de rosas. Masajear desde el centro del rostro hacia fuera y hacia arriba.',
      ingredients: [
        { nom: 'Aceite de argán', pct: 52, origine: 'Aït Baha, Sus', img: 'i-argan' },
        { nom: 'Aceite de semilla de higo chumbo', pct: 30, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Macerado de rosa de Damasco', pct: 15, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Vitamina E natural', pct: 2, origine: 'Girasol', img: '' },
        { nom: 'Neroli', pct: 1, origine: 'Gharb, cerca de Kenitra', img: 'i-oranger' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis Seed Oil, Rosa Damascena Flower Extract, Tocopherol, Helianthus Annuus Seed Oil, Citrus Aurantium Amara Flower Oil, Citronellol*, Geraniol*, Linalool*. *Presentes de forma natural en los aceites esenciales.'
    },
    {
      id: 'eau-rose', photo: 'p-eau-rose', nom: 'Agua de rosas', type: 'visage', categorie: 'Bruma tonificante', format: '200 ml', prix: 75,
      forme: 'spray', contenu: '#ee8fa6', att: 1.6, r: .42, h: 1.25, sous: 'Kelaat M’Gouna · 200 ml',
      accroche: 'Destilada en Kelaat M’Gouna, el valle de las rosas.',
      texte: 'Un agua floral pura, destilada al vapor a partir de rosas de Damasco recogidas al amanecer en mayo. Tonifica, calma y prepara la piel para el siguiente paso.',
      pour: 'Todo tipo de pieles, incluso sensibles.',
      texture: 'Agua floral, bruma fina.',
      usage: 'Mañana y noche, tres pulverizaciones a 20 cm del rostro, con los ojos cerrados. También para diluir la mascarilla de ghassoul.',
      ingredients: [{ nom: 'Agua floral de rosa de Damasco', pct: 100, origine: 'Kelaat M’Gouna', img: 'i-rose' }],
      inci: 'Rosa Damascena Flower Water.'
    },
    {
      id: 'masque', photo: 'p-masque', nom: 'Mascarilla Ghassoul y rosa', type: 'visage', categorie: 'Mascarilla purificante', format: '150 g', prix: 95,
      forme: 'jar', contenu: '#a98a72', opaque: true, mat: .95, or: true, sous: 'Rhassoul y rosa · 150 g',
      accroche: 'La arcilla del Atlas Medio, suavizada con rosa.',
      texte: 'El ghassoul (rhassoul) solo existe en Marruecos. Mezclado con polvo de pétalos, absorbe el exceso de sebo y cierra los poros sin resecar.',
      pour: 'Pieles mixtas a grasas, tez apagada.',
      texture: 'Polvo que se mezcla hasta formar una pasta cremosa.',
      usage: 'Una cucharada de polvo y un chorrito de agua de rosas, en capa fina. Dejar actuar 10 minutos y aclarar antes de que se seque del todo. Una o dos veces por semana.',
      ingredients: [
        { nom: 'Ghassoul (rhassoul)', pct: 85, origine: 'Ksabi, Atlas Medio', img: 'i-rhassoul' },
        { nom: 'Polvo de pétalos de rosa', pct: 12, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Polvo de flor de azahar', pct: 3, origine: 'Gharb', img: 'i-oranger' }
      ],
      inci: 'Moroccan Lava Clay, Rosa Damascena Flower Powder, Citrus Aurantium Amara Flower Powder.'
    },
    {
      id: 'baume', photo: 'p-baume', nom: 'Bálsamo de noche al azafrán', type: 'visage', categorie: 'Tratamiento nutritivo', format: '50 ml', prix: 240,
      forme: 'jar', r: .42, h: .36, contenu: '#f0c270', opaque: true, mat: .45, or: true, sous: 'Cuidado de noche · 50 ml',
      accroche: 'El azafrán de Taliouine, fundido en argán.',
      texte: 'Un bálsamo que se funde al contacto con la piel: argán, higo chumbo y almendra dulce, con un poco de cera de abeja del bosque de la Maamora. El azafrán aporta su brillo dorado.',
      pour: 'Pieles secas o muy secas, zonas tirantes.',
      texture: 'Bálsamo fundente que se vuelve aceite entre los dedos.',
      usage: 'Por la noche, una pequeña cantidad calentada entre los dedos, aplicada a toques. En cura de cuatro semanas en invierno.',
      ingredients: [
        { nom: 'Aceite de argán', pct: 48, origine: 'Aït Baha, Sus', img: 'i-argan' },
        { nom: 'Aceite de higo chumbo', pct: 20, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Aceite de almendra dulce', pct: 17, origine: 'Haouz', img: '' },
        { nom: 'Cera de abeja', pct: 12, origine: 'Bosque de la Maamora', img: 'i-miel' },
        { nom: 'Macerado de azafrán', pct: 2, origine: 'Taliouine', img: 'i-safran' },
        { nom: 'Vitamina E natural', pct: 1, origine: 'Girasol', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Prunus Amygdalus Dulcis Oil, Cera Alba, Crocus Sativus Flower Extract, Tocopherol.'
    },
    {
      id: 'racines', photo: 'p-racines', nom: 'Aceite Raíces', type: 'cheveux', categorie: 'Baño de aceite fortificante', format: '100 ml', prix: 160, badge: 'Novedad',
      forme: 'bottle', r: .4, h: 1.1, contenu: '#b8701f', att: .8, or: true, sous: 'Baño de aceite · 100 ml',
      accroche: 'El baño de aceite de nuestras abuelas, más ligero.',
      texte: 'El argán, la nigella y el ricino nutren la fibra; el romero del Oriental y el cedro del Atlas despiertan el cuero cabelludo. El cabello queda más fuerte, más brillante y se desenreda de un gesto.',
      pour: 'Cabello seco, quebradizo o de crecimiento lento; rizos y ondas.',
      texture: 'Aceite fluido, aroma amaderado y herbal.',
      usage: 'De 8 a 10 gotas masajeadas en el cuero cabelludo y extendidas hasta las puntas. 30 minutos bajo una toalla caliente, o toda la noche, y después un champú suave.',
      ingredients: [
        { nom: 'Aceite de argán', pct: 46, origine: 'Aït Baha, Sus', img: 'i-argan' },
        { nom: 'Aceite de nigella', pct: 30, origine: 'Llanura del Saïss', img: 'i-nigelle' },
        { nom: 'Aceite de ricino', pct: 21, origine: 'Prensado en frío', img: '' },
        { nom: 'Aceite esencial de romero', pct: 2, origine: 'Oriental', img: 'i-romarin' },
        { nom: 'Aceite esencial de cedro del Atlas', pct: 1, origine: 'Azrou, Atlas Medio', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Ricinus Communis Seed Oil, Rosmarinus Officinalis Leaf Oil, Cedrus Atlantica Wood Oil, Tocopherol, Limonene*, Linalool*. *Presentes de forma natural en los aceites esenciales.'
    },
    {
      id: 'oranger', photo: 'p-oranger', nom: 'Bruma de azahar', type: 'cheveux', categorie: 'Bruma para cabello y rostro', format: '150 ml', prix: 95,
      forme: 'spray', contenu: '#f1dca6', att: 2.4, sous: 'Cabello y rostro · 150 ml',
      accroche: 'Los naranjos del Gharb, a 40 km del taller.',
      texte: 'El agua de azahar (el zhar de las bodas marroquíes) y el aloe vera hidratan sin apelmazar; un toque de argán hace brillar las puntas. Un aroma fresco, nunca empalagoso.',
      pour: 'Todo tipo de cabello; también como bruma refrescante para el rostro.',
      texture: 'Bruma ligera, agitar antes de usar.',
      usage: 'Sobre el cabello seco o húmedo, a 20 cm, de medios a puntas. Sin aclarado.',
      ingredients: [
        { nom: 'Agua de azahar', pct: 84, origine: 'Gharb, cerca de Kenitra', img: 'i-oranger' },
        { nom: 'Zumo de aloe vera', pct: 12, origine: 'Sus', img: 'i-aloe' },
        { nom: 'Glicerina vegetal', pct: 3, origine: 'Colza', img: '' },
        { nom: 'Aceite de argán', pct: 1, origine: 'Aït Baha, Sus', img: 'i-argan' }
      ],
      inci: 'Citrus Aurantium Amara Flower Water, Aloe Barbadensis Leaf Juice, Glycerin, Argania Spinosa Kernel Oil, Sodium Benzoate, Potassium Sorbate.'
    },
    {
      id: 'savon', photo: 'p-savon', nom: 'Jabón negro a la rosa', type: 'rituel', categorie: 'Exfoliante del hammam', format: '200 g', prix: 65,
      forme: 'jar', r: .46, h: .4, contenu: '#4a2c1c', opaque: true, mat: .25, brillant: true, or: false, capuchon: '#efe0d8', sous: 'Hammam · 200 g',
      accroche: 'El jabón beldi, perfumado con rosa.',
      texte: 'Pasta de aceite de oliva saponificado, enriquecida con agua de rosas. Se aplica sobre la piel húmeda y se aclara: prepara la piel para exfoliarla con el guante kessa.',
      pour: 'Cuerpo y rostro, en el hammam o en la ducha.',
      texture: 'Pasta fundente, espuma ligera.',
      usage: 'Sobre la piel húmeda, dejar actuar 5 minutos, aclarar y frotar con el guante kessa.',
      ingredients: [
        { nom: 'Jabón negro de aceite de oliva', pct: 90, origine: 'Mequinez', img: '' },
        { nom: 'Agua de rosas', pct: 8, origine: 'Kelaat M’Gouna', img: 'i-rose' },
        { nom: 'Polvo de pétalos de rosa', pct: 2, origine: 'Kelaat M’Gouna', img: 'i-rose' }
      ],
      inci: 'Potassium Olivate, Aqua, Rosa Damascena Flower Water, Glycerin, Rosa Damascena Flower Powder.'
    },
    {
      id: 'coffret', photo: 'p-coffret', nom: 'Estuche Ritual Lalla Warda', type: 'rituel', categorie: 'Elixir, agua de rosas y mascarilla', format: '3 productos', prix: 420, avant: 460, badge: 'Para regalar',
      forme: 'coffret', contenu_coffret: ['elixir', 'eau-rose', 'masque'],
      accroche: 'El ritual facial completo, en una caja para regalar.',
      texte: 'El Elixir de rosa, el Agua de rosas y la Mascarilla Ghassoul y rosa, con el ritual escrito a mano.',
      pour: 'Un primer ritual, o un regalo.',
      texture: 'Tres productos, tres texturas.',
      usage: 'Pulverizar, mascarilla una o dos veces por semana, nutrir cada noche.',
      ingredients: [], inci: ''
    }
  ],

  hero: {
    produit: 'elixir',
    ingredients: [
      { nom: 'Rosa de Damasco', pct: '15 %', origine: 'Kelaat M’Gouna', img: 'i-rose', size: .8 },
      { nom: 'Aceite de argán', pct: '52 %', origine: 'Aït Baha, Sus', img: 'i-argan', size: .52 },
      { nom: 'Flor de azahar', pct: '1 %', origine: 'Gharb, cerca de Kenitra', img: 'i-oranger', size: .62 },
      { nom: 'Higo chumbo', pct: '30 %', origine: 'Sidi Ifni', img: 'i-figue', size: .6 },
      { nom: 'Vitamina E', pct: '2 %', origine: 'Girasol', img: '', size: .26 }
    ],
    total: ['5 ingredientes', '100 % de origen natural', 'prensado en frío', 'sin siliconas']
  },

  textures: [
    { id: 'huile', produit: 'elixir', nom: 'Aceite seco', note: 'Se absorbe en 30 s · acabado satinado' },
    { id: 'baume', produit: 'baume', nom: 'Bálsamo fundente', note: 'Se vuelve aceite entre los dedos' },
    { id: 'argile', produit: 'masque', nom: 'Pasta de arcilla', note: 'Mate, se aclara con agua tibia' },
    { id: 'brume', produit: 'eau-rose', nom: 'Bruma floral', note: 'Fina como el rocío' }
  ],

  visage: [
    { id: 'brume', titre: 'Pulverizar', produit: 'eau-rose', temps: '10 s', texte: 'Tres pulverizaciones a 20 cm, con los ojos cerrados. Una piel húmeda absorbe mejor el siguiente paso.', zones: ['Todo el rostro'] },
    { id: 'masque', titre: 'Mascarilla', produit: 'masque', temps: '10 min', texte: 'Una capa fina, del centro hacia fuera. Se evitan el contorno de ojos y los labios, y se aclara antes de que la arcilla se seque del todo.', zones: ['Frente', 'Zona T', 'Mejillas', 'Barbilla'] },
    { id: 'rincer', titre: 'Aclarar', produit: '', temps: '1 min', texte: 'Con agua tibia, en pequeños círculos: al desprenderse, el ghassoul exfolia con suavidad.', zones: [] },
    { id: 'nourrir', titre: 'Nutrir', produit: 'elixir', temps: '1 min', texte: 'Tres gotas calentadas en las palmas, presionadas sobre el rostro y masajeadas hacia arriba, hacia las sienes.', zones: ['Pómulos', 'Frente', 'Barbilla'] }
  ],
  zonesVisage: { yeux: 'Contorno de ojos: se evita', front: 'Frente', zoneT: 'Zona T', joues: 'Mejillas', menton: 'Barbilla' },

  cheveux: {
    microscope: [
      { titre: 'Cutícula levantada', texte: 'Escamas abiertas: el cabello se engancha, se enreda y se rompe.' },
      { titre: 'El aceite envuelve la fibra', texte: 'El argán y la nigella se deslizan bajo las escamas y las nutren.' },
      { titre: 'Escamas cerradas', texte: 'La luz se refleja en una superficie lisa: el cabello brilla y se desliza.' }
    ],
    diametre: '70 µm, el grosor de un cabello',
    etapes: [
      { titre: 'Calentar', temps: '10 s', texte: 'De 8 a 10 gotas en las palmas: frótalas para templar el aceite.' },
      { titre: 'Masajear el cuero cabelludo', temps: '3 min', texte: 'Con las yemas de los dedos, en pequeños círculos: el romero activa la microcirculación.' },
      { titre: 'Extender por los medios', temps: '1 min', texte: 'Baja hasta las puntas, donde el cabello está más seco.' },
      { titre: 'Dejar actuar', temps: '30 min', texte: 'Bajo una toalla caliente, o toda la noche, y después un champú suave.' }
    ]
  },

  quiz: {
    questions: [
      { id: 'peau', titre: '¿Tu piel?', choix: [['seche', 'Seca, tirante'], ['mixte', 'Mixta'], ['grasse', 'Grasa, poros visibles'], ['sensible', 'Sensible, reactiva']] },
      { id: 'cheveux', titre: '¿Tu cabello?', choix: [['secs', 'Seco, puntas dañadas'], ['fins', 'Fino, se engrasa rápido'], ['boucles', 'Rizado u ondulado'], ['chute', 'Se cae, crece despacio']] },
      { id: 'envie', titre: '¿Tu prioridad?', choix: [['eclat', 'Un cutis luminoso'], ['confort', 'Confort y nutrición'], ['purete', 'Una piel limpia'], ['brillance', 'Un cabello brillante']] }
    ],
    points: {
      seche: { elixir: 3, baume: 3, 'eau-rose': 1 }, mixte: { elixir: 2, masque: 2, 'eau-rose': 2 }, grasse: { masque: 3, 'eau-rose': 2 }, sensible: { 'eau-rose': 3, elixir: 1 },
      secs: { racines: 3, oranger: 1 }, fins: { oranger: 3 }, boucles: { racines: 2, oranger: 2 }, chute: { racines: 3 },
      eclat: { elixir: 3, masque: 1 }, confort: { baume: 3, elixir: 1 }, purete: { masque: 3, savon: 1 }, brillance: { racines: 2, oranger: 2 }
    },
    matin: 'Por la mañana', soir: 'Por la noche', hebdo: 'Una o dos veces por semana', cheveux: 'Para el cabello'
  },

  origines: [
    { id: 'kenitra', nom: 'El taller', lieu: 'Kenitra', lat: 34.261, lon: -6.580, atelier: true, texte: 'Cada frasco se llena y se etiqueta a mano, en lotes de 40.' },
    { id: 'maamora', nom: 'Cera de abeja', lieu: 'Bosque de la Maamora', lat: 34.15, lon: -6.35, img: 'i-miel', texte: 'Uno de los mayores alcornocales del mundo, a las puertas de Kenitra.' },
    { id: 'gharb', nom: 'Flor de azahar', lieu: 'Gharb, Sidi Slimane', lat: 34.264, lon: -5.926, img: 'i-oranger', texte: 'Los naranjos del Gharb florecen en marzo: el zhar se destila esa misma semana.' },
    { id: 'saiss', nom: 'Nigella', lieu: 'Llanura del Saïss', lat: 33.95, lon: -5.35, img: 'i-nigelle', texte: 'Las semillas negras de la habba sawda, prensadas en frío.' },
    { id: 'ksabi', nom: 'Ghassoul', lieu: 'Ksabi, Atlas Medio', lat: 32.86, lon: -4.43, img: 'i-rhassoul', texte: 'El único yacimiento de ghassoul explotado del mundo, en el valle del Muluya.' },
    { id: 'oriental', nom: 'Romero', lieu: 'Oriental', lat: 34.06, lon: -2.32, img: 'i-romarin', texte: 'Romero silvestre de las mesetas altas, destilado allí mismo.' },
    { id: 'mgouna', nom: 'Rosa de Damasco', lieu: 'Kelaat M’Gouna', lat: 31.24, lon: -6.13, img: 'i-rose', texte: 'Recogida a mano en mayo, antes de las 9, cuando su perfume es más intenso.' },
    { id: 'taliouine', nom: 'Azafrán', lieu: 'Taliouine', lat: 30.53, lon: -7.92, img: 'i-safran', texte: 'Tres estigmas por flor, separados a mano en otoño.' },
    { id: 'aitbaha', nom: 'Argán', lieu: 'Aït Baha, Sus', lat: 30.07, lon: -9.15, img: 'i-argan', texte: 'Prensado en frío por una cooperativa de mujeres.' },
    { id: 'ifni', nom: 'Higo chumbo', lieu: 'Sidi Ifni', lat: 29.38, lon: -10.17, img: 'i-figue', texte: 'Hace falta casi una tonelada de fruta para un litro de aceite de semilla.' }
  ],
  km: 'km en línea recta', kmShort: 'km',

  chiffres: [
    { n: 1000, unite: 'kg', texte: 'de higos chumbos para un litro de aceite de semilla' },
    { n: 4000, unite: 'kg', texte: 'de pétalos de rosa para un kilo de aceite esencial' },
    { n: 15, unite: 'h', texte: 'de trabajo manual para un litro de aceite de argán tradicional' },
    { n: 40, unite: '', texte: 'frascos por lote, llenados y etiquetados en Kenitra' }
  ],

  avis: [
    ['El elixir ha sustituido a mi crema de noche. Tres gotas y por la mañana tengo la piel suave como después del hammam.', 'Salma', 'Rabat'],
    ['El Aceite Raíces en mis rizos: adiós al encrespamiento, y huelen a cedro todo el día.', 'Imane', 'Casablanca'],
    ['Lo pedí el lunes por WhatsApp, llegó el miércoles a Tánger y pagué al recibirlo. El estuche venía envuelto con pétalos.', 'Nadia', 'Tánger'],
    ['La mascarilla de ghassoul no tira como otras arcillas. Mi zona T está limpia toda la semana.', 'Rim', 'Kenitra']
  ],

  faq: [
    ['¿Cómo hago un pedido?', 'Añade tus productos a la cesta y pulsa «Pedir por WhatsApp»: el mensaje ya está escrito, solo tienes que enviarlo. Te confirmamos en el día.'],
    ['¿Cuánto cuesta el envío?', 'A todo Marruecos en 24 a 72 h: 35 MAD, gratis a partir de 400 MAD. Recogida gratuita en el taller de Kenitra, con cita previa.'],
    ['¿Cómo pago?', 'Contra reembolso, en efectivo, o por transferencia si lo prefieres.'],
    ['¿Son naturales tus productos?', 'Fórmulas cortas, ingredientes de origen natural, sin siliconas ni perfume sintético. Las brumas llevan un conservante suave, imprescindible en cuanto hay agua.'],
    ['¿Piel sensible, embarazo?', 'Los aceites esenciales nunca superan el 3 %. Haz una prueba en la flexura del codo 24 h antes; si estás embarazada o dando el pecho, consulta a tu médico.'],
    ['¿Cuánto duran?', '12 meses tras la apertura para los aceites y el bálsamo, 6 meses para las brumas, lejos del calor y de la luz.']
  ],

  credits: [
    ['Rosa de Damasco', 'Nabil Talibi · Wikimedia Commons, recortada', 'CC BY-SA 4.0'],
    ['Almendra de argán', 'Roger Culos · Wikimedia Commons (Museo de Historia Natural de Toulouse), recortada', 'CC BY-SA 3.0'],
    ['Higo chumbo', 'Jules Verne Times Two · Wikimedia Commons, recortado', 'CC BY-SA 4.0'],
    ['Ventana de la alcazaba de Mehdia', 'Fauve · Wikimedia Commons', 'CC BY 4.0'],
    ['Rostro, cabello, pétalo, manos, nigella, ghassoul, romero, flor de azahar, azafrán, panal, aloe vera', 'Jota Lao, Thalia Ruiz, Meina Yin, Christin Hume, Mockupo, Alex Saks, Jocelyn Morales, Muhammad Ali Khoshkerdar, Mohammad Amiri, Jonas Hensel, pisauikan · Unsplash', 'Licencia de Unsplash'],
    ['Costas de Marruecos', 'Natural Earth', 'Dominio público']
  ],

  ui: {
    add: 'Añadir', added: 'Añadido a la cesta', addRoutine: 'Añadir todo a la cesta', see: 'Ver la ficha', close: 'Cerrar',
    cart: 'Cesta', cartEmpty: 'Tu cesta está vacía: todo ritual empieza con una gota.', qty: 'Cantidad', remove: 'Quitar',
    less: 'Uno menos', more: 'Uno más', subtotal: 'Subtotal', delivery: 'Envío', free: 'gratis', total: 'Total',
    freeFrom: n => `Envío gratis a partir de ${n}`, freeLeft: n => `Te faltan ${n} para el envío gratis`,
    name: 'Tu nombre', city: 'Tu ciudad', order: 'Pedir por WhatsApp', copy: 'Copiar el mensaje', copied: 'Mensaje copiado',
    selected: 'Texto seleccionado: cópialo con Cmd+C o Ctrl+C.',
    demoWa: 'Demo: en la web real, WhatsApp se abre con tu pedido listo para enviar.',
    demoInsta: h => `Demo: en la web real, este enlace abre @${h} en Instagram.`,
    msgHello: '¡Hola, Lalla Warda! Quiero pedir:', msgTotal: 'Total', msgDelivery: 'Envío', msgName: 'Nombre', msgCity: 'Ciudad',
    msgPay: 'Pago contra reembolso. ¡Gracias!',
    compo: 'Composición', inci: 'Lista INCI', usage: 'Modo de uso', pour: 'Para quién', texture: 'Textura', origin: 'Origen',
    explode: 'Vista despiezada', drag: 'Gira el frasco', all: 'Todo', filters: [['tout', 'Todo'], ['visage', 'Rostro'], ['cheveux', 'Cabello'], ['rituel', 'Rituales']],
    step: 'Paso', of: 'de', menuOpen: 'Abrir el menú', menuClose: 'Cerrar el menú', result: 'Tu rutina', restart: 'Empezar de nuevo',
    deliveryNote: (p, f, d) => `Envíos a todo Marruecos en ${d}: ${p}, gratis a partir de ${f}. Pago en efectivo contra reembolso, o recogida gratuita en el taller de Kenitra.`,
    ocean: 'Océano Atlántico', med: 'Mediterráneo',
    pct: n => `${n} %`,
    before: 'antes', colon: ': ', seeOnInsta: t => `${t} en Instagram`, replay: 'Repetir', cartCount: n => `Cesta, ${n} artículo${n === 1 ? '' : 's'}`
  }
};
