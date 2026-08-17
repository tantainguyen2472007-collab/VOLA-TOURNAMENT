import { useState, useMemo, useEffect } from "react";
import { POPULAR_SKINS, WeaponSkin, ProPlayerInfo } from "../data/skins";
import { SkinTierList } from "../components/skins/SkinTierList";
import { SkinWishlist } from "../components/skins/SkinWishlist";
import { getWeaponCategoryConfig } from "../utils/skinMetrics";
import { 
  Star, 
  TrendingUp, 
  Calendar, 
  Trophy, 
  CheckCircle2, 
  ChevronRight, 
  Palette, 
  Search, 
  X, 
  Sparkles, 
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Zap,
  RotateCcw,
  ShoppingBag,
  Moon,
  Volume2,
  Activity,
  Crosshair,
  Award,
  Layers,
  Coins,
  Heart,
  ListOrdered,
  Sword,
  Target,
  Package
} from "lucide-react";
import { cn } from "../lib/utils";
import { playUiClick, playRoleSelect } from "../lib/soundEngine";

const WEAPON_CATEGORIES = [
  "All",
  "Vandal",
  "Phantom",
  "Operator",
  "Sheriff",
  "Ghost",
  "Classic",
  "Melee",
  "Spectre",
  "Marshal",
  "Guardian",
  "Odin",
  "Bulldog",
  "Ares",
  "Outlaw",
  "Judge",
  "Bucky",
  "Frenzy",
  "Shorty",
  "Stinger"
];

// Robust date parser for DD/MM/YYYY and other formats
function parseSkinReleaseDate(dateStr: string): number {
  if (!dateStr) return 0;
  if (dateStr.includes("/")) {
    const parts = dateStr.split("/").map((p) => parseInt(p.trim(), 10));
    if (parts.length === 3) {
      const [day, month, year] = parts;
      if (!isNaN(day) && !isNaN(month) && !isNaN(year)) {
        return new Date(year, (month || 1) - 1, day || 1).getTime();
      }
    }
  }
  if (dateStr.includes("-")) {
    const parts = dateStr.split("-").map((p) => parseInt(p.trim(), 10));
    if (parts.length === 3) {
      if (parts[0] > 1000) {
        return new Date(parts[0], parts[1] - 1, parts[2]).getTime();
      }
      return new Date(parts[2], parts[1] - 1, parts[0]).getTime();
    }
  }
  const parsed = Date.parse(dateStr);
  return isNaN(parsed) ? 0 : parsed;
}

const STORAGE_WISHLIST_KEY = "valorant_skin_wishlist_ids";

export function Skins() {
  const [activeTab, setActiveTab] = useState<"catalog" | "tier_list" | "wishlist">("catalog");

  // Wishlist IDs persistent state
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WISHLIST_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Default initial wishlist items (100% official skins)
    return [
      "1b9b0131-42fe-b6a7-d212-699b342ba642", // Rogue Vandal
      "3f6410af-4fd7-74fb-c0f4-6ab61d30022c", // Kuronami Phantom
      "d8d5d7a1-4d81-8560-54bc-0692ab40f69b", // Kuronami Vandal
      "4c926aa9-4f26-bc80-c486-9b888333373f"  // Araxys Vandal
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_KEY, JSON.stringify(wishlistIds));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistIds]);

  const handleToggleWishlist = (skinId: string) => {
    playRoleSelect();
    setWishlistIds((prev) => {
      if (prev.includes(skinId)) {
        return prev.filter((id) => id !== skinId);
      } else {
        return [...prev, skinId];
      }
    });
  };

  const [skins, setSkins] = useState<WeaponSkin[]>(() => {
    // Load local ratings if any
    const saved = localStorage.getItem("valorant_skin_ratings");
    if (saved) {
      try {
        const parsedRatings: Record<string, number> = JSON.parse(saved);
        return POPULAR_SKINS.map((s) => ({
          ...s,
          rating: parsedRatings[s.id] !== undefined ? parsedRatings[s.id] : s.rating
        }));
      } catch (e) {
        console.error(e);
      }
    }
    return POPULAR_SKINS;
  });

  const [activeSkin, setActiveSkin] = useState<WeaponSkin | null>(() => POPULAR_SKINS[0] || null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedWeapon, setSelectedWeapon] = useState("All");
  const [selectedBundle, setSelectedBundle] = useState("All");
  const [selectedTier, setSelectedTier] = useState<string>("All");
  const [selectedNightMarket, setSelectedNightMarket] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "rating" | "pickRate" | "price_asc" | "price_desc" | "name">("date_desc");
  const [displayCount, setDisplayCount] = useState(24);

  // Quick detail handler that can open from other tabs
  const handleSelectSkinDetail = (skin: WeaponSkin) => {
    setActiveSkin(skin);
    setActiveTab("catalog");
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // Extract all unique bundles for the filter dropdown
  const allBundles = useMemo(() => {
    const set = new Set<string>();
    POPULAR_SKINS.forEach((s) => {
      if (s.bundle) set.add(s.bundle);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, []);

  // Compute counts per weapon
  const weaponCounts = useMemo(() => {
    const counts: Record<string, number> = { All: POPULAR_SKINS.length };
    POPULAR_SKINS.forEach((s) => {
      counts[s.weapon] = (counts[s.weapon] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter and sort skins
  const filteredSkins = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    return skins.filter((skin) => {
      // Weapon filter
      if (selectedWeapon !== "All" && skin.weapon !== selectedWeapon) {
        return false;
      }

      // Bundle filter
      if (selectedBundle !== "All" && skin.bundle !== selectedBundle) {
        return false;
      }

      // Tier filter
      if (selectedTier !== "All" && skin.tier !== selectedTier) {
        return false;
      }

      // Night Market filter
      if (selectedNightMarket === "eligible" && !skin.storeFrequency?.nightMarketEligible) {
        return false;
      }
      if (selectedNightMarket === "ineligible" && skin.storeFrequency?.nightMarketEligible) {
        return false;
      }
      if (selectedNightMarket === "limited" && skin.storeFrequency?.tier !== "Đặc Biệt Giới Hạn (0%)") {
        return false;
      }

      // Search query (search in name, weapon, bundle, placebo effect, or pro player name / team)
      if (q) {
        // Support alias: if user typed 'rouge', match 'rogue' as well
        const normalizedQ = q.replace(/\brouge\b/g, 'rogue');
        const matchName = skin.name.toLowerCase().includes(q) || skin.name.toLowerCase().includes(normalizedQ);
        const matchWeapon = skin.weapon.toLowerCase().includes(q) || skin.weapon.toLowerCase().includes(normalizedQ);
        const matchBundle = skin.bundle.toLowerCase().includes(q) || skin.bundle.toLowerCase().includes(normalizedQ);
        const matchPlacebo = skin.reviewDetails?.placeboEffect?.toLowerCase().includes(q) || false;
        const matchPro = skin.proUsers.some(
          (p) => p.name.toLowerCase().includes(q) || p.team.toLowerCase().includes(q)
        );

        if (!matchName && !matchWeapon && !matchBundle && !matchPro && !matchPlacebo) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === "date_desc") {
        const timeA = parseSkinReleaseDate(a.releaseDate);
        const timeB = parseSkinReleaseDate(b.releaseDate);
        return timeB - timeA;
      }
      if (sortBy === "date_asc") {
        const timeA = parseSkinReleaseDate(a.releaseDate);
        const timeB = parseSkinReleaseDate(b.releaseDate);
        return timeA - timeB;
      }
      if (sortBy === "rating") {
        return b.rating - a.rating;
      }
      if (sortBy === "pickRate") {
        const rateA = parseFloat(a.pickRate) || 0;
        const rateB = parseFloat(b.pickRate) || 0;
        return rateB - rateA;
      }
      if (sortBy === "price_desc") {
        return (b.priceVP || 0) - (a.priceVP || 0);
      }
      if (sortBy === "price_asc") {
        return (a.priceVP || 0) - (b.priceVP || 0);
      }
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });
  }, [skins, searchQuery, selectedWeapon, selectedBundle, selectedTier, selectedNightMarket, sortBy]);

  const visibleSkins = useMemo(() => {
    return filteredSkins.slice(0, displayCount);
  }, [filteredSkins, displayCount]);

  const handleRate = (id: string, newRating: number) => {
    playUiClick();
    const updated = skins.map((s) => (s.id === id ? { ...s, rating: newRating } : s));
    setSkins(updated);

    if (activeSkin?.id === id) {
      setActiveSkin({ ...activeSkin, rating: newRating });
    }

    // Save to localStorage
    try {
      const saved = localStorage.getItem("valorant_skin_ratings");
      const parsed: Record<string, number> = saved ? JSON.parse(saved) : {};
      parsed[id] = newRating;
      localStorage.setItem("valorant_skin_ratings", JSON.stringify(parsed));
    } catch (e) {
      console.error(e);
    }
  };

  const resetFilters = () => {
    playUiClick();
    setSearchQuery("");
    setSelectedWeapon("All");
    setSelectedBundle("All");
    setSelectedTier("All");
    setSelectedNightMarket("All");
    setSortBy("date_desc");
    setDisplayCount(24);
  };

  const isFiltered = searchQuery !== "" || selectedWeapon !== "All" || selectedBundle !== "All" || selectedTier !== "All" || selectedNightMarket !== "All";

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-display uppercase tracking-widest text-white">
                BỘ SƯU TẬP SKIN VALORANT & METRICS
              </h1>
              <p className="text-xs md:text-sm text-white/50">
                Toàn bộ {POPULAR_SKINS.length} Skin Valorant với ngày ra mắt chính thức, tần suất xuất hiện Shop / Chợ Đen, tự tạo Tier List & Wishlist tính VP.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Meta Summary Pills */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-purple-400" />
            🟣 Premium (1,775 VP)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-300 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-orange-400" />
            🟠 Exclusive (2,175 VP)
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            🟡 Ultra (2,475 VP+)
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs: Catalog | Tier List Builder | Wishlist */}
      <div className="flex items-center gap-2.5 border-b border-white/10 pb-4 overflow-x-auto">
        <button
          id="tab-skin-catalog-btn"
          onClick={() => {
            playRoleSelect();
            setActiveTab("catalog");
          }}
          className={cn(
            "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer border",
            activeTab === "catalog"
              ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white border-purple-400 shadow-[0_0_20px_rgba(168,85,247,0.4)]"
              : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white"
          )}
        >
          <Palette className="w-4 h-4" />
          <span>Khám Phá Skins ({POPULAR_SKINS.length})</span>
        </button>

        <button
          id="tab-skin-tierlist-btn"
          onClick={() => {
            playRoleSelect();
            setActiveTab("tier_list");
          }}
          className={cn(
            "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer border",
            activeTab === "tier_list"
              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white border-red-400 shadow-[0_0_20px_rgba(239,68,68,0.4)]"
              : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white"
          )}
        >
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Tự Tạo Tier List</span>
        </button>

        <button
          id="tab-skin-wishlist-btn"
          onClick={() => {
            playRoleSelect();
            setActiveTab("wishlist");
          }}
          className={cn(
            "px-5 py-2.5 rounded-2xl text-xs md:text-sm font-display uppercase tracking-wider font-bold transition-all flex items-center gap-2 cursor-pointer border",
            activeTab === "wishlist"
              ? "bg-gradient-to-r from-rose-600 to-pink-600 text-white border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)]"
              : "bg-white/[0.03] text-white/70 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white"
          )}
        >
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>Danh Sách Ước & Tính VP</span>
          {wishlistIds.length > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white ml-1">
              {wishlistIds.length}
            </span>
          )}
        </button>
      </div>

      {/* Conditionally Render Active Tab Content */}
      {activeTab === "tier_list" && (
        <SkinTierList
          onSelectSkinDetail={handleSelectSkinDetail}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {activeTab === "wishlist" && (
        <SkinWishlist
          onSelectSkinDetail={handleSelectSkinDetail}
          wishlistIds={wishlistIds}
          onToggleWishlist={handleToggleWishlist}
        />
      )}

      {activeTab === "catalog" && (
        <>
          {/* SEARCH & FILTERS BAR */}
          <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-5 md:p-6 space-y-4 shadow-xl">
        {/* Row 1: Search Input + Bundle Dropdown + Tier Dropdown + Night Market Dropdown + Sort */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3">
          {/* Search Box */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm tên skin, vũ khí, bundle, pro player, aimbot..."
              className="w-full h-11 pl-11 pr-10 rounded-2xl bg-black/60 border border-white/10 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-xs text-white placeholder:text-white/40 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white/60 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bundle Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedBundle}
              onChange={(e) => {
                playRoleSelect();
                setSelectedBundle(e.target.value);
              }}
              aria-label="Lọc theo Bundle"
              className="w-full h-11 px-3 rounded-2xl bg-black/60 border border-white/10 focus:border-purple-500 text-xs text-white/80 font-display uppercase tracking-wider cursor-pointer"
            >
              <option value="All">Tất Cả Bundle ({allBundles.length})</option>
              {allBundles.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Tier Filter Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedTier}
              onChange={(e) => {
                playRoleSelect();
                setSelectedTier(e.target.value);
              }}
              aria-label="Lọc theo Bậc Skin"
              className="w-full h-11 px-3 rounded-2xl bg-black/60 border border-white/10 focus:border-purple-500 text-xs text-white/80 font-display uppercase tracking-wider cursor-pointer"
            >
              <option value="All">Tất Cả Bậc</option>
              <option value="Ultra">🟡 Bậc Vàng/Đỏ (Ultra)</option>
              <option value="Exclusive">🟠 Bậc Cam (Exclusive)</option>
              <option value="Premium">🟣 Bậc Tím (Premium)</option>
              <option value="Deluxe">🟢 Bậc Lục (Deluxe)</option>
              <option value="Select">🔵 Bậc Lam (Select)</option>
            </select>
          </div>

          {/* Night Market Eligibility Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedNightMarket}
              onChange={(e) => {
                playRoleSelect();
                setSelectedNightMarket(e.target.value);
              }}
              aria-label="Lọc theo Chợ Đen"
              className="w-full h-11 px-3 rounded-2xl bg-black/60 border border-white/10 focus:border-purple-500 text-xs text-white/80 font-display uppercase tracking-wider cursor-pointer"
            >
              <option value="All">🌙 Tất Cả Pool Shop</option>
              <option value="eligible">✅ Đủ Điều Kiện Chợ Đen</option>
              <option value="ineligible">🔒 Không Vào Chợ Đen</option>
              <option value="limited">🏆 Giới Hạn (Vaulted / VCT)</option>
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={sortBy}
              onChange={(e) => {
                playRoleSelect();
                setSortBy(e.target.value as any);
              }}
              aria-label="Sắp xếp danh sách skin"
              className="w-full h-11 px-3 rounded-2xl bg-black/60 border border-purple-500/50 focus:border-purple-400 text-xs text-purple-300 font-display uppercase tracking-wider cursor-pointer bg-purple-950/20"
            >
              <option value="date_desc">🆕 Ngày Ra Mắt: Mới Nhất</option>
              <option value="date_asc">⏳ Ngày Ra Mắt: Cũ Nhất</option>
              <option value="rating">⭐ Đánh Giá Cao Nhất</option>
              <option value="pickRate">🔥 Pick Rate Rank Meta</option>
              <option value="price_desc">💎 Giá VP: Cao Đến Thấp</option>
              <option value="price_asc">💰 Giá VP: Thấp Đến Cao</option>
              <option value="name">🔤 Tên Skin (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Row 2: Weapon Type Filter Pills */}
        <div className="pt-2 border-t border-white/10">
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="text-[11px] font-display uppercase tracking-widest text-white/50 flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-purple-400" />
              Lọc Theo Loại Vũ Khí (Weapon Type):
            </span>

            {isFiltered && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-display uppercase tracking-wider flex items-center gap-1 hover:underline transition-colors"
              >
                <RotateCcw className="w-3 h-3" /> Đặt Lại Bộ Lọc
              </button>
            )}
          </div>

          {/* Horizontal scrollable categories */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-white/10">
            {WEAPON_CATEGORIES.map((w) => {
              const isSelected = selectedWeapon === w;
              const count = weaponCounts[w] || 0;

              return (
                <button
                  key={w}
                  onClick={() => {
                    playRoleSelect();
                    setSelectedWeapon(w);
                  }}
                  className={cn(
                    "px-3.5 py-1.5 rounded-xl text-xs font-display uppercase tracking-wider whitespace-nowrap transition-all duration-200 flex items-center gap-1.5 cursor-pointer border",
                    isSelected
                      ? "bg-purple-600 text-white border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.4)] font-bold scale-105"
                      : "bg-white/[0.03] text-white/60 border-white/10 hover:border-white/30 hover:bg-white/10 hover:text-white"
                  )}
                >
                  <span>{w === "All" ? "Tất Cả" : w === "Melee" ? "Melee (Cận Chiến)" : w}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.2 rounded-full font-mono",
                    isSelected ? "bg-black/30 text-white" : "bg-white/10 text-white/50"
                  )}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT: 2/3 Grid + 1/3 Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle: Skins Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display uppercase tracking-widest text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-purple-400" />
              DANH SÁCH SKIN ({filteredSkins.length} Kết Quả)
            </h2>
            <span className="text-xs text-white/50">
              Đang hiển thị {visibleSkins.length} / {filteredSkins.length} Skin
            </span>
          </div>

          {filteredSkins.length === 0 ? (
            <div className="bg-[#0c0c0c] border border-white/10 rounded-3xl p-12 text-center space-y-4">
              <Palette className="w-12 h-12 text-white/20 mx-auto" />
              <div className="text-base font-display uppercase tracking-wider text-white">
                Không tìm thấy skin phù hợp
              </div>
              <p className="text-xs text-white/50 max-w-md mx-auto">
                Thử thay đổi từ khóa tìm kiếm hoặc chọn loại vũ khí / bundle khác.
              </p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-purple-600 hover:bg-purple-500 text-white text-xs font-display uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer"
              >
                Đặt Lại Tất Cả Bộ Lọc
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {visibleSkins.map((skin) => {
                  const isSelected = activeSkin?.id === skin.id;

                  return (
                    <div
                      key={skin.id}
                      onClick={() => {
                        playRoleSelect();
                        setActiveSkin(skin);
                      }}
                      className={cn(
                        "p-4 rounded-3xl border transition-all duration-300 group cursor-pointer relative overflow-hidden flex flex-col justify-between h-80",
                        isSelected
                          ? "bg-purple-500/10 border-purple-500/60 shadow-[0_0_30px_rgba(168,85,247,0.2)] ring-1 ring-purple-500/50 scale-[1.02]"
                          : "bg-[#0c0c0c] border-white/10 hover:border-white/30 hover:bg-white/5 hover:scale-[1.01]"
                      )}
                    >
                      {/* Top Header: Weapon / Bundle & Rating */}
                      <div className="flex justify-between items-start gap-2 relative z-10">
                        <div className="min-w-0">
                          <h3 className="text-sm font-display uppercase tracking-wider text-white group-hover:text-purple-300 transition-colors truncate font-bold">
                            {skin.name}
                          </h3>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span
                              className={cn(
                                "text-[9px] font-mono uppercase px-1.5 py-0.2 rounded border font-bold",
                                skin.tier === "Ultra"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : skin.tier === "Exclusive"
                                  ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
                                  : skin.tier === "Premium"
                                  ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                                  : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                              )}
                            >
                              {skin.tier}
                            </span>
                            <span className="text-[10px] text-white/50 truncate">
                              {skin.bundle}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleWishlist(skin.id);
                            }}
                            className={cn(
                              "p-1.5 rounded-full border transition",
                              wishlistIds.includes(skin.id)
                                ? "bg-rose-500/20 text-rose-400 border-rose-500/40"
                                : "bg-black/60 text-white/40 border-white/10 hover:text-white hover:bg-white/10"
                            )}
                            title={wishlistIds.includes(skin.id) ? "Bỏ khỏi Wishlist" : "Thêm vào Wishlist"}
                          >
                            <Heart className={cn("w-3 h-3", wishlistIds.includes(skin.id) && "fill-rose-400")} />
                          </button>

                          <div className="flex items-center gap-1 bg-black/60 border border-white/10 px-2 py-0.5 rounded-full">
                            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-[11px] font-bold font-mono text-white">
                              {skin.rating.toFixed(1)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Middle: Skin Image */}
                      <div className="h-28 flex items-center justify-center p-2 relative z-10 my-1">
                        <img
                          src={skin.image}
                          alt={skin.name}
                          loading="lazy"
                          className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_12px_rgba(255,255,255,0.12)] group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-all duration-500"
                        />
                      </div>

                      {/* Bottom Info: Price & Release Date & Pick Rate */}
                      <div className="pt-2 border-t border-white/10 relative z-10 space-y-1.5 mt-auto">
                        <div className="flex items-center justify-between text-[10px] font-mono">
                          <span className="flex items-center gap-1 text-purple-300 font-bold">
                            <Coins className="w-3 h-3 text-yellow-400" />
                            {skin.priceVP ? `${skin.priceVP.toLocaleString()} VP` : "1,775 VP"}
                          </span>
                          <span className="flex items-center gap-1 text-white/50">
                            <Calendar className="w-3 h-3 text-white/40" />
                            {skin.releaseDate}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-[11px]">
                          <span className="flex items-center gap-1 text-white/60 text-[10px]">
                            <TrendingUp className="w-3 h-3 text-emerald-400" />
                            Rank: <span className="font-bold text-emerald-400">{skin.pickRate}</span>
                          </span>

                          <span className={cn(
                            "text-[9px] px-1.5 py-0.5 rounded font-mono font-bold truncate max-w-[120px]",
                            skin.storeFrequency?.nightMarketEligible
                              ? "bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                              : "bg-white/5 text-white/40 border border-white/10"
                          )}>
                            {skin.storeFrequency?.nightMarketEligible ? "🌙 Chợ Đen: Có" : "🔒 Chợ Đen: Không"}
                          </span>
                        </div>
                      </div>

                      {/* Active indicator background highlight */}
                      {isSelected && (
                        <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 via-transparent to-transparent pointer-events-none" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Load More Button if remaining */}
              {visibleSkins.length < filteredSkins.length && (
                <div className="text-center pt-4">
                  <button
                    onClick={() => {
                      playUiClick();
                      setDisplayCount((prev) => prev + 24);
                    }}
                    className="px-8 py-3 rounded-full bg-white/10 hover:bg-purple-600 text-white font-display text-xs uppercase tracking-widest font-bold transition-all border border-white/15 hover:border-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] cursor-pointer"
                  >
                    Hiển Thị Thêm ({filteredSkins.length - visibleSkins.length} Skin Còn Lại)
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Right: Detailed Skin Evaluation & Metrics Panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {activeSkin ? (
              <div className="bg-[#0c0c0c] border border-purple-500/40 rounded-3xl p-5 md:p-6 shadow-2xl relative overflow-hidden space-y-5 max-h-[calc(100vh-6rem)] overflow-y-auto scrollbar-thin scrollbar-thumb-purple-500/20">
                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-36 h-36 bg-purple-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center border border-purple-500/40 text-purple-400">
                      <Palette className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-display text-white uppercase tracking-widest font-bold">
                        CHI TIẾT & METRICS SKIN
                      </h3>
                      <span className="text-[10px] text-white/50 font-mono">BẬC {activeSkin.tier.toUpperCase()} EDITION</span>
                    </div>
                  </div>

                  <span
                    className={cn(
                      "text-[10px] font-mono uppercase px-2.5 py-1 rounded-full border font-bold",
                      activeSkin.tier === "Ultra"
                        ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                        : activeSkin.tier === "Exclusive"
                        ? "bg-orange-500/20 text-orange-300 border-orange-500/40"
                        : activeSkin.tier === "Premium"
                        ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                        : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                    )}
                  >
                    {activeSkin.tierLabel || `${activeSkin.tier} Edition`}
                  </span>
                </div>

                {/* Big Weapon Display Stage */}
                <div className="h-44 flex items-center justify-center bg-black/60 rounded-2xl border border-white/10 p-4 relative group">
                  <img
                    src={activeSkin.image}
                    alt={activeSkin.name}
                    className="max-w-full max-h-full object-contain filter drop-shadow-[0_0_25px_rgba(168,85,247,0.4)] group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-2 right-3 text-[10px] font-mono text-white/40 uppercase">
                    {activeSkin.weapon}
                  </div>
                  <div className="absolute top-2 left-3 text-[10px] font-mono text-yellow-400 flex items-center gap-1 font-bold">
                    <Coins className="w-3 h-3" />
                    {activeSkin.priceVP ? `${activeSkin.priceVP.toLocaleString()} VP` : "1,775 VP"}
                  </div>
                </div>

                {/* Name & Bundle Title + Quick Actions */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xl md:text-2xl font-display text-white uppercase tracking-wider font-bold">
                      {activeSkin.name}
                    </h4>
                    <button
                      onClick={() => handleToggleWishlist(activeSkin.id)}
                      className={cn(
                        "px-3 py-1.5 rounded-xl border text-xs font-display uppercase tracking-wider font-bold transition-all flex items-center gap-1.5 flex-shrink-0 cursor-pointer",
                        wishlistIds.includes(activeSkin.id)
                          ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-[0_0_12px_rgba(244,63,94,0.3)]"
                          : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10 hover:text-white"
                      )}
                    >
                      <Heart className={cn("w-3.5 h-3.5", wishlistIds.includes(activeSkin.id) ? "fill-rose-400 text-rose-400" : "text-white/50")} />
                      <span>{wishlistIds.includes(activeSkin.id) ? "Đã Thích" : "Wishlist"}</span>
                    </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-white/60 uppercase tracking-wider flex-wrap">
                    <span>Bundle: <strong className="text-purple-300">{activeSkin.bundle}</strong></span>
                    <span>•</span>
                    <span>Vũ khí: <strong className="text-white">{activeSkin.weapon}</strong></span>
                  </div>
                </div>

                {/* Placebo / Aim Feedback Badge */}
                {activeSkin.reviewDetails?.placeboEffect && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-start gap-2.5">
                    <Zap className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="text-xs">
                      <div className="font-display uppercase tracking-wider text-purple-300 font-bold mb-0.5">
                        Cảm Giác Aimbot / Placebo:
                      </div>
                      <div className="text-white/80 leading-relaxed">
                        {activeSkin.reviewDetails.placeboEffect}
                      </div>
                    </div>
                  </div>
                )}

                {/* BUNDLE ROGUE SPECIAL BREAKDOWN */}
                {activeSkin.bundle === "Rogue" && (
                  <div className="bg-gradient-to-br from-red-950/40 via-black/60 to-purple-950/40 border border-red-500/30 p-4 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-red-400" />
                        <span className="text-xs font-display uppercase tracking-widest text-white font-bold">
                          Thông Tin Trọn Bộ Bundle Rogue
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 rounded-full">
                        <span className="text-[11px] font-mono font-bold text-red-300">8.700 VP</span>
                        <span className="text-[10px] text-white/50 line-through">13.050 VP</span>
                      </div>
                    </div>

                    <div className="text-xs space-y-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                        <div className="flex justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-white/70 flex items-center gap-1">🎯 Vandal Rogue:</span>
                          <span className="font-mono font-bold text-yellow-400">2.175 VP</span>
                        </div>
                        <div className="flex justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-white/70 flex items-center gap-1">🔭 Operator Rogue:</span>
                          <span className="font-mono font-bold text-yellow-400">2.175 VP</span>
                        </div>
                        <div className="flex justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-white/70 flex items-center gap-1">💥 Bucky Rogue:</span>
                          <span className="font-mono font-bold text-yellow-400">2.175 VP</span>
                        </div>
                        <div className="flex justify-between p-1.5 rounded-lg bg-white/5 border border-white/5">
                          <span className="text-white/70 flex items-center gap-1">🔫 Bandit Rogue (2026):</span>
                          <span className="font-mono font-bold text-yellow-400">2.175 VP</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Sword className="w-3.5 h-3.5 text-amber-400" />
                          <span className="text-amber-200 font-bold">Push Dagger (Dao găm đẩy song thủ):</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-white/50 line-through font-mono">4.350 VP</span>
                          <span className="font-mono font-bold text-emerald-400 uppercase bg-emerald-500/20 px-1.5 py-0.2 rounded">Miễn Phí</span>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[11px] text-white/70 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400 flex-shrink-0" />
                        <span><strong>Phụ kiện đi kèm:</strong> Thẻ người chơi (Player Card), Phụ kiện súng (Gun Buddy) và Hình phun sơn (Spray) tặng kèm.</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* STORE & NIGHT MARKET FREQUENCY CARD */}
                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-display uppercase tracking-widest text-white/70 flex items-center gap-1.5 font-bold">
                      <ShoppingBag className="w-3.5 h-3.5 text-purple-400" />
                      Tần Suất Xuất Hiện Shop & Chợ Đen
                    </span>
                    <span className="text-[10px] font-mono text-purple-300">Riot Store Algo</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block">Tần Suất Daily Shop:</span>
                      <span className="font-bold text-white block">
                        {activeSkin.storeFrequency?.tier || "Hiếm (1.5% - 2.5%)"}
                      </span>
                    </div>

                    <div className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                      <span className="text-[10px] text-white/50 uppercase tracking-wider block">Thời Gian Chờ Xoay:</span>
                      <span className="font-mono font-bold text-yellow-400 block">
                        {activeSkin.storeFrequency?.avgWaitDays || "~45 - 90 ngày"}
                      </span>
                    </div>
                  </div>

                  {/* Night Market Status Tag */}
                  <div className={cn(
                    "p-2.5 rounded-xl text-xs flex items-start gap-2 border",
                    activeSkin.storeFrequency?.nightMarketEligible
                      ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-200"
                      : "bg-orange-500/10 border-orange-500/30 text-orange-200"
                  )}>
                    <Moon className="w-4 h-4 flex-shrink-0 mt-0.5 text-current" />
                    <div>
                      <span className="font-bold block mb-0.5">
                        {activeSkin.storeFrequency?.nightMarketEligible ? "ĐỦ ĐIỀU KIỆN CHỢ ĐEN (NIGHT MARKET)" : "KHÔNG XUẤT HIỆN CHỢ ĐEN"}
                      </span>
                      <span className="text-[11px] opacity-80 leading-relaxed block">
                        {activeSkin.storeFrequency?.nightMarketStatus || "Theo quy tắc phân hạng bậc skin của Riot Games."}
                      </span>
                    </div>
                  </div>
                </div>

                {/* DETAILED SCORE BREAKDOWN */}
                {(() => {
                  const categoryConfig = getWeaponCategoryConfig(activeSkin.weapon, activeSkin.name);
                  return (
                    <>
                      {/* Weapon Category Banner */}
                      <div className="p-3 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br flex-shrink-0", categoryConfig.badgeColor)}>
                            {categoryConfig.type === "melee" ? (
                              <Sword className="w-4 h-4" />
                            ) : categoryConfig.type === "sidearm" || categoryConfig.type === "sniper" ? (
                              <Crosshair className="w-4 h-4" />
                            ) : categoryConfig.type === "heavy" ? (
                              <ShieldCheck className="w-4 h-4" />
                            ) : categoryConfig.type === "shotgun" ? (
                              <Zap className="w-4 h-4" />
                            ) : categoryConfig.type === "smg" ? (
                              <Layers className="w-4 h-4" />
                            ) : (
                              <Target className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-display uppercase tracking-wider font-bold text-white flex items-center gap-1.5 truncate">
                              <span>{categoryConfig.title}</span>
                            </div>
                            <div className="text-[10px] text-white/50 truncate">
                              {categoryConfig.subtitle}
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/10 text-purple-300 font-bold flex-shrink-0">
                          {activeSkin.weapon}
                        </span>
                      </div>

                      {/* Criteria Score Breakdown */}
                      <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-display uppercase tracking-widest text-white/70 flex items-center gap-1.5 font-bold">
                            <Activity className="w-3.5 h-3.5 text-yellow-400" />
                            Tiêu Chí Đánh Giá Riêng Biệt ({activeSkin.weapon})
                          </span>
                          <span className="text-xs font-mono font-bold text-yellow-400">
                            {activeSkin.rating.toFixed(1)} / 10
                          </span>
                        </div>

                        {/* 3 Customized Metric Bars */}
                        <div className="space-y-2.5 pt-1 text-xs">
                          {/* Metric 1 */}
                          <div>
                            <div className="flex justify-between text-[11px] text-white/70 mb-1">
                              <span className="flex items-center gap-1">
                                <Volume2 className="w-3 h-3 text-purple-400" /> {categoryConfig.score1Label}
                              </span>
                              <span className="font-mono font-bold text-purple-300">
                                {activeSkin.communityScore?.audioScore || 9.8} / 10
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-purple-500 h-full rounded-full"
                                style={{ width: `${((activeSkin.communityScore?.audioScore || 9.8) / 10) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Metric 2 */}
                          <div>
                            <div className="flex justify-between text-[11px] text-white/70 mb-1">
                              <span className="flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-blue-400" /> {categoryConfig.score2Label}
                              </span>
                              <span className="font-mono font-bold text-blue-300">
                                {activeSkin.communityScore?.animationScore || 9.7} / 10
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-blue-500 h-full rounded-full"
                                style={{ width: `${((activeSkin.communityScore?.animationScore || 9.7) / 10) * 100}%` }}
                              />
                            </div>
                          </div>

                          {/* Metric 3 */}
                          <div>
                            <div className="flex justify-between text-[11px] text-white/70 mb-1">
                              <span className="flex items-center gap-1">
                                <Flame className="w-3 h-3 text-amber-400" /> {categoryConfig.score3Label}
                              </span>
                              <span className="font-mono font-bold text-amber-300">
                                {activeSkin.communityScore?.finisherScore || 9.6} / 10
                              </span>
                            </div>
                            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-amber-500 h-full rounded-full"
                                style={{ width: `${((activeSkin.communityScore?.finisherScore || 9.6) / 10) * 100}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  );
                })()}

                {/* Rating Selector Box */}
                <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-display uppercase tracking-widest text-white/70">
                      Chấm Điểm Của Bạn
                    </p>
                    <span className="text-xs font-mono font-bold text-yellow-500">
                      {activeSkin.rating.toFixed(1)} / 10
                    </span>
                  </div>

                  {/* 10-Star selector */}
                  <div className="flex items-center gap-1 justify-between pt-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleRate(activeSkin.id, star)}
                        className="group p-1 cursor-pointer transition-transform hover:scale-125"
                        title={`Chấm ${star} điểm`}
                      >
                        <Star
                          className={cn(
                            "w-5 h-5 transition-all duration-200",
                            star <= Math.round(activeSkin.rating)
                              ? "text-yellow-500 fill-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]"
                              : "text-white/20 group-hover:text-yellow-500/50"
                          )}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-[10px] text-white/40 text-center">
                    Điểm số lưu tự động trên thiết bị của bạn ({activeSkin.communityScore?.totalVotes?.toLocaleString() || "8,500+"} lượt bình chọn toàn cầu)
                  </p>
                </div>

                {/* Review Notes: Category-Tailored In-Depth Evaluation */}
                {activeSkin.reviewDetails && (() => {
                  const catCfg = getWeaponCategoryConfig(activeSkin.weapon, activeSkin.name);
                  return (
                    <div className="bg-black/50 border border-white/10 p-4 rounded-2xl space-y-3 text-xs">
                      <div className="flex items-center justify-between border-b border-white/10 pb-2">
                        <h5 className="text-xs font-display uppercase tracking-widest text-white/80 font-bold flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-purple-400" /> Đánh Giá Chuyên Sâu ({catCfg.title})
                        </h5>
                        <span className="text-[10px] font-mono text-white/40">VCT Meta Pro</span>
                      </div>

                      {/* Dynamic 4 Criteria Blocks Tailored per Weapon Category */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                        {catCfg.evaluations.map((item, idx) => (
                          <div key={idx} className="bg-white/5 p-2.5 rounded-xl border border-white/5 space-y-1">
                            <div className="flex items-center gap-1.5">
                              {item.icon === "Volume2" ? (
                                <Volume2 className="w-3 h-3 text-purple-400" />
                              ) : item.icon === "Sparkles" ? (
                                <Sparkles className="w-3 h-3 text-blue-400" />
                              ) : item.icon === "Zap" ? (
                                <Zap className="w-3 h-3 text-amber-400" />
                              ) : item.icon === "RotateCcw" ? (
                                <RotateCcw className="w-3 h-3 text-emerald-400" />
                              ) : item.icon === "Layers" ? (
                                <Layers className="w-3 h-3 text-teal-400" />
                              ) : item.icon === "Flame" ? (
                                <Flame className="w-3 h-3 text-rose-400" />
                              ) : (
                                <Crosshair className="w-3 h-3 text-cyan-400" />
                              )}
                              <span className={cn("text-[10px] font-mono uppercase font-bold", item.color)}>
                                {item.title}:
                              </span>
                            </div>
                            <p className="text-[11px] text-white/80 leading-relaxed">
                              {item.getValue(activeSkin)}
                            </p>
                          </div>
                        ))}
                      </div>

                      {/* Pros & Cons */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold block">Ưu Điểm:</span>
                          <ul className="space-y-0.5 text-[11px] text-white/70">
                            {activeSkin.reviewDetails.pros?.map((p, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="text-emerald-400">✓</span> {p}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-red-400 font-bold block">Nhược Điểm:</span>
                          <ul className="space-y-0.5 text-[11px] text-white/70">
                            {activeSkin.reviewDetails.cons?.map((c, idx) => (
                              <li key={idx} className="flex items-center gap-1">
                                <span className="text-red-400">✗</span> {c}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {/* Verdict */}
                      <div className="pt-2 border-t border-white/10 text-[11px] text-purple-200/90 italic">
                        "{activeSkin.reviewDetails.verdict}"
                      </div>
                    </div>
                  );
                })()}

                {/* Key Details Grid */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wider">
                      <Calendar className="w-3.5 h-3.5 text-white/40" /> Ra Mắt
                    </span>
                    <div className="font-mono text-sm text-white font-bold">
                      {activeSkin.releaseDate}
                    </div>
                  </div>

                  <div className="bg-white/5 p-3 rounded-2xl border border-white/5 space-y-1">
                    <span className="flex items-center gap-1.5 text-[11px] text-white/50 uppercase tracking-wider">
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Tần Suất Rank
                    </span>
                    <div className="font-mono text-sm text-emerald-400 font-bold">
                      {activeSkin.pickRate}
                    </div>
                  </div>
                </div>

                {/* PRO PLAYERS & TEAMS SECTION */}
                <div className="pt-2 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-display uppercase tracking-widest text-white/70 flex items-center gap-2 font-bold">
                      <Trophy className="w-4 h-4 text-purple-400" />
                      Tuyển Thủ Chuyên Nghiệp & Đội Tuyển
                    </h5>
                    <span className="text-[10px] text-white/40 font-mono">VCT Pro Meta</span>
                  </div>

                  <div className="space-y-2">
                    {activeSkin.proUsers.map((pro: ProPlayerInfo, idx: number) => (
                      <div
                        key={idx}
                        className="p-3 bg-black/60 border border-white/10 hover:border-purple-500/40 rounded-2xl flex items-center justify-between gap-3 transition-colors"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className="w-7 h-7 rounded-lg bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-display font-bold text-xs flex-shrink-0">
                            #{idx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-display text-white uppercase tracking-wider font-bold truncate">
                              {pro.name}
                            </div>
                            <div className="text-[10px] text-white/50 truncate">
                              Tuyển thủ VCT
                            </div>
                          </div>
                        </div>

                        {/* Team Badge */}
                        <div className="px-2.5 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-[11px] font-mono font-bold whitespace-nowrap flex-shrink-0">
                          {pro.team}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ) : (
              <div className="h-96 border border-white/10 border-dashed rounded-3xl flex flex-col items-center justify-center p-8 text-center text-white/40">
                <Palette className="w-12 h-12 mb-4 opacity-50 text-purple-400" />
                <p className="text-sm font-display uppercase tracking-widest mb-2">Chưa chọn Skin</p>
                <p className="text-xs">Click vào một skin bên trái để xem chi tiết thông số, meta và đánh giá độ đẹp.</p>
              </div>
            )}
          </div>
        </div>

      </div>
        </>
      )}
    </div>
  );
}
