export function Bracket() {
  return (
    <div className="p-8 max-w-full mx-auto overflow-x-auto min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white">Sơ đồ Giải Đấu</h1>
          <p className="text-gray-400 mt-2">Thể thức: Single Elimination (Loại trực tiếp)</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-yellow-500 text-black font-bold text-sm rounded hover:bg-yellow-400">
            CẬP NHẬT KẾT QUẢ
          </button>
        </div>
      </div>

      <div className="flex gap-16 items-center mt-12 min-w-max">
        {/* Round 1 (Bán Kết) */}
        <div className="flex flex-col gap-12">
          <div className="text-gray-500 font-bold text-sm mb-4">BÁN KẾT</div>
          {/* Match 1 */}
          <div className="flex flex-col w-64 bg-[#111] border border-[#333] rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-3 border-b border-[#222] bg-[#1A1A1A]">
              <span className="font-bold text-[#00E5FF]">DAMIT2K</span>
              <span className="font-bold text-white">2</span>
            </div>
            <div className="flex justify-between items-center p-3 opacity-50">
              <span className="font-bold text-gray-300">TEAM FLASH</span>
              <span className="font-bold text-gray-500">0</span>
            </div>
          </div>
          
          {/* Match 2 */}
          <div className="flex flex-col w-64 bg-[#111] border border-[#333] rounded-lg overflow-hidden shadow-lg">
            <div className="flex justify-between items-center p-3 border-b border-[#222] bg-[#1A1A1A]">
              <span className="font-bold text-[#FF4655]">LAYLA2K4</span>
              <span className="font-bold text-white">2</span>
            </div>
            <div className="flex justify-between items-center p-3 opacity-50">
              <span className="font-bold text-gray-300">GAM ESPORTS</span>
              <span className="font-bold text-gray-500">1</span>
            </div>
          </div>
        </div>

        {/* Connectors (Visual only, simple lines) */}
        <div className="flex flex-col justify-center h-[280px]">
          <div className="w-8 border-t-2 border-r-2 border-b-2 border-[#333] h-[140px] rounded-r-lg mr-8"></div>
        </div>

        {/* Round 2 (Chung Kết) */}
        <div className="flex flex-col gap-12">
          <div className="text-yellow-500 font-bold text-sm mb-4">CHUNG KẾT</div>
          {/* Final Match */}
          <div className="flex flex-col w-64 bg-[#222] border-2 border-yellow-500 rounded-lg overflow-hidden shadow-[0_0_15px_rgba(234,179,8,0.2)]">
            <div className="flex justify-between items-center p-3 border-b border-[#333] bg-[#2A2A2A]">
              <span className="font-bold text-[#00E5FF]">DAMIT2K</span>
              <span className="font-bold text-white">-</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-[#2A2A2A]">
              <span className="font-bold text-[#FF4655]">LAYLA2K4</span>
              <span className="font-bold text-white">-</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
