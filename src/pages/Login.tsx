import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function Login() {
  const [mode, setMode] = useState<"login" | "register" | "guest">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, signUp, signInAnonymously } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(email, password);
      } else if (mode === "register") {
        await signUp(email, password, displayName || "Player");
      } else {
        await signInAnonymously(displayName || "Guest");
      }
      navigate("/");
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-yellow-500 rounded flex items-center justify-center font-bold text-black italic text-lg">
              ESP
            </div>
            <span className="font-bold text-2xl text-white">TOURNAMENT</span>
          </div>
          <p className="text-gray-400 text-sm">Nền tảng quản lý giải đấu eSports</p>
        </div>

        <div className="bg-[#111] border border-[#222] rounded-xl p-6">
          {/* Mode tabs */}
          <div className="flex gap-1 mb-6 bg-[#0A0A0A] rounded-lg p-1">
            {([
              ["login", "ĐĂNG NHẬP"],
              ["register", "ĐĂNG KÝ"],
              ["guest", "KHÁCH"],
            ] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setMode(key)}
                className={`flex-1 py-2 text-xs font-bold rounded-md transition-colors ${
                  mode === key
                    ? "bg-yellow-500 text-black"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode !== "login" && (
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Tên hiển thị
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="VD: ProGamer123"
                  className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                />
              </div>
            )}

            {mode !== "guest" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Mật khẩu</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#1A1A1A] border border-[#333] rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-yellow-500 transition-colors"
                    required
                    minLength={6}
                  />
                </div>
              </>
            )}

            {error && (
              <p className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-lg transition-colors disabled:opacity-50 shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              {loading
                ? "ĐANG XỬ LÝ..."
                : mode === "login"
                ? "ĐĂNG NHẬP"
                : mode === "register"
                ? "TẠO TÀI KHOẢN"
                : "VÀO VỚI TƯ CÁCH KHÁCH"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
