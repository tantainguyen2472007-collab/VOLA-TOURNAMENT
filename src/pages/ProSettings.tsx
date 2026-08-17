import { useState, useMemo } from "react";
import { 
  Crosshair, 
  Copy, 
  Check, 
  MousePointer, 
  Monitor, 
  Keyboard, 
  Headphones, 
  Trophy, 
  Search, 
  Calculator, 
  Sparkles, 
  ShieldAlert, 
  MapPin, 
  UserCheck, 
  Sliders, 
  Cpu, 
  Zap, 
  Target, 
  Layers, 
  DollarSign, 
  ExternalLink,
  Flame,
  CheckCircle2,
  Filter,
  RefreshCw,
  Award,
  X,
  Scale
} from "lucide-react";
import { PRO_SETTINGS_LIST, GEAR_DATABASE, ProPlayerSetting, GamingGearItem } from "../data/proSettings";
import { sound } from "../lib/sounds";

export function ProSettings() {
  const [selectedPlayer, setSelectedPlayer] = useState<ProPlayerSetting>(PRO_SETTINGS_LIST[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedRegion, setSelectedRegion] = useState<string>("ALL");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"database" | "advisor" | "sens_converter">("database");

  // --- PERSONALIZED ADVISOR STATE ---
  const [userSens, setUserSens] = useState<number>(0.3);
  const [userDpi, setUserDpi] = useState<number>(800);
  const [userGrip, setUserGrip] = useState<"claw" | "palm" | "fingertip">("claw");
  const [userHandSize, setUserHandSize] = useState<"small" | "medium" | "large">("medium");
  const [userRole, setUserRole] = useState<string>("Duelist");
  const [gearCategoryFilter, setGearCategoryFilter] = useState<string>("all");
  const [gearTierFilter, setGearTierFilter] = useState<"all" | "mid" | "flagship">("all");

  // --- COMPARISON STATE ---
  const [compareGearItems, setCompareGearItems] = useState<GamingGearItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompare = (item: GamingGearItem) => {
    sound.playClick();
    setCompareGearItems(prev => {
      // If already in list, remove it
      if (prev.some(g => g.id === item.id)) {
        return prev.filter(g => g.id !== item.id);
      }
      // Cannot mix categories
      if (prev.length > 0 && prev[0].category !== item.category) {
        alert("Chỉ có thể so sánh các thiết bị cùng loại (cùng là chuột, hoặc cùng là phím, v.v.).");
        return prev;
      }
      // Max 3 items
      if (prev.length >= 3) {
        alert("Tối đa chỉ so sánh được 3 thiết bị cùng lúc.");
        return prev;
      }
      return [...prev, item];
    });
  };

  const removeFromCompare = (id: string) => {
    sound.playClick();
    setCompareGearItems(prev => prev.filter(g => g.id !== id));
    if (compareGearItems.length <= 1) {
      setIsCompareModalOpen(false);
    }
  };

  // --- SENS CONVERTER STATE ---
  const [inputGame, setInputGame] = useState<string>("cs2");
  const [inputSens, setInputSens] = useState<number>(1.2);
  const [inputDpi, setInputDpi] = useState<number>(800);

  // Filtered Players Database
  const filteredPlayers = useMemo(() => {
    return PRO_SETTINGS_LIST.filter(p => {
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        p.name.toLowerCase().includes(q) ||
        p.realName.toLowerCase().includes(q) ||
        p.team.toLowerCase().includes(q) ||
        p.country.toLowerCase().includes(q) ||
        p.gear.mouse.toLowerCase().includes(q) ||
        p.gear.keyboard.toLowerCase().includes(q);
      
      const matchRole = selectedRole === "ALL" || p.role.toUpperCase() === selectedRole.toUpperCase();
      const matchRegion = selectedRegion === "ALL" || p.region.toUpperCase() === selectedRegion.toUpperCase();

      return matchSearch && matchRole && matchRegion;
    });
  }, [searchQuery, selectedRole, selectedRegion]);

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    sound.playSuccess();
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  // --- PERSONALIZED AIM DIAGNOSTIC CALCULATIONS ---
  const userEdpi = Math.round(userSens * userDpi);
  // cm per 360° turn in Valorant: 41565.6 / eDPI
  const userCm360 = userEdpi > 0 ? parseFloat((41565.6 / userEdpi).toFixed(1)) : 0;

  // Aim Speed Archetype
  const aimCategory = useMemo(() => {
    if (userEdpi < 180) {
      return {
        type: "ultra_low",
        title: "🐢 Ultra-Low Sens (Cực Chậm - Arm Aimer)",
        badge: "Arm Aimer (Toàn bộ cánh tay)",
        color: "text-blue-400 bg-blue-500/10 border-blue-500/30",
        description: "Bạn sử dụng toàn bộ chuyển động của cánh tay để di chuột. Độ chính xác gõ đầu từ xa là tuyệt đối, tâm súng không bao giờ rung lắc, nhưng đòi hỏi diện tích bàn cực rộng (lót chuột 45cm+).",
        microScore: 99,
        turnScore: 60,
        stabilityScore: 98,
        trackingScore: 72,
        fatigueRisk: "Thấp cho cổ tay, trung bình cho bả vai",
        drillAdvice: "Luyện các bài Microshot, Sixshot trong Aim Lab để tối đa hóa ưu thế gõ đầu tĩnh."
      };
    } else if (userEdpi <= 260) {
      return {
        type: "low_balanced",
        title: "🎯 Meta VCT Standard (Cân Bằng - Chuẩn Tuyển Thủ)",
        badge: "Chuẩn Meta VCT (>65% Pro Players)",
        color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
        description: "Đây là dải nhạy 'vàng' được đại đa số các siêu sao VCT thế giới như TenZ, aspas, ZmjjKK sử dụng. Kết hợp hoàn hảo giữa gạt góc bằng cánh tay và vi chỉnh gõ đầu sắc bén bằng cổ tay.",
        microScore: 94,
        turnScore: 85,
        stabilityScore: 92,
        trackingScore: 88,
        fatigueRisk: "Rất thấp, tư thế tự nhiên tối ưu nhất cho cơ xương khớp",
        drillAdvice: "Tập Deathmatch gõ One-Tap Vandal 1 viên/mục tiêu, kết hợp bài tập Strafe Track."
      };
    } else if (userEdpi <= 340) {
      return {
        type: "mid_fast",
        title: "⚡ Mid-Sens (Nhanh & Linh Hoạt)",
        badge: "Linh hoạt đa năng (Wrist + Arm)",
        color: "text-amber-400 bg-amber-500/10 border-amber-500/30",
        description: "Tốc độ phản xạ cao, quay đầu 180° tức thì mà không cần vung tay quá rộng. Thích hợp cho các Agent cơ động cao như Jett, Raze, Neon hoặc người chơi có không gian bàn vừa phải.",
        microScore: 86,
        turnScore: 94,
        stabilityScore: 84,
        trackingScore: 92,
        fatigueRisk: "Cần chú ý khởi động cổ tay trước khi tryhard",
        drillAdvice: "Tập bài Aim Lab Spidershot và Gridshot để giữ nhịp phản xạ cổ tay ổn định."
      };
    } else if (userEdpi <= 480) {
      return {
        type: "high_sens",
        title: "🔥 High Sens (Tốc Độ Cao - Wrist Master)",
        badge: "Cổ tay tốc độ cao",
        color: "text-rose-400 bg-rose-500/10 border-rose-500/30",
        description: "Chỉ cần lắc nhẹ cổ tay là có thể lia qua toàn bộ màn hình. Rất mạnh trong các pha hỗn chiến cự ly gần và phản xạ bọc lót góc chết, nhưng đòi hỏi khả năng kiểm soát cơ bắp tinh tế.",
        microScore: 75,
        turnScore: 98,
        stabilityScore: 76,
        trackingScore: 85,
        fatigueRisk: "Nguy cơ mỏi cổ tay cao nếu dùng chuột nặng",
        drillAdvice: "Nên sử dụng chuột siêu nhẹ (<55g) và lót chuột thiên Control để ghìm tâm ổn định hơn."
      };
    } else {
      return {
        type: "ultra_high",
        title: "🚀 Ultra-High Sens (Siêu Tốc - Phong Cách Something)",
        badge: "Flick God (Phản xạ siêu tốc)",
        color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
        description: "Bạn thuộc nhóm 1% người chơi có phản xạ flick tia chớp tương tự ngôi sao 'something' của Paper Rex. Lia tâm cực nhanh trong không gian hẹp mà không tốn sức cánh tay.",
        microScore: 68,
        turnScore: 100,
        stabilityScore: 65,
        trackingScore: 78,
        fatigueRisk: "Cao nếu ghì chuột quá chặt, nên dùng lót chuột vải dày đầm tay",
        drillAdvice: "Luyện bài Microflexion và Smoothness Tracking để tránh hiện tượng tâm súng bị giật khựng."
      };
    }
  }, [userEdpi]);

  // Find Closest Matching Pro Player
  const closestPro = useMemo(() => {
    let best = PRO_SETTINGS_LIST[0];
    let minDiff = Math.abs(best.mouse.eDpi - userEdpi);

    for (const player of PRO_SETTINGS_LIST) {
      const diff = Math.abs(player.mouse.eDpi - userEdpi);
      if (diff < minDiff) {
        minDiff = diff;
        best = player;
      }
    }

    const similarity = Math.max(70, Math.round(100 - (minDiff / Math.max(best.mouse.eDpi, userEdpi)) * 50));
    return { player: best, similarity, diff: minDiff };
  }, [userEdpi]);

  // Filtered Gear Recommendations
  const filteredGear = useMemo(() => {
    let sensTag: "low" | "mid" | "high" = "mid";
    if (userEdpi < 220) sensTag = "low";
    else if (userEdpi > 340) sensTag = "high";

    return GEAR_DATABASE.filter(item => {
      // Category filter
      if (gearCategoryFilter !== "all" && item.category !== gearCategoryFilter) {
        return false;
      }
      // Tier filter
      if (gearTierFilter !== "all" && item.tier !== gearTierFilter) {
        return false;
      }
      return true;
    });
  }, [userEdpi, gearCategoryFilter, gearTierFilter]);

  // Convert sensitivity between games
  const getConvertedValSens = () => {
    switch (inputGame) {
      case "cs2":
      case "apex":
        return (inputSens / 3.181818).toFixed(3);
      case "overwatch":
        return (inputSens / 10.60).toFixed(3);
      case "r6":
        return (inputSens * 0.38).toFixed(3);
      case "fortnite":
        return (inputSens / 12.6).toFixed(3);
      default:
        return inputSens.toFixed(3);
    }
  };

  const valSensNum = parseFloat(getConvertedValSens());
  const convertedEdpi = Math.round(valSensNum * inputDpi);

  const applyConvertedToAdvisor = () => {
    setUserSens(valSensNum);
    setUserDpi(inputDpi);
    setActiveTab("advisor");
    sound.playSuccess();
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-4 md:p-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2.5 bg-rose-500/20 text-rose-400 rounded-xl border border-rose-500/30">
              <Crosshair className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white flex items-center gap-2">
                PRO SETTINGS & CÁ NHÂN HÓA AIM
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono">
                  VCT 2025/2026 Meta
                </span>
              </h1>
            </div>
          </div>
          <p className="text-xs md:text-sm text-gray-400">
            Hệ thống dữ liệu cài đặt thi đấu chính xác của các siêu sao thế giới và công cụ chẩn đoán độ nhạy, tư vấn Gaming Gear cá nhân hóa.
          </p>
        </div>

        {/* TOP TAB NAVIGATION SWITCHER */}
        <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto">
          <button
            id="tab-database"
            onClick={() => { sound.playClick(); setActiveTab("database"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === "database"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Trophy className="w-4 h-4" />
            Database Tuyển Thủ ({PRO_SETTINGS_LIST.length})
          </button>
          
          <button
            id="tab-advisor"
            onClick={() => { sound.playClick(); setActiveTab("advisor"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === "advisor"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            Cá Nhân Hóa & Tư Vấn Gear
          </button>

          <button
            id="tab-sens-converter"
            onClick={() => { sound.playClick(); setActiveTab("sens_converter"); }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
              activeTab === "sens_converter"
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30 font-bold"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Calculator className="w-4 h-4" />
            Chuyển Đổi Sens
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PRO PLAYERS DATABASE */}
      {/* ========================================================================= */}
      {activeTab === "database" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
          {/* Left Column: Player Selector & Multi-Filters */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm tuyển thủ, đội, chuột, bàn phím..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Region Filters */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs">
              <span className="text-[10px] text-gray-500 uppercase px-2 font-bold flex items-center gap-1">
                <MapPin className="w-3 h-3" /> Khu vực:
              </span>
              {["ALL", "Americas", "EMEA", "Pacific", "China"].map((reg) => (
                <button
                  key={reg}
                  onClick={() => { sound.playClick(); setSelectedRegion(reg); }}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedRegion === reg ? "bg-rose-600 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {reg === "ALL" ? "Tất Cả" : reg}
                </button>
              ))}
            </div>

            {/* Role Filters */}
            <div className="flex items-center gap-1 bg-white/5 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs">
              <span className="text-[10px] text-gray-500 uppercase px-2 font-bold flex items-center gap-1">
                <Target className="w-3 h-3" /> Vai trò:
              </span>
              {["ALL", "Duelist", "Initiator", "Controller", "Sentinel", "Flex"].map((role) => (
                <button
                  key={role}
                  onClick={() => { sound.playClick(); setSelectedRole(role); }}
                  className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedRole === role ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"
                  }`}
                >
                  {role === "ALL" ? "Tất Cả" : role}
                </button>
              ))}
            </div>

            {/* Player Cards List */}
            <div className="flex flex-col gap-2.5 max-h-[750px] overflow-y-auto pr-1">
              {filteredPlayers.length === 0 ? (
                <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 text-gray-400">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <p className="text-sm">Không tìm thấy tuyển thủ nào khớp với bộ lọc.</p>
                </div>
              ) : (
                filteredPlayers.map((player) => {
                  const isSelected = selectedPlayer.id === player.id;
                  return (
                    <div
                      key={player.id}
                      id={`player-card-${player.id}`}
                      onClick={() => {
                        sound.playClick();
                        setSelectedPlayer(player);
                      }}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? "bg-gradient-to-r from-rose-950/60 via-black to-[#111] border-rose-500 shadow-lg shadow-rose-500/20"
                          : "bg-white/[0.03] border-white/5 hover:border-white/20 hover:bg-white/[0.07]"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-gray-800 overflow-hidden border border-white/15 relative shrink-0 shadow-md">
                          <img 
                            src={player.avatar} 
                            alt={player.name}
                            className="w-full h-full object-cover" 
                          />
                          <span className="absolute bottom-0 right-0 text-[10px] leading-none bg-black/60 px-1 py-0.5 rounded-tl">
                            {player.countryFlag}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-display tracking-wider text-base text-white font-bold truncate">
                              {player.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-gray-300 uppercase font-semibold shrink-0">
                              {player.role}
                            </span>
                          </div>
                          <p className="text-xs text-gray-400 truncate">
                            {player.realName} • <strong className="text-rose-400">{player.team}</strong> ({player.region})
                          </p>
                          <p className="text-[10px] text-gray-500 truncate mt-0.5">
                            🖱️ {player.gear.mouse}
                          </p>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <div className="text-xs font-mono text-cyan-400 font-bold">{player.mouse.eDpi} eDPI</div>
                        <div className="text-[10px] text-gray-400">{player.mouse.cm360} cm/360°</div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Column: Selected Player Detailed Dashboard */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Player Banner */}
            <div className="bg-gradient-to-br from-rose-950/40 via-[#111] to-[#0a0a0a] border border-rose-500/30 rounded-3xl p-6 relative overflow-hidden shadow-2xl">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-2xl bg-gray-900 border-2 border-rose-500/60 overflow-hidden shadow-2xl shrink-0">
                    <img src={selectedPlayer.avatar} alt={selectedPlayer.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-2xl md:text-3xl font-display tracking-wider text-white font-bold">
                        {selectedPlayer.name}
                      </h2>
                      <span className="text-xl">{selectedPlayer.countryFlag}</span>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold">
                        {selectedPlayer.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      {selectedPlayer.realName} • Đội tuyển <strong className="text-rose-400">{selectedPlayer.team}</strong> ({selectedPlayer.region})
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Vai trò: <span className="text-cyan-300 font-semibold">{selectedPlayer.role}</span> • Thế cầm chuột: <span className="text-purple-300 font-semibold">{selectedPlayer.mouse.mouseGrip}</span>
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-end justify-between sm:justify-start w-full sm:w-auto bg-black/40 p-3 rounded-2xl border border-white/10 sm:bg-transparent sm:p-0 sm:border-0">
                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-gray-400 uppercase tracking-widest block font-semibold">Độ nhạy eDPI</span>
                    <span className="text-3xl font-black font-mono text-cyan-400">{selectedPlayer.mouse.eDpi}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 font-mono block">{selectedPlayer.mouse.cm360} cm/360°</span>
                  </div>
                </div>
              </div>

              {/* Achievements Badges */}
              <div className="mt-5 pt-4 border-t border-white/10 flex flex-wrap gap-2">
                {selectedPlayer.achievements.map((ach, idx) => (
                  <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium">
                    <Trophy className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    {ach}
                  </span>
                ))}
              </div>
            </div>

            {/* Crosshair Showcase & Interactive Code Copy */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-cyan-400" />
                  <h3 className="font-display tracking-wider text-base md:text-lg text-white">
                    TÂM NGẮM THI ĐẤU (PRO CROSSHAIR)
                  </h3>
                </div>
                <button
                  id="copy-crosshair-code-btn"
                  onClick={() => handleCopyCode(selectedPlayer.crosshairCode)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold tracking-wider uppercase transition-all shadow-lg shadow-cyan-600/20"
                >
                  {copiedCode === selectedPlayer.crosshairCode ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      Đã Copy Code!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy Code Tâm Ngắm
                    </>
                  )}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Visual Crosshair Live Preview Screen */}
                <div className="md:col-span-6 h-48 bg-gradient-to-b from-[#1b2838] to-[#121c27] rounded-xl border border-white/10 relative flex items-center justify-center overflow-hidden shadow-inner group">
                  <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
                  
                  {/* Rendered Crosshair */}
                  <div className="relative z-10 flex items-center justify-center">
                    {/* Center Dot */}
                    {selectedPlayer.crosshairConfig.centerDot && (
                      <div 
                        className="w-1.5 h-1.5 rounded-full absolute shadow-sm"
                        style={{ backgroundColor: selectedPlayer.crosshairConfig.color }}
                      />
                    )}

                    {/* Inner Lines */}
                    {selectedPlayer.crosshairConfig.innerLines.show && (
                      <>
                        <div 
                          className="absolute shadow-sm"
                          style={{
                            backgroundColor: selectedPlayer.crosshairConfig.color,
                            width: `${selectedPlayer.crosshairConfig.innerLines.thickness * 2}px`,
                            height: `${selectedPlayer.crosshairConfig.innerLines.length * 4}px`,
                            bottom: `${selectedPlayer.crosshairConfig.innerLines.offset * 3}px`,
                            outline: selectedPlayer.crosshairConfig.outlines ? "1px solid black" : "none"
                          }}
                        />
                        <div 
                          className="absolute shadow-sm"
                          style={{
                            backgroundColor: selectedPlayer.crosshairConfig.color,
                            width: `${selectedPlayer.crosshairConfig.innerLines.thickness * 2}px`,
                            height: `${selectedPlayer.crosshairConfig.innerLines.length * 4}px`,
                            top: `${selectedPlayer.crosshairConfig.innerLines.offset * 3}px`,
                            outline: selectedPlayer.crosshairConfig.outlines ? "1px solid black" : "none"
                          }}
                        />
                        <div 
                          className="absolute shadow-sm"
                          style={{
                            backgroundColor: selectedPlayer.crosshairConfig.color,
                            height: `${selectedPlayer.crosshairConfig.innerLines.thickness * 2}px`,
                            width: `${selectedPlayer.crosshairConfig.innerLines.length * 4}px`,
                            right: `${selectedPlayer.crosshairConfig.innerLines.offset * 3}px`,
                            outline: selectedPlayer.crosshairConfig.outlines ? "1px solid black" : "none"
                          }}
                        />
                        <div 
                          className="absolute shadow-sm"
                          style={{
                            backgroundColor: selectedPlayer.crosshairConfig.color,
                            height: `${selectedPlayer.crosshairConfig.innerLines.thickness * 2}px`,
                            width: `${selectedPlayer.crosshairConfig.innerLines.length * 4}px`,
                            left: `${selectedPlayer.crosshairConfig.innerLines.offset * 3}px`,
                            outline: selectedPlayer.crosshairConfig.outlines ? "1px solid black" : "none"
                          }}
                        />
                      </>
                    )}
                  </div>

                  <span className="absolute bottom-2 left-3 text-[10px] text-gray-400 bg-black/70 px-2 py-0.5 rounded">
                    Mô phỏng góc ngắm trong game
                  </span>
                </div>

                {/* Crosshair Code & Specs Box */}
                <div className="md:col-span-6 flex flex-col gap-3">
                  <div className="bg-black/80 rounded-xl p-3 border border-white/10">
                    <span className="text-[10px] text-gray-400 font-semibold block mb-1 uppercase tracking-wider">
                      Mã Profile Valorant (Import Code)
                    </span>
                    <p className="font-mono text-xs text-rose-300 break-all select-all">{selectedPlayer.crosshairCode}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Màu sắc (Color)</span>
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: selectedPlayer.crosshairConfig.color }}></span>
                        {selectedPlayer.crosshairConfig.color}
                      </span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Viền ngoài (Outlines)</span>
                      <span className="font-semibold text-white">{selectedPlayer.crosshairConfig.outlines ? "Bật (On)" : "Tắt (Off)"}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Chấm tâm (Center Dot)</span>
                      <span className="font-semibold text-white">{selectedPlayer.crosshairConfig.centerDot ? "Bật (On)" : "Tắt (Off)"}</span>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                      <span className="text-gray-400 block text-[10px]">Inner Lines (L-T-O)</span>
                      <span className="font-semibold text-white font-mono">
                        {selectedPlayer.crosshairConfig.innerLines.length}-{selectedPlayer.crosshairConfig.innerLines.thickness}-{selectedPlayer.crosshairConfig.innerLines.offset}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mouse & Video Settings Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Mouse Settings */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-emerald-400">
                  <MousePointer className="w-4 h-4" />
                  <h3 className="font-display tracking-wider text-sm text-white">THÔNG SỐ CHUỘT (MOUSE SENS)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">DPI Phần Cứng</span>
                    <span className="font-bold text-white font-mono">{selectedPlayer.mouse.dpi}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Sensitivity Trong Game</span>
                    <span className="font-bold text-emerald-400 font-mono">{selectedPlayer.mouse.sensitivity}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">eDPI (DPI × Sens)</span>
                    <span className="font-bold text-cyan-400 font-mono">{selectedPlayer.mouse.eDpi}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Khoảng cách xoay 360°</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedPlayer.mouse.cm360} cm</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Polling Rate</span>
                    <span className="font-bold text-white font-mono">{selectedPlayer.mouse.pollingRate}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Thế Cầm Chuột (Grip)</span>
                    <span className="font-bold text-purple-300">{selectedPlayer.mouse.mouseGrip}</span>
                  </div>
                </div>
              </div>

              {/* Video & Display Settings */}
              <div className="bg-[#111] border border-white/10 rounded-2xl p-5 shadow-lg">
                <div className="flex items-center gap-2 mb-4 text-purple-400">
                  <Monitor className="w-4 h-4" />
                  <h3 className="font-display tracking-wider text-sm text-white">MÀN HÌNH & ĐỒ HỌA (VIDEO)</h3>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Độ phân giải (Resolution)</span>
                    <span className="font-bold text-white font-mono">{selectedPlayer.video.resolution}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Tỉ lệ màn hình (Aspect Ratio)</span>
                    <span className="font-bold text-purple-300 font-mono">{selectedPlayer.video.aspectRatio}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Chế độ hiển thị</span>
                    <span className="font-bold text-white font-mono">{selectedPlayer.video.displayMode}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Tần số quét thi đấu</span>
                    <span className="font-bold text-amber-400 font-mono">{selectedPlayer.video.refreshRate}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-white/5">
                    <span className="text-gray-400">Chất lượng đồ họa (Detail)</span>
                    <span className="font-bold text-white font-mono">{selectedPlayer.video.detailQuality || "Low"}</span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="text-gray-400">Khử răng cưa (Antialiasing)</span>
                    <span className="font-bold text-gray-300 font-mono">{selectedPlayer.video.antialiasing || "None"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Complete Hardware & Gear Breakdown (NO TRUNCATION) */}
            <div className="bg-[#111] border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-amber-400">
                  <Cpu className="w-5 h-5" />
                  <h3 className="font-display tracking-wider text-base text-white">
                    THIẾT BỊ THI ĐẤU CHI TIẾT (PRO HARDWARE & GEAR)
                  </h3>
                </div>
                <span className="text-[10px] text-gray-400 uppercase font-mono bg-white/5 px-2 py-0.5 rounded">
                  Official VCT Peripherals
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Mouse */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-rose-400 uppercase font-bold flex items-center gap-1.5">
                    <MousePointer className="w-3.5 h-3.5" /> Chuột Thi Đấu (Mouse)
                  </span>
                  <p className="text-sm font-bold text-white">{selectedPlayer.gear.mouse}</p>
                  <p className="text-xs text-gray-400">Trọng lượng: {selectedPlayer.gear.mouseWeight}</p>
                </div>

                {/* Mousepad */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-cyan-400 uppercase font-bold flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Lót Chuột (Mousepad)
                  </span>
                  <p className="text-sm font-bold text-white">{selectedPlayer.gear.mousepad}</p>
                  <p className="text-xs text-gray-400">Bề mặt: {selectedPlayer.gear.mousepadType}</p>
                </div>

                {/* Keyboard */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-purple-400 uppercase font-bold flex items-center gap-1.5">
                    <Keyboard className="w-3.5 h-3.5" /> Bàn Phím (Keyboard)
                  </span>
                  <p className="text-sm font-bold text-white">{selectedPlayer.gear.keyboard}</p>
                  <p className="text-xs text-gray-400">Switch: {selectedPlayer.gear.keyboardSwitch}</p>
                </div>

                {/* Audio */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 space-y-1">
                  <span className="text-[10px] text-emerald-400 uppercase font-bold flex items-center gap-1.5">
                    <Headphones className="w-3.5 h-3.5" /> Tai Nghe / IEM (Audio)
                  </span>
                  <p className="text-sm font-bold text-white">{selectedPlayer.gear.headset}</p>
                  <p className="text-xs text-gray-400">Kiểu dáng: {selectedPlayer.gear.headsetType}</p>
                </div>

                {/* Monitor */}
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 sm:col-span-2 space-y-1">
                  <span className="text-[10px] text-amber-400 uppercase font-bold flex items-center gap-1.5">
                    <Monitor className="w-3.5 h-3.5" /> Màn Hình Thi Đấu (Monitor)
                  </span>
                  <p className="text-sm font-bold text-white">{selectedPlayer.gear.monitor}</p>
                  <p className="text-xs text-gray-400">Tấm nền & Tần số: {selectedPlayer.gear.monitorPanel}</p>
                </div>

                {/* PC Specs */}
                {selectedPlayer.gear.pcSpecs && (
                  <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 sm:col-span-2 text-xs text-gray-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-rose-400 shrink-0" />
                    <span><strong>Cấu hình PC thi đấu:</strong> {selectedPlayer.gear.pcSpecs}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PERSONALIZED AIM & GEAR ADVISOR (REPLACED CROSSHAIR BUILDER) */}
      {/* ========================================================================= */}
      {activeTab === "advisor" && (
        <div className="max-w-6xl mx-auto mt-6 space-y-8">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-rose-950/50 via-[#141414] to-black border border-rose-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 text-rose-400 mb-2">
                  <Sparkles className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-widest">Hệ Thống Đánh Giá Trí Tuệ Nhân Tạo</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-display tracking-wider text-white font-black">
                  CHẨN ĐOÁN AIM & TƯ VẤN GAMING GEAR
                </h2>
                <p className="text-xs md:text-sm text-gray-400 max-w-2xl mt-1">
                  Nhập thông số DPI, Sensitivity, thế cầm tay để hệ thống tự động phân tích ưu/nhược điểm cơ học, chỉ số gõ đầu, và đề xuất danh sách Gaming Gear chuẩn thi đấu từ <strong>Tầm Trung</strong> đến <strong>Cao Cấp</strong>.
                </p>
              </div>

              {/* Live eDPI Quick Widget */}
              <div className="bg-black/80 border border-white/10 p-5 rounded-2xl flex flex-col items-center justify-center shrink-0 min-w-[200px] shadow-xl">
                <span className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">eDPI CỦA BẠN</span>
                <div className="text-4xl font-black font-mono text-cyan-400 my-1">{userEdpi}</div>
                <span className="text-xs font-mono text-gray-400">{userCm360} cm / 360°</span>
              </div>
            </div>
          </div>

          {/* Section 1: User Inputs Form */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-base font-display uppercase tracking-wider text-white font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders className="w-4 h-4 text-rose-400" />
              1. Nhập Thông Số Cá Nhân Của Bạn
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Sensitivity Input */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-300 font-semibold">Sensitivity Trong Game</label>
                  <span className="font-mono font-bold text-rose-400 text-sm">{userSens}</span>
                </div>
                <input
                  type="range"
                  min="0.05"
                  max="1.5"
                  step="0.01"
                  value={userSens}
                  onChange={(e) => setUserSens(parseFloat(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer"
                />
                <div className="flex gap-1.5 pt-1">
                  {[0.2, 0.28, 0.35, 0.45].map((val) => (
                    <button
                      key={val}
                      onClick={() => setUserSens(val)}
                      className={`text-[10px] px-2 py-1 rounded bg-white/5 hover:bg-white/15 transition-colors font-mono ${
                        userSens === val ? "text-rose-400 font-bold border border-rose-500/40" : "text-gray-400"
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPI Input */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center text-xs">
                  <label className="text-gray-300 font-semibold">DPI Chuột (Hardware DPI)</label>
                  <span className="font-mono font-bold text-cyan-400 text-sm">{userDpi} DPI</span>
                </div>
                <div className="grid grid-cols-4 gap-1 pt-1">
                  {[400, 800, 1600, 3200].map((dpiVal) => (
                    <button
                      key={dpiVal}
                      onClick={() => setUserDpi(dpiVal)}
                      className={`text-xs py-2 rounded-xl font-mono font-bold transition-all ${
                        userDpi === dpiVal 
                          ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" 
                          : "bg-black/40 text-gray-400 hover:text-white border border-white/5"
                      }`}
                    >
                      {dpiVal}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mouse Grip Style */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <label className="text-xs text-gray-300 font-semibold block">Dáng Cầm Chuột (Grip Style)</label>
                <select
                  value={userGrip}
                  onChange={(e) => setUserGrip(e.target.value as any)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="claw">Claw Grip (Móng vuốt - Phổ biến nhất)</option>
                  <option value="palm">Palm Grip (Ôm trọn lòng bàn tay)</option>
                  <option value="fingertip">Fingertip Grip (Đầu ngón tay siêu tốc)</option>
                </select>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  {userGrip === "claw" && "Tối ưu hóa độ linh hoạt ngón tay và độ ổn định cổ tay."}
                  {userGrip === "palm" && "Đầm chắc tay, kiểm soát kê góc bắn tĩnh cực tốt."}
                  {userGrip === "fingertip" && "Tốc độ flick tia chớp, phù hợp với chuột siêu nhẹ <50g."}
                </p>
              </div>

              {/* Hand Size & Role */}
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <label className="text-xs text-gray-300 font-semibold block">Kích Thước Bàn Tay & Vai Trò</label>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { id: "small", label: "Nhỏ (<17cm)" },
                    { id: "medium", label: "Vừa (17-19cm)" },
                    { id: "large", label: "Lớn (>19cm)" }
                  ].map((size) => (
                    <button
                      key={size.id}
                      onClick={() => setUserHandSize(size.id as any)}
                      className={`text-[10px] py-1.5 px-1 rounded-lg font-medium transition-colors text-center ${
                        userHandSize === size.id ? "bg-purple-600 text-white font-bold" : "bg-black/40 text-gray-400 hover:text-white"
                      }`}
                    >
                      {size.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: In-Depth Aim Diagnostic & Closest Pro Match */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Aim Speed & 5-Axis Performance Radar */}
            <div className="lg:col-span-7 bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2 text-cyan-400">
                  <Zap className="w-5 h-5" />
                  <h3 className="font-display tracking-wider text-base text-white font-bold">
                    KẾT QUẢ ĐÁNH GIÁ PHONG CÁCH AIM
                  </h3>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full border font-bold ${aimCategory.color}`}>
                  {aimCategory.badge}
                </span>
              </div>

              <div className="space-y-2">
                <h4 className="text-lg font-bold text-white">{aimCategory.title}</h4>
                <p className="text-xs text-gray-300 leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                  {aimCategory.description}
                </p>
              </div>

              {/* 5-Axis Metric Bars */}
              <div className="space-y-3.5">
                <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 block">
                  Chỉ Số Cơ Học Cơ Bản (Aim Mechanics Breakdown):
                </span>

                {/* Micro Adjust */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      🎯 Độ Chính Xác Vi Chỉnh Gõ Đầu (Micro-Adjustment):
                    </span>
                    <span className="font-mono font-bold text-emerald-400">{aimCategory.microScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${aimCategory.microScore}%` }}></div>
                  </div>
                </div>

                {/* Turn Speed */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      ⚡ Tốc Độ Xoay 180° & Phản Xạ Góc Khuất:
                    </span>
                    <span className="font-mono font-bold text-amber-400">{aimCategory.turnScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full transition-all duration-500" style={{ width: `${aimCategory.turnScore}%` }}></div>
                  </div>
                </div>

                {/* Stability */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      🧱 Độ Ổn Định Kê Góc & Ghim Tâm (Placement Stability):
                    </span>
                    <span className="font-mono font-bold text-blue-400">{aimCategory.stabilityScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${aimCategory.stabilityScore}%` }}></div>
                  </div>
                </div>

                {/* Tracking */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300 flex items-center gap-1.5">
                      🔄 Khả Năng Bám Đuổi Mục Tiêu Di Động (Smooth Tracking):
                    </span>
                    <span className="font-mono font-bold text-purple-400">{aimCategory.trackingScore}/100</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${aimCategory.trackingScore}%` }}></div>
                  </div>
                </div>
              </div>

              {/* Coaching Tip Box */}
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-amber-300">
                  <Award className="w-4 h-4" />
                  <span>Lời khuyên luyện tập từ HLV Esports:</span>
                </div>
                <p className="text-gray-300">{aimCategory.drillAdvice}</p>
                <p className="text-[11px] text-gray-400">🛡️ <strong>Tác động sức khỏe:</strong> {aimCategory.fatigueRisk}</p>
              </div>
            </div>

            {/* Right: Closest VCT Pro Match Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-rose-950/40 via-[#111] to-[#0a0a0a] border border-rose-500/30 rounded-3xl p-6 md:p-8 shadow-xl flex flex-col justify-between space-y-6">
              <div>
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2 text-rose-400">
                    <UserCheck className="w-5 h-5" />
                    <h3 className="font-display tracking-wider text-base text-white font-bold">
                      TUYỂN THỦ TƯƠNG ĐỒNG NHẤT
                    </h3>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 font-mono font-bold">
                    {closestPro.similarity}% Tương Đồng
                  </span>
                </div>

                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5 mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-gray-900 overflow-hidden border-2 border-rose-500/50 shrink-0 shadow-lg">
                    <img src={closestPro.player.avatar} alt={closestPro.player.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xl font-display font-bold text-white">{closestPro.player.name}</h4>
                      <span>{closestPro.player.countryFlag}</span>
                    </div>
                    <p className="text-xs text-gray-400">{closestPro.player.realName} • <strong className="text-rose-400">{closestPro.player.team}</strong></p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                        {closestPro.player.mouse.eDpi} eDPI
                      </span>
                      <span className="text-[10px] text-gray-400">
                        {closestPro.player.mouse.dpi} DPI / {closestPro.player.mouse.sensitivity} sens
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-xs text-gray-300 bg-black/40 p-4 rounded-2xl border border-white/5">
                  <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Thiết bị tuyển thủ đang dùng:</span>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Chuột:</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{closestPro.player.gear.mouse}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-white/5">
                    <span className="text-gray-400">Lót chuột:</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{closestPro.player.gear.mousepad}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-gray-400">Bàn phím HE:</span>
                    <span className="font-semibold text-white truncate max-w-[200px]">{closestPro.player.gear.keyboard}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setSelectedPlayer(closestPro.player);
                  setActiveTab("database");
                  sound.playSuccess();
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-rose-600/30 flex items-center justify-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                Xem Chi Tiết Profile {closestPro.player.name}
              </button>
            </div>
          </div>

          {/* Section 3: Intelligent Gaming Gear Recommendations Categorized by Budget */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <div className="flex items-center gap-2 text-amber-400 mb-1">
                  <Flame className="w-5 h-5" />
                  <h3 className="font-display tracking-wider text-lg md:text-xl text-white font-bold">
                    GỢI Ý GAMING GEAR PHÙ HỢP VỚI BẠN
                  </h3>
                </div>
                <p className="text-xs text-gray-400">
                  Lựa chọn phần cứng tương thích tối đa với eDPI {userEdpi}, thế cầm {userGrip} và tay cỡ {userHandSize}.
                </p>
              </div>

              {/* Price Tier Filters */}
              <div className="flex items-center bg-black/60 p-1.5 rounded-2xl border border-white/10 text-xs">
                <button
                  onClick={() => { sound.playClick(); setGearTierFilter("all"); }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    gearTierFilter === "all" ? "bg-rose-600 text-white font-bold shadow-md shadow-rose-600/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tất Cả Mức Giá
                </button>
                <button
                  onClick={() => { sound.playClick(); setGearTierFilter("mid"); }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    gearTierFilter === "mid" ? "bg-cyan-600 text-white font-bold shadow-md shadow-cyan-600/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Tầm Trung (500k - 2.5Tr)
                </button>
                <button
                  onClick={() => { sound.playClick(); setGearTierFilter("flagship"); }}
                  className={`px-3 py-1.5 rounded-xl font-medium transition-all ${
                    gearTierFilter === "flagship" ? "bg-amber-600 text-white font-bold shadow-md shadow-amber-600/30" : "text-gray-400 hover:text-white"
                  }`}
                >
                  Cao Cấp (3Tr - 16Tr+)
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              {[
                { id: "all", label: "Tất Cả Thiết Bị" },
                { id: "mouse", label: "🖱️ Chuột Esports" },
                { id: "mousepad", label: "✨ Lót Chuột (Pad)" },
                { id: "keyboard", label: "⌨️ Phím Rapid Trigger (HE)" },
                { id: "audio", label: "🎧 Tai Nghe & IEMs" },
                { id: "monitor", label: "🖥️ Màn Hình 240Hz/360Hz" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => { sound.playClick(); setGearCategoryFilter(cat.id); }}
                  className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-medium transition-colors border ${
                    gearCategoryFilter === cat.id
                      ? "bg-white text-black font-bold border-white"
                      : "bg-white/5 text-gray-400 hover:text-white border-white/5"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Gear Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredGear.map((gear) => (
                <div
                  key={gear.id}
                  className="bg-white/[0.03] border border-white/10 rounded-2xl p-5 hover:border-white/20 hover:bg-white/[0.06] transition-all flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Tier & Price Badge */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                        gear.tier === "mid"
                          ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                          : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      }`}>
                        {gear.tierLabel}
                      </span>
                      <span className="text-xs font-mono font-bold text-emerald-400">
                        {gear.priceFormatted}
                      </span>
                    </div>

                    {/* Image Mockup & Title */}
                    <div className="h-36 rounded-xl bg-black/60 overflow-hidden border border-white/5 relative mb-3.5 group-hover:scale-[1.02] transition-transform">
                      <img src={gear.image} alt={gear.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                      <div className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-gray-300 font-mono">
                        {gear.brand}
                      </div>
                    </div>

                    <h4 className="text-base font-bold text-white mb-2 leading-snug">{gear.name}</h4>

                    {/* EloShapes Shape Details (if available) */}
                    {gear.eloshapes && (
                      <div className="mb-3 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-rose-400 font-bold flex items-center gap-1">
                            <Sliders className="w-3 h-3" /> EloShapes Shape:
                          </span>
                          <span className="text-white font-mono font-bold">{gear.eloshapes.weightGrams}g • {gear.eloshapes.maxPollingRate}</span>
                        </div>
                        <div className="text-[10px] text-gray-300 font-mono flex items-center justify-between">
                          <span className="text-gray-400">DxRxC:</span>
                          <span className="text-cyan-300">{gear.eloshapes.dimensionsMm.length} x {gear.eloshapes.dimensionsMm.width} x {gear.eloshapes.dimensionsMm.height} mm</span>
                        </div>
                        <div className="text-[10px] text-amber-300">
                          🎯 {gear.eloshapes.shapeType} ({gear.eloshapes.handSuitability})
                        </div>
                      </div>
                    )}

                    {/* Specs List */}
                    <ul className="space-y-1 text-xs text-gray-400 mb-3.5">
                      {gear.specs.map((spec, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="truncate">{spec}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Why it fits user */}
                    <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-gray-300 space-y-1 mb-3">
                      <span className="text-[10px] text-rose-400 uppercase font-bold block">
                        💡 Tại sao phù hợp với bạn:
                      </span>
                      <p className="text-[11px] leading-relaxed text-gray-300">{gear.highlightReason}</p>
                    </div>
                  </div>

                  {/* Pro Users Footer */}
                  <div className="pt-3 border-t border-white/5 flex flex-col gap-3">
                    <div className="flex items-center justify-between text-[11px] text-gray-400">
                      <span className="truncate">⭐ Pro dùng: <strong className="text-white">{gear.proUsers.slice(0, 2).join(", ")}</strong></span>
                      <span className="font-mono text-amber-300 shrink-0 font-bold">★ {gear.rating}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleCompare(gear);
                      }}
                      className={`w-full py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 border ${
                        compareGearItems.some(g => g.id === gear.id)
                          ? "bg-rose-600 text-white border-rose-600"
                          : "bg-white/5 text-gray-300 border-white/10 hover:bg-white/10"
                      }`}
                    >
                      <Scale className="w-4 h-4" />
                      {compareGearItems.some(g => g.id === gear.id) ? "Bỏ So Sánh" : "So Sánh"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Floating Compare Button */}
      {compareGearItems.length > 0 && activeTab === "advisor" && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-950/90 to-black/90 border border-rose-500/50 backdrop-blur-md rounded-full px-6 py-3 flex items-center gap-4 shadow-[0_0_30px_rgba(225,29,72,0.3)] z-40">
          <div className="flex items-center gap-3">
            {compareGearItems.map(item => (
              <div key={item.id} className="relative group">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/20 bg-black">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => removeFromCompare(item.id)}
                  className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-white/20"></div>
          <button
            onClick={() => {
              sound.playClick();
              setIsCompareModalOpen(true);
            }}
            className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-rose-600/30 flex items-center gap-2"
          >
            <Scale className="w-4 h-4" />
            So Sánh Ngay ({compareGearItems.length})
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setCompareGearItems([]);
              setIsCompareModalOpen(false);
            }}
            className="text-gray-400 hover:text-white p-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Comparison Modal */}
      {isCompareModalOpen && compareGearItems.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#111] border border-rose-500/30 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
            <div className="sticky top-0 bg-[#111]/90 backdrop-blur-md p-6 border-b border-white/10 flex items-center justify-between z-10">
              <div className="flex items-center gap-3 text-rose-400">
                <Scale className="w-6 h-6" />
                <h3 className="font-display tracking-wider text-xl text-white font-bold">SO SÁNH GAMING GEAR</h3>
              </div>
              <button
                onClick={() => setIsCompareModalOpen(false)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-gray-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="flex gap-4 overflow-x-auto pb-4">
                {compareGearItems.map(item => (
                  <div key={item.id} className="flex-1 min-w-[280px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden flex flex-col">
                    <div className="h-48 bg-black/50 relative">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-80" />
                      <div className="absolute top-3 right-3 bg-black/80 px-2.5 py-1 rounded-lg text-xs font-mono font-bold text-emerald-400 border border-emerald-500/30">
                        {item.priceFormatted}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col grow">
                      <div className="mb-4">
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{item.brand}</span>
                        <h4 className="text-lg font-bold text-white leading-tight mt-1">{item.name}</h4>
                        <span className={`inline-block mt-2 text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                          item.tier === "mid" ? "bg-cyan-500/10 text-cyan-300 border-cyan-500/30" : "bg-amber-500/10 text-amber-300 border-amber-500/30"
                        }`}>
                          {item.tierLabel}
                        </span>
                      </div>
                      
                      <div className="space-y-4 text-xs grow">
                        {/* EloShapes Shape Specifications (If Mouse) */}
                        {item.eloshapes && (
                          <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 space-y-2">
                            <div className="flex items-center justify-between text-rose-400 font-bold text-[11px]">
                              <span>📐 KÍCH THƯỚC ELOSHAPES</span>
                              <span className="font-mono">{item.eloshapes.weightGrams}g</span>
                            </div>
                            <div className="grid grid-cols-3 gap-1 text-center font-mono text-[10px] bg-black/40 p-2 rounded-lg border border-white/5">
                              <div>
                                <span className="text-gray-400 block">Dài (L)</span>
                                <span className="text-cyan-300 font-bold">{item.eloshapes.dimensionsMm.length}mm</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Rộng (W)</span>
                                <span className="text-cyan-300 font-bold">{item.eloshapes.dimensionsMm.width}mm</span>
                              </div>
                              <div>
                                <span className="text-gray-400 block">Cao (H)</span>
                                <span className="text-cyan-300 font-bold">{item.eloshapes.dimensionsMm.height}mm</span>
                              </div>
                            </div>
                            <div className="text-[11px] space-y-1 pt-1">
                              <p className="text-gray-300">
                                <strong className="text-gray-400">Kiểu Form:</strong> {item.eloshapes.shapeType}
                              </p>
                              <p className="text-gray-300">
                                <strong className="text-gray-400">Cảm biến:</strong> {item.eloshapes.sensor}
                              </p>
                              <p className="text-gray-300">
                                <strong className="text-gray-400">Tần số phản hồi:</strong> {item.eloshapes.maxPollingRate}
                              </p>
                              {item.eloshapes.comparableMice && (
                                <div className="text-[10px] text-gray-400 pt-1">
                                  <span>Dáng tương đương: </span>
                                  <span className="text-white font-medium">{item.eloshapes.comparableMice.join(", ")}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        <div>
                          <span className="text-[10px] text-gray-500 uppercase font-bold block mb-1">Thông số kỹ thuật</span>
                          <ul className="space-y-1 text-gray-300">
                            {item.specs.map((spec, i) => (
                              <li key={i} className="flex items-start gap-1.5">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                <span>{spec}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                          <span className="text-[10px] text-rose-400 uppercase font-bold block mb-1">Đánh giá chuyên sâu</span>
                          <p className="text-[11px] leading-relaxed text-gray-300">{item.highlightReason}</p>
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
                        <span>Đánh giá: <strong className="text-amber-400">★ {item.rating}</strong></span>
                        <button
                          onClick={() => removeFromCompare(item.id)}
                          className="text-red-400 hover:text-red-300 hover:underline"
                        >
                          Xóa khỏi so sánh
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SENSITIVITY CONVERTER */}
      {/* ========================================================================= */}
      {activeTab === "sens_converter" && (
        <div className="max-w-4xl mx-auto mt-8 bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-display tracking-wider text-white font-bold">
                CHUYỂN ĐỔI ĐỘ NHẠY CHUỘT (SENS CONVERTER)
              </h2>
              <p className="text-xs text-gray-400">
                Quy đổi chính xác độ nhạy chuột từ CS2, Apex Legends, Overwatch 2, R6 sang VALORANT để giữ nguyên 100% cơ bắp ghi nhớ (Muscle Memory).
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Input Game */}
            <div className="space-y-4 bg-white/5 p-6 rounded-2xl border border-white/10">
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-300">1. Game Gốc Của Bạn</h3>
              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Chọn Tựa Game Nguồn</label>
                <select
                  value={inputGame}
                  onChange={(e) => setInputGame(e.target.value)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 font-medium"
                >
                  <option value="cs2">Counter-Strike 2 / CS:GO</option>
                  <option value="apex">Apex Legends</option>
                  <option value="overwatch">Overwatch 2</option>
                  <option value="r6">Rainbow Six Siege</option>
                  <option value="fortnite">Fortnite</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Độ Nhạy Chuột Trong Game Cũ (Sens)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="100"
                  value={inputSens}
                  onChange={(e) => setInputSens(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">DPI Chuột (Hardware DPI)</label>
                <input
                  type="number"
                  step="50"
                  min="200"
                  max="16000"
                  value={inputDpi}
                  onChange={(e) => setInputDpi(parseInt(e.target.value) || 800)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Output Valorant */}
            <div className="space-y-4 bg-gradient-to-br from-rose-950/40 via-black to-[#111] p-6 rounded-2xl border border-rose-500/30 flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-rose-400 mb-4">2. Kết Quả Trong VALORANT</h3>
                
                <div className="bg-black/60 p-4 rounded-xl border border-white/10 mb-4">
                  <span className="text-xs text-gray-400 block mb-1">VALORANT Sensitivity Cần Chỉnh:</span>
                  <div className="text-4xl font-black font-mono text-rose-400 tracking-wider">
                    {getConvertedValSens()}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs mb-4">
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">VALORANT eDPI</span>
                    <span className="text-xl font-bold font-mono text-cyan-400">{convertedEdpi}</span>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl">
                    <span className="text-gray-400 block text-[10px]">Nhóm Tốc Độ</span>
                    <span className="text-xs font-bold text-white">
                      {convertedEdpi < 200 ? "🐢 Low Sens" : convertedEdpi <= 320 ? "🎯 Mid Meta" : "⚡ High Sens"}
                    </span>
                  </div>
                </div>

                <button
                  onClick={applyConvertedToAdvisor}
                  className="w-full py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-600/30 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Áp Dụng Vào Trình Đánh Giá Cá Nhân Hóa
                </button>
              </div>

              <div className="text-[11px] text-gray-400 bg-white/5 p-3 rounded-xl flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" />
                Hơn 70% tuyển thủ VCT chuyên nghiệp thi đấu ở khoảng eDPI từ 200 đến 280!
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
