import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Palette, 
  Crosshair, 
  Target, 
  Calculator, 
  Award, 
  Sparkles, 
  Trophy, 
  LayoutTemplate, 
  Swords, 
  LogOut 
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAuth } from "../hooks/useAuth";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/" },
  { icon: Palette, label: "SKIN", href: "/skins" },
  { icon: Crosshair, label: "PRO SETTINGS", href: "/pro-settings" },
  { icon: Target, label: "GÓC KÊ & SETUPS", href: "/setups" },
  { icon: Calculator, label: "KINH TẾ & BUY", href: "/economy" },
  { icon: Award, label: "META TIER LIST", href: "/tierlist" },
  { icon: Sparkles, label: "LINEUP ĐỘI HÌNH", href: "/lineup" },
  { icon: Trophy, label: "GIẢI ĐẤU", href: "/tournaments" },
  { icon: LayoutTemplate, label: "BRACKET", href: "/bracket" },
  { icon: Swords, label: "PHÒNG DRAFT", href: "/lobby" },
];

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 min-h-screen flex flex-col justify-between py-8">
      <div>
        <div className="px-8 mb-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-display text-2xl text-black">
            ESP
          </div>
          <span className="font-display text-2xl text-white tracking-widest mt-1">TOURNAMENT</span>
        </div>
        
        <nav className="flex flex-col gap-2 px-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-4 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300",
                  isActive 
                    ? "bg-white/10 text-white" 
                    : "text-white/40 hover:text-white/80 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-primary" : "")} />
                <span className="tracking-wider text-xs">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-8 space-y-4">
        {profile && (
          <div className="text-sm">
            <p className="text-white font-medium truncate">{profile.display_name}</p>
            <p className="text-white/40 text-xs mt-1">Online</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
        >
          <LogOut className="w-4 h-4" />
          ĐĂNG XUẤT
        </button>
      </div>
    </aside>
  );
}
