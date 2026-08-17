import { useState, useMemo, useEffect } from "react";
import { POPULAR_SKINS, WeaponSkin } from "../../data/skins";
import { 
  Trophy, 
  Sparkles, 
  Trash2, 
  RotateCcw, 
  Share2, 
  Plus, 
  Search, 
  Heart, 
  Check, 
  ArrowUp, 
  ArrowDown, 
  X,
  Layers,
  Flame,
  Star,
  Zap,
  Info
} from "lucide-react";
import { cn } from "../../lib/utils";
import { playUiClick, playRoleSelect } from "../../lib/soundEngine";

export type TierKey = "S_PLUS" | "S" | "A" | "B" | "C" | "D";

export interface TierDefinition {
  key: TierKey;
  label: string;
  subLabel: string;
  badge: string;
  color: string;
  badgeBg: string;
  border: string;
  glow: string;
}

export const TIER_CONFIG: TierDefinition[] = [
  {
    key: "S_PLUS",
    label: "S+ Tier",
    subLabel: "God Tier / Aimbot Cực Phẩm (Must-Have)",
    badge: "S+",
    badgeBg: "bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-red-500/30",
    color: "text-red-400",
    border: "border-red-500/40 hover:border-red-500",
    glow: "rgba(239, 68, 68, 0.15)"
  },
  {
    key: "S",
    label: "S Tier",
    subLabel: "Meta Masterpiece / Tuyệt Tác Âm Thanh",
    badge: "S",
    badgeBg: "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-amber-500/30",
    color: "text-amber-400",
    border: "border-amber-500/40 hover:border-amber-500",
    glow: "rgba(245, 158, 11, 0.15)"
  },
  {
    key: "A",
    label: "A Tier",
    subLabel: "Clean & Crisp / Bắn Cực Đầm Tay",
    badge: "A",
    badgeBg: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-purple-500/30",
    color: "text-purple-400",
    border: "border-purple-500/40 hover:border-purple-500",
    glow: "rgba(168, 85, 247, 0.15)"
  },
  {
    key: "B",
    label: "B Tier",
    subLabel: "Solid Pick / Ổn Định Đáng Mua",
    badge: "B",
    badgeBg: "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-blue-500/30",
    color: "text-blue-400",
    border: "border-blue-500/40 hover:border-blue-500",
    glow: "rgba(59, 130, 246, 0.15)"
  },
  {
    key: "C",
    label: "C Tier",
    subLabel: "Average / Bình Thường (Chờ Chợ Đen)",
    badge: "C",
    badgeBg: "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-emerald-500/30",
    color: "text-emerald-400",
    border: "border-emerald-500/40 hover:border-emerald-500",
    glow: "rgba(16, 185, 129, 0.15)"
  },
  {
    key: "D",
    label: "D Tier",
    subLabel: "Skip / Clunky (Phí VP Không Nên Mua)",
    badge: "D",
    badgeBg: "bg-gradient-to-r from-zinc-600 to-gray-700 text-zinc-200 shadow-zinc-600/30",
    color: "text-zinc-400",
    border: "border-zinc-700/60 hover:border-zinc-600",
    glow: "rgba(113, 113, 122, 0.1)"
  }
];

const PRESETS: { id: string; name: string; description: string; getTiers: () => Record<TierKey, string[]> }[] = [
  {
    id: "vct_2026_meta",
    name: "🔥 VCT Pro Meta 2026 (Tier Chuẩn Thi Đấu)",
    description: "Xếp hạng dựa trên tỉ lệ tuyển thủ VCT Pro sử dụng nhiều nhất tại Masters & Champions 2026.",
    getTiers: () => ({
      S_PLUS: [
        "1b9b0131-42fe-b6a7-d212-699b342ba642", // Rogue Vandal
        "d8d5d7a1-4d81-8560-54bc-0692ab40f69b", // Kuronami Vandal
        "3f6410af-4fd7-74fb-c0f4-6ab61d30022c", // Kuronami Phantom
        "4c926aa9-4f26-bc80-c486-9b888333373f", // Araxys Vandal
        "cc1da8cd-452f-a007-0bf8-b68a471c3a6e"  // Champions 2024 Phantom
      ],
      S: [
        "b9ee2457-481c-6776-3f5b-0ca8e8f90c89", // Prime Vandal
        "30388628-42f0-606c-82c0-73ad43de997f", // Reaver Vandal
        "522a264e-4ca7-adb0-6cf1-28b2ef938727", // Prelude to Chaos Vandal
        "2460c852-4d1b-a9e3-ccda-43a8e30cb739", // Rogue Operator
        "1c808469-4aee-ae6c-fcd2-1099e96ac6a0"  // Rogue Push Daggers
      ],
      A: [
        "4fc36214-4492-ef57-f8fb-4cab81863545", // Mystbloom Vandal
        "84589da8-4e2b-11bf-ca52-b88e6b7e1dbd", // Protocol 781-A Sheriff
        "a452fcd9-4fe6-dc8c-6459-b2ad13ef89ff"  // ORA by OneTap Sheriff
      ],
      B: [
        "b6ba04a0-4c06-6bfe-2f03-a393be1544a9"  // Phaseguard Bulldog
      ],
      C: [],
      D: []
    })
  },
  {
    id: "aimbot_placebo",
    name: "⚡ Aimbot Placebo Tier List (Headshot 100%)",
    description: "Tập trung vào cảm giác đầm tay, âm thanh One-Tap dứt khoát và tỉ lệ Headshot viên đầu.",
    getTiers: () => ({
      S_PLUS: [
        "1b9b0131-42fe-b6a7-d212-699b342ba642", // Rogue Vandal
        "d8d5d7a1-4d81-8560-54bc-0692ab40f69b", // Kuronami Vandal
        "522a264e-4ca7-adb0-6cf1-28b2ef938727"  // Prelude to Chaos Vandal
      ],
      S: [
        "b9ee2457-481c-6776-3f5b-0ca8e8f90c89", // Prime Vandal
        "30388628-42f0-606c-82c0-73ad43de997f", // Reaver Vandal
        "4c926aa9-4f26-bc80-c486-9b888333373f"  // Araxys Vandal
      ],
      A: [
        "3f6410af-4fd7-74fb-c0f4-6ab61d30022c", // Kuronami Phantom
        "84589da8-4e2b-11bf-ca52-b88e6b7e1dbd"  // Protocol 781-A Sheriff
      ],
      B: [
        "b6ba04a0-4c06-6bfe-2f03-a393be1544a9"
      ],
      C: [],
      D: []
    })
  },
  {
    id: "empty",
    name: "✨ Tạo Mới Trống (Tự Xếp Từ Đầu)",
    description: "Bắt đầu với một bảng Tier List trống để tự do phân loại theo sở thích cá nhân.",
    getTiers: () => ({
      S_PLUS: [],
      S: [],
      A: [],
      B: [],
      C: [],
      D: []
    })
  }
];

const STORAGE_KEY = "valorant_custom_skin_tier_list";

interface SkinTierListProps {
  onSelectSkinDetail: (skin: WeaponSkin) => void;
  wishlistIds: string[];
  onToggleWishlist: (skinId: string) => void;
}

export function SkinTierList({ onSelectSkinDetail, wishlistIds, onToggleWishlist }: SkinTierListProps) {
  // State: mapping of TierKey -> array of skin IDs
  const [tierData, setTierData] = useState<Record<TierKey, string[]>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    return PRESETS[0].getTiers();
  });

  const [poolSearch, setPoolSearch] = useState("");
  const [poolWeapon, setPoolWeapon] = useState("All");
  const [activeAssignModal, setActiveAssignModal] = useState<WeaponSkin | null>(null);
  const [copiedToast, setCopiedToast] = useState(false);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tierData));
    } catch (e) {
      console.error(e);
    }
  }, [tierData]);

  // Skin map for fast lookup
  const skinMap = useMemo(() => {
    const map = new Map<string, WeaponSkin>();
    POPULAR_SKINS.forEach(s => map.set(s.id, s));
    return map;
  }, []);

  // Set of all assigned skin IDs across tiers
  const assignedIds = useMemo(() => {
    const set = new Set<string>();
    Object.values(tierData).forEach(ids => ids.forEach(id => set.add(id)));
    return set;
  }, [tierData]);

  // Pool skins (unassigned or matching search)
  const availablePoolSkins = useMemo(() => {
    return POPULAR_SKINS.filter(skin => {
      // Filter by search
      if (poolSearch) {
        const q = poolSearch.toLowerCase();
        const normalizedQ = q.replace(/\brouge\b/g, 'rogue');
        const matches = skin.name.toLowerCase().includes(q) || 
                        skin.name.toLowerCase().includes(normalizedQ) ||
                        skin.bundle.toLowerCase().includes(q) ||
                        skin.bundle.toLowerCase().includes(normalizedQ) ||
                        skin.weapon.toLowerCase().includes(q);
        if (!matches) return false;
      }
      // Filter by weapon
      if (poolWeapon !== "All" && skin.weapon !== poolWeapon) {
        return false;
      }
      return true;
    });
  }, [poolSearch, poolWeapon]);

  // Add skin to tier
  const handleAddToTier = (tier: TierKey, skinId: string) => {
    playRoleSelect();
    setTierData(prev => {
      // Remove skinId from any existing tier first
      const next: Record<TierKey, string[]> = {
        S_PLUS: prev.S_PLUS.filter(id => id !== skinId),
        S: prev.S.filter(id => id !== skinId),
        A: prev.A.filter(id => id !== skinId),
        B: prev.B.filter(id => id !== skinId),
        C: prev.C.filter(id => id !== skinId),
        D: prev.D.filter(id => id !== skinId)
      };
      next[tier] = [...next[tier], skinId];
      return next;
    });
    setActiveAssignModal(null);
  };

  // Remove skin from tier
  const handleRemoveFromTier = (tier: TierKey, skinId: string) => {
    playUiClick();
    setTierData(prev => ({
      ...prev,
      [tier]: prev[tier].filter(id => id !== skinId)
    }));
  };

  // Move skin inside tier (up or down)
  const handleMoveOrder = (tier: TierKey, index: number, direction: "up" | "down") => {
    playUiClick();
    setTierData(prev => {
      const list = [...prev[tier]];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= list.length) return prev;
      const temp = list[index];
      list[index] = list[targetIndex];
      list[targetIndex] = temp;
      return {
        ...prev,
        [tier]: list
      };
    });
  };

  // Move skin to adjacent tier
  const handleMoveTier = (currentTier: TierKey, skinId: string, targetTier: TierKey) => {
    handleAddToTier(targetTier, skinId);
  };

  // Clear specific tier
  const handleClearTier = (tier: TierKey) => {
    playUiClick();
    setTierData(prev => ({
      ...prev,
      [tier]: []
    }));
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm("Bạn có chắc muốn xóa trắng toàn bộ Tier List hiện tại không?")) {
      playUiClick();
      setTierData({
        S_PLUS: [],
        S: [],
        A: [],
        B: [],
        C: [],
        D: []
      });
    }
  };

  // Load Preset
  const handleLoadPreset = (presetId: string) => {
    const preset = PRESETS.find(p => p.id === presetId);
    if (!preset) return;
    playRoleSelect();
    setTierData(preset.getTiers());
  };

  // Share text summary
  const handleCopySummary = () => {
    playUiClick();
    let text = "🏆 VALORANT SKIN TIER LIST CỦA TÔI (2026)\n";
    text += "========================================\n\n";

    TIER_CONFIG.forEach(t => {
      const ids = tierData[t.key];
      const names = ids.map(id => skinMap.get(id)?.name || id).filter(Boolean);
      text += `[${t.badge}] ${t.label.toUpperCase()} (${names.length} skins):\n`;
      if (names.length === 0) {
        text += "  - (Trống)\n";
      } else {
        names.forEach(name => {
          text += `  • ${name}\n`;
        });
      }
      text += "\n";
    });

    text += "🎮 Tạo bởi Valorant Esports Hub & Meta Skins Tracker";
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  const totalAssignedCount = assignedIds.size;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Controls */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-red-500/20 text-red-400 text-xs font-mono font-bold tracking-wider rounded-full border border-red-500/30 flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5" />
                TIER LIST BUILDER
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Đã xếp: <strong className="text-white">{totalAssignedCount}</strong> skins
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
              Tự Tạo Bảng Xếp Hạng Skin Valorant
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1">
              Kéo thả, chọn nhanh các bundle mới nhất như <strong>Neo Frontier 2.0</strong>, <strong>VCT 2026 Capsules</strong>, <strong>Roughneck</strong> và toàn bộ skin kho game để tạo bảng Tier List mang dấu ấn của bạn.
            </p>
          </div>

          {/* Quick Preset Buttons & Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="dropdown relative group">
              <button 
                id="tier-preset-menu-btn"
                className="px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl border border-zinc-700 flex items-center gap-2 transition"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Nạp Mẫu Sẵn</span>
              </button>
              <div className="hidden group-hover:block absolute right-0 top-full mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl p-2 z-50">
                <div className="text-[10px] font-mono text-zinc-400 px-3 py-1 uppercase tracking-wider">
                  Chọn mẫu định sẵn:
                </div>
                {PRESETS.map(p => (
                  <button
                    key={p.id}
                    onClick={() => handleLoadPreset(p.id)}
                    className="w-full text-left px-3 py-2.5 hover:bg-zinc-800 rounded-lg text-xs transition flex flex-col gap-0.5"
                  >
                    <span className="font-bold text-white">{p.name}</span>
                    <span className="text-[11px] text-zinc-400">{p.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <button
              id="copy-tierlist-summary-btn"
              onClick={handleCopySummary}
              className="px-3.5 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
            >
              {copiedToast ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copiedToast ? "Đã Sao Chép!" : "Chia Sẻ Tier List"}</span>
            </button>

            <button
              id="clear-all-tiers-btn"
              onClick={handleClearAll}
              className="px-3 py-2 bg-zinc-800 hover:bg-red-500/20 text-zinc-400 hover:text-red-400 border border-zinc-700 hover:border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
              title="Xóa trắng toàn bộ bảng"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Xóa Hết</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Tier Board Grid */}
      <div className="space-y-4">
        {TIER_CONFIG.map((tier) => {
          const skinIds = tierData[tier.key] || [];
          const tierSkins = skinIds
            .map(id => skinMap.get(id))
            .filter((s): s is WeaponSkin => Boolean(s));

          return (
            <div 
              key={tier.key}
              className={cn(
                "rounded-2xl border transition-all duration-200 overflow-hidden bg-zinc-900/60 backdrop-blur-sm",
                tier.border
              )}
              style={{
                boxShadow: `0 4px 20px -2px ${tier.glow}`
              }}
            >
              <div className="flex flex-col md:flex-row items-stretch">
                {/* Tier Badge & Info Header */}
                <div className="md:w-56 p-4 md:p-5 flex md:flex-col justify-between items-center md:items-start bg-zinc-900/90 border-b md:border-b-0 md:border-r border-zinc-800/80 flex-shrink-0">
                  <div className="flex items-center md:items-start gap-3 md:flex-col">
                    <div className={cn("px-4 py-2 rounded-xl font-display font-black text-xl shadow-lg", tier.badgeBg)}>
                      {tier.badge}
                    </div>
                    <div>
                      <div className={cn("font-bold text-sm", tier.color)}>
                        {tier.label}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-medium leading-tight">
                        {tier.subLabel}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[11px] font-mono text-zinc-400 px-2 py-0.5 bg-zinc-800 rounded-md">
                      {tierSkins.length} skins
                    </span>
                    {tierSkins.length > 0 && (
                      <button
                        onClick={() => handleClearTier(tier.key)}
                        className="text-zinc-500 hover:text-red-400 text-xs p-1 hover:bg-zinc-800 rounded transition"
                        title="Xóa skin trong tier này"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Tier Content Skins Grid */}
                <div className="flex-1 p-3 md:p-4 min-h-[110px] flex items-center">
                  {tierSkins.length === 0 ? (
                    <div className="w-full h-full py-6 flex items-center justify-center border-2 border-dashed border-zinc-800/60 rounded-xl text-xs text-zinc-400 font-mono">
                      Chưa có skin nào trong {tier.badge}. Chọn skin từ kho bên dưới để thêm vào.
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 w-full">
                      {tierSkins.map((skin, idx) => {
                        const isWishlisted = wishlistIds.includes(skin.id);
                        return (
                          <div
                            key={`${tier.key}-${skin.id}-${idx}`}
                            className="group relative bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl p-2.5 flex flex-col justify-between transition-all hover:scale-[1.02] shadow-sm hover:shadow-md"
                          >
                            {/* Top row: Weapon tag & Wishlist */}
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                                {skin.weapon}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onToggleWishlist(skin.id);
                                }}
                                className={cn(
                                  "p-1 rounded-md transition",
                                  isWishlisted 
                                    ? "text-red-400 hover:text-red-300 bg-red-500/10" 
                                    : "text-zinc-400 hover:text-white hover:bg-zinc-800"
                                )}
                                title={isWishlisted ? "Bỏ khỏi wishlist" : "Thêm vào wishlist"}
                              >
                                <Heart className={cn("w-3 h-3", isWishlisted && "fill-red-400")} />
                              </button>
                            </div>

                            {/* Skin Preview Image */}
                            <div 
                              className="h-16 flex items-center justify-center cursor-pointer p-1"
                              onClick={() => onSelectSkinDetail(skin)}
                            >
                              <img
                                src={skin.image}
                                alt={skin.name}
                                className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition duration-200"
                                loading="lazy"
                                referrerPolicy="no-referrer"
                              />
                            </div>

                            {/* Skin Name & Rating */}
                            <div className="mt-1">
                              <div 
                                className="text-xs font-bold text-zinc-200 truncate cursor-pointer hover:text-red-400 transition"
                                title={skin.name}
                                onClick={() => onSelectSkinDetail(skin)}
                              >
                                {skin.name}
                              </div>
                              <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                                <span className="flex items-center gap-0.5 text-amber-400 font-bold">
                                  <Star className="w-2.5 h-2.5 fill-amber-400" />
                                  {skin.rating}
                                </span>
                                <span>{skin.priceVP} VP</span>
                              </div>
                            </div>

                            {/* Action overlay bar */}
                            <div className="flex items-center justify-between gap-0.5 mt-2 pt-1.5 border-t border-zinc-800/80">
                              {/* Order adjust */}
                              <div className="flex items-center gap-0.5">
                                <button
                                  disabled={idx === 0}
                                  onClick={() => handleMoveOrder(tier.key, idx, "up")}
                                  className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded transition"
                                  title="Chuyển sang trái / lên trước"
                                >
                                  <ArrowUp className="w-3 h-3 -rotate-90" />
                                </button>
                                <button
                                  disabled={idx === tierSkins.length - 1}
                                  onClick={() => handleMoveOrder(tier.key, idx, "down")}
                                  className="p-0.5 text-zinc-400 hover:text-white disabled:opacity-20 disabled:hover:text-zinc-400 rounded transition"
                                  title="Chuyển sang phải / ra sau"
                                >
                                  <ArrowDown className="w-3 h-3 -rotate-90" />
                                </button>
                              </div>

                              {/* Quick Move to Other Tier */}
                              <div className="relative group/tierselect">
                                <button
                                  className="text-[10px] font-mono px-1.5 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded"
                                  title="Đổi bậc Tier"
                                >
                                  Đổi Tier
                                </button>
                                <div className="hidden group-hover/tierselect:flex flex-col absolute bottom-full right-0 mb-1 bg-zinc-900 border border-zinc-700 rounded-lg p-1 shadow-2xl z-50 min-w-[90px]">
                                  {TIER_CONFIG.map(tc => (
                                    <button
                                      key={tc.key}
                                      onClick={() => handleMoveTier(tier.key, skin.id, tc.key)}
                                      className={cn(
                                        "px-2 py-1 text-[11px] font-bold text-left rounded hover:bg-zinc-800 transition flex items-center justify-between",
                                        tc.key === tier.key && "bg-zinc-800 text-red-400"
                                      )}
                                    >
                                      <span>{tc.badge}</span>
                                      {tc.key === tier.key && <Check className="w-3 h-3" />}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Delete from tier */}
                              <button
                                onClick={() => handleRemoveFromTier(tier.key, skin.id)}
                                className="p-0.5 text-zinc-400 hover:text-red-400 rounded transition"
                                title="Xóa khỏi Tier này"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Available Skin Pool Section */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Layers className="w-5 h-5 text-red-400" />
              Kho Skin Để Xếp Hạng ({availablePoolSkins.length} skins)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Nhấp vào bất kỳ skin nào bên dưới để chọn đưa vào Tier tương ứng (S+, S, A, B, C, D).
            </p>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm tên súng, bundle..."
                value={poolSearch}
                onChange={(e) => setPoolSearch(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-red-500 w-48 sm:w-60"
              />
              {poolSearch && (
                <button
                  onClick={() => setPoolSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <select
              value={poolWeapon}
              onChange={(e) => setPoolWeapon(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-red-500"
            >
              <option value="All">Tất cả vũ khí</option>
              <option value="Vandal">Vandal</option>
              <option value="Phantom">Phantom</option>
              <option value="Operator">Operator</option>
              <option value="Sheriff">Sheriff</option>
              <option value="Melee">Melee (Dao)</option>
              <option value="Ghost">Ghost</option>
              <option value="Classic">Classic</option>
              <option value="Outlaw">Outlaw</option>
              <option value="Bulldog">Bulldog</option>
              <option value="Spectre">Spectre</option>
            </select>
          </div>
        </div>

        {/* Skins Grid in Pool */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-3 max-h-[480px] overflow-y-auto pr-1">
          {availablePoolSkins.slice(0, 48).map((skin) => {
            const isAssigned = assignedIds.has(skin.id);
            const isWishlisted = wishlistIds.includes(skin.id);

            return (
              <div
                key={`pool-${skin.id}`}
                onClick={() => {
                  playUiClick();
                  setActiveAssignModal(skin);
                }}
                className={cn(
                  "group relative bg-zinc-950 border rounded-xl p-2.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-105",
                  isAssigned ? "border-red-500/40 bg-red-950/10" : "border-zinc-800 hover:border-zinc-600"
                )}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-zinc-800 text-zinc-300 rounded">
                    {skin.weapon}
                  </span>
                  {isAssigned && (
                    <span className="text-[9px] font-bold text-red-400 bg-red-500/20 px-1 py-0.5 rounded">
                      Đã xếp
                    </span>
                  )}
                </div>

                <div className="h-14 flex items-center justify-center p-1">
                  <img
                    src={skin.image}
                    alt={skin.name}
                    className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition duration-200"
                    loading="lazy"
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="mt-1">
                  <div className="text-[11px] font-bold text-zinc-200 truncate group-hover:text-red-400">
                    {skin.name}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-0.5">
                    <span className="font-mono">{skin.priceVP} VP</span>
                    <span className="text-amber-400 font-bold">★ {skin.rating}</span>
                  </div>
                </div>

                <div className="mt-2 w-full py-1 bg-zinc-800 group-hover:bg-red-600 text-zinc-300 group-hover:text-white rounded text-[10px] font-bold text-center transition flex items-center justify-center gap-1">
                  <Plus className="w-3 h-3" />
                  <span>Xếp Tier</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Quick Tier Assignment Modal */}
      {activeAssignModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-md w-full shadow-2xl relative animate-scaleUp">
            <button
              onClick={() => setActiveAssignModal(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white p-1 rounded-lg hover:bg-zinc-800"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 mb-5">
              <div className="w-20 h-20 bg-zinc-950 border border-zinc-800 rounded-xl p-2 flex items-center justify-center">
                <img
                  src={activeAssignModal.image}
                  alt={activeAssignModal.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow"
                />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-red-500/20 text-red-400 rounded-full border border-red-500/30">
                  {activeAssignModal.weapon} • {activeAssignModal.tierLabel}
                </span>
                <h4 className="text-base font-bold text-white mt-1">
                  {activeAssignModal.name}
                </h4>
                <p className="text-xs text-zinc-400">
                  {activeAssignModal.bundle} • {activeAssignModal.priceVP} VP
                </p>
              </div>
            </div>

            <div className="text-xs font-bold text-zinc-300 mb-3 flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-red-400" />
              <span>Chọn Bậc Tier Cho Skin Này:</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {TIER_CONFIG.map(t => (
                <button
                  key={`assign-${t.key}`}
                  onClick={() => handleAddToTier(t.key, activeAssignModal.id)}
                  className={cn(
                    "p-3 rounded-xl border transition-all text-left flex items-center gap-3 hover:scale-[1.02]",
                    t.border,
                    "bg-zinc-950/70 hover:bg-zinc-800/80"
                  )}
                >
                  <span className={cn("px-2.5 py-1 rounded-lg font-black text-sm", t.badgeBg)}>
                    {t.badge}
                  </span>
                  <div>
                    <div className={cn("text-xs font-bold", t.color)}>{t.label}</div>
                    <div className="text-[10px] text-zinc-400 truncate max-w-[120px]">{t.subLabel}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  onToggleWishlist(activeAssignModal.id);
                  setActiveAssignModal(null);
                }}
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5"
              >
                <Heart className="w-3.5 h-3.5" />
                <span>
                  {wishlistIds.includes(activeAssignModal.id) ? "Đã trong Wishlist" : "Thêm vào Wishlist"}
                </span>
              </button>
              <button
                onClick={() => {
                  onSelectSkinDetail(activeAssignModal);
                  setActiveAssignModal(null);
                }}
                className="text-xs text-zinc-400 hover:text-white font-bold"
              >
                Xem chi tiết review →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
