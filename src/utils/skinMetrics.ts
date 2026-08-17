import { WeaponSkin } from "../data/skins";

export type WeaponCategoryType = "rifle" | "melee" | "sidearm" | "heavy" | "shotgun" | "sniper" | "smg";

export interface WeaponCategoryConfig {
  type: WeaponCategoryType;
  title: string;
  subtitle: string;
  badgeColor: string;
  iconName: string;
  // 3 community score bar labels
  score1Label: string;
  score1Icon: string;
  score2Label: string;
  score2Icon: string;
  score3Label: string;
  score3Icon: string;
  // Specific evaluation review blocks
  evaluations: {
    key: string;
    title: string;
    icon: string;
    color: string;
    getValue: (skin: WeaponSkin) => string;
  }[];
}

export function getWeaponCategoryType(weaponName: string, skinName: string): WeaponCategoryType {
  const w = (weaponName || "").toLowerCase();
  const n = (skinName || "").toLowerCase();

  // Melee check
  if (
    w.includes("melee") ||
    n.includes("knife") ||
    n.includes("dagger") ||
    n.includes("katana") ||
    n.includes("karambit") ||
    n.includes("blade") ||
    n.includes("sword") ||
    n.includes("axe") ||
    n.includes("scythe") ||
    n.includes("fan") ||
    n.includes("hammer") ||
    n.includes("bat") ||
    n.includes("spear") ||
    n.includes("relic") ||
    n.includes("daggers")
  ) {
    return "melee";
  }

  // Heavy Guns
  if (w.includes("odin") || w.includes("ares") || n.includes("odin") || n.includes("ares")) {
    return "heavy";
  }

  // Shotguns
  if (w.includes("bucky") || w.includes("judge") || n.includes("bucky") || n.includes("judge")) {
    return "shotgun";
  }

  // Sniper Rifles
  if (
    w.includes("operator") ||
    w.includes("marshal") ||
    w.includes("outlaw") ||
    n.includes("operator") ||
    n.includes("marshal") ||
    n.includes("outlaw")
  ) {
    return "sniper";
  }

  // SMGs
  if (w.includes("spectre") || w.includes("stinger") || n.includes("spectre") || n.includes("stinger")) {
    return "smg";
  }

  // Sidearms
  if (
    w.includes("classic") ||
    w.includes("shorty") ||
    w.includes("frenzy") ||
    w.includes("ghost") ||
    w.includes("sheriff") ||
    n.includes("classic") ||
    n.includes("shorty") ||
    n.includes("frenzy") ||
    n.includes("ghost") ||
    n.includes("sheriff")
  ) {
    return "sidearm";
  }

  // Default: Rifles (Vandal, Phantom, Bulldog, Guardian)
  return "rifle";
}

export function getWeaponCategoryConfig(weaponName: string, skinName: string): WeaponCategoryConfig {
  const cat = getWeaponCategoryType(weaponName, skinName);

  switch (cat) {
    case "melee":
      return {
        type: "melee",
        title: "Vũ Khí Cận Chiến (Melee / Dao)",
        subtitle: "Đánh giá Inspect, hiệu ứng rút dao, âm thanh chém nặng & hoạt ảnh múa dao",
        badgeColor: "from-amber-500 to-rose-600",
        iconName: "Sword",
        score1Label: "Âm thanh Chém & Chém Nặng (Sound Design):",
        score1Icon: "Volume2",
        score2Label: "Hoạt ảnh Múa Dao & Inspect (Spam Y):",
        score2Icon: "Sparkles",
        score3Label: "Hiệu ứng Rút Dao (Equip Motion & VFX):",
        score3Icon: "Zap",
        evaluations: [
          {
            key: "equip",
            title: "Hiệu Ứng Rút Dao (Equip Animation)",
            icon: "Zap",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Hiệu ứng rút dao mượt mà, xé gió dứt khoát ngay khi đổi vũ khí để tăng tốc di chuyển."
          },
          {
            key: "inspect",
            title: "Hoạt Ảnh Múa Dao & Inspect (Spam Y)",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Hoạt ảnh xoay ngón tay / múa lưỡi dao liên tục khi spam phím Y cực kỳ liền mạch và mượt mà."
          },
          {
            key: "sound",
            title: "Âm Thanh Chém & Chém Nặng (Sound FX)",
            icon: "Volume2",
            color: "text-blue-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng vung chém gió đanh gọn khi Left-Click và âm vang uy lực khi tấn công chém nặng Right-Click."
          },
          {
            key: "vfx",
            title: "Đường Đao Tấn Công & VFX Nguyên Tố",
            icon: "Flame",
            color: "text-rose-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Vệt sáng ánh kim và hiệu ứng hào quang kéo dài theo quỹ đạo vung dao tạo cảm giác tốc độ tuyệt đối."
          }
        ]
      };

    case "sidearm":
      return {
        type: "sidearm",
        title: "Súng Lục (Sidearm / Pistol)",
        subtitle: "Đánh giá chuẩn xác nhấp nhả (Tap), hồi tâm (Reset), xoay súng & Finisher (Không tính Spray)",
        badgeColor: "from-blue-500 to-cyan-600",
        iconName: "Crosshair",
        score1Label: "Độ Chuẩn Xác Nhấp Nhả (One-Tap Feel):",
        score1Icon: "Crosshair",
        score2Label: "Tốc Độ Hồi Tâm (Recoil Reset) & Inspect:",
        score2Icon: "RotateCcw",
        score3Label: "Finisher & Hiệu Ứng Kết Liễu Vòng Đấu:",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "tap",
            title: "Cảm Giác Nhấp Nhả & One-Tap (First Shot)",
            icon: "Crosshair",
            color: "text-cyan-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng nổ đanh giòn, độ chính xác tuyệt đối ở phát tap đầu tiên hỗ trợ kê góc gõ đầu uy lực."
          },
          {
            key: "reset",
            title: "Tốc Độ Hồi Phục Tâm & Độ Ổn Định",
            icon: "RotateCcw",
            color: "text-emerald-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Tâm súng hồi nhanh giữa các nhịp tap liên tiếp, visual recoil êm ái không che lấp tầm nhìn đối phương."
          },
          {
            key: "inspect",
            title: "Hoạt Ảnh Xoay Súng & Nạp Đạn (Trick Reload)",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác xoay vòng súng điệu nghệ quanh ngón tay và âm thanh tra băng đạn tinh tế."
          },
          {
            key: "finisher",
            title: "Finisher & Hiệu Ứng Kết Liễu Đối Thủ",
            icon: "Flame",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng kết liễu ấn tượng khi bắn hạ đối thủ cuối cùng khép lại round đấu."
          }
        ]
      };

    case "heavy":
      return {
        type: "heavy",
        title: "Súng Máy Hạng Nặng (Heavy Gun)",
        subtitle: "Đánh giá độ đầm khi sấy liên thanh (Heavy Spray), âm thanh gầm rú & xuyên tường (Wallbang)",
        badgeColor: "from-red-600 to-amber-700",
        iconName: "ShieldCheck",
        score1Label: "Âm Thanh Hỏa Lực & Gầm Rú Áp Đảo:",
        score1Icon: "Volume2",
        score2Label: "Độ Đầm Khi Sấy Liên Thanh (Heavy Spray):",
        score2Icon: "Layers",
        score3Label: "Finisher & Hoạt Ảnh Lắp Băng Đạn Nặng:",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "spray",
            title: "Độ Đầm Khi Sấy Liên Thanh (100-Round Spray)",
            icon: "Layers",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Độ rung màn hình êm ái, đạn đi chụm vững chắc giúp ghìm cụm đạn xuyên tường và giữ góc chặn rush hoàn hảo."
          },
          {
            key: "sound",
            title: "Âm Thanh Hỏa Lực & Tiếng Gầm Dồn Dập",
            icon: "Volume2",
            color: "text-red-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng gầm rú dồn dập uy lực áp đảo hoàn toàn âm thanh chiến trường, tạo áp lực tâm lý cực lớn lên kẻ địch."
          },
          {
            key: "reload",
            title: "Hoạt Ảnh Lắp Băng Đạn Nặng & Cơ Khí",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác mở nắp khay tiếp đạn và lắp chuỗi đạn cơ khí hoành tráng, đầm tay."
          },
          {
            key: "finisher",
            title: "Finisher & Hiệu Ứng Bùng Nổ Xứng Tầm",
            icon: "Flame",
            color: "text-orange-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng bùng nổ hoành tráng phong ấn toàn bộ khu vực round đấu."
          }
        ]
      };

    case "shotgun":
      return {
        type: "shotgun",
        title: "Súng Shotgun Cận Chiến",
        subtitle: "Đánh giá độ lực phát bắn (Impact Force), âm thanh bơm đạn & độ bung chùm đạn cận cảnh",
        badgeColor: "from-emerald-600 to-teal-700",
        iconName: "Zap",
        score1Label: "Độ Lực & Uy Lực Phát Bắn (Impact Force):",
        score1Icon: "Zap",
        score2Label: "Âm Thanh Lên Đạn (Pump / Drum Action):",
        score2Icon: "Volume2",
        score3Label: "Finisher & Hoạt Ảnh Cận Chiến Uy Lực:",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "impact",
            title: "Độ Lực & Uy Lực Phát Bắn (Raw Knockback)",
            icon: "Zap",
            color: "text-emerald-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Phát bắn cận chiến bùng nổ cực mạnh, chùm đạn bung đanh thép xé tan mục tiêu ngay trước mặt."
          },
          {
            key: "pump",
            title: "Âm Thanh Bơm Đạn (Pump Action Audio)",
            icon: "Volume2",
            color: "text-teal-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Tiếng kéo bơm đạn đanh giòn, tiếng vỏ đạn văng ra leng keng tạo cảm giác bắn cực kỳ đã tay."
          },
          {
            key: "reload",
            title: "Hoạt Ảnh Nạp Từng Viên & Inspect",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác nhét từng viên đạn shotgun vào buồng nạp dứt khoát kết hợp âm thanh cơ khí chuẩn xác."
          },
          {
            key: "finisher",
            title: "Finisher & Cảm Giác Cận Chiến",
            icon: "Flame",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng kết liễu tráng lệ ngay khoảnh khắc One-shot kẻ địch cự ly gần."
          }
        ]
      };

    case "sniper":
      return {
        type: "sniper",
        title: "Súng Ngắm (Sniper Rifle)",
        subtitle: "Đánh giá tiếng súng sấm sét, cảm giác bật ngắm Quick-Scope & kéo thoi lên đạn (Bolt-Action)",
        badgeColor: "from-indigo-600 to-purple-800",
        iconName: "Crosshair",
        score1Label: "Âm Thanh Sấm Sét Phát Bắn (Sniper Audio):",
        score1Icon: "Volume2",
        score2Label: "Cảm Giác Bật Ngắm Quick-Scope & Reticle:",
        score2Icon: "Crosshair",
        score3Label: "Finisher & Hoạt Ảnh Kéo Thoi (Bolt-Action):",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "shot",
            title: "Âm Thanh Sấm Sét Phát Bắn (Thunderous Sound)",
            icon: "Volume2",
            color: "text-indigo-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng nổ vang rền rung chuyển toàn bản đồ, âm vang xuyên thấu tạo cảm giác phát đạn uy lực tuyệt đối."
          },
          {
            key: "scope",
            title: "Cảm Giác Bật Ngắm Quick-Scope & Hồng Tâm",
            icon: "Crosshair",
            color: "text-cyan-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Tốc độ mở ống ngắm mượt mà, đường viền hồng tâm sắc nét hỗ trợ flick bắn phản xạ cực kỳ nhạy."
          },
          {
            key: "bolt",
            title: "Hoạt Ảnh Kéo Thoi Lên Đạn (Bolt-Action)",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác kéo khóa nòng gạt vỏ đạn và đẩy viên đạn mới vào buồng bắn dứt khoát, đầm tay."
          },
          {
            key: "finisher",
            title: "Finisher & Kết Liễu Tầm Xa",
            icon: "Flame",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng kết liễu từ khoảng cách hàng chục mét tỏa sáng rực rỡ khắp tầm ngắm."
          }
        ]
      };

    case "smg":
      return {
        type: "smg",
        title: "Súng Tiểu Liên (SMG)",
        subtitle: "Đánh giá sấy di động (Run & Gun), tốc độ xả đạn cao, âm thanh giảm thanh & độ cơ động",
        badgeColor: "from-teal-500 to-emerald-600",
        iconName: "Zap",
        score1Label: "Âm Thanh Tốc Độ Bắn Cao & Giảm Thanh:",
        score1Icon: "Volume2",
        score2Label: "Cảm Giác Sấy Di Động (Run & Gun Spray):",
        score2Icon: "Layers",
        score3Label: "Finisher & Hoạt Ảnh Thay Đạn Tốc Chiến:",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "spray",
            title: "Cảm Giác Sấy Di Động (Run & Gun Spray)",
            icon: "Layers",
            color: "text-teal-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Cảm giác vừa di chuyển vừa sấy cực kỳ linh hoạt, chùm đạn đi chụm trong các pha rush góc hẹp."
          },
          {
            key: "sound",
            title: "Âm Thanh Tốc Độ Xả Đạn Cao (High Fire Rate)",
            icon: "Volume2",
            color: "text-emerald-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng nhả đạn dồn dập êm tai, âm thanh giảm thanh sắc gọn không làm rối loạn thông tin thính giác."
          },
          {
            key: "reload",
            title: "Hoạt Ảnh Nạp Đạn Tốc Chiến & Inspect",
            icon: "Sparkles",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác giật băng đạn cũ và đút băng đạn mới siêu tốc độ, giữ nhịp độ di chuyển liền mạch."
          },
          {
            key: "finisher",
            title: "Finisher & Hiệu Ứng Kết Liễu Đột Kích",
            icon: "Flame",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng kết liễu nổi bật sau chuỗi hạ gục tốc chiến trong round đấu."
          }
        ]
      };

    case "rifle":
    default:
      return {
        type: "rifle",
        title: "Súng Trường Tấn Công (Rifle)",
        subtitle: "Đánh giá cảm giác One-Tap, ghìm tâm Spray Control, Finisher kết liễu & Inspect",
        badgeColor: "from-purple-600 to-indigo-600",
        iconName: "Crosshair",
        score1Label: "Âm thanh One-Tap & Headshot:",
        score1Icon: "Volume2",
        score2Label: "Cảm Giác Ghìm Tâm (Spray Control):",
        score2Icon: "Crosshair",
        score3Label: "Finisher & Hiệu Ứng Kết Liễu:",
        score3Icon: "Flame",
        evaluations: [
          {
            key: "tap",
            title: "Cảm Giác One-Tap & Độ Đanh Viên Đầu",
            icon: "Crosshair",
            color: "text-purple-300",
            getValue: (skin) =>
              skin.reviewDetails?.soundDesign ||
              "Tiếng bắn đanh giòn, dứt khoát tạo cảm giác One-tap headshot dính đầu chuẩn xác."
          },
          {
            key: "spray",
            title: "Cảm Giác Ghìm Tâm Spray & Reset Recoil",
            icon: "Layers",
            color: "text-emerald-300",
            getValue: (skin) =>
              skin.reviewDetails?.recoilFeel ||
              "Độ nảy súng êm ái, đạn đi chụm và tâm súng hồi phục nhanh chóng hỗ trợ spray transfer mượt mà."
          },
          {
            key: "inspect",
            title: "Hoạt Ảnh Nạp Đạn & Inspect (Thay Đạn)",
            icon: "Sparkles",
            color: "text-blue-300",
            getValue: (skin) =>
              skin.reviewDetails?.reloadInspect ||
              "Động tác tra băng đạn độc đáo, hiệu ứng ánh sáng và animation biến hình tinh xảo."
          },
          {
            key: "finisher",
            title: "Finisher & Âm Thanh Chuỗi Đa Hạ Gục",
            icon: "Flame",
            color: "text-amber-300",
            getValue: (skin) =>
              skin.reviewDetails?.finisher ||
              "Hiệu ứng kết liễu biến đổi đấu trường tráng lệ kết hợp chuỗi nốt nhạc ăn mừng chiến thắng."
          }
        ]
      };
  }
}
