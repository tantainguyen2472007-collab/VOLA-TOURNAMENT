import { LINEUP_SOURCE_STATE } from "./dataProvenance";

export { LINEUP_SOURCE_STATE };

export interface LineupStep {
  stepNumber: number;
  title: string;
  instruction: string;
  hudCue: string;
  visualType: "stand" | "aim" | "throw" | "land";
  callout: string;
  inGameImage?: string;
  hudTargetX?: number; // 0 - 100%
  hudTargetY?: number; // 0 - 100%
  targetPointLabel?: string;
  hudElementHighlight?: string;
  pixelZoomDetails?: {
    zoomTitle?: string;
    zoomDescription?: string;
    zoomLandmark?: string;
  };
}

export interface AbilityLineup {
  id: string;
  title: string;
  map: string;
  mapSplash: string;
  agent: string;
  agentRole: "Duelist" | "Initiator" | "Controller" | "Sentinel";
  agentIcon: string;
  site: "A" | "B" | "C" | "Mid" | "Spawn";
  side: "Attacker" | "Defender" | "Post-Plant" | "Retake";
  abilityName: string;
  abilityKey: "C" | "Q" | "E" | "X";
  abilityIcon: string;
  type: "Recon" | "Molly/Damage" | "Smoke/Wall" | "Trap/Setup" | "Flash/Knife" | "Ultimate";
  difficulty: "Dễ" | "Trung Bình" | "Khó";
  description: string;
  standingPos: string;
  aimMarker: string;
  powerBounce: string;
  landingZone: string;
  proPlayer?: string;
  tags: string[];
  steps: LineupStep[];
  visualHudAlignment: {
    reticleType: "dot" | "cross" | "hud_bar" | "ability_icon" | "wireframe";
    targetFeature: string;
    hudElement: string;
    movementNote: string;
  };
}


// ponytail: lineup verification status — all lineups are text-described and need in-game testing
// Upgrade path: add per-lineup verificationStatus field when in-game screenshot system is built
export const LINEUP_VERIFICATION_NOTE = "Các lineup được mô tả từ kiến thức cộng đồng. Vị trí đứng/điểm căn HUD cần xác minh trong game thực tế." as const;

export const MAP_LINEUPS_DATA: AbilityLineup[] = [
  // ==========================================
  // ASCENT
  // ==========================================
  {
    id: "sova-ascent-a-reveal",
    title: "Recon Bolt: Quét Sạch A Site & Heaven từ A Lobby",
    map: "Ascent",
    mapSplash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
    agent: "Sova",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "Recon Bolt (Mũi Tên Do Thám)",
    abilityKey: "E",
    abilityIcon: "🎯",
    type: "Recon",
    difficulty: "Dễ",
    description: "Mũi tên kinh điển quét toàn bộ các góc tử thần Generator, Heaven, Tree và toàn bộ A Site khi phát động tấn công.",
    standingPos: "Đứng ép sát góc cột đèn A Lobby gần cánh cửa gỗ",
    aimMarker: "Căn chóp góc trái biểu tượng Drone (C) trùng với đỉnh nhọn mái nhà vòm A Site",
    powerBounce: "1 Vạch Lực (1 Charge Bar) • 0 Nảy (0 Bounce)",
    landingZone: "Mái kính góc cao A Site, lộ tầm nhìn toàn bộ vị trí thủ",
    proPlayer: "TenZ / Chronicle",
    tags: ["A Execute", "Wallhack", "Pro Meta"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng chân",
        instruction: "Tiến vào A Lobby, lùi sát vào góc vuông giữa cột đèn và bức tường gạch.",
        hudCue: "Căn người không còn bị trượt về sau",
        visualType: "stand",
        callout: "A Lobby Corner",
        hudTargetX: 50,
        hudTargetY: 65,
        targetPointLabel: "Góc vuông cột đèn A Lobby",
        hudElementHighlight: "Tâm ngắm chân",
        pixelZoomDetails: {
          zoomTitle: "Kẹt góc cột đèn",
          zoomDescription: "Lùi hết cỡ cho đến khi nhân vật dừng hẳn tại góc vuông gạch."
        }
      },
      {
        stepNumber: 2,
        title: "Điểm căn HUD",
        instruction: "Nhìn lên bầu trời nóc nhà A Site, đưa góc trên bên trái của icon kỹ năng Drone (C) vào mép ngói mái nhà.",
        hudCue: "Góc icon C chạm mép ngói đen",
        visualType: "aim",
        callout: "Sky Roof Peak",
        hudTargetX: 62,
        hudTargetY: 28,
        targetPointLabel: "Đỉnh ngói nhọn nóc A Site",
        hudElementHighlight: "Góc trên bên trái Icon Drone (C)",
        pixelZoomDetails: {
          zoomTitle: "Góc nhọn mái ngói",
          zoomDescription: "Chóp nhọn của icon Drone C nằm vừa khít dưới mép ngói đen thứ 2."
        }
      },
      {
        stepNumber: 3,
        title: "Thao tác bắn",
        instruction: "Giữ chuột trái kéo đúng 1 vạch lực (1 Bar) rồi thả, không bật chế độ nảy chuột phải.",
        hudCue: "1 Bar Power (0 Bounce)",
        visualType: "throw",
        callout: "1 Charge Bar",
        hudTargetX: 50,
        hudTargetY: 82,
        targetPointLabel: "Kéo 1 Vạch Lực (1 Bar)",
        hudElementHighlight: "Thanh sạc cung (Charge Meter)"
      },
      {
        stepNumber: 4,
        title: "Vị trí rơi và hiệu quả",
        instruction: "Mũi tên bay qua nóc nhà và đáp xuống mái kính trên cao, quét lộ diện toàn bộ kẻ địch đứng sau Generator và A Heaven.",
        hudCue: "Quét 100% Site & Rafters",
        visualType: "land",
        callout: "A Site Glass Roof",
        hudTargetX: 74,
        hudTargetY: 42,
        targetPointLabel: "Mái kính góc cao A Site"
      }
    ],
    visualHudAlignment: {
      reticleType: "ability_icon",
      targetFeature: "Đỉnh ngói nhọn nóc A Site",
      hudElement: "Góc trên bên trái của biểu tượng Drone (C)",
      movementNote: "Đứng yên bắn, không nhảy"
    }
  },
  {
    id: "sova-ascent-b-double-shock",
    title: "Double Shock Dart: Triệt Hạ Đặt/Gỡ B Default từ CT Spawn",
    map: "Ascent",
    mapSplash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
    agent: "Sova",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
    site: "B",
    side: "Retake",
    abilityName: "Shock Dart (Mũi Tên Sốc Điện)",
    abilityKey: "Q",
    abilityIcon: "⚡",
    type: "Molly/Damage",
    difficulty: "Khó",
    description: "Combo 2 mũi tên sốc điện tiếp đất cùng 1 tích tắc gây 150+ sát thương, kết liễu kẻ địch đang gỡ hoặc đặt spike tại B Default.",
    standingPos: "Đứng góc tường cánh cửa CT Spawn nhìn về hướng B Site",
    aimMarker: "Tên 1: Căn mép lá cây nóc B. Tên 2: Căn rìa đám mây thứ 2",
    powerBounce: "Tên 1: 2 Vạch (1 Nảy) → Bắn xong lập tức ngắm Tên 2: 1 Vạch (0 Nảy)",
    landingZone: "Rơi chuẩn từng milimet vào thùng B Default",
    proPlayer: "Averian / AverageJonas",
    tags: ["Double Shock", "Instant Kill", "Clutch Retake"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng",
        instruction: "Đứng nép vào góc tường cửa vòm CT Spawn nhìn về phía B Site.",
        hudCue: "Kẹt góc CT Archway",
        visualType: "stand",
        callout: "CT Spawn Arch",
        hudTargetX: 45,
        hudTargetY: 70,
        targetPointLabel: "Góc tường vòm CT Spawn"
      },
      {
        stepNumber: 2,
        title: "Mũi tên thứ 1",
        instruction: "Ngắm vào mép lá cây cao nhất nóc B, bật 1 nảy (chuột phải), kéo 2 vạch lực và thả.",
        hudCue: "2 Bars Power • 1 Bounce",
        visualType: "aim",
        callout: "Roof Leaf Top",
        hudTargetX: 58,
        hudTargetY: 22,
        targetPointLabel: "Đỉnh ngọn lá cây nóc B",
        hudElementHighlight: "Tâm ngắm chính + 1 Nảy"
      },
      {
        stepNumber: 3,
        title: "Mũi tên thứ 2 (Ngay lập tức)",
        instruction: "Chuyển tâm sang rìa đám mây bên phải, 0 nảy, kéo 1 vạch lực và bắn ngay.",
        hudCue: "1 Bar Power • 0 Bounce",
        visualType: "throw",
        callout: "Right Cloud Edge",
        hudTargetX: 68,
        hudTargetY: 34,
        targetPointLabel: "Rìa đám mây bên phải",
        hudElementHighlight: "Thanh sạc 1 vạch"
      },
      {
        stepNumber: 4,
        title: "Kết quả va chạm",
        instruction: "Hai mũi tên rơi đồng thời cách nhau 0.2s, nổ dồn 150 HP tiêu diệt địch lập tức.",
        hudCue: "150+ Burst Damage",
        visualType: "land",
        callout: "B Default Green Box",
        hudTargetX: 80,
        hudTargetY: 55,
        targetPointLabel: "Thùng xanh B Site Default"
      }
    ],
    visualHudAlignment: {
      reticleType: "hud_bar",
      targetFeature: "Lá cây nóc B & Đám mây thứ 2",
      hudElement: "Thanh lực bắn (Charge Meter)",
      movementNote: "Bắn Tên 1 xong chuyển tâm ngay sang Tên 2"
    }
  },
  {
    id: "cypher-ascent-b-god-setup",
    title: "God Trapwires & One-Way Cage B Site Không Thể Phá",
    map: "Ascent",
    mapSplash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
    agent: "Cypher",
    agentRole: "Sentinel",
    agentIcon: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png",
    site: "B",
    side: "Defender",
    abilityName: "Trapwire & Cyber Cage",
    abilityKey: "C",
    abilityIcon: "🕸️",
    type: "Trap/Setup",
    difficulty: "Trung Bình",
    description: "Bộ setup phòng thủ khét tiếng giúp 1 mình Cypher chặn đứng cả 5 người đối thủ đẩy vào B Main.",
    standingPos: "B Site Lane và B Main Chokepoint",
    aimMarker: "Dây 1: Cắt chéo chân tường B Main lên thùng. Dây 2: Nối giữa cột trụ và mép cầu thang",
    powerBounce: "Cài đặt trước thời gian mở rào",
    landingZone: "Khóa chặt B Main, One-way Cage nhìn thấy chân địch khi đi qua",
    proPlayer: "d4v41 / Munchkin",
    tags: ["God Setup", "Anti-Rush", "One-Way"],
    steps: [
      {
        stepNumber: 1,
        title: "Dây Bẫy B Main",
        instruction: "Ngồi xuống mép bậc thang B Main, đặt dây bẫy chéo từ gờ tường sang thùng gỗ ngoài tầm với của dao găm.",
        hudCue: "Dây không thể bị chém bằng dao",
        visualType: "stand",
        callout: "B Main Entrance",
        hudTargetX: 52,
        hudTargetY: 60,
        targetPointLabel: "Gờ tường chéo bậc thang B Main"
      },
      {
        stepNumber: 2,
        title: "One-Way Cyber Cage",
        instruction: "Nhảy lên thùng gỗ B Main, ném Cage vào mép gờ sắt trên đầu cửa.",
        hudCue: "Cage nằm trên gờ sắt",
        visualType: "aim",
        callout: "Iron Ledge Over Door",
        hudTargetX: 48,
        hudTargetY: 25,
        targetPointLabel: "Gờ sắt trên cửa vòm B Main"
      },
      {
        stepNumber: 3,
        title: "Spycam Trên Cao",
        instruction: "Nhảy ném Spycam lên đỉnh nóc nhà Boathouse nhìn bao quát toàn bộ B Site và B Lane.",
        hudCue: "Spycam góc cao 360 độ",
        visualType: "throw",
        callout: "Boathouse Roof Peak",
        hudTargetX: 72,
        hudTargetY: 18,
        targetPointLabel: "Nóc nhà Boathouse góc cao"
      },
      {
        stepNumber: 4,
        title: "Cách xử lý tình huống",
        instruction: "Khi nghe tiếng chân hoặc địch dính bẫy, kích hoạt Cage và spam đạn xuyên khói từ phía sau thùng B.",
        hudCue: "Spam Phantom/Odin dễ dàng",
        visualType: "land",
        callout: "B Site Defender Box",
        hudTargetX: 55,
        hudTargetY: 50,
        targetPointLabel: "Khói One-Way lộ chân địch"
      }
    ],
    visualHudAlignment: {
      reticleType: "wireframe",
      targetFeature: "Gờ sắt cửa vòm B Main",
      hudElement: "Tâm ngắm chuẩn tâm (Crosshair Center)",
      movementNote: "Nhảy ném (Jump Throw) khi đặt One-Way Cage"
    }
  },
  {
    id: "killjoy-ascent-b-lockdown",
    title: "Lockdown Giữ Chặt Toàn Bộ B Site & B Main từ Boathouse",
    map: "Ascent",
    mapSplash: "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png",
    agent: "Killjoy",
    agentRole: "Sentinel",
    agentIcon: "https://media.valorant-api.com/agents/1e58de9c-4950-5125-93e9-a0aee9f98746/displayicon.png",
    site: "B",
    side: "Defender",
    abilityName: "Lockdown (Chiêu Cuối)",
    abilityKey: "X",
    abilityIcon: "🤖",
    type: "Ultimate",
    difficulty: "Dễ",
    description: "Vị trí đặt Lockdown an toàn tuyệt đối sau tường chống đạn, ép toàn bộ kẻ địch đang chiếm Site phải tháo chạy.",
    standingPos: "Góc trong cùng của nhà kho Boathouse (phía sau tấm chắn sắt)",
    aimMarker: "Cúi nhìn xuống góc sàn nhà kho Boathouse",
    powerBounce: "Kích hoạt phím X (Chiêu cuối)",
    landingZone: "Phủ sóng 100% B Site, B Main, B Stairs và một phần Mid Market",
    proPlayer: "Boaster",
    tags: ["Lockdown", "Site Retake", "Safe Spot"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí di chuyển",
        instruction: "Chạy vào bên trong góc sâu nhất của nhà kho B Boathouse.",
        hudCue: "Đứng sau bức tường dày",
        visualType: "stand",
        callout: "Deep Boathouse",
        hudTargetX: 50,
        hudTargetY: 75,
        targetPointLabel: "Góc tường sâu Boathouse"
      },
      {
        stepNumber: 2,
        title: "Căn đặt thiết bị",
        instruction: "Nhìn xuống góc sàn nhà, đảm bảo máy Lockdown nép sát vào góc chết không bị đạn súng bắn xuyên phá.",
        hudCue: "Góc chết chống spam Odin",
        visualType: "aim",
        callout: "Corner Floor",
        hudTargetX: 50,
        hudTargetY: 70,
        targetPointLabel: "Sàn góc chết chống đạn"
      },
      {
        stepNumber: 3,
        title: "Kích hoạt chiêu cuối",
        instruction: "Bấm X đặt thiết bị, đồng thời đặt 2 quả Nanoswarm ở cửa ra vào để tiêu diệt bất kỳ ai liều mạng lao vào phá.",
        hudCue: "Lockdown đếm ngược 13s",
        visualType: "throw",
        callout: "Ultimate Deploy",
        hudTargetX: 50,
        hudTargetY: 50,
        targetPointLabel: "Đặt chiêu cuối Lockdown"
      },
      {
        stepNumber: 4,
        title: "Quét sạch kẻ địch",
        instruction: "Toàn bộ kẻ địch trong B Site bị giữ chân (Detained) trong 8 giây, dễ dàng tiến ra dọn dẹp.",
        hudCue: "Giam cầm toàn bộ team địch",
        visualType: "land",
        callout: "Full B Site Capture",
        hudTargetX: 60,
        hudTargetY: 45,
        targetPointLabel: "Phủ 100% B Site"
      }
    ],
    visualHudAlignment: {
      reticleType: "dot",
      targetFeature: "Góc sàn nhà Boathouse",
      hudElement: "Tâm ngắm chính",
      movementNote: "Đứng sát góc tường trong cùng"
    }
  },

  // ==========================================
  // BIND
  // ==========================================
  {
    id: "brimstone-bind-a-molly",
    title: "Molly Post-Plant A Default từ ngoài A Short (Fountain)",
    map: "Bind",
    mapSplash: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
    agent: "Brimstone",
    agentRole: "Controller",
    agentIcon: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png",
    site: "A",
    side: "Post-Plant",
    abilityName: "Incendiary (Lựu Đạn Lửa)",
    abilityKey: "Q",
    abilityIcon: "🔥",
    type: "Molly/Damage",
    difficulty: "Dễ",
    description: "Lineup huyền thoại thiêu cháy khu vực đặt bom A Default trong 8 giây từ khoảng cách an toàn tuyệt đối.",
    standingPos: "Đứng ép góc vuông góc tường bồn tắm ngoài A Short (Fountain)",
    aimMarker: "Căn góc biểu tượng chuột trái trên HUD trùng với đỉnh tháp anten vệ tinh A",
    powerBounce: "Đứng yên bắn chuột trái (Normal Shot)",
    landingZone: "Rơi thẳng xuống tâm bom A Default",
    proPlayer: "Zellsis",
    tags: ["Post-Plant", "Guaranteed Win", "Molly Lineup"],
    steps: [
      {
        stepNumber: 1,
        title: "Đứng vị trí",
        instruction: "Sau khi đặt Spike góc A Default, lùi ra ngoài A Short tại góc bồn hoa tròn Fountain.",
        hudCue: "Ép sát góc tường bồn hoa",
        visualType: "stand",
        callout: "A Fountain Corner",
        hudTargetX: 48,
        hudTargetY: 72,
        targetPointLabel: "Góc tường bồn hoa A Fountain"
      },
      {
        stepNumber: 2,
        title: "Căn HUD biểu tượng",
        instruction: "Nhìn lên tháp anten A, đưa biểu tượng hình chuột trái của kỹ năng Molly trùng vào đỉnh tháp.",
        hudCue: "Biểu tượng chuột chạm đỉnh tháp",
        visualType: "aim",
        callout: "Satellite Tower",
        hudTargetX: 54,
        hudTargetY: 20,
        targetPointLabel: "Đỉnh tháp anten vệ tinh A",
        hudElementHighlight: "Biểu tượng chuột trái trên thanh HUD",
        pixelZoomDetails: {
          zoomTitle: "Đỉnh tháp anten",
          zoomDescription: "Mũi nhọn icon chuột chạm ngay chóp nhọn trên cùng của cột anten."
        }
      },
      {
        stepNumber: 3,
        title: "Bắn lựu đạn",
        instruction: "Bấm chuột trái bắn thẳng, quả lựu đạn bay theo quỹ đạo parabol qua nóc nhà.",
        hudCue: "Thời gian bay: 5.5 giây",
        visualType: "throw",
        callout: "High Arc Shot",
        hudTargetX: 54,
        hudTargetY: 20,
        targetPointLabel: "Bắn chuột trái (Không nhảy)"
      },
      {
        stepNumber: 4,
        title: "Khu vực thiêu rụi",
        instruction: "Lửa bao phủ toàn bộ ô đặt bom và kéo dài 8 giây, ngăn cản mọi nỗ lực gỡ spike.",
        hudCue: "8s thiêu cháy 60 dmg/s",
        visualType: "land",
        callout: "A Default Spike Zone",
        hudTargetX: 70,
        hudTargetY: 55,
        targetPointLabel: "Tâm đặt Spike A Default"
      }
    ],
    visualHudAlignment: {
      reticleType: "hud_bar",
      targetFeature: "Đỉnh tháp anten vệ tinh",
      hudElement: "Biểu tượng chuột trái trên thanh kỹ năng HUD",
      movementNote: "Đứng yên bắn, không di chuyển"
    }
  },
  {
    id: "brimstone-bind-b-molly",
    title: "Molly Post-Plant B Default từ ngoài B Long",
    map: "Bind",
    mapSplash: "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png",
    agent: "Brimstone",
    agentRole: "Controller",
    agentIcon: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png",
    site: "B",
    side: "Post-Plant",
    abilityName: "Incendiary (Lựu Đạn Lửa)",
    abilityKey: "Q",
    abilityIcon: "🔥",
    type: "Molly/Damage",
    difficulty: "Dễ",
    description: "Khóa chặt góc gỡ bom B Default từ B Long Fountain an toàn, không lo bị đối thủ flank.",
    standingPos: "Đứng nép góc tường B Long Fountain",
    aimMarker: "Căn chóp tam giác của thanh máu (HP Bar) vào góc mái nhà tôn B Long",
    powerBounce: "Đứng yên bắn chuột trái",
    landingZone: "Nổ trúng góc thùng B Site Default",
    proPlayer: "Boaster",
    tags: ["Post-Plant", "B Site", "Clutch Round"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng",
        instruction: "Đứng tại góc tường B Long ngoài cổng dịch chuyển.",
        hudCue: "Góc tường B Long",
        visualType: "stand",
        callout: "B Long Fountain",
        hudTargetX: 42,
        hudTargetY: 68,
        targetPointLabel: "Góc tường B Long Fountain"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Nhìn lên mái tôn nóc B Site, căn mép dưới icon kỹ năng vào góc mái tôn thứ 2.",
        hudCue: "Mép icon chạm góc mái tôn",
        visualType: "aim",
        callout: "Metal Roof Corner",
        hudTargetX: 60,
        hudTargetY: 26,
        targetPointLabel: "Góc nhọn mái tôn thứ 2",
        hudElementHighlight: "Góc dưới thanh máu HUD"
      },
      {
        stepNumber: 3,
        title: "Bắn đạn",
        instruction: "Bấm chuột trái bắn lựu đạn ngay khi nghe tiếng âm thanh gỡ Spike đầu tiên.",
        hudCue: "Bắn ngay khi nghe defuse",
        visualType: "throw",
        callout: "Molly Launch",
        hudTargetX: 60,
        hudTargetY: 26,
        targetPointLabel: "Bắn chuột trái"
      },
      {
        stepNumber: 4,
        title: "Hiệu quả",
        instruction: "Lửa phủ kín toàn bộ khu vực sau thùng B Default, ép địch phải buông tay gỡ.",
        hudCue: "Cháy 100% góc gỡ bom",
        visualType: "land",
        callout: "B Default Container",
        hudTargetX: 65,
        hudTargetY: 52,
        targetPointLabel: "B Default Spike Corner"
      }
    ],
    visualHudAlignment: {
      reticleType: "hud_bar",
      targetFeature: "Góc mái tôn nóc B Site",
      hudElement: "Thanh máu hoặc mép icon kỹ năng",
      movementNote: "Đứng yên bắn"
    }
  },

  // ==========================================
  // HAVEN
  // ==========================================
  {
    id: "kayo-haven-a-knife",
    title: "ZERO/point: Khóa Chặt Chiêu Thức Toàn Bộ A Site từ A Garden",
    map: "Haven",
    mapSplash: "https://media.valorant-api.com/maps/2bee0dc9-40a8-7f35-7050-81f70d50034e/splash.png",
    agent: "KAY/O",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/601db835-4388-fb93-6448-49abb157cb3b/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "ZERO/point (Dao Vô Hiệu Hóa)",
    abilityKey: "E",
    abilityIcon: "🗡️",
    type: "Flash/Knife",
    difficulty: "Dễ",
    description: "Câm lặng tức thì Jett, Cypher, Killjoy ở A Long & A Site, không cho đối thủ Dash hoặc kích hoạt bẫy.",
    standingPos: "Đứng tựa lưng vào góc tường A Garden gần lối ra A Long",
    aimMarker: "Ngắm đỉnh ngọn cây tre cao nhất vượt qua mái đình A Long",
    powerBounce: "Ném thường chuột trái (Normal Throw)",
    landingZone: "Cắm trên đỉnh mái đình A Site, phủ bán kính quét cực đại",
    proPlayer: "Chronicle",
    tags: ["Suppress Knife", "A Execute", "Anti-OP"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng chân",
        instruction: "Lùi sát vào góc tường đá A Garden cạnh cổng ra.",
        hudCue: "Kẹt góc đá A Garden",
        visualType: "stand",
        callout: "A Garden Corner",
        hudTargetX: 50,
        hudTargetY: 70,
        targetPointLabel: "Góc tường đá A Garden"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Đưa tâm ngắm vào ngọn lá tre cao nhất phía trên mái nhà cổ.",
        hudCue: "Tâm đặt đỉnh lá tre cao nhất",
        visualType: "aim",
        callout: "Bamboo Tree Top",
        hudTargetX: 56,
        hudTargetY: 22,
        targetPointLabel: "Đỉnh ngọn lá tre cao nhất",
        hudElementHighlight: "Tâm ngắm chính (Center Reticle)"
      },
      {
        stepNumber: 3,
        title: "Ném dao",
        instruction: "Bấm chuột trái ném dao, không cần lấy đà chạy hay nhảy.",
        hudCue: "Ném đứng yên (Stand Throw)",
        visualType: "throw",
        callout: "Knife Arc",
        hudTargetX: 56,
        hudTargetY: 22,
        targetPointLabel: "Ném thường chuột trái"
      },
      {
        stepNumber: 4,
        title: "Hiệu quả câm lặng",
        instruction: "Dao cắm vào ngói đỉnh A Site, sóng điện từ câm lặng 100% đối thủ trong vòng 8 giây.",
        hudCue: "Suppressed toàn bộ A Site",
        visualType: "land",
        callout: "A Site Pagoda Roof",
        hudTargetX: 68,
        hudTargetY: 38,
        targetPointLabel: "Đỉnh ngói A Pagoda Roof"
      }
    ],
    visualHudAlignment: {
      reticleType: "cross",
      targetFeature: "Đỉnh lá tre cao nhất",
      hudElement: "Tâm ngắm chính (Crosshair)",
      movementNote: "Đứng yên ném"
    }
  },

  // ==========================================
  // SUNSET
  // ==========================================
  {
    id: "cypher-sunset-b-god-setup",
    title: "God Trapwire B Site Không Thể Chém Dao (Meta johnqt Sentinels)",
    map: "Sunset",
    mapSplash: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9fac-be9e1a729b30/splash.png",
    agent: "Cypher",
    agentRole: "Sentinel",
    agentIcon: "https://media.valorant-api.com/agents/117ed9e3-49f3-6512-3ccf-0cada7e3823b/displayicon.png",
    site: "B",
    side: "Defender",
    abilityName: "Trapwire & Cyber Cage",
    abilityKey: "C",
    abilityIcon: "🕸️",
    type: "Trap/Setup",
    difficulty: "Trung Bình",
    description: "Bộ dây bẫy Meta VCT Masters Madrid giúp johnqt và Sentinels vô địch, giật bẫy kẻ địch đi từ B Main mà Raze hay Jett không thể chém hay dash qua.",
    standingPos: "B Site Pillar & B Main Entrance",
    aimMarker: "Căn mép biển hiệu B Main kéo ngang sang chân cột trụ bê tông",
    powerBounce: "Cài đặt đầu round đấu",
    landingZone: "Khóa chặt toàn bộ cửa vào B Main và B Boba",
    proPlayer: "johnqt",
    tags: ["VCT Champion", "Unbreakable", "Meta Sentinel"],
    steps: [
      {
        stepNumber: 1,
        title: "Dây bẫy B Main Unbreakable",
        instruction: "Đứng sát cột trụ B Site, ngắm vào chân tường phía sau thùng gỗ, kéo dây bẫy tầm cao ngực.",
        hudCue: "Dây không thể bị kích hoạt bừa",
        visualType: "stand",
        callout: "B Pillar",
        hudTargetX: 52,
        hudTargetY: 58,
        targetPointLabel: "Cột trụ B Site Pillar"
      },
      {
        stepNumber: 2,
        title: "One-Way Cyber Cage B Main",
        instruction: "Ném Cage lên đỉnh gờ bảng hiệu B Main.",
        hudCue: "Cage nằm trên bảng hiệu",
        visualType: "aim",
        callout: "B Main Neon Sign",
        hudTargetX: 46,
        hudTargetY: 28,
        targetPointLabel: "Mép gờ bảng hiệu B Main"
      },
      {
        stepNumber: 3,
        title: "Spycam Kiểm Soát B Boba",
        instruction: "Nhảy gắn camera lên góc cao bóng đèn B Boba nhìn thấy cả B Market và B Site.",
        hudCue: "Cam góc cao không góc chết",
        visualType: "throw",
        callout: "B Boba Lamp",
        hudTargetX: 74,
        hudTargetY: 22,
        targetPointLabel: "Bóng đèn góc cao B Boba"
      },
      {
        stepNumber: 4,
        title: "Kích hoạt tiêu diệt",
        instruction: "Khi địch chạm dây B Main, bật Cage và dùng Odin/Phantom xả đạn xuyên qua khói.",
        hudCue: "Dễ dàng quét sạch đợt rush",
        visualType: "land",
        callout: "B Main Choke",
        hudTargetX: 50,
        hudTargetY: 50,
        targetPointLabel: "B Main Chokepoint"
      }
    ],
    visualHudAlignment: {
      reticleType: "wireframe",
      targetFeature: "Mép biển hiệu B Main",
      hudElement: "Tâm ngắm chính",
      movementNote: "Đặt dây tầm cao ngang ngực"
    }
  },
  {
    id: "gekko-sunset-b-mosh",
    title: "Mosh Pit: Quét Sạch B Default Post-Plant từ B Main",
    map: "Sunset",
    mapSplash: "https://media.valorant-api.com/maps/92584fbe-486a-b1b2-9fac-be9e1a729b30/splash.png",
    agent: "Gekko",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/e370fa57-4757-3604-3648-499e1f642d3f/displayicon.png",
    site: "B",
    side: "Post-Plant",
    abilityName: "Mosh Pit (Quả Cầu Axit)",
    abilityKey: "C",
    abilityIcon: "🧪",
    type: "Molly/Damage",
    difficulty: "Dễ",
    description: "Ném Mosh Pit nổ lập tức 150+ damage khu vực B Default, chặn đứng hoàn toàn thời gian gỡ spike 1/2.",
    standingPos: "Góc tường rào B Main phía sau cổng vòm",
    aimMarker: "Căn tâm ngắm vào góc gạch màu cam trên đỉnh tòa nhà Sunset",
    powerBounce: "Nhảy ném (Jump Throw) chuột trái",
    landingZone: "Phủ kín 100% diện tích thùng B Default",
    proPlayer: "something",
    tags: ["Mosh Pit", "Gekko Meta", "Post-Plant"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng chân",
        instruction: "Đứng nép vào góc tường rào ngoài B Main.",
        hudCue: "Kẹt góc tường rào B Main",
        visualType: "stand",
        callout: "B Main Fence",
        hudTargetX: 44,
        hudTargetY: 66,
        targetPointLabel: "Góc rào ngoài B Main"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Ngắm vào viên gạch màu cam trên đỉnh mép mái nhà.",
        hudCue: "Tâm đặt giữa viên gạch cam",
        visualType: "aim",
        callout: "Orange Brick Roof",
        hudTargetX: 58,
        hudTargetY: 24,
        targetPointLabel: "Viên gạch cam đỉnh mái nhà",
        hudElementHighlight: "Tâm ngắm chính"
      },
      {
        stepNumber: 3,
        title: "Nhảy ném",
        instruction: "Bấm nút Nhảy (Space) đồng thời thả chuột trái (Jump Throw).",
        hudCue: "Jump Throw chuẩn nhịp",
        visualType: "throw",
        callout: "Jump Throw",
        hudTargetX: 58,
        hudTargetY: 24,
        targetPointLabel: "Nhảy + Chuột trái cùng lúc"
      },
      {
        stepNumber: 4,
        title: "Nổ dồn sát thương",
        instruction: "Mosh Pit tiếp đất nở to và nổ 150 HP, tiêu diệt ngay kẻ địch đang gỡ.",
        hudCue: "150 HP One-Shot Defuser",
        visualType: "land",
        callout: "B Default Spike",
        hudTargetX: 72,
        hudTargetY: 48,
        targetPointLabel: "B Default Container"
      }
    ],
    visualHudAlignment: {
      reticleType: "cross",
      targetFeature: "Viên gạch cam đỉnh mái nhà",
      hudElement: "Tâm ngắm chính",
      movementNote: "Nhảy ném (Jump Throw) cùng lúc"
    }
  },

  // ==========================================
  // LOTUS
  // ==========================================
  {
    id: "fade-lotus-a-haunt",
    title: "Haunt Mắt Quỷ: Quét Toàn Bộ A Site & A Tree từ A Root",
    map: "Lotus",
    mapSplash: "https://media.valorant-api.com/maps/2fe4ed3a-450a-948b-6d6b-e89a5437400a/splash.png",
    agent: "Fade",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/dade69b4-4f5a-8528-247b-219e5a1facd6/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "Haunt (Mắt Quỷ Do Thám)",
    abilityKey: "E",
    abilityIcon: "👁️",
    type: "Recon",
    difficulty: "Dễ",
    description: "Mắt Quỷ cắm trên đỉnh tảng đá cao A Site, phát hiện kẻ địch nấp sau cột trụ A và cửa sổ A Top.",
    standingPos: "Đứng tựa góc rễ cây cổ thụ A Root",
    aimMarker: "Căn mép icon Prowler (C) vào khe nứt tảng đá cổ Lotus",
    powerBounce: "Đứng yên ném chuột trái",
    landingZone: "Đậu trên đỉnh tảng đá cao A Site, không góc chết",
    proPlayer: "Foxy9",
    tags: ["Fade Haunt", "Lotus Meta", "A Site Clear"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng",
        instruction: "Tiến vào A Root, áp sát góc rễ cây khổng lồ phía bên phải.",
        hudCue: "Góc rễ cây A Root",
        visualType: "stand",
        callout: "A Root Tree",
        hudTargetX: 46,
        hudTargetY: 65,
        targetPointLabel: "Rễ cây cổ thụ A Root"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Nhìn lên bầu trời, đưa icon kỹ năng C trùng với khe nứt tảng đá.",
        hudCue: "Icon C khớp khe nứt",
        visualType: "aim",
        callout: "Stone Crack",
        hudTargetX: 62,
        hudTargetY: 26,
        targetPointLabel: "Khe nứt tảng đá đỉnh trời",
        hudElementHighlight: "Góc trên Icon Prowler (C)"
      },
      {
        stepNumber: 3,
        title: "Ném mắt",
        instruction: "Bấm chuột trái ném thẳng, sau 1.5s bấm E để mắt rơi nhanh nếu muốn bất ngờ.",
        hudCue: "Có thể kích hoạt E để rơi sớm",
        visualType: "throw",
        callout: "Haunt Throw",
        hudTargetX: 62,
        hudTargetY: 26,
        targetPointLabel: "Ném chuột trái"
      },
      {
        stepNumber: 4,
        title: "Phát hiện kẻ thù",
        instruction: "Quét lộ dấu vết (Trails) toàn bộ kẻ địch nấp trong A Site và A Tree.",
        hudCue: "Lộ vị trí và tạo vệt đen",
        visualType: "land",
        callout: "A Pillar Top",
        hudTargetX: 75,
        hudTargetY: 40,
        targetPointLabel: "Đỉnh tảng đá cao A Site"
      }
    ],
    visualHudAlignment: {
      reticleType: "ability_icon",
      targetFeature: "Khe nứt tảng đá cổ",
      hudElement: "Biểu tượng Prowler (C)",
      movementNote: "Đứng yên ném"
    }
  },

  // ==========================================
  // BREEZE
  // ==========================================
  {
    id: "viper-breeze-a-execute",
    title: "Toxic Screen & Poison Orb: Cắt Đôi A Site & Khóa Cổng Chợ",
    map: "Breeze",
    mapSplash: "https://media.valorant-api.com/maps/2fb9a4fd-47b8-4e7d-a97e-9772a16c4e5e/splash.png",
    agent: "Viper",
    agentRole: "Controller",
    agentIcon: "https://media.valorant-api.com/agents/707eab51-4836-f488-046a-cda6bf494859/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "Toxic Screen & Poison Cloud",
    abilityKey: "E",
    abilityIcon: "🧪",
    type: "Smoke/Wall",
    difficulty: "Trung Bình",
    description: "Bộ tường độc bắt buộc phải có trên map Breeze, chia cắt hoàn toàn A Pyramids và bịt kín tầm ngắm Operator từ A Hall và CT Spawn.",
    standingPos: "A Cave Entrance gần khẩu đại bác",
    aimMarker: "Bắn tường độc xuyên qua 2 kim tự tháp A Pyramids",
    powerBounce: "Bắn tường E thẳng theo minimap",
    landingZone: "Cắt đôi A Site thành 2 nửa, che 100% tầm nhìn",
    proPlayer: "dapr / tuyz",
    tags: ["Must Pick", "Breeze King", "Viper Meta"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng",
        instruction: "Đứng tại cửa A Cave cạnh khẩu súng thần công cổ.",
        hudCue: "Cửa A Cave",
        visualType: "stand",
        callout: "A Cave Cannon",
        hudTargetX: 48,
        hudTargetY: 68,
        targetPointLabel: "Khẩu thần công A Cave"
      },
      {
        stepNumber: 2,
        title: "Căn tường độc",
        instruction: "Mở minimap, căn đường thẳng màu xanh lam của Toxic Screen đi xuyên qua giữa 2 khối Kim Tự Tháp.",
        hudCue: "Đường xanh cắt đôi 2 Pyramids",
        visualType: "aim",
        callout: "A Pyramids Midline",
        hudTargetX: 52,
        hudTargetY: 42,
        targetPointLabel: "Đường cắt đôi 2 Kim Tự Tháp",
        hudElementHighlight: "Đường chỉ hướng trên Minimap"
      },
      {
        stepNumber: 3,
        title: "Bắn tường",
        instruction: "Bấm chuột trái phóng tường độc trải dài 50 mét.",
        hudCue: "Kích hoạt E khi team bắt đầu vào",
        visualType: "throw",
        callout: "Screen Launch",
        hudTargetX: 52,
        hudTargetY: 42,
        targetPointLabel: "Bắn E trải dài tường"
      },
      {
        stepNumber: 4,
        title: "Kiểm soát an toàn",
        instruction: "Toàn bộ tay súng Operator ở A Heaven và CT bị mù hoàn toàn, đồng đội thoải mái đặt Spike.",
        hudCue: "Plant Spike an toàn tuyệt đối",
        visualType: "land",
        callout: "A Plant Zone",
        hudTargetX: 70,
        hudTargetY: 50,
        targetPointLabel: "A Site Spike Plant Zone"
      }
    ],
    visualHudAlignment: {
      reticleType: "dot",
      targetFeature: "Khe giữa 2 Kim Tự Tháp",
      hudElement: "Đường dẫn Minimap",
      movementNote: "Đứng yên bắn"
    }
  },

  // ==========================================
  // ICEBOX
  // ==========================================
  {
    id: "sova-icebox-a-double-shock",
    title: "Double Shock Dart: Hạ Gục Đặt Bom A Default từ A Belt",
    map: "Icebox",
    mapSplash: "https://media.valorant-api.com/maps/e2ad5fa6-4142-c07a-cd93-54962142572e/splash.png",
    agent: "Sova",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "Shock Dart (Mũi Tên Sốc Điện)",
    abilityKey: "Q",
    abilityIcon: "⚡",
    type: "Molly/Damage",
    difficulty: "Khó",
    description: "Lineup kết liễu kẻ địch đang gỡ bom tại A Default từ A Belt trên cao mà không cần ló mặt ra đọ súng.",
    standingPos: "Đứng trên thanh sắt A Belt nhìn xuống A Site",
    aimMarker: "Tên 1: Căn mép cần cẩu màu cam. Tên 2: Căn góc biển báo tuyết",
    powerBounce: "Tên 1: 2 Vạch (1 Nảy) → Tên 2: 1 Vạch (0 Nảy)",
    landingZone: "Nổ dồn sát thương trúng góc đặt A Default",
    proPlayer: "AverageJonas / Chronicle",
    tags: ["Icebox Lineup", "Instant Kill", "A Default"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng chân",
        instruction: "Leo lên cầu thang A Belt, tựa sát vào thanh lan can sắt ngoài cùng.",
        hudCue: "Lan can sắt A Belt",
        visualType: "stand",
        callout: "A Belt Railing",
        hudTargetX: 42,
        hudTargetY: 65,
        targetPointLabel: "Lan can sắt A Belt"
      },
      {
        stepNumber: 2,
        title: "Mũi tên số 1",
        instruction: "Ngắm vào đỉnh cần cẩu cơ giới màu cam, bật 1 nảy, kéo 2 vạch lực rồi bắn.",
        hudCue: "2 Bars Power • 1 Bounce",
        visualType: "aim",
        callout: "Orange Crane Top",
        hudTargetX: 64,
        hudTargetY: 22,
        targetPointLabel: "Đỉnh cần cẩu cơ giới cam",
        hudElementHighlight: "Thanh sạc 2 vạch + 1 Nảy"
      },
      {
        stepNumber: 3,
        title: "Mũi tên số 2",
        instruction: "Chuyển tâm sang góc dưới biển cảnh báo tuyết, 0 nảy, kéo 1 vạch lực rồi thả ngay.",
        hudCue: "1 Bar Power • 0 Bounce",
        visualType: "throw",
        callout: "Warning Sign Edge",
        hudTargetX: 58,
        hudTargetY: 32,
        targetPointLabel: "Góc biển báo cảnh báo tuyết"
      },
      {
        stepNumber: 4,
        title: "Triệt hạ đối thủ",
        instruction: "Hai mũi tên đáp xuống gần như cùng lúc, gây 160 damage tiêu diệt kẻ gỡ bom.",
        hudCue: "160 Damage Instant Kill",
        visualType: "land",
        callout: "A Default Box",
        hudTargetX: 72,
        hudTargetY: 54,
        targetPointLabel: "A Site Default Container"
      }
    ],
    visualHudAlignment: {
      reticleType: "hud_bar",
      targetFeature: "Đỉnh cần cẩu cam & Biển báo tuyết",
      hudElement: "Thanh sạc cung Sova",
      movementNote: "Bắn Tên 1 xong chuyển tâm ngay sang Tên 2"
    }
  },

  // ==========================================
  // SPLIT
  // ==========================================
  {
    id: "omen-split-a-oneway",
    title: "One-Way Smoke A Main từ A Rafters / Screen",
    map: "Split",
    mapSplash: "https://media.valorant-api.com/maps/d960549e-485c-e861-8d71-aa9d1aed12a2/splash.png",
    agent: "Omen",
    agentRole: "Controller",
    agentIcon: "https://media.valorant-api.com/agents/8e253930-4c05-31dd-169c-96b6ce0efe68/displayicon.png",
    site: "A",
    side: "Defender",
    abilityName: "Dark Cover (Khói Đen)",
    abilityKey: "E",
    abilityIcon: "🌑",
    type: "Smoke/Wall",
    difficulty: "Dễ",
    description: "Quả khói one-way đặt trên gờ bảng hiệu A Main, giúp phòng thủ A Site an toàn trước mọi đợt tấn công chớp nhoáng.",
    standingPos: "A Rafters hoặc sau thùng A Site",
    aimMarker: "Đặt tâm bóng khói vào gờ bảng hiệu quảng cáo A Main",
    powerBounce: "Chuột phải đặt khói",
    landingZone: "Khói lơ lửng trên biển hiệu, hở chân địch khi chạy ra",
    proPlayer: "MaKo",
    tags: ["One-Way Smoke", "Split Defense", "Free Kills"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí an toàn",
        instruction: "Đứng tại A Rafters hoặc góc an toàn sau biển báo A Screen.",
        hudCue: "Sau góc chắn A Rafters",
        visualType: "stand",
        callout: "A Rafters",
        hudTargetX: 50,
        hudTargetY: 70,
        targetPointLabel: "Khu vực A Rafters an toàn"
      },
      {
        stepNumber: 2,
        title: "Căn tâm Shadow Realm",
        instruction: "Bấm E, đưa quả cầu khói lên mép trên cùng của bảng hiệu quảng cáo A Main.",
        hudCue: "Mũi tên đỏ chỉ vào gờ bảng hiệu",
        visualType: "aim",
        callout: "Ad Billboard Ledge",
        hudTargetX: 54,
        hudTargetY: 30,
        targetPointLabel: "Gờ trên biển quảng cáo A Main",
        hudElementHighlight: "Vòng tròn định vị Dark Cover"
      },
      {
        stepNumber: 3,
        title: "Đặt khói",
        instruction: "Bấm chuột phải thả khói, quả cầu đen sẽ bám chặt vào mép biển hiệu.",
        hudCue: "Khói treo lơ lửng cách mặt đất 0.6m",
        visualType: "throw",
        callout: "Deploy Smoke",
        hudTargetX: 54,
        hudTargetY: 30,
        targetPointLabel: "Thả chuột phải"
      },
      {
        stepNumber: 4,
        title: "Bắn hạ đối thủ",
        instruction: "Nhìn rõ từng bước chân của kẻ địch khi chúng chạy ra từ A Main và headshot dễ dàng.",
        hudCue: "Lợi thế 1 chiều 100%",
        visualType: "land",
        callout: "A Main Exit",
        hudTargetX: 66,
        hudTargetY: 52,
        targetPointLabel: "Cổng ra A Main Chokepoint"
      }
    ],
    visualHudAlignment: {
      reticleType: "dot",
      targetFeature: "Gờ biển quảng cáo A Main",
      hudElement: "Tâm định vị Omen Dark Cover",
      movementNote: "Có thể đặt từ bất kỳ vị trí an toàn nào"
    }
  },

  // ==========================================
  // ABYSS (BẢN ĐỒ MỚI NHẤT VALORANT)
  // ==========================================
  {
    id: "sova-abyss-a-reveal",
    title: "Recon Bolt: Quét Toàn Bộ A Site & A Spire từ A Spawn",
    map: "Abyss",
    mapSplash: "https://media.valorant-api.com/maps/224b0a95-4954-f17b-0e44-f99232d3b433/splash.png",
    agent: "Sova",
    agentRole: "Initiator",
    agentIcon: "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png",
    site: "A",
    side: "Attacker",
    abilityName: "Recon Bolt (Mũi Tên Do Thám)",
    abilityKey: "E",
    abilityIcon: "🎯",
    type: "Recon",
    difficulty: "Trung Bình",
    description: "Mũi tên xuyên vực thẳm Abyss cắm trên đỉnh tháp A Spire, soi sáng mọi góc nấp tử thần trước khi đội nhảy qua hố vực.",
    standingPos: "Đứng tựa mép gờ đá A Spawn nhìn về hố vực thẳm",
    aimMarker: "Căn góc icon Shock Dart (Q) chạm mép tinh thể phát sáng A Spire",
    powerBounce: "2 Vạch Lực • 0 Nảy",
    landingZone: "Đỉnh tháp tinh thể A Spire, phủ 100% tầm nhìn A Site",
    proPlayer: "TenZ / t3xture",
    tags: ["Abyss Meta", "New Map", "Abyss God Lineup"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng chân",
        instruction: "Tiến ra mép đá A Spawn, đứng tựa sát vào khối đá xanh phát sáng.",
        hudCue: "Mép đá A Spawn",
        visualType: "stand",
        callout: "A Spawn Crystal",
        hudTargetX: 45,
        hudTargetY: 68,
        targetPointLabel: "Khối đá xanh A Spawn"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Ngắm lên đỉnh tháp tinh thể A Spire, căn góc phải icon Q vào chóp nhọn phát sáng.",
        hudCue: "Góc icon Q chạm chóp tinh thể",
        visualType: "aim",
        callout: "A Spire Crystal Peak",
        hudTargetX: 60,
        hudTargetY: 20,
        targetPointLabel: "Đỉnh tháp tinh thể A Spire",
        hudElementHighlight: "Góc trên bên phải Icon Shock Dart (Q)"
      },
      {
        stepNumber: 3,
        title: "Kéo lực",
        instruction: "Giữ chuột trái kéo đúng 2 vạch lực (2 Bars) rồi buông tay.",
        hudCue: "2 Bars Power • 0 Bounce",
        visualType: "throw",
        callout: "2 Bars Launch",
        hudTargetX: 60,
        hudTargetY: 20,
        targetPointLabel: "Kéo 2 Vạch Lực"
      },
      {
        stepNumber: 4,
        title: "Quét toàn bộ Site",
        instruction: "Mũi tên bay qua khoảng không vực thẳm và đáp trên đỉnh tháp, quét lộ diện toàn bộ kẻ địch giữ A Site.",
        hudCue: "Quét 100% A Site & A Bridge",
        visualType: "land",
        callout: "A Spire Peak",
        hudTargetX: 76,
        hudTargetY: 36,
        targetPointLabel: "Đỉnh tháp A Spire trên cao"
      }
    ],
    visualHudAlignment: {
      reticleType: "ability_icon",
      targetFeature: "Chóp tinh thể phát sáng A Spire",
      hudElement: "Biểu tượng Shock Dart (Q)",
      movementNote: "Đứng yên bắn, cẩn thận không bước hụt chân xuống vực"
    }
  },
  {
    id: "brimstone-abyss-a-molly",
    title: "Molly Post-Plant A Default từ Cầu Nối A Bridge",
    map: "Abyss",
    mapSplash: "https://media.valorant-api.com/maps/224b0a95-4954-f17b-0e44-f99232d3b433/splash.png",
    agent: "Brimstone",
    agentRole: "Controller",
    agentIcon: "https://media.valorant-api.com/agents/9f0d8ba9-4140-b941-57d3-a7ad57c6b417/displayicon.png",
    site: "A",
    side: "Post-Plant",
    abilityName: "Incendiary (Lựu Đạn Lửa)",
    abilityKey: "Q",
    abilityIcon: "🔥",
    type: "Molly/Damage",
    difficulty: "Dễ",
    description: "Lineup thiêu cháy vị trí đặt Spike A Default trên bản đồ Abyss, giữ round thắng clutch an toàn tuyệt đối từ khoảng cách xa.",
    standingPos: "Đứng kẹt góc lan can sắt đầu cầu A Bridge",
    aimMarker: "Căn góc dưới thanh đạn súng trùng với đỉnh chóp đá treo Abyss",
    powerBounce: "Đứng yên bắn chuột trái",
    landingZone: "Nổ trúng tâm khu vực đặt bom A Default",
    proPlayer: "Zellsis",
    tags: ["Abyss Molly", "Post-Plant", "Clutch God"],
    steps: [
      {
        stepNumber: 1,
        title: "Vị trí đứng",
        instruction: "Sau khi đặt Spike tại A Default, lùi về đầu cầu A Bridge và nép sát lan can sắt.",
        hudCue: "Kẹt góc lan can A Bridge",
        visualType: "stand",
        callout: "A Bridge Railing",
        hudTargetX: 46,
        hudTargetY: 66,
        targetPointLabel: "Lan can sắt đầu cầu A Bridge"
      },
      {
        stepNumber: 2,
        title: "Điểm căn",
        instruction: "Nhìn lên chóp đá treo lơ lửng trên trần hang, đưa góc dưới thanh đạn HUD vào chóp đá.",
        hudCue: "Góc thanh đạn chạm chóp đá",
        visualType: "aim",
        callout: "Hanging Stalactite",
        hudTargetX: 56,
        hudTargetY: 24,
        targetPointLabel: "Chóp đá thạch nhũ treo trên cao",
        hudElementHighlight: "Góc dưới thanh đạn HUD (Ammo HUD)"
      },
      {
        stepNumber: 3,
        title: "Bắn đạn",
        instruction: "Bấm chuột trái bắn lựu đạn ngay khi nghe âm thanh gỡ Spike của đối phương.",
        hudCue: "Thời gian bay: 5.2 giây",
        visualType: "throw",
        callout: "Molly Arc",
        hudTargetX: 56,
        hudTargetY: 24,
        targetPointLabel: "Bắn chuột trái"
      },
      {
        stepNumber: 4,
        title: "Thiêu rụi góc đặt",
        instruction: "Lửa bao phủ toàn bộ ô đặt bom A Default trong 8 giây, đảm bảo chắc chắn thắng vòng đấu.",
        hudCue: "Cháy 100% góc Spike",
        visualType: "land",
        callout: "A Default Abyss",
        hudTargetX: 70,
        hudTargetY: 52,
        targetPointLabel: "A Site Default Spike Area"
      }
    ],
    visualHudAlignment: {
      reticleType: "hud_bar",
      targetFeature: "Chóp đá thạch nhũ Abyss",
      hudElement: "Thanh đạn súng (Ammo Counter HUD)",
      movementNote: "Đứng yên bắn, không di chuyển"
    }
  }
];

export const CUSTOM_GAME_COMMANDS = [
  {
    title: "Chế Độ Bay Vượt Địa Hình (Ghost Mode)",
    description: "Cho phép bay tự do xuyên tường, tiếp cận điểm rơi hoặc kiểm tra góc căn nhanh chóng.",
    shortcut: "Bật trong Settings Cheats → Gán phím tắt ví dụ: [V]"
  },
  {
    title: "Vô Hạn Chiêu Thức (Infinite Abilities)",
    description: "Bật để liên tục bắn tên Sova, ném Molly Brimstone hoặc đặt bẫy Cypher mà không lo hết skill.",
    shortcut: "Cheats: Infinite Abilities [ON]"
  },
  {
    title: "Dừng Thời Gian Vòng Đấu (Pause Match Timer)",
    description: "Đóng băng thời gian trận đấu, thoải mái tìm góc căn ngắm và thử nghiệm pixel mới.",
    shortcut: "Cheats: Pause Match Timer [ON]"
  },
  {
    title: "Hiện Quỹ Đạo Đạn & Skill (Show Trajectory)",
    description: "Vẽ đường bay của mũi tên hoặc lựu đạn trên bản đồ mini để nhìn trực quan điểm rơi.",
    shortcut: "Bật trong Settings Mini-map Preview"
  }
];
