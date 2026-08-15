import React, { useState } from "react";
import { Send, Users, ShieldAlert } from "lucide-react";

export function LiveMatch() {
  const [chatMsg, setChatMsg] = useState("");
  const [messages, setMessages] = useState([
    { id: 1, user: "Faker2k", text: "Trận này căng thế!!", isMod: false },
    { id: 2, user: "System", text: "Chào mừng đến với luồng trực tiếp.", isMod: true },
    { id: 3, user: "ValorantBoy", text: "Team DAMIT2K cố lên", isMod: false },
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMsg.trim()) return;
    setMessages([...messages, { id: Date.now(), user: "GuestUser", text: chatMsg, isMod: false }]);
    setChatMsg("");
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Main Content (Stream + Details) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Stream Container */}
        <div className="w-full aspect-video bg-[#111] border-b border-[#222] relative group">
          {/* Mock YouTube Embed */}
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&mute=1"
            title="Livestream"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            TRỰC TIẾP
          </div>
          <div className="absolute top-4 left-24 bg-black/50 backdrop-blur text-white text-xs font-bold px-2 py-1 rounded flex items-center gap-1">
            <Users className="w-3 h-3" />
            1,245
          </div>
        </div>

        {/* Match Info */}
        <div className="p-6">
          <h1 className="text-2xl font-bold text-white mb-2">Chung Kết Nhánh Thắng: DAMIT2K vs LAYLA2K4</h1>
          <p className="text-gray-400 text-sm mb-6">Giải đấu: ESP Valorant Champions 2026 • Thể thức: BO3</p>
          
          <div className="flex items-center gap-8 bg-[#111] border border-[#222] rounded-xl p-6">
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl font-bold text-[#00E5FF]">DAMIT2K</span>
              <span className="text-gray-500 text-sm mt-1">Lựa chọn: Lotus, Haven</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-4xl font-bold text-white">1 - 0</span>
              <span className="text-yellow-500 text-xs mt-2">ĐANG THI ĐẤU (MAP 2)</span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <span className="text-2xl font-bold text-[#FF4655]">LAYLA2K4</span>
              <span className="text-gray-500 text-sm mt-1">Lựa chọn: Ascent</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Chat Sidebar */}
      <div className="w-80 bg-[#0A0A0A] border-l border-[#222] flex flex-col">
        <div className="p-4 border-b border-[#222]">
          <h2 className="font-bold text-white">Live Chat</h2>
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
          {messages.map((msg) => (
            <div key={msg.id} className="text-sm">
              <span className="font-bold mr-2 inline-flex items-center gap-1">
                {msg.isMod && <ShieldAlert className="w-3 h-3 text-yellow-500" />}
                <span className={msg.isMod ? "text-yellow-500" : "text-gray-300"}>
                  {msg.user}:
                </span>
              </span>
              <span className="text-gray-100">{msg.text}</span>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#222] bg-[#111]">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={chatMsg}
              onChange={(e) => setChatMsg(e.target.value)}
              placeholder="Gửi tin nhắn..."
              className="flex-1 bg-[#222] border border-[#333] rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-yellow-500"
            />
            <button
              type="submit"
              className="bg-yellow-500 hover:bg-yellow-400 text-black px-3 py-2 rounded transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
