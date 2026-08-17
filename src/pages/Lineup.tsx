import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Agent } from "../types";
import { VALORANT_AGENTS, VALORANT_MAP_DETAILS } from "../data/valorant";
import { 
  TACTICAL_ARCHETYPES, 
  TacticalArchetype, 
  MAP_META_PREFERENCES,
  generateTacticalTeam, 
  evaluateTeamComposition, 
  DetailedTeamEvaluation 
} from "../features/teamGenerator";
import { 
  Sparkles, 
  Dices, 
  Swords, 
  Shield, 
  Trophy, 
  Eye, 
  Flame, 
  CheckCircle2, 
  AlertTriangle, 
  Lightbulb, 
  MapPin, 
  Copy, 
  ArrowRight, 
  RotateCw, 
  Zap, 
  Filter,
  CheckCheck,
  Globe2
} from "lucide-react";
import { cn } from "../lib/utils";
import { 
  playUiClick, 
  playLockInSound, 
  playRoleSelect
} from "../lib/soundEngine";

export function Lineup() {
  const [selectedMap, setSelectedMap] = useState<string>("all");
  const [selectedArchetype, setSelectedArchetype] = useState<TacticalArchetype>("tournament");
  const [agents, setAgents] = useState<Agent[]>(() => generateTacticalTeam("tournament", "all"));
  const [isRolling, setIsRolling] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeSlotToSwap, setActiveSlotToSwap] = useState<number | null>(null);
  const [roleFilter, setRoleFilter] = useState<string>("All");

  const evaluation: DetailedTeamEvaluation = useMemo(() => {
    return evaluateTeamComposition(agents, selectedArchetype, selectedMap);
  }, [agents, selectedArchetype, selectedMap]);

  const handleSelectMap = (mapId: string) => {
    playRoleSelect();
    setSelectedMap(mapId);
    triggerRandom(selectedArchetype, mapId);
  };

  const handleSelectArchetype = (arch: TacticalArchetype) => {
    playRoleSelect();
    setSelectedArchetype(arch);
    triggerRandom(arch, selectedMap);
  };

  const triggerRandom = (arch: TacticalArchetype = selectedArchetype, mapId: string = selectedMap) => {
    setIsRolling(true);
    playUiClick();

    let count = 0;
    const interval = setInterval(() => {
      setAgents(generateTacticalTeam(arch, mapId));
      count++;
      if (count >= 5) {
        clearInterval(interval);
        const finalTeam = generateTacticalTeam(arch, mapId);
        setAgents(finalTeam);
        setIsRolling(false);
        playLockInSound();
      }
    }, 70);
  };

  const handleSwapAgent = (slotIndex: number, newAgent: Agent) => {
    playRoleSelect();
    const updated = [...agents];
    // Check if new agent already in team, swap places or replace
    const existingIdx = updated.findIndex((a) => a.id === newAgent.id);
    if (existingIdx >= 0) {
      const temp = updated[slotIndex];
      updated[slotIndex] = updated[existingIdx];
      updated[existingIdx] = temp;
    } else {
      updated[slotIndex] = newAgent;
    }
    setAgents(updated);
    setActiveSlotToSwap(null);
  };

  const activeMapInfo = useMemo(() => {
    if (selectedMap === "all") return null;
    return VALORANT_MAP_DETAILS.find((m) => m.id.toLowerCase() === selectedMap.toLowerCase()) || null;
  }, [selectedMap]);

  const activeMapMeta = useMemo(() => {
    if (selectedMap === "all") return null;
    return MAP_META_PREFERENCES[selectedMap.toLowerCase()] || null;
  }, [selectedMap]);

  const handleCopySummary = () => {
    const mapTitle = activeMapInfo ? `BẢN ĐỒ: ${activeMapInfo.name.toUpperCase()}` : "TẤT CẢ BẢN ĐỒ";
    const text = `🎯 [VALORANT LINEUP STRATEGY - ${mapTitle} - ${TACTICAL_ARCHETYPES[selectedArchetype].name.toUpperCase()}]
🔥 5 Đặc Vụ: ${agents.map((a) => `${a.name} (${a.role})`).join(", ")}
📊 Điểm Đánh Giá Sức Mạnh: ${evaluation.score}/100
- Tấn Công: ${evaluation.stats.attackPower}%
- Phòng Thủ: ${evaluation.stats.defensePower}%
- Thông Tin Recon: ${evaluation.stats.infoGathering}%
- Kiểm Soát Khói: ${evaluation.stats.smokeControl}%
- Khả Năng Clutch: ${evaluation.stats.clutchPotential}%

✨ Điểm Mạnh Cốt Lõi:
${evaluation.keyStrengths.map((s) => `• ${s.title}: ${s.detail}`).join("\n")}

⚠️ Điểm Yếu Cần Lưu Ý:
${evaluation.keyWeaknesses.map((w) => `• ${w.title}: ${w.detail}`).join("\n")}

💡 Lời Khuyên Chiến Thuật:
${evaluation.tacticalAdvice.map((a) => `• ${a}`).join("\n")}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const archInfo = TACTICAL_ARCHETYPES[selectedArchetype];

  const filteredAgentsForSwap = useMemo(() => {
    if (roleFilter === "All") return VALORANT_AGENTS;
    return VALORANT_AGENTS.filter((a) => a.role === roleFilter);
  }, [roleFilter]);

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent/20 border border-accent/40 flex items-center justify-center text-accent shadow-[0_0_20px_rgba(234,179,8,0.3)]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display uppercase tracking-widest text-white">
                VALORANT LINEUP & TRỢ LÝ CHIẾN THUẬT THEO MAP
              </h1>
              <p className="text-xs md:text-sm text-white/50">
                Chọn Bản Đồ trước, sau đó chọn Tiêu Chí Chiến Thuật để Random đội hình 5 đặc vụ tối ưu nhất
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleCopySummary}
            className="px-4 py-2.5 rounded-full text-xs font-display uppercase tracking-widest bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all border border-white/10 flex items-center gap-2"
          >
            {copied ? <CheckCheck className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            {copied ? "ĐÃ SAO CHÉP CHIẾN THUẬT" : "SAO CHÉP TỔNG HỢP"}
          </button>

          <button
            onClick={() => triggerRandom()}
            disabled={isRolling}
            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-accent to-yellow-500 text-black font-display text-xs uppercase tracking-widest font-bold shadow-[0_0_25px_rgba(234,179,8,0.4)] hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Dices className={cn("w-4 h-4", isRolling && "animate-spin")} />
            {isRolling ? "ĐANG RANDOM..." : "RANDOM 5 ĐẶC VỤ PHÙ HỢP"}
          </button>

          <Link
            to="/lobby"
            className="px-5 py-2.5 rounded-full bg-primary/20 hover:bg-primary text-primary hover:text-black border border-primary/40 transition-all font-display text-xs uppercase tracking-widest font-bold flex items-center gap-1.5"
          >
            Vào Phòng Draft <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* STEP 1: Map Selector (BƯỚC 1: CHỌN BẢN ĐỒ THI ĐẤU) */}
      <div className="space-y-3 bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent text-black font-bold text-xs flex items-center justify-center font-display">
              1
            </span>
            <span className="text-sm font-display text-white uppercase tracking-widest flex items-center gap-2 font-bold">
              <Globe2 className="w-4 h-4 text-accent" />
              BƯỚC 1: CHỌN BẢN ĐỒ THI ĐẤU (MAP SELECTION)
            </span>
          </div>
          <span className="text-xs text-white/50">
            {activeMapInfo ? `Đang chọn: Map ${activeMapInfo.name} (${activeMapInfo.sites})` : "Đang chọn: Tất cả bản đồ (Tổng hợp chung)"}
          </span>
        </div>

        {/* Map Grid Carousel */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-2 pt-2">
          {/* Option All Maps */}
          <button
            onClick={() => handleSelectMap("all")}
            className={cn(
              "h-24 rounded-2xl border flex flex-col justify-between p-2.5 text-left transition-all duration-200 relative overflow-hidden group cursor-pointer",
              selectedMap === "all"
                ? "bg-accent/20 border-accent ring-2 ring-accent shadow-[0_0_20px_rgba(234,179,8,0.3)]"
                : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/5"
            )}
          >
            <div className="flex items-center justify-between w-full">
              <Globe2 className={cn("w-4 h-4", selectedMap === "all" ? "text-accent" : "text-white/40")} />
              {selectedMap === "all" && (
                <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              )}
            </div>
            <div>
              <div className="text-xs font-display uppercase tracking-wider text-white font-bold">
                TẤT CẢ
              </div>
              <div className="text-[9px] text-white/40 truncate">Meta Chung</div>
            </div>
          </button>

          {/* 11 Valorant Maps */}
          {VALORANT_MAP_DETAILS.map((map) => {
            const isSelected = selectedMap.toLowerCase() === map.id.toLowerCase();
            return (
              <button
                key={map.id}
                onClick={() => handleSelectMap(map.id)}
                className={cn(
                  "h-24 rounded-2xl border flex flex-col justify-between p-2.5 text-left transition-all duration-300 relative overflow-hidden group cursor-pointer shadow-md",
                  isSelected
                    ? "border-accent ring-2 ring-accent shadow-[0_0_25px_rgba(234,179,8,0.4)] scale-105"
                    : "border-white/10 hover:border-white/40 hover:scale-[1.02]"
                )}
              >
                {/* Background Map Splash */}
                <img
                  src={map.splash}
                  alt={map.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:opacity-75 group-hover:scale-110 transition-all duration-500 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent pointer-events-none" />

                <div className="relative z-10 flex items-center justify-between w-full">
                  <MapPin className={cn("w-3.5 h-3.5", isSelected ? "text-accent" : "text-white/60")} />
                  {isSelected && (
                    <span className="text-[8px] bg-accent text-black font-extrabold px-1.5 py-0.2 rounded uppercase">
                      Chọn
                    </span>
                  )}
                </div>

                <div className="relative z-10">
                  <div className="text-xs font-display uppercase tracking-wider text-white font-bold drop-shadow">
                    {map.name}
                  </div>
                  <div className="text-[8px] text-white/60 truncate drop-shadow">
                    {map.sites.split("•")[0]}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Map Meta Highlight Banner */}
        {activeMapMeta && activeMapInfo && (
          <div className="mt-3 p-3.5 rounded-2xl bg-accent/[0.06] border border-accent/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <img
                src={activeMapInfo.splash}
                alt={activeMapInfo.name}
                className="w-14 h-10 rounded-lg object-cover border border-accent/40 shadow-sm flex-shrink-0"
              />
              <div>
                <div className="font-display text-accent uppercase font-bold tracking-wider flex items-center gap-2">
                  <span>🗺️ ĐẶC TRƯNG META MAP {activeMapInfo.name.toUpperCase()}</span>
                  <span className="text-white/40 text-[10px] font-normal">({activeMapInfo.country} • {activeMapInfo.sites})</span>
                </div>
                <p className="text-white/70 mt-0.5 leading-relaxed">{activeMapMeta.mapNotes}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-wrap text-[11px] bg-black/40 p-2 rounded-xl border border-white/10">
              <span className="text-white/50 font-bold uppercase">Ưu Tiên Meta:</span>
              <span className="text-purple-300 font-bold">{activeMapMeta.bestControllers.join(", ")} (Smokes)</span>
              <span className="text-white/20">•</span>
              <span className="text-emerald-300 font-bold">{activeMapMeta.bestSentinels.join(", ")} (Anchor)</span>
            </div>
          </div>
        )}
      </div>

      {/* STEP 2: 5 Tactical Archetypes Selector (BƯỚC 2: CHỌN TIÊU CHÍ ĐÁNH GIÁ CHIẾN THUẬT) */}
      <div className="space-y-3 bg-[#0a0a0a] border border-white/10 rounded-3xl p-5 md:p-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-accent text-black font-bold text-xs flex items-center justify-center font-display">
              2
            </span>
            <span className="text-sm font-display text-white uppercase tracking-widest flex items-center gap-2 font-bold">
              <Filter className="w-4 h-4 text-accent" />
              BƯỚC 2: CHỌN TIÊU CHÍ ĐÁNH GIÁ CHIẾN THUẬT (TACTICAL ARCHETYPE)
            </span>
          </div>
          <span className="text-xs text-white/40">Hệ thống sẽ kết hợp Bản Đồ & Tiêu Chí để Random 5 Tướng phù hợp nhất</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            {
              id: "atk",
              icon: Swords,
              title: "Mạnh Tấn Công",
              sub: "Heavy ATK Rush",
              desc: "2 Duelist + Flash/Stun dồn hỏa lực ép góc chiếm Site thần tốc",
              color: "text-rose-400",
              border: "border-rose-500/40",
              bg: "bg-rose-500/10",
            },
            {
              id: "def",
              icon: Shield,
              title: "Mạnh Phòng Thủ",
              sub: "Heavy DEF Anchor",
              desc: "2 Sentinel + Smoker câu giờ, bẫy dày đặc chặn mọi đợt đẩy",
              color: "text-emerald-400",
              border: "border-emerald-500/40",
              bg: "bg-emerald-500/10",
            },
            {
              id: "tournament",
              icon: Trophy,
              title: "Bắn Giải VCT Meta",
              sub: "Pro Tournament",
              desc: "1 Entry + 1 Recon + 1 Flash + 1 Controller + 1 Sentinel toàn diện",
              color: "text-accent",
              border: "border-accent/40",
              bg: "bg-accent/10",
            },
            {
              id: "recon",
              icon: Eye,
              title: "Lấy Thông Tin",
              sub: "Recon & Info First",
              desc: "Double Recon (Sova/Fade) quét sạch bóng địch trước khi giao tranh",
              color: "text-cyan-400",
              border: "border-cyan-500/40",
              bg: "bg-cyan-500/10",
            },
            {
              id: "ranked",
              icon: Flame,
              title: "Bắn Rank SoloQ",
              sub: "Fragging & Carry",
              desc: "Tự hồi máu, hồi sinh, gánh team & thắng mọi kèo đấu súng 1v1",
              color: "text-purple-400",
              border: "border-purple-500/40",
              bg: "bg-purple-500/10",
            },
          ].map((item) => {
            const Icon = item.icon;
            const isSelected = selectedArchetype === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectArchetype(item.id as TacticalArchetype)}
                className={cn(
                  "p-4 rounded-2xl border text-left transition-all duration-300 flex flex-col justify-between gap-3 relative overflow-hidden group cursor-pointer",
                  isSelected
                    ? "bg-white/10 border-accent shadow-[0_0_25px_rgba(234,179,8,0.25)] ring-1 ring-accent scale-[1.02]"
                    : "bg-[#0c0c0c] border-white/10 hover:border-white/25 hover:bg-white/5"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center border", item.bg, item.border, item.color)}>
                    <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                  </div>
                  {isSelected && (
                    <span className="text-[10px] bg-accent text-black font-extrabold px-2 py-0.5 rounded uppercase">
                      Đang kích hoạt
                    </span>
                  )}
                </div>

                <div>
                  <div className="text-sm font-display uppercase tracking-wider text-white font-bold">
                    {item.title}
                  </div>
                  <div className={cn("text-[10px] font-bold uppercase tracking-widest mt-0.5", item.color)}>
                    {item.sub}
                  </div>
                  <p className="text-xs text-white/50 mt-1.5 leading-relaxed line-clamp-2">
                    {item.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 3: 5 Agent Lineup Cards (KẾT QUẢ ĐỘI HÌNH 5 ĐẶC VỤ) */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent" />
            <h2 className="text-sm font-display uppercase tracking-widest text-white">
              Đội Hình 5 Đặc Vụ Tuyển Chọn ({activeMapInfo ? `Map ${activeMapInfo.name}` : "Mọi Map"} • {archInfo.name})
            </h2>
          </div>
          <div className="text-xs text-white/60 flex items-center gap-2">
            <span>Click vào bất kỳ thẻ tướng nào để đổi đặc vụ thủ công</span>
            <span className="text-white/20">•</span>
            <span className="text-accent font-bold">
              {agents.filter((a) => a.role === "Duelist").length} Duelist •{" "}
              {agents.filter((a) => a.role === "Initiator").length} Initiator •{" "}
              {agents.filter((a) => a.role === "Controller").length} Controller •{" "}
              {agents.filter((a) => a.role === "Sentinel").length} Sentinel
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {agents.map((agent, idx) => (
            <div
              key={`${agent.id}-${idx}`}
              onClick={() => setActiveSlotToSwap(idx)}
              className={cn(
                "h-72 rounded-3xl border bg-[#0a0a0a] relative overflow-hidden flex flex-col justify-between p-5 transition-all duration-300 group cursor-pointer shadow-xl",
                activeSlotToSwap === idx
                  ? "border-accent ring-2 ring-accent shadow-[0_0_30px_rgba(234,179,8,0.3)]"
                  : "border-white/15 hover:border-white/40 hover:scale-[1.02]"
              )}
            >
              {/* Full Artwork Background */}
              <img
                src={agent.fullPortrait || agent.image}
                alt={agent.name}
                className="absolute inset-0 w-full h-full object-cover object-top opacity-40 group-hover:opacity-75 group-hover:scale-105 transition-all duration-500 pointer-events-none"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent pointer-events-none" />

              {/* Top Slot & Role Badge */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="w-7 h-7 rounded-full bg-black/80 border border-white/20 flex items-center justify-center font-display text-xs text-white/70">
                  #{idx + 1}
                </div>

                <span
                  className={cn(
                    "text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border shadow-md backdrop-blur-sm",
                    agent.role === "Duelist"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : agent.role === "Initiator"
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40"
                      : agent.role === "Controller"
                      ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  )}
                >
                  {agent.role}
                </span>
              </div>

              {/* Bottom Agent Information */}
              <div className="relative z-10">
                <div className="text-2xl font-display text-white uppercase tracking-wider drop-shadow-md">
                  {agent.name}
                </div>
                <p className="text-xs text-white/60 line-clamp-1 mt-0.5 leading-relaxed font-mono">
                  {agent.role === "Duelist" ? "⚔️ Main Entry / Fragger" : agent.role === "Initiator" ? "🎯 Recon & Flash Setup" : agent.role === "Controller" ? "☁️ Vision Block & Map Control" : "🛡️ Site Anchor & Defense"}
                </p>

                <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[10px] text-white/40 uppercase tracking-widest group-hover:text-accent transition-colors">
                  <span className="flex items-center gap-1">
                    <RotateCw className="w-3 h-3" /> Đổi Đặc Vụ
                  </span>
                  <span className="font-bold">SLOT #{idx + 1}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Manual Swap Drawer / Agent Picker Modal */}
      {activeSlotToSwap !== null && (
        <div className="p-5 rounded-3xl bg-[#0c0c0c] border border-accent/40 shadow-2xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <h3 className="text-sm font-display uppercase tracking-widest text-white flex items-center gap-2">
                <RotateCw className="w-4 h-4 text-accent" />
                Thay Đổi Đặc Vụ Cho Slot #{activeSlotToSwap + 1} (Đang là {agents[activeSlotToSwap].name})
              </h3>
              <p className="text-xs text-white/40">Chọn đặc vụ bên dưới để tự động tính toán lại điểm mạnh và điểm yếu</p>
            </div>

            <div className="flex items-center gap-2">
              {["All", "Duelist", "Initiator", "Controller", "Sentinel"].map((r) => (
                <button
                  key={r}
                  onClick={() => setRoleFilter(r)}
                  className={cn(
                    "px-3 py-1 rounded-lg text-xs font-display uppercase tracking-wider transition-all border",
                    roleFilter === r
                      ? "bg-accent text-black border-accent font-bold"
                      : "bg-white/5 text-white/60 border-white/10 hover:bg-white/10"
                  )}
                >
                  {r}
                </button>
              ))}
              <button
                onClick={() => setActiveSlotToSwap(null)}
                className="px-3 py-1 rounded-lg text-xs bg-white/10 text-white/70 hover:text-white"
              >
                Đóng
              </button>
            </div>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-9 lg:grid-cols-13 gap-2 max-h-60 overflow-y-auto pr-1">
            {filteredAgentsForSwap.map((agent) => {
              const isCurrent = agents[activeSlotToSwap].id === agent.id;
              const isAlreadyInTeam = agents.some((a) => a.id === agent.id);

              return (
                <button
                  key={agent.id}
                  onClick={() => handleSwapAgent(activeSlotToSwap, agent)}
                  className={cn(
                    "p-2 rounded-xl border flex flex-col items-center gap-1.5 transition-all relative group cursor-pointer",
                    isCurrent
                      ? "bg-accent/20 border-accent ring-1 ring-accent"
                      : isAlreadyInTeam
                      ? "bg-white/5 border-white/10 opacity-60 hover:opacity-100"
                      : "bg-white/[0.02] border-white/10 hover:border-white/30 hover:bg-white/10"
                  )}
                >
                  <img
                    src={agent.image}
                    alt={agent.name}
                    className="w-10 h-10 rounded-lg object-cover bg-black/40 border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <span className="text-[10px] font-display text-white uppercase tracking-wider truncate w-full text-center">
                    {agent.name}
                  </span>
                  {isCurrent && (
                    <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Assistant Detailed Evaluation & Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Score Card & 5 Stat Bars */}
        <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs font-display text-white/50 uppercase tracking-widest">
                  Chỉ Số Năng Lực Đội Hình
                </span>
                <h3 className="text-lg font-display text-white uppercase tracking-wider mt-0.5">
                  Đánh Giá Tổng Quan
                </h3>
              </div>

              <div className="text-right">
                <div className="text-3xl font-display text-accent font-bold drop-shadow-[0_0_20px_rgba(234,179,8,0.5)]">
                  {evaluation.score}<span className="text-xs text-white/40 font-normal">/100</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-widest bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                  {evaluation.score >= 80 ? "HẠNG S+ META" : evaluation.score >= 65 ? "HẠNG A CÂN BẰNG" : "HẠNG B CẦN LƯU Ý"}
                </span>
              </div>
            </div>

            {/* 5 Stat Meters */}
            <div className="space-y-4">
              {[
                { label: "Sức Mạnh Tấn Công (ATK)", value: evaluation.stats.attackPower, color: "bg-rose-500" },
                { label: "Sức Mạnh Phòng Thủ (DEF)", value: evaluation.stats.defensePower, color: "bg-emerald-500" },
                { label: "Thu Thập Thông Tin Recon", value: evaluation.stats.infoGathering, color: "bg-cyan-500" },
                { label: "Kiểm Soát Khói & Tầm Nhìn", value: evaluation.stats.smokeControl, color: "bg-purple-500" },
                { label: "Khả Năng Gánh Kèo Clutch", value: evaluation.stats.clutchPotential, color: "bg-amber-400" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-1.5">
                    <span className="text-white/60">{stat.label}</span>
                    <span className="text-white">{stat.value}%</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all duration-700", stat.color)}
                      style={{ width: `${stat.value}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Maps Section */}
          <div className="pt-5 border-t border-white/10">
            <span className="text-xs font-bold text-accent uppercase tracking-widest flex items-center gap-1.5 mb-3">
              <MapPin className="w-4 h-4" /> {activeMapInfo ? `Bản Đồ Đang Thi Đấu: ${activeMapInfo.name}` : "Bản Đồ Phát Huy Sức Mạnh Tối Đa"}
            </span>
            <div className="space-y-2">
              {activeMapInfo ? (
                <div className="text-xs bg-accent/10 p-3 rounded-xl border border-accent/20 flex items-start gap-2">
                  <span className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                  <div>
                    <span className="font-display text-white uppercase font-bold mr-1">{activeMapInfo.name} ({activeMapInfo.sites}):</span>
                    <span className="text-white/70">{activeMapMeta?.mapNotes || "Đội hình đã được tối ưu cho địa hình của bản đồ này."}</span>
                  </div>
                </div>
              ) : (
                evaluation.recommendedMaps.map((m, idx) => (
                  <div key={idx} className="text-xs bg-white/5 p-3 rounded-xl border border-white/5 flex items-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent mt-1 flex-shrink-0" />
                    <div>
                      <span className="font-display text-white uppercase font-bold mr-1">{m.name}:</span>
                      <span className="text-white/50">{m.reason}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Strengths, Weaknesses & Tactical Playbook */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Key Strengths */}
          <div className="bg-emerald-500/[0.04] border border-emerald-500/20 rounded-3xl p-6">
            <h4 className="text-xs md:text-sm font-display text-emerald-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              Điểm Mạnh Cốt Lõi (Key Strengths)
            </h4>
            <div className="space-y-3">
              {evaluation.keyStrengths.map((s, idx) => (
                <div key={idx} className="bg-black/50 border border-emerald-500/15 rounded-2xl p-4">
                  <div className="text-xs md:text-sm font-display text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    {s.title}
                  </div>
                  <p className="text-xs text-white/65 leading-relaxed">{s.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Weaknesses & Vulnerabilities */}
          <div className="bg-rose-500/[0.04] border border-rose-500/20 rounded-3xl p-6">
            <h4 className="text-xs md:text-sm font-display text-rose-400 uppercase tracking-widest flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-rose-400" />
              Điểm Yếu Cần Cảnh Giác (Weaknesses & Risk Factors)
            </h4>
            <div className="space-y-3">
              {evaluation.keyWeaknesses.map((w, idx) => (
                <div key={idx} className="bg-black/50 border border-rose-500/15 rounded-2xl p-4">
                  <div className="text-xs md:text-sm font-display text-white uppercase tracking-wider mb-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    {w.title}
                  </div>
                  <p className="text-xs text-white/65 leading-relaxed">{w.detail}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tactical Playbook Guide */}
          <div className="bg-accent/[0.04] border border-accent/20 rounded-3xl p-6">
            <h4 className="text-xs md:text-sm font-display text-accent uppercase tracking-widest flex items-center gap-2 mb-3">
              <Lightbulb className="w-5 h-5 text-accent" />
              Trợ Lý Hướng Dẫn Vận Hành Chiến Thuật {activeMapInfo ? `Tại Map ${activeMapInfo.name.toUpperCase()}` : ""}
            </h4>
            <div className="space-y-2">
              {evaluation.tacticalAdvice.map((adv, idx) => (
                <div key={idx} className="text-xs text-white/80 bg-black/40 border border-accent/10 rounded-xl p-3 flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                  <span className="leading-relaxed">{adv}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
