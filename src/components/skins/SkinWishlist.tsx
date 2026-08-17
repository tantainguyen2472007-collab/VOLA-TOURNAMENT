import { useState, useMemo, useEffect } from "react";
import { POPULAR_SKINS, WeaponSkin } from "../../data/skins";
import { 
  Heart, 
  ShoppingBag, 
  Coins, 
  Sparkles, 
  Moon, 
  CheckCircle2, 
  Trash2, 
  Share2, 
  Search, 
  SlidersHorizontal, 
  Plus, 
  AlertCircle, 
  RotateCw, 
  Star, 
  Check, 
  Flame, 
  Tag, 
  X,
  Clock,
  Zap,
  TrendingDown
} from "lucide-react";
import { cn } from "../../lib/utils";
import { playUiClick, playRoleSelect } from "../../lib/soundEngine";

export type WishlistPriority = "must_have" | "night_market_only" | "waiting" | "owned";

export interface WishlistItemData {
  skinId: string;
  priority: WishlistPriority;
  note?: string;
  addedAt: number;
}

const STORAGE_WISHLIST_DATA = "valorant_skin_wishlist_data";
const STORAGE_WISHLIST_IDS = "valorant_skin_wishlist_ids";

interface SkinWishlistProps {
  onSelectSkinDetail: (skin: WeaponSkin) => void;
  wishlistIds: string[];
  onToggleWishlist: (skinId: string) => void;
}

export function SkinWishlist({ onSelectSkinDetail, wishlistIds, onToggleWishlist }: SkinWishlistProps) {
  // Wishlist item details state
  const [wishlistItems, setWishlistItems] = useState<Record<string, WishlistItemData>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_WISHLIST_DATA);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error(e);
    }
    // Initialize default items from wishlistIds
    const initial: Record<string, WishlistItemData> = {};
    wishlistIds.forEach(id => {
      initial[id] = {
        skinId: id,
        priority: "must_have",
        addedAt: Date.now()
      };
    });
    return initial;
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [filterPriority, setFilterPriority] = useState<string>("All");
  const [filterWeapon, setFilterWeapon] = useState<string>("All");
  const [copiedToast, setCopiedToast] = useState(false);

  // Daily Shop Roll Simulator State
  const [shopSlots, setShopSlots] = useState<WeaponSkin[]>([]);
  const [isRollingShop, setIsRollingShop] = useState(false);
  const [rollCount, setRollCount] = useState(0);

  // Sync wishlistItems when wishlistIds change
  useEffect(() => {
    setWishlistItems(prev => {
      const next = { ...prev };
      let changed = false;
      // Add missing ids
      wishlistIds.forEach(id => {
        if (!next[id]) {
          next[id] = {
            skinId: id,
            priority: "must_have",
            addedAt: Date.now()
          };
          changed = true;
        }
      });
      // Remove deleted ids
      Object.keys(next).forEach(id => {
        if (!wishlistIds.includes(id)) {
          delete next[id];
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [wishlistIds]);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_WISHLIST_DATA, JSON.stringify(wishlistItems));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistItems]);

  // Skin map
  const skinMap = useMemo(() => {
    const map = new Map<string, WeaponSkin>();
    POPULAR_SKINS.forEach(s => map.set(s.id, s));
    return map;
  }, []);

  // Update item priority
  const handleUpdatePriority = (skinId: string, priority: WishlistPriority) => {
    playUiClick();
    setWishlistItems(prev => {
      const existing = prev[skinId] || { skinId, priority: "must_have" as WishlistPriority, addedAt: Date.now() };
      return {
        ...prev,
        [skinId]: {
          ...existing,
          priority
        }
      };
    });
  };

  // Update note
  const handleUpdateNote = (skinId: string, note: string) => {
    setWishlistItems(prev => {
      const existing = prev[skinId] || { skinId, priority: "must_have" as WishlistPriority, addedAt: Date.now() };
      return {
        ...prev,
        [skinId]: {
          ...existing,
          note
        }
      };
    });
  };

  // Filtered wishlist skins
  const wishlistSkins = useMemo(() => {
    return wishlistIds
      .map(id => {
        const skin = skinMap.get(id);
        const meta = wishlistItems[id] || { skinId: id, priority: "must_have", addedAt: 0 };
        return { skin, meta };
      })
      .filter((item): item is { skin: WeaponSkin; meta: WishlistItemData } => Boolean(item.skin))
      .filter(({ skin, meta }) => {
        if (filterPriority !== "All" && meta.priority !== filterPriority) return false;
        if (filterWeapon !== "All" && skin.weapon !== filterWeapon) return false;
        if (searchQuery) {
          const q = searchQuery.toLowerCase();
          const normalizedQ = q.replace(/\brouge\b/g, 'rogue');
          const matches = skin.name.toLowerCase().includes(q) || 
                          skin.name.toLowerCase().includes(normalizedQ) ||
                          skin.bundle.toLowerCase().includes(q) ||
                          skin.bundle.toLowerCase().includes(normalizedQ);
          if (!matches) return false;
        }
        return true;
      });
  }, [wishlistIds, wishlistItems, filterPriority, filterWeapon, searchQuery, skinMap]);

  // Calculation Metrics
  const metrics = useMemo(() => {
    let totalVP = 0;
    let unownedVP = 0;
    let ownedVP = 0;
    let ownedCount = 0;
    let nightMarketEligibleCount = 0;
    let potentialNMSavingsVP = 0;

    wishlistIds.forEach(id => {
      const skin = skinMap.get(id);
      if (!skin) return;
      const meta = wishlistItems[id];
      const isOwned = meta?.priority === "owned";

      totalVP += skin.priceVP;
      if (isOwned) {
        ownedVP += skin.priceVP;
        ownedCount++;
      } else {
        unownedVP += skin.priceVP;
        if (skin.storeFrequency.nightMarketEligible) {
          nightMarketEligibleCount++;
          // Average 35% discount in Night Market
          potentialNMSavingsVP += Math.round(skin.priceVP * 0.35);
        }
      }
    });

    // Approximate VND: 1,000 VP ≈ 200,000 VND (via Zing card / In-game store)
    const estimatedVND = Math.round((unownedVP / 1000) * 200000);
    const estimatedOwnedVND = Math.round((ownedVP / 1000) * 200000);

    return {
      totalCount: wishlistIds.length,
      unownedCount: wishlistIds.length - ownedCount,
      ownedCount,
      totalVP,
      unownedVP,
      ownedVP,
      estimatedVND,
      estimatedOwnedVND,
      nightMarketEligibleCount,
      potentialNMSavingsVP
    };
  }, [wishlistIds, wishlistItems, skinMap]);

  // Daily Shop Roll Function
  const handleRollDailyShop = () => {
    playRoleSelect();
    setIsRollingShop(true);
    setTimeout(() => {
      // Pick 4 random skins from POPULAR_SKINS that are not vaulted
      const availablePool = POPULAR_SKINS.filter(s => s.storeFrequency.poolStatus !== "Vaulted (Giới Hạn Không Bán Lại)");
      const shuffled = [...availablePool].sort(() => 0.5 - Math.random());
      setShopSlots(shuffled.slice(0, 4));
      setIsRollingShop(false);
      setRollCount(prev => prev + 1);
    }, 600);
  };

  // Check if any rolled skin is in wishlist
  const shopHits = useMemo(() => {
    return shopSlots.filter(s => wishlistIds.includes(s.id));
  }, [shopSlots, wishlistIds]);

  // Share summary
  const handleCopyWishlistSummary = () => {
    playUiClick();
    let text = "💖 DANH SÁCH SĂN SKIN VALORANT (WISHLIST)\n";
    text += "========================================\n";
    text += `🎯 Tổng Skin: ${metrics.totalCount} | Cần Mua: ${metrics.unownedCount} | Đã Có: ${metrics.ownedCount}\n`;
    text += `💎 Tổng VP Cần Nạp: ${metrics.unownedVP.toLocaleString()} VP (~${metrics.estimatedVND.toLocaleString()} VNĐ)\n`;
    if (metrics.nightMarketEligibleCount > 0) {
      text += `🌙 Tiết kiệm dự kiến Chợ Đen: ~${metrics.potentialNMSavingsVP.toLocaleString()} VP\n`;
    }
    text += "\n📋 DANH SÁCH CHI TIẾT:\n";

    wishlistSkins.forEach(({ skin, meta }) => {
      const statusTag = meta.priority === "owned" 
        ? "✅ ĐÃ SỞ HỮU" 
        : meta.priority === "night_market_only" 
        ? "🌙 CHỜ CHỢ ĐEN" 
        : "🔥 MUST BUY";
      text += `• [${statusTag}] ${skin.name} (${skin.weapon}) - ${skin.priceVP} VP\n`;
      if (meta.note) {
        text += `   Ghi chú: "${meta.note}"\n`;
      }
    });

    text += "\n🎮 Quản lý qua Valorant Esports Hub & Meta Skins Tracker";
    navigator.clipboard.writeText(text);
    setCopiedToast(true);
    setTimeout(() => setCopiedToast(false), 2500);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Metrics Overview */}
      <div className="bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-mono font-bold tracking-wider rounded-full border border-rose-500/30 flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 fill-rose-400" />
                WISHLIST & VP CALCULATOR
              </span>
              <span className="text-xs font-mono text-zinc-400">
                Đang theo dõi: <strong className="text-white">{metrics.totalCount}</strong> skins
              </span>
            </div>
            <h2 className="text-2xl lg:text-3xl font-display font-black text-white uppercase tracking-tight">
              Danh Sách Ước & Tính Tiền Nạp VP
            </h2>
            <p className="text-sm text-zinc-400 max-w-2xl mt-1">
              Theo dõi kho skin bạn đang nhắm tới, tính toán chính xác số điểm VP cần nạp, ước tính chi phí VNĐ và mô phỏng xác suất rơi trong Daily Shop / Chợ Đen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              id="copy-wishlist-btn"
              onClick={handleCopyWishlistSummary}
              className="px-4 py-2.5 bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 hover:text-white border border-rose-500/30 rounded-xl text-xs font-bold flex items-center gap-2 transition"
            >
              {copiedToast ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedToast ? "Đã Sao Chép!" : "Chia Sẻ Wishlist"}</span>
            </button>
          </div>
        </div>

        {/* 4 Financial & Target Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          {/* Card 1: Unowned VP needed */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Tổng VP Cần Nạp</span>
              <Coins className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-mono font-black text-amber-400">
                {metrics.unownedVP.toLocaleString()} VP
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Cho {metrics.unownedCount} skin chưa sở hữu
              </div>
            </div>
          </div>

          {/* Card 2: Estimated VND */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Ước Tính VNĐ Nạp Thẻ</span>
              <Tag className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-mono font-black text-emerald-400">
                ~{metrics.estimatedVND.toLocaleString()} đ
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Tỷ giá ~200k / 1,000 VP Riot VNG
              </div>
            </div>
          </div>

          {/* Card 3: Night Market savings */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Tiết Kiệm Chợ Đen (Dự Kiến)</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-mono font-black text-purple-400">
                -{metrics.potentialNMSavingsVP.toLocaleString()} VP
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                {metrics.nightMarketEligibleCount} skin đủ điều kiện giảm giá
              </div>
            </div>
          </div>

          {/* Card 4: Owned Progress */}
          <div className="bg-zinc-950/80 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-zinc-400">Đã Sở Hữu Trong List</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="mt-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-mono font-black text-cyan-400">
                  {metrics.ownedCount}/{metrics.totalCount}
                </span>
                <span className="text-xs text-zinc-400">
                  ({metrics.totalCount > 0 ? Math.round((metrics.ownedCount / metrics.totalCount) * 100) : 0}%)
                </span>
              </div>
              <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-1.5">
                <div 
                  className="bg-cyan-400 h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${metrics.totalCount > 0 ? (metrics.ownedCount / metrics.totalCount) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Daily Shop Simulator Interactive Feature */}
      <div className="bg-gradient-to-br from-zinc-900/90 via-zinc-900 to-zinc-950 border border-amber-500/20 rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-400 font-mono text-[10px] font-bold rounded-md uppercase border border-amber-500/30">
                DAILY SHOP SIMULATOR
              </span>
              {rollCount > 0 && (
                <span className="text-xs font-mono text-zinc-400">
                  Đã quay: {rollCount} lần
                </span>
              )}
            </div>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wide mt-1 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-amber-400" />
              Mô Phỏng 4 Ô Cửa Hàng Hàng Ngày (Roll Daily Shop)
            </h3>
            <p className="text-xs text-zinc-400">
              Thử vận may xem hôm nay 4 ô cửa hàng Valorant có rơi đúng skin bạn đang ao ước trong Wishlist không!
            </p>
          </div>

          <button
            id="roll-daily-shop-btn"
            onClick={handleRollDailyShop}
            disabled={isRollingShop}
            className="px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-zinc-950 font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition active:scale-95 disabled:opacity-50"
          >
            <RotateCw className={cn("w-4 h-4", isRollingShop && "animate-spin")} />
            <span>{isRollingShop ? "Đang Xoay Shop..." : "Xoay Shop Hôm Nay"}</span>
          </button>
        </div>

        {/* Wishlist Match Alert Banner */}
        {shopHits.length > 0 && !isRollingShop && (
          <div className="p-3.5 bg-gradient-to-r from-red-500/20 via-rose-500/20 to-red-500/20 border border-red-500/40 rounded-xl flex items-center gap-3 animate-bounce">
            <Flame className="w-5 h-5 text-red-400 flex-shrink-0" />
            <div className="text-xs">
              <strong className="text-white font-bold">🎉 CHÚC MỪNG BẠN! </strong>
              <span className="text-zinc-200">
                Có <strong className="text-red-400 underline">{shopHits.length} skin</strong> trong Wishlist của bạn đã xuất hiện trong 4 ô cửa hàng hôm nay: 
                <strong> {shopHits.map(s => s.name).join(", ")}</strong>!
              </span>
            </div>
          </div>
        )}

        {/* 4 Shop Slots Grid */}
        {shopSlots.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {shopSlots.map((skin, slotIdx) => {
              const isWishlisted = wishlistIds.includes(skin.id);
              return (
                <div
                  key={`shop-slot-${slotIdx}-${skin.id}`}
                  onClick={() => onSelectSkinDetail(skin)}
                  className={cn(
                    "relative bg-zinc-950 border rounded-xl p-3.5 flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.02]",
                    isWishlisted 
                      ? "border-red-500 bg-red-950/20 shadow-lg shadow-red-500/20 ring-1 ring-red-500" 
                      : "border-zinc-800 hover:border-zinc-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded">
                      Ô #{slotIdx + 1} • {skin.weapon}
                    </span>
                    {isWishlisted && (
                      <span className="text-[10px] font-bold text-red-400 bg-red-500/20 px-2 py-0.5 rounded-full flex items-center gap-1 border border-red-500/30">
                        <Heart className="w-2.5 h-2.5 fill-red-400" />
                        Wishlist Hit!
                      </span>
                    )}
                  </div>

                  <div className="h-20 flex items-center justify-center p-2">
                    <img
                      src={skin.image}
                      alt={skin.name}
                      className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition"
                    />
                  </div>

                  <div className="mt-2">
                    <div className="text-xs font-bold text-white truncate hover:text-red-400">
                      {skin.name}
                    </div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mt-1">
                      <span className="font-mono text-amber-400 font-bold">{skin.priceVP} VP</span>
                      <span className="text-[10px] text-zinc-400">{skin.storeFrequency.avgWaitDays}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center border border-dashed border-zinc-800 rounded-xl text-xs text-zinc-400 font-mono">
            Nhấn nút <strong className="text-amber-400">"Xoay Shop Hôm Nay"</strong> để mở 4 ô cửa hàng ngẫu nhiên.
          </div>
        )}
      </div>

      {/* Wishlist Items Filter & Management */}
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-display font-black text-white uppercase tracking-wide flex items-center gap-2">
              <Heart className="w-5 h-5 text-rose-400 fill-rose-400" />
              Chi Tiết Danh Sách Ước ({wishlistSkins.length} skins)
            </h3>
            <p className="text-xs text-zinc-400 mt-0.5">
              Phân loại độ ưu tiên, đánh dấu skin đã sở hữu và ghi chú biến thể màu sắc yêu thích.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Tìm trong wishlist..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-white placeholder-zinc-400 focus:outline-none focus:border-rose-500 w-44 sm:w-52"
              />
            </div>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="All">Mọi Ưu Tiên</option>
              <option value="must_have">🔥 Cần Mua Ngay (Must-Have)</option>
              <option value="night_market_only">🌙 Chờ Chợ Đen</option>
              <option value="waiting">⏳ Đợi Lương / Đang Cân Nhắc</option>
              <option value="owned">✅ Đã Sở Hữu</option>
            </select>

            <select
              value={filterWeapon}
              onChange={(e) => setFilterWeapon(e.target.value)}
              className="px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-xl text-xs text-zinc-200 focus:outline-none focus:border-rose-500"
            >
              <option value="All">Tất cả vũ khí</option>
              <option value="Vandal">Vandal</option>
              <option value="Phantom">Phantom</option>
              <option value="Operator">Operator</option>
              <option value="Sheriff">Sheriff</option>
              <option value="Melee">Melee</option>
            </select>
          </div>
        </div>

        {/* Wishlist Skin Cards List */}
        {wishlistSkins.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-zinc-800 rounded-2xl">
            <Heart className="w-10 h-10 text-zinc-600 mx-auto mb-2" />
            <div className="text-sm font-bold text-zinc-300">Chưa có skin nào trong danh sách lọc này</div>
            <p className="text-xs text-zinc-400 mt-1 max-w-sm mx-auto">
              Chuyển sang tab Khám Phá Skin hoặc Tier List để nhấn nút hình trái tim và thêm skin vào Wishlist.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {wishlistSkins.map(({ skin, meta }) => {
              const isOwned = meta.priority === "owned";
              const isNightMarketOnly = meta.priority === "night_market_only";

              return (
                <div
                  key={`wishlist-card-${skin.id}`}
                  className={cn(
                    "bg-zinc-950/80 border rounded-xl p-4 flex flex-col justify-between transition-all hover:border-zinc-700 relative overflow-hidden",
                    isOwned ? "border-emerald-500/30 bg-emerald-950/5" : "border-zinc-800"
                  )}
                >
                  {/* Top info row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 bg-zinc-900 text-zinc-300 rounded">
                        {skin.weapon}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {skin.bundle}
                      </span>
                    </div>

                    <button
                      onClick={() => onToggleWishlist(skin.id)}
                      className="text-zinc-500 hover:text-red-400 p-1 hover:bg-zinc-900 rounded transition"
                      title="Xóa khỏi Wishlist"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Skin Image & Name */}
                  <div 
                    className="flex items-center gap-4 my-3 cursor-pointer group"
                    onClick={() => onSelectSkinDetail(skin)}
                  >
                    <div className="w-24 h-16 bg-zinc-900/80 rounded-lg p-1.5 flex items-center justify-center flex-shrink-0 border border-zinc-800 group-hover:border-rose-500/40 transition">
                      <img
                        src={skin.image}
                        alt={skin.name}
                        className="max-h-full max-w-full object-contain filter drop-shadow group-hover:scale-110 transition duration-200"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-rose-400 transition">
                        {skin.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                        <span className="font-mono text-amber-400 font-bold">{skin.priceVP} VP</span>
                        <span>•</span>
                        <span className="text-emerald-400">~{Math.round((skin.priceVP / 1000) * 200000).toLocaleString()}đ</span>
                      </div>
                      <div className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {skin.storeFrequency.nightMarketEligible ? "🌙 Có trong Chợ Đen" : "⛔ Không vào Chợ Đen"}
                      </div>
                    </div>
                  </div>

                  {/* Priority and Note Controls */}
                  <div className="space-y-2 pt-3 border-t border-zinc-800/80">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold text-zinc-400 uppercase">Trạng Thái:</span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleUpdatePriority(skin.id, "must_have")}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold transition",
                            meta.priority === "must_have"
                              ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Must Buy
                        </button>
                        <button
                          onClick={() => handleUpdatePriority(skin.id, "night_market_only")}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold transition",
                            meta.priority === "night_market_only"
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Chờ Chợ Đen
                        </button>
                        <button
                          onClick={() => handleUpdatePriority(skin.id, "owned")}
                          className={cn(
                            "px-2 py-1 rounded text-[10px] font-bold transition",
                            meta.priority === "owned"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : "bg-zinc-900 text-zinc-400 hover:text-zinc-200"
                          )}
                        >
                          Đã Có
                        </button>
                      </div>
                    </div>

                    {/* Note Input */}
                    <input
                      type="text"
                      placeholder="Ghi chú (VD: màu trắng, chờ sinh nhật)..."
                      value={meta.note || ""}
                      onChange={(e) => handleUpdateNote(skin.id, e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-800 rounded-lg text-[11px] text-zinc-300 placeholder-zinc-400 focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
