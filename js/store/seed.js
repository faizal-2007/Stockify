// store/seed.js — Karnataka hierarchy demo data: Head Office in Mangaluru, 4 Divisions, 31 Districts, 240 Taluks, 480 Stores
(function () {
  'use strict';

  const storage = window.Stockify.store.storage;

  function ago(days) {
    const d = new Date(Date.now() - days * 86400000);
    return d.toISOString();
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // ─────────────────────────────────────────
  // KARNATAKA ADMINISTRATIVE DATA
  // 4 Divisions, 31 Districts, 240 Taluks
  // ─────────────────────────────────────────
  const KARNATAKA_HIERARCHY = {
  "Bengaluru Division": {
    "Bengaluru Urban": [
      "Bengaluru North",
      "Bengaluru South",
      "Bengaluru East",
      "Yelahanka",
      "Anekal"
    ],
    "Bengaluru Rural": [
      "Nelamangala",
      "Doddaballapura",
      "Devanahalli",
      "Hosakote"
    ],
    "Chikkaballapura": [
      "Chikkaballapura",
      "Bagepalli",
      "Chintamani",
      "Gauribidanuru",
      "Gudibanda",
      "Sidlaghatta",
      "Cheluru",
      "Manchenahalli"
    ],
    "Chitradurga": [
      "Chitradurga",
      "Challakere",
      "Hiriyur",
      "Holalkere",
      "Hosadurga",
      "Molakalmuru"
    ],
    "Davanagere": [
      "Davanagere",
      "Harihara",
      "Channagiri",
      "Honnali",
      "Nyamathi",
      "Jagaluru"
    ],
    "Kolar": [
      "Kolar",
      "Bangarapete",
      "Maluru",
      "Mulabagilu",
      "Srinivasapura",
      "Kolar Gold Fields (Robertsonpete)"
    ],
    "Ramanagara": [
      "Ramanagara",
      "Magadi",
      "Kanakapura",
      "Channapattana",
      "Harohalli"
    ],
    "Shivamogga": [
      "Shivamogga",
      "Sagara",
      "Bhadravathi",
      "Hosanagara",
      "Shikaripura",
      "Soraba",
      "Tirthahalli"
    ],
    "Tumakuru": [
      "Tumakuru",
      "Chikkanayakanahalli",
      "Kunigal",
      "Madhugiri",
      "Sira",
      "Tipturu",
      "Gubbi",
      "Koratagere",
      "Pavagada",
      "Turuvekere"
    ]
  },
  "Belagavi Division": {
    "Bagalkote": [
      "Bagalkote",
      "Terdal",
      "Mudhola",
      "Badami",
      "Bilagi",
      "Hunagunda",
      "Ilkal",
      "Rabkavi Banhatti",
      "Guledgudda",
      "Jamakhandi"
    ],
    "Belagavi": [
      "Belagavi",
      "Athani",
      "Bailhongal",
      "Chikkodi",
      "Gokak",
      "Khanapura",
      "Mudalgi",
      "Nippani",
      "Rayabaga",
      "Savadatti",
      "Ramadurga",
      "Kagawada",
      "Hukkeri",
      "Kitturu",
      "Yargatti"
    ],
    "Dharwad": [
      "Dharwad",
      "Hubballi (Rural)",
      "Hubballi (Urban)",
      "Kalghatgi",
      "Kundagolu",
      "Navalgunda",
      "Alnavara",
      "Annigeri"
    ],
    "Gadag": [
      "Gadag",
      "Naragunda",
      "Mundaragi",
      "Rona",
      "Gajendragada",
      "Lakshmeshwara",
      "Shirahatti"
    ],
    "Haveri": [
      "Haveri",
      "Ranibennur",
      "Byadgi",
      "Hangala",
      "Savanuru",
      "Hirekeruru",
      "Shiggavi",
      "Rattihalli"
    ],
    "Uttara Kannada": [
      "Karwara",
      "Sirsi",
      "Joida",
      "Dandeli",
      "Bhatkal",
      "Kumta",
      "Ankola",
      "Haliyal",
      "Honnavara",
      "Mundagodu",
      "Siddapura",
      "Yellapura"
    ],
    "Vijayapura": [
      "Vijayapura",
      "Indi",
      "Basavana Bagewadi",
      "Sindgi",
      "Muddebihala",
      "Talikote",
      "Devara Hipparagi",
      "Chadchana",
      "Tikote",
      "Babaleshwara",
      "Kolhara",
      "Nidagundi",
      "Alamela"
    ]
  },
  "Kalaburagi Division": {
    "Ballari": [
      "Ballari",
      "Kurugodu",
      "Kampli",
      "Sanduru",
      "Siraguppa"
    ],
    "Bidar": [
      "Bidar",
      "Aurad",
      "Basavakalyana",
      "Bhalki",
      "Chitgoppa",
      "Hulsuru",
      "Humnabad",
      "Kamalanagara"
    ],
    "Kalaburagi": [
      "Kalaburagi",
      "Afzalpura",
      "Alanda",
      "Chincholi",
      "Chitapura",
      "Jevargi",
      "Sedam",
      "Kamalapura",
      "Shahabad",
      "Kalgi",
      "Yedrami"
    ],
    "Koppala": [
      "Koppala",
      "Gangavathi",
      "Kushtagi",
      "Yelaburga",
      "Kanakagiri",
      "Karatagi",
      "Kukanuru"
    ],
    "Raichuru": [
      "Raichuru",
      "Sindhanuru",
      "Manvi",
      "Devadurga",
      "Lingasaguru",
      "Mudgal",
      "Maski",
      "Sirawara"
    ],
    "Vijayanagara": [
      "Hosapete",
      "Hagaribommanahalli",
      "Harapanahalli",
      "Hoovina Hadagali",
      "Kudligi",
      "Kotturu"
    ],
    "Yadagiri": [
      "Yadagiri",
      "Shahapura",
      "Surapura",
      "Gurmitkala",
      "Vadagera",
      "Hunsagi"
    ]
  },
  "Mysuru Division": {
    "Chamarajanagara": [
      "Chamarajanagara",
      "Gundlupete",
      "Kollegala",
      "Yelanduru",
      "Hanuru"
    ],
    "Chikkamagaluru": [
      "Chikkamagaluru",
      "Kaduru",
      "Koppa",
      "Mudigere",
      "Narasimharajapura",
      "Sringeri",
      "Tarikere",
      "Ajjampura",
      "Kalasa"
    ],
    "Dakshina Kannada": [
      "Mangaluru",
      "Ullal",
      "Mulki",
      "Moodbidri",
      "Bantwala",
      "Belathangadi",
      "Putturu",
      "Sulya",
      "Kadaba"
    ],
    "Hassan": [
      "Hassan",
      "Arasikere",
      "Channarayapattana",
      "Holenarsipura",
      "Sakleshpura",
      "Aluru",
      "Arakalagudu",
      "Beluru"
    ],
    "Kodagu": [
      "Madikeri",
      "Somawarapete",
      "Virajapete",
      "Ponnammapete",
      "Kushalnagara"
    ],
    "Mandya": [
      "Mandya",
      "Madduru",
      "Malavalli",
      "Srirangapattana",
      "Krishnarajapete",
      "Nagamangala",
      "Pandavapura"
    ],
    "Mysuru": [
      "Mysuru",
      "Hunasuru",
      "Krishnarajanagara",
      "Nanjanagodu",
      "Heggadadevanakote",
      "Piriyapattana",
      "Tirumakudalu Narasipura",
      "Saraguru",
      "Saligrama"
    ],
    "Udupi": [
      "Udupi",
      "Kapu",
      "Bynduru",
      "Karkala",
      "Kundapura",
      "Hebri",
      "Brahmavara"
    ]
  }
};

  // ─────────────────────────────────────────
  // PRODUCTS (15: 5 phones, 5 watches, 5 tablets)
  // ─────────────────────────────────────────
  const PRODUCTS = [
    // ── Smartphones (5) ──
    {
      id: 'prd_001', sku: 'SP-APL-IP17P-256-BLK', name: 'iPhone 17 Pro', brand: 'Apple',
      category: 'smartphone', variant: { storage: '256GB', color: 'Black', ram: '12GB' },
      costPrice: 112000, price: 134900, reorderLevel: 10,
      image: 'assets/images/products/iphone-17-pro.svg',
      description: 'Apple iPhone 17 Pro with A19 Pro chip, 48MP camera system.',
      active: true, createdAt: ago(365), createdBy: 'usr_001',
    },
    {
      id: 'prd_002', sku: 'SP-SAM-S25U-512-SLV', name: 'Samsung Galaxy S25 Ultra', brand: 'Samsung',
      category: 'smartphone', variant: { storage: '512GB', color: 'Silver', ram: '12GB' },
      costPrice: 95000, price: 124999, reorderLevel: 8,
      image: 'assets/images/products/samsung-galaxy-s25-ultra.svg',
      description: 'Samsung Galaxy S25 Ultra with S-Pen, Snapdragon 8 Elite.',
      active: true, createdAt: ago(360), createdBy: 'usr_001',
    },
    {
      id: 'prd_003', sku: 'SP-GOG-PXL9P-256-BLK', name: 'Google Pixel 9 Pro', brand: 'Google',
      category: 'smartphone', variant: { storage: '256GB', color: 'Obsidian', ram: '16GB' },
      costPrice: 78000, price: 99999, reorderLevel: 6,
      image: 'assets/images/products/google-pixel-9-pro.svg',
      description: 'Google Pixel 9 Pro with advanced AI camera and Tensor G4.',
      active: true, createdAt: ago(300), createdBy: 'usr_001',
    },
    {
      id: 'prd_004', sku: 'SP-OPO-F27-128-BLU', name: 'OnePlus 13R', brand: 'OnePlus',
      category: 'smartphone', variant: { storage: '128GB', color: 'Nebula Blue', ram: '8GB' },
      costPrice: 36000, price: 42999, reorderLevel: 15,
      image: 'assets/images/products/oneplus-13r.svg',
      description: 'OnePlus 13R with Snapdragon 8 Gen 3, 100W SUPERVOOC charging.',
      active: true, createdAt: ago(280), createdBy: 'usr_001',
    },
    {
      id: 'prd_005', sku: 'SP-VVO-V40-256-GLD', name: 'Vivo V40 Pro', brand: 'Vivo',
      category: 'smartphone', variant: { storage: '256GB', color: 'Lotus Gold', ram: '12GB' },
      costPrice: 42000, price: 54999, reorderLevel: 12,
      image: 'assets/images/products/vivo-v40-pro.svg',
      description: 'Vivo V40 Pro with ZEISS co-engineered cameras, 5000mAh battery.',
      active: true, createdAt: ago(240), createdBy: 'usr_001',
    },

    // ── Smartwatches (5) ──
    {
      id: 'prd_006', sku: 'SW-APL-UW10-45-BLK', name: 'Apple Watch Ultra 2', brand: 'Apple',
      category: 'smartwatch', variant: { caseSize: '49mm', color: 'Black Titanium' },
      costPrice: 68000, price: 89900, reorderLevel: 5,
      image: 'assets/images/products/apple-watch-ultra-2.svg',
      description: 'Apple Watch Ultra 2 with titanium case, action button, dual-frequency GPS.',
      active: true, createdAt: ago(350), createdBy: 'usr_001',
    },
    {
      id: 'prd_007', sku: 'SW-SAM-GW7-44-GRY', name: 'Samsung Galaxy Watch 7', brand: 'Samsung',
      category: 'smartwatch', variant: { caseSize: '44mm', color: 'Gray' },
      costPrice: 22000, price: 29999, reorderLevel: 8,
      image: 'assets/images/products/samsung-galaxy-watch-7.svg',
      description: 'Samsung Galaxy Watch 7 with BioActive sensor, sapphire crystal glass.',
      active: true, createdAt: ago(320), createdBy: 'usr_001',
    },
    {
      id: 'prd_008', sku: 'SW-GAR-F7P-47-SLV', name: 'Garmin Fenix 7 Pro', brand: 'Garmin',
      category: 'smartwatch', variant: { caseSize: '47mm', color: 'Silver' },
      costPrice: 62000, price: 81990, reorderLevel: 4,
      image: 'assets/images/products/garmin-fenix-7-pro.svg',
      description: 'Garmin Fenix 7 Pro multisport GPS smartwatch with solar charging lens.',
      active: true, createdAt: ago(310), createdBy: 'usr_001',
    },
    {
      id: 'prd_009', sku: 'SW-FIT-CH6-00-BLK', name: 'Fitbit Charge 6', brand: 'Fitbit',
      category: 'smartwatch', variant: { caseSize: 'Standard', color: 'Obsidian' },
      costPrice: 11000, price: 14999, reorderLevel: 10,
      image: 'assets/images/products/fitbit-charge-6.svg',
      description: 'Fitbit Charge 6 with Google apps, built-in GPS, 40+ exercise modes.',
      active: true, createdAt: ago(290), createdBy: 'usr_001',
    },
    {
      id: 'prd_010', sku: 'SW-NOI-CL2-00-BLU', name: 'Noise ColorFit Pro 5', brand: 'Noise',
      category: 'smartwatch', variant: { caseSize: '1.85-inch', color: 'Jet Blue' },
      costPrice: 2800, price: 3999, reorderLevel: 20,
      image: 'assets/images/products/noise-colorfit-pro-5.svg',
      description: 'Noise ColorFit Pro 5 with AMOLED display, Bluetooth calling, SOS.',
      active: true, createdAt: ago(260), createdBy: 'usr_001',
    },

    // ── Tablets (5) ──
    {
      id: 'prd_011', sku: 'TB-APL-IPA11-128-SGR', name: 'iPad Air 11-inch M2', brand: 'Apple',
      category: 'tablet', variant: { storage: '128GB', color: 'Space Gray', ram: '8GB' },
      costPrice: 48000, price: 59900, reorderLevel: 6,
      image: 'assets/images/products/ipad-air-11-m2.svg',
      description: 'Apple iPad Air 11-inch with Apple M2 chip, Liquid Retina display.',
      active: true, createdAt: ago(340), createdBy: 'usr_001',
    },
    {
      id: 'prd_012', sku: 'TB-SAM-ST9-256-GRY', name: 'Samsung Galaxy Tab S9', brand: 'Samsung',
      category: 'tablet', variant: { storage: '256GB', color: 'Graphite', ram: '12GB' },
      costPrice: 56000, price: 72999, reorderLevel: 5,
      image: 'assets/images/products/samsung-galaxy-tab-s9.svg',
      description: 'Samsung Galaxy Tab S9 with Dynamic AMOLED 2X, S-Pen included, IP68.',
      active: true, createdAt: ago(330), createdBy: 'usr_001',
    },
    {
      id: 'prd_013', sku: 'TB-LEN-P12-128-STG', name: 'Lenovo Tab P12 Pro', brand: 'Lenovo',
      category: 'tablet', variant: { storage: '128GB', color: 'Storm Grey', ram: '8GB' },
      costPrice: 36000, price: 49999, reorderLevel: 8,
      image: 'assets/images/products/lenovo-tab-p12-pro.svg',
      description: 'Lenovo Tab P12 Pro with 12.6" AMOLED, quad speakers, 10200mAh.',
      active: true, createdAt: ago(270), createdBy: 'usr_001',
    },
    {
      id: 'prd_014', sku: 'TB-MIC-SPR9-256-PLA', name: 'Microsoft Surface Pro 9', brand: 'Microsoft',
      category: 'tablet', variant: { storage: '256GB', color: 'Platinum', ram: '16GB' },
      costPrice: 85000, price: 109999, reorderLevel: 4,
      image: 'assets/images/products/microsoft-surface-pro-9.svg',
      description: 'Microsoft Surface Pro 9 with Intel Core i5, 2-in-1 design, Windows 11.',
      active: true, createdAt: ago(250), createdBy: 'usr_001',
    },
    {
      id: 'prd_015', sku: 'TB-RLM-PAD-128-GLD', name: 'Realme Pad X', brand: 'Realme',
      category: 'tablet', variant: { storage: '128GB', color: 'Gleam Gold', ram: '6GB' },
      costPrice: 18000, price: 24999, reorderLevel: 15,
      image: 'assets/images/products/realme-pad-x.svg',
      description: 'Realme Pad X with Snapdragon 695, 11.5" display, 8340mAh battery.',
      active: true, createdAt: ago(200), createdBy: 'usr_001',
    },
  ];

  // ─────────────────────────────────────────
  // BUILD OFFICES (1 HO Mangaluru, 4 Zones, 31 Districts, 240 Taluks, 480 Stores)
  // ─────────────────────────────────────────
  function buildKarnatakaOffices() {
    const offices = [];
    let seq = 1;
    function nextId() { return 'off_' + String(seq++).padStart(3, '0'); }

    // 1. Head Office in Mangaluru
    const ho = {
      id: nextId(),
      code: 'HO-MNG',
      name: 'Head Office Mangaluru',
      type: 'head',
      parentId: null,
      city: 'Mangaluru',
      manager: 'Mohammed Faizal',
      active: true,
    };
    offices.push(ho);

    const divCodes = {
      'Bengaluru Division': 'ZN-BLR',
      'Belagavi Division': 'ZN-BGV',
      'Kalaburagi Division': 'ZN-KLB',
      'Mysuru Division': 'ZN-MYS'
    };
    const divManagers = {
      'Bengaluru Division': 'Priya Rajan',
      'Belagavi Division': 'Rahul Mehta',
      'Kalaburagi Division': 'Anjali Singh',
      'Mysuru Division': 'Karthik Suresh'
    };

    const codeSet = new Set(['HO-MNG', 'ZN-BLR', 'ZN-BGV', 'ZN-KLB', 'ZN-MYS']);
    function cleanCode(s) { return s.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4); }

    const zones = [];
    for (const divName of Object.keys(KARNATAKA_HIERARCHY)) {
      const z = {
        id: nextId(),
        code: divCodes[divName] || ('ZN-' + cleanCode(divName)),
        name: divName,
        type: 'zone',
        parentId: ho.id,
        city: divName.replace(' Division', ''),
        manager: divManagers[divName] || 'Zonal Manager',
        active: true,
        divName: divName
      };
      zones.push(z);
      offices.push(z);
    }

    const districts = [];
    for (const z of zones) {
      for (const distName of Object.keys(KARNATAKA_HIERARCHY[z.divName])) {
        let dCode = 'DIS-' + cleanCode(distName);
        let c = 1;
        while (codeSet.has(dCode)) dCode = 'DIS-' + cleanCode(distName) + (c++);
        codeSet.add(dCode);
        const d = {
          id: nextId(),
          code: dCode,
          name: distName + ' District',
          type: 'district',
          parentId: z.id,
          city: distName,
          manager: distName + ' Manager',
          active: true,
          divName: z.divName,
          distName: distName
        };
        districts.push(d);
        offices.push(d);
      }
    }

    const taluks = [];
    for (const d of districts) {
      for (const talukName of KARNATAKA_HIERARCHY[d.divName][d.distName]) {
        let tCode = 'TLK-' + cleanCode(talukName);
        let c = 1;
        while (codeSet.has(tCode)) tCode = 'TLK-' + cleanCode(talukName) + (c++);
        codeSet.add(tCode);
        const t = {
          id: nextId(),
          code: tCode,
          name: talukName + ' Taluk',
          type: 'taluk',
          parentId: d.id,
          city: talukName,
          manager: talukName + ' Officer',
          active: true,
          talukName: talukName,
          distName: d.distName
        };
        taluks.push(t);
        offices.push(t);
      }
    }

    const stores = [];
    for (const t of taluks) {
      for (let s = 1; s <= 2; s++) {
        let sCode = 'ST-' + cleanCode(t.talukName) + s;
        let c = 1;
        while (codeSet.has(sCode)) sCode = 'ST-' + cleanCode(t.talukName) + s + '_' + (c++);
        codeSet.add(sCode);
        const str = {
          id: nextId(),
          code: sCode,
          name: t.talukName + ' Store ' + s,
          type: 'store',
          parentId: t.id,
          city: t.city,
          manager: t.talukName + ' Store ' + s + ' Lead',
          active: true,
          talukName: t.talukName,
          distName: t.distName
        };
        stores.push(str);
        offices.push(str);
      }
    }

    // Clean internal helper tags before storing
    offices.forEach(function (o) {
      delete o.divName;
      delete o.distName;
      delete o.talukName;
    });

    return { offices: offices, zones: zones, districts: districts, taluks: taluks, stores: stores };
  }

  // ─────────────────────────────────────────
  // USERS (Multi-tier demo accounts across Karnataka)
  // ─────────────────────────────────────────
  const USERS = [
    { id: 'usr_001', name: 'Mohammed Faizal', role: 'head', officeId: 'off_001', initials: 'MF' },
    { id: 'usr_002', name: 'Priya Rajan', role: 'zone', officeId: 'off_002', initials: 'PR' },
    { id: 'usr_003', name: 'Rahul Mehta', role: 'zone', officeId: 'off_003', initials: 'RM' },
    { id: 'usr_004', name: 'Anjali Singh', role: 'zone', officeId: 'off_004', initials: 'AS' },
    { id: 'usr_005', name: 'Karthik Suresh', role: 'zone', officeId: 'off_005', initials: 'KS' },
    { id: 'usr_006', name: 'Deepa Nair', role: 'district', officeId: 'off_031', initials: 'DN' },
    { id: 'usr_007', name: 'Vikram Sharma', role: 'district', officeId: 'off_006', initials: 'VS' },
    { id: 'usr_008', name: 'Rohan Gowda', role: 'taluk', officeId: 'off_232', initials: 'RG' },
    { id: 'usr_009', name: 'Arjun Kumar', role: 'store', officeId: 'off_667', initials: 'AK' },
    { id: 'usr_010', name: 'Meena Pandian', role: 'store', officeId: 'off_668', initials: 'MP' },
    { id: 'usr_011', name: 'Suresh Patil', role: 'store', officeId: 'off_277', initials: 'SP' },
  ];

  // ─────────────────────────────────────────
  // SEED FUNCTION
  // ─────────────────────────────────────────
  function seed() {
    const built = buildKarnatakaOffices();
    const offices = built.offices;
    const stores = built.stores;

    // Build stock for all 756 offices and 15 products
    const stock = [];
    const physicalByPrd = {};
    PRODUCTS.forEach(function (p) { physicalByPrd[p.id] = 0; });

    offices.forEach(function (o, oIdx) {
      PRODUCTS.forEach(function (p, pIdx) {
        let qty = 0;
        if (o.type === 'head') {
          qty = 100;
        } else if (o.type === 'zone') {
          qty = 30;
        } else if (o.type === 'district') {
          qty = 12;
        } else if (o.type === 'taluk') {
          qty = 6;
        } else {
          // Stores
          if (o.id === 'off_667' || o.id === 'off_668' || o.id === 'off_277') {
            qty = 10; // Ensure active demo stores have plenty of stock on hand
          } else {
            qty = ((oIdx * 13 + pIdx * 7) % 11);
          }
        }
        stock.push({ officeId: o.id, productId: p.id, qty: qty });
        physicalByPrd[p.id] += qty;
      });
    });

    // Seed realistic allocations adhering to strict parent-child routing
    const seedAllocations = [
      // 1. Completed push allocation: HO Mangaluru (off_001) -> Mysuru Division (off_005)
      {
        id: 'alc_0001',
        code: 'ALC-0001',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_005',
        status: 'received',
        items: [
          { productId: 'prd_001', qtyRequested: 20, qtyDispatched: 20, qtyReceived: 20 },
          { productId: 'prd_002', qtyRequested: 15, qtyDispatched: 15, qtyReceived: 15 }
        ],
        note: 'Monthly regular replenishment consignment for Mysuru Division.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(25),
        timeline: [
          { status: 'dispatched', at: ago(25), by: 'usr_001', note: 'Dispatched from Head Office Mangaluru' },
          { status: 'received', at: ago(23), by: 'usr_005', note: 'Verified and received in full at Mysuru Division' }
        ]
      },
      // 2. Active in-transit push allocation: HO Mangaluru (off_001) -> Bengaluru Division (off_002), 2 days ago
      {
        id: 'alc_0002',
        code: 'ALC-0002',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_002',
        status: 'dispatched',
        items: [
          { productId: 'prd_004', qtyRequested: 10, qtyDispatched: 10, qtyReceived: 0 },
          { productId: 'prd_006', qtyRequested: 5, qtyDispatched: 5, qtyReceived: 0 }
        ],
        note: 'New flagship launch consignment.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(2),
        timeline: [
          { status: 'dispatched', at: ago(2), by: 'usr_001', note: 'Dispatched from Head Office Mangaluru' }
        ]
      },
      // 3. Overdue in-transit push allocation: HO Mangaluru (off_001) -> Belagavi Division (off_003), 8 days ago
      {
        id: 'alc_0003',
        code: 'ALC-0003',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_003',
        status: 'dispatched',
        items: [
          { productId: 'prd_011', qtyRequested: 6, qtyDispatched: 6, qtyReceived: 0 }
        ],
        note: 'High-priority institutional tablets.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(8),
        timeline: [
          { status: 'dispatched', at: ago(8), by: 'usr_001', note: 'Dispatched from Head Office Mangaluru' }
        ]
      },
      // 4. Pending stock request: Mangaluru Taluk (off_232) -> Dakshina Kannada District (off_031)
      {
        id: 'alc_0004',
        code: 'ALC-0004',
        type: 'request',
        fromId: 'off_031',
        toId: 'off_232',
        status: 'requested',
        items: [
          { productId: 'prd_007', qtyRequested: 8, qtyDispatched: 0, qtyReceived: 0 },
          { productId: 'prd_009', qtyRequested: 10, qtyDispatched: 0, qtyReceived: 0 }
        ],
        note: 'Pre-order festival demand surge across coastal Mangaluru stores.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_008',
        createdAt: ago(1),
        timeline: [
          { status: 'requested', at: ago(1), by: 'usr_008', note: 'Stock request submitted by Mangaluru Taluk Office' }
        ]
      },
      // 5. Completed allocation with discrepancy: Mangaluru Taluk (off_232) -> Mangaluru Store 1 (off_667)
      {
        id: 'alc_0005',
        code: 'ALC-0005',
        type: 'push',
        fromId: 'off_232',
        toId: 'off_667',
        status: 'received',
        items: [
          { productId: 'prd_010', qtyRequested: 10, qtyDispatched: 10, qtyReceived: 8 }
        ],
        note: 'Weekend replenishment transfer.',
        discrepancyNote: 'Carton damaged in courier transit; 2 units broken.',
        hasDiscrepancy: true,
        discrepancyAcknowledged: false,
        createdBy: 'usr_008',
        createdAt: ago(4),
        timeline: [
          { status: 'dispatched', at: ago(4), by: 'usr_008', note: 'Dispatched from Mangaluru Taluk Office' },
          { status: 'received', at: ago(3), by: 'usr_009', note: 'Received with discrepancy: Carton damaged in courier transit; 2 units broken.' }
        ]
      }
    ];

    // In-transit accounting for reconciliation
    const inTransitByPrd = {
      'prd_004': 10,
      'prd_006': 5,
      'prd_011': 6
    };

    // Sales generation across retail stores (past 12 months)
    const sales = [];
    let saleSeq = 1;
    const salesByPrd = {};
    PRODUCTS.forEach(function (p) { salesByPrd[p.id] = 0; });

    const payments = ['cash', 'upi', 'card'];
    const popularPrds = ['prd_001', 'prd_002', 'prd_004', 'prd_010', 'prd_006'];

    // Generate ~300 realistic sales across sample stores
    for (let i = 0; i < 300; i++) {
      const store = stores[i % stores.length];
      const pId = (i % 2 === 0) ? popularPrds[i % popularPrds.length] : PRODUCTS[i % PRODUCTS.length].id;
      const prd = PRODUCTS.find(function (p) { return p.id === pId; });
      const qty = 1 + (i % 3);
      const daysAgo = (i % 360);

      sales.push({
        id: 'sal_' + String(saleSeq++).padStart(4, '0'),
        storeId: store.id,
        productId: pId,
        qty: qty,
        unitPrice: prd.price,
        payment: payments[i % payments.length],
        customer: { name: '', phone: '' },
        type: 'sale',
        at: ago(daysAgo),
        by: 'usr_009'
      });
      salesByPrd[pId] += qty;
    }

    // Movements generation
    const movements = [];
    let movSeq = 1;
    function movId() { return 'mov_' + String(movSeq++).padStart(5, '0'); }

    // Initial stock_in movements at HO Mangaluru (off_001)
    // Exactly calculated so: totalPhysical + totalInTransit == totalStockIn - totalSales
    PRODUCTS.forEach(function (p) {
      const requiredStockIn = physicalByPrd[p.id] + (inTransitByPrd[p.id] || 0) + (salesByPrd[p.id] || 0);
      movements.push({
        id: movId(),
        at: ago(365),
        type: 'stock_in',
        productId: p.id,
        qty: requiredStockIn,
        fromId: null,
        toId: 'off_001',
        refType: 'manual',
        refId: null,
        by: 'usr_001'
      });
    });

    // Historic allocation movements
    movements.push({
      id: movId(), at: ago(25), type: 'dispatch', productId: 'prd_001', qty: 20, fromId: 'off_001', toId: 'off_005', refType: 'allocation', refId: 'alc_0001', by: 'usr_001'
    });
    movements.push({
      id: movId(), at: ago(23), type: 'receive', productId: 'prd_001', qty: 20, fromId: 'off_001', toId: 'off_005', refType: 'allocation', refId: 'alc_0001', by: 'usr_005'
    });
    movements.push({
      id: movId(), at: ago(2), type: 'dispatch', productId: 'prd_004', qty: 10, fromId: 'off_001', toId: 'off_002', refType: 'allocation', refId: 'alc_0002', by: 'usr_001'
    });
    movements.push({
      id: movId(), at: ago(2), type: 'dispatch', productId: 'prd_006', qty: 5, fromId: 'off_001', toId: 'off_002', refType: 'allocation', refId: 'alc_0002', by: 'usr_001'
    });
    movements.push({
      id: movId(), at: ago(8), type: 'dispatch', productId: 'prd_011', qty: 6, fromId: 'off_001', toId: 'off_003', refType: 'allocation', refId: 'alc_0003', by: 'usr_001'
    });
    movements.push({
      id: movId(), at: ago(4), type: 'dispatch', productId: 'prd_010', qty: 10, fromId: 'off_232', toId: 'off_667', refType: 'allocation', refId: 'alc_0005', by: 'usr_008'
    });
    movements.push({
      id: movId(), at: ago(3), type: 'receive', productId: 'prd_010', qty: 8, fromId: 'off_232', toId: 'off_667', refType: 'allocation', refId: 'alc_0005', by: 'usr_009'
    });
    movements.push({
      id: movId(), at: ago(3), type: 'discrepancy', productId: 'prd_010', qty: 2, fromId: 'off_232', toId: 'off_667', refType: 'allocation', refId: 'alc_0005', by: 'usr_009'
    });

    // Targets for current month per store
    const now = new Date();
    const curMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    const targets = stores.map(function (str, idx) {
      return {
        storeId: str.id,
        month: curMonth,
        amount: 500000 + ((idx * 17) % 500000)
      };
    });

    // Save everything to storage
    storage.set('offices', offices);
    storage.set('users', USERS);
    storage.set('products', PRODUCTS);
    storage.set('stock', stock);
    storage.set('allocations', seedAllocations);
    storage.set('sales', sales);
    storage.set('movements', movements);
    storage.set('targets', targets);

    storage.set('counters', {
      user: USERS.length,
      office: offices.length,
      product: PRODUCTS.length,
      allocation: seedAllocations.length,
      movement: movements.length,
      sale: sales.length,
    });

    // Default settings
    storage.set('settings', {
      theme: 'light',
      reorderDefault: 10,
      transitDaysThreshold: 5,
    });

    storage.remove('session');
    storage.markSeeded();

    console.info('[Seed] Karnataka hierarchy loaded successfully: ' + offices.length + ' offices.');
  }

  function reseed() {
    storage.clearAll();
    seed();
    window.Stockify.events.emit('data:reseeded');
  }

  window.Stockify.store.seed = { seed, reseed };
})();
