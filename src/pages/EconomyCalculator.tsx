import { useState } from "react";
import { 
  Calculator, 
  Coins, 
  Shield, 
  Crosshair, 
  ArrowRight, 
  Users, 
  Lightbulb, 
  TrendingUp, 
  HelpCircle,
  Sparkles,
  ShoppingBag,
  RefreshCw
} from "lucide-react";
import { 
  WEAPON_PRICES, 
  ARMOR_PRICES, 
  calculateNextRoundCredits, 
  getBuyAdvice, 
  VALORANT_ECONOMY_RULES 
} from "../data/economy";
import { sound } from "../lib/sounds";

export function EconomyCalculator() {
  // Individual Calculator State
  const [currentCredits, setCurrentCredits] = useState<number>(3900);
  const [isWin, setIsWin] = useState<boolean>(true);
  const [lossStreak, setLossStreak] = useState<number>(1);
  const [kills, setKills] = useState<number>(1);
  const [isSpikePlanted, setIsSpikePlanted] = useState<boolean>(false);

  // Cart / Spending
  const [selectedWeaponId, setSelectedWeaponId] = useState<string>("vandal");
  const [selectedArmorId, setSelectedArmorId] = useState<string>("heavy");
  const [abilitySpend, setAbilitySpend] = useState<number>(300);

  // Team 5-man planner state
  const [teamCredits, setTeamCredits] = useState<number[]>([4500, 3900, 2100, 5200, 1800]);

  const selectedWeapon = WEAPON_PRICES.find(w => w.id === selectedWeaponId) || WEAPON_PRICES[11];
  const selectedArmor = ARMOR_PRICES.find(a => a.id === selectedArmorId) || ARMOR_PRICES[2];
  const totalSpend = selectedWeapon.cost + selectedArmor.cost + abilitySpend;

  const calculation = calculateNextRoundCredits(
    currentCredits,
    isWin,
    lossStreak,
    kills,
    isSpikePlanted,
    totalSpend
  );

  const advice = getBuyAdvice(currentCredits, lossStreak, false, false);

  // 5-man Team Economy stats
  const teamTotalCredits = teamCredits.reduce((acc, c) => acc + c, 0);
  const teamAverage = Math.round(teamTotalCredits / 5);
  const canTeamFullBuy = teamCredits.filter(c => c >= 3900).length >= 4;

  const updatePlayerCredit = (index: number, val: number) => {
    const next = [...teamCredits];
    next[index] = Math.max(0, Math.min(9000, val));
    setTeamCredits(next);
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-cyan-500/20 text-cyan-400 rounded-lg border border-cyan-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white">
              BỘ ĐẾM KINH TẾ & QUẢN LÝ TIỀN TỆ
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Mô phỏng ngân sách từng vòng đấu, chuỗi thua (Loss streak), tư vấn chiến thuật Full Buy / Eco và tính toán Drop súng toàn đội.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs flex items-center gap-2">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-gray-400">Giới hạn tối đa:</span>
            <span className="font-bold font-mono text-white">$9,000</span>
          </div>
        </div>
      </div>

      {/* Main Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
        {/* Left Column: Interactive Calculator & Buy Planner */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {/* Card 1: Round Parameters */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display tracking-wider text-lg text-white flex items-center gap-2">
                <Coins className="w-5 h-5 text-amber-400" />
                1. THIẾT LẬP VÒNG ĐẤU HIỆN TẠI
              </h2>
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentCredits(3900);
                  setIsWin(true);
                  setKills(1);
                }}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Đặt lại
              </button>
            </div>

            {/* Current Credits Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs text-gray-300 font-bold uppercase">Số Tiền Hiện Có (Current Bank)</label>
                <span className="text-2xl font-black font-mono text-emerald-400">${currentCredits}</span>
              </div>
              <input
                type="range"
                min="0"
                max="9000"
                step="50"
                value={currentCredits}
                onChange={(e) => setCurrentCredits(parseInt(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex gap-2 mt-2">
                {[800, 2000, 3900, 4500, 6000, 9000].map((quickVal) => (
                  <button
                    key={quickVal}
                    onClick={() => { sound.playClick(); setCurrentCredits(quickVal); }}
                    className="flex-1 py-1 text-[11px] font-mono bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                  >
                    ${quickVal}
                  </button>
                ))}
              </div>
            </div>

            {/* Round Outcome Selector */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-300 font-bold uppercase block mb-2">Kết Quả Vòng Đấu</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { sound.playClick(); setIsWin(true); }}
                    className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      isWin ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    🏆 Thắng (+$3000)
                  </button>
                  <button
                    onClick={() => { sound.playClick(); setIsWin(false); }}
                    className={`py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                      !isWin ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30" : "bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    💀 Thua (Bonus)
                  </button>
                </div>
              </div>

              {/* Loss Streak (Only when loss) */}
              <div>
                <label className="text-xs text-gray-300 font-bold uppercase block mb-2">
                  {isWin ? "Chuỗi Thua Trước Đó" : "Mức Chuỗi Thua (Loss Streak)"}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { streak: 1, label: "Thua 1 (+$1900)" },
                    { streak: 2, label: "Thua 2 (+$2400)" },
                    { streak: 3, label: "Thua 3+ (+$2900)" }
                  ].map((s) => (
                    <button
                      key={s.streak}
                      disabled={isWin}
                      onClick={() => { sound.playClick(); setLossStreak(s.streak); }}
                      className={`py-2 px-1 text-[10px] rounded-xl font-bold uppercase transition-all ${
                        !isWin && lossStreak === s.streak
                          ? "bg-amber-600 text-white shadow-md shadow-amber-600/30"
                          : "bg-white/5 text-gray-400 disabled:opacity-40"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Kills & Spike Plant Bonus */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-white/5">
              <div>
                <label className="text-xs text-gray-300 font-bold uppercase block mb-2">Số Mạng Hạ Gục (+$200/Kill)</label>
                <div className="flex gap-1.5">
                  {[0, 1, 2, 3, 4, 5].map((k) => (
                    <button
                      key={k}
                      onClick={() => { sound.playClick(); setKills(k); }}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                        kills === k ? "bg-cyan-600 text-white" : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {k} {k > 0 ? `(+$${k * 200})` : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold uppercase block mb-2">Spike (Phe Tấn Công)</label>
                <button
                  onClick={() => { sound.playClick(); setIsSpikePlanted(!isSpikePlanted); }}
                  className={`w-full py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                    isSpikePlanted ? "bg-amber-500 text-black font-bold" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  {isSpikePlanted ? "✓ Đã Đặt Spike (+$300 mỗi người)" : "Chưa / Không đặt Spike"}
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Shopping / Spending Simulator */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="font-display tracking-wider text-lg text-white flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-400" />
              2. KẾ HOẠCH MUA SẮM VÒNG NÀY (SHOPPING CART)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Primary Weapon Select */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Chọn Vũ Khí Chính</label>
                <select
                  value={selectedWeaponId}
                  onChange={(e) => { sound.playClick(); setSelectedWeaponId(e.target.value); }}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  {WEAPON_PRICES.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name} (${w.cost}) - {w.category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Armor Select */}
              <div>
                <label className="text-xs text-gray-400 block mb-1.5 font-semibold">Chọn Giáp (Shields)</label>
                <select
                  value={selectedArmorId}
                  onChange={(e) => { sound.playClick(); setSelectedArmorId(e.target.value); }}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
                >
                  {ARMOR_PRICES.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.name} (${a.cost})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Ability kit slider */}
            <div>
              <div className="flex justify-between text-xs text-gray-400 mb-1">
                <span>Tiền Mua Kỹ Năng (Abilities):</span>
                <span className="font-mono text-white font-bold">${abilitySpend}</span>
              </div>
              <input
                type="range"
                min="0"
                max="800"
                step="50"
                value={abilitySpend}
                onChange={(e) => setAbilitySpend(parseInt(e.target.value))}
                className="w-full accent-purple-500"
              />
            </div>

            {/* Total Spend Summary Bar */}
            <div className="bg-black/60 p-4 rounded-xl border border-white/10 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-400 block">Tổng chi phí mua sắm:</span>
                <span className="text-xs text-gray-500">{selectedWeapon.name} (${selectedWeapon.cost}) + {selectedArmor.name} (${selectedArmor.cost}) + Chiêu (${abilitySpend})</span>
              </div>
              <span className="text-2xl font-black font-mono text-rose-400">-${totalSpend}</span>
            </div>
          </div>
        </div>

        {/* Right Column: Dynamic Results & Advice & Team Planner */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Card 3: Next Round Money Forecast */}
          <div className="bg-gradient-to-br from-cyan-950/40 via-[#111] to-black border border-cyan-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <h2 className="font-display tracking-wider text-base text-cyan-400 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              DỰ BÁO TIỀN VÒNG KẾ TIẾP (NEXT ROUND)
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Còn lại sau khi mua</span>
                <span className="text-xl font-bold font-mono text-white">${calculation.remainingAfterBuy}</span>
              </div>
              <div className="bg-black/60 p-3.5 rounded-xl border border-white/10">
                <span className="text-[10px] text-gray-400 uppercase tracking-wider block">Kiếm được vòng này</span>
                <span className="text-xl font-bold font-mono text-emerald-400">+${calculation.earnedThisRound}</span>
              </div>
            </div>

            {/* Big Main Result */}
            <div className="bg-black/80 p-5 rounded-2xl border border-cyan-500/40 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-cyan-500/5 backdrop-blur-sm"></div>
              <span className="text-xs text-gray-400 uppercase tracking-widest block mb-1">
                TỔNG TIỀN VÒNG TIẾP THEO
              </span>
              <div className="text-4xl md:text-5xl font-black font-mono text-cyan-400 tracking-tight my-1">
                ${calculation.nextRoundTotal}
              </div>
              <span className="text-[11px] text-gray-400">
                (Tối thiểu nếu vòng sau thua 0 kill: <strong className="text-amber-400">${calculation.minNextRoundTotal}</strong>)
              </span>
            </div>

            {/* Tactical Advice Box */}
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400 font-bold uppercase">Khuyến Nghị IGL:</span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold border ${advice.badgeColor}`}>
                  {advice.title}
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                {advice.description}
              </p>
              <div className="pt-2 border-t border-white/5 text-[11px] text-cyan-300 font-medium flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>{advice.tacticalTip}</span>
              </div>
            </div>
          </div>

          {/* Card 4: 5-Man Team Economy Tracker */}
          <div className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-display tracking-wider text-base text-white flex items-center gap-2">
                <Users className="w-4 h-4 text-purple-400" />
                QUẢN LÝ TIỀN 5 THÀNH VIÊN ĐỘI
              </h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                canTeamFullBuy ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400"
              }`}>
                {canTeamFullBuy ? "Đủ Full Buy 5 người" : "Cần Save / Drop súng"}
              </span>
            </div>

            <div className="space-y-2.5">
              {teamCredits.map((cred, idx) => {
                const canDrop = cred >= 5800; // Can drop Vandal and still have 2900
                const needsDrop = cred < 3900;
                return (
                  <div key={idx} className="flex items-center justify-between bg-black/40 p-2.5 rounded-xl border border-white/5 text-xs">
                    <span className="font-semibold text-gray-300">Player {idx + 1}</span>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        step="100"
                        value={cred}
                        onChange={(e) => updatePlayerCredit(idx, parseInt(e.target.value) || 0)}
                        className="w-20 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right font-mono font-bold text-white focus:outline-none focus:border-cyan-500"
                      />
                      {canDrop && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                          Có thể Drop súng
                        </span>
                      )}
                      {needsDrop && !canDrop && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 text-[10px]">
                          Cần hỗ trợ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-white/5 text-xs">
              <span className="text-gray-400">Tổng tiền cả team:</span>
              <span className="font-bold font-mono text-cyan-400 text-sm">${teamTotalCredits} (TB: ${teamAverage}/người)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
