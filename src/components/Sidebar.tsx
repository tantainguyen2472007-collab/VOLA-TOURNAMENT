import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, Shield, Trophy, LayoutTemplate, Swords, Crown, LogOut } from "lucide-react";
import { cn } from "../lib/utils";

const navItems = [
  { icon: LayoutDashboard, label: "DASHBOARD", href: "/" },
  { icon: Users, label: "NGƯỜI DÙNG", href: "/users" },
  { icon: Shield, label: "VAI TRÒ", href: "/roles" },
  { icon: Trophy, label: "GIẢI ĐẤU", href: "/tournaments" },
  { icon: LayoutTemplate, label: "BRACKET", href: "/bracket" },
  { icon: Swords, label: "BAN/PICK", href: "/draft" },
  { icon: Crown, label: "PREMIER LEAGUE", href: "/premier" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-[#111111] border-r border-[#222] min-h-screen flex flex-col justify-between py-6">
      <div>
        <div className="px-6 mb-8 flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-500 rounded flex items-center justify-center font-bold text-black italic">
            ESP
          </div>
          <span className="font-bold text-lg text-white">TOURNAMENT</span>
        </div>
        
        <nav className="flex flex-col gap-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-[#222] text-yellow-500" 
                    : "text-gray-400 hover:text-gray-200 hover:bg-[#1A1A1A]"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="px-6">
        <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors text-sm font-medium">
          <LogOut className="w-4 h-4" />
          VỀ TRANG CHÍNH
        </button>
      </div>
    </aside>
  );
}
