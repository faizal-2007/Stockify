// store/seed.js — Karnataka hierarchy demo data: Head Office in Mangaluru, 4 Divisions, 31 Districts, 240 Taluks, 480 Stores
// Includes complete smartphones catalogue (389 models across 14 brands), smartwatches (5), and tablets (5).
(function () {
  'use strict';

  const storage = window.Stockify.store.storage;

  function ago(days) {
    const d = new Date(Date.now() - days * 86400000);
    return d.toISOString();
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

  // ─────────────────────────────────────────
  // PRODUCTS (399: 389 smartphones across 14 brands, 5 watches, 5 tablets)
  // ─────────────────────────────────────────
  const PRODUCTS = [
  {
    "id": "prd_001",
    "sku": "SP-APL-IP17P-256-BLK",
    "name": "iPhone 17 Pro",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "color": "Black",
      "ram": "12GB"
    },
    "costPrice": 112000,
    "price": 134900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-17-pro.svg",
    "description": "Apple iPhone 17 Pro with A19 Pro chip, 48MP camera system.",
    "active": true,
    "createdAt": "2025-01-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_002",
    "sku": "SP-SAM-S25U-512-SLV",
    "name": "Samsung Galaxy S25 Ultra",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "color": "Silver",
      "ram": "12GB"
    },
    "costPrice": 95000,
    "price": 124999,
    "reorderLevel": 8,
    "image": "assets/images/products/samsung-galaxy-s25-ultra.svg",
    "description": "Samsung Galaxy S25 Ultra with S-Pen, Snapdragon 8 Elite.",
    "active": true,
    "createdAt": "2025-01-05T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_003",
    "sku": "SP-GOG-PXL9P-256-BLK",
    "name": "Google Pixel 9 Pro",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "color": "Obsidian",
      "ram": "16GB"
    },
    "costPrice": 78000,
    "price": 99999,
    "reorderLevel": 6,
    "image": "assets/images/products/google-pixel-9-pro.svg",
    "description": "Google Pixel 9 Pro with advanced AI camera and Tensor G4.",
    "active": true,
    "createdAt": "2025-02-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_004",
    "sku": "SP-OPO-F27-128-BLU",
    "name": "OnePlus 13R",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "color": "Nebula Blue",
      "ram": "8GB"
    },
    "costPrice": 36000,
    "price": 42999,
    "reorderLevel": 15,
    "image": "assets/images/products/oneplus-13r.svg",
    "description": "OnePlus 13R with Snapdragon 8 Gen 3, 100W SUPERVOOC charging.",
    "active": true,
    "createdAt": "2025-02-15T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_005",
    "sku": "SP-VVO-V40-256-GLD",
    "name": "Vivo V40 Pro",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "color": "Lotus Gold",
      "ram": "12GB"
    },
    "costPrice": 42000,
    "price": 54999,
    "reorderLevel": 12,
    "image": "assets/images/products/vivo-v40-pro.svg",
    "description": "Vivo V40 Pro with ZEISS co-engineered cameras, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-03-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_006",
    "sku": "SW-APL-UW10-45-BLK",
    "name": "Apple Watch Ultra 2",
    "brand": "Apple",
    "category": "smartwatch",
    "variant": {
      "caseSize": "49mm",
      "color": "Black Titanium"
    },
    "costPrice": 68000,
    "price": 89900,
    "reorderLevel": 5,
    "image": "assets/images/products/apple-watch-ultra-2.svg",
    "description": "Apple Watch Ultra 2 with titanium case, action button, dual-frequency GPS.",
    "active": true,
    "createdAt": "2025-01-10T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_007",
    "sku": "SW-SAM-GW7-44-GRY",
    "name": "Samsung Galaxy Watch 7",
    "brand": "Samsung",
    "category": "smartwatch",
    "variant": {
      "caseSize": "44mm",
      "color": "Gray"
    },
    "costPrice": 22000,
    "price": 29999,
    "reorderLevel": 8,
    "image": "assets/images/products/samsung-galaxy-watch-7.svg",
    "description": "Samsung Galaxy Watch 7 with BioActive sensor, sapphire crystal glass.",
    "active": true,
    "createdAt": "2025-01-20T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_008",
    "sku": "SW-GAR-F7P-47-SLV",
    "name": "Garmin Fenix 7 Pro",
    "brand": "Garmin",
    "category": "smartwatch",
    "variant": {
      "caseSize": "47mm",
      "color": "Silver"
    },
    "costPrice": 62000,
    "price": 81990,
    "reorderLevel": 4,
    "image": "assets/images/products/garmin-fenix-7x.svg",
    "description": "Garmin Fenix 7 Pro multisport GPS smartwatch with solar charging lens.",
    "active": true,
    "createdAt": "2025-02-10T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_009",
    "sku": "SW-FIT-CH6-00-BLK",
    "name": "Fitbit Charge 6",
    "brand": "Fitbit",
    "category": "smartwatch",
    "variant": {
      "caseSize": "Standard",
      "color": "Obsidian"
    },
    "costPrice": 11000,
    "price": 14999,
    "reorderLevel": 10,
    "image": "assets/images/products/fitbit-versa-6.svg",
    "description": "Fitbit Charge 6 with Google apps, built-in GPS, 40+ exercise modes.",
    "active": true,
    "createdAt": "2025-02-20T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_010",
    "sku": "SW-NOI-CL2-00-BLU",
    "name": "Noise ColorFit Pro 5",
    "brand": "Noise",
    "category": "smartwatch",
    "variant": {
      "caseSize": "1.85-inch",
      "color": "Jet Blue"
    },
    "costPrice": 2800,
    "price": 3999,
    "reorderLevel": 20,
    "image": "assets/images/products/boat-lunar-pro-max.svg",
    "description": "Noise ColorFit Pro 5 with AMOLED display, Bluetooth calling, SOS.",
    "active": true,
    "createdAt": "2025-03-10T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_011",
    "sku": "TB-APL-IPA11-128-SGR",
    "name": "iPad Air 11-inch M2",
    "brand": "Apple",
    "category": "tablet",
    "variant": {
      "storage": "128GB",
      "color": "Space Gray",
      "ram": "8GB"
    },
    "costPrice": 48000,
    "price": 59900,
    "reorderLevel": 6,
    "image": "assets/images/products/ipad-pro-13.svg",
    "description": "Apple iPad Air 11-inch with Apple M2 chip, Liquid Retina display.",
    "active": true,
    "createdAt": "2025-01-15T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_012",
    "sku": "TB-SAM-ST9-256-GRY",
    "name": "Samsung Galaxy Tab S9",
    "brand": "Samsung",
    "category": "tablet",
    "variant": {
      "storage": "256GB",
      "color": "Graphite",
      "ram": "12GB"
    },
    "costPrice": 56000,
    "price": 72999,
    "reorderLevel": 5,
    "image": "assets/images/products/samsung-galaxy-tab-s10.svg",
    "description": "Samsung Galaxy Tab S9 with Dynamic AMOLED 2X, S-Pen included, IP68.",
    "active": true,
    "createdAt": "2025-02-05T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_013",
    "sku": "TB-LEN-P12-128-STG",
    "name": "Lenovo Tab P12 Pro",
    "brand": "Lenovo",
    "category": "tablet",
    "variant": {
      "storage": "128GB",
      "color": "Storm Grey",
      "ram": "8GB"
    },
    "costPrice": 36000,
    "price": 49999,
    "reorderLevel": 8,
    "image": "assets/images/products/lenovo-tab-p12-pro.svg",
    "description": "Lenovo Tab P12 Pro with 12.6\" AMOLED, quad speakers, 10200mAh.",
    "active": true,
    "createdAt": "2025-02-25T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_014",
    "sku": "TB-MIC-SPR9-256-PLA",
    "name": "Microsoft Surface Pro 9",
    "brand": "Microsoft",
    "category": "tablet",
    "variant": {
      "storage": "256GB",
      "color": "Platinum",
      "ram": "16GB"
    },
    "costPrice": 85000,
    "price": 109999,
    "reorderLevel": 4,
    "image": "assets/images/products/microsoft-surface-pro-9.svg",
    "description": "Microsoft Surface Pro 9 with Intel Core i5, 2-in-1 design, Windows 11.",
    "active": true,
    "createdAt": "2025-03-05T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_015",
    "sku": "TB-RLM-PAD-128-GLD",
    "name": "Realme Pad X",
    "brand": "Realme",
    "category": "tablet",
    "variant": {
      "storage": "128GB",
      "color": "Gleam Gold",
      "ram": "6GB"
    },
    "costPrice": 18000,
    "price": 24999,
    "reorderLevel": 15,
    "image": "assets/images/products/realme-pad-x.svg",
    "description": "Realme Pad X with Snapdragon 695, 11.5\" display, 8340mAh battery.",
    "active": true,
    "createdAt": "2025-03-15T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_016",
    "sku": "SP-APP-A3612-256",
    "name": "iPhone Duo",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Star White"
    },
    "costPrice": 245918,
    "price": 299900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-duo.svg",
    "description": "Apple iPhone Duo with Apple A20 Pro, 7.6-inch Foldable Super Retina XDR OLED, 120Hz, 48MP Fusion + 48MP Ultrawide, 5050mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_017",
    "sku": "SP-APP-A3598-256",
    "name": "iPhone 18 Pro Max",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 147518,
    "price": 179900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-18-pro-max.svg",
    "description": "Apple iPhone 18 Pro Max with Apple A20 Pro, 6.9-inch Super Retina XDR OLED, 120Hz, 48MP Pro Fusion Variable Aperture + 48MP Periscope (4x/8x) + 48MP Ultrawide, 4950mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_018",
    "sku": "SP-APP-A3594-256",
    "name": "iPhone 18 Pro",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 135218,
    "price": 164900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-18-pro.svg",
    "description": "Apple iPhone 18 Pro with Apple A20 Pro, 6.3-inch Super Retina XDR OLED, 120Hz, 48MP Pro Fusion Variable Aperture + 48MP Periscope (4x/8x) + 48MP Ultrawide, 4288mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_019",
    "sku": "SP-APP-A3512-256",
    "name": "iPhone 17e",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 65518,
    "price": 79900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-17e.svg",
    "description": "Apple iPhone 17e with Apple A19, 6.1-inch Super Retina XDR OLED, 60Hz, 48MP Fusion (2x Telephoto), 4005mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_020",
    "sku": "SP-APP-A3526-256",
    "name": "iPhone 17 Pro Max",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Cosmic Orange"
    },
    "costPrice": 118818,
    "price": 144900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-17-pro-max.svg",
    "description": "Apple iPhone 17 Pro Max with Apple A19 Pro, 6.9-inch Super Retina XDR OLED, 120Hz, 48MP Fusion + 48MP Periscope (4x) + 48MP Ultrawide, 4823mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_021",
    "sku": "SP-APP-A3517-256",
    "name": "iPhone Air",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Space Black"
    },
    "costPrice": 122918,
    "price": 149900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-air.svg",
    "description": "Apple iPhone Air with Apple A19 Pro, 6.5-inch Super Retina XDR OLED, 120Hz, 48MP Fusion (2x Telephoto), 3149mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_022",
    "sku": "SP-APP-A3520-256",
    "name": "iPhone 17",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 81918,
    "price": 99900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-17.svg",
    "description": "Apple iPhone 17 with Apple A19, 6.3-inch Super Retina XDR OLED, 120Hz, 48MP Fusion + 48MP Ultrawide, 3692mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_023",
    "sku": "SP-APP-A3409-128",
    "name": "iPhone 16e",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 49118,
    "price": 59900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-16e.svg",
    "description": "Apple iPhone 16e with Apple A18, 6.1-inch Super Retina XDR OLED, 60Hz, 48MP Fusion (2x Telephoto), 4005mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_024",
    "sku": "SP-APP-A3296-256",
    "name": "iPhone 16 Pro Max",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Desert Titanium"
    },
    "costPrice": 110618,
    "price": 134900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-16-pro-max.svg",
    "description": "Apple iPhone 16 Pro Max with Apple A18 Pro, 6.9-inch Super Retina XDR OLED, 120Hz, 48MP Fusion + 12MP Periscope (5x) + 48MP Ultrawide, 4685mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_025",
    "sku": "SP-APP-A3293-128",
    "name": "iPhone 16 Pro",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Desert Titanium"
    },
    "costPrice": 90118,
    "price": 109900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-16-pro.svg",
    "description": "Apple iPhone 16 Pro with Apple A18 Pro, 6.3-inch Super Retina XDR OLED, 120Hz, 48MP Fusion + 12MP Periscope (5x) + 48MP Ultrawide, 3582mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_026",
    "sku": "SP-APP-A3290-128",
    "name": "iPhone 16 Plus",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ultramarine"
    },
    "costPrice": 65518,
    "price": 79900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-16-plus.svg",
    "description": "Apple iPhone 16 Plus with Apple A18, 6.7-inch Super Retina XDR OLED, 60Hz, 48MP Fusion + 12MP Ultrawide, 4674mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_027",
    "sku": "SP-APP-A3287-128",
    "name": "iPhone 16",
    "brand": "Apple",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ultramarine"
    },
    "costPrice": 73718,
    "price": 89900,
    "reorderLevel": 10,
    "image": "assets/images/products/iphone-16.svg",
    "description": "Apple iPhone 16 with Apple A18, 6.1-inch Super Retina XDR OLED, 60Hz, 48MP Fusion + 12MP Ultrawide, 3561mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_028",
    "sku": "SP-ASU-AI24015B-512",
    "name": "Asus ROG Phone 8 Pro",
    "brand": "Asus",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Phantom Black"
    },
    "costPrice": 77899,
    "price": 94999,
    "reorderLevel": 10,
    "image": "assets/images/products/asus-rog-phone-8-pro.svg",
    "description": "Asus Asus ROG Phone 8 Pro with Snapdragon 8 Gen 3, 6.78-inch FHD+ LTPO AMOLED, 165Hz, 50MP Gimbal OIS + 32MP Telephoto (3x) + 13MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_029",
    "sku": "SP-ASU-AI24015B-1",
    "name": "Asus ROG Phone 8 Pro Edition",
    "brand": "Asus",
    "category": "smartphone",
    "variant": {
      "storage": "1TB",
      "ram": "24GB",
      "color": "Phantom Black"
    },
    "costPrice": 98399,
    "price": 119999,
    "reorderLevel": 10,
    "image": "assets/images/products/asus-rog-phone-8-pro-edition.svg",
    "description": "Asus Asus ROG Phone 8 Pro Edition with Snapdragon 8 Gen 3, 6.78-inch FHD+ LTPO AMOLED, 165Hz, 50MP Gimbal OIS + 32MP Telephoto (3x) + 13MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_030",
    "sku": "SP-ASU-AI22051D-256",
    "name": "Asus ROG Phone 7",
    "brand": "Asus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Phantom Black"
    },
    "costPrice": 61499,
    "price": 74999,
    "reorderLevel": 10,
    "image": "assets/images/products/asus-rog-phone-7.svg",
    "description": "Asus Asus ROG Phone 7 with Snapdragon 8 Gen 2, 6.78-inch FHD+ AMOLED, 165Hz, 50MP + 13MP Ultrawide + 5MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_031",
    "sku": "SP-ASU-AI22055D-512",
    "name": "Asus ROG Phone 7 Ultimate",
    "brand": "Asus",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Storm White"
    },
    "costPrice": 81999,
    "price": 99999,
    "reorderLevel": 10,
    "image": "assets/images/products/asus-rog-phone-7-ultimate.svg",
    "description": "Asus Asus ROG Phone 7 Ultimate with Snapdragon 8 Gen 2, 6.78-inch FHD+ AMOLED, 165Hz, 50MP + 13MP Ultrawide + 5MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_032",
    "sku": "SP-GOO-GA11813I-256",
    "name": "Google Pixel 11",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 69699,
    "price": 84999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-11.svg",
    "description": "Google Google Pixel 11 with Google Tensor G6, 6.3-inch Actua OLED, 120Hz, 48MP OIS + 10.8MP Telephoto (5x) + 13MP Ultrawide, 4985mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_033",
    "sku": "SP-GOO-GA11820I-256",
    "name": "Google Pixel 11 Pro",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 90199,
    "price": 109999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-11-pro.svg",
    "description": "Google Google Pixel 11 Pro with Google Tensor G6, 6.3-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 4870mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_034",
    "sku": "SP-GOO-GA11830I-256",
    "name": "Google Pixel 11 Pro XL",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 102499,
    "price": 124999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-11-pro-xl.svg",
    "description": "Google Google Pixel 11 Pro XL with Google Tensor G6, 6.8-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 5115mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_035",
    "sku": "SP-GOO-GA11840I-512",
    "name": "Google Pixel 11 Pro Fold",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Obsidian"
    },
    "costPrice": 153339,
    "price": 186999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-11-pro-fold.svg",
    "description": "Google Google Pixel 11 Pro Fold with Google Tensor G6, 8.0-inch Super Actua Flex LTPO OLED, 120Hz, 48MP OIS + 10.8MP Telephoto (5x) + 10.5MP Ultrawide, 5015mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_036",
    "sku": "SP-GOO-GA09605I-256",
    "name": "Google Pixel 10a",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Obsidian"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-10a.svg",
    "description": "Google Google Pixel 10a with Google Tensor G4, 6.3-inch Actua pOLED, 120Hz, 48MP OIS + 13MP Ultrawide, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_037",
    "sku": "SP-GOO-GA09883I-256",
    "name": "Google Pixel 10",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 55759,
    "price": 67999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-10.svg",
    "description": "Google Google Pixel 10 with Google Tensor G5, 6.3-inch Actua OLED, 120Hz, 48MP OIS + 10.8MP Telephoto (5x) + 13MP Ultrawide, 4970mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_038",
    "sku": "SP-GOO-GA09901I-256",
    "name": "Google Pixel 10 Pro",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "16GB",
      "color": "Obsidian"
    },
    "costPrice": 81999,
    "price": 99999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-10-pro.svg",
    "description": "Google Google Pixel 10 Pro with Google Tensor G5, 6.3-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 4870mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_039",
    "sku": "SP-GOO-GA09915I-256",
    "name": "Google Pixel 10 Pro XL",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "16GB",
      "color": "Obsidian"
    },
    "costPrice": 94299,
    "price": 114999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-10-pro-xl.svg",
    "description": "Google Google Pixel 10 Pro XL with Google Tensor G5, 6.8-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_040",
    "sku": "SP-GOO-GA09930I-256",
    "name": "Google Pixel 10 Pro Fold",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "16GB",
      "color": "Moonstone"
    },
    "costPrice": 133496,
    "price": 162800,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-10-pro-fold.svg",
    "description": "Google Google Pixel 10 Pro Fold with Google Tensor G5, 8.0-inch Super Actua Flex LTPO OLED, 120Hz, 48MP OIS + 10.8MP Telephoto (5x) + 10.5MP Ultrawide, 5015mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_041",
    "sku": "SP-GOO-GA09510I-256",
    "name": "Google Pixel 9a",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Obsidian"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-9a.svg",
    "description": "Google Google Pixel 9a with Google Tensor G4, 6.3-inch Actua pOLED, 120Hz, 48MP OIS + 13MP Ultrawide, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_042",
    "sku": "SP-GOO-GA05843I-256",
    "name": "Google Pixel 9",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 45099,
    "price": 54999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-9.svg",
    "description": "Google Google Pixel 9 with Google Tensor G4, 6.3-inch Actua OLED, 120Hz, 50MP OIS + 48MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_043",
    "sku": "SP-GOO-GA05984I-256",
    "name": "Google Pixel 9 Pro XL",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "16GB",
      "color": "Obsidian"
    },
    "costPrice": 75235,
    "price": 91750,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-9-pro-xl.svg",
    "description": "Google Google Pixel 9 Pro XL with Google Tensor G4, 6.8-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 5060mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_044",
    "sku": "SP-GOO-GA06105I-256",
    "name": "Google Pixel 9 Pro Fold",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "16GB",
      "color": "Obsidian"
    },
    "costPrice": 85157,
    "price": 103850,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-9-pro-fold.svg",
    "description": "Google Google Pixel 9 Pro Fold with Google Tensor G4, 8.0-inch Super Actua Flex LTPO OLED, 120Hz, 48MP OIS + 10.8MP Telephoto (5x) + 10.5MP Ultrawide, 4650mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_045",
    "sku": "SP-GOO-GA05571I-128",
    "name": "Google Pixel 8a",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Obsidian"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-8a.svg",
    "description": "Google Google Pixel 8a with Google Tensor G3, 6.1-inch Actua OLED, 120Hz, 64MP OIS + 13MP Ultrawide, 4492mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_046",
    "sku": "SP-GOO-GPJ41-128",
    "name": "Google Pixel 8",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Obsidian"
    },
    "costPrice": 29929,
    "price": 36499,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-8.svg",
    "description": "Google Google Pixel 8 with Google Tensor G3, 6.2-inch Actua OLED, 120Hz, 50MP OIS + 12MP Ultrawide, 4575mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_047",
    "sku": "SP-GOO-GC3VE-128",
    "name": "Google Pixel 8 Pro",
    "brand": "Google",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "12GB",
      "color": "Obsidian"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/google-pixel-8-pro.svg",
    "description": "Google Google Pixel 8 Pro with Google Tensor G3, 6.7-inch Super Actua LTPO OLED, 120Hz, 50MP OIS + 48MP Telephoto (5x) + 48MP Ultrawide, 5050mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_048",
    "sku": "SP-HON-BVLN49-512",
    "name": "Honor Magic6 Pro 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 45919,
    "price": 55999,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-magic6-pro-5g.svg",
    "description": "Honor Honor Magic6 Pro 5G with Snapdragon 8 Gen 3, 6.8-inch FHD+ LTPO OLED, 120Hz, 50MP OIS + 180MP Periscope (2.5x) + 50MP Ultrawide, 5600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_049",
    "sku": "SP-HON-ELPNX9-512",
    "name": "Honor 200 Pro 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 35915,
    "price": 43799,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-200-pro-5g.svg",
    "description": "Honor Honor 200 Pro 5G with Snapdragon 8s Gen 3, 6.78-inch 1.5K Quad-Curved OLED, 120Hz, 50MP OIS + 50MP Telephoto (2.5x) + 12MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_050",
    "sku": "SP-HON-ELINX9-256",
    "name": "Honor 200 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 24592,
    "price": 29990,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-200-5g.svg",
    "description": "Honor Honor 200 5G with Snapdragon 7 Gen 3, 6.7-inch 1.5K Quad-Curved OLED, 120Hz, 50MP OIS + 50MP Telephoto (2.5x) + 12MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_051",
    "sku": "SP-HON-LLYNX1-256",
    "name": "Honor 200 Lite 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Cyan Lake"
    },
    "costPrice": 13734,
    "price": 16749,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-200-lite-5g.svg",
    "description": "Honor Honor 200 Lite 5G with MediaTek Dimensity 6080, 6.7-inch FHD+ AMOLED, 90Hz, 108MP + 5MP Ultrawide + 2MP Macro, 4500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_052",
    "sku": "SP-HON-REANX9-256",
    "name": "Honor 90 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Diamond Silver"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-90-5g.svg",
    "description": "Honor Honor 90 5G with Snapdragon 7 Gen 1 Accelerated Edition, 6.7-inch 1.5K Quad-Curved AMOLED, 120Hz, 200MP + 12MP Ultrawide + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_053",
    "sku": "SP-HON-BRPNX1-256",
    "name": "Honor X9c 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Jade Cyan"
    },
    "costPrice": 17630,
    "price": 21500,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-x9c-5g.svg",
    "description": "Honor Honor X9c 5G with Snapdragon 6 Gen 1, 6.78-inch 1.5K Curved AMOLED, 120Hz, 108MP OIS + 5MP Ultrawide, 6600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_054",
    "sku": "SP-HON-ALTNX1-256",
    "name": "Honor X7c 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Forest Green"
    },
    "costPrice": 12299,
    "price": 14999,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-x7c-5g.svg",
    "description": "Honor Honor X7c 5G with Snapdragon 4 Gen 2, 6.8-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_055",
    "sku": "SP-HON-ALINX1-256",
    "name": "Honor X9b 5G",
    "brand": "Honor",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Midnight Black"
    },
    "costPrice": 14431,
    "price": 17599,
    "reorderLevel": 10,
    "image": "assets/images/products/honor-x9b-5g.svg",
    "description": "Honor Honor X9b 5G with Snapdragon 6 Gen 1, 6.78-inch 1.5K Curved AMOLED, 120Hz, 108MP + 5MP Ultrawide + 2MP Macro, 5800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_056",
    "sku": "SP-IQO-I2401-256",
    "name": "iQOO 15",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Alpha"
    },
    "costPrice": 63139,
    "price": 76999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-15.svg",
    "description": "iQOO iQOO 15 with Snapdragon 8 Elite Gen 5, 6.85-inch 2K LTPO AMOLED, 144Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_057",
    "sku": "SP-IQO-I2501-256",
    "name": "iQOO 15R",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Dark Knight"
    },
    "costPrice": 44279,
    "price": 53999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-15r.svg",
    "description": "iQOO iQOO 15R with Snapdragon 8 Gen 5, 6.59-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 7600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_058",
    "sku": "SP-IQO-I2401-1",
    "name": "iQOO 13",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Legend"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-13.svg",
    "description": "iQOO iQOO 13 with Snapdragon 8 Elite, 6.82-inch 2K LTPO AMOLED, 144Hz, 50MP OIS + 50MP Telephoto (2x) + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_059",
    "sku": "SP-IQO-I2207-256",
    "name": "iQOO 12 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Legend"
    },
    "costPrice": 37719,
    "price": 45999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-12-5g.svg",
    "description": "iQOO iQOO 12 5G with Snapdragon 8 Gen 3, 6.78-inch 1.5K LTPO AMOLED, 144Hz, 50MP OIS + 64MP Periscope (3x) + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_060",
    "sku": "SP-IQO-I2405-128",
    "name": "iQOO Neo 10",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Inferno Red"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-neo-10.svg",
    "description": "iQOO iQOO Neo 10 with Snapdragon 8s Gen 4, 6.78-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_061",
    "sku": "SP-IQO-I2221-128",
    "name": "iQOO Neo 10R",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Raging Blue"
    },
    "costPrice": 20499,
    "price": 24999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-neo-10r.svg",
    "description": "iQOO iQOO Neo 10R with Snapdragon 8s Gen 3, 6.78-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 6400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_062",
    "sku": "SP-IQO-I2304-128",
    "name": "iQOO Neo 9 Pro",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Fiery Red"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-neo-9-pro.svg",
    "description": "iQOO iQOO Neo 9 Pro with Snapdragon 8 Gen 2, 6.78-inch 1.5K LTPO AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 5160mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_063",
    "sku": "SP-IQO-I2508-128",
    "name": "iQOO Z11 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Celestial Blue"
    },
    "costPrice": 28699,
    "price": 34999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z11-5g.svg",
    "description": "iQOO iQOO Z11 5G with MediaTek Dimensity 7500 Turbo, 6.83-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 7050mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_064",
    "sku": "SP-IQO-I2509-128",
    "name": "iQOO Z11xa 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titan Black"
    },
    "costPrice": 22706,
    "price": 27690,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z11xa-5g.svg",
    "description": "iQOO iQOO Z11xa 5G with MediaTek Dimensity 7400 Turbo, 6.76-inch FHD+ LCD, 120Hz, 50MP + 2MP Depth, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_065",
    "sku": "SP-IQO-I2505-128",
    "name": "iQOO Z11x 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Eclipse Black"
    },
    "costPrice": 22132,
    "price": 26990,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z11x-5g.svg",
    "description": "iQOO iQOO Z11x 5G with MediaTek Dimensity 7400 Turbo, 6.76-inch FHD+ LCD, 120Hz, 50MP + 2MP Depth, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_066",
    "sku": "SP-IQO-I2510-128",
    "name": "iQOO Z11 Lite 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Solar Flame"
    },
    "costPrice": 14349,
    "price": 17499,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z11-lite-5g.svg",
    "description": "iQOO iQOO Z11 Lite 5G with MediaTek Dimensity 6300, 6.74-inch HD+ LCD, 90Hz, 50MP + 2MP Depth, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_067",
    "sku": "SP-IQO-I2407-128",
    "name": "iQOO Z10 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Glacier Silver"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z10-5g.svg",
    "description": "iQOO iQOO Z10 5G with Snapdragon 7s Gen 3, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP OIS + 2MP Depth, 7300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_068",
    "sku": "SP-IQO-I2411-128",
    "name": "iQOO Z10R 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Aquamarine"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z10r-5g.svg",
    "description": "iQOO iQOO Z10R 5G with MediaTek Dimensity 7400, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP OIS + 2MP Depth, 5700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_069",
    "sku": "SP-IQO-I2406-128",
    "name": "iQOO Z10x 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Ultramarine"
    },
    "costPrice": 11069,
    "price": 13499,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z10x-5g.svg",
    "description": "iQOO iQOO Z10x 5G with MediaTek Dimensity 7300, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_070",
    "sku": "SP-IQO-I2409-64",
    "name": "iQOO Z10 Lite 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Cyber Green"
    },
    "costPrice": 10659,
    "price": 12999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z10-lite-5g.svg",
    "description": "iQOO iQOO Z10 Lite 5G with MediaTek Dimensity 6300, 6.74-inch HD+ IPS LCD, 90Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_071",
    "sku": "SP-IQO-I2305-128",
    "name": "iQOO Z9s Pro 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Flamboyant Orange"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z9s-pro-5g.svg",
    "description": "iQOO iQOO Z9s Pro 5G with Snapdragon 7 Gen 3, 6.77-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_072",
    "sku": "SP-IQO-I2306-128",
    "name": "iQOO Z9s 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Onyx Green"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z9s-5g.svg",
    "description": "iQOO iQOO Z9s 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 2MP Depth, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_073",
    "sku": "SP-IQO-I2302-128",
    "name": "iQOO Z9 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Brushed Green"
    },
    "costPrice": 14349,
    "price": 17499,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z9-5g.svg",
    "description": "iQOO iQOO Z9 5G with MediaTek Dimensity 7200, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_074",
    "sku": "SP-IQO-I2219-128",
    "name": "iQOO Z9x 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Tornado Green"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z9x-5g.svg",
    "description": "iQOO iQOO Z9x 5G with Snapdragon 6 Gen 1, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_075",
    "sku": "SP-IQO-I2307-128",
    "name": "iQOO Z9 Lite 5G",
    "brand": "iQOO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Aqua Flow"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/iqoo-z9-lite-5g.svg",
    "description": "iQOO iQOO Z9 Lite 5G with MediaTek Dimensity 6300, 6.56-inch HD+ IPS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_076",
    "sku": "SP-MOT-XT26012-256",
    "name": "Motorola Signature",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Pantone Carbon"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-signature.svg",
    "description": "Motorola Motorola Signature with Snapdragon 8 Gen 5, 6.8-inch FHD+ AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 50MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_077",
    "sku": "SP-MOT-XT26511-512",
    "name": "Motorola Razr 70 Ultra",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Pantone Midnight Blue"
    },
    "costPrice": 81999,
    "price": 99999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-70-ultra.svg",
    "description": "Motorola Motorola Razr 70 Ultra with Snapdragon 8 Elite Gen 2, 6.9-inch FHD+ Foldable LTPO AMOLED, 165Hz, 50MP OIS + 50MP Telephoto (2x), 4500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_078",
    "sku": "SP-MOT-XT26531-256",
    "name": "Motorola Razr 70",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Lightest Sky"
    },
    "costPrice": 57399,
    "price": 69999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-70.svg",
    "description": "Motorola Motorola Razr 70 with MediaTek Dimensity 8400X, 6.9-inch FHD+ Foldable LTPO AMOLED, 120Hz, 50MP OIS + 50MP Ultrawide, 4800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_079",
    "sku": "SP-MOT-XT25511-512",
    "name": "Motorola Razr 60 Ultra",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Pantone Rio Red"
    },
    "costPrice": 73799,
    "price": 89999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-60-ultra.svg",
    "description": "Motorola Motorola Razr 60 Ultra with Snapdragon 8 Elite, 7.0-inch FHD+ Foldable LTPO AMOLED, 165Hz, 50MP OIS + 50MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_080",
    "sku": "SP-MOT-XT25531-256",
    "name": "Motorola Razr 60",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Lightest Sky"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-60.svg",
    "description": "Motorola Motorola Razr 60 with MediaTek Dimensity 7400X, 6.9-inch FHD+ Foldable P-OLED, 120Hz, 50MP OIS + 13MP Ultrawide, 4500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_081",
    "sku": "SP-MOT-XT24511-512",
    "name": "Motorola Razr 50 Ultra",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Midnight Blue"
    },
    "costPrice": 65599,
    "price": 79999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-50-ultra.svg",
    "description": "Motorola Motorola Razr 50 Ultra with Snapdragon 8s Gen 3, 6.9-inch FHD+ Foldable LTPO AMOLED, 165Hz, 50MP OIS + 50MP Telephoto (2x), 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_082",
    "sku": "SP-MOT-XT24531-256",
    "name": "Motorola Razr 50",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Koala Grey"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-razr-50.svg",
    "description": "Motorola Motorola Razr 50 with MediaTek Dimensity 7300X, 6.9-inch FHD+ Foldable LTPO AMOLED, 120Hz, 50MP OIS + 13MP Ultrawide, 4200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_083",
    "sku": "SP-MOT-XT26031-256",
    "name": "Motorola Edge 70 Max",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Pantone Eclipse Black"
    },
    "costPrice": 45099,
    "price": 54999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-70-max.svg",
    "description": "Motorola Motorola Edge 70 Max with Snapdragon 8 Elite Gen 2, 6.8-inch 1.5K LTPO AMOLED, 144Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 7100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_084",
    "sku": "SP-MOT-XT26051-256",
    "name": "Motorola Edge 70 Pro+",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Pantone Velvet Violet"
    },
    "costPrice": 39359,
    "price": 47999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-70-pro.svg",
    "description": "Motorola Motorola Edge 70 Pro+ with MediaTek Dimensity 9500, 6.8-inch 1.5K Curved AMOLED, 144Hz, 50MP OIS + 50MP Telephoto (3x) + 50MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_085",
    "sku": "SP-MOT-XT26071-256",
    "name": "Motorola Edge 70 Pro",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Luxe Lavender"
    },
    "costPrice": 32382,
    "price": 39490,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-70-pro.svg",
    "description": "Motorola Motorola Edge 70 Pro with MediaTek Dimensity 8500 Extreme, 6.8-inch 1.5K Curved AMOLED, 144Hz, 50MP OIS + 50MP Ultrawide + 10MP Telephoto (3x), 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_086",
    "sku": "SP-MOT-XT26091-256",
    "name": "Motorola Edge 70",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Gadget Grey"
    },
    "costPrice": 28363,
    "price": 34589,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-70.svg",
    "description": "Motorola Motorola Edge 70 with Snapdragon 7 Gen 4, 6.7-inch 1.5K P-OLED, 144Hz, 50MP OIS + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_087",
    "sku": "SP-MOT-XT26111-128",
    "name": "Motorola Edge 70 Fusion",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Orient Blue"
    },
    "costPrice": 23764,
    "price": 28980,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-70-fusion.svg",
    "description": "Motorola Motorola Edge 70 Fusion with Snapdragon 7s Gen 4, 6.8-inch 1.5K Quad-Curved AMOLED, 144Hz, 50MP OIS + 13MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_088",
    "sku": "SP-MOT-XT25031-256",
    "name": "Motorola Edge 60 Pro",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Dazzling Blue"
    },
    "costPrice": 24756,
    "price": 30190,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-60-pro.svg",
    "description": "Motorola Motorola Edge 60 Pro with MediaTek Dimensity 8350 Extreme, 6.7-inch 1.5K Quad-Curved P-OLED, 120Hz, 50MP OIS + 50MP Ultrawide + 10MP Telephoto (3x), 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_089",
    "sku": "SP-MOT-XT25051-128",
    "name": "Motorola Edge 60 Fusion",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Slipstream"
    },
    "costPrice": 17138,
    "price": 20900,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-60-fusion.svg",
    "description": "Motorola Motorola Edge 60 Fusion with MediaTek Dimensity 7400, 6.67-inch 1.5K Quad-Curved P-OLED, 120Hz, 50MP OIS + 13MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_090",
    "sku": "SP-MOT-XT25071-256",
    "name": "Motorola Edge 60 Stylus",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Gibraltar Sea"
    },
    "costPrice": 16859,
    "price": 20560,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-60-stylus.svg",
    "description": "Motorola Motorola Edge 60 Stylus with Snapdragon 7s Gen 2, 6.7-inch 1.5K P-OLED, 120Hz, 50MP OIS + 13MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_091",
    "sku": "SP-MOT-XT24011-512",
    "name": "Motorola Edge 50 Ultra",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Forest Grey"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-50-ultra.svg",
    "description": "Motorola Motorola Edge 50 Ultra with Snapdragon 8s Gen 3, 6.7-inch 1.5K P-OLED, 144Hz, 50MP OIS + 64MP Periscope (3x) + 50MP Ultrawide, 4500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_092",
    "sku": "SP-MOT-XT24031-256",
    "name": "Motorola Edge 50 Pro",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Luxe Lavender"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-50-pro.svg",
    "description": "Motorola Motorola Edge 50 Pro with Snapdragon 7 Gen 3, 6.7-inch 1.5K Curved P-OLED, 144Hz, 50MP OIS + 10MP Telephoto (3x) + 13MP Ultrawide, 4500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_093",
    "sku": "SP-MOT-XT24071-256",
    "name": "Motorola Edge 50",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Jungle Green"
    },
    "costPrice": 18852,
    "price": 22990,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-50.svg",
    "description": "Motorola Motorola Edge 50 with Snapdragon 7 Gen 1 AE, 6.67-inch 1.5K Curved P-OLED, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 13MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_094",
    "sku": "SP-MOT-XT24291-128",
    "name": "Motorola Edge 50 Fusion",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Marshmallow Blue"
    },
    "costPrice": 17219,
    "price": 20999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-50-fusion.svg",
    "description": "Motorola Motorola Edge 50 Fusion with Snapdragon 7s Gen 2, 6.7-inch FHD+ Curved P-OLED, 144Hz, 50MP OIS + 13MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_095",
    "sku": "SP-MOT-XT24091-256",
    "name": "Motorola Edge 50 Neo",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Pantone Poinciana"
    },
    "costPrice": 17219,
    "price": 20999,
    "reorderLevel": 10,
    "image": "assets/images/products/motorola-edge-50-neo.svg",
    "description": "Motorola Motorola Edge 50 Neo with MediaTek Dimensity 7300, 6.4-inch 1.5K LTPO P-OLED, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 13MP Ultrawide, 4310mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_096",
    "sku": "SP-MOT-XT26311-128",
    "name": "Moto G Max 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Pantone Midnight Blue"
    },
    "costPrice": 18286,
    "price": 22300,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g-max-5g.svg",
    "description": "Motorola Moto G Max 5G with Snapdragon 6s Gen 4, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_097",
    "sku": "SP-MOT-XT26331-128",
    "name": "Moto G77 Power 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Forest Green"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g77-power-5g.svg",
    "description": "Motorola Moto G77 Power 5G with MediaTek Dimensity 7300, 6.67-inch FHD+ P-OLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_098",
    "sku": "SP-MOT-XT26351-128",
    "name": "Moto G67 Power 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Cilantro"
    },
    "costPrice": 20327,
    "price": 24789,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g67-power-5g.svg",
    "description": "Motorola Moto G67 Power 5G with Snapdragon 7s Gen 2, 6.7-inch FHD+ IPS LCD, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_099",
    "sku": "SP-MOT-XT26371-128",
    "name": "Moto G57 Power 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Regatta"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g57-power-5g.svg",
    "description": "Motorola Moto G57 Power 5G with MediaTek Dimensity 6400, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_100",
    "sku": "SP-MOT-XT26391-64",
    "name": "Moto G37 Power 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Pantone Nautical Blue"
    },
    "costPrice": 12462,
    "price": 15197,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g37-power-5g.svg",
    "description": "Motorola Moto G37 Power 5G with MediaTek Dimensity 6400, 6.67-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Macro, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_101",
    "sku": "SP-MOT-XT26411-64",
    "name": "Moto G06 Power",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Pantone Laurel Oak"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g06-power.svg",
    "description": "Motorola Moto G06 Power with MediaTek Helio G81 Ultra, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_102",
    "sku": "SP-MOT-XT25311-128",
    "name": "Moto G96 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Cattleya Orchid"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g96-5g.svg",
    "description": "Motorola Moto G96 5G with Snapdragon 7s Gen 2, 6.67-inch FHD+ Curved P-OLED, 144Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_103",
    "sku": "SP-MOT-XT25331-128",
    "name": "Moto G86 Power 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Cosmic Sky"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g86-power-5g.svg",
    "description": "Motorola Moto G86 Power 5G with MediaTek Dimensity 7400, 6.67-inch 1.5K P-OLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6720mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_104",
    "sku": "SP-MOT-XT25351-128",
    "name": "Moto G86 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pantone Cosmic Sky"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g86-5g.svg",
    "description": "Motorola Moto G86 5G with MediaTek Dimensity 7300, 6.67-inch 1.5K P-OLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_105",
    "sku": "SP-MOT-XT24311-128",
    "name": "Moto G64 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Mint Green"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g64-5g.svg",
    "description": "Motorola Moto G64 5G with MediaTek Dimensity 7025, 6.5-inch FHD+ IPS LCD, 120Hz, 50MP OIS + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_106",
    "sku": "SP-MOT-XT24271-128",
    "name": "Moto G85 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Olive Green"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g85-5g.svg",
    "description": "Motorola Moto G85 5G with Snapdragon 6s Gen 3, 6.67-inch FHD+ 3D Curved P-OLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_107",
    "sku": "SP-MOT-XT23639-128",
    "name": "Moto G45 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Brilliant Blue"
    },
    "costPrice": 9019,
    "price": 10999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g45-5g.svg",
    "description": "Motorola Moto G45 5G with Snapdragon 6s Gen 3, 6.5-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_108",
    "sku": "SP-MOT-XT24331-128",
    "name": "Moto G35 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Leaf Green"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g35-5g.svg",
    "description": "Motorola Moto G35 5G with Unisoc T760, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_109",
    "sku": "SP-MOT-XT23631-128",
    "name": "Moto G34 5G",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Ice Blue"
    },
    "costPrice": 9019,
    "price": 10999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g34-5g.svg",
    "description": "Motorola Moto G34 5G with Snapdragon 695 5G, 6.5-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_110",
    "sku": "SP-MOT-XT24251-128",
    "name": "Moto G24 Power",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Glacier Blue"
    },
    "costPrice": 6969,
    "price": 8499,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g24-power.svg",
    "description": "Motorola Moto G24 Power with MediaTek Helio G85, 6.56-inch HD+ IPS LCD, 90Hz, 50MP + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_111",
    "sku": "SP-MOT-XT24218-64",
    "name": "Moto G04s",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Concord Black"
    },
    "costPrice": 5739,
    "price": 6999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g04s.svg",
    "description": "Motorola Moto G04s with Unisoc T606, 6.56-inch HD+ IPS LCD, 90Hz, 50MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_112",
    "sku": "SP-MOT-XT24211-64",
    "name": "Moto G04",
    "brand": "Motorola",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Concord Black"
    },
    "costPrice": 5739,
    "price": 6999,
    "reorderLevel": 10,
    "image": "assets/images/products/moto-g04.svg",
    "description": "Motorola Moto G04 with Unisoc T606, 6.56-inch HD+ IPS LCD, 90Hz, 16MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_113",
    "sku": "SP-NOT-A024-256",
    "name": "Nothing Phone (3)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 55752,
    "price": 67990,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-3.svg",
    "description": "Nothing Nothing Phone (3) with Snapdragon 8s Gen 4, 6.67-inch 1.5K Flexible AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_114",
    "sku": "SP-NOT-AIN065-128",
    "name": "Nothing Phone (2)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Dark Grey"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-2.svg",
    "description": "Nothing Nothing Phone (2) with Snapdragon 8+ Gen 1, 6.7-inch FHD+ LTPO OLED, 120Hz, 50MP OIS + 50MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_115",
    "sku": "SP-NOT-A069P-128",
    "name": "Nothing Phone (4a) Pro",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Silver"
    },
    "costPrice": 37145,
    "price": 45299,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-4a-pro.svg",
    "description": "Nothing Nothing Phone (4a) Pro with Snapdragon 7 Gen 4, 6.83-inch 1.5K AMOLED, 144Hz, 50MP OIS + 50MP Periscope (3.5x) + 50MP Ultrawide, 5400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_116",
    "sku": "SP-NOT-A069-128",
    "name": "Nothing Phone (4a)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Black"
    },
    "costPrice": 28699,
    "price": 34999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-4a.svg",
    "description": "Nothing Nothing Phone (4a) with Snapdragon 7s Gen 4, 6.78-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 5400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_117",
    "sku": "SP-NOT-A070-128",
    "name": "Nothing Phone (4b)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Blue"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-4b.svg",
    "description": "Nothing Nothing Phone (4b) with Snapdragon 6 Gen 4, 6.77-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_118",
    "sku": "SP-NOT-A059P-128",
    "name": "Nothing Phone (3a) Pro",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Grey"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-3a-pro.svg",
    "description": "Nothing Nothing Phone (3a) Pro with Snapdragon 7s Gen 3, 6.77-inch FHD+ Flexible AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_119",
    "sku": "SP-NOT-A059-128",
    "name": "Nothing Phone (3a)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 20499,
    "price": 24999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-3a.svg",
    "description": "Nothing Nothing Phone (3a) with Snapdragon 7s Gen 3, 6.77-inch FHD+ Flexible AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2x) + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_120",
    "sku": "SP-NOT-A059L-128",
    "name": "Nothing Phone (3a) Lite",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-3a-lite.svg",
    "description": "Nothing Nothing Phone (3a) Lite with MediaTek Dimensity 7300 Pro, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_121",
    "sku": "SP-NOT-A142P-256",
    "name": "Nothing Phone (2a) Plus",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-2a-plus.svg",
    "description": "Nothing Nothing Phone (2a) Plus with MediaTek Dimensity 7350 Pro, 6.7-inch FHD+ Flexible AMOLED, 120Hz, 50MP OIS + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_122",
    "sku": "SP-NOT-A142-128",
    "name": "Nothing Phone (2a)",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/nothing-phone-2a.svg",
    "description": "Nothing Nothing Phone (2a) with MediaTek Dimensity 7200 Pro, 6.7-inch FHD+ Flexible AMOLED, 120Hz, 50MP OIS + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_123",
    "sku": "SP-NOT-A001P-128",
    "name": "CMF Phone 2 Pro",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/cmf-phone-2-pro.svg",
    "description": "Nothing CMF Phone 2 Pro with MediaTek Dimensity 7300 Pro, 6.77-inch FHD+ Flexible AMOLED, 120Hz, 50MP + 50MP Telephoto (2x) + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_124",
    "sku": "SP-NOT-A015-128",
    "name": "CMF Phone 1",
    "brand": "Nothing",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Black"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/cmf-phone-1.svg",
    "description": "Nothing CMF Phone 1 with MediaTek Dimensity 7300, 6.67-inch FHD+ Super AMOLED, 120Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_125",
    "sku": "SP-ONE-CPH2759-256",
    "name": "OnePlus 15T",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 61499,
    "price": 74999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-15t.svg",
    "description": "OnePlus OnePlus 15T with Snapdragon 8 Elite Gen 5, 6.32-inch 1.5K LTPO OLED, 165Hz, 50MP OIS + 50MP Telephoto (3.5x), 7500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_126",
    "sku": "SP-ONE-CPH2811-256",
    "name": "OnePlus Nord 6",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Silver"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-6.svg",
    "description": "OnePlus OnePlus Nord 6 with Snapdragon 8s Gen 4, 6.78-inch 1.5K AMOLED, 165Hz, 50MP OIS + 8MP Ultrawide, 9000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_127",
    "sku": "SP-ONE-CPH2823-128",
    "name": "OnePlus Nord CE 6 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Fresh Blue"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-ce-6-5g.svg",
    "description": "OnePlus OnePlus Nord CE 6 5G with Snapdragon 7s Gen 4, 6.78-inch 1.5K AMOLED, 144Hz, 50MP OIS + 2MP Depth, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_128",
    "sku": "SP-ONE-CPH2831-128",
    "name": "OnePlus Nord CE 6 Lite 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Hyper Black"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-ce-6-lite-5g.svg",
    "description": "OnePlus OnePlus Nord CE 6 Lite 5G with MediaTek Dimensity 7400 Apex, 6.72-inch FHD+ LCD, 144Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_129",
    "sku": "SP-ONE-CPH2955-128",
    "name": "OnePlus N6 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Fresh Mint"
    },
    "costPrice": 18449,
    "price": 22499,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-n6-5g.svg",
    "description": "OnePlus OnePlus N6 5G with MediaTek Dimensity 6360 Apex, 6.8-inch FHD+ LCD, 120Hz, 50MP, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_130",
    "sku": "SP-ONE-CPH2971-64",
    "name": "OnePlus N6x 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Burgundy Red"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-n6x-5g.svg",
    "description": "OnePlus OnePlus N6x 5G with MediaTek Dimensity 6300, 6.75-inch HD+ LCD, 120Hz, 50MP, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_131",
    "sku": "SP-ONE-CPH2747-256",
    "name": "OnePlus 15",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Infinite Black"
    },
    "costPrice": 69699,
    "price": 84999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-15.svg",
    "description": "OnePlus OnePlus 15 with Snapdragon 8 Elite Gen 5, 6.78-inch 1.5K LTPO AMOLED, 165Hz, 50MP OIS + 50MP Periscope (3.5x) + 50MP Ultrawide, 7300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_132",
    "sku": "SP-ONE-CPH2751-256",
    "name": "OnePlus 15R",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Mint Breeze"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-15r.svg",
    "description": "OnePlus OnePlus 15R with Snapdragon 8 Gen 5, 6.83-inch 1.5K AMOLED, 165Hz, 50MP OIS + 8MP Ultrawide, 7400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_133",
    "sku": "SP-ONE-CPH2653-256",
    "name": "OnePlus 13",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Midnight Ocean"
    },
    "costPrice": 50839,
    "price": 61999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-13.svg",
    "description": "OnePlus OnePlus 13 with Snapdragon 8 Elite, 6.82-inch QHD+ LTPO 4.1 AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_134",
    "sku": "SP-ONE-CPH2723-256",
    "name": "OnePlus 13s 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black Velvet"
    },
    "costPrice": 42639,
    "price": 51999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-13s-5g.svg",
    "description": "OnePlus OnePlus 13s 5G with Snapdragon 8 Elite, 6.32-inch 1.5K ProXDR LTPO AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2x), 5850mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_135",
    "sku": "SP-ONE-CPH2709-256",
    "name": "OnePlus Nord 5",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Dry Ice"
    },
    "costPrice": 23779,
    "price": 28999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-5.svg",
    "description": "OnePlus OnePlus Nord 5 with Snapdragon 8s Gen 3, 6.83-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 6800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_136",
    "sku": "SP-ONE-CPH2717-128",
    "name": "OnePlus Nord CE 5 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Nexus Blue"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-ce-5-5g.svg",
    "description": "OnePlus OnePlus Nord CE 5 5G with MediaTek Dimensity 8350 Apex, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_137",
    "sku": "SP-ONE-CPH2573-256",
    "name": "OnePlus 12",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Flowy Emerald"
    },
    "costPrice": 47559,
    "price": 57999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-12.svg",
    "description": "OnePlus OnePlus 12 with Snapdragon 8 Gen 3, 6.82-inch QHD+ LTPO AMOLED, 120Hz, 50MP OIS + 64MP Periscope (3x) + 48MP Ultrawide, 5400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_138",
    "sku": "SP-ONE-CPH2585-128",
    "name": "OnePlus 12R",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Iron Gray"
    },
    "costPrice": 29519,
    "price": 35999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-12r.svg",
    "description": "OnePlus OnePlus 12R with Snapdragon 8 Gen 2, 6.78-inch 1.5K LTPO 4.0 AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_139",
    "sku": "SP-ONE-CPH2661-128",
    "name": "OnePlus Nord 4",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Obsidian Midnight"
    },
    "costPrice": 21319,
    "price": 25999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-4.svg",
    "description": "OnePlus OnePlus Nord 4 with Snapdragon 7+ Gen 3, 6.74-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_140",
    "sku": "SP-ONE-CPH2613-128",
    "name": "OnePlus Nord CE 4",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Dark Chrome"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-ce-4.svg",
    "description": "OnePlus OnePlus Nord CE 4 with Snapdragon 7 Gen 3, 6.7-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_141",
    "sku": "SP-ONE-CPH2619-128",
    "name": "OnePlus Nord CE 4 Lite 5G",
    "brand": "OnePlus",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Mega Blue"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/oneplus-nord-ce-4-lite-5g.svg",
    "description": "OnePlus OnePlus Nord CE 4 Lite 5G with Snapdragon 695 5G, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Depth, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_142",
    "sku": "SP-OPP-CPH2911-512",
    "name": "OPPO Find X10 Pro Max 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Titanium Grey"
    },
    "costPrice": 163999,
    "price": 199999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x10-pro-max-5g.svg",
    "description": "OPPO OPPO Find X10 Pro Max 5G with MediaTek Dimensity 9600+, 6.82-inch QHD+ LTPO AMOLED, 120Hz, 200MP OIS + 200MP Periscope (3.5x) + 50MP Ultrawide, 8200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_143",
    "sku": "SP-OPP-CPH2905-256",
    "name": "OPPO Find X10 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Grey"
    },
    "costPrice": 114799,
    "price": 139999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x10-5g.svg",
    "description": "OPPO OPPO Find X10 5G with MediaTek Dimensity 9600M, 6.59-inch 1.5K LTPO AMOLED, 120Hz, 200MP OIS + 200MP Telephoto (2.8x) + 50MP Ultrawide, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_144",
    "sku": "SP-OPP-CPH2815-512",
    "name": "OPPO Find X9 Ultra 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Silk White"
    },
    "costPrice": 139399,
    "price": 169999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x9-ultra-5g.svg",
    "description": "OPPO OPPO Find X9 Ultra 5G with Snapdragon 8 Elite Gen 2, 6.82-inch QHD+ LTPO AMOLED, 120Hz, 200MP OIS + 50MP Periscope (6x) + 50MP Telephoto (3x) + 50MP Ultrawide, 7500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_145",
    "sku": "SP-OPP-CPH2809-512",
    "name": "OPPO Find X9 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Silk White"
    },
    "costPrice": 87740,
    "price": 107000,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x9-pro-5g.svg",
    "description": "OPPO OPPO Find X9 Pro 5G with MediaTek Dimensity 9500, 6.78-inch FHD+ Flexible AMOLED, 120Hz, 50MP OIS + 200MP Periscope Telephoto (3x) + 50MP Ultrawide + 2MP Monochrome, 7500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_146",
    "sku": "SP-OPP-CPH2803-256",
    "name": "OPPO Find X9 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Space Black"
    },
    "costPrice": 61499,
    "price": 74999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x9-5g.svg",
    "description": "OPPO OPPO Find X9 5G with MediaTek Dimensity 9500, 6.59-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_147",
    "sku": "SP-OPP-CPH2821-256",
    "name": "OPPO Find X9s 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Sunset Orange"
    },
    "costPrice": 53299,
    "price": 64999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x9s-5g.svg",
    "description": "OPPO OPPO Find X9s 5G with MediaTek Dimensity 9500s, 6.59-inch ProXDR AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 7025mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_148",
    "sku": "SP-OPP-CPH2659-512",
    "name": "OPPO Find X8 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Space Black"
    },
    "costPrice": 69699,
    "price": 84999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x8-pro-5g.svg",
    "description": "OPPO OPPO Find X8 Pro 5G with MediaTek Dimensity 9400, 6.78-inch FHD+ LTPO AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Periscope (6x) + 50MP Ultrawide, 5910mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_149",
    "sku": "SP-OPP-CPH2651-256",
    "name": "OPPO Find X8 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Star Grey"
    },
    "costPrice": 47559,
    "price": 57999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-find-x8-5g.svg",
    "description": "OPPO OPPO Find X8 5G with MediaTek Dimensity 9400, 6.59-inch FHD+ LTPO AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 50MP Ultrawide, 5630mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_150",
    "sku": "SP-OPP-CPH2869-256",
    "name": "OPPO Reno 16 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Twilight Violet"
    },
    "costPrice": 65599,
    "price": 79999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-16-pro-5g.svg",
    "description": "OPPO OPPO Reno 16 Pro 5G with MediaTek Dimensity 8500, 6.78-inch 1.5K AMOLED, 120Hz, 200MP OIS + 50MP Periscope (3.5x) + 50MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_151",
    "sku": "SP-OPP-CPH2865-256",
    "name": "OPPO Reno 16 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Starry White"
    },
    "costPrice": 54939,
    "price": 66999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-16-5g.svg",
    "description": "OPPO OPPO Reno 16 5G with Snapdragon 7 Gen 4, 6.32-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 50MP Ultrawide, 6700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_152",
    "sku": "SP-OPP-CPH2861-128",
    "name": "OPPO Reno 16c 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Aurora Blue"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-16c-5g.svg",
    "description": "OPPO OPPO Reno 16c 5G with MediaTek Dimensity 7300-Energy, 6.57-inch FHD+ AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_153",
    "sku": "SP-OPP-CPH2829-256",
    "name": "OPPO Reno 15 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Starlight Brown"
    },
    "costPrice": 42639,
    "price": 51999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-15-pro-5g.svg",
    "description": "OPPO OPPO Reno 15 Pro 5G with MediaTek Dimensity 8450, 6.78-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3.5x) + 50MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_154",
    "sku": "SP-OPP-CPH2825-256",
    "name": "OPPO Reno 15 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Luminous Blue"
    },
    "costPrice": 37309,
    "price": 45499,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-15-5g.svg",
    "description": "OPPO OPPO Reno 15 5G with Snapdragon 7 Gen 4, 6.59-inch 1.5K LTPS AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_155",
    "sku": "SP-OPP-CPH2739-256",
    "name": "OPPO Reno 14 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Grey"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-14-pro-5g.svg",
    "description": "OPPO OPPO Reno 14 Pro 5G with MediaTek Dimensity 8450, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 50MP Ultrawide, 6200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_156",
    "sku": "SP-OPP-CPH2737-256",
    "name": "OPPO Reno 14 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Forest Green"
    },
    "costPrice": 28699,
    "price": 34999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-14-5g.svg",
    "description": "OPPO OPPO Reno 14 5G with MediaTek Dimensity 8350, 6.59-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_157",
    "sku": "SP-OPP-CPH2697-256",
    "name": "OPPO Reno 13 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Mist Lavender"
    },
    "costPrice": 34439,
    "price": 41999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-13-pro-5g.svg",
    "description": "OPPO OPPO Reno 13 Pro 5G with MediaTek Dimensity 8350, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.5x) + 8MP Ultrawide, 5800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_158",
    "sku": "SP-OPP-CPH2689-128",
    "name": "OPPO Reno 13 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ivory White"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-13-5g.svg",
    "description": "OPPO OPPO Reno 13 5G with MediaTek Dimensity 8350, 6.59-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Monochrome, 5600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_159",
    "sku": "SP-OPP-CPH2629-256",
    "name": "OPPO Reno 12 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Space Brown"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-12-pro-5g.svg",
    "description": "OPPO OPPO Reno 12 Pro 5G with MediaTek Dimensity 7300-Energy, 6.7-inch FHD+ AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2x) + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_160",
    "sku": "SP-OPP-CPH2625-256",
    "name": "OPPO Reno 12 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Sunset Peach"
    },
    "costPrice": 21319,
    "price": 25999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-reno-12-5g.svg",
    "description": "OPPO OPPO Reno 12 5G with MediaTek Dimensity 7300-Energy, 6.7-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_161",
    "sku": "SP-OPP-CPH2885-256",
    "name": "OPPO F35 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Emerald Green"
    },
    "costPrice": 37719,
    "price": 45999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f35-pro-5g.svg",
    "description": "OPPO OPPO F35 Pro 5G with MediaTek Dimensity 7360 Max, 6.77-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_162",
    "sku": "SP-OPP-CPH2881-128",
    "name": "OPPO F35 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Stellar Blue"
    },
    "costPrice": 31979,
    "price": 38999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f35-5g.svg",
    "description": "OPPO OPPO F35 5G with MediaTek Dimensity 7300, 6.7-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Depth, 7500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_163",
    "sku": "SP-OPP-CPH2795-256",
    "name": "OPPO F31 Pro+ 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Festive Pink"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f31-pro-5g.svg",
    "description": "OPPO OPPO F31 Pro+ 5G with Snapdragon 7 Gen 3, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_164",
    "sku": "SP-OPP-CPH2791-128",
    "name": "OPPO F31 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Space Grey"
    },
    "costPrice": 20499,
    "price": 24999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f31-pro-5g.svg",
    "description": "OPPO OPPO F31 Pro 5G with MediaTek Dimensity 7300-Energy, 6.57-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_165",
    "sku": "SP-OPP-CPH2787-128",
    "name": "OPPO F31 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Midnight Blue"
    },
    "costPrice": 19679,
    "price": 23999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f31-5g.svg",
    "description": "OPPO OPPO F31 5G with MediaTek Dimensity 6300, 6.57-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_166",
    "sku": "SP-OPP-CPH2705-128",
    "name": "OPPO F29 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Marble White"
    },
    "costPrice": 19679,
    "price": 23999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f29-pro-5g.svg",
    "description": "OPPO OPPO F29 Pro 5G with MediaTek Dimensity 7300-Energy, 6.7-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_167",
    "sku": "SP-OPP-CPH2701-128",
    "name": "OPPO F29 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Solid Purple"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f29-5g.svg",
    "description": "OPPO OPPO F29 5G with Snapdragon 6 Gen 1, 6.7-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Monochrome, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_168",
    "sku": "SP-OPP-CPH2643-128",
    "name": "OPPO F27 Pro+ 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Dusk Pink"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f27-pro-5g.svg",
    "description": "OPPO OPPO F27 Pro+ 5G with MediaTek Dimensity 7050, 6.7-inch FHD+ 3D Curved AMOLED, 120Hz, 64MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_169",
    "sku": "SP-OPP-CPH2637-128",
    "name": "OPPO F27 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Emerald Green"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-f27-5g.svg",
    "description": "OPPO OPPO F27 5G with MediaTek Dimensity 6300, 6.67-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Portrait, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_170",
    "sku": "SP-OPP-CPH2875-128",
    "name": "OPPO K14 Plus 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Cyber Silver"
    },
    "costPrice": 25419,
    "price": 30999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-k14-plus-5g.svg",
    "description": "OPPO OPPO K14 Plus 5G with Snapdragon 7s Gen 3, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_171",
    "sku": "SP-OPP-CPH2855-128",
    "name": "OPPO K14x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Ocean Blue"
    },
    "costPrice": 15538,
    "price": 18949,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-k14x-5g.svg",
    "description": "OPPO OPPO K14x 5G with MediaTek Dimensity 6300, 6.75-inch HD+ LCD, 120Hz, 50MP + 2MP Depth, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_172",
    "sku": "SP-OPP-CPH2729-128",
    "name": "OPPO K13 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Prism Black"
    },
    "costPrice": 16317,
    "price": 19899,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-k13-5g.svg",
    "description": "OPPO OPPO K13 5G with Snapdragon 6 Gen 4, 6.67-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_173",
    "sku": "SP-OPP-CPH2733-128",
    "name": "OPPO K13x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Violet"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-k13x-5g.svg",
    "description": "OPPO OPPO K13x 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_174",
    "sku": "SP-OPP-CPH2667-128",
    "name": "OPPO K12x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Breeze Blue"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-k12x-5g.svg",
    "description": "OPPO OPPO K12x 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 32MP + 2MP Depth, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_175",
    "sku": "SP-OPP-CPH2845-64",
    "name": "OPPO A6x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Olive Green"
    },
    "costPrice": 10249,
    "price": 12499,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a6x-5g.svg",
    "description": "OPPO OPPO A6x 5G with MediaTek Dimensity 6300, 6.75-inch HD+ LCD, 120Hz, 13MP + Auxiliary Lens, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_176",
    "sku": "SP-OPP-CPH2715-128",
    "name": "OPPO A5 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Mocha Brown"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a5-pro-5g.svg",
    "description": "OPPO OPPO A5 Pro 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 50MP + 2MP Monochrome, 5800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_177",
    "sku": "SP-OPP-CPH2719-128",
    "name": "OPPO A5x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Blue"
    },
    "costPrice": 10659,
    "price": 12999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a5x-5g.svg",
    "description": "OPPO OPPO A5x 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 32MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_178",
    "sku": "SP-OPP-CPH2639-128",
    "name": "OPPO A3 Pro 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Moonlight Purple"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a3-pro-5g.svg",
    "description": "OPPO OPPO A3 Pro 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 50MP + 2MP Depth, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_179",
    "sku": "SP-OPP-CPH2683-128",
    "name": "OPPO A3 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Ocean Blue"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a3-5g.svg",
    "description": "OPPO OPPO A3 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 50MP + Auxiliary Lens, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_180",
    "sku": "SP-OPP-CPH2681-64",
    "name": "OPPO A3x 5G",
    "brand": "OPPO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Sparkle Black"
    },
    "costPrice": 9019,
    "price": 10999,
    "reorderLevel": 10,
    "image": "assets/images/products/oppo-a3x-5g.svg",
    "description": "OPPO OPPO A3x 5G with MediaTek Dimensity 6300, 6.67-inch HD+ LCD, 120Hz, 8MP + Auxiliary Lens, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_181",
    "sku": "SP-POC-25102PCB-256",
    "name": "POCO F8 Ultra 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Denim Blue"
    },
    "costPrice": 53299,
    "price": 64999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f8-ultra-5g.svg",
    "description": "POCO POCO F8 Ultra 5G with Snapdragon 8 Elite Gen 5, 6.9-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Periscope (5x) + 50MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_182",
    "sku": "SP-POC-25102PC0-256",
    "name": "POCO F8 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Silver"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f8-pro-5g.svg",
    "description": "POCO POCO F8 Pro 5G with Snapdragon 8 Elite, 6.59-inch 1.5K HyperRGB AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (5x) + 8MP Ultrawide, 6210mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_183",
    "sku": "SP-POC-24122RKC-256",
    "name": "POCO F7 Ultra 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Yellow"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f7-ultra-5g.svg",
    "description": "POCO POCO F7 Ultra 5G with Snapdragon 8 Elite, 6.67-inch QHD+ Flow AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2.5x) + 32MP Ultrawide, 5300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_184",
    "sku": "SP-POC-24117RK2-256",
    "name": "POCO F7 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 31979,
    "price": 38999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f7-pro-5g.svg",
    "description": "POCO POCO F7 Pro 5G with Snapdragon 8 Gen 3, 6.67-inch QHD+ Flow AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_185",
    "sku": "SP-POC-25053PC4-256",
    "name": "POCO F7 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Frost White"
    },
    "costPrice": 23779,
    "price": 28999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f7-5g.svg",
    "description": "POCO POCO F7 5G with Snapdragon 8s Gen 4, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7550mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_186",
    "sku": "SP-POC-24069PC2-256",
    "name": "POCO F6 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-f6-5g.svg",
    "description": "POCO POCO F6 5G with Snapdragon 8s Gen 3, 6.67-inch 1.5K CrystalRes AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_187",
    "sku": "SP-POC-26022PC4-256",
    "name": "POCO X8 Pro Max 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian Black"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x8-pro-max-5g.svg",
    "description": "POCO POCO X8 Pro Max 5G with MediaTek Dimensity 9500s, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 8500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_188",
    "sku": "SP-POC-2511FPC3-256",
    "name": "POCO X8 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 27059,
    "price": 32999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x8-pro-5g.svg",
    "description": "POCO POCO X8 Pro 5G with MediaTek Dimensity 8500 Ultra, 6.59-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_189",
    "sku": "SP-POC-26085PC3-128",
    "name": "POCO X8 Power 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Thunder Black"
    },
    "costPrice": 27469,
    "price": 33499,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x8-power-5g.svg",
    "description": "POCO POCO X8 Power 5G with Snapdragon 6 Gen 5, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 10000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_190",
    "sku": "SP-POC-26082PC1-128",
    "name": "POCO X8 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Carbon Black"
    },
    "costPrice": 22467,
    "price": 27399,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x8-5g.svg",
    "description": "POCO POCO X8 5G with Snapdragon 6s Gen 4, 6.83-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 9000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_191",
    "sku": "SP-POC-2412DPC0-256",
    "name": "POCO X7 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "POCO Yellow"
    },
    "costPrice": 19679,
    "price": 23999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x7-pro-5g.svg",
    "description": "POCO POCO X7 Pro 5G with MediaTek Dimensity 8400 Ultra, 6.67-inch 1.5K CrystalRes AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6550mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_192",
    "sku": "SP-POC-24095PCA-128",
    "name": "POCO X7 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "POCO Yellow"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x7-5g.svg",
    "description": "POCO POCO X7 5G with MediaTek Dimensity 7300 Ultra, 6.67-inch 1.5K 3D Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_193",
    "sku": "SP-POC-2311DRK4-256",
    "name": "POCO X6 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "POCO Yellow"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x6-pro-5g.svg",
    "description": "POCO POCO X6 Pro 5G with MediaTek Dimensity 8300 Ultra, 6.67-inch 1.5K CrystalRes AMOLED, 120Hz, 64MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_194",
    "sku": "SP-POC-23122PCD-256",
    "name": "POCO X6 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Snowstorm White"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x6-5g.svg",
    "description": "POCO POCO X6 5G with Snapdragon 7s Gen 2, 6.67-inch 1.5K CrystalRes AMOLED, 120Hz, 64MP OIS + 8MP Ultrawide + 2MP Macro, 5100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_195",
    "sku": "SP-POC-2312FRAF-128",
    "name": "POCO X6 Neo 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Astral Black"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-x6-neo-5g.svg",
    "description": "POCO POCO X6 Neo 5G with MediaTek Dimensity 6080, 6.67-inch FHD+ AMOLED, 120Hz, 108MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_196",
    "sku": "SP-POC-26051PC4-128",
    "name": "POCO M8 Power 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Power Black"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m8-power-5g.svg",
    "description": "POCO POCO M8 Power 5G with Snapdragon 4 Gen 4, 6.9-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_197",
    "sku": "SP-POC-26024PC1-128",
    "name": "POCO M8 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Carbon Black"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m8-5g.svg",
    "description": "POCO POCO M8 5G with Snapdragon 6s Gen 3, 6.77-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_198",
    "sku": "SP-POC-26072PC5-128",
    "name": "POCO M8x 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 15154,
    "price": 18480,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m8x-5g.svg",
    "description": "POCO POCO M8x 5G with Snapdragon 4 Gen 5, 6.9-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 7900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_199",
    "sku": "SP-POC-25078PC3-128",
    "name": "POCO M7 Plus 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Aqua Blue"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m7-plus-5g.svg",
    "description": "POCO POCO M7 Plus 5G with Snapdragon 6s Gen 3, 6.9-inch FHD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_200",
    "sku": "SP-POC-2409FPCC-128",
    "name": "POCO M7 Pro 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Lavender Frost"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m7-pro-5g.svg",
    "description": "POCO POCO M7 Pro 5G with MediaTek Dimensity 7025 Ultra, 6.67-inch FHD+ gOLED, 120Hz, 50MP OIS + 2MP Depth, 5110mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_201",
    "sku": "SP-POC-24108PCE-128",
    "name": "POCO M7 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Satin Black"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m7-5g.svg",
    "description": "POCO POCO M7 5G with Snapdragon 4 Gen 2, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 5160mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_202",
    "sku": "SP-POC-24066PC9-128",
    "name": "POCO M6 Plus 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Misty Lavender"
    },
    "costPrice": 9019,
    "price": 10999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m6-plus-5g.svg",
    "description": "POCO POCO M6 Plus 5G with Snapdragon 4 Gen 2 AE, 6.79-inch FHD+ IPS LCD, 120Hz, 108MP + 2MP Macro, 5030mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_203",
    "sku": "SP-POC-23128PC3-64",
    "name": "POCO M6 5G (Airtel/Retail)",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Orion Blue"
    },
    "costPrice": 6969,
    "price": 8499,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m6-5g-airtel-retail.svg",
    "description": "POCO POCO M6 5G (Airtel/Retail) with MediaTek Dimensity 6100+, 6.74-inch HD+ IPS LCD, 90Hz, 50MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_204",
    "sku": "SP-POC-2404APC5-128",
    "name": "POCO M6 4G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Black"
    },
    "costPrice": 7789,
    "price": 9499,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-m6-4g.svg",
    "description": "POCO POCO M6 4G with MediaTek Helio G91 Ultra, 6.79-inch FHD+ IPS LCD, 90Hz, 108MP + 2MP Macro, 5030mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_205",
    "sku": "SP-POC-26031PC1-128",
    "name": "POCO C85x 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Power Black"
    },
    "costPrice": 11274,
    "price": 13749,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-c85x-5g.svg",
    "description": "POCO POCO C85x 5G with MediaTek Dimensity 6300, 6.9-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_206",
    "sku": "SP-POC-2508CPC2-128",
    "name": "POCO C85 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Power Black"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-c85-5g.svg",
    "description": "POCO POCO C85 5G with MediaTek Dimensity 6300, 6.9-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_207",
    "sku": "SP-POC-2410FPCC-64",
    "name": "POCO C75 5G",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Enchanted Green"
    },
    "costPrice": 6559,
    "price": 7999,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-c75-5g.svg",
    "description": "POCO POCO C75 5G with Snapdragon 4s Gen 2, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 5160mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_208",
    "sku": "SP-POC-25028PC0-64",
    "name": "POCO C71",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Power Black"
    },
    "costPrice": 5329,
    "price": 6499,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-c71.svg",
    "description": "POCO POCO C71 with Unisoc T7250, 6.88-inch HD+ IPS LCD, 120Hz, 32MP + Auxiliary Lens, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_209",
    "sku": "SP-POC-2312BPC5-64",
    "name": "POCO C61",
    "brand": "POCO",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Diamond Dust Black"
    },
    "costPrice": 5329,
    "price": 6499,
    "reorderLevel": 10,
    "image": "assets/images/products/poco-c61.svg",
    "description": "POCO POCO C61 with MediaTek Helio G36, 6.71-inch HD+ IPS LCD, 90Hz, 8MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_210",
    "sku": "SP-REA-RMX5085-256",
    "name": "Realme GT 8 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titan Blue"
    },
    "costPrice": 59859,
    "price": 72999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-8-pro-5g.svg",
    "description": "Realme Realme GT 8 Pro 5G with Snapdragon 8 Elite Gen 5, 6.79-inch 2K LTPO AMOLED, 144Hz, 200MP OIS + 50MP Periscope + 50MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_211",
    "sku": "SP-REA-RMX5061-256",
    "name": "Realme GT 7 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "IceSense Blue"
    },
    "costPrice": 28699,
    "price": 34999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-7-5g.svg",
    "description": "Realme Realme GT 7 5G with MediaTek Dimensity 9400e, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_212",
    "sku": "SP-REA-RMX5085T-256",
    "name": "Realme GT 7T 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "IceSense Blue"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-7t-5g.svg",
    "description": "Realme Realme GT 7T 5G with MediaTek Dimensity 8400-MAX, 6.8-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_213",
    "sku": "SP-REA-RMX5011-256",
    "name": "Realme GT 7 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Mars Orange"
    },
    "costPrice": 41491,
    "price": 50599,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-7-pro-5g.svg",
    "description": "Realme Realme GT 7 Pro 5G with Snapdragon 8 Elite, 6.78-inch 1.5K Eco2 OLED Plus, 120Hz, 50MP OIS + 50MP Periscope (3x) + 8MP Ultrawide, 5800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_214",
    "sku": "SP-REA-RMX3851-256",
    "name": "Realme GT 6 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Fluid Silver"
    },
    "costPrice": 26978,
    "price": 32900,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-6-5g.svg",
    "description": "Realme Realme GT 6 5G with Snapdragon 8s Gen 3, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_215",
    "sku": "SP-REA-RMX3853-128",
    "name": "Realme GT 6T 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Fluid Silver"
    },
    "costPrice": 18818,
    "price": 22949,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-gt-6t-5g.svg",
    "description": "Realme Realme GT 6T 5G with Snapdragon 7+ Gen 3, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_216",
    "sku": "SP-REA-RMX5131-256",
    "name": "Realme 16 Pro+ 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Master Gold"
    },
    "costPrice": 32799,
    "price": 39999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-16-pro-5g.svg",
    "description": "Realme Realme 16 Pro+ 5G with Snapdragon 7 Gen 4, 6.8-inch 1.5K Quad-Curved AMOLED, 144Hz, 200MP OIS + 50MP Periscope (3.5x) + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_217",
    "sku": "SP-REA-RMX5121-128",
    "name": "Realme 16 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pebble Grey"
    },
    "costPrice": 27879,
    "price": 33999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-16-pro-5g.svg",
    "description": "Realme Realme 16 Pro 5G with MediaTek Dimensity 7300-Max, 6.78-inch FHD+ AMOLED, 144Hz, 200MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_218",
    "sku": "SP-REA-RMX5115-128",
    "name": "Realme 16T 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titanium Grey"
    },
    "costPrice": 23771,
    "price": 28989,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-16t-5g.svg",
    "description": "Realme Realme 16T 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_219",
    "sku": "SP-REA-RMX5105-128",
    "name": "Realme 16x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Endurance Brown"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-16x-5g.svg",
    "description": "Realme Realme 16x 5G with MediaTek Dimensity 6300, 6.75-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_220",
    "sku": "SP-REA-RMX5071-128",
    "name": "Realme 15 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Suede Grey"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-15-pro-5g.svg",
    "description": "Realme Realme 15 Pro 5G with Snapdragon 7s Gen 3, 6.7-inch FHD+ Curved OLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_221",
    "sku": "SP-REA-RMX5065-128",
    "name": "Realme 15 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Speed Green"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-15-5g.svg",
    "description": "Realme Realme 15 5G with MediaTek Dimensity 7300 Energy, 6.67-inch FHD+ OLED, 120Hz, 50MP OIS + 2MP Monochrome, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_222",
    "sku": "SP-REA-RMX5055-128",
    "name": "Realme 15T 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Starlight Black"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-15t-5g.svg",
    "description": "Realme Realme 15T 5G with MediaTek Dimensity 6300, 6.67-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_223",
    "sku": "SP-REA-RMX5051-128",
    "name": "Realme 14 Pro+ 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pearl White"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-14-pro-5g.svg",
    "description": "Realme Realme 14 Pro+ 5G with Snapdragon 7s Gen 3, 6.83-inch 1.5K Quad-Curved OLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_224",
    "sku": "SP-REA-RMX5056-128",
    "name": "Realme 14 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Pearl White"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-14-pro-5g.svg",
    "description": "Realme Realme 14 Pro 5G with MediaTek Dimensity 7300 Energy, 6.77-inch FHD+ Curved OLED, 120Hz, 50MP OIS + 2MP Monochrome, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_225",
    "sku": "SP-REA-RMX3940-128",
    "name": "Realme 14x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Crystal Black"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-14x-5g.svg",
    "description": "Realme Realme 14x 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 50MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_226",
    "sku": "SP-REA-RMX3921-256",
    "name": "Realme 13 Pro+ 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Monet Gold"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-13-pro-5g.svg",
    "description": "Realme Realme 13 Pro+ 5G with Snapdragon 7s Gen 2, 6.7-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 50MP Periscope (3x) + 8MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_227",
    "sku": "SP-REA-RMX3989-128",
    "name": "Realme 13 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Monet Gold"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-13-pro-5g.svg",
    "description": "Realme Realme 13 Pro 5G with Snapdragon 7s Gen 2, 6.7-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_228",
    "sku": "SP-REA-RMX5145-128",
    "name": "Realme P4s 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titanium Silver"
    },
    "costPrice": 27059,
    "price": 32999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4s-5g.svg",
    "description": "Realme Realme P4s 5G with MediaTek Dimensity 7400 Ultra, 6.8-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 7500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_229",
    "sku": "SP-REA-RMX5140-128",
    "name": "Realme P4s Lite",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4s-lite.svg",
    "description": "Realme Realme P4s Lite with Unisoc T7250, 6.75-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_230",
    "sku": "SP-REA-RMX5135-128",
    "name": "Realme P4 Power 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titan Black"
    },
    "costPrice": 24517,
    "price": 29899,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4-power-5g.svg",
    "description": "Realme Realme P4 Power 5G with MediaTek Dimensity 7400 Ultra, 6.8-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 10001mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_231",
    "sku": "SP-REA-RMX5130-128",
    "name": "Realme P4R 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Lavender Glare"
    },
    "costPrice": 16358,
    "price": 19949,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4r-5g.svg",
    "description": "Realme Realme P4R 5G with MediaTek Dimensity 6300, 6.8-inch HD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_232",
    "sku": "SP-REA-RMX5128-128",
    "name": "Realme P4 Lite 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Aurora Green"
    },
    "costPrice": 12955,
    "price": 15799,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4-lite-5g.svg",
    "description": "Realme Realme P4 Lite 5G with MediaTek Dimensity 6300, 6.8-inch HD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_233",
    "sku": "SP-REA-RMX5110-128",
    "name": "Realme P4x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Velocity Blue"
    },
    "costPrice": 18770,
    "price": 22890,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4x-5g.svg",
    "description": "Realme Realme P4x 5G with MediaTek Dimensity 7400 Ultra, 6.72-inch FHD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_234",
    "sku": "SP-REA-RMX5108-128",
    "name": "Realme P4 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Emerald Green"
    },
    "costPrice": 19679,
    "price": 23999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p4-5g.svg",
    "description": "Realme Realme P4 5G with Snapdragon 7s Gen 3, 6.77-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_235",
    "sku": "SP-REA-RMX5030-128",
    "name": "Realme P3 Ultra 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Glowing Lunar White"
    },
    "costPrice": 21319,
    "price": 25999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p3-ultra-5g.svg",
    "description": "Realme Realme P3 Ultra 5G with MediaTek Dimensity 8350 Ultra, 6.83-inch 1.5K Quad-Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_236",
    "sku": "SP-REA-RMX5032-128",
    "name": "Realme P3 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Nebula Glow"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p3-pro-5g.svg",
    "description": "Realme Realme P3 Pro 5G with Snapdragon 7s Gen 3, 6.83-inch 1.5K Quad-Curved AMOLED, 120Hz, 50MP OIS + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_237",
    "sku": "SP-REA-RMX5070-128",
    "name": "Realme P3 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Space Silver"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p3-5g.svg",
    "description": "Realme Realme P3 5G with Snapdragon 6 Gen 4, 6.67-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_238",
    "sku": "SP-REA-RMX3944-128",
    "name": "Realme P3x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Midnight Blue"
    },
    "costPrice": 10659,
    "price": 12999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p3x-5g.svg",
    "description": "Realme Realme P3x 5G with MediaTek Dimensity 6400, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_239",
    "sku": "SP-REA-RMX3987-128",
    "name": "Realme P2 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Parrot Green"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p2-pro-5g.svg",
    "description": "Realme Realme P2 Pro 5G with Snapdragon 7s Gen 2, 6.7-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_240",
    "sku": "SP-REA-RMX3872-128",
    "name": "Realme P1 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Phoenix Red"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-p1-pro-5g.svg",
    "description": "Realme Realme P1 Pro 5G with Snapdragon 6 Gen 1, 6.7-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_241",
    "sku": "SP-REA-RMX5138-128",
    "name": "Realme Narzo Power 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titan Silver"
    },
    "costPrice": 25419,
    "price": 30999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-power-5g.svg",
    "description": "Realme Realme Narzo Power 5G with MediaTek Dimensity 7400 Ultra, 6.8-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 10001mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_242",
    "sku": "SP-REA-RMX5125-128",
    "name": "Realme Narzo 100x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Frost Silver"
    },
    "costPrice": 15988,
    "price": 19497,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-100x-5g.svg",
    "description": "Realme Realme Narzo 100x 5G with MediaTek Dimensity 6300, 6.8-inch HD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_243",
    "sku": "SP-REA-RMX5120-64",
    "name": "Realme Narzo 100 Lite 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Frost Silver"
    },
    "costPrice": 13046,
    "price": 15910,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-100-lite-5g.svg",
    "description": "Realme Realme Narzo 100 Lite 5G with MediaTek Dimensity 6300, 6.8-inch HD+ IPS LCD, 144Hz, 50MP + 2MP Monochrome, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_244",
    "sku": "SP-REA-RMX5090-128",
    "name": "Realme Narzo 90 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Speed Green"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-90-5g.svg",
    "description": "Realme Realme Narzo 90 5G with MediaTek Dimensity 7300, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_245",
    "sku": "SP-REA-RMX5080-128",
    "name": "Realme Narzo 80 Pro 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Speed Silver"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-80-pro-5g.svg",
    "description": "Realme Realme Narzo 80 Pro 5G with MediaTek Dimensity 7400, 6.77-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 2MP Monochrome, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_246",
    "sku": "SP-REA-RMX3943-128",
    "name": "Realme Narzo 80x 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Deep Ocean"
    },
    "costPrice": 9429,
    "price": 11499,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-80x-5g.svg",
    "description": "Realme Realme Narzo 80x 5G with MediaTek Dimensity 6400, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_247",
    "sku": "SP-REA-RMX3945-128",
    "name": "Realme Narzo 80 Lite 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Crystal Purple"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-80-lite-5g.svg",
    "description": "Realme Realme Narzo 80 Lite 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 32MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_248",
    "sku": "SP-REA-RMX5003-128",
    "name": "Realme Narzo 70 Turbo 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Turbo Yellow"
    },
    "costPrice": 12299,
    "price": 14999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-narzo-70-turbo-5g.svg",
    "description": "Realme Realme Narzo 70 Turbo 5G with MediaTek Dimensity 7300 Energy, 6.67-inch FHD+ OLED, 120Hz, 50MP + 2MP Portrait, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_249",
    "sku": "SP-REA-RMX5155-128",
    "name": "Realme C100x",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Skyline Silver"
    },
    "costPrice": 12709,
    "price": 15499,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c100x.svg",
    "description": "Realme Realme C100x with MediaTek Helio G92 Max, 6.75-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_250",
    "sku": "SP-REA-RMX5150-64",
    "name": "Realme C100i",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 12299,
    "price": 14999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c100i.svg",
    "description": "Realme Realme C100i with Unisoc T7250, 6.75-inch HD+ IPS LCD, 90Hz, 8MP, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_251",
    "sku": "SP-REA-RMX5098-128",
    "name": "Realme C85 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Forest Green"
    },
    "costPrice": 11069,
    "price": 13499,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c85-5g.svg",
    "description": "Realme Realme C85 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_252",
    "sku": "SP-REA-RMX5095-64",
    "name": "Realme C83",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Starlight Silver"
    },
    "costPrice": 7789,
    "price": 9499,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c83.svg",
    "description": "Realme Realme C83 with Unisoc T612, 6.74-inch HD+ IPS LCD, 90Hz, 32MP, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_253",
    "sku": "SP-REA-RMX3943C-128",
    "name": "Realme C75 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Lily White"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c75-5g.svg",
    "description": "Realme Realme C75 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 32MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_254",
    "sku": "SP-REA-RMX3946-64",
    "name": "Realme C73 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Jade Green"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c73-5g.svg",
    "description": "Realme Realme C73 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 32MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_255",
    "sku": "SP-REA-RMX3950-128",
    "name": "Realme C63 5G",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Starry Gold"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c63-5g.svg",
    "description": "Realme Realme C63 5G with MediaTek Dimensity 6300, 6.67-inch HD+ IPS LCD, 120Hz, 32MP, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_256",
    "sku": "SP-REA-RMX3933-64",
    "name": "Realme C61",
    "brand": "Realme",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Safari Green"
    },
    "costPrice": 5944,
    "price": 7249,
    "reorderLevel": 10,
    "image": "assets/images/products/realme-c61.svg",
    "description": "Realme Realme C61 with Unisoc T612, 6.74-inch HD+ IPS LCD, 90Hz, 32MP, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_257",
    "sku": "SP-SAM-SMS948B-256",
    "name": "Galaxy S26 Ultra 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Cobalt Violet"
    },
    "costPrice": 119719,
    "price": 145999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s26-ultra-5g.svg",
    "description": "Samsung Galaxy S26 Ultra 5G with Snapdragon 8 Elite Gen 2, 6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz, 200MP OIS + 50MP Periscope (5x) + 50MP Telephoto (3x) + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_258",
    "sku": "SP-SAM-SMS946B-256",
    "name": "Galaxy S26+ 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Silver Shadow"
    },
    "costPrice": 98399,
    "price": 119999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s26-5g.svg",
    "description": "Samsung Galaxy S26+ 5G with Exynos 2600 / Snapdragon 8 Elite Gen 2, 6.7-inch QHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_259",
    "sku": "SP-SAM-SMS941B-256",
    "name": "Galaxy S26 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Silver Shadow"
    },
    "costPrice": 77899,
    "price": 94999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s26-5g.svg",
    "description": "Samsung Galaxy S26 5G with Exynos 2600 / Snapdragon 8 Elite Gen 2, 6.2-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_260",
    "sku": "SP-SAM-SMS731B-128",
    "name": "Galaxy S26 FE",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Graphite"
    },
    "costPrice": 59859,
    "price": 72999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s26-fe.svg",
    "description": "Samsung Galaxy S26 FE with Exynos 2500, 6.7-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 8MP Telephoto (3x) + 12MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_261",
    "sku": "SP-SAM-SMS938B-256",
    "name": "Galaxy S25 Ultra 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Silverblue"
    },
    "costPrice": 77899,
    "price": 94999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s25-ultra-5g.svg",
    "description": "Samsung Galaxy S25 Ultra 5G with Snapdragon 8 Elite, 6.9-inch QHD+ Dynamic AMOLED 2X, 120Hz, 200MP OIS + 50MP Periscope (5x) + 10MP Telephoto (3x) + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_262",
    "sku": "SP-SAM-SMS937B-256",
    "name": "Galaxy S25 Edge",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Silver"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s25-edge.svg",
    "description": "Samsung Galaxy S25 Edge with Snapdragon 8 Elite, 6.7-inch QHD+ Dynamic AMOLED 2X, 120Hz, 200MP OIS + 12MP Ultrawide, 3900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_263",
    "sku": "SP-SAM-SMS936B-256",
    "name": "Galaxy S25+ 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Navy"
    },
    "costPrice": 58629,
    "price": 71499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s25-5g.svg",
    "description": "Samsung Galaxy S25+ 5G with Snapdragon 8 Elite, 6.7-inch QHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_264",
    "sku": "SP-SAM-SMS931B-128",
    "name": "Galaxy S25 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "12GB",
      "color": "Silver Shadow"
    },
    "costPrice": 45099,
    "price": 54999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s25-5g.svg",
    "description": "Samsung Galaxy S25 5G with Snapdragon 8 Elite, 6.2-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_265",
    "sku": "SP-SAM-SMS726B-128",
    "name": "Galaxy S25 FE",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Navy"
    },
    "costPrice": 36079,
    "price": 43999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s25-fe.svg",
    "description": "Samsung Galaxy S25 FE with Exynos 2400, 6.7-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 8MP Telephoto (3x) + 12MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_266",
    "sku": "SP-SAM-SMS928B-256",
    "name": "Galaxy S24 Ultra 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titanium Gray"
    },
    "costPrice": 90199,
    "price": 109999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s24-ultra-5g.svg",
    "description": "Samsung Galaxy S24 Ultra 5G with Snapdragon 8 Gen 3, 6.8-inch QHD+ Dynamic AMOLED 2X, 120Hz, 200MP OIS + 50MP Periscope (5x) + 10MP Telephoto (3x) + 12MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_267",
    "sku": "SP-SAM-SMS926B-256",
    "name": "Galaxy S24+ 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Onyx Black"
    },
    "costPrice": 53299,
    "price": 64999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s24-5g.svg",
    "description": "Samsung Galaxy S24+ 5G with Exynos 2400, 6.7-inch QHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_268",
    "sku": "SP-SAM-SMS921B-128",
    "name": "Galaxy S24 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Onyx Black"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s24-5g.svg",
    "description": "Samsung Galaxy S24 5G with Exynos 2400, 6.2-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_269",
    "sku": "SP-SAM-SMS721B-128",
    "name": "Galaxy S24 FE 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Graphite"
    },
    "costPrice": 32799,
    "price": 39999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-s24-fe-5g.svg",
    "description": "Samsung Galaxy S24 FE 5G with Exynos 2400e, 6.7-inch FHD+ Dynamic AMOLED 2X, 120Hz, 50MP OIS + 8MP Telephoto (3x) + 12MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_270",
    "sku": "SP-SAM-SMF978B-512",
    "name": "Galaxy Z Fold 8 Ultra",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Titanium Black"
    },
    "costPrice": 163999,
    "price": 199999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-fold-8-ultra.svg",
    "description": "Samsung Galaxy Z Fold 8 Ultra with Snapdragon 8 Elite Gen 2, 8.2-inch QXGA+ Foldable Dynamic AMOLED 2X, 120Hz, 200MP OIS + 50MP Telephoto (3x) + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_271",
    "sku": "SP-SAM-SMF976B-256",
    "name": "Galaxy Z Fold 8",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Lavender"
    },
    "costPrice": 147599,
    "price": 179999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-fold-8.svg",
    "description": "Samsung Galaxy Z Fold 8 with Snapdragon 8 Elite Gen 2, 8.0-inch QXGA+ Foldable Dynamic AMOLED 2X, 120Hz, 200MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_272",
    "sku": "SP-SAM-SMF776B-256",
    "name": "Galaxy Z Flip 8",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Pink"
    },
    "costPrice": 102499,
    "price": 124999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-flip-8.svg",
    "description": "Samsung Galaxy Z Flip 8 with Snapdragon 8 Elite Gen 2, 6.7-inch FHD+ Foldable Dynamic AMOLED 2X, 120Hz, 50MP OIS + 12MP Ultrawide, 4100mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_273",
    "sku": "SP-SAM-SMF966B-256",
    "name": "Galaxy Z Fold 7",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Blue Shadow"
    },
    "costPrice": 135299,
    "price": 164999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-fold-7.svg",
    "description": "Samsung Galaxy Z Fold 7 with Snapdragon 8 Elite, 8.0-inch QXGA+ Foldable Dynamic AMOLED 2X, 120Hz, 200MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_274",
    "sku": "SP-SAM-SMF766B-256",
    "name": "Galaxy Z Flip 7",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Blue Shadow"
    },
    "costPrice": 90199,
    "price": 109999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-flip-7.svg",
    "description": "Samsung Galaxy Z Flip 7 with Exynos 2500, 6.9-inch FHD+ Foldable Dynamic AMOLED 2X, 120Hz, 50MP OIS + 12MP Ultrawide, 4300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_275",
    "sku": "SP-SAM-SMF761B-128",
    "name": "Galaxy Z Flip 7 FE",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Mint"
    },
    "costPrice": 70519,
    "price": 85999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-flip-7-fe.svg",
    "description": "Samsung Galaxy Z Flip 7 FE with Exynos 2400, 6.7-inch FHD+ Foldable Dynamic AMOLED 2X, 120Hz, 50MP OIS + 12MP Ultrawide, 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_276",
    "sku": "SP-SAM-SMF956B-256",
    "name": "Galaxy Z Fold 6",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Silver Shadow"
    },
    "costPrice": 135299,
    "price": 164999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-fold-6.svg",
    "description": "Samsung Galaxy Z Fold 6 with Snapdragon 8 Gen 3, 7.6-inch QXGA+ Foldable Dynamic AMOLED 2X, 120Hz, 50MP OIS + 10MP Telephoto (3x) + 12MP Ultrawide, 4400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_277",
    "sku": "SP-SAM-SMF741B-256",
    "name": "Galaxy Z Flip 6",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Silver Shadow"
    },
    "costPrice": 90199,
    "price": 109999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-z-flip-6.svg",
    "description": "Samsung Galaxy Z Flip 6 with Snapdragon 8 Gen 3, 6.7-inch FHD+ Foldable Dynamic AMOLED 2X, 120Hz, 50MP OIS + 12MP Ultrawide, 4000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_278",
    "sku": "SP-SAM-SMA576B-256",
    "name": "Galaxy A57 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Awesome Navy"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a57-5g.svg",
    "description": "Samsung Galaxy A57 5G with Exynos 1680, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 12MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_279",
    "sku": "SP-SAM-SMA376B-128",
    "name": "Galaxy A37 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Awesome Graphite"
    },
    "costPrice": 36079,
    "price": 43999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a37-5g.svg",
    "description": "Samsung Galaxy A37 5G with Snapdragon 7s Gen 3, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_280",
    "sku": "SP-SAM-SMA085F-64",
    "name": "Galaxy A08 LTE",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Black"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a08-lte.svg",
    "description": "Samsung Galaxy A08 LTE with MediaTek Helio G99, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_281",
    "sku": "SP-SAM-SMA566B-128",
    "name": "Galaxy A56 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Awesome Graphite"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a56-5g.svg",
    "description": "Samsung Galaxy A56 5G with Exynos 1580, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 12MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_282",
    "sku": "SP-SAM-SMA366B-128",
    "name": "Galaxy A36 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Awesome Lavender"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a36-5g.svg",
    "description": "Samsung Galaxy A36 5G with Snapdragon 6 Gen 3, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_283",
    "sku": "SP-SAM-SMA266B-128",
    "name": "Galaxy A26 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Black"
    },
    "costPrice": 20499,
    "price": 24999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a26-5g.svg",
    "description": "Samsung Galaxy A26 5G with Exynos 1380, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_284",
    "sku": "SP-SAM-SMA176B-128",
    "name": "Galaxy A17 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Blue Black"
    },
    "costPrice": 15579,
    "price": 18999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a17-5g.svg",
    "description": "Samsung Galaxy A17 5G with Exynos 1330, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP OIS + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_285",
    "sku": "SP-SAM-SMA166B-128",
    "name": "Galaxy A16 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Blue Black"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a16-5g.svg",
    "description": "Samsung Galaxy A16 5G with MediaTek Dimensity 6300, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_286",
    "sku": "SP-SAM-SMA066B-64",
    "name": "Galaxy A06 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Black"
    },
    "costPrice": 7789,
    "price": 9499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a06-5g.svg",
    "description": "Samsung Galaxy A06 5G with MediaTek Dimensity 6300, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_287",
    "sku": "SP-SAM-SMA556E-128",
    "name": "Galaxy A55 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Awesome Iceblue"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a55-5g.svg",
    "description": "Samsung Galaxy A55 5G with Exynos 1480, 6.6-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 12MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_288",
    "sku": "SP-SAM-SMA356E-128",
    "name": "Galaxy A35 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Awesome Iceblue"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a35-5g.svg",
    "description": "Samsung Galaxy A35 5G with Exynos 1380, 6.6-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 5MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_289",
    "sku": "SP-SAM-SMA256E-128",
    "name": "Galaxy A25 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Blue Black"
    },
    "costPrice": 19679,
    "price": 23999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a25-5g.svg",
    "description": "Samsung Galaxy A25 5G with Exynos 1280, 6.5-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_290",
    "sku": "SP-SAM-SMA156E-128",
    "name": "Galaxy A15 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Blue Black"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a15-5g.svg",
    "description": "Samsung Galaxy A15 5G with MediaTek Dimensity 6100+, 6.5-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_291",
    "sku": "SP-SAM-SMA065F-64",
    "name": "Galaxy A06 (4G)",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Black"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-a06-4g.svg",
    "description": "Samsung Galaxy A06 (4G) with MediaTek Helio G85, 6.7-inch HD+ PLS LCD, 60Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_292",
    "sku": "SP-SAM-SMM476B-128",
    "name": "Galaxy M47 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Midnight Blue"
    },
    "costPrice": 31159,
    "price": 37999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m47-5g.svg",
    "description": "Samsung Galaxy M47 5G with Exynos 1580, 6.7-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_293",
    "sku": "SP-SAM-SMM175B-128",
    "name": "Galaxy M17e 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Mint Green"
    },
    "costPrice": 10249,
    "price": 12499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m17e-5g.svg",
    "description": "Samsung Galaxy M17e 5G with MediaTek Dimensity 6300, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_294",
    "sku": "SP-SAM-SMM085F-64",
    "name": "Galaxy M08 LTE",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Black"
    },
    "costPrice": 6559,
    "price": 7999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m08-lte.svg",
    "description": "Samsung Galaxy M08 LTE with MediaTek Helio G85, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_295",
    "sku": "SP-SAM-SMM566B-128",
    "name": "Galaxy M56 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Light Green"
    },
    "costPrice": 27879,
    "price": 33999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m56-5g.svg",
    "description": "Samsung Galaxy M56 5G with Exynos 1480, 6.74-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_296",
    "sku": "SP-SAM-SMM366B-128",
    "name": "Galaxy M36 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Velvet Black"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m36-5g.svg",
    "description": "Samsung Galaxy M36 5G with Exynos 1380, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_297",
    "sku": "SP-SAM-SMM176B-128",
    "name": "Galaxy M17 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Mint Green"
    },
    "costPrice": 17219,
    "price": 20999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m17-5g.svg",
    "description": "Samsung Galaxy M17 5G with Exynos 1330, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP OIS + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_298",
    "sku": "SP-SAM-SMM166B-128",
    "name": "Galaxy M16 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Mint Green"
    },
    "costPrice": 9429,
    "price": 11499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m16-5g.svg",
    "description": "Samsung Galaxy M16 5G with MediaTek Dimensity 6300, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_299",
    "sku": "SP-SAM-SMM066B-64",
    "name": "Galaxy M06 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Sage Green"
    },
    "costPrice": 7789,
    "price": 9499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m06-5g.svg",
    "description": "Samsung Galaxy M06 5G with MediaTek Dimensity 6300, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_300",
    "sku": "SP-SAM-SMM556B-128",
    "name": "Galaxy M55 5G / M55s 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Denim Black"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m55-5g-m55s-5g.svg",
    "description": "Samsung Galaxy M55 5G / M55s 5G with Snapdragon 7 Gen 1, 6.7-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_301",
    "sku": "SP-SAM-SMM356B-128",
    "name": "Galaxy M35 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Moonlight Blue"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m35-5g.svg",
    "description": "Samsung Galaxy M35 5G with Exynos 1380, 6.6-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_302",
    "sku": "SP-SAM-SMM156B-128",
    "name": "Galaxy M15 5G / Prime",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Celestial Blue"
    },
    "costPrice": 9019,
    "price": 10999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m15-5g-prime.svg",
    "description": "Samsung Galaxy M15 5G / Prime with MediaTek Dimensity 6100+, 6.5-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_303",
    "sku": "SP-SAM-SMM055F-64",
    "name": "Galaxy M05",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Mint Green"
    },
    "costPrice": 5497,
    "price": 6704,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-m05.svg",
    "description": "Samsung Galaxy M05 with MediaTek Helio G85, 6.7-inch HD+ PLS LCD, 60Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_304",
    "sku": "SP-SAM-SME706B-128",
    "name": "Galaxy F70 Pro 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Luxe Violet"
    },
    "costPrice": 31159,
    "price": 37999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f70-pro-5g.svg",
    "description": "Samsung Galaxy F70 Pro 5G with Exynos 1580, 6.7-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_305",
    "sku": "SP-SAM-SME705B-128",
    "name": "Galaxy F70 / F70e 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Violet"
    },
    "costPrice": 10249,
    "price": 12499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f70-f70e-5g.svg",
    "description": "Samsung Galaxy F70 / F70e 5G with MediaTek Dimensity 6300, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_306",
    "sku": "SP-SAM-SME566B-128",
    "name": "Galaxy F56 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Violet"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f56-5g.svg",
    "description": "Samsung Galaxy F56 5G with Exynos 1480, 6.74-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_307",
    "sku": "SP-SAM-SME366B-128",
    "name": "Galaxy F36 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Luxe Violet"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f36-5g.svg",
    "description": "Samsung Galaxy F36 5G with Exynos 1380, 6.7-inch FHD+ Super AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_308",
    "sku": "SP-SAM-SME166B-128",
    "name": "Galaxy F16 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Bling Black"
    },
    "costPrice": 9429,
    "price": 11499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f16-5g.svg",
    "description": "Samsung Galaxy F16 5G with MediaTek Dimensity 6300, 6.7-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_309",
    "sku": "SP-SAM-SME075F-64",
    "name": "Galaxy F07",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Green"
    },
    "costPrice": 6012,
    "price": 7332,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f07.svg",
    "description": "Samsung Galaxy F07 with MediaTek Helio G85, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_310",
    "sku": "SP-SAM-SME066B-128",
    "name": "Galaxy F06 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Bahama Blue"
    },
    "costPrice": 7789,
    "price": 9499,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f06-5g.svg",
    "description": "Samsung Galaxy F06 5G with MediaTek Dimensity 6300, 6.7-inch HD+ PLS LCD, 90Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_311",
    "sku": "SP-SAM-SME556B-128",
    "name": "Galaxy F55 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Apricot Crush"
    },
    "costPrice": 20499,
    "price": 24999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f55-5g.svg",
    "description": "Samsung Galaxy F55 5G with Snapdragon 7 Gen 1, 6.7-inch FHD+ Super AMOLED+, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_312",
    "sku": "SP-SAM-SME156B-128",
    "name": "Galaxy F15 5G",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Ash Black"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f15-5g.svg",
    "description": "Samsung Galaxy F15 5G with MediaTek Dimensity 6100+, 6.5-inch FHD+ Super AMOLED, 90Hz, 50MP + 5MP Ultrawide + 2MP Macro, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_313",
    "sku": "SP-SAM-SME145F-64",
    "name": "Galaxy F14 (4G)",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Moonlight Silver"
    },
    "costPrice": 7379,
    "price": 8999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f14-4g.svg",
    "description": "Samsung Galaxy F14 (4G) with Snapdragon 680, 6.7-inch FHD+ PLS LCD, 90Hz, 50MP + 2MP Macro + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_314",
    "sku": "SP-SAM-SME055F-64",
    "name": "Galaxy F05",
    "brand": "Samsung",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Twilight Blue"
    },
    "costPrice": 6559,
    "price": 7999,
    "reorderLevel": 10,
    "image": "assets/images/products/galaxy-f05.svg",
    "description": "Samsung Galaxy F05 with MediaTek Helio G85, 6.7-inch HD+ PLS LCD, 60Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_315",
    "sku": "SP-VIV-V2550A-512",
    "name": "Vivo X Fold 6",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Titanium Gray"
    },
    "costPrice": 160473,
    "price": 195699,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x-fold-6.svg",
    "description": "Vivo Vivo X Fold 6 with MediaTek Dimensity 9500, 8.02-inch LTPO AMOLED, 120Hz, 50MP OIS + 50MP Periscope + 50MP Ultrawide, 6900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_316",
    "sku": "SP-VIV-V2540-512",
    "name": "Vivo X300 Ultra 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Phantom Black"
    },
    "costPrice": 131199,
    "price": 159999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x300-ultra-5g.svg",
    "description": "Vivo Vivo X300 Ultra 5G with Snapdragon 8 Elite Gen 5, 6.82-inch QHD+ LTPO AMOLED, 120Hz, 200MP OIS + 200MP Periscope + 50MP Ultrawide, 6600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_317",
    "sku": "SP-VIV-V2514-512",
    "name": "Vivo X300 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Dune Gold"
    },
    "costPrice": 90199,
    "price": 109999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x300-pro-5g.svg",
    "description": "Vivo Vivo X300 Pro 5G with MediaTek Dimensity 9500, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 200MP ZEISS APO Periscope + 50MP Ultrawide, 6510mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_318",
    "sku": "SP-VIV-V2513-256",
    "name": "Vivo X300 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Cosmos Black"
    },
    "costPrice": 62319,
    "price": 75999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x300-5g.svg",
    "description": "Vivo Vivo X300 5G with MediaTek Dimensity 9500, 6.59-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP Periscope + 50MP Ultrawide, 6200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_319",
    "sku": "SP-VIV-V2535-256",
    "name": "Vivo X300 FE 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Graphite Black"
    },
    "costPrice": 72972,
    "price": 88990,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x300-fe-5g.svg",
    "description": "Vivo Vivo X300 FE 5G with Snapdragon 8 Gen 5, 6.31-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_320",
    "sku": "SP-VIV-V2528-256",
    "name": "Vivo X200T 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian Black"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x200t-5g.svg",
    "description": "Vivo Vivo X200T 5G with MediaTek Dimensity 9400+, 6.67-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 50MP Ultrawide, 6200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_321",
    "sku": "SP-VIV-V2413-512",
    "name": "Vivo X200 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Titanium Grey"
    },
    "costPrice": 73799,
    "price": 89999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x200-pro-5g.svg",
    "description": "Vivo Vivo X200 Pro 5G with MediaTek Dimensity 9400, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 200MP ZEISS APO Periscope + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_322",
    "sku": "SP-VIV-V2415-256",
    "name": "Vivo X200 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Natural Green"
    },
    "costPrice": 47559,
    "price": 57999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x200-5g.svg",
    "description": "Vivo Vivo X200 5G with MediaTek Dimensity 9400, 6.67-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Periscope + 50MP Ultrawide, 5800mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_323",
    "sku": "SP-VIV-V2324-512",
    "name": "Vivo X100 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Asteroid Black"
    },
    "costPrice": 61499,
    "price": 74999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x100-pro-5g.svg",
    "description": "Vivo Vivo X100 Pro 5G with MediaTek Dimensity 9300, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP ZEISS APO Periscope + 50MP Ultrawide, 5400mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_324",
    "sku": "SP-VIV-V2309-256",
    "name": "Vivo X100 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Stargaze Blue"
    },
    "costPrice": 40999,
    "price": 49999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-x100-5g.svg",
    "description": "Vivo Vivo X100 5G with MediaTek Dimensity 9300, 6.78-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 64MP Periscope + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_325",
    "sku": "SP-VIV-V2648-128",
    "name": "Vivo V80 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Sunrise Anthem"
    },
    "costPrice": 51659,
    "price": 62999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v80-5g.svg",
    "description": "Vivo Vivo V80 5G with Snapdragon 7 Gen 4, 6.59-inch 1.5K AMOLED, 144Hz, 50MP ZEISS OIS + 50MP Telephoto + 8MP Ultrawide, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_326",
    "sku": "SP-VIV-V2548-256",
    "name": "Vivo V70 Elite 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Authentic Black"
    },
    "costPrice": 54939,
    "price": 66999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v70-elite-5g.svg",
    "description": "Vivo Vivo V70 Elite 5G with Snapdragon 8s Gen 3, 6.59-inch 1.5K OLED, 120Hz, 50MP ZEISS OIS + 50MP Telephoto + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_327",
    "sku": "SP-VIV-V2545-256",
    "name": "Vivo V70 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Passion Red"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v70-5g.svg",
    "description": "Vivo Vivo V70 5G with Snapdragon 7 Gen 4, 6.59-inch 1.5K OLED, 120Hz, 50MP ZEISS OIS + 50MP Telephoto + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_328",
    "sku": "SP-VIV-V2558-128",
    "name": "Vivo V70 FE 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Monsoon Blue"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v70-fe-5g.svg",
    "description": "Vivo Vivo V70 FE 5G with MediaTek Dimensity 7360-Turbo, 6.83-inch 1.5K AMOLED, 120Hz, 200MP OIS + 8MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_329",
    "sku": "SP-VIV-V2511-128",
    "name": "Vivo V60 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Auspicious Gold"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v60-5g.svg",
    "description": "Vivo Vivo V60 5G with Snapdragon 7 Gen 4, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP ZEISS OIS + 50MP Telephoto + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_330",
    "sku": "SP-VIV-V2519-128",
    "name": "Vivo V60e 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Elite Purple"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v60e-5g.svg",
    "description": "Vivo Vivo V60e 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ AMOLED, 120Hz, 200MP OIS + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_331",
    "sku": "SP-VIV-V2427-128",
    "name": "Vivo V50 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Rose Red"
    },
    "costPrice": 27059,
    "price": 32999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v50-5g.svg",
    "description": "Vivo Vivo V50 5G with Snapdragon 7 Gen 3, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP ZEISS OIS + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_332",
    "sku": "SP-VIV-V2428-128",
    "name": "Vivo V50e 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Sapphire Blue"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v50e-5g.svg",
    "description": "Vivo Vivo V50e 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5600mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_333",
    "sku": "SP-VIV-V2347-256",
    "name": "Vivo V40 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Ganges Blue"
    },
    "costPrice": 31107,
    "price": 37935,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v40-pro-5g.svg",
    "description": "Vivo Vivo V40 Pro 5G with MediaTek Dimensity 9200+, 6.78-inch 1.5K Curved AMOLED, 120Hz, 50MP ZEISS OIS + 50MP Telephoto + 50MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_334",
    "sku": "SP-VIV-V2348-128",
    "name": "Vivo V40 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ganges Blue"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v40-5g.svg",
    "description": "Vivo Vivo V40 5G with Snapdragon 7 Gen 3, 6.78-inch 1.5K Curved AMOLED, 120Hz, 50MP ZEISS OIS + 50MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_335",
    "sku": "SP-VIV-V2403-128",
    "name": "Vivo V40e 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Royal Bronze"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-v40e-5g.svg",
    "description": "Vivo Vivo V40e 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_336",
    "sku": "SP-VIV-V2572-256",
    "name": "Vivo T5 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Royal Bronze"
    },
    "costPrice": 36899,
    "price": 44999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t5-5g.svg",
    "description": "Vivo Vivo T5 5G with MediaTek Dimensity 7500 Turbo, 6.83-inch 1.5K Curved AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 7050mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_337",
    "sku": "SP-VIV-V2568-128",
    "name": "Vivo T5 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Cosmic Black"
    },
    "costPrice": 30339,
    "price": 36999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t5-pro-5g.svg",
    "description": "Vivo Vivo T5 Pro 5G with Snapdragon 7s Gen 4, 6.83-inch FHD+ AMOLED, 144Hz, 50MP + 2MP, 9020mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_338",
    "sku": "SP-VIV-V2561-128",
    "name": "Vivo T5x 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Fusion Red"
    },
    "costPrice": 21630,
    "price": 26378,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t5x-5g.svg",
    "description": "Vivo Vivo T5x 5G with MediaTek Dimensity 7400 Turbo, 6.76-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_339",
    "sku": "SP-VIV-V2578-128",
    "name": "Vivo T5 Lite 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Wave Blue"
    },
    "costPrice": 16277,
    "price": 19850,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t5-lite-5g.svg",
    "description": "Vivo Vivo T5 Lite 5G with MediaTek Dimensity 6300, 6.74-inch HD+ IPS LCD, 120Hz, 50MP + 0.08MP, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_340",
    "sku": "SP-VIV-V2581-64",
    "name": "Vivo T5e 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Emerald Green"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t5e-5g.svg",
    "description": "Vivo Vivo T5e 5G with MediaTek Dimensity 6300, 6.74-inch HD+ IPS LCD, 90Hz, 50MP + 2MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_341",
    "sku": "SP-VIV-V2508-256",
    "name": "Vivo T4 Ultra 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Phoenix Gold"
    },
    "costPrice": 29519,
    "price": 35999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t4-ultra-5g.svg",
    "description": "Vivo Vivo T4 Ultra 5G with MediaTek Dimensity 9300+, 6.67-inch 1.5K Curved AMOLED, 120Hz, 50MP OIS + 50MP Periscope + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_342",
    "sku": "SP-VIV-V2502-128",
    "name": "Vivo T4 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Emerald Blaze"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t4-5g.svg",
    "description": "Vivo Vivo T4 5G with Snapdragon 7s Gen 3, 6.77-inch FHD+ Quad-Curved AMOLED, 120Hz, 50MP OIS + 2MP Depth, 7300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_343",
    "sku": "SP-VIV-V2437-128",
    "name": "Vivo T4x 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Glacial Teal"
    },
    "costPrice": 12709,
    "price": 15499,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t4x-5g.svg",
    "description": "Vivo Vivo T4x 5G with MediaTek Dimensity 7300, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_344",
    "sku": "SP-VIV-V2426-128",
    "name": "Vivo T3 Ultra 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Lunar Gray"
    },
    "costPrice": 22959,
    "price": 27999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t3-ultra-5g.svg",
    "description": "Vivo Vivo T3 Ultra 5G with MediaTek Dimensity 9200+, 6.78-inch 1.5K Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_345",
    "sku": "SP-VIV-V2404-128",
    "name": "Vivo T3 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Sandstone Orange"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t3-pro-5g.svg",
    "description": "Vivo Vivo T3 Pro 5G with Snapdragon 7 Gen 3, 6.77-inch FHD+ Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_346",
    "sku": "SP-VIV-V2334-128",
    "name": "Vivo T3 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Cosmic Blue"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t3-5g.svg",
    "description": "Vivo Vivo T3 5G with MediaTek Dimensity 7200, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_347",
    "sku": "SP-VIV-V2338-128",
    "name": "Vivo T3x 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Crimson Bliss"
    },
    "costPrice": 10659,
    "price": 12999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-t3x-5g.svg",
    "description": "Vivo Vivo T3x 5G with Snapdragon 6 Gen 1, 6.72-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_348",
    "sku": "SP-VIV-V2564-256",
    "name": "Vivo Y51 Pro 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Golden Mist"
    },
    "costPrice": 31159,
    "price": 37999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y51-pro-5g.svg",
    "description": "Vivo Vivo Y51 Pro 5G with MediaTek Dimensity 7300, 6.77-inch FHD+ AMOLED, 120Hz, 50MP + 2MP, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_349",
    "sku": "SP-VIV-V2588-128",
    "name": "Vivo Y31T 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Crimson Red"
    },
    "costPrice": 24599,
    "price": 29999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y31t-5g.svg",
    "description": "Vivo Vivo Y31T 5G with Snapdragon 4 Gen 2, 6.77-inch FHD+ IPS LCD, 120Hz, 50MP AI Wide-Angle + 2MP, 7200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_350",
    "sku": "SP-VIV-V2540Y-128",
    "name": "Vivo Y31 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Blush Red"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y31-5g.svg",
    "description": "Vivo Vivo Y31 5G with MediaTek Dimensity 6300, 6.72-inch FHD+ AMOLED, 120Hz, 50MP + 2MP, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_351",
    "sku": "SP-VIV-V2553-128",
    "name": "Vivo Y21 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Straw Gold"
    },
    "costPrice": 18449,
    "price": 22499,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y21-5g.svg",
    "description": "Vivo Vivo Y21 5G with MediaTek Dimensity 6300, 6.74-inch HD+ IPS LCD, 90Hz, 50MP + 0.08MP, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_352",
    "sku": "SP-VIV-V2551-128",
    "name": "Vivo Y11 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Crystal Blue"
    },
    "costPrice": 13939,
    "price": 16999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y11-5g.svg",
    "description": "Vivo Vivo Y11 5G with MediaTek Dimensity 6300, 6.74-inch HD+ IPS LCD, 90Hz, 50MP + 2MP, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_353",
    "sku": "SP-VIV-V2549-64",
    "name": "Vivo Y05",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Starlight Silver"
    },
    "costPrice": 12299,
    "price": 14999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y05.svg",
    "description": "Vivo Vivo Y05 with Unisoc T612, 6.56-inch HD+ IPS LCD, 90Hz, 13MP + 0.08MP, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_354",
    "sku": "SP-VIV-V2518-128",
    "name": "Vivo Y400 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Glacier Blue"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y400-5g.svg",
    "description": "Vivo Vivo Y400 5G with Snapdragon 6 Gen 3, 6.77-inch FHD+ AMOLED, 120Hz, 50MP + 8MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_355",
    "sku": "SP-VIV-V2422-128",
    "name": "Vivo Y300 Plus 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Silk Green"
    },
    "costPrice": 18039,
    "price": 21999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y300-plus-5g.svg",
    "description": "Vivo Vivo Y300 Plus 5G with Snapdragon 695, 6.78-inch FHD+ Curved AMOLED, 120Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_356",
    "sku": "SP-VIV-V2416-128",
    "name": "Vivo Y300 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Emerald Green"
    },
    "costPrice": 16399,
    "price": 19999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y300-5g.svg",
    "description": "Vivo Vivo Y300 5G with Snapdragon 4 Gen 2, 6.67-inch FHD+ AMOLED, 120Hz, 50MP + 2MP Depth, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_357",
    "sku": "SP-VIV-V2420-128",
    "name": "Vivo Y29 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Diamond Black"
    },
    "costPrice": 10635,
    "price": 12969,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y29-5g.svg",
    "description": "Vivo Vivo Y29 5G with MediaTek Dimensity 6300, 6.68-inch HD+ IPS LCD, 120Hz, 50MP + 0.08MP, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_358",
    "sku": "SP-VIV-V2346-128",
    "name": "Vivo Y28s 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Vintage Red"
    },
    "costPrice": 11479,
    "price": 13999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y28s-5g.svg",
    "description": "Vivo Vivo Y28s 5G with MediaTek Dimensity 6300, 6.56-inch HD+ IPS LCD, 90Hz, 50MP + 0.08MP, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_359",
    "sku": "SP-VIV-V2414-64",
    "name": "Vivo Y18i",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Gem Green"
    },
    "costPrice": 6559,
    "price": 7999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-y18i.svg",
    "description": "Vivo Vivo Y18i with Unisoc T612, 6.56-inch HD+ IPS LCD, 90Hz, 13MP + 0.08MP, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_360",
    "sku": "SP-VIV-V2580-128",
    "name": "Vivo S2 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Silk White"
    },
    "costPrice": 31976,
    "price": 38995,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-s2-5g.svg",
    "description": "Vivo Vivo S2 5G with Snapdragon 7 Gen 4, 6.67-inch 1.5K AMOLED, 120Hz, 50MP OIS + 50MP Telephoto + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_361",
    "sku": "SP-VIV-V2592-128",
    "name": "Vivo S2 FE 5G",
    "brand": "Vivo",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ice Blue"
    },
    "costPrice": 31979,
    "price": 38999,
    "reorderLevel": 10,
    "image": "assets/images/products/vivo-s2-fe-5g.svg",
    "description": "Vivo Vivo S2 FE 5G with MediaTek Dimensity 7360, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_362",
    "sku": "SP-XIA-26091PN0-256",
    "name": "Xiaomi 18 Pro Max",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian Black"
    },
    "costPrice": 81999,
    "price": 99999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-18-pro-max.svg",
    "description": "Xiaomi Xiaomi 18 Pro Max with Snapdragon 8 Elite Gen 6, 6.82-inch 2K LTPO AMOLED, 120Hz, 200MP OIS + 200MP Periscope + 50MP Ultrawide, 8500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_363",
    "sku": "SP-XIA-2512BPND-512",
    "name": "Xiaomi 17 Ultra",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Black"
    },
    "costPrice": 103319,
    "price": 125999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-17-ultra.svg",
    "description": "Xiaomi Xiaomi 17 Ultra with Snapdragon 8 Elite Gen 5, 6.9-inch HyperRGB LTPO AMOLED, 120Hz, 50MP 1-inch OIS + 200MP Periscope + 50MP Ultrawide, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_364",
    "sku": "SP-XIA-26051PN6-512",
    "name": "Xiaomi 17T Pro",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Titan Black"
    },
    "costPrice": 63139,
    "price": 76999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-17t-pro.svg",
    "description": "Xiaomi Xiaomi 17T Pro with MediaTek Dimensity 9500, 6.67-inch 1.5K AMOLED, 144Hz, 50MP OIS + 50MP Telephoto + 12MP Ultrawide, 7000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_365",
    "sku": "SP-XIA-26051PN5-256",
    "name": "Xiaomi 17T",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Titan Black"
    },
    "costPrice": 57399,
    "price": 69999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-17t.svg",
    "description": "Xiaomi Xiaomi 17T with MediaTek Dimensity 8500 Ultra, 6.67-inch 1.5K AMOLED, 144Hz, 50MP OIS + 50MP Telephoto + 12MP Ultrawide, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_366",
    "sku": "SP-XIA-25113PN0-256",
    "name": "Xiaomi 17",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 73799,
    "price": 89999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-17.svg",
    "description": "Xiaomi Xiaomi 17 with Snapdragon 8 Elite Gen 5, 6.3-inch CrystalRes LTPO OLED, 120Hz, 50MP OIS + 50MP Telephoto + 50MP Ultrawide, 6330mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_367",
    "sku": "SP-XIA-25010PN3-512",
    "name": "Xiaomi 15 Ultra",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Silver Chrome"
    },
    "costPrice": 81999,
    "price": 99999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-15-ultra.svg",
    "description": "Xiaomi Xiaomi 15 Ultra with Snapdragon 8 Elite, 6.73-inch WQHD+ LTPO AMOLED, 120Hz, 50MP 1-inch OIS + 200MP Periscope + 50MP Telephoto + 50MP Ultrawide, 5410mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_368",
    "sku": "SP-XIA-24129PN7-512",
    "name": "Xiaomi 15",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Black"
    },
    "costPrice": 49199,
    "price": 59999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-15.svg",
    "description": "Xiaomi Xiaomi 15 with Snapdragon 8 Elite, 6.36-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3x) + 50MP Ultrawide, 5240mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_369",
    "sku": "SP-XIA-24030PN6-512",
    "name": "Xiaomi 14 Ultra",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "16GB",
      "color": "Black"
    },
    "costPrice": 73799,
    "price": 89999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-14-ultra.svg",
    "description": "Xiaomi Xiaomi 14 Ultra with Snapdragon 8 Gen 3, 6.73-inch WQHD+ LTPO AMOLED, 120Hz, 50MP 1-inch OIS + 50MP Periscope (5x) + 50MP Telephoto (3.2x) + 50MP Ultrawide, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_370",
    "sku": "SP-XIA-23127PN0-512",
    "name": "Xiaomi 14",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "512GB",
      "ram": "12GB",
      "color": "Jade Green"
    },
    "costPrice": 48625,
    "price": 59299,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-14.svg",
    "description": "Xiaomi Xiaomi 14 with Snapdragon 8 Gen 3, 6.36-inch 1.5K LTPO AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (3.2x) + 50MP Ultrawide, 4610mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_371",
    "sku": "SP-XIA-25053PN0-256",
    "name": "Xiaomi 15 Civi",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Matcha Green"
    },
    "costPrice": 34439,
    "price": 41999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-15-civi.svg",
    "description": "Xiaomi Xiaomi 15 Civi with Snapdragon 8s Gen 4, 6.55-inch 1.5K Quad-Curved AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2x) + 12MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_372",
    "sku": "SP-XIA-24053PY0-256",
    "name": "Xiaomi 14 Civi",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Cruise Blue"
    },
    "costPrice": 32799,
    "price": 39999,
    "reorderLevel": 10,
    "image": "assets/images/products/xiaomi-14-civi.svg",
    "description": "Xiaomi Xiaomi 14 Civi with Snapdragon 8s Gen 3, 6.55-inch 1.5K Quad-Curved AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2x) + 12MP Ultrawide, 4700mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_373",
    "sku": "SP-XIA-26069RT0-256",
    "name": "Redmi Turbo 6 Max",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "12GB",
      "color": "Obsidian Black"
    },
    "costPrice": 40992,
    "price": 49990,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-turbo-6-max.svg",
    "description": "Xiaomi Redmi Turbo 6 Max with MediaTek Dimensity 9500s, 6.83-inch 1.5K AMOLED, 144Hz, 50MP OIS + 8MP Ultrawide, 11000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_374",
    "sku": "SP-XIA-26019RT0-256",
    "name": "Redmi Turbo 5",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Midnight Black"
    },
    "costPrice": 33619,
    "price": 40999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-turbo-5.svg",
    "description": "Xiaomi Redmi Turbo 5 with MediaTek Dimensity 8500 Ultra, 6.59-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 7540mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_375",
    "sku": "SP-XIA-26089RN1-256",
    "name": "Redmi Note 17 Pro Max 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Starlight Black"
    },
    "costPrice": 40828,
    "price": 49790,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-17-pro-max-5g.svg",
    "description": "Xiaomi Redmi Note 17 Pro Max 5G with Snapdragon 6 Gen 5, 6.83-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 10000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_376",
    "sku": "SP-XIA-26089RN1-128",
    "name": "Redmi Note 17 Pro 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Midnight Black"
    },
    "costPrice": 30338,
    "price": 36998,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-17-pro-5g.svg",
    "description": "Xiaomi Redmi Note 17 Pro 5G with Snapdragon 6s Gen 4, 6.78-inch 1.5K AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 9000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_377",
    "sku": "SP-XIA-26089RN1-1",
    "name": "Redmi Note 17 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Onyx Black"
    },
    "costPrice": 22097,
    "price": 26948,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-17-5g.svg",
    "description": "Xiaomi Redmi Note 17 5G with Snapdragon 4 Gen 4, 6.99-inch FHD+ OLED, 120Hz, 50MP OIS + 2MP Depth, 8000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_378",
    "sku": "SP-XIA-25129RN1-256",
    "name": "Redmi Note 15 Pro+ 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "256GB",
      "ram": "8GB",
      "color": "Titan Black"
    },
    "costPrice": 32799,
    "price": 39999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-15-pro-5g.svg",
    "description": "Xiaomi Redmi Note 15 Pro+ 5G with Snapdragon 7s Gen 4, 6.83-inch 1.5K Curved AMOLED, 120Hz, 200MP OIS + 8MP Ultrawide + 2MP Macro, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_379",
    "sku": "SP-XIA-25129RN1-128",
    "name": "Redmi Note 15 Pro 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Carbon Black"
    },
    "costPrice": 26239,
    "price": 31999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-15-pro-5g.svg",
    "description": "Xiaomi Redmi Note 15 Pro 5G with MediaTek Dimensity 7400 Ultra, 6.83-inch 1.5K AMOLED, 120Hz, 200MP OIS + 8MP Ultrawide + 2MP Macro, 6500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_380",
    "sku": "SP-XIA-25129RN1-1",
    "name": "Redmi Note 15 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Midnight Black"
    },
    "costPrice": 23779,
    "price": 28999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-15-5g.svg",
    "description": "Xiaomi Redmi Note 15 5G with Snapdragon 6 Gen 3, 6.77-inch FHD+ Curved AMOLED, 120Hz, 108MP OIS + 8MP Ultrawide, 5520mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_381",
    "sku": "SP-XIA-25129RN1-2",
    "name": "Redmi Note 15 SE 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Graphite Black"
    },
    "costPrice": 21319,
    "price": 25999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-15-se-5g.svg",
    "description": "Xiaomi Redmi Note 15 SE 5G with MediaTek Dimensity 7025 Ultra, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_382",
    "sku": "SP-XIA-24115RA8-128",
    "name": "Redmi Note 14 Pro+ 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Titan Black"
    },
    "costPrice": 22139,
    "price": 26999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-14-pro-5g.svg",
    "description": "Xiaomi Redmi Note 14 Pro+ 5G with Snapdragon 7s Gen 3, 6.67-inch 1.5K Curved AMOLED, 120Hz, 50MP OIS + 50MP Telephoto (2.5x) + 8MP Ultrawide, 6200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_383",
    "sku": "SP-XIA-24090RA2-128",
    "name": "Redmi Note 14 Pro 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "8GB",
      "color": "Ivy Green"
    },
    "costPrice": 18859,
    "price": 22999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-14-pro-5g.svg",
    "description": "Xiaomi Redmi Note 14 Pro 5G with MediaTek Dimensity 7300 Ultra, 6.67-inch 1.5K Curved AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_384",
    "sku": "SP-XIA-24094RAD-128",
    "name": "Redmi Note 14 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Titan Black"
    },
    "costPrice": 14759,
    "price": 17999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-note-14-5g.svg",
    "description": "Xiaomi Redmi Note 14 5G with MediaTek Dimensity 7025 Ultra, 6.67-inch FHD+ AMOLED, 120Hz, 50MP OIS + 8MP Ultrawide + 2MP Macro, 5110mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_385",
    "sku": "SP-XIA-26079RN1-128",
    "name": "Redmi 17 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Midnight Black"
    },
    "costPrice": 19465,
    "price": 23738,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-17-5g.svg",
    "description": "Xiaomi Redmi 17 5G with Snapdragon 4 Gen 5, 6.9-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 7900mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_386",
    "sku": "SP-XIA-26079RN1-1",
    "name": "Redmi 17C 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Starlight Black"
    },
    "costPrice": 17219,
    "price": 20999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-17c-5g.svg",
    "description": "Xiaomi Redmi 17C 5G with MediaTek Dimensity 6300, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_387",
    "sku": "SP-XIA-25119RN1-128",
    "name": "Redmi 16 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Shadow Black"
    },
    "costPrice": 13112,
    "price": 15990,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-16-5g.svg",
    "description": "Xiaomi Redmi 16 5G with Snapdragon 4s Gen 2, 6.9-inch FHD+ IPS LCD, 144Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_388",
    "sku": "SP-XIA-25079RN1-128",
    "name": "Redmi 15 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Midnight Black"
    },
    "costPrice": 15989,
    "price": 19499,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-15-5g.svg",
    "description": "Xiaomi Redmi 15 5G with Snapdragon 6s Gen 3, 6.88-inch FHD+ IPS LCD, 120Hz, 50MP + 2MP Depth, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_389",
    "sku": "SP-XIA-25089RN1-128",
    "name": "Redmi 15C 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 13119,
    "price": 15999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-15c-5g.svg",
    "description": "Xiaomi Redmi 15C 5G with MediaTek Dimensity 6300, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_390",
    "sku": "SP-XIA-25089RN1-1",
    "name": "Redmi 15A 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Obsidian Black"
    },
    "costPrice": 12101,
    "price": 14757,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-15a-5g.svg",
    "description": "Xiaomi Redmi 15A 5G with MediaTek Dimensity 6100+, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 5500mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_391",
    "sku": "SP-XIA-2411DRN4-64",
    "name": "Redmi 14C 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Starlight Blue"
    },
    "costPrice": 8199,
    "price": 9999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-14c-5g.svg",
    "description": "Xiaomi Redmi 14C 5G with Snapdragon 4 Gen 2, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 5160mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_392",
    "sku": "SP-XIA-2406ERN9-128",
    "name": "Redmi 13 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "6GB",
      "color": "Hawaiian Blue"
    },
    "costPrice": 10249,
    "price": 12499,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-13-5g.svg",
    "description": "Xiaomi Redmi 13 5G with Snapdragon 4 Gen 2 AE, 6.79-inch FHD+ IPS LCD, 120Hz, 108MP + 2MP Macro, 5030mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_393",
    "sku": "SP-XIA-26049RN0-128",
    "name": "Redmi A7 Pro 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "128GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 11881,
    "price": 14489,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a7-pro-5g.svg",
    "description": "Xiaomi Redmi A7 Pro 5G with MediaTek Dimensity 6100+, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_394",
    "sku": "SP-XIA-26049RN0-64",
    "name": "Redmi A7 Pro",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Midnight Black"
    },
    "costPrice": 10085,
    "price": 12299,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a7-pro.svg",
    "description": "Xiaomi Redmi A7 Pro with Unisoc T7250, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 6300mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_395",
    "sku": "SP-XIA-26049RN0-1",
    "name": "Redmi A7",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Charcoal Black"
    },
    "costPrice": 9839,
    "price": 11999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a7.svg",
    "description": "Xiaomi Redmi A7 with Unisoc T615, 6.88-inch HD+ IPS LCD, 90Hz, 32MP + Auxiliary Lens, 6000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_396",
    "sku": "SP-XIA-25028RN0-64",
    "name": "Redmi A5",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "3GB",
      "color": "Just Black"
    },
    "costPrice": 5329,
    "price": 6499,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a5.svg",
    "description": "Xiaomi Redmi A5 with Unisoc T7250, 6.88-inch HD+ IPS LCD, 120Hz, 32MP + Auxiliary Lens, 5200mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_397",
    "sku": "SP-XIA-24116RNC-64",
    "name": "Redmi A4 5G",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "4GB",
      "color": "Sparkle Purple"
    },
    "costPrice": 6805,
    "price": 8299,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a4-5g.svg",
    "description": "Xiaomi Redmi A4 5G with Snapdragon 4s Gen 2, 6.88-inch HD+ IPS LCD, 120Hz, 50MP + Auxiliary Lens, 5160mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_398",
    "sku": "SP-XIA-24048RN6-64",
    "name": "Redmi A3X",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "3GB",
      "color": "Midnight Black"
    },
    "costPrice": 5329,
    "price": 6499,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a3x.svg",
    "description": "Xiaomi Redmi A3X with Unisoc T603, 6.71-inch HD+ IPS LCD, 90Hz, 8MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  },
  {
    "id": "prd_399",
    "sku": "SP-XIA-23129RN5-64",
    "name": "Redmi A3",
    "brand": "Xiaomi",
    "category": "smartphone",
    "variant": {
      "storage": "64GB",
      "ram": "3GB",
      "color": "Midnight Black"
    },
    "costPrice": 5739,
    "price": 6999,
    "reorderLevel": 10,
    "image": "assets/images/products/redmi-a3.svg",
    "description": "Xiaomi Redmi A3 with MediaTek Helio G36, 6.71-inch HD+ IPS LCD, 90Hz, 8MP + Auxiliary Lens, 5000mAh battery.",
    "active": true,
    "createdAt": "2025-06-01T00:00:00.000Z",
    "createdBy": "usr_001"
  }
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

    // Build sparse stock ledger
    // HO holds all 399 products; Zones hold all 399; Districts, Taluks, and Stores hold realistic selections.
    const stock = [];
    const physicalByPrd = {};
    PRODUCTS.forEach(function (p) { physicalByPrd[p.id] = 0; });

    const baselineIds = PRODUCTS.slice(0, 15).map(function (p) { return p.id; });

    offices.forEach(function (o, oIdx) {
      if (o.type === 'head') {
        // HO holds all products
        PRODUCTS.forEach(function (p) {
          const qty = 100;
          stock.push({ officeId: o.id, productId: p.id, qty: qty });
          physicalByPrd[p.id] += qty;
        });
      } else if (o.type === 'zone') {
        // Zones hold all products
        PRODUCTS.forEach(function (p) {
          const qty = 25;
          stock.push({ officeId: o.id, productId: p.id, qty: qty });
          physicalByPrd[p.id] += qty;
        });
      } else if (o.type === 'district') {
        // Districts hold baseline 15 products + 10 rotating smartphones
        baselineIds.forEach(function (pId) {
          const qty = 12;
          stock.push({ officeId: o.id, productId: pId, qty: qty });
          physicalByPrd[pId] += qty;
        });
        for (let i = 0; i < 10; i++) {
          const pIdx = 15 + ((oIdx * 7 + i * 13) % (PRODUCTS.length - 15));
          const p = PRODUCTS[pIdx];
          const qty = 8;
          stock.push({ officeId: o.id, productId: p.id, qty: qty });
          physicalByPrd[p.id] += qty;
        }
      } else if (o.type === 'taluk') {
        // Taluks hold baseline 15 products + 5 rotating smartphones
        baselineIds.forEach(function (pId) {
          const qty = 6;
          stock.push({ officeId: o.id, productId: pId, qty: qty });
          physicalByPrd[pId] += qty;
        });
        for (let i = 0; i < 5; i++) {
          const pIdx = 15 + ((oIdx * 11 + i * 17) % (PRODUCTS.length - 15));
          const p = PRODUCTS[pIdx];
          const qty = 4;
          stock.push({ officeId: o.id, productId: p.id, qty: qty });
          physicalByPrd[p.id] += qty;
        }
      } else {
        // Stores
        const isDemoStore = (o.id === 'off_667' || o.id === 'off_668' || o.id === 'off_277');
        baselineIds.forEach(function (pId, pIdx) {
          let qty = isDemoStore ? 10 : ((oIdx * 13 + pIdx * 7) % 11);
          stock.push({ officeId: o.id, productId: pId, qty: qty });
          physicalByPrd[pId] += qty;
        });
        // Each store also stocks 4 rotating smartphones
        for (let i = 0; i < 4; i++) {
          const pIdx = 15 + ((oIdx * 5 + i * 23) % (PRODUCTS.length - 15));
          const p = PRODUCTS[pIdx];
          const qty = isDemoStore ? 5 : ((oIdx * 3 + i * 7) % 6);
          stock.push({ officeId: o.id, productId: p.id, qty: qty });
          physicalByPrd[p.id] += qty;
        }
      }
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

    console.info('[Seed] Karnataka hierarchy loaded successfully: ' + offices.length + ' offices, ' + PRODUCTS.length + ' products, ' + stock.length + ' stock rows.');
  }

  function reseed() {
    storage.clearAll();
    seed();
    window.Stockify.events.emit('data:reseeded');
  }

  window.Stockify.store.seed = { seed, reseed };
})();
