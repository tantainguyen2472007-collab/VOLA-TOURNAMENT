import { useState } from "react";
import { 
  Target, 
  MapPin, 
  Search, 
  Bookmark, 
  BookmarkCheck, 
  Sparkles, 
  Shield, 
  Swords, 
  Flame, 
  Zap, 
  Eye, 
  Layers,
  ChevronRight,
  CheckCircle2,
  Copy,
  Check,
  Terminal,
  Crosshair,
  HelpCircle,
  Award,
  ChevronLeft,
  Share2,
  Info,
  Maximize2,
  AlertTriangle
} from "lucide-react";
import { MAP_LINEUPS_DATA, AbilityLineup, CUSTOM_GAME_COMMANDS, LINEUP_SOURCE_STATE } from "../data/mapLineups";
import { InGameHUDVisualizer } from "../components/InGameHUDVisualizer";
import { sound } from "../lib/sounds";

export function MapLineups() {
  const [selectedMap, setSelectedMap] = useState<string>("ALL");
  const [selectedAgent, setSelectedAgent] = useState<string>("ALL");
  const [selectedSide, setSelectedSide] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [selectedSite, setSelectedSite] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [viewTab, setViewTab] = useState<"all" | "bookmarked" | "mastered">("all");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCustomCheatGuide, setShowCustomCheatGuide] = useState<boolean>(false);

  // Persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("valorant_bookmarked_lineups");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [masteredIds, setMasteredIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("valorant_mastered_lineups");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modal active lineup & current step
  const [activeLineup, setActiveLineup] = useState<AbilityLineup | null>(null);
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);

  const mapsList = ["ALL", "Ascent", "Bind", "Haven", "Sunset", "Lotus", "Breeze", "Icebox", "Split", "Abyss"];
  const agentsList = ["ALL", "Sova", "Viper", "Brimstone", "Cypher", "Killjoy", "Fade", "KAY/O", "Omen"];
  const typesList = ["ALL", "Recon", "Molly/Damage", "Smoke/Wall", "Trap/Setup", "Flash/Knife", "Ultimate"];
  const sidesList = ["ALL", "Attacker", "Defender", "Post-Plant", "Retake"];

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const next = bookmarkedIds.includes(id) 
      ? bookmarkedIds.filter(b => b !== id) 
      : [...bookmarkedIds, id];
    setBookmarkedIds(next);
    localStorage.setItem("valorant_bookmarked_lineups", JSON.stringify(next));
  };

  const toggleMastered = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const next = masteredIds.includes(id)
      ? masteredIds.filter(m => m !== id)
      : [...masteredIds, id];
    setMasteredIds(next);
    localStorage.setItem("valorant_mastered_lineups", JSON.stringify(next));
  };

  const handleCopyGuide = (lineup: AbilityLineup, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    sound.playClick();
    const text = `🎯 [VALORANT LINEUP] ${lineup.title}
🗺️ Map: ${lineup.map} (Site ${lineup.site} - Phe ${lineup.side})
👤 Agent: ${lineup.agent} | Kỹ năng: ${lineup.abilityName}
📍 Đứng: ${lineup.standingPos}
🎯 Căn: ${lineup.aimMarker}
⚡ Lực: ${lineup.powerBounce}
💥 Rơi: ${lineup.landingZone}
💡 Mẹo: ${lineup.visualHudAlignment.movementNote}`;
    navigator.clipboard.writeText(text);
    setCopiedId(lineup.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const filteredLineups = MAP_LINEUPS_DATA.filter((item) => {
    if (viewTab === "bookmarked" && !bookmarkedIds.includes(item.id)) return false;
    if (viewTab === "mastered" && !masteredIds.includes(item.id)) return false;

    const matchMap = selectedMap === "ALL" || item.map.toLowerCase() === selectedMap.toLowerCase();
    const matchAgent = selectedAgent === "ALL" || item.agent.toLowerCase() === selectedAgent.toLowerCase();
    const matchSide = selectedSide === "ALL" || item.side.toLowerCase() === selectedSide.toLowerCase();
    const matchType = selectedType === "ALL" || item.type.toLowerCase() === selectedType.toLowerCase();
    const matchSite = selectedSite === "ALL" || item.site === selectedSite;
    const matchSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.abilityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.proPlayer && item.proPlayer.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.standingPos.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.landingZone.toLowerCase().includes(searchQuery.toLowerCase());
    return matchMap && matchAgent && matchSide && matchType && matchSite && matchSearch;
  });

  const getSideColor = (side: string) => {
    switch (side) {
      case "Attacker": return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      case "Defender": return "bg-blue-500/20 text-blue-400 border-blue-500/40";
      case "Post-Plant": return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      case "Retake": return "bg-purple-500/20 text-purple-400 border-purple-500/40";
      default: return "bg-white/10 text-white border-white/20";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "Recon": return <Eye className="w-3.5 h-3.5 text-cyan-400" />;
      case "Molly/Damage": return <Flame className="w-3.5 h-3.5 text-rose-400" />;
      case "Smoke/Wall": return <Layers className="w-3.5 h-3.5 text-emerald-400" />;
      case "Trap/Setup": return <Shield className="w-3.5 h-3.5 text-amber-400" />;
      case "Flash/Knife": return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case "Ultimate": return <Sparkles className="w-3.5 h-3.5 text-purple-400" />;
      default: return <Target className="w-3.5 h-3.5 text-gray-400" />;
    }
  };

  const masteryPercent = Math.round((masteredIds.length / MAP_LINEUPS_DATA.length) * 100);

  return (
    <div className="min-h-screen bg-[#070709] text-white p-4 md:p-8">
      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 shadow-lg shadow-emerald-500/10">
              <Crosshair className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display tracking-wider text-white flex items-center gap-2">
                GÓC KÊ & TACTICAL SETUPS PRO VCT
              </h1>
              <p className="text-xs md:text-sm text-gray-400">
                Sổ tay định vị pixel: Mũi tên Sova, Tường độc Viper, Molly Brimstone, God Setup Cypher & Mắt Quỷ Fade.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Stats & Custom Mode Helper Button */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Practice Mastery Progress */}
          <div className="bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
            <Award className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="flex items-center justify-between gap-4 text-xs">
                <span className="text-gray-400">Đã thuần thục:</span>
                <span className="font-bold text-emerald-400">{masteredIds.length}/{MAP_LINEUPS_DATA.length} ({masteryPercent}%)</span>
              </div>
              <div className="w-36 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 rounded-full transition-all duration-500"
                  style={{ width: `${masteryPercent}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Bookmarks */}
          <button
            onClick={() => { sound.playClick(); setViewTab(viewTab === "bookmarked" ? "all" : "bookmarked"); }}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-2 transition-all ${
              viewTab === "bookmarked" 
                ? "bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20" 
                : "bg-white/5 text-gray-300 border-white/10 hover:border-amber-400/50"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Đã Lưu ({bookmarkedIds.length})
          </button>

          {/* Custom Cheat Guide Toggle */}
          <button
            onClick={() => { sound.playClick(); setShowCustomCheatGuide(!showCustomCheatGuide); }}
            className="px-4 py-2.5 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
          >
            <Terminal className="w-4 h-4" />
            Cài Đặt Phòng Tập Custom
          </button>
        </div>
      </div>

      {/* Custom Game Training Mode Quick Panel (Collapsible) */}
      {showCustomCheatGuide && (
        <div className="mt-6 bg-[#0f1412] border border-emerald-500/30 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Terminal className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display tracking-wider text-base text-white">
                  HƯỚNG DẪN CÀI ĐẶT PHÒNG TẬP CUSTOM (PRACTICE MODE)
                </h3>
                <p className="text-xs text-emerald-300/80">
                  Tạo trận Custom Game → Bật Cheats: ON để luyện tập góc ném không giới hạn.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCustomCheatGuide(false)}
              className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-white/5 border border-white/10"
            >
              ✕ Đóng
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {CUSTOM_GAME_COMMANDS.map((cmd, idx) => (
              <div key={idx} className="bg-black/60 border border-white/10 p-3.5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold text-emerald-400 block mb-1">{cmd.title}</span>
                  <p className="text-[11px] text-gray-300 leading-relaxed mb-2">{cmd.description}</p>
                </div>
                <div className="bg-emerald-950/40 px-2.5 py-1.5 rounded-xl border border-emerald-500/20 text-[11px] text-emerald-300 font-mono flex items-center justify-between">
                  <span>Phím tắt:</span>
                  <strong className="text-white">{cmd.shortcut}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mb-5 flex items-start gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-xs text-amber-100">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
        <div>
          <strong>LineupsValorant: chưa nhập dữ liệu.</strong> Robots.txt cấm endpoint lấy lineup chi tiết và callout. Không cào ảnh/hướng dẫn từ nguồn này.
          <a href={LINEUP_SOURCE_STATE.source.sourceUrl} target="_blank" rel="noreferrer" className="ml-1 text-cyan-300 underline underline-offset-2">Xem nguồn</a>
          <span className="ml-1 text-amber-300">· kiểm tra {LINEUP_SOURCE_STATE.source.lastVerified}</span>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="mt-6 flex flex-col gap-4 bg-[#111115] p-5 rounded-3xl border border-white/10 shadow-xl">
        {/* Row 1: Search & Maps */}
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm theo đặc vụ (Sova, Viper), map, kỹ năng, callout hoặc tên Pro Player..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/70 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition-all"
            />
          </div>

          {/* Map Tabs */}
          <div className="flex bg-black/60 p-1.5 rounded-2xl border border-white/10 overflow-x-auto gap-1">
            {mapsList.map((m) => (
              <button
                key={m}
                onClick={() => { sound.playClick(); setSelectedMap(m); }}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedMap === m 
                    ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30" 
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {m === "ALL" ? "Tất Cả Map" : m}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Agents, Types & Sides */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-white/5">
          {/* Agent Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Đặc vụ:</span>
            {agentsList.map((ag) => (
              <button
                key={ag}
                onClick={() => { sound.playClick(); setSelectedAgent(ag); }}
                className={`px-3 py-1 text-xs rounded-xl font-medium transition-all ${
                  selectedAgent === ag 
                    ? "bg-white text-black font-bold shadow-md" 
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {ag === "ALL" ? "Tất cả" : ag}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Loại góc:</span>
            {typesList.map((tp) => (
              <button
                key={tp}
                onClick={() => { sound.playClick(); setSelectedType(tp); }}
                className={`px-2.5 py-1 text-xs rounded-xl font-medium transition-all flex items-center gap-1 ${
                  selectedType === tp 
                    ? "bg-cyan-600 text-white font-bold" 
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {tp === "ALL" ? "Tất cả" : tp}
              </button>
            ))}
          </div>

          {/* Site Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider mr-1">Site:</span>
            {["ALL", "A", "B", "C", "Mid"].map((site) => (
              <button
                key={site}
                onClick={() => { sound.playClick(); setSelectedSite(site); }}
                className={`w-8 h-8 text-xs rounded-xl font-bold flex items-center justify-center transition-all ${
                  selectedSite === site 
                    ? "bg-amber-500 text-black shadow-md shadow-amber-500/20" 
                    : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                {site}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredLineups.length === 0 ? (
          <div className="col-span-full py-16 text-center bg-[#111] rounded-3xl border border-white/10">
            <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-base text-gray-400 font-medium">Không tìm thấy góc kê phù hợp với bộ lọc hiện tại.</p>
            <button
              onClick={() => {
                setSelectedMap("ALL");
                setSelectedAgent("ALL");
                setSelectedSide("ALL");
                setSelectedType("ALL");
                setSelectedSite("ALL");
                setSearchQuery("");
                setViewTab("all");
              }}
              className="mt-4 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Đặt Lại Bộ Lọc
            </button>
          </div>
        ) : (
          filteredLineups.map((lineup) => {
            const isSaved = bookmarkedIds.includes(lineup.id);
            const isMastered = masteredIds.includes(lineup.id);

            return (
              <div
                key={lineup.id}
                id={`lineup-card-${lineup.id}`}
                onClick={() => {
                  sound.playClick();
                  setActiveLineup(lineup);
                  setActiveStepIndex(0);
                }}
                className="bg-[#111115] border border-white/10 hover:border-emerald-500/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between group hover:shadow-2xl hover:shadow-emerald-500/10 cursor-pointer relative"
              >
                <div>
                  {/* Top Tactical Map Banner */}
                  <div className="relative h-48 w-full bg-[#0a0a0c] overflow-hidden">
                    <img
                      src={lineup.mapSplash}
                      alt={lineup.map}
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-75"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111115] via-[#111115]/40 to-black/30"></div>

                    {/* Top HUD Badges */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-xl bg-black/80 backdrop-blur-md border border-white/15 text-xs font-bold text-white flex items-center gap-1.5 shadow-lg">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        {lineup.map} • Site {lineup.site}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {/* Mastered Badge */}
                        <button
                          onClick={(e) => toggleMastered(lineup.id, e)}
                          title={isMastered ? "Đã thuần thục" : "Đánh dấu đã thuần thục"}
                          className={`p-1.5 rounded-xl backdrop-blur-md border transition-all ${
                            isMastered 
                              ? "bg-emerald-600 text-white border-emerald-400" 
                              : "bg-black/60 text-gray-400 border-white/10 hover:text-emerald-400"
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(lineup.id, e)}
                          title={isSaved ? "Bỏ lưu" : "Lưu góc kê này"}
                          className="p-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-white hover:text-amber-400 transition-colors"
                        >
                          {isSaved ? (
                            <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400" />
                          ) : (
                            <Bookmark className="w-4 h-4 text-gray-300" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Agent & Ability Badge */}
                    <div className="absolute bottom-3.5 left-3.5 right-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-10 h-10 rounded-2xl bg-black/90 border border-white/20 p-1 flex items-center justify-center shadow-lg shrink-0">
                          <img 
                            src={lineup.agentIcon} 
                            alt={lineup.agent} 
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = `https://api.dicebear.com/7.x/bottts/svg?seed=${lineup.agent}`;
                            }}
                            className="w-full h-full object-contain" 
                          />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white block">{lineup.agent}</span>
                            <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-white/10 text-gray-300">
                              Phím {lineup.abilityKey}
                            </span>
                          </div>
                          <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                            {getTypeIcon(lineup.type)}
                            {lineup.abilityName}
                          </span>
                        </div>
                      </div>

                      {lineup.proPlayer && (
                        <span className="text-[10px] text-amber-300 font-medium px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/30 hidden sm:inline-block">
                          ★ {lineup.proPlayer}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border uppercase tracking-wider ${getSideColor(lineup.side)}`}>
                        {lineup.side}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-medium bg-white/5 text-gray-400 border border-white/5">
                        Độ khó: <strong className={lineup.difficulty === "Dễ" ? "text-emerald-400" : lineup.difficulty === "Trung Bình" ? "text-amber-400" : "text-rose-400"}>{lineup.difficulty}</strong>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/30" title="Chưa test trong game hiện tại">
                        <AlertTriangle className="w-3 h-3" /> Chưa xác minh in-game
                      </span>
                    </div>

                    <h3 className="font-display tracking-wider text-base text-white group-hover:text-emerald-400 transition-colors line-clamp-2 mb-2 leading-snug">
                      {lineup.title}
                    </h3>

                    <p className="text-xs text-gray-400 line-clamp-2 mb-4 leading-relaxed">
                      {lineup.description}
                    </p>

                    {/* Tactical Alignment Visualizer Card */}
                    <div className="bg-black/70 p-3.5 rounded-2xl border border-white/5 space-y-2 mb-2">
                      <div className="flex items-start gap-2 text-[11px] text-gray-300">
                        <span className="text-gray-500 font-bold shrink-0">📍 Đứng:</span>
                        <span className="truncate text-white font-medium">{lineup.standingPos}</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] text-amber-300">
                        <span className="text-gray-500 font-bold shrink-0">🎯 Căn:</span>
                        <span className="truncate">{lineup.aimMarker}</span>
                      </div>
                      <div className="flex items-start gap-2 text-[11px] text-emerald-400">
                        <span className="text-gray-500 font-bold shrink-0">⚡ Lực:</span>
                        <span className="font-bold truncate">{lineup.powerBounce}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="p-5 pt-0 flex items-center gap-2">
                  <button
                    onClick={(e) => handleCopyGuide(lineup, e)}
                    className="p-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-2xl text-xs font-bold border border-white/10 transition-all flex items-center justify-center"
                    title="Sao chép mẹo nhanh"
                  >
                    {copiedId === lineup.id ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <button
                    className="flex-1 py-2.5 bg-white/5 hover:bg-emerald-600 hover:text-white rounded-2xl text-xs font-bold tracking-wider uppercase text-gray-300 transition-all flex items-center justify-center gap-2 group-hover:bg-emerald-600 group-hover:text-white border border-white/5 group-hover:border-emerald-500"
                  >
                    Xem Chi Tiết Từng Bước
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Interactive Modal Popup */}
      {activeLineup && (
        <div 
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-lg flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setActiveLineup(null)}
        >
          <div 
            className="bg-[#111116] border border-white/15 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 md:p-8 shadow-2xl relative my-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getSideColor(activeLineup.side)}`}>
                    {activeLineup.side}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-white/10 text-white">
                    {activeLineup.map} • Site {activeLineup.site}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                    {activeLineup.agent} ({activeLineup.abilityName})
                  </span>
                  {activeLineup.proPlayer && (
                    <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      ★ {activeLineup.proPlayer}
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-display tracking-wider text-white">
                  {activeLineup.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveLineup(null)}
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white flex items-center justify-center transition-all shrink-0"
              >
                ✕
              </button>
            </div>

            {/* In-Game Realistic HUD Visualizer Stage */}
            <InGameHUDVisualizer
              lineup={activeLineup}
              activeStepIndex={activeStepIndex}
              onStepChange={setActiveStepIndex}
            />

            {/* Step-by-Step Interactive Wizard */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  HƯỚNG DẪN THỰC HIỆN TỪNG BƯỚC:
                </span>
                <div className="flex items-center gap-1">
                  {activeLineup.steps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveStepIndex(idx)}
                      className={`w-6 h-6 rounded-lg text-xs font-bold transition-all ${
                        activeStepIndex === idx 
                          ? "bg-emerald-500 text-black" 
                          : "bg-white/5 text-gray-400 hover:text-white"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Step Card */}
              <div className="bg-white/5 border border-white/10 p-5 rounded-2xl relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center justify-center border border-emerald-500/30">
                      {activeLineup.steps[activeStepIndex].stepNumber}
                    </span>
                    <h4 className="font-display tracking-wider text-sm text-white">
                      {activeLineup.steps[activeStepIndex].title}
                    </h4>
                  </div>
                  <span className="text-[11px] text-amber-400 font-mono px-2 py-0.5 rounded bg-amber-950/40 border border-amber-500/20">
                    📍 {activeLineup.steps[activeStepIndex].callout}
                  </span>
                </div>

                <p className="text-sm text-gray-200 leading-relaxed mb-3">
                  {activeLineup.steps[activeStepIndex].instruction}
                </p>

                <div className="bg-black/50 p-2.5 rounded-xl border border-white/5 flex items-center gap-2 text-xs text-emerald-300">
                  <Info className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Mẹo chuẩn HUD: <strong>{activeLineup.steps[activeStepIndex].hudCue}</strong></span>
                </div>

                {/* Step Navigator */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
                  <button
                    disabled={activeStepIndex === 0}
                    onClick={() => setActiveStepIndex(Math.max(0, activeStepIndex - 1))}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold flex items-center gap-1 text-gray-300"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    Bước Trước
                  </button>

                  <span className="text-xs text-gray-500">
                    Bước {activeStepIndex + 1} / {activeLineup.steps.length}
                  </span>

                  <button
                    disabled={activeStepIndex === activeLineup.steps.length - 1}
                    onClick={() => setActiveStepIndex(Math.min(activeLineup.steps.length - 1, activeStepIndex + 1))}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:pointer-events-none text-xs font-bold text-white flex items-center gap-1"
                  >
                    Bước Kế Tiếp
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Bottom Actions */}
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleMastered(activeLineup.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
                    masteredIds.includes(activeLineup.id)
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                      : "bg-white/5 text-gray-300 hover:text-white border border-white/10"
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {masteredIds.includes(activeLineup.id) ? "Đã Thuần Thục ✓" : "Đánh Dấu Đã Thuần Thục"}
                </button>

                <button
                  onClick={() => handleCopyGuide(activeLineup)}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all"
                >
                  {copiedId === activeLineup.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      Đã Sao Chép!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Sao Chép Mẹo Nhanh
                    </>
                  )}
                </button>
              </div>

              <button
                onClick={() => setActiveLineup(null)}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider transition-all"
              >
                Đã Hiểu & Đóng Lại
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
