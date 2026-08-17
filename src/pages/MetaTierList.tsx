import { useState } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Award, 
  Filter, 
  Sparkles, 
  Layers, 
  ShieldAlert, 
  Zap, 
  Users, 
  MapPin, 
  ChevronRight,
  Flame
} from "lucide-react";
import { AGENT_TIER_LIST, AgentTierDetail } from "../data/tierList";
import { sound } from "../lib/sounds";

export function MetaTierList() {
  const [selectedMap, setSelectedMap] = useState<string>("ALL");
  const [selectedRole, setSelectedRole] = useState<string>("ALL");
  const [selectedElo, setSelectedElo] = useState<string>("PRO");
  const [activeAgent, setActiveAgent] = useState<AgentTierDetail | null>(null);

  // Custom Tier Maker State
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [customTiers, setCustomTiers] = useState<{ [key: string]: AgentTierDetail[] }>({
    S: [],
    A: [],
    B: [],
    C: []
  });

  const maps = ["ALL", "Ascent", "Bind", "Breeze", "Haven", "Icebox", "Lotus", "Sunset", "Split"];

  // Filter agents and compute effective tier based on map
  const getAgentEffectiveTier = (agent: AgentTierDetail): "S" | "A" | "B" | "C" => {
    if (selectedMap === "ALL") return agent.tier;
    if (agent.bestMaps.map(m => m.toLowerCase()).includes(selectedMap.toLowerCase())) {
      // Promotion on home map
      if (agent.tier === "A") return "S";
      if (agent.tier === "B") return "A";
      return "S";
    }
    if (agent.worstMaps.map(m => m.toLowerCase()).includes(selectedMap.toLowerCase())) {
      // Demotion on weak map
      if (agent.tier === "S") return "A";
      if (agent.tier === "A") return "B";
      return "C";
    }
    return agent.tier;
  };

  const filteredAgents = AGENT_TIER_LIST.filter((ag) => {
    const matchRole = selectedRole === "ALL" || ag.role.toUpperCase() === selectedRole.toUpperCase();
    return matchRole;
  });

  const groupedByTier = {
    S: filteredAgents.filter(ag => getAgentEffectiveTier(ag) === "S"),
    A: filteredAgents.filter(ag => getAgentEffectiveTier(ag) === "A"),
    B: filteredAgents.filter(ag => getAgentEffectiveTier(ag) === "B"),
    C: filteredAgents.filter(ag => getAgentEffectiveTier(ag) === "C")
  };

  const tierColors = {
    S: { bg: "bg-rose-600", text: "text-rose-400", border: "border-rose-500", badge: "bg-rose-500/20 text-rose-300" },
    A: { bg: "bg-orange-500", text: "text-orange-400", border: "border-orange-500", badge: "bg-orange-500/20 text-orange-300" },
    B: { bg: "bg-amber-500", text: "text-amber-400", border: "border-amber-500", badge: "bg-amber-500/20 text-amber-300" },
    C: { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500", badge: "bg-blue-500/20 text-blue-300" }
  };

  const addAgentToCustomTier = (tierKey: "S" | "A" | "B" | "C", agent: AgentTierDetail) => {
    sound.playClick();
    setCustomTiers(prev => {
      // Remove from all other tiers
      const cleaned: { [key: string]: AgentTierDetail[] } = {
        S: prev.S.filter(a => a.id !== agent.id),
        A: prev.A.filter(a => a.id !== agent.id),
        B: prev.B.filter(a => a.id !== agent.id),
        C: prev.C.filter(a => a.id !== agent.id)
      };
      cleaned[tierKey] = [...cleaned[tierKey], agent];
      return cleaned;
    });
  };

  return (
    <div className="min-h-screen bg-[#080808] text-white p-6 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-rose-500/20 text-rose-400 rounded-lg border border-rose-500/30">
              <Award className="w-6 h-6" />
            </div>
            <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white">
              BẢNG XẾP HẠNG META & TIER LIST ĐẶC VỤ
            </h1>
          </div>
          <p className="text-sm text-gray-400">
            Xếp hạng sức mạnh 26 đặc vụ (S/A/B/C) theo từng bản đồ, tỉ lệ thắng (Win Rate) và mức rank thi đấu.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { sound.playClick(); setIsCustomMode(!isCustomMode); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              isCustomMode
                ? "bg-rose-600 text-white shadow-lg shadow-rose-600/30"
                : "bg-white/5 border border-white/10 text-gray-300 hover:text-white"
            }`}
          >
            <Sparkles className="w-4 h-4" />
            {isCustomMode ? "Trở Về Meta Chuẩn" : "Tự Tạo Tier List Riêng"}
          </button>
        </div>
      </div>

      {!isCustomMode ? (
        <>
          {/* Filter Bar */}
          <div className="mt-6 bg-[#111] p-4 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Map Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
              <span className="text-xs text-gray-500 font-bold uppercase shrink-0 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" /> Map:
              </span>
              <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto">
                {maps.map((m) => (
                  <button
                    key={m}
                    onClick={() => { sound.playClick(); setSelectedMap(m); }}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                      selectedMap === m ? "bg-rose-600 text-white shadow-md shadow-rose-600/30" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {m === "ALL" ? "Toàn Bộ Map" : m}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Filter */}
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto justify-end">
              <span className="text-xs text-gray-500 font-bold uppercase shrink-0">Role:</span>
              {["ALL", "Duelist", "Initiator", "Controller", "Sentinel"].map((r) => (
                <button
                  key={r}
                  onClick={() => { sound.playClick(); setSelectedRole(r); }}
                  className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                    selectedRole === r ? "bg-white text-black font-bold" : "bg-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  {r === "ALL" ? "Tất Cả" : r}
                </button>
              ))}
            </div>
          </div>

          {/* Tier Rows (S, A, B, C) */}
          <div className="space-y-4 mt-6">
            {(["S", "A", "B", "C"] as const).map((tierKey) => {
              const agents = groupedByTier[tierKey];
              const tColor = tierColors[tierKey];

              return (
                <div
                  key={tierKey}
                  className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row items-stretch"
                >
                  {/* Tier Label Column */}
                  <div className={`w-full md:w-28 ${tColor.bg} flex md:flex-col items-center justify-center p-4 gap-1 shrink-0`}>
                    <span className="text-3xl md:text-4xl font-black font-display text-white">{tierKey}</span>
                    <span className="text-[10px] uppercase font-bold text-white/80 tracking-widest">
                      {tierKey === "S" ? "God Tier" : tierKey === "A" ? "Strong" : tierKey === "B" ? "Viable" : "Niche"}
                    </span>
                  </div>

                  {/* Agents In Tier */}
                  <div className="flex-1 p-4 flex flex-wrap gap-4 items-center min-h-[100px] bg-black/40">
                    {agents.length === 0 ? (
                      <span className="text-xs text-gray-500 italic">Không có đặc vụ phù hợp bộ lọc...</span>
                    ) : (
                      agents.map((ag) => (
                        <div
                          key={ag.id}
                          id={`tier-agent-${ag.id}`}
                          onClick={() => {
                            sound.playClick();
                            setActiveAgent(ag);
                          }}
                          className="flex items-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-rose-500/50 p-2 rounded-2xl transition-all duration-300 cursor-pointer group hover:scale-105"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gray-900 overflow-hidden border ${tColor.border} relative shrink-0`}>
                            <img 
                              src={ag.avatar} 
                              alt={ag.name} 
                              referrerPolicy="no-referrer"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${ag.name}`;
                              }}
                              className="w-full h-full object-cover" 
                            />
                          </div>
                          <div className="pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="font-display tracking-wider text-sm font-bold text-white group-hover:text-rose-400 transition-colors">
                                {ag.name}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-0.5">
                              <span className="text-emerald-400 font-mono font-bold">{ag.winRate}% WR</span>
                              <span>•</span>
                              <span className="text-cyan-400 font-mono">{ag.pickRate}% Pick</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      ) : (
        /* Custom Tier List Maker */
        <div className="mt-6 space-y-6">
          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center justify-between">
            <p className="text-xs text-gray-300">
              Nhấp vào nút Tier bên dưới mỗi Agent để xếp họ vào bảng phân hạng cá nhân của bạn!
            </p>
            <button
              onClick={() => setCustomTiers({ S: [], A: [], B: [], C: [] })}
              className="text-xs text-rose-400 hover:text-rose-300 font-semibold"
            >
              Làm Mới Toàn Bộ
            </button>
          </div>

          {/* Custom Tier Rows */}
          {(["S", "A", "B", "C"] as const).map((tierKey) => (
            <div key={tierKey} className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-sm shadow-black">
              <div className={`w-full md:w-28 ${tierColors[tierKey].bg} flex items-center justify-center p-4 text-3xl font-black text-white shrink-0 font-display tracking-widest`}>
                {tierKey}
              </div>
              <div className="flex-1 p-4 flex flex-wrap gap-3 items-center min-h-[100px] bg-black/40">
                {customTiers[tierKey].length === 0 ? (
                  <span className="text-xs text-gray-600">Chưa có đặc vụ nào trong Tier {tierKey}</span>
                ) : (
                  customTiers[tierKey].map((ag) => (
                    <div key={ag.id} className={`flex items-center gap-2 bg-white/5 hover:bg-white/10 p-1.5 pr-3 rounded-xl border ${tierColors[tierKey].border} transition-colors group cursor-pointer`} onClick={() => setActiveAgent(ag)}>
                      <img 
                        src={ag.avatar} 
                        alt={ag.name} 
                        referrerPolicy="no-referrer"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${ag.name}`;
                        }}
                        className="w-10 h-10 rounded-lg object-cover border border-white/10" 
                      />
                      <span className="text-xs font-bold text-white group-hover:text-rose-300">{ag.name}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))}

          {/* Available Agents Pool */}
          <div className="bg-[#111] p-6 rounded-2xl border border-white/10 space-y-4 shadow-sm shadow-black">
            <h3 className="font-display tracking-wider text-base text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" /> KHO ĐẶC VỤ CHƯA XẾP HẠNG
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {AGENT_TIER_LIST.map((ag) => (
                <div key={ag.id} className="bg-black/60 p-4 rounded-2xl border border-white/5 flex flex-col items-center gap-3 text-center hover:border-white/20 transition-colors">
                  <div className="w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                    <img 
                      src={ag.avatar} 
                      alt={ag.name} 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${ag.name}`;
                      }}
                      className="w-full h-full object-cover hover:scale-110 transition-transform" 
                    />
                  </div>
                  <span className="text-xs font-bold text-white tracking-wide">{ag.name}</span>
                  <div className="flex gap-1.5 w-full">
                    {(["S", "A", "B", "C"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => addAgentToCustomTier(t, ag)}
                        className={`flex-1 py-1 rounded text-xs font-black text-white flex items-center justify-center ${tierColors[t].bg} hover:brightness-110 hover:scale-105 transition-all shadow-md shadow-black`}
                        title={`Thêm vào Tier ${t}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {activeAgent && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveAgent(null)}
        >
          <div
            className="bg-[#111] border border-white/15 rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl relative space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-gray-800 border-2 border-rose-500 overflow-hidden shadow-xl">
                  <img 
                    src={activeAgent.avatar} 
                    alt={activeAgent.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${activeAgent.name}`;
                    }}
                    className="w-full h-full object-cover" 
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-display tracking-wider text-white">{activeAgent.name}</h2>
                    <span className="px-2 py-0.5 rounded text-xs font-bold bg-rose-600 text-white">
                      Tier {activeAgent.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">{activeAgent.role} • {activeAgent.prosUsage}</p>
                </div>
              </div>

              <button
                onClick={() => setActiveAgent(null)}
                className="w-8 h-8 rounded-full bg-white/10 text-gray-400 hover:text-white flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Tỉ Lệ Thắng</span>
                <span className="text-xl font-bold font-mono text-emerald-400">{activeAgent.winRate}%</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">Tỉ Lệ Chọn</span>
                <span className="text-xl font-bold font-mono text-cyan-400">{activeAgent.pickRate}%</span>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5 text-center">
                <span className="text-[10px] text-gray-400 uppercase block">K/D Trung Bình</span>
                <span className="text-xl font-bold font-mono text-amber-400">{activeAgent.kdRatio}</span>
              </div>
            </div>

            {/* Meta Analysis */}
            <div className="bg-black/60 p-4 rounded-2xl border border-white/10 space-y-2 text-xs">
              <span className="font-bold text-gray-300 uppercase tracking-wider block">Đánh Giá Meta & Lối Chơi</span>
              <p className="text-gray-300 leading-relaxed">{activeAgent.metaSummary}</p>
            </div>

            {/* Synergies & Maps */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-emerald-400 block mb-1">Map Khỏe Nhất:</span>
                <div className="flex flex-wrap gap-1">
                  {activeAgent.bestMaps.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white/5 p-3.5 rounded-xl border border-white/5 space-y-1">
                <span className="font-bold text-purple-400 block mb-1">Cặp Đôi Ăn Ý Nhất (Duo):</span>
                <div className="flex flex-wrap gap-1">
                  {activeAgent.bestSynergies.map((syn) => (
                    <span key={syn} className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-semibold">
                      {syn}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setActiveAgent(null)}
              className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Đóng Lại
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
