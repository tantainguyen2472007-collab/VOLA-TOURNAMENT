const fs = require('fs');

const path = 'src/pages/ProSettings.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Thêm import ArrowLeftRight vào ProSettings.tsx để hỗ trợ icon so sánh
if (!content.includes('ArrowLeftRight')) {
  content = content.replace(/import \{([^}]+)\} from "lucide-react";/, (match, group1) => {
    return `import {${group1}, ArrowLeftRight, X} from "lucide-react";`;
  });
}

// 2. Thêm state lưu thiết bị được chọn để so sánh
const stateInsertion = `
  // --- GEAR COMPARISON STATE ---
  const [compareGearItems, setCompareGearItems] = useState<GamingGearItem[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  const toggleCompareGear = (gear: GamingGearItem) => {
    setCompareGearItems(prev => {
      // Nếu đã có trong danh sách thì bỏ
      if (prev.find(item => item.id === gear.id)) {
        return prev.filter(item => item.id !== gear.id);
      }
      // Nếu là khác danh mục thì reset list và add mới
      if (prev.length > 0 && prev[0].category !== gear.category) {
        return [gear];
      }
      // Nếu trùng danh mục và chưa có mặt thì add thêm (tối đa 3 thiết bị)
      if (prev.length >= 3) {
        sound.playError ? sound.playError() : null; // Giả sử có sound.playError, nếu ko play click
        return [...prev.slice(1), gear]; // Đẩy cái cũ nhất ra
      }
      return [...prev, gear];
    });
    sound.playClick();
  };
`;

if (!content.includes('compareGearItems')) {
  content = content.replace('// --- SENS CONVERTER STATE ---', stateInsertion + '\n  // --- SENS CONVERTER STATE ---');
}

// 3. Thay thế đoạn render danh sách Gear trong tab 'advisor' (Section 3) bằng danh sách có nút So Sánh
const oldGearList = /<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*\)$/;

const newGearList = `
          {/* Section 3: Recommended Gear Database */}
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4 mb-6">
              <h3 className="text-base font-display uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-400" />
                3. Đề Xuất Gaming Gear Chuẩn Thi Đấu
              </h3>

              {/* Compare Button Floating Badge */}
              {compareGearItems.length > 0 && (
                <button
                  onClick={() => { sound.playClick(); setIsCompareModalOpen(true); }}
                  className="bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all animate-pulse"
                >
                  <ArrowLeftRight className="w-4 h-4" />
                  So Sánh Thiết Bị ({compareGearItems.length})
                </button>
              )}
            </div>

            <div className="flex flex-col md:flex-row gap-4 mb-6">
              {/* Category Filter */}
              <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs w-full md:w-auto">
                <span className="text-[10px] text-gray-500 uppercase px-2 font-bold flex items-center gap-1 my-auto">
                  Danh Mục:
                </span>
                {[
                  { id: "all", label: "Tất Cả" },
                  { id: "mouse", label: "Chuột" },
                  { id: "mousepad", label: "Lót Chuột" },
                  { id: "keyboard", label: "Bàn Phím" },
                  { id: "audio", label: "Tai Nghe" },
                  { id: "monitor", label: "Màn Hình" }
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => { sound.playClick(); setGearCategoryFilter(cat.id); setCompareGearItems([]); }}
                    className={\`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors \${
                      gearCategoryFilter === cat.id ? "bg-white/20 text-white font-bold" : "text-gray-400 hover:text-white"
                    }\`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Tier Filter */}
              <div className="flex bg-black/60 p-1 rounded-xl border border-white/10 overflow-x-auto text-xs w-full md:w-auto">
                <span className="text-[10px] text-gray-500 uppercase px-2 font-bold flex items-center gap-1 my-auto">
                  Phân Khúc:
                </span>
                {[
                  { id: "all", label: "Tất Cả Mức Giá" },
                  { id: "mid", label: "Tầm Trung" },
                  { id: "flagship", label: "Cao Cấp" }
                ].map((tier) => (
                  <button
                    key={tier.id}
                    onClick={() => { sound.playClick(); setGearTierFilter(tier.id as any); }}
                    className={\`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors \${
                      gearTierFilter === tier.id ? "bg-amber-600/80 text-white font-bold" : "text-gray-400 hover:text-white"
                    }\`}
                  >
                    {tier.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGear.map((item) => {
                const isSelectedForCompare = compareGearItems.some(g => g.id === item.id);
                return (
                  <div key={item.id} className="bg-black/40 border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all flex flex-col group shadow-lg hover:shadow-2xl">
                    <div className="h-40 bg-white/5 relative overflow-hidden flex items-center justify-center p-4">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-2xl group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                        <span className={\`text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border \${
                          item.tier === "flagship" ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        }\`}>
                          {item.tierLabel}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border bg-black/60 text-white border-white/20 w-max shadow-sm backdrop-blur-md">
                          {item.category}
                        </span>
                      </div>
                      
                      {/* Compare Checkbox / Button */}
                      <button 
                        onClick={() => toggleCompareGear(item)}
                        className={\`absolute top-3 right-3 p-1.5 rounded-lg border transition-all \${
                          isSelectedForCompare 
                            ? "bg-rose-600 text-white border-rose-500 shadow-md" 
                            : "bg-black/60 text-gray-400 border-white/20 hover:bg-white/20 hover:text-white backdrop-blur-md"
                        }\`}
                        title={isSelectedForCompare ? "Bỏ khỏi danh sách so sánh" : "Thêm vào so sánh"}
                      >
                        {isSelectedForCompare ? <Check className="w-4 h-4" /> : <ArrowLeftRight className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="p-5 flex-1 flex flex-col">
                      <h4 className="text-sm font-bold text-white leading-tight font-display tracking-wide">{item.name}</h4>
                      <p className="text-xs text-rose-400 font-medium mb-3 mt-1">{item.brand}</p>
                      
                      <div className="space-y-1 mb-4">
                        {item.specs.slice(0, 3).map((spec, idx) => (
                          <div key={idx} className="flex items-center gap-1.5 text-xs text-gray-400">
                            <CheckCircle2 className="w-3 h-3 text-cyan-400 shrink-0" />
                            <span className="truncate">{spec}</span>
                          </div>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/10 flex flex-col gap-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] text-gray-500 uppercase font-semibold">Giá Tham Khảo</span>
                          <span className="font-mono font-bold text-white text-sm bg-white/10 px-2 py-0.5 rounded">{item.priceFormatted}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: SENSITIVITY CONVERTER */}
      {/* ========================================================================= */}
      {activeTab === "sens_converter" && (
        <div className="max-w-2xl mx-auto mt-12 bg-[#111] border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl border border-cyan-500/30">
              <RefreshCw className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl md:text-2xl font-display tracking-wider text-white font-bold">
                CHUYỂN ĐỔI ĐỘ NHẠY (SENS CONVERTER)
              </h2>
              <p className="text-xs text-gray-400 mt-1">Đồng bộ cảm giác di chuột từ các tựa game FPS khác sang VALORANT.</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
              <label className="text-xs text-gray-300 font-semibold block">Tựa Game Bạn Đang Chơi</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: "cs2", label: "CS2 / CS:GO" },
                  { id: "apex", label: "Apex Legends" },
                  { id: "overwatch", label: "Overwatch 2" },
                  { id: "r6", label: "Rainbow Six" }
                ].map((game) => (
                  <button
                    key={game.id}
                    onClick={() => { sound.playClick(); setInputGame(game.id); }}
                    className={\`text-xs py-2.5 rounded-xl font-bold transition-all \${
                      inputGame === game.id 
                        ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30" 
                        : "bg-black/40 text-gray-400 hover:text-white border border-white/10"
                    }\`}
                  >
                    {game.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <label className="text-xs text-gray-300 font-semibold block">Sens Trong Game Mũi</label>
                <input
                  type="number"
                  value={inputSens}
                  onChange={(e) => setInputSens(parseFloat(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/5">
                <label className="text-xs text-gray-300 font-semibold block">DPI Chuột Hiện Tại</label>
                <input
                  type="number"
                  value={inputDpi}
                  onChange={(e) => setInputDpi(parseInt(e.target.value) || 0)}
                  className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </div>

            <div className="bg-cyan-950/40 border border-cyan-500/30 rounded-2xl p-6 text-center space-y-4">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest block">Độ nhạy VALORANT Tương Đương</span>
              <div className="text-5xl font-black font-mono text-white">{getConvertedValSens()}</div>
              
              <div className="flex items-center justify-center gap-6 text-xs text-gray-400 font-mono">
                <span>DPI: <strong className="text-white">{inputDpi}</strong></span>
                <span>eDPI: <strong className="text-white">{convertedEdpi}</strong></span>
              </div>

              <button
                onClick={applyConvertedToAdvisor}
                className="mt-4 px-6 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-lg shadow-cyan-600/20"
              >
                Áp dụng & Phân tích Aim
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* GEAR COMPARISON MODAL */}
      {/* ========================================================================= */}
      {isCompareModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-display uppercase tracking-wider text-white font-bold flex items-center gap-2">
                <ArrowLeftRight className="w-5 h-5 text-rose-400" />
                So Sánh {compareGearItems[0]?.category === "mouse" ? "Chuột Gaming" : compareGearItems[0]?.category === "mousepad" ? "Lót Chuột" : compareGearItems[0]?.category === "keyboard" ? "Bàn Phím" : compareGearItems[0]?.category === "monitor" ? "Màn Hình" : "Thiết Bị"}
              </h2>
              <button 
                onClick={() => { sound.playClick(); setIsCompareModalOpen(false); }}
                className="p-2 bg-white/5 hover:bg-rose-500/20 hover:text-rose-400 rounded-xl transition-colors text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareGearItems.map(item => (
                  <div key={item.id} className="flex flex-col bg-black/40 border border-white/10 rounded-2xl overflow-hidden relative">
                    {/* Header Image */}
                    <div className="h-48 bg-white/5 p-6 flex items-center justify-center relative">
                      <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain filter drop-shadow-xl" />
                      <button 
                        onClick={() => toggleCompareGear(item)}
                        className="absolute top-2 right-2 p-1.5 bg-black/60 text-gray-400 hover:text-white hover:bg-rose-500/50 rounded-lg transition-colors backdrop-blur-md border border-white/10"
                        title="Xóa khỏi so sánh"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Basic Info */}
                    <div className="p-5 border-b border-white/5 text-center">
                      <h3 className="font-display font-bold text-white text-base leading-snug">{item.name}</h3>
                      <p className="text-xs text-gray-400 mt-1">{item.brand}</p>
                      <div className="mt-3 inline-block bg-white/10 px-3 py-1 rounded-lg">
                        <span className="font-mono font-bold text-rose-400 text-sm">{item.priceFormatted}</span>
                      </div>
                    </div>

                    {/* Specs & Pros/Cons */}
                    <div className="p-5 space-y-5 flex-1 flex flex-col">
                      {/* Highlight Reason */}
                      <div className="text-xs text-gray-300 italic text-center leading-relaxed">
                        "{item.highlightReason}"
                      </div>

                      {/* Technical Specs */}
                      <div>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold block mb-2 text-center border-b border-white/5 pb-1">Thông Số Kỹ Thuật</span>
                        <ul className="space-y-1.5">
                          {item.specs.map((spec, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5">
                              <span className="text-cyan-400 shrink-0 mt-0.5">•</span>
                              <span>{spec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Pros */}
                      <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl mt-auto">
                        <span className="text-[10px] text-emerald-400 uppercase tracking-widest font-bold block mb-2 flex items-center gap-1">
                          <Check className="w-3 h-3" /> Ưu Điểm (Pros)
                        </span>
                        <ul className="space-y-1">
                          {item.pros?.map((pro, i) => (
                            <li key={i} className="text-xs text-gray-300 flex items-start gap-1.5 leading-snug">
                              <span className="text-emerald-500 shrink-0">+</span>
                              <span>{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Cons */}
                      <div className="bg-rose-500/10 border border-rose-500/20 p-3 rounded-xl">
                        <span className="text-[10px] text-rose-400 uppercase tracking-widest font-bold block mb-2 flex items-center gap-1">
                          <X className="w-3 h-3" /> Nhược Điểm (Cons)
                        </span>
                        <ul className="space-y-1">
                          {item.cons?.map((con, i) => (
                            <li key={i} className="text-xs text-gray-400 flex items-start gap-1.5 leading-snug">
                              <span className="text-rose-500 shrink-0">-</span>
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add More Placeholder if < 3 */}
                {compareGearItems.length < 3 && (
                  <div 
                    onClick={() => setIsCompareModalOpen(false)}
                    className="flex flex-col items-center justify-center bg-black/20 border border-dashed border-white/20 rounded-2xl p-8 text-gray-500 hover:text-white hover:border-white/40 transition-colors cursor-pointer min-h-[400px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
                      <span className="text-2xl font-light">+</span>
                    </div>
                    <span className="text-sm font-bold uppercase tracking-wider text-center">Thêm Thiết Bị Khác</span>
                    <span className="text-xs mt-1 text-center px-4">Bạn có thể so sánh tối đa 3 thiết bị cùng loại để tìm ra lựa chọn tốt nhất.</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
`;

fs.writeFileSync(path, content.replace(oldGearList, newGearList));
console.log('Successfully updated ProSettings.tsx with Compare modal.');
