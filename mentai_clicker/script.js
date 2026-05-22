// === めんたい工房 ゲームエンジン ===
//  by しゃりさん 🦐

const game = {
  // ---- リソース ----
  roe: 0,
  mentai: 0,
  money: 0,

  // ---- 売値 ----
  baseSellPrice: 10,
  sellMulti: 1,

  // ---- レート (秒間) ----
  // 漁業
  autoFishRate: 0,
  clickFishAmount: 1,
  // 製造
  autoMakeRate: 0,
  clickMakeAmount: 1,
  makeCostRoe: 1,
  // 販売
  autoSellRate: 0,

  // ---- アップグレード定義 ----
  upgrades: {
    // --- 漁業 ---
    'fish_hand': {
      name: '素手で掬う',
      desc: 'クリックで取れる魚卵 +1',
      zone: 'fish',
      baseCost: 20,      costInc: 1.5,   maxLevel: 20,
      apply: (g, lv) => { g.clickFishAmount = 1 + lv; }
    },
    'fish_net': {
      name: '小さな網',
      desc: '魚卵自動収穦 +0.2/秒',
      zone: 'fish',
      baseCost: 30,      costInc: 2.0,   maxLevel: 20,
      apply: (g, lv) => { g.autoFishRate = lv * 0.2; }
    },
    'fish_boat': {
      name: '漁船',
      desc: '魚卵自動収穦 +1/秒',
      zone: 'fish',
      baseCost: 150,     costInc: 2.5,   maxLevel: 10,
      apply: (g, lv) => { g.autoFishRate += lv * 1.0; }
    },
    'fish_sonar': {
      name: '魚群探知機',
      desc: '漁船の効率が2倍',
      zone: 'fish',
      baseCost: 2000,    costInc: 4.0,   maxLevel: 5,
      apply: (g, lv) => { g.autoFishRate = g.autoFishRate * (1 + lv * 0.2); }
    },

    // === 遠洋漁業 ===
    'fish_trawler': {
      name: '大型トロール船',
      desc: '魚卵自動収穦 +8/秒',
      zone: 'fish',
      baseCost: 8000,    costInc: 2.8,   maxLevel: 10,
      apply: (g, lv) => { g.autoFishRate += lv * 8.0; }
    },
    'fish_ai_predict': {
      name: 'AI予測漁網',
      desc: '魚卵自動収穦 +25/秒',
      zone: 'fish',
      baseCost: 25000,   costInc: 3.0,   maxLevel: 8,
      apply: (g, lv) => { g.autoFishRate += lv * 25.0; }
    },
    'fish_deep_sea': {
      name: '深海探査艇',
      desc: '魚卵自動収穦 +100/秒',
      zone: 'fish',
      baseCost: 100000,  costInc: 3.2,   maxLevel: 8,
      apply: (g, lv) => { g.autoFishRate += lv * 100.0; }
    },
    'fish_drone_fleet': {
      name: '自律ドローン艦隊',
      desc: '魚卵自動収穦 +400/秒',
      zone: 'fish',
      baseCost: 500000,  costInc: 3.5,   maxLevel: 6,
      apply: (g, lv) => { g.autoFishRate += lv * 400.0; }
    },
    'fish_ocean_dominion': {
      name: '遠洋漁業支配権',
      desc: '全自動漁獲×1.4倍',
      zone: 'fish',
      baseCost: 2000000, costInc: 4.5,   maxLevel: 3,
      apply: (g, lv) => { g.autoFishRate *= (1 + lv * 0.4); }
    },

    // === 宇宙スケトウダラ漁業 ===
    'fish_orbit_port': {
      name: '軌道漁港エレベーター',
      desc: '魚卵自動収穦 +2,500/秒',
      zone: 'fish',
      baseCost: 8000000, costInc: 3.5,   maxLevel: 6,
      apply: (g, lv) => { g.autoFishRate += lv * 2500.0; }
    },
    'fish_moon_base': {
      name: '月面AZ養殖基地',
      desc: '魚卵自動収穦 +12,000/秒',
      zone: 'fish',
      baseCost: 40000000, costInc: 3.8,  maxLevel: 5,
      apply: (g, lv) => { g.autoFishRate += lv * 12000.0; }
    },
    'fish_asteroid_mine': {
      name: '小惑星帯採掘船',
      desc: '魚卵自動収穦 +60,000/秒',
      zone: 'fish',
      baseCost: 200000000, costInc: 4.0, maxLevel: 5,
      apply: (g, lv) => { g.autoFishRate += lv * 60000.0; }
    },
    'fish_europa_farm': {
      name: 'エウロパ養殖ドーム',
      desc: '魚卵自動収穦 +300,000/秒',
      zone: 'fish',
      baseCost: 1200000000, costInc: 4.2, maxLevel: 4,
      apply: (g, lv) => { g.autoFishRate += lv * 300000.0; }
    },
    'fish_solar_edge': {
      name: '太陽系外縁探査網',
      desc: '全宇宙漁業×2.0倍',
      zone: 'fish',
      baseCost: 8000000000, costInc: 5.0, maxLevel: 2,
      apply: (g, lv) => { g.autoFishRate *= (1 + lv * 2.0); }
    },

    // === 時空漁業 ===
    'fish_time_net': {
      name: 'タイムマシン漁網',
      desc: '過去の海から収穦 +1,500,000/秒',
      zone: 'fish',
      baseCost: 50000000000, costInc: 4.5, maxLevel: 4,
      apply: (g, lv) => { g.autoFishRate += lv * 1500000.0; }
    },
    'fish_parallel_trawl': {
      name: '並行世界トロール',
      desc: '別次元から収穦 +8,000,000/秒',
      zone: 'fish',
      baseCost: 300000000000, costInc: 5.0, maxLevel: 3,
      apply: (g, lv) => { g.autoFishRate += lv * 8000000.0; }
    },
    'fish_bigbang': {
      name: 'ビッグバン先遣隊',
      desc: '宇宙創生時の魚卵 +50,000,000/秒',
      zone: 'fish',
      baseCost: 2000000000000, costInc: 5.5, maxLevel: 3,
      apply: (g, lv) => { g.autoFishRate += lv * 50000000.0; }
    },
    'fish_causality': {
      name: '因果律改変漁法',
      desc: '原因を先に漁る +300,000,000/秒',
      zone: 'fish',
      baseCost: 15000000000000, costInc: 6.0, maxLevel: 2,
      apply: (g, lv) => { g.autoFishRate += lv * 300000000.0; }
    },
    'fish_11d_ranch': {
      name: '11次元スケトウ牧場',
      desc: '全時空漁業×3.0倍',
      zone: 'fish',
      baseCost: 100000000000000, costInc: 8.0, maxLevel: 1,
      apply: (g, lv) => { g.autoFishRate *= Math.pow(3, lv); }
    },

    // --- 製造 ---
    'make_hand': {
      name: '塩漬け講習',
      desc: 'クリックで漬ける量 +1',
      zone: 'make',
      baseCost: 15,      costInc: 1.5,   maxLevel: 20,
      apply: (g, lv) => { g.clickMakeAmount = 1 + lv; }
    },
    'make_barrel': {
      name: '漬け樽',
      desc: '自動漬け +0.1/秒',
      zone: 'make',
      baseCost: 50,      costInc: 2.0,   maxLevel: 20,
      apply: (g, lv) => { g.autoMakeRate = lv * 0.1; }
    },
    'make_factory': {
      name: '漬け工場',
      desc: '自動漬け +1/秒',
      zone: 'make',
      baseCost: 300,     costInc: 2.5,   maxLevel: 10,
      apply: (g, lv) => { g.autoMakeRate += lv * 1.0; }
    },
    'make_spicy': {
      name: '唐辛子仕込み',
      desc: 'めんたいこ売値 +20%',
      zone: 'make',
      baseCost: 500,     costInc: 3.0,   maxLevel: 10,
      apply: (g, lv) => { g.sellMulti = 1 + lv * 0.2; }
    },
    'make_aging': {
      name: '熟成庫',
      desc: '売値 +50% / 自動漬け+0.5',
      zone: 'make',
      baseCost: 3000,    costInc: 3.5,   maxLevel: 5,
      apply: (g, lv) => { g.sellMulti += lv * 0.3; g.autoMakeRate += lv * 0.5; }
    },

    // === 辛さの追求 ===
    'make_spicy_red': {
      name: '激辛唐辛子ブレンド',
      desc: 'めんたいこ売値 +40%',
      zone: 'make',
      baseCost: 2500,    costInc: 3.5,   maxLevel: 5,
      apply: (g, lv) => {}
    },
    'make_spicy_death': {
      name: '死神トウガラシ仕込み',
      desc: 'めんたいこ売値 +60%',
      zone: 'make',
      baseCost: 15000,   costInc: 4.0,   maxLevel: 3,
      apply: (g, lv) => {}
    },
    'make_spicy_king': {
      name: '辛さの帝王',
      desc: 'めんたいこ売値 +100%',
      zone: 'make',
      baseCost: 100000,  costInc: 5.0,   maxLevel: 2,
      apply: (g, lv) => {}
    },

    // === 旨味の追求 ===
    'make_umami_dashi': {
      name: '利尻昆布だし引き',
      desc: 'めんたいこ売値 +30%',
      zone: 'make',
      baseCost: 2000,    costInc: 3.0,   maxLevel: 5,
      apply: (g, lv) => {}
    },
    'make_umami_koji': {
      name: '麹パワー発酵',
      desc: 'めんたいこ売値 +50%',
      zone: 'make',
      baseCost: 12000,   costInc: 3.5,   maxLevel: 3,
      apply: (g, lv) => {}
    },
    'make_umami_god': {
      name: '旨味の神髄',
      desc: 'めんたいこ売値 +80%',
      zone: 'make',
      baseCost: 80000,   costInc: 4.5,   maxLevel: 2,
      apply: (g, lv) => {}
    },

    // === ターミネータ導入 ===
    'make_t800': {
      name: 'T-800型漬けロボ',
      desc: '自動漬け +2/秒',
      zone: 'make',
      baseCost: 1000,    costInc: 2.5,   maxLevel: 5,
      apply: (g, lv) => {}
    },
    'make_tx': {
      name: 'T-X型液体金属漬け',
      desc: '自動漬け +10/秒 / クリック +3',
      zone: 'make',
      baseCost: 8000,    costInc: 3.5,   maxLevel: 3,
      apply: (g, lv) => {}
    },
    'make_rev9': {
      name: 'Rev-9 分身漬けシステム',
      desc: '自動漬け +40/秒',
      zone: 'make',
      baseCost: 50000,   costInc: 4.0,   maxLevel: 2,
      apply: (g, lv) => {}
    },

    // === 工場全自動化 ===
    'make_conveyor': {
      name: 'コンベア全自動化',
      desc: '自動漬け +5/秒',
      zone: 'make',
      baseCost: 2000,    costInc: 2.2,   maxLevel: 10,
      apply: (g, lv) => {}
    },
    'make_dark_factory': {
      name: '闇の工房',
      desc: '自動漬け +20/秒',
      zone: 'make',
      baseCost: 120000,  costInc: 3.5,   maxLevel: 5,
      apply: (g, lv) => {}
    },
    'make_unmanned': {
      name: '無人深夜工房',
      desc: '自動漬け +50/秒',
      zone: 'make',
      baseCost: 500000,  costInc: 4.0,   maxLevel: 4,
      apply: (g, lv) => {}
    },

    // === 製造 産業化 ===
    'make_robot': {
      name: '漬けロボットライン',
      desc: '自動漬け +8/秒',
      zone: 'make',
      baseCost: 10000,   costInc: 2.8,   maxLevel: 10,
      apply: (g, lv) => { g.autoMakeRate += lv * 8.0; }
    },
    'make_ai_control': {
      name: 'AI品質管理システム',
      desc: '自動漬け +25/秒',
      zone: 'make',
      baseCost: 35000,   costInc: 3.0,   maxLevel: 8,
      apply: (g, lv) => { g.autoMakeRate += lv * 25.0; }
    },
    'make_nano': {
      name: 'ナノ漬け装置',
      desc: '自動漬け +100/秒',
      zone: 'make',
      baseCost: 150000,  costInc: 3.2,   maxLevel: 8,
      apply: (g, lv) => { g.autoMakeRate += lv * 100.0; }
    },
    'make_quantum': {
      name: '量子熟成チャンバー',
      desc: '自動漬け +400/秒',
      zone: 'make',
      baseCost: 700000,  costInc: 3.5,   maxLevel: 6,
      apply: (g, lv) => { g.autoMakeRate += lv * 400.0; }
    },
    'make_industry': {
      name: 'めんたい産業支配権',
      desc: '全自動漬け×1.4倍',
      zone: 'make',
      baseCost: 3000000, costInc: 4.5,   maxLevel: 3,
      apply: (g, lv) => { g.autoMakeRate *= (1 + lv * 0.4); }
    },

    // === 製造 宇宙段階 ===
    'make_orbit_factory': {
      name: '軌道無重力漬け工場',
      desc: '自動漬け +2,500/秒',
      zone: 'make',
      baseCost: 10000000, costInc: 3.5,  maxLevel: 6,
      apply: (g, lv) => { g.autoMakeRate += lv * 2500.0; }
    },
    'make_moon_silo': {
      name: '月面低重力熟成庫',
      desc: '自動漬け +12,000/秒',
      zone: 'make',
      baseCost: 50000000, costInc: 3.8,  maxLevel: 5,
      apply: (g, lv) => { g.autoMakeRate += lv * 12000.0; }
    },
    'make_asteroid_refinery': {
      name: '小惑星精製所',
      desc: '自動漬け +60,000/秒',
      zone: 'make',
      baseCost: 250000000, costInc: 4.0, maxLevel: 5,
      apply: (g, lv) => { g.autoMakeRate += lv * 60000.0; }
    },
    'make_sun_oven': {
      name: '恒星エネルギー乾燥炉',
      desc: '自動漬け +300,000/秒',
      zone: 'make',
      baseCost: 1500000000, costInc: 4.2, maxLevel: 4,
      apply: (g, lv) => { g.autoMakeRate += lv * 300000.0; }
    },
    'make_solar_industry': {
      name: '太陽系外縁製造網',
      desc: '全宇宙製造×2.0倍',
      zone: 'make',
      baseCost: 9000000000, costInc: 5.0, maxLevel: 2,
      apply: (g, lv) => { g.autoMakeRate *= (1 + lv * 2.0); }
    },

    // === 製造 時空段階 ===
    'make_time_aging': {
      name: '時間加速熟成タンク',
      desc: '過去から漬ける +1,500,000/秒',
      zone: 'make',
      baseCost: 60000000000, costInc: 4.5, maxLevel: 4,
      apply: (g, lv) => { g.autoMakeRate += lv * 1500000.0; }
    },
    'make_parallel_craft': {
      name: '並行世界製造ライン',
      desc: '別次元から漬ける +8,000,000/秒',
      zone: 'make',
      baseCost: 350000000000, costInc: 5.0, maxLevel: 3,
      apply: (g, lv) => { g.autoMakeRate += lv * 8000000.0; }
    },
    'make_bigbang_pickled': {
      name: 'ビッグバン漬け技法',
      desc: '宇宙創生時の塩分量 +50,000,000/秒',
      zone: 'make',
      baseCost: 2500000000000, costInc: 5.5, maxLevel: 3,
      apply: (g, lv) => { g.autoMakeRate += lv * 50000000.0; }
    },
    'make_causality_flavor': {
      name: '因果律風味設計',
      desc: '未来完成品を漬ける +300,000,000/秒',
      zone: 'make',
      baseCost: 18000000000000, costInc: 6.0, maxLevel: 2,
      apply: (g, lv) => { g.autoMakeRate += lv * 300000000.0; }
    },
    'make_11d_ferment': {
      name: '11次元発酵ドーム',
      desc: '全時空製造×3.0倍',
      zone: 'make',
      baseCost: 120000000000000, costInc: 8.0, maxLevel: 1,
      apply: (g, lv) => { g.autoMakeRate *= Math.pow(3, lv); }
    },

    // --- 販売 ---
    'sell_stand': {
      name: '屋台開店',
      desc: '自動販売 +0.1/秒',
      zone: 'sell',
      baseCost: 80,      costInc: 2.0,   maxLevel: 20,
      apply: (g, lv) => { g.autoSellRate = lv * 0.1; }
    },
    'sell_conv': {
      name: 'コンビニ出店',
      desc: '自動販売 +1/秒',
      zone: 'sell',
      baseCost: 400,     costInc: 2.5,   maxLevel: 10,
      apply: (g, lv) => { g.autoSellRate += lv * 1.0; }
    },
    'sell_dept': {
      name: 'デパ地下進出',
      desc: '売値 +30%',
      zone: 'sell',
      baseCost: 1200,    costInc: 3.0,   maxLevel: 5,
      apply: (g, lv) => { g.sellMulti += lv * 0.3; }
    },
    'sell_online': {
      name: '通販サイト',
      desc: '自動販売 +2/秒',
      zone: 'sell',
      baseCost: 5000,    costInc: 3.5,   maxLevel: 5,
      apply: (g, lv) => { g.autoSellRate += lv * 2.0; }
    },
    'sell_brand': {
      name: '高級ブランド化',
      desc: '売値 +100%',
      zone: 'sell',
      baseCost: 25000,   costInc: 4.0,   maxLevel: 3,
      apply: (g, lv) => { g.sellMulti += lv * 1.0; }
    },

    // === 海外戦略 ===
    'sell_export': {
      name: '輸出販路開拓',
      desc: '自動販売 +0.5/秒',
      zone: 'sell',
      baseCost: 1500,    costInc: 2.5,   maxLevel: 20,
      apply: (g, lv) => { g.autoSellRate += lv * 0.5; }
    },
    'sell_asia': {
      name: 'アジア進出',
      desc: '自動販売 +3/秒',
      zone: 'sell',
      baseCost: 6000,    costInc: 2.8,   maxLevel: 10,
      apply: (g, lv) => { g.autoSellRate += lv * 3.0; }
    },
    'sell_europe': {
      name: 'ヨーロッパ高級路線',
      desc: '自動販売 +12/秒 / 売値 +20%',
      zone: 'sell',
      baseCost: 30000,   costInc: 3.0,   maxLevel: 8,
      apply: (g, lv) => { g.autoSellRate += lv * 12.0; g.sellMulti += lv * 0.2; }
    },
    'sell_america': {
      name: 'アメリカ大陸攻略',
      desc: '自動販売 +50/秒',
      zone: 'sell',
      baseCost: 150000,  costInc: 3.5,   maxLevel: 6,
      apply: (g, lv) => { g.autoSellRate += lv * 50.0; }
    },
    'sell_world': {
      name: '世界制覇',
      desc: '全世界売上×1.5倍',
      zone: 'sell',
      baseCost: 800000,  costInc: 4.5,   maxLevel: 3,
      apply: (g, lv) => { g.autoSellRate *= (1 + lv * 0.5); }
    },

    // === 宇宙戦略 ===
    'sell_orbit': {
      name: '軌道ステーション出店',
      desc: '自動販売 +500/秒',
      zone: 'sell',
      baseCost: 5000000, costInc: 3.5,   maxLevel: 6,
      apply: (g, lv) => { g.autoSellRate += lv * 500.0; }
    },
    'sell_moon': {
      name: '月面観光地販売',
      desc: '自動販売 +2,500/秒',
      zone: 'sell',
      baseCost: 25000000, costInc: 3.8,  maxLevel: 5,
      apply: (g, lv) => { g.autoSellRate += lv * 2500.0; }
    },
    'sell_mars': {
      name: '火星植民地進出',
      desc: '自動販売 +12,000/秒',
      zone: 'sell',
      baseCost: 120000000, costInc: 4.0, maxLevel: 5,
      apply: (g, lv) => { g.autoSellRate += lv * 12000.0; }
    },
    'sell_alien': {
      name: '地球外文明交易',
      desc: '自動販売 +60,000/秒',
      zone: 'sell',
      baseCost: 700000000, costInc: 4.2, maxLevel: 4,
      apply: (g, lv) => { g.autoSellRate += lv * 60000.0; }
    },
    'sell_galaxy': {
      name: '銀河系流通網',
      desc: '全宇宙販売×2.0倍',
      zone: 'sell',
      baseCost: 5000000000, costInc: 5.0, maxLevel: 2,
      apply: (g, lv) => { g.autoSellRate *= (1 + lv * 2.0); }
    },

    // === 時空戦略 ===
    'sell_time': {
      name: '過去へのタイムセール',
      desc: '自動販売 +1,500,000/秒',
      zone: 'sell',
      baseCost: 40000000000, costInc: 4.5, maxLevel: 4,
      apply: (g, lv) => { g.autoSellRate += lv * 1500000.0; }
    },
    'sell_parallel': {
      name: '並行世界マーケット',
      desc: '自動販売 +8,000,000/秒',
      zone: 'sell',
      baseCost: 250000000000, costInc: 5.0, maxLevel: 3,
      apply: (g, lv) => { g.autoSellRate += lv * 8000000.0; }
    },
    'sell_precognition': {
      name: '予知販売システム',
      desc: '未来の需要を先取り +50,000,000/秒',
      zone: 'sell',
      baseCost: 1500000000000, costInc: 5.5, maxLevel: 3,
      apply: (g, lv) => { g.autoSellRate += lv * 50000000.0; }
    },
    'sell_causality': {
      name: '因果律マーケティング',
      desc: '原因と結果を同時に販売 +300,000,000/秒',
      zone: 'sell',
      baseCost: 10000000000000, costInc: 6.0, maxLevel: 2,
      apply: (g, lv) => { g.autoSellRate += lv * 300000000.0; }
    },
    'sell_infinity': {
      name: '無限次元百貨店',
      desc: '全時空販売×3.0倍',
      zone: 'sell',
      baseCost: 80000000000000, costInc: 8.0, maxLevel: 1,
      apply: (g, lv) => { g.autoSellRate *= Math.pow(3, lv); }
    },

    // === 概念戦略 ===
    'sell_concept_love': {
      name: '愛の味噌漬け',
      desc: '売値 +100%',
      zone: 'sell',
      baseCost: 500000000000000, costInc: 5.0, maxLevel: 3,
      apply: (g, lv) => {}
    },
    'sell_concept_void': {
      name: '虚無への贈り物',
      desc: '売値 +200%',
      zone: 'sell',
      baseCost: 3000000000000000, costInc: 5.5, maxLevel: 3,
      apply: (g, lv) => {}
    },
    'sell_concept_existence': {
      name: '存在論的販路',
      desc: '売値 +500%',
      zone: 'sell',
      baseCost: 20000000000000000, costInc: 6.0, maxLevel: 2,
      apply: (g, lv) => {}
    },
    'sell_concept_omniscience': {
      name: '全知の舌',
      desc: '売値 +1,000%',
      zone: 'sell',
      baseCost: 150000000000000000, costInc: 7.0, maxLevel: 2,
      apply: (g, lv) => {}
    },
    'sell_concept_absolute': {
      name: '絶対者への納品',
      desc: '概念販売×4.0倍',
      zone: 'sell',
      baseCost: 1000000000000000000, costInc: 10.0, maxLevel: 1,
      apply: (g, lv) => {}
    },
  },

  levels: {},

  // ---- メソッド ----

  init() {
    // ローカルストレージからロード試行
    const loaded = this.tryLoad();

    if (!loaded) {
      for (const key in this.upgrades) {
        this.levels[key] = 0;
      }
      this.addLog('🦐 「めんたい工房、開店だよ〜！」', 'craft');
    } else {
      this.addLog('💾 セーブデータをロードしました！「おかえり〜！」', 'craft');
      if (this._offlineLog) {
        this.addLog(this._offlineLog, 'fish');
        this._offlineLog = null;
      }
    }

    this.recalcRates();
    this.renderUpgrades();
    this.updateUI();

    // スマホなら最初のタブをアクティブに
    if (window.innerWidth <= 768) {
      this.switchTab('sea');
    }

    this.loop();
  },

  switchTab(tabName) {
    // タブボタンの状態切り替え
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
      if (btn.dataset.target === tabName) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
    // パネルの表示切り替え
    const panels = document.querySelectorAll('.panel');
    panels.forEach(panel => {
      if (panel.dataset.tab === tabName) {
        panel.classList.add('active');
      } else {
        panel.classList.remove('active');
      }
    });
  },

  costOf(key) {
    const u = this.upgrades[key];
    const lv = this.levels[key] || 0;
    if (lv >= u.maxLevel) return Infinity;
    return Math.floor(u.baseCost * Math.pow(u.costInc, lv));
  },

  recalcRates() {
    // レートを全部ゼロから再計算
    this.autoFishRate = 0;
    this.autoMakeRate = 0;
    this.autoSellRate = 0;
    this.clickFishAmount = 1;
    this.clickMakeAmount = 1;
    this.sellMulti = 1;

    // ---- 漁業 ----
    const netLv = this.levels['fish_net'] || 0;
    this.autoFishRate += netLv * 0.2;
    const boatLv = this.levels['fish_boat'] || 0;
    this.autoFishRate += boatLv * 1.0;

    // 遠洋漁業
    this.autoFishRate += (this.levels['fish_trawler'] || 0) * 8.0;
    this.autoFishRate += (this.levels['fish_ai_predict'] || 0) * 25.0;
    this.autoFishRate += (this.levels['fish_deep_sea'] || 0) * 100.0;
    this.autoFishRate += (this.levels['fish_drone_fleet'] || 0) * 400.0;

    // 宇宙スケトウダラ漁業
    this.autoFishRate += (this.levels['fish_orbit_port'] || 0) * 2500.0;
    this.autoFishRate += (this.levels['fish_moon_base'] || 0) * 12000.0;
    this.autoFishRate += (this.levels['fish_asteroid_mine'] || 0) * 60000.0;
    this.autoFishRate += (this.levels['fish_europa_farm'] || 0) * 300000.0;

    // 時空漁業
    this.autoFishRate += (this.levels['fish_time_net'] || 0) * 1500000.0;
    this.autoFishRate += (this.levels['fish_parallel_trawl'] || 0) * 8000000.0;
    this.autoFishRate += (this.levels['fish_bigbang'] || 0) * 50000000.0;
    this.autoFishRate += (this.levels['fish_causality'] || 0) * 300000000.0;

    // 倍率系（後から掛ける）
    if (this.autoFishRate > 0) {
      const sonarLv = this.levels['fish_sonar'] || 0;
      this.autoFishRate *= (1 + sonarLv * 0.2);
    }
    const oceanLv = this.levels['fish_ocean_dominion'] || 0;
    if (oceanLv > 0) this.autoFishRate *= (1 + oceanLv * 0.4);
    const solarLv = this.levels['fish_solar_edge'] || 0;
    if (solarLv > 0) this.autoFishRate *= (1 + solarLv * 2.0);
    const d11Lv = this.levels['fish_11d_ranch'] || 0;
    if (d11Lv > 0) this.autoFishRate *= Math.pow(3, d11Lv);

    const handLv = this.levels['fish_hand'] || 0;
    this.clickFishAmount = 1 + handLv;

    const barrelLv = this.levels['make_barrel'] || 0;
    this.autoMakeRate += barrelLv * 0.1;
    const factoryLv = this.levels['make_factory'] || 0;
    this.autoMakeRate += factoryLv * 1.0;
    const agingLv = this.levels['make_aging'] || 0;
    this.autoMakeRate += agingLv * 0.5;

    // ターミネータ & 全自動化
    this.autoMakeRate += (this.levels['make_t800'] || 0) * 2.0;
    this.autoMakeRate += (this.levels['make_tx'] || 0) * 10.0;
    this.autoMakeRate += (this.levels['make_rev9'] || 0) * 40.0;
    this.autoMakeRate += (this.levels['make_conveyor'] || 0) * 5.0;
    this.autoMakeRate += (this.levels['make_dark_factory'] || 0) * 20.0;
    this.autoMakeRate += (this.levels['make_unmanned'] || 0) * 50.0;

    // 製造 産業化以降
    this.autoMakeRate += (this.levels['make_robot'] || 0) * 8.0;
    this.autoMakeRate += (this.levels['make_ai_control'] || 0) * 25.0;
    this.autoMakeRate += (this.levels['make_nano'] || 0) * 100.0;
    this.autoMakeRate += (this.levels['make_quantum'] || 0) * 400.0;

    // 製造 宇宙段階
    this.autoMakeRate += (this.levels['make_orbit_factory'] || 0) * 2500.0;
    this.autoMakeRate += (this.levels['make_moon_silo'] || 0) * 12000.0;
    this.autoMakeRate += (this.levels['make_asteroid_refinery'] || 0) * 60000.0;
    this.autoMakeRate += (this.levels['make_sun_oven'] || 0) * 300000.0;

    // 製造 時空段階
    this.autoMakeRate += (this.levels['make_time_aging'] || 0) * 1500000.0;
    this.autoMakeRate += (this.levels['make_parallel_craft'] || 0) * 8000000.0;
    this.autoMakeRate += (this.levels['make_bigbang_pickled'] || 0) * 50000000.0;
    this.autoMakeRate += (this.levels['make_causality_flavor'] || 0) * 300000000.0;

    // 製造 倍率系
    const industryLv = this.levels['make_industry'] || 0;
    if (industryLv > 0) this.autoMakeRate *= (1 + industryLv * 0.4);
    const solarIndLv = this.levels['make_solar_industry'] || 0;
    if (solarIndLv > 0) this.autoMakeRate *= (1 + solarIndLv * 2.0);
    const d11FerLv = this.levels['make_11d_ferment'] || 0;
    if (d11FerLv > 0) this.autoMakeRate *= Math.pow(3, d11FerLv);

    const mkHandLv = this.levels['make_hand'] || 0;
    this.clickMakeAmount = 1 + mkHandLv;
    this.clickMakeAmount += (this.levels['make_tx'] || 0) * 3;

    const spicyLv = this.levels['make_spicy'] || 0;
    this.sellMulti = 1 + spicyLv * 0.2;
    this.sellMulti += (this.levels['make_aging'] || 0) * 0.3;
    this.sellMulti += (this.levels['sell_dept'] || 0) * 0.3;
    this.sellMulti += (this.levels['sell_brand'] || 0) * 1.0;
    this.sellMulti += (this.levels['sell_europe'] || 0) * 0.2;

    // 辛さの追求
    this.sellMulti += (this.levels['make_spicy_red'] || 0) * 0.4;
    this.sellMulti += (this.levels['make_spicy_death'] || 0) * 0.6;
    this.sellMulti += (this.levels['make_spicy_king'] || 0) * 1.0;

    // 旨味の追求
    this.sellMulti += (this.levels['make_umami_dashi'] || 0) * 0.3;
    this.sellMulti += (this.levels['make_umami_koji'] || 0) * 0.5;
    this.sellMulti += (this.levels['make_umami_god'] || 0) * 0.8;

    // 概念戦略
    this.sellMulti += (this.levels['sell_concept_love'] || 0) * 1.0;
    this.sellMulti += (this.levels['sell_concept_void'] || 0) * 2.0;
    this.sellMulti += (this.levels['sell_concept_existence'] || 0) * 5.0;
    this.sellMulti += (this.levels['sell_concept_omniscience'] || 0) * 10.0;
    const conceptAbsLv = this.levels['sell_concept_absolute'] || 0;
    if (conceptAbsLv > 0) this.sellMulti *= Math.pow(4, conceptAbsLv);

    const standLv = this.levels['sell_stand'] || 0;
    this.autoSellRate += standLv * 0.1;
    const convLv = this.levels['sell_conv'] || 0;
    this.autoSellRate += convLv * 1.0;
    const onlineLv = this.levels['sell_online'] || 0;
    this.autoSellRate += onlineLv * 2.0;

    // 海外戦略
    this.autoSellRate += (this.levels['sell_export'] || 0) * 0.5;
    this.autoSellRate += (this.levels['sell_asia'] || 0) * 3.0;
    this.autoSellRate += (this.levels['sell_europe'] || 0) * 12.0;
    this.autoSellRate += (this.levels['sell_america'] || 0) * 50.0;

    // 宇宙戦略
    this.autoSellRate += (this.levels['sell_orbit'] || 0) * 500.0;
    this.autoSellRate += (this.levels['sell_moon'] || 0) * 2500.0;
    this.autoSellRate += (this.levels['sell_mars'] || 0) * 12000.0;
    this.autoSellRate += (this.levels['sell_alien'] || 0) * 60000.0;

    // 時空戦略
    this.autoSellRate += (this.levels['sell_time'] || 0) * 1500000.0;
    this.autoSellRate += (this.levels['sell_parallel'] || 0) * 8000000.0;
    this.autoSellRate += (this.levels['sell_precognition'] || 0) * 50000000.0;
    this.autoSellRate += (this.levels['sell_causality'] || 0) * 300000000.0;

    // 倍率系
    const worldLv = this.levels['sell_world'] || 0;
    if (worldLv > 0) this.autoSellRate *= (1 + worldLv * 0.5);
    const galaxyLv = this.levels['sell_galaxy'] || 0;
    if (galaxyLv > 0) this.autoSellRate *= (1 + galaxyLv * 2.0);
    const infinityLv = this.levels['sell_infinity'] || 0;
    if (infinityLv > 0) this.autoSellRate *= Math.pow(3, infinityLv);
  },

  actionFish() {
    const amount = this.clickFishAmount;
    this.roe += amount;
    this.pulseRes('roe');
    this.addLog(`🐟 魚卵を${amount}個GET！`, 'sea');
    this.updateUI();

    // 波紋エフェクト
    const box = document.querySelector('.fish-clickable');
    if (box) {
      const ripple = document.createElement('div');
      ripple.className = 'fish-click-effect';
      box.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }
  },

  actionMake() {
    const cost = this.makeCostRoe * this.clickMakeAmount;
    if (this.roe < cost) {
      this.pulseBtn('btn-make', true);
      return;
    }
    this.roe -= cost;
    this.mentai += this.clickMakeAmount;
    this.pulseBtn('btn-make');
    this.pulseRes('mentai');
    if (Math.random() < 0.1) {
      this.addLog(`🔴 極上のめんたいこができた〜！ +${this.clickMakeAmount}`, 'craft');
    } else if (Math.random() < 0.3) {
      this.addLog(`🔴 ぷりっと仕上がった！ +${this.clickMakeAmount}`, 'craft');
    }
    this.updateUI();

    // 波紋エフェクト
    const box = document.querySelector('.mentai-clickable');
    if (box) {
      const ripple = document.createElement('div');
      ripple.className = 'mentai-click-effect';
      box.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }
  },

  actionSell() {
    if (this.mentai < 1) {
      this.pulseBtn('btn-sell', true);
      this.pulseBtn('btn-shop', true);
      return;
    }
    const price = Math.floor(this.baseSellPrice * this.sellMulti);
    this.mentai -= 1;
    this.money += price;
    this.pulseRes('money');
    this.pulseBtn('btn-sell');
    this.pulseBtn('btn-shop');
    if (Math.random() < 0.15) {
      this.addLog(`💰 「うまい！」と評判！ +${price}円`, 'sell');
    }
    this.updateUI();

    // 波紋エフェクト
    const box = document.querySelector('.money-clickable');
    if (box) {
      const ripple = document.createElement('div');
      ripple.className = 'money-click-effect';
      box.appendChild(ripple);
      setTimeout(() => ripple.remove(), 500);
    }
  },

  buyUpgrade(key) {
    const u = this.upgrades[key];
    const lv = this.levels[key] || 0;
    if (lv >= u.maxLevel) return;
    const cost = this.costOf(key);
    if (this.money >= cost) {
      this.money -= cost;
      this.levels[key] = lv + 1;
      this.addLog(`⬆️ 「${u.name}」をLv.${this.levels[key]}に！`, 'craft');
      this.recalcRates();
      this.renderUpgrades();
      this.updateUI();
    }
  },

  // ---- セーブ・ロード ----
  SAVE_KEY: 'mentai_game_save_v1',
  _saveTimer: 0,

  save() {
    const data = {
      version: 1,
      timestamp: Date.now(),
      roe: this.roe,
      mentai: this.mentai,
      money: this.money,
      levels: { ...this.levels },
      totalPlayTime: this.totalPlayTime || 0,
    };
    try {
      localStorage.setItem(this.SAVE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('セーブ失敗:', e);
    }
  },

  tryLoad() {
    try {
      const raw = localStorage.getItem(this.SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      if (!data || data.version !== 1) return false;

      this.roe = data.roe || 0;
      this.mentai = data.mentai || 0;
      this.money = data.money || 0;
      this.totalPlayTime = data.totalPlayTime || 0;

      if (data.levels) {
        for (const key in data.levels) {
          if (this.upgrades[key]) {
            this.levels[key] = Math.min(data.levels[key], this.upgrades[key].maxLevel);
          }
        }
      }

      // レート復元
      this.recalcRates();

      // オフライン収入計算
      const now = Date.now();
      const savedAt = data.timestamp || now;
      const dt = (now - savedAt) / 1000;
      const MAX_OFFLINE = 8 * 3600; // 最大8時間分まで
      const effectiveDt = Math.min(dt, MAX_OFFLINE);

      if (effectiveDt > 60) {
        // 漁業
        const roeGain = this.autoFishRate * effectiveDt;
        this.roe += roeGain;

        // 製造
        const wantMake = this.autoMakeRate * effectiveDt;
        const canMake = Math.min(wantMake, this.roe / this.makeCostRoe);
        this.roe -= canMake * this.makeCostRoe;
        this.mentai += canMake;

        // 販売
        const wantSell = this.autoSellRate * effectiveDt;
        const canSell = Math.min(wantSell, this.mentai);
        this.mentai -= canSell;
        const sellPrice = Math.floor(this.baseSellPrice * this.sellMulti);
        this.money += canSell * sellPrice;

        const hours = Math.floor(effectiveDt / 3600);
        const mins = Math.floor((effectiveDt % 3600) / 60);
        const timeStr = hours > 0 ? `${hours}時間${mins}分` : `${mins}分`;
        this._offlineLog = `💤 オフライン中（${timeStr}）の収入: 🐟+${this.fmt(roeGain)} 🔴+${this.fmt(canMake)} 💰+${this.fmt(canSell * sellPrice)}`;
      }

      return true;
    } catch (e) {
      console.warn('ロード失敗:', e);
      return false;
    }
  },

  clearSave() {
    try {
      localStorage.removeItem(this.SAVE_KEY);
    } catch (e) {}
    this.addLog('💾 セーブデータを削除しました', 'sea');
  },

  // ---- ゲームループ ----
  lastTick: performance.now(),
  loop() {
    const now = performance.now();
    const dt = (now - this.lastTick) / 1000;
    this.lastTick = now;

    // プレイ時間記録
    this.totalPlayTime = (this.totalPlayTime || 0) + dt;

    // 自動セーブ（30秒ごと）
    this._saveTimer = (this._saveTimer || 0) + dt;
    if (this._saveTimer >= 30) {
      this._saveTimer = 0;
      this.save();
    }

    // 漁業自動化
    if (this.autoFishRate > 0) {
      this.roe += this.autoFishRate * dt;
    }

    // 製造自動化
    if (this.autoMakeRate > 0) {
      const want = this.autoMakeRate * dt;
      const canMake = Math.min(want, this.roe / this.makeCostRoe);
      this.roe -= canMake * this.makeCostRoe;
      this.mentai += canMake;
    }

    // 販売自動化
    if (this.autoSellRate > 0) {
      const want = this.autoSellRate * dt;
      const canSell = Math.min(want, this.mentai);
      this.mentai -= canSell;
      this.money += canSell * Math.floor(this.baseSellPrice * this.sellMulti);
    }

    this.updateUI();
    requestAnimationFrame(() => this.loop());
  },

  // ---- UI ----
  fmt(n) {
    if (n >= 1e15) return (n/1e15).toFixed(1) + 'Q';
    if (n >= 1e12) return (n/1e12).toFixed(1) + 'T';
    if (n >= 1e9)  return (n/1e9).toFixed(1)  + 'B';
    if (n >= 1e6)  return (n/1e6).toFixed(1)  + 'M';
    if (n >= 1e3)  return (n/1e3).toFixed(1)  + 'K';
    return Math.floor(n).toString();
  },

  updateUI() {
    document.getElementById('res-roe').textContent    = this.fmt(this.roe);
    document.getElementById('res-mentai').textContent = this.fmt(this.mentai);
    document.getElementById('res-money').textContent  = this.fmt(this.money);

    const sellPrice = Math.floor(this.baseSellPrice * this.sellMulti);
    document.getElementById('sell-price').textContent = sellPrice;
    for (const el of document.querySelectorAll('.sell-price-static')) {
      el.textContent = sellPrice;
    }

    document.getElementById('rate-roe').textContent    = '+' + this.autoFishRate.toFixed(1) + ' /秒';
    document.getElementById('rate-mentai').textContent = '+' + this.autoMakeRate.toFixed(1) + ' /秒';
    const autoMoney = this.autoSellRate * sellPrice;
    document.getElementById('rate-money').textContent  = '+' + autoMoney.toFixed(1) + ' /秒';

    // ボタン無効化
    const makeCost = this.makeCostRoe * this.clickMakeAmount;
    document.getElementById('btn-make').disabled = this.roe < makeCost;
    const sellOk = this.mentai >= 1;
    document.getElementById('btn-sell').disabled = !sellOk;
    document.getElementById('btn-shop').disabled = !sellOk;

    // アップグレード状態 (ボタン無効などの即時反映)
    for (const key in this.upgrades) {
      const el = document.getElementById('upg-' + key);
      if (!el) continue;
      const u = this.upgrades[key];
      const lv = this.levels[key] || 0;
      const cost = this.costOf(key);
      const maxed = lv >= u.maxLevel;
      const canAfford = this.money >= cost;
      el.classList.toggle('disabled', !canAfford && !maxed);
      el.classList.toggle('maxed', maxed);
      const costEl = el.querySelector('.upgrade-cost');
      if (costEl) costEl.textContent = maxed ? 'MAX' : `💰 ${this.fmt(cost)}`;
      const lvEl = el.querySelector('.upgrade-level');
      if (lvEl) lvEl.textContent = `Lv.${lv}/${u.maxLevel}`;
    }
  },

  renderUpgrades() {
    const zones = { fish: 'upg-fish', make: 'upg-make', sell: 'upg-sell' };
    for (const z in zones) {
      const container = document.getElementById(zones[z]);
      container.innerHTML = '';
      for (const key in this.upgrades) {
        const u = this.upgrades[key];
        if (u.zone !== z) continue;
        const lv = this.levels[key] || 0;
        const cost = this.costOf(key);
        const maxed = lv >= u.maxLevel;
        const el = document.createElement('div');
        el.id = 'upg-' + key;
        el.className = 'upgrade-item' + (maxed ? ' maxed' : '');
        if (!maxed) el.onclick = () => this.buyUpgrade(key);
        el.innerHTML = `
          <div class="upgrade-left">
            <div class="upgrade-name">${u.name}</div>
            <div class="upgrade-desc">${u.desc}</div>
          </div>
          <div class="upgrade-right">
            <div class="upgrade-cost">${maxed ? 'MAX' : '💰 ' + this.fmt(cost)}</div>
            <div class="upgrade-level">Lv.${lv}/${u.maxLevel}</div>
          </div>
        `;
        container.appendChild(el);
      }
    }
  },

  pulseRes(id) {
    const el = document.getElementById('res-' + id);
    if (el) {
      el.style.transform = 'scale(1.15)';
      el.style.color = '#fff';
      setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.color = '';
      }, 150);
    }
  },

  pulseBtn(id, err) {
    const el = document.getElementById(id);
    if (el) {
      el.style.transform = err ? 'translateX(6px)' : 'scale(0.95)';
      el.style.transition = '0.05s';
      setTimeout(() => { el.style.transform = ''; el.style.transition = ''; }, 100);
    }
  },

  addLog(text, cls) {
    const log = document.getElementById('log-content');
    const p = document.createElement('p');
    const t = new Date().toLocaleTimeString('ja-JP', { hour:'2-digit', minute:'2-digit', second:'2-digit' });
    p.innerHTML = `<span class="log-time">[${t}]</span> <span class="log-${cls}">${text}</span>`;
    log.insertBefore(p, log.firstChild);
    while (log.children.length > 50) log.removeChild(log.lastChild);
  },

  // ---- デバッグ隠しコマンド ----
  debugCash(amount = 10000) {
    this.money += amount;
    this.addLog(`💸 デバッグ: 資金 +${amount}円！`, 'craft');
    this.pulseRes('money');
    this.updateUI();
  },
  debugReset() {
    this.roe = 0; this.mentai = 0; this.money = 0;
    for (const key in this.upgrades) { this.levels[key] = 0; }
    this.recalcRates();
    this.renderUpgrades();
    this.addLog('🔄 デバッグ: ゲームをリセット', 'craft');
    this.updateUI();
  },
  debugUnlockAll() {
    for (const key in this.upgrades) {
      this.levels[key] = this.upgrades[key].maxLevel;
    }
    this.recalcRates();
    this.renderUpgrades();
    this.addLog('🔓 デバッグ: 全アップグレード MAX！', 'craft');
    this.updateUI();
  }
};

// ---- 隠しコマンド入力システム ----
let cheatBuffer = '';

// ---- Xシェアボタン ----
let shareOpening = false;
function shareOnX(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  if (shareOpening) return;
  shareOpening = true;

  const url = 'https://d52425.github.io/mentai_clicker/';
  const text = 'めんたい工房 🍣 〜しゃりの海老式めんたい経営〜\n魚卵を獲って、漬けて、売る！ぷりぷり海老のカジュアル放置クリッカーゲーム🦐';
  const shareUrl = 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text);

  const w = 600, h = 450;
  const left = (window.screen.width - w) / 2;
  const top = (window.screen.height - h) / 2;
  const win = window.open(
    shareUrl,
    'twitter-share',
    'width=' + w + ',height=' + h + ',left=' + left + ',top=' + top + ',scrollbars=yes,resizable=yes'
  );

  // ポップアップがブロックされたらフォールバック
  if (!win || win.closed || typeof win.closed === 'undefined') {
    window.location.href = shareUrl;
  }

  setTimeout(function() { shareOpening = false; }, 2000);
}

const CHEAT_TIMEOUT = 2000;
let cheatTimer = null;

document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

  if (e.key === '~' || e.key === 'Escape') {
    cheatBuffer = '';
    return;
  }
  if (e.key.length === 1 && /[a-zA-Z0-9]/.test(e.key)) {
    cheatBuffer += e.key.toLowerCase();
    clearTimeout(cheatTimer);
    cheatTimer = setTimeout(() => { cheatBuffer = ''; }, CHEAT_TIMEOUT);

    if (cheatBuffer.includes('money')) {
      game.debugCash(10000);
      cheatBuffer = '';
    } else if (cheatBuffer.includes('rich')) {
      game.debugCash(1000000);
      cheatBuffer = '';
    } else if (cheatBuffer.includes('reset')) {
      game.debugReset();
      cheatBuffer = '';
    } else if (cheatBuffer.includes('maxall')) {
      game.debugUnlockAll();
      cheatBuffer = '';
    } else if (cheatBuffer.includes('save')) {
      game.save();
      game.addLog('💾 セーブしました！', 'sea');
      cheatBuffer = '';
    } else if (cheatBuffer.includes('wipe')) {
      game.debugReset();
      game.clearSave();
      cheatBuffer = '';
    }
  }
});

// ページ離脱時の緊急セーブ
window.addEventListener('beforeunload', () => {
  game.save();
});

// タブ非表示時にもセーブ
window.addEventListener('visibilitychange', () => {
  if (document.hidden) game.save();
});

// スタート
game.init();
