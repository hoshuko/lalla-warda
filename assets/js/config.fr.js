/* Lalla Warda · contenu du site en français. Tout ce que la marque met à jour se trouve ici :
   coordonnées, produits et prix, formules, rituels, origines des ingrédients, avis, questions et textes de l'interface.
   demo: true affiche la mention « données fictives » et empêche les boutons WhatsApp et Instagram de quitter la page. */
window.SITE = {
  lang: 'fr',
  demo: true,
  marque: { nom: 'Lalla Warda', ar: 'لالة وردة', ville: 'Kénitra', fondatrice: 'Kenza Amrani' },
  contact: {
    whatsapp: '212600000000',                 // numéro au format international, sans + ni espaces
    telephone: '06 00 00 00 00',
    instagram: 'lallawarda.ma',
    atelier: 'Quartier Val Fleuri, Kénitra',
    horaires: [['Commandes WhatsApp', '7 j/7, réponse dans la journée'], ['Atelier', 'mardi au samedi, sur rendez-vous']]
  },
  devise: { symbol: 'DH', before: false },
  livraison: { prix: 35, offerte: 400, delai: '24 à 72 h' },

  // forme : dropper, spray, jar, bottle, coffret · contenu : couleur du liquide (ou de la pâte si opaque)
  produits: [
    {
      id: 'elixir', photo: 'p-elixir', nom: 'Élixir de rose', type: 'visage', categorie: 'Sérum visage à l’huile', format: '30 ml', prix: 290, badge: 'Le plus aimé',
      forme: 'dropper', contenu: '#e39a2b', att: .55, sous: 'Sérum visage · 30 ml',
      accroche: 'L’éclat d’une nuit de sommeil, en trois gouttes.',
      texte: 'Argan du Souss, pépins de figue de barbarie et macérât de rose de Damas. Une huile sèche qui nourrit sans briller : au réveil, le teint est lumineux et la peau souple.',
      pour: 'Peaux sèches, ternes ou matures ; convient aussi aux peaux mixtes.',
      texture: 'Huile sèche, pénètre en 30 secondes, fini satiné.',
      usage: 'Le soir, 3 gouttes sur peau propre et encore humide d’eau de rose. Masser du centre du visage vers l’extérieur, en remontant.',
      ingredients: [
        { nom: 'Huile d’argan', pct: 52, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Huile de pépins de figue de barbarie', pct: 30, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Macérât de rose de Damas', pct: 15, origine: 'Kelâat M’Gouna', img: 'i-rose' },
        { nom: 'Vitamine E naturelle', pct: 2, origine: 'Tournesol', img: '' },
        { nom: 'Néroli', pct: 1, origine: 'Gharb, près de Kénitra', img: 'i-oranger' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Simmondsia Chinensis Seed Oil, Rosa Damascena Flower Extract, Tocopherol, Helianthus Annuus Seed Oil, Citrus Aurantium Amara Flower Oil, Citronellol*, Geraniol*, Linalool*. *Présents naturellement dans les huiles essentielles.'
    },
    {
      id: 'eau-rose', photo: 'p-eau-rose', nom: 'Eau de rose', type: 'visage', categorie: 'Brume tonique', format: '200 ml', prix: 75,
      forme: 'spray', contenu: '#ee8fa6', att: 1.6, r: .42, h: 1.25, sous: 'Kelâat M’Gouna · 200 ml',
      accroche: 'Distillée à Kelâat M’Gouna, la vallée des roses.',
      texte: 'Une eau florale pure, obtenue par distillation à la vapeur des roses de Damas cueillies en mai, à l’aube. Elle tonifie, apaise et prépare la peau au soin qui suit.',
      pour: 'Tous types de peau, même sensibles.',
      texture: 'Eau florale, brume fine.',
      usage: 'Matin et soir, trois pressions à 20 cm du visage, yeux fermés. Aussi pour délayer le masque au ghassoul.',
      ingredients: [{ nom: 'Eau florale de rose de Damas', pct: 100, origine: 'Kelâat M’Gouna', img: 'i-rose' }],
      inci: 'Rosa Damascena Flower Water.'
    },
    {
      id: 'masque', photo: 'p-masque', nom: 'Masque Ghassoul & rose', type: 'visage', categorie: 'Masque purifiant', format: '150 g', prix: 95,
      forme: 'jar', contenu: '#a98a72', opaque: true, mat: .95, or: true, sous: 'Rhassoul & rose · 150 g',
      accroche: 'L’argile du Moyen Atlas, adoucie de rose.',
      texte: 'Le ghassoul (rhassoul) ne vient que du Maroc. Mélangé à la poudre de pétales, il absorbe l’excès de sébum et resserre les pores sans dessécher.',
      pour: 'Peaux mixtes à grasses, teint brouillé.',
      texture: 'Poudre à délayer, pâte crémeuse.',
      usage: 'Une cuillère de poudre, un trait d’eau de rose, en couche fine. Laisser poser 10 minutes et rincer avant qu’il ne sèche complètement. Une à deux fois par semaine.',
      ingredients: [
        { nom: 'Ghassoul (rhassoul)', pct: 85, origine: 'Ksabi, Moyen Atlas', img: 'i-rhassoul' },
        { nom: 'Poudre de pétales de rose', pct: 12, origine: 'Kelâat M’Gouna', img: 'i-rose' },
        { nom: 'Poudre de fleur d’oranger', pct: 3, origine: 'Gharb', img: 'i-oranger' }
      ],
      inci: 'Moroccan Lava Clay, Rosa Damascena Flower Powder, Citrus Aurantium Amara Flower Powder.'
    },
    {
      id: 'baume', photo: 'p-baume', nom: 'Baume de nuit au safran', type: 'visage', categorie: 'Soin riche', format: '50 ml', prix: 240,
      forme: 'jar', r: .42, h: .36, contenu: '#f0c270', opaque: true, mat: .45, or: true, sous: 'Soin de nuit · 50 ml',
      accroche: 'Le safran de Taliouine, fondu dans l’argan.',
      texte: 'Un baume qui fond au contact de la peau : argan, figue de barbarie et amande douce, tenus par un peu de cire d’abeille de la Maâmora. Le safran apporte son éclat doré.',
      pour: 'Peaux sèches à très sèches, zones qui tiraillent.',
      texture: 'Baume fondant, devient huile sous les doigts.',
      usage: 'Le soir, une noisette réchauffée entre les doigts, appliquée par pressions. En cure de 4 semaines l’hiver.',
      ingredients: [
        { nom: 'Huile d’argan', pct: 48, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Huile de figue de barbarie', pct: 20, origine: 'Sidi Ifni', img: 'i-figue' },
        { nom: 'Huile d’amande douce', pct: 17, origine: 'Haouz', img: '' },
        { nom: 'Cire d’abeille', pct: 12, origine: 'Forêt de la Maâmora', img: 'i-miel' },
        { nom: 'Macérât de safran', pct: 2, origine: 'Taliouine', img: 'i-safran' },
        { nom: 'Vitamine E naturelle', pct: 1, origine: 'Tournesol', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Opuntia Ficus-Indica Seed Oil, Prunus Amygdalus Dulcis Oil, Cera Alba, Crocus Sativus Flower Extract, Tocopherol.'
    },
    {
      id: 'racines', photo: 'p-racines', nom: 'Huile Racines', type: 'cheveux', categorie: 'Bain d’huile fortifiant', format: '100 ml', prix: 160, badge: 'Nouveau',
      forme: 'bottle', r: .4, h: 1.1, contenu: '#b8701f', att: .8, or: true, sous: 'Bain d’huile · 100 ml',
      accroche: 'Le bain d’huile de nos grands-mères, en plus léger.',
      texte: 'Argan, nigelle et ricin nourrissent la fibre ; le romarin de l’Oriental et le cèdre de l’Atlas réveillent le cuir chevelu. Les cheveux sont plus forts, plus brillants, et se démêlent en un geste.',
      pour: 'Cheveux secs, cassants ou qui poussent lentement ; boucles et frisures.',
      texture: 'Huile fluide, parfum boisé et herbacé.',
      usage: '8 à 10 gouttes massées sur le cuir chevelu puis lissées jusqu’aux pointes. 30 minutes sous une serviette chaude, ou toute la nuit, puis shampooing doux.',
      ingredients: [
        { nom: 'Huile d’argan', pct: 46, origine: 'Aït Baha, Souss', img: 'i-argan' },
        { nom: 'Huile de nigelle', pct: 30, origine: 'Plaine du Saïss', img: 'i-nigelle' },
        { nom: 'Huile de ricin', pct: 21, origine: 'Pressée à froid', img: '' },
        { nom: 'Huile essentielle de romarin', pct: 2, origine: 'Oriental', img: 'i-romarin' },
        { nom: 'Huile essentielle de cèdre de l’Atlas', pct: 1, origine: 'Azrou, Moyen Atlas', img: '' }
      ],
      inci: 'Argania Spinosa Kernel Oil, Nigella Sativa Seed Oil, Ricinus Communis Seed Oil, Rosmarinus Officinalis Leaf Oil, Cedrus Atlantica Wood Oil, Tocopherol, Limonene*, Linalool*. *Présents naturellement dans les huiles essentielles.'
    },
    {
      id: 'oranger', photo: 'p-oranger', nom: 'Brume fleur d’oranger', type: 'cheveux', categorie: 'Brume cheveux et visage', format: '150 ml', prix: 95,
      forme: 'spray', contenu: '#f1dca6', att: 2.4, sous: 'Cheveux & visage · 150 ml',
      accroche: 'Les orangers du Gharb, à 40 km de l’atelier.',
      texte: 'L’eau de fleur d’oranger (le zhar des mariages) et l’aloe vera hydratent sans alourdir ; une touche d’argan fait briller les pointes. Parfum frais, jamais entêtant.',
      pour: 'Tous types de cheveux ; en brume fraîcheur sur le visage.',
      texture: 'Brume légère, à agiter avant emploi.',
      usage: 'Sur cheveux secs ou humides, à 20 cm, des longueurs aux pointes. Sans rinçage.',
      ingredients: [
        { nom: 'Eau de fleur d’oranger', pct: 84, origine: 'Gharb, près de Kénitra', img: 'i-oranger' },
        { nom: 'Jus d’aloe vera', pct: 12, origine: 'Souss', img: 'i-aloe' },
        { nom: 'Glycérine végétale', pct: 3, origine: 'Colza', img: '' },
        { nom: 'Huile d’argan', pct: 1, origine: 'Aït Baha, Souss', img: 'i-argan' }
      ],
      inci: 'Citrus Aurantium Amara Flower Water, Aloe Barbadensis Leaf Juice, Glycerin, Argania Spinosa Kernel Oil, Sodium Benzoate, Potassium Sorbate.'
    },
    {
      id: 'savon', photo: 'p-savon', nom: 'Savon noir à la rose', type: 'rituel', categorie: 'Gommage du hammam', format: '200 g', prix: 65,
      forme: 'jar', r: .46, h: .4, contenu: '#4a2c1c', opaque: true, mat: .25, brillant: true, or: false, capuchon: '#efe0d8', sous: 'Hammam · 200 g',
      accroche: 'Le savon beldi, parfumé à la rose.',
      texte: 'Pâte d’huile d’olive saponifiée, enrichie d’eau de rose. Appliqué sur peau humide puis rincé, il prépare la peau au gommage au gant kessa.',
      pour: 'Corps et visage, au hammam ou sous la douche.',
      texture: 'Pâte fondante, mousse légère.',
      usage: 'Sur peau humide, laisser poser 5 minutes, rincer, puis frotter au gant kessa.',
      ingredients: [
        { nom: 'Savon noir à l’huile d’olive', pct: 90, origine: 'Meknès', img: '' },
        { nom: 'Eau de rose', pct: 8, origine: 'Kelâat M’Gouna', img: 'i-rose' },
        { nom: 'Poudre de pétales de rose', pct: 2, origine: 'Kelâat M’Gouna', img: 'i-rose' }
      ],
      inci: 'Potassium Olivate, Aqua, Rosa Damascena Flower Water, Glycerin, Rosa Damascena Flower Powder.'
    },
    {
      id: 'coffret', photo: 'p-coffret', nom: 'Coffret Rituel Lalla Warda', type: 'rituel', categorie: 'Élixir, eau de rose et masque', format: '3 soins', prix: 420, avant: 460, badge: 'À offrir',
      forme: 'coffret', contenu_coffret: ['elixir', 'eau-rose', 'masque'],
      accroche: 'Le rituel complet du visage, dans une boîte à offrir.',
      texte: 'L’Élixir de rose, l’Eau de rose et le Masque Ghassoul & rose, avec le mode d’emploi du rituel écrit à la main.',
      pour: 'Un premier rituel, ou un cadeau.',
      texture: 'Trois soins, trois textures.',
      usage: 'Brumiser, masquer une à deux fois par semaine, nourrir chaque soir.',
      ingredients: [], inci: ''
    }
  ],

  // hero : le produit au cœur de la rose et ses ingrédients (images détourées)
  hero: {
    produit: 'elixir',
    ingredients: [
      { nom: 'Rose de Damas', pct: '15 %', origine: 'Kelâat M’Gouna', img: 'i-rose', size: .8 },
      { nom: 'Huile d’argan', pct: '52 %', origine: 'Aït Baha, Souss', img: 'i-argan', size: .52 },
      { nom: 'Fleur d’oranger', pct: '1 %', origine: 'Gharb, près de Kénitra', img: 'i-oranger', size: .62 },
      { nom: 'Figue de barbarie', pct: '30 %', origine: 'Sidi Ifni', img: 'i-figue', size: .6 },
      { nom: 'Vitamine E', pct: '2 %', origine: 'Tournesol', img: '', size: .26 }
    ],
    total: ['5 ingrédients', '100 % d’origine naturelle', 'pressés à froid', 'sans silicone']
  },

  textures: [
    { id: 'huile', produit: 'elixir', nom: 'Huile sèche', note: 'Pénètre en 30 s · fini satiné' },
    { id: 'baume', produit: 'baume', nom: 'Baume fondant', note: 'Devient huile sous les doigts' },
    { id: 'argile', produit: 'masque', nom: 'Pâte d’argile', note: 'Mat, se rince à l’eau tiède' },
    { id: 'brume', produit: 'eau-rose', nom: 'Brume florale', note: 'Fine comme une rosée' }
  ],

  visage: [
    { id: 'brume', titre: 'Brumiser', produit: 'eau-rose', temps: '10 s', texte: 'Trois pressions à 20 cm, yeux fermés. Une peau humide absorbe mieux le soin qui suit.', zones: ['Tout le visage'] },
    { id: 'masque', titre: 'Masquer', produit: 'masque', temps: '10 min', texte: 'Une couche fine, du centre vers l’extérieur. On évite le contour des yeux et les lèvres, et on rince avant que l’argile ne sèche complètement.', zones: ['Front', 'Zone T', 'Joues', 'Menton'] },
    { id: 'rincer', titre: 'Rincer', produit: '', temps: '1 min', texte: 'À l’eau tiède, par petits cercles : en se détachant, le ghassoul exfolie en douceur.', zones: [] },
    { id: 'nourrir', titre: 'Nourrir', produit: 'elixir', temps: '1 min', texte: 'Trois gouttes réchauffées dans les paumes, pressées sur le visage, puis massées en remontant vers les tempes.', zones: ['Pommettes', 'Front', 'Menton'] }
  ],
  zonesVisage: { yeux: 'Contour des yeux : on l’évite', front: 'Front', zoneT: 'Zone T', joues: 'Joues', menton: 'Menton' },

  cheveux: {
    microscope: [
      { titre: 'Cuticule soulevée', texte: 'Écailles ouvertes : le cheveu accroche, s’emmêle et casse.' },
      { titre: 'L’huile gaine la fibre', texte: 'Argan et nigelle se glissent sous les écailles et les nourrissent.' },
      { titre: 'Écailles refermées', texte: 'La lumière se réfléchit sur une surface lisse : le cheveu brille et glisse.' }
    ],
    diametre: '70 µm, l’épaisseur d’un cheveu',
    etapes: [
      { titre: 'Réchauffer', temps: '10 s', texte: '8 à 10 gouttes dans les paumes : on frotte pour tiédir l’huile.' },
      { titre: 'Masser le cuir chevelu', temps: '3 min', texte: 'Du bout des doigts, par petits cercles : le romarin réveille la microcirculation.' },
      { titre: 'Lisser les longueurs', temps: '1 min', texte: 'On descend jusqu’aux pointes, là où le cheveu est le plus sec.' },
      { titre: 'Laisser poser', temps: '30 min', texte: 'Sous une serviette chaude, ou toute la nuit, puis un shampooing doux.' }
    ]
  },

  quiz: {
    questions: [
      { id: 'peau', titre: 'Votre peau ?', choix: [['seche', 'Sèche, qui tiraille'], ['mixte', 'Mixte'], ['grasse', 'Grasse, pores visibles'], ['sensible', 'Sensible, réactive']] },
      { id: 'cheveux', titre: 'Vos cheveux ?', choix: [['secs', 'Secs, pointes abîmées'], ['fins', 'Fins, vite gras'], ['boucles', 'Bouclés ou frisés'], ['chute', 'Ils tombent, poussent lentement']] },
      { id: 'envie', titre: 'Votre priorité ?', choix: [['eclat', 'Un teint lumineux'], ['confort', 'Du confort, du nourrissant'], ['purete', 'Une peau nette'], ['brillance', 'Des cheveux brillants']] }
    ],
    // chaque réponse ajoute des points aux produits
    points: {
      seche: { elixir: 3, baume: 3, 'eau-rose': 1 }, mixte: { elixir: 2, masque: 2, 'eau-rose': 2 }, grasse: { masque: 3, 'eau-rose': 2 }, sensible: { 'eau-rose': 3, elixir: 1 },
      secs: { racines: 3, oranger: 1 }, fins: { oranger: 3 }, boucles: { racines: 2, oranger: 2 }, chute: { racines: 3 },
      eclat: { elixir: 3, masque: 1 }, confort: { baume: 3, elixir: 1 }, purete: { masque: 3, savon: 1 }, brillance: { racines: 2, oranger: 2 }
    },
    matin: 'Le matin', soir: 'Le soir', hebdo: 'Une à deux fois par semaine', cheveux: 'Pour les cheveux'
  },

  origines: [
    { id: 'kenitra', nom: 'L’atelier', lieu: 'Kénitra', lat: 34.261, lon: -6.580, atelier: true, texte: 'Chaque flacon est rempli et étiqueté à la main, par séries de 40.' },
    { id: 'maamora', nom: 'Cire d’abeille', lieu: 'Forêt de la Maâmora', lat: 34.15, lon: -6.35, img: 'i-miel', texte: 'L’une des plus grandes forêts de chênes-lièges du monde, aux portes de Kénitra.' },
    { id: 'gharb', nom: 'Fleur d’oranger', lieu: 'Gharb, Sidi Slimane', lat: 34.264, lon: -5.926, img: 'i-oranger', texte: 'Les orangers du Gharb fleurissent en mars : on distille le zhar dans la semaine.' },
    { id: 'saiss', nom: 'Nigelle', lieu: 'Plaine du Saïss', lat: 33.95, lon: -5.35, img: 'i-nigelle', texte: 'Les graines noires de la habba sawda, pressées à froid.' },
    { id: 'ksabi', nom: 'Ghassoul', lieu: 'Ksabi, Moyen Atlas', lat: 32.86, lon: -4.43, img: 'i-rhassoul', texte: 'Le seul gisement de ghassoul exploité au monde, dans la vallée de la Moulouya.' },
    { id: 'oriental', nom: 'Romarin', lieu: 'Oriental', lat: 34.06, lon: -2.32, img: 'i-romarin', texte: 'Le romarin sauvage des hauts plateaux, distillé sur place.' },
    { id: 'mgouna', nom: 'Rose de Damas', lieu: 'Kelâat M’Gouna', lat: 31.24, lon: -6.13, img: 'i-rose', texte: 'Cueillie à la main en mai, avant 9 h, quand son parfum est le plus fort.' },
    { id: 'taliouine', nom: 'Safran', lieu: 'Taliouine', lat: 30.53, lon: -7.92, img: 'i-safran', texte: 'Trois pistils par fleur, émondés à la main à l’automne.' },
    { id: 'aitbaha', nom: 'Argan', lieu: 'Aït Baha, Souss', lat: 30.07, lon: -9.15, img: 'i-argan', texte: 'Pressé à froid par une coopérative de femmes.' },
    { id: 'ifni', nom: 'Figue de barbarie', lieu: 'Sidi Ifni', lat: 29.38, lon: -10.17, img: 'i-figue', texte: 'Il faut près d’une tonne de fruits pour un litre d’huile de pépins.' }
  ],
  km: 'km à vol d’oiseau', kmShort: 'km',

  chiffres: [
    { n: 1000, unite: 'kg', texte: 'de figues de barbarie pour un litre d’huile de pépins' },
    { n: 4000, unite: 'kg', texte: 'de pétales de rose pour un kilo d’huile essentielle' },
    { n: 15, unite: 'h', texte: 'de travail à la main pour un litre d’huile d’argan traditionnelle' },
    { n: 40, unite: '', texte: 'flacons par série, remplis et étiquetés à Kénitra' }
  ],

  avis: [
    ['L’élixir a remplacé ma crème de nuit. Trois gouttes, et le matin ma peau est douce comme après le hammam.', 'Salma', 'Rabat'],
    ['L’huile Racines sur mes boucles : plus de frisottis, et elles sentent bon le cèdre toute la journée.', 'Imane', 'Casablanca'],
    ['Commandé le lundi sur WhatsApp, reçu le mercredi à Tanger, payé à la livraison. Le coffret était emballé avec des pétales.', 'Nadia', 'Tanger'],
    ['Le masque au ghassoul ne tire pas comme les autres argiles. Ma zone T est nette pour la semaine.', 'Rim', 'Kénitra']
  ],

  faq: [
    ['Comment commander ?', 'Ajoutez vos soins au panier, puis touchez « Commander sur WhatsApp » : le message est déjà écrit, vous n’avez qu’à l’envoyer. On confirme dans la journée.'],
    ['Combien coûte la livraison ?', 'Partout au Maroc, en 24 à 72 h : 35 DH, offerte dès 400 DH. Retrait gratuit à l’atelier de Kénitra, sur rendez-vous.'],
    ['Comment payer ?', 'À la livraison, en espèces, ou par virement si vous préférez.'],
    ['Vos soins sont-ils naturels ?', 'Formules courtes, ingrédients d’origine naturelle, sans silicone ni parfum de synthèse. Les brumes contiennent un conservateur doux, indispensable dès qu’il y a de l’eau.'],
    ['Peau sensible, grossesse ?', 'Les huiles essentielles ne dépassent jamais 3 %. Faites un test au pli du coude 24 h avant ; enceinte ou allaitante, demandez l’avis de votre médecin.'],
    ['Combien de temps se conservent-ils ?', '12 mois après ouverture pour les huiles et le baume, 6 mois pour les brumes, à l’abri de la chaleur et de la lumière.']
  ],

  credits: [
    ['Rose de Damas', 'Nabil Talibi · Wikimedia Commons, détourée', 'CC BY-SA 4.0'],
    ['Amande d’argan', 'Roger Culos · Wikimedia Commons (Muséum de Toulouse), détourée', 'CC BY-SA 3.0'],
    ['Figue de barbarie', 'Jules Verne Times Two · Wikimedia Commons, détourée', 'CC BY-SA 4.0'],
    ['Fenêtre de la kasbah de Mehdia', 'Fauve · Wikimedia Commons', 'CC BY 4.0'],
    ['Visage, cheveux, pétale, mains, nigelle, ghassoul, romarin, fleur d’oranger, safran, miel, aloe vera', 'Jota Lao, Thalia Ruiz, Meina Yin, Christin Hume, Mockupo, Alex Saks, Jocelyn Morales, Muhammad Ali Khoshkerdar, Mohammad Amiri, Jonas Hensel, pisauikan · Unsplash', 'Licence Unsplash'],
    ['Côtes du Maroc', 'Natural Earth', 'Domaine public']
  ],

  ui: {
    add: 'Ajouter', added: 'Ajouté au panier', addRoutine: 'Tout ajouter au panier', see: 'Voir la fiche', close: 'Fermer',
    cart: 'Panier', cartEmpty: 'Votre panier est vide : le rituel commence par une goutte.', qty: 'Quantité', remove: 'Retirer',
    less: 'Un de moins', more: 'Un de plus', subtotal: 'Sous-total', delivery: 'Livraison', free: 'offerte', total: 'Total',
    freeFrom: n => `Livraison offerte dès ${n}`, freeLeft: n => `Plus que ${n} pour la livraison offerte`,
    name: 'Votre prénom', city: 'Votre ville', order: 'Commander sur WhatsApp', copy: 'Copier le message', copied: 'Message copié',
    selected: 'Texte sélectionné : copiez-le avec Cmd+C ou Ctrl+C.',
    demoWa: 'Démo : sur le vrai site, WhatsApp s’ouvre avec votre commande prête à envoyer.',
    demoInsta: h => `Démo : sur le vrai site, ce lien ouvre @${h} sur Instagram.`,
    msgHello: 'Bonjour Lalla Warda ! Je souhaite commander :', msgTotal: 'Total', msgDelivery: 'Livraison', msgName: 'Prénom', msgCity: 'Ville',
    msgPay: 'Paiement à la livraison. Merci !',
    compo: 'Composition', inci: 'Liste INCI', usage: 'Utilisation', pour: 'Pour qui', texture: 'Texture', origin: 'Origine',
    explode: 'Vue éclatée', drag: 'Faites tourner le flacon', all: 'Tout', filters: [['tout', 'Tout'], ['visage', 'Visage'], ['cheveux', 'Cheveux'], ['rituel', 'Rituels']],
    step: 'Étape', of: 'sur', menuOpen: 'Ouvrir le menu', menuClose: 'Fermer le menu', result: 'Votre routine', restart: 'Recommencer',
    deliveryNote: (p, f, d) => `Livraison en ${d} partout au Maroc : ${p}, offerte dès ${f}. Paiement en espèces à la livraison, ou retrait gratuit à l’atelier de Kénitra.`,
    ocean: 'Océan Atlantique', med: 'Méditerranée',
    pct: n => `${n}\u202F%`,
    before: 'au lieu de', colon: ' : ', seeOnInsta: t => `${t} sur Instagram`, replay: 'Rejouer', cartCount: n => `Panier, ${n} article${n > 1 ? 's' : ''}`
  }
};
