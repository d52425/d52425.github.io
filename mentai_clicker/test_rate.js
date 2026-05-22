// テスト実行
const game = {
  roe: 0, mentai: 0, money: 0,
  baseSellPrice: 10, sellMulti: 1,
  autoFishRate: 0, clickFishAmount: 1,
  autoMakeRate: 0, clickMakeAmount: 1, makeCostRoe: 1,
  autoSellRate: 0,
  levels: { 'fish_net': 2, 'fish_boat': 1, 'fish_sonar': 0, 'fish_hand': 0, 'make_barrel': 0, 'make_factory': 0, 'make_aging': 0, 'make_hand': 0, 'make_spicy': 0, 'sell_stand': 0, 'sell_conv': 0, 'sell_online': 0, 'sell_dept': 0, 'sell_brand': 0 },
  recalcRates: function() {
    this.autoFishRate = 0;
    this.autoMakeRate = 0;
    this.autoSellRate = 0;
    this.clickFishAmount = 1;
    this.clickMakeAmount = 1;
    this.sellMulti = 1;

    const netLv = this.levels['fish_net'] || 0;
    this.autoFishRate += netLv * 0.2;
    const boatLv = this.levels['fish_boat'] || 0;
    this.autoFishRate += boatLv * 1.0;
    if (this.autoFishRate > 0) {
      const sonarLv = this.levels['fish_sonar'] || 0;
      this.autoFishRate *= (1 + sonarLv * 0.2);
    }
    const handLv = this.levels['fish_hand'] || 0;
    this.clickFishAmount = 1 + handLv;
    const barrelLv = this.levels['make_barrel'] || 0;
    this.autoMakeRate += barrelLv * 0.1;
    const factoryLv = this.levels['make_factory'] || 0;
    this.autoMakeRate += factoryLv * 1.0;
    const agingLv = this.levels['make_aging'] || 0;
    this.autoMakeRate += agingLv * 0.5;
    const mkHandLv = this.levels['make_hand'] || 0;
    this.clickMakeAmount = 1 + mkHandLv;
    const spicyLv = this.levels['make_spicy'] || 0;
    this.sellMulti = 1 + spicyLv * 0.2;
    this.sellMulti += (this.levels['make_aging'] || 0) * 0.3;
    this.sellMulti += (this.levels['sell_dept'] || 0) * 0.3;
    this.sellMulti += (this.levels['sell_brand'] || 0) * 1.0;
    const standLv = this.levels['sell_stand'] || 0;
    this.autoSellRate += standLv * 0.1;
    const convLv = this.levels['sell_conv'] || 0;
    this.autoSellRate += convLv * 1.0;
    const onlineLv = this.levels['sell_online'] || 0;
    this.autoSellRate += onlineLv * 2.0;
  }
};

game.recalcRates();
console.log('fish_net Lv.2 + fish_boat Lv.1 → autoFishRate:', game.autoFishRate);
console.log('Expected: 2*0.2 + 1*1.0 = 1.4');
console.log('Result matches expected:', Math.abs(game.autoFishRate - 1.4) < 0.001);
