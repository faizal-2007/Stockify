// store/seed.js — Demo offices, products, users, stock, movements, sales, targets
(function () {
  'use strict';

  const storage = window.Stockify.store.storage;

  // ─────────────────────────────────────────
  // HELPERS (defined first — used by data literals below)
  // ─────────────────────────────────────────
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
  // OFFICES (1 HO, 3 Zones, 6 Districts, 12 Stores)
  // ─────────────────────────────────────────
  const OFFICES = [
    // Head Office
    { id: 'off_001', code: 'HO-BLR', name: 'Head Office', type: 'head', parentId: null, city: 'Bengaluru', manager: 'Mohammed Faizal', active: true },

    // Zones
    { id: 'off_002', code: 'ZN-SOUTH', name: 'South Zone', type: 'zone', parentId: 'off_001', city: 'Chennai', manager: 'Priya Rajan', active: true },
    { id: 'off_003', code: 'ZN-WEST', name: 'West Zone', type: 'zone', parentId: 'off_001', city: 'Mumbai', manager: 'Rahul Mehta', active: true },
    { id: 'off_004', code: 'ZN-NORTH', name: 'North Zone', type: 'zone', parentId: 'off_001', city: 'Delhi', manager: 'Anjali Singh', active: true },

    // South Districts
    { id: 'off_005', code: 'DS-TN', name: 'Tamil Nadu District', type: 'district', parentId: 'off_002', city: 'Chennai', manager: 'Karthik Suresh', active: true },
    { id: 'off_006', code: 'DS-KA', name: 'Karnataka District', type: 'district', parentId: 'off_002', city: 'Bengaluru', manager: 'Deepa Nair', active: true },

    // West Districts
    { id: 'off_007', code: 'DS-MH', name: 'Maharashtra District', type: 'district', parentId: 'off_003', city: 'Mumbai', manager: 'Suresh Patil', active: true },
    { id: 'off_008', code: 'DS-GJ', name: 'Gujarat District', type: 'district', parentId: 'off_003', city: 'Ahmedabad', manager: 'Neha Shah', active: true },

    // North Districts
    { id: 'off_009', code: 'DS-DL', name: 'Delhi District', type: 'district', parentId: 'off_004', city: 'New Delhi', manager: 'Vikram Sharma', active: true },
    { id: 'off_010', code: 'DS-UP', name: 'UP District', type: 'district', parentId: 'off_004', city: 'Lucknow', manager: 'Pooja Gupta', active: true },

    // Stores — Tamil Nadu
    { id: 'off_011', code: 'ST-CHN1', name: 'Chennai Central', type: 'store', parentId: 'off_005', city: 'Chennai', manager: 'Arjun Kumar', active: true },
    { id: 'off_012', code: 'ST-MDR1', name: 'Madurai Store', type: 'store', parentId: 'off_005', city: 'Madurai', manager: 'Meena Pandian', active: true },

    // Stores — Karnataka
    { id: 'off_013', code: 'ST-BLR1', name: 'Bengaluru MG Road', type: 'store', parentId: 'off_006', city: 'Bengaluru', manager: 'Rohan Gowda', active: true },
    { id: 'off_014', code: 'ST-MYS1', name: 'Mysuru Store', type: 'store', parentId: 'off_006', city: 'Mysuru', manager: 'Lakshmi Reddy', active: true },

    // Stores — Maharashtra
    { id: 'off_015', code: 'ST-MUM1', name: 'Mumbai Bandra', type: 'store', parentId: 'off_007', city: 'Mumbai', manager: 'Nikhil Joshi', active: true },
    { id: 'off_016', code: 'ST-PUN1', name: 'Pune Store', type: 'store', parentId: 'off_007', city: 'Pune', manager: 'Sneha Kulkarni', active: true },

    // Stores — Gujarat
    { id: 'off_017', code: 'ST-AMD1', name: 'Ahmedabad CG Road', type: 'store', parentId: 'off_008', city: 'Ahmedabad', manager: 'Ravi Patel', active: true },
    { id: 'off_018', code: 'ST-SRT1', name: 'Surat Store', type: 'store', parentId: 'off_008', city: 'Surat', manager: 'Hetal Desai', active: true },

    // Stores — Delhi
    { id: 'off_019', code: 'ST-DEL1', name: 'Delhi Connaught Place', type: 'store', parentId: 'off_009', city: 'New Delhi', manager: 'Amit Verma', active: true },
    { id: 'off_020', code: 'ST-GGN1', name: 'Gurgaon Store', type: 'store', parentId: 'off_009', city: 'Gurgaon', manager: 'Priya Kapoor', active: true },

    // Stores — UP
    { id: 'off_021', code: 'ST-LKO1', name: 'Lucknow Store', type: 'store', parentId: 'off_010', city: 'Lucknow', manager: 'Rohit Mishra', active: true },
    { id: 'off_022', code: 'ST-AGR1', name: 'Agra Store', type: 'store', parentId: 'off_010', city: 'Agra', manager: 'Sunita Yadav', active: true },
  ];

  // ─────────────────────────────────────────
  // USERS
  // ─────────────────────────────────────────
  const USERS = [
    { id: 'usr_001', name: 'Mohammed Faizal', role: 'head', officeId: 'off_001', initials: 'MF' },
    { id: 'usr_002', name: 'Priya Rajan', role: 'zone', officeId: 'off_002', initials: 'PR' },
    { id: 'usr_003', name: 'Rahul Mehta', role: 'zone', officeId: 'off_003', initials: 'RM' },
    { id: 'usr_004', name: 'Anjali Singh', role: 'zone', officeId: 'off_004', initials: 'AS' },
    { id: 'usr_005', name: 'Karthik Suresh', role: 'district', officeId: 'off_005', initials: 'KS' },
    { id: 'usr_006', name: 'Deepa Nair', role: 'district', officeId: 'off_006', initials: 'DN' },
    { id: 'usr_007', name: 'Suresh Patil', role: 'district', officeId: 'off_007', initials: 'SP' },
    { id: 'usr_008', name: 'Neha Shah', role: 'district', officeId: 'off_008', initials: 'NS' },
    { id: 'usr_009', name: 'Vikram Sharma', role: 'district', officeId: 'off_009', initials: 'VS' },
    { id: 'usr_010', name: 'Pooja Gupta', role: 'district', officeId: 'off_010', initials: 'PG' },
    { id: 'usr_011', name: 'Arjun Kumar', role: 'store', officeId: 'off_011', initials: 'AK' },
    { id: 'usr_012', name: 'Meena Pandian', role: 'store', officeId: 'off_012', initials: 'MP' },
    // Extra store user (second store user per request)
    { id: 'usr_013', name: 'Rohan Gowda', role: 'store', officeId: 'off_013', initials: 'RG' },
  ];

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
      description: 'Samsung Galaxy Watch 7 with advanced health sensors, BioActive Sensor.',
      active: true, createdAt: ago(320), createdBy: 'usr_001',
    },
    {
      id: 'prd_008', sku: 'SW-GAR-FEN7X-51-SLT', name: 'Garmin Fenix 7X', brand: 'Garmin',
      category: 'smartwatch', variant: { caseSize: '51mm', color: 'Slate Gray' },
      costPrice: 55000, price: 74990, reorderLevel: 4,
      image: 'assets/images/products/garmin-fenix-7x.svg',
      description: 'Garmin Fenix 7X Pro Solar with multi-band GPS, solar charging.',
      active: true, createdAt: ago(290), createdBy: 'usr_001',
    },
    {
      id: 'prd_009', sku: 'SW-FIT-VRS6-40-BLK', name: 'Fitbit Versa 6', brand: 'Fitbit',
      category: 'smartwatch', variant: { caseSize: '40mm', color: 'Black' },
      costPrice: 12000, price: 17999, reorderLevel: 10,
      image: 'assets/images/products/fitbit-versa-6.svg',
      description: 'Fitbit Versa 6 with 6-day battery, built-in GPS, stress management.',
      active: true, createdAt: ago(260), createdBy: 'usr_001',
    },
    {
      id: 'prd_010', sku: 'SW-AMZ-HAL3-44-GRN', name: 'boAt Lunar Pro Max', brand: 'boAt',
      category: 'smartwatch', variant: { caseSize: '44mm', color: 'Forest Green' },
      costPrice: 3500, price: 4999, reorderLevel: 20,
      image: 'assets/images/products/boat-lunar-pro-max.svg',
      description: 'boAt Lunar Pro Max with AMOLED display, 100+ sport modes.',
      active: true, createdAt: ago(220), createdBy: 'usr_001',
    },

    // ── Tablets (5) ──
    {
      id: 'prd_011', sku: 'TB-APL-IPP13-256-SLV', name: 'iPad Pro 13"', brand: 'Apple',
      category: 'tablet', variant: { storage: '256GB', color: 'Silver', ram: '16GB' },
      costPrice: 95000, price: 119900, reorderLevel: 5,
      image: 'assets/images/products/ipad-pro-13.svg',
      description: 'iPad Pro 13-inch with M4 chip, Ultra Retina XDR OLED, Apple Pencil Pro.',
      active: true, createdAt: ago(340), createdBy: 'usr_001',
    },
    {
      id: 'prd_012', sku: 'TB-SAM-TS10-256-GRY', name: 'Samsung Galaxy Tab S10+', brand: 'Samsung',
      category: 'tablet', variant: { storage: '256GB', color: 'Graphite', ram: '12GB' },
      costPrice: 68000, price: 89999, reorderLevel: 6,
      image: 'assets/images/products/samsung-galaxy-tab-s10.svg',
      description: 'Samsung Galaxy Tab S10+ with Dynamic AMOLED 2X, Snapdragon 8 Gen 3.',
      active: true, createdAt: ago(310), createdBy: 'usr_001',
    },
    {
      id: 'prd_013', sku: 'TB-LNV-P12P-128-GRY', name: 'Lenovo Tab P12 Pro', brand: 'Lenovo',
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
  // STOCK (qty per office per product)
  // HO holds the bulk; cascaded down realistically
  // ─────────────────────────────────────────
  // Format: [officeId, productId, qty]
  const STOCK_DATA = [
    // HO stock (buffer)
    ['off_001', 'prd_001', 45], ['off_001', 'prd_002', 38], ['off_001', 'prd_003', 30],
    ['off_001', 'prd_004', 60], ['off_001', 'prd_005', 48], ['off_001', 'prd_006', 20],
    ['off_001', 'prd_007', 35], ['off_001', 'prd_008', 15], ['off_001', 'prd_009', 42],
    ['off_001', 'prd_010', 80], ['off_001', 'prd_011', 18], ['off_001', 'prd_012', 22],
    ['off_001', 'prd_013', 30], ['off_001', 'prd_014', 12], ['off_001', 'prd_015', 55],

    // South Zone
    ['off_002', 'prd_001', 30], ['off_002', 'prd_002', 24], ['off_002', 'prd_003', 18],
    ['off_002', 'prd_004', 40], ['off_002', 'prd_005', 32], ['off_002', 'prd_006', 12],
    ['off_002', 'prd_007', 20], ['off_002', 'prd_008', 8], ['off_002', 'prd_009', 28],
    ['off_002', 'prd_010', 55], ['off_002', 'prd_011', 10], ['off_002', 'prd_012', 14],
    ['off_002', 'prd_013', 20], ['off_002', 'prd_014', 6], ['off_002', 'prd_015', 38],

    // West Zone
    ['off_003', 'prd_001', 28], ['off_003', 'prd_002', 20], ['off_003', 'prd_003', 16],
    ['off_003', 'prd_004', 35], ['off_003', 'prd_005', 28], ['off_003', 'prd_006', 10],
    ['off_003', 'prd_007', 18], ['off_003', 'prd_008', 6], ['off_003', 'prd_009', 24],
    ['off_003', 'prd_010', 48], ['off_003', 'prd_011', 9], ['off_003', 'prd_012', 12],
    ['off_003', 'prd_013', 18], ['off_003', 'prd_014', 5], ['off_003', 'prd_015', 32],

    // North Zone
    ['off_004', 'prd_001', 25], ['off_004', 'prd_002', 18], ['off_004', 'prd_003', 14],
    ['off_004', 'prd_004', 30], ['off_004', 'prd_005', 24], ['off_004', 'prd_006', 8],
    ['off_004', 'prd_007', 15], ['off_004', 'prd_008', 5], ['off_004', 'prd_009', 20],
    ['off_004', 'prd_010', 40], ['off_004', 'prd_011', 7], ['off_004', 'prd_012', 10],
    ['off_004', 'prd_013', 15], ['off_004', 'prd_014', 4], ['off_004', 'prd_015', 28],

    // Tamil Nadu District
    ['off_005', 'prd_001', 15], ['off_005', 'prd_002', 12], ['off_005', 'prd_003', 9],
    ['off_005', 'prd_004', 20], ['off_005', 'prd_005', 16], ['off_005', 'prd_006', 5],
    ['off_005', 'prd_007', 10], ['off_005', 'prd_008', 3], ['off_005', 'prd_009', 14],
    ['off_005', 'prd_010', 28], ['off_005', 'prd_011', 5], ['off_005', 'prd_012', 7],
    ['off_005', 'prd_013', 10], ['off_005', 'prd_014', 3], ['off_005', 'prd_015', 19],

    // Karnataka District
    ['off_006', 'prd_001', 12], ['off_006', 'prd_002', 10], ['off_006', 'prd_003', 8],
    ['off_006', 'prd_004', 18], ['off_006', 'prd_005', 14], ['off_006', 'prd_006', 4],
    ['off_006', 'prd_007', 9], ['off_006', 'prd_008', 2], ['off_006', 'prd_009', 12],
    ['off_006', 'prd_010', 24], ['off_006', 'prd_011', 4], ['off_006', 'prd_012', 6],
    ['off_006', 'prd_013', 9], ['off_006', 'prd_014', 2], ['off_006', 'prd_015', 16],

    // Maharashtra District
    ['off_007', 'prd_001', 14], ['off_007', 'prd_002', 11], ['off_007', 'prd_003', 8],
    ['off_007', 'prd_004', 19], ['off_007', 'prd_005', 15], ['off_007', 'prd_006', 5],
    ['off_007', 'prd_007', 10], ['off_007', 'prd_008', 3], ['off_007', 'prd_009', 13],
    ['off_007', 'prd_010', 26], ['off_007', 'prd_011', 4], ['off_007', 'prd_012', 6],
    ['off_007', 'prd_013', 10], ['off_007', 'prd_014', 2], ['off_007', 'prd_015', 17],

    // Gujarat District
    ['off_008', 'prd_001', 10], ['off_008', 'prd_002', 8], ['off_008', 'prd_003', 6],
    ['off_008', 'prd_004', 14], ['off_008', 'prd_005', 11], ['off_008', 'prd_006', 3],
    ['off_008', 'prd_007', 7], ['off_008', 'prd_008', 2], ['off_008', 'prd_009', 9],
    ['off_008', 'prd_010', 18], ['off_008', 'prd_011', 3], ['off_008', 'prd_012', 4],
    ['off_008', 'prd_013', 7], ['off_008', 'prd_014', 1], ['off_008', 'prd_015', 12],

    // Delhi District
    ['off_009', 'prd_001', 13], ['off_009', 'prd_002', 10], ['off_009', 'prd_003', 7],
    ['off_009', 'prd_004', 18], ['off_009', 'prd_005', 14], ['off_009', 'prd_006', 4],
    ['off_009', 'prd_007', 9], ['off_009', 'prd_008', 3], ['off_009', 'prd_009', 12],
    ['off_009', 'prd_010', 24], ['off_009', 'prd_011', 4], ['off_009', 'prd_012', 5],
    ['off_009', 'prd_013', 9], ['off_009', 'prd_014', 2], ['off_009', 'prd_015', 16],

    // UP District
    ['off_010', 'prd_001', 10], ['off_010', 'prd_002', 7], ['off_010', 'prd_003', 5],
    ['off_010', 'prd_004', 14], ['off_010', 'prd_005', 10], ['off_010', 'prd_006', 3],
    ['off_010', 'prd_007', 6], ['off_010', 'prd_008', 1], ['off_010', 'prd_009', 8],
    ['off_010', 'prd_010', 18], ['off_010', 'prd_011', 2], ['off_010', 'prd_012', 4],
    ['off_010', 'prd_013', 6], ['off_010', 'prd_014', 1], ['off_010', 'prd_015', 12],

    // Stores — lower stock, some low/out situations for alerts
    ['off_011', 'prd_001', 6], ['off_011', 'prd_002', 5], ['off_011', 'prd_003', 4],
    ['off_011', 'prd_004', 10], ['off_011', 'prd_005', 8], ['off_011', 'prd_006', 2],
    ['off_011', 'prd_007', 5], ['off_011', 'prd_008', 1], ['off_011', 'prd_009', 7],
    ['off_011', 'prd_010', 14], ['off_011', 'prd_011', 2], ['off_011', 'prd_012', 3],
    ['off_011', 'prd_013', 5], ['off_011', 'prd_014', 0], ['off_011', 'prd_015', 8],

    ['off_012', 'prd_001', 5], ['off_012', 'prd_002', 4], ['off_012', 'prd_003', 3],
    ['off_012', 'prd_004', 8], ['off_012', 'prd_005', 6], ['off_012', 'prd_006', 1],
    ['off_012', 'prd_007', 3], ['off_012', 'prd_008', 0], ['off_012', 'prd_009', 5],
    ['off_012', 'prd_010', 10], ['off_012', 'prd_011', 1], ['off_012', 'prd_012', 2],
    ['off_012', 'prd_013', 3], ['off_012', 'prd_014', 0], ['off_012', 'prd_015', 6],

    ['off_013', 'prd_001', 7], ['off_013', 'prd_002', 5], ['off_013', 'prd_003', 4],
    ['off_013', 'prd_004', 9], ['off_013', 'prd_005', 7], ['off_013', 'prd_006', 2],
    ['off_013', 'prd_007', 4], ['off_013', 'prd_008', 1], ['off_013', 'prd_009', 6],
    ['off_013', 'prd_010', 12], ['off_013', 'prd_011', 2], ['off_013', 'prd_012', 3],
    ['off_013', 'prd_013', 4], ['off_013', 'prd_014', 1], ['off_013', 'prd_015', 7],

    ['off_014', 'prd_001', 4], ['off_014', 'prd_002', 3], ['off_014', 'prd_003', 2],
    ['off_014', 'prd_004', 6], ['off_014', 'prd_005', 5], ['off_014', 'prd_006', 1],
    ['off_014', 'prd_007', 2], ['off_014', 'prd_008', 0], ['off_014', 'prd_009', 4],
    ['off_014', 'prd_010', 8], ['off_014', 'prd_011', 1], ['off_014', 'prd_012', 2],
    ['off_014', 'prd_013', 2], ['off_014', 'prd_014', 0], ['off_014', 'prd_015', 4],

    ['off_015', 'prd_001', 6], ['off_015', 'prd_002', 5], ['off_015', 'prd_003', 4],
    ['off_015', 'prd_004', 9], ['off_015', 'prd_005', 7], ['off_015', 'prd_006', 2],
    ['off_015', 'prd_007', 5], ['off_015', 'prd_008', 1], ['off_015', 'prd_009', 6],
    ['off_015', 'prd_010', 13], ['off_015', 'prd_011', 2], ['off_015', 'prd_012', 3],
    ['off_015', 'prd_013', 4], ['off_015', 'prd_014', 1], ['off_015', 'prd_015', 7],

    ['off_016', 'prd_001', 5], ['off_016', 'prd_002', 4], ['off_016', 'prd_003', 3],
    ['off_016', 'prd_004', 7], ['off_016', 'prd_005', 5], ['off_016', 'prd_006', 1],
    ['off_016', 'prd_007', 3], ['off_016', 'prd_008', 0], ['off_016', 'prd_009', 4],
    ['off_016', 'prd_010', 9], ['off_016', 'prd_011', 1], ['off_016', 'prd_012', 2],
    ['off_016', 'prd_013', 3], ['off_016', 'prd_014', 0], ['off_016', 'prd_015', 5],

    ['off_017', 'prd_001', 5], ['off_017', 'prd_002', 4], ['off_017', 'prd_003', 3],
    ['off_017', 'prd_004', 7], ['off_017', 'prd_005', 5], ['off_017', 'prd_006', 1],
    ['off_017', 'prd_007', 3], ['off_017', 'prd_008', 1], ['off_017', 'prd_009', 4],
    ['off_017', 'prd_010', 9], ['off_017', 'prd_011', 1], ['off_017', 'prd_012', 2],
    ['off_017', 'prd_013', 3], ['off_017', 'prd_014', 0], ['off_017', 'prd_015', 5],

    ['off_018', 'prd_001', 3], ['off_018', 'prd_002', 2], ['off_018', 'prd_003', 2],
    ['off_018', 'prd_004', 5], ['off_018', 'prd_005', 4], ['off_018', 'prd_006', 1],
    ['off_018', 'prd_007', 2], ['off_018', 'prd_008', 0], ['off_018', 'prd_009', 3],
    ['off_018', 'prd_010', 7], ['off_018', 'prd_011', 1], ['off_018', 'prd_012', 1],
    ['off_018', 'prd_013', 2], ['off_018', 'prd_014', 0], ['off_018', 'prd_015', 3],

    ['off_019', 'prd_001', 6], ['off_019', 'prd_002', 5], ['off_019', 'prd_003', 4],
    ['off_019', 'prd_004', 9], ['off_019', 'prd_005', 7], ['off_019', 'prd_006', 2],
    ['off_019', 'prd_007', 5], ['off_019', 'prd_008', 1], ['off_019', 'prd_009', 6],
    ['off_019', 'prd_010', 12], ['off_019', 'prd_011', 2], ['off_019', 'prd_012', 3],
    ['off_019', 'prd_013', 4], ['off_019', 'prd_014', 1], ['off_019', 'prd_015', 7],

    ['off_020', 'prd_001', 5], ['off_020', 'prd_002', 4], ['off_020', 'prd_003', 3],
    ['off_020', 'prd_004', 7], ['off_020', 'prd_005', 5], ['off_020', 'prd_006', 1],
    ['off_020', 'prd_007', 3], ['off_020', 'prd_008', 1], ['off_020', 'prd_009', 4],
    ['off_020', 'prd_010', 9], ['off_020', 'prd_011', 1], ['off_020', 'prd_012', 2],
    ['off_020', 'prd_013', 3], ['off_020', 'prd_014', 0], ['off_020', 'prd_015', 5],

    ['off_021', 'prd_001', 4], ['off_021', 'prd_002', 3], ['off_021', 'prd_003', 2],
    ['off_021', 'prd_004', 6], ['off_021', 'prd_005', 4], ['off_021', 'prd_006', 1],
    ['off_021', 'prd_007', 2], ['off_021', 'prd_008', 0], ['off_021', 'prd_009', 3],
    ['off_021', 'prd_010', 7], ['off_021', 'prd_011', 1], ['off_021', 'prd_012', 1],
    ['off_021', 'prd_013', 2], ['off_021', 'prd_014', 0], ['off_021', 'prd_015', 4],

    ['off_022', 'prd_001', 3], ['off_022', 'prd_002', 2], ['off_022', 'prd_003', 2],
    ['off_022', 'prd_004', 5], ['off_022', 'prd_005', 3], ['off_022', 'prd_006', 1],
    ['off_022', 'prd_007', 2], ['off_022', 'prd_008', 0], ['off_022', 'prd_009', 3],
    ['off_022', 'prd_010', 6], ['off_022', 'prd_011', 1], ['off_022', 'prd_012', 1],
    ['off_022', 'prd_013', 2], ['off_022', 'prd_014', 0], ['off_022', 'prd_015', 3],
  ];

  // Store IDs for generating sales/movements
  const STORE_IDS = [
    'off_011', 'off_012', 'off_013', 'off_014', 'off_015',
    'off_016', 'off_017', 'off_018', 'off_019', 'off_020', 'off_021', 'off_022',
  ];

  const PRODUCT_IDS = PRODUCTS.map(function (p) { return p.id; });

  // ─────────────────────────────────────────
  // MOVEMENTS (12 months of history)
  // ─────────────────────────────────────────
  function generateMovements() {
    const movements = [];
    let movCount = 1;
    function movId() { return 'mov_' + String(movCount++).padStart(5, '0'); }

    // Initial stock-in at HO (12 months ago)
    PRODUCTS.forEach(function (p) {
      movements.push({
        id: movId(), at: ago(365), type: 'stock_in',
        productId: p.id, qty: 500, fromId: null, toId: 'off_001',
        refType: 'manual', refId: null, by: 'usr_001',
      });
    });

    // Monthly allocation events (simplified)
    const months = [11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
    months.forEach(function (m) {
      const prdSample = PRODUCT_IDS.slice(0, 5); // 5 products per month
      prdSample.forEach(function (pId) {
        // HO → Zone dispatch
        ['off_002', 'off_003', 'off_004'].forEach(function (zId) {
          movements.push({
            id: movId(), at: ago(m * 30 + 2), type: 'dispatch',
            productId: pId, qty: randInt(10, 25),
            fromId: 'off_001', toId: zId,
            refType: 'allocation', refId: null, by: 'usr_001',
          });
          movements.push({
            id: movId(), at: ago(m * 30 + 1), type: 'receive',
            productId: pId, qty: randInt(10, 25),
            fromId: 'off_001', toId: zId,
            refType: 'allocation', refId: null, by: 'usr_002',
          });
        });
      });
    });

    return movements;
  }

  // ─────────────────────────────────────────
  // SALES (last 12 months)
  // ─────────────────────────────────────────
  function generateSales() {
    const sales = [];
    let saleCount = 1;
    function saleId() { return 'sal_' + String(saleCount++).padStart(4, '0'); }

    const payments = ['cash', 'upi', 'card'];
    const userMap = {
      'off_011': 'usr_011', 'off_012': 'usr_012', 'off_013': 'usr_013',
      'off_014': 'usr_013', 'off_015': 'usr_011', 'off_016': 'usr_012',
      'off_017': 'usr_013', 'off_018': 'usr_011', 'off_019': 'usr_012',
      'off_020': 'usr_013', 'off_021': 'usr_011', 'off_022': 'usr_012',
    };

    // Higher sales for top products
    const popularPrds = ['prd_001', 'prd_002', 'prd_004', 'prd_010', 'prd_006'];

    for (let monthsAgo = 11; monthsAgo >= 0; monthsAgo--) {
      STORE_IDS.forEach(function (storeId) {
        // 8-20 sales per store per month
        const count = randInt(8, 20);
        for (let i = 0; i < count; i++) {
          const pId = monthsAgo < 3
            ? pick(popularPrds)         // recent months favor popular products
            : pick(PRODUCT_IDS);
          const prd = PRODUCTS.find(function (p) { return p.id === pId; });
          const daysOffset = randInt(0, 28);
          const totalDaysAgo = monthsAgo * 30 + daysOffset;
          sales.push({
            id: saleId(),
            storeId: storeId,
            productId: pId,
            qty: randInt(1, 3),
            unitPrice: prd.price,
            payment: pick(payments),
            customer: { name: '', phone: '' },
            type: 'sale',
            at: ago(totalDaysAgo),
            by: userMap[storeId] || 'usr_011',
          });
        }
      });
    }
    return sales;
  }

  // ─────────────────────────────────────────
  // TARGETS (current month per store)
  // ─────────────────────────────────────────
  function generateTargets() {
    const now = new Date();
    const month = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');
    return STORE_IDS.map(function (storeId) {
      return { storeId: storeId, month: month, amount: randInt(400000, 1200000) };
    });
  }

  // ─────────────────────────────────────────
  // SEED FUNCTION
  // ─────────────────────────────────────────
  /**
   * Write all seed data to storage. Called only if not already seeded.
   */
  function seed() {
    // Reset counters to avoid conflicts
    storage.set('counters', {
      user: USERS.length,
      office: OFFICES.length,
      product: PRODUCTS.length,
      allocation: 0,
      movement: 0,
      sale: 0,
    });

    storage.set('offices', OFFICES);
    storage.set('users', USERS);
    storage.set('products', PRODUCTS);

    // Build stock array from STOCK_DATA
    const stock = STOCK_DATA.map(function (row) {
      return { officeId: row[0], productId: row[1], qty: row[2] };
    });
    storage.set('stock', stock);

    // Seed a realistic mix of initial allocations (Reconciled with movements & stock)
    const seedAllocations = [
      // 1. Received allocation (Past completed push HO -> South Zone)
      {
        id: 'alc_0001',
        code: 'ALC-0001',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_002',
        status: 'received',
        items: [
          { productId: 'prd_001', qtyRequested: 20, qtyDispatched: 20, qtyReceived: 20 },
          { productId: 'prd_002', qtyRequested: 15, qtyDispatched: 15, qtyReceived: 15 }
        ],
        note: 'Monthly regular replenishment consignment.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(25),
        timeline: [
          { status: 'dispatched', at: ago(25), by: 'usr_001', note: 'Dispatched from Head Office' },
          { status: 'received', at: ago(23), by: 'usr_002', note: 'Verified and received in full at South Zone' }
        ]
      },
      // 2. Active in-transit allocation (Dispatched HO -> West Zone, 2 days ago)
      {
        id: 'alc_0002',
        code: 'ALC-0002',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_003',
        status: 'dispatched',
        items: [
          { productId: 'prd_004', qtyRequested: 10, qtyDispatched: 10, qtyReceived: 0 },
          { productId: 'prd_006', qtyRequested: 5, qtyDispatched: 5, qtyReceived: 0 }
        ],
        note: 'New launch units allocation.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(2),
        timeline: [
          { status: 'dispatched', at: ago(2), by: 'usr_001', note: 'Dispatched from Head Office' }
        ]
      },
      // 3. Overdue in-transit allocation (Dispatched HO -> North Zone, 8 days ago > 5 days threshold)
      {
        id: 'alc_0003',
        code: 'ALC-0003',
        type: 'push',
        fromId: 'off_001',
        toId: 'off_004',
        status: 'dispatched',
        items: [
          { productId: 'prd_011', qtyRequested: 6, qtyDispatched: 6, qtyReceived: 0 }
        ],
        note: 'High-priority tablets for corporate demo.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_001',
        createdAt: ago(8),
        timeline: [
          { status: 'dispatched', at: ago(8), by: 'usr_001', note: 'Dispatched from Head Office' }
        ]
      },
      // 4. Pending stock request (Requested by Chennai Central store off_011 -> Tamil Nadu district off_005)
      {
        id: 'alc_0004',
        code: 'ALC-0004',
        type: 'request',
        fromId: 'off_005',
        toId: 'off_011',
        status: 'requested',
        items: [
          { productId: 'prd_007', qtyRequested: 8, qtyDispatched: 0, qtyReceived: 0 },
          { productId: 'prd_009', qtyRequested: 10, qtyDispatched: 0, qtyReceived: 0 }
        ],
        note: 'Customer pre-orders surge at Chennai Central store.',
        discrepancyNote: '',
        hasDiscrepancy: false,
        discrepancyAcknowledged: false,
        createdBy: 'usr_011',
        createdAt: ago(1),
        timeline: [
          { status: 'requested', at: ago(1), by: 'usr_011', note: 'Stock request submitted by store' }
        ]
      },
      // 5. Allocation with delivery discrepancy (Received with shortfall: dispatched 10, received 8, 2 missing)
      {
        id: 'alc_0005',
        code: 'ALC-0005',
        type: 'push',
        fromId: 'off_005',
        toId: 'off_012',
        status: 'received',
        items: [
          { productId: 'prd_010', qtyRequested: 10, qtyDispatched: 10, qtyReceived: 8 }
        ],
        note: 'Stock transfer to Madurai store.',
        discrepancyNote: 'Carton arrived damaged; 2 units broken in transit.',
        hasDiscrepancy: true,
        discrepancyAcknowledged: false,
        createdBy: 'usr_005',
        createdAt: ago(4),
        timeline: [
          { status: 'dispatched', at: ago(4), by: 'usr_005', note: 'Dispatched from Tamil Nadu District' },
          { status: 'received', at: ago(3), by: 'usr_012', note: 'Received with discrepancy: Carton arrived damaged; 2 units broken in transit.' }
        ]
      }
    ];

    storage.set('allocations', seedAllocations);
    storage.set('counters', {
      user: USERS.length,
      office: OFFICES.length,
      product: PRODUCTS.length,
      allocation: seedAllocations.length,
      movement: 0,
      sale: 0,
    });

    // Generate movements and sales
    storage.set('movements', generateMovements());
    storage.set('sales', generateSales());
    storage.set('targets', generateTargets());

    // Settings defaults
    storage.set('settings', {
      theme: 'light',
      reorderDefault: 10,
      transitDaysThreshold: 5,
    });

    // Session starts empty (requires login)
    storage.remove('session');

    // Mark as seeded
    storage.markSeeded();

    console.info('[Seed] Demo data loaded successfully.');
  }

  /**
   * Re-seed: clear everything and seed fresh.
   */
  function reseed() {
    storage.clearAll();
    seed();
    window.Stockify.events.emit('data:reseeded');
  }

  window.Stockify.store.seed = { seed, reseed };
})();