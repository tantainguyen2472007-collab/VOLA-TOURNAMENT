export interface WeaponPrice {
  id: string;
  name: string;
  category: "Sidearm" | "SMG" | "Shotgun" | "Rifle" | "Sniper" | "Heavy";
  cost: number;
}

export const WEAPON_PRICES: WeaponPrice[] = [
  // Sidearms
  { id: "classic", name: "Classic", category: "Sidearm", cost: 0 },
  { id: "shorty", name: "Shorty", category: "Sidearm", cost: 300 },
  { id: "frenzy", name: "Frenzy", category: "Sidearm", cost: 450 },
  { id: "ghost", name: "Ghost", category: "Sidearm", cost: 500 },
  { id: "sheriff", name: "Sheriff", category: "Sidearm", cost: 800 },
  // SMGs
  { id: "stinger", name: "Stinger", category: "SMG", cost: 1100 },
  { id: "spectre", name: "Spectre", category: "SMG", cost: 1600 },
  // Shotguns
  { id: "bucky", name: "Bucky", category: "Shotgun", cost: 850 },
  { id: "judge", name: "Judge", category: "Shotgun", cost: 1850 },
  // Rifles
  { id: "bulldog", name: "Bulldog", category: "Rifle", cost: 2050 },
  { id: "guardian", name: "Guardian", category: "Rifle", cost: 2250 },
  { id: "phantom", name: "Phantom", category: "Rifle", cost: 2900 },
  { id: "vandal", name: "Vandal", category: "Rifle", cost: 2900 },
  // Snipers
  { id: "marshal", name: "Marshal", category: "Sniper", cost: 950 },
  { id: "outlaw", name: "Outlaw", category: "Sniper", cost: 2400 },
  { id: "operator", name: "Operator", category: "Sniper", cost: 4700 },
  // Heavy
  { id: "ares", name: "Ares", category: "Heavy", cost: 1600 },
  { id: "odin", name: "Odin", category: "Heavy", cost: 3200 }
];

export const ARMOR_PRICES = [
  { id: "none", name: "Không Giáp", cost: 0, hp: 0 },
  { id: "light", name: "Giáp Nhẹ (Light Shields)", cost: 400, hp: 25 },
  { id: "heavy", name: "Giáp Nặng (Heavy Shields)", cost: 1000, hp: 50 }
];

export interface EconomyRule {
  winReward: number;
  lossStreak1: number;
  lossStreak2: number;
  lossStreak3Plus: number;
  killReward: number;
  spikePlantReward: number; // For attackers when plant succeeds
  maxCredits: number;
}

export const VALORANT_ECONOMY_RULES: EconomyRule = {
  winReward: 3000,
  lossStreak1: 1900,
  lossStreak2: 2400,
  lossStreak3Plus: 2900,
  killReward: 200,
  spikePlantReward: 300,
  maxCredits: 9000
};

export type BuyStrategyType = 
  | "FULL_BUY"
  | "HALF_BUY"
  | "SAVE_ECO"
  | "FORCE_BUY"
  | "BONUS_ROUND"
  | "HERO_BUY";

export interface BuyAdvice {
  strategy: BuyStrategyType;
  title: string;
  badgeColor: string;
  description: string;
  recommendedWeapon: string;
  recommendedShield: string;
  estimatedNextRoundBank: number;
  tacticalTip: string;
}

export function calculateNextRoundCredits(
  currentCredits: number,
  isWin: boolean,
  lossStreak: number, // 0 (if won), 1, 2, 3+
  killsCount: number,
  isSpikePlanted: boolean,
  currentSpend: number
): { remainingAfterBuy: number; earnedThisRound: number; nextRoundTotal: number; minNextRoundTotal: number } {
  const remainingAfterBuy = Math.max(0, currentCredits - currentSpend);

  let roundBonus = 0;
  if (isWin) {
    roundBonus = VALORANT_ECONOMY_RULES.winReward;
  } else {
    if (lossStreak <= 1) roundBonus = VALORANT_ECONOMY_RULES.lossStreak1;
    else if (lossStreak === 2) roundBonus = VALORANT_ECONOMY_RULES.lossStreak2;
    else roundBonus = VALORANT_ECONOMY_RULES.lossStreak3Plus;
  }

  const killsBonus = killsCount * VALORANT_ECONOMY_RULES.killReward;
  const plantBonus = isSpikePlanted ? VALORANT_ECONOMY_RULES.spikePlantReward : 0;

  const earnedThisRound = roundBonus + killsBonus + plantBonus;
  const nextRoundTotal = Math.min(VALORANT_ECONOMY_RULES.maxCredits, remainingAfterBuy + earnedThisRound);

  // Minimum guaranteed next round if you get 0 kills and lose
  const minLossBonus = (lossStreak + 1 >= 3) ? 2900 : (lossStreak + 1 === 2 ? 2400 : 1900);
  const minNextRoundTotal = Math.min(VALORANT_ECONOMY_RULES.maxCredits, remainingAfterBuy + minLossBonus);

  return {
    remainingAfterBuy,
    earnedThisRound,
    nextRoundTotal,
    minNextRoundTotal
  };
}

export function getBuyAdvice(currentBank: number, lossStreak: number, isDefender: boolean, isSecondRoundAfterLoss: boolean): BuyAdvice {
  const fullBuyCost = 3900; // Vandal 2900 + Heavy Shield 1000

  if (isSecondRoundAfterLoss) {
    return {
      strategy: "SAVE_ECO",
      title: "Eco Save (Giữ Tiền cho Round 3)",
      badgeColor: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
      description: "Thua Round 1 (Pistol). Giữ tiền tối đa để Round 3 cả đội có $3900+ Full Buy Vandal/Phantom + Giáp To đối đầu súng SMG của địch.",
      recommendedWeapon: "Classic / Ghost (nếu còn > $2000)",
      recommendedShield: "Không Giáp / Giáp Nhẹ",
      estimatedNextRoundBank: currentBank + (lossStreak >= 2 ? 2400 : 1900),
      tacticalTip: "Đừng Force mua Stinger/Spectre trừ khi cả 5 người cùng đồng thuận Force Buy!"
    };
  }

  if (currentBank >= 4500) {
    return {
      strategy: "FULL_BUY",
      title: "Full Buy (Trang Bị Tối Đa)",
      badgeColor: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
      description: "Ngân sách dồi dào. Mua full vũ khí chính (Vandal/Phantom/Operator) + Giáp Nặng 50HP + Full Kỹ Năng.",
      recommendedWeapon: "Vandal / Phantom / Operator (nếu > $5700)",
      recommendedShield: "Giáp Nặng 50HP ($1000)",
      estimatedNextRoundBank: currentBank - fullBuyCost + 1900,
      tacticalTip: "Nếu thừa nhiều tiền (>$5500), chủ động hỏi và Mua Giúp (Drop súng) cho đồng đội thiếu tiền."
    };
  }

  if (currentBank >= 3300 && currentBank < 4500) {
    return {
      strategy: "HALF_BUY",
      title: "Half Buy / Light Buy (Mua Tiết Kiệm)",
      badgeColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
      description: "Mua vũ khí tầm trung (Bulldog, Guardian, Outlaw, Spectre) hoặc Vandal + Giáp Nhẹ để đảm bảo vòng sau vẫn đủ tiền Full Buy nếu thua.",
      recommendedWeapon: "Bulldog / Guardian / Outlaw / Spectre",
      recommendedShield: "Giáp Nhẹ ($400)",
      estimatedNextRoundBank: currentBank - 2500 + 1900,
      tacticalTip: "Đảm bảo sau khi mua, số tiền còn lại cộng với mức thưởng thua (Loss Bonus) tối thiểu ≥ $3900."
    };
  }

  if (currentBank >= 2000 && currentBank < 3300) {
    return {
      strategy: "SAVE_ECO",
      title: "Save Eco (Tiết Kiệm Toàn Đội)",
      badgeColor: "bg-amber-500/20 text-amber-400 border-amber-500/30",
      description: "Không đủ tiền Full Buy. Giữ tiền và chỉ mua Sheriff hoặc Ghost để có cơ hội tạo đột biến nhưng vẫn giữ tiền vòng sau.",
      recommendedWeapon: "Sheriff ($800) / Ghost ($500) / Shorty ($300)",
      recommendedShield: "Không Giáp",
      estimatedNextRoundBank: currentBank - 800 + (lossStreak >= 2 ? 2400 : 1900),
      tacticalTip: "Đi chung 2-3 người ở góc hẹp để lấy súng sấy của địch (Trade kill)."
    };
  }

  return {
    strategy: "FORCE_BUY",
    title: "Force Buy / Desperate (Quyết Tử)",
    badgeColor: "bg-rose-500/20 text-rose-400 border-rose-500/30",
    description: "Chỉ sử dụng khi đang ở vòng cuối hiệp (Round 12) hoặc Match Point của đối phương, dồn toàn bộ số tiền còn lại!",
    recommendedWeapon: "Spectre / Stinger / Judge / Marshal",
    recommendedShield: "Giáp Nhẹ / Giáp Nặng tùy tiền",
    estimatedNextRoundBank: 0,
    tacticalTip: "Round 12 hoặc khi đối thủ sắp thắng 12 round thì không có lý do gì để Save tiền!"
  };
}
