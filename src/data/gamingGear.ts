import { GamingGearItem } from "./proTypes";

export const GEAR_DATABASE: GamingGearItem[] = [
  // ==========================================
  // --- CHUỘT THI ĐẤU & DỮ LIỆU ELOSHAPES ---
  // ==========================================
  {
    id: "gear-mouse-razer-viper-v3-pro",
    name: "Razer Viper V3 Pro (8000Hz Wireless)",
    brand: "Razer",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3890000,
    priceFormatted: "3.890.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng siêu nhẹ 54g (Không đục lỗ)",
      "Sensor Focus Pro 35K Gen-2 (35.000 DPI / 750 IPS)",
      "Kèm sẵn HyperPolling Wireless Dongle 8000Hz",
      "Optical Mouse Switches Gen-3 (Tuổi thọ 90 triệu click)"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 127.1, width: 63.9, height: 39.9 },
      weightGrams: 54,
      sensor: "Razer Focus Pro 35K Optical Gen-2",
      maxPollingRate: "8000 Hz Wireless Native",
      connectivity: "2.4GHz Razer HyperSpeed & Type-C Speedflex",
      batteryLife: "Lên tới 95 giờ (ở 1000Hz) / 17 giờ (ở 8000Hz)",
      coating: "Smooth Matte Esports Coating (Kháng mồ hôi)",
      handSuitability: "Tay vừa đến lớn (17.5cm - 20.5cm)",
      comparableMice: ["Logitech GPX 2", "ZOWIE FK1-C", "Finalmouse ULX Lion"]
    },
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      grips: ["claw", "palm", "fingertip"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Sentinel", "Initiator", "Flex"]
    },
    highlightReason: "Chuột thi đấu #1 VCT 2024/2025: Chiếm hơn 42% tuyển thủ tại các giải đấu Masters & Champions. Form đối xứng công thái học tối ưu độ ổn định khi Flick.",
    proUsers: ["TenZ", "zekken", "t3xture", "Wo0t", "johnqt", "RieNs", "Benjyfishy"],
    rating: 9.9
  },
  {
    id: "gear-mouse-gpx2",
    name: "Logitech G PRO X Superlight 2 (LIGHTSPEED 4K/8K)",
    brand: "Logitech G",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3490000,
    priceFormatted: "3.490.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng 60g chuẩn mực thi đấu toàn cầu",
      "Sensor HERO 2 (44.000 DPI / 888 IPS)",
      "Hỗ trợ nâng cấp Firmware Polling Rate 4000Hz - 8000Hz",
      "LIGHTFORCE Hybrid Optical-Mechanical Switches"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 125.0, width: 63.5, height: 40.0 },
      weightGrams: 60,
      sensor: "Logitech HERO 2 Sensor",
      maxPollingRate: "4000 Hz / 8000 Hz Wireless Update",
      connectivity: "LIGHTSPEED Wireless & USB-C",
      batteryLife: "95 giờ liên tục (ở 1000Hz)",
      coating: "Logitech Fine Matte Shell (Bám tay tự nhiên)",
      handSuitability: "Phù hợp mọi kích cỡ bàn tay (16.5cm - 21cm)",
      comparableMice: ["Razer Viper V3 Pro", "VXE R1 Pro Max", "G-Wolves HTX"]
    },
    recommendedFor: {
      sensTypes: ["low", "mid"],
      grips: ["palm", "claw"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Controller", "Sentinel"]
    },
    highlightReason: "Huyền thoại bền bỉ an toàn tuyệt đối. Dáng cầm 'khoai tây' huyền thoại phù hợp với 99% dáng bàn tay, kết nối LIGHTSPEED sóng sạch không bao giờ rớt tín hiệu.",
    proUsers: ["aspas", "Chronicle", "something", "Derke", "Karon", "Alfajer", "MaKo"],
    rating: 9.8
  },
  {
    id: "gear-mouse-ninjutso-sora",
    name: "Ninjutso Sora V2 Wireless (39g Siêu Nhẹ)",
    brand: "Ninjutso",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 2290000,
    priceFormatted: "2.290.000đ",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b909?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng siêu thực 39g (Vỏ liền khối không đục lỗ)",
      "Mắt đọc PixArt PAW3395 (26.000 DPI)",
      "Hỗ trợ 8000Hz Polling Rate với Dongle bán rời",
      "Switch Quang Học Omron Optical Cực Đanh"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Back Hump",
      dimensionsMm: { length: 119.2, width: 59.8, height: 37.7 },
      weightGrams: 39,
      sensor: "PixArt PAW3395 Optical",
      maxPollingRate: "8000 Hz Wireless Ready",
      connectivity: "2.4GHz SnappyFire & USB-C",
      batteryLife: "80 giờ (ở 1000Hz)",
      coating: "Polycarbonate Featherweight Matte",
      handSuitability: "Tay nhỏ đến vừa (15cm - 18.5cm)",
      comparableMice: ["Pulsar X2H Mini", "Endgame Gear OP1", "Lamzu Atlantis Mini"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Chuột không dây không lỗ nhẹ nhất phân khúc (39g). Lưng vồng cao về sau tạo điểm tựa vững chắc cho ngón tay khi ghìm tâm One-Tap micro-adjustment.",
    proUsers: ["Primmie", "SScary", "Jinggg (thử nghiệm)"],
    rating: 9.7
  },
  {
    id: "gear-mouse-finalmouse-ulx",
    name: "Finalmouse UltralightX (Carbon Fiber Composite)",
    brand: "Finalmouse",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 4950000,
    priceFormatted: "4.950.000đ - 5.500.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng 31g (Cheetah) / 35g (Lion) / 37g (Tiger)",
      "Khung vỏ vật liệu Carbon Fiber Composite siêu cứng",
      "Hỗ trợ 8000Hz Wireless Polling Rate",
      "Omron Optical Switches tùy biến riêng"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 121.3, width: 56.8, height: 37.0 },
      weightGrams: 35,
      sensor: "PixArt PAW3395 Finalmouse Firmware",
      maxPollingRate: "8000 Hz Wireless",
      connectivity: "2.4GHz High-Speed Dongle & Type-C",
      batteryLife: "40 giờ (ở 8000Hz) / 100 giờ (ở 1000Hz)",
      coating: "Carbon Fiber Smooth Anodized",
      handSuitability: "Có 3 size: Nhỏ (Cheetah), Vừa (Lion), To (Tiger)",
      comparableMice: ["Starlight-12", "WLmouse Beast X", "Razer Viper Mini SE"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["fingertip", "claw"],
      handSizes: ["small", "medium", "large"],
      roles: ["Duelist", "Flex"]
    },
    highlightReason: "Đỉnh cao chuột siêu nhẹ thế giới: Thân vỏ sợi Carbon tổng hợp chịu lực cực tốt, trọng lượng chỉ ~35g giúp cổ tay lướt nhanh như bay không ma sát cản.",
    proUsers: ["TenZ (Từng dùng)", "Sayaplayer", "Demon1 (thử nghiệm)"],
    rating: 9.9
  },
  {
    id: "gear-mouse-atk-f1-ultimate",
    name: "ATK Blazing Sky F1 Ultimate (PAW3950 Ultra 38g)",
    brand: "ATK / VGN",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 1850000,
    priceFormatted: "1.850.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng chỉ 38g (Vỏ liền không lỗ)",
      "Sensor cờ đầu PixArt PAW3950 Ultra (30.000 DPI)",
      "Kèm Receiver 8000Hz Polling Rate trong hộp",
      "Switch quang học Omron Optical 70M clicks"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 118.2, width: 62.4, height: 38.8 },
      weightGrams: 38,
      sensor: "PixArt PAW3950 Ultra Flagship",
      maxPollingRate: "8000 Hz Wireless (Dongle Included)",
      connectivity: "2.4GHz Wireless & Wired Type-C",
      batteryLife: "75 giờ (ở 1000Hz)",
      coating: "Ice-feel Matte Finish chống mồ hôi tay",
      handSuitability: "Tay nhỏ và vừa (16cm - 18.5cm)",
      comparableMice: ["Razer Viper Mini", "Ninjutso Sora V2", "WLmouse Beast X Mini"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Quái vật thông số giá rẻ: Sở hữu mắt đọc PAW3950 Ultra cao cấp nhất thế giới, kèm sẵn 8K Dongle, 38g không đục lỗ chỉ với mức giá dưới 2 triệu.",
    proUsers: ["EDG Academy Pros", "Radiant Ranked Leaders"],
    rating: 9.8
  },
  {
    id: "gear-mouse-vxe-r1",
    name: "VXE Dragonfly R1 Pro Max",
    brand: "VGN / ATK",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 980000,
    priceFormatted: "980.000đ - 1.150.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng 54g (Pin 500mAh 150 giờ)",
      "Sensor PixArt PAW3395 (26.000 DPI / 650 IPS)",
      "Hỗ trợ 4000Hz Polling Rate với SmartSpeed Dongle",
      "Switch Huano Blue Shell Pink Dot đầm nảy"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 120.6, width: 64.0, height: 37.8 },
      weightGrams: 54,
      sensor: "PixArt PAW3395 Optical",
      maxPollingRate: "4000 Hz Wireless Ready",
      connectivity: "2.4GHz Wireless & Type-C",
      batteryLife: "150 giờ (bản Pro Max 500mAh)",
      coating: "Baby-skin Smooth Coating",
      handSuitability: "Tay nhỏ đến vừa (16cm - 19cm)",
      comparableMice: ["Pulsar X2V2", "Logitech G Pro X", "Ninjutso Sora"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Flex"]
    },
    highlightReason: "Ông vua chuột quốc dân tầm giá 1 triệu: Form cầm ôm tay tự nhiên, mắt đọc PAW3395 chuẩn Esports không gia tốc, pin trâu đến 150 giờ chơi liên tục.",
    proUsers: ["Rising Tier-2 & Challengers Stars", "Top Radiant Streamers"],
    rating: 9.6
  },
  {
    id: "gear-mouse-zowie-ec2-cw",
    name: "ZOWIE EC2-CW Wireless (Form Công Thái Học Huyền Thoại)",
    brand: "BenQ ZOWIE",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3690000,
    priceFormatted: "3.690.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Form công thái học Ergo tay phải #1 lịch sử Esports",
      "Trạm thu phát sóng Enhanced Wireless Receiver chống nhiễu sân khấu",
      "Trọng lượng 77g đầm tay ổn định tâm tuyệt đối",
      "Switch Huano cơ học bấm nảy giòn kiểm soát từng viên đạn"
    ],
    eloshapes: {
      shapeType: "Ergonomic - Right Handed",
      dimensionsMm: { length: 123.0, width: 65.0, height: 42.0 },
      weightGrams: 77,
      sensor: "PixArt PAW3370 Tuned by ZOWIE",
      maxPollingRate: "1000 Hz Esports Rock-solid",
      connectivity: "Enhanced Wireless Receiver & USB-C",
      batteryLife: "70 giờ liên tục",
      coating: "ZOWIE Black Matte Esports Grip",
      handSuitability: "Tay vừa đến lớn (17.5cm - 20cm)",
      comparableMice: ["Razer DeathAdder V3 Pro", "VAXEE Outset AX", "Pulsar Xlite V3"]
    },
    recommendedFor: {
      sensTypes: ["low", "mid"],
      grips: ["palm", "claw"],
      handSizes: ["medium", "large"],
      roles: ["Initiator", "Sentinel", "Controller"]
    },
    highlightReason: "Biểu tượng công thái học thi đấu: Dành cho những tay súng thích cảm giác cầm đầm chắc bàn tay, điểm tựa lòng bàn tay hoàn hảo triệt tiêu rung tay khi bắn áp lực cao.",
    proUsers: ["nAts", "Boaster", "d4v41", "Munchkin"],
    rating: 9.8
  },
  {
    id: "gear-mouse-zowie-u2",
    name: "ZOWIE U2 Wireless (Claw Grip Chuyên Sâu)",
    brand: "BenQ ZOWIE",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3890000,
    priceFormatted: "3.890.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng 60g tối ưu cho tuyển thủ Claw Grip",
      "Hông chuột thắt eo cong vào trong tăng lực kẹp ngón tay",
      "Enhanced Receiver chống nhiễu tín hiệu không dây đa tầng",
      "Mắt đọc PixArt PAW3395 chuẩn ZOWIE Driverless"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Back Hump",
      dimensionsMm: { length: 124.0, width: 65.0, height: 38.0 },
      weightGrams: 60,
      sensor: "PixArt PAW3395 Optical",
      maxPollingRate: "1000 Hz Esports Rock-Solid",
      connectivity: "Enhanced Wireless Dock & USB-C",
      batteryLife: "70 giờ",
      coating: "ZOWIE Classic Esports Fine Matte",
      handSuitability: "Tay vừa (17cm - 19.5cm)",
      comparableMice: ["ZOWIE S2-C", "Endgame Gear XM2we", "Lamzu Atlantis"]
    },
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      grips: ["claw"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Initiator", "Flex"]
    },
    highlightReason: "Tuyệt phẩm thiết kế hình học dành riêng cho thế cầm Claw Grip: Phần eo được nghiên cứu trong phòng thí nghiệm thể thao giúp nhấc chuột và flick ngang cực nhanh.",
    proUsers: ["Chronicle (thử nghiệm)", "Smoggy", "Tuyển thủ VCT Pacific"],
    rating: 9.8
  },
  {
    id: "gear-mouse-razer-deathadder-v3-pro",
    name: "Razer DeathAdder V3 Pro (Ergo King)",
    brand: "Razer",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3490000,
    priceFormatted: "3.490.000đ",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b909?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Trọng lượng 63g công thái học siêu nhẹ",
      "Sensor Focus Pro 30K Optical Sensor",
      "Hỗ trợ 8000Hz HyperPolling Wireless",
      "Optical Mouse Switches Gen-3"
    ],
    eloshapes: {
      shapeType: "Ergonomic - Right Handed",
      dimensionsMm: { length: 128.0, width: 68.0, height: 44.0 },
      weightGrams: 63,
      sensor: "Razer Focus Pro 30K Optical",
      maxPollingRate: "8000 Hz Wireless Capable",
      connectivity: "2.4GHz HyperSpeed & Type-C",
      batteryLife: "90 giờ (ở 1000Hz)",
      coating: "Smooth Touch Texture",
      handSuitability: "Tay vừa đến lớn (18cm - 21cm)",
      comparableMice: ["ZOWIE EC2-CW", "Pulsar Xlite V3", "VAXEE Outset"]
    },
    recommendedFor: {
      sensTypes: ["low", "mid"],
      grips: ["palm", "claw"],
      handSizes: ["medium", "large"],
      roles: ["Duelist", "Sentinel"]
    },
    highlightReason: "Vũ khí huyền thoại đồng hành cùng aspas lập kỷ lục Kills vô tiền khoáng hậu tại Champions và Masters. Dáng công thái học ôm trọn lòng bàn tay.",
    proUsers: ["aspas (Từng dùng vô địch Champions)", "Jinggg", "Cryocells"],
    rating: 9.8
  },
  {
    id: "gear-mouse-op1-8k",
    name: "Endgame Gear OP1 8k (Wired 8000Hz Precision King)",
    brand: "Endgame Gear",
    category: "mouse",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 1950000,
    priceFormatted: "1.950.000đ",
    image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Độ trễ gần như bằng 0 (Native 8000Hz Polling Rate có dây)",
      "Trọng lượng 50g dây siêu mềm FlexCord 5.0",
      "Sensor PixArt PAW3395 tinh chỉnh MCU Nuvoton",
      "Switch cơ học Kailh GX có thể tháo lắp nóng (Hot-swap)"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Back Hump",
      dimensionsMm: { length: 118.2, width: 60.5, height: 37.2 },
      weightGrams: 50,
      sensor: "PixArt PAW3395 MCU High-Speed",
      maxPollingRate: "8000 Hz Wired Native",
      connectivity: "Wired USB 2.0 High-Speed FlexCord",
      batteryLife: "Không dùng pin (Có dây)",
      coating: "Endgame Gear Seamless Dry Grip",
      handSuitability: "Tay nhỏ đến vừa (16cm - 19cm)",
      comparableMice: ["ZOWIE ZA13-C", "Ninjutso Sora V2", "Razer Viper Mini"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["claw", "fingertip"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Flex"]
    },
    highlightReason: "Chuột có độ trễ ngõ vào thấp nhất lịch sử đo đạc: Thân hẹp giúp ngón tay kiểm soát độ giật từng pixel, là vũ khí ưa thích của các chuyên gia Aim Lab thế giới.",
    proUsers: ["Aim Lab World Record Holders", "VCT Challengers Top Fraggers"],
    rating: 9.9
  },
  {
    id: "gear-mouse-wlmouse-beast-x",
    name: "WLmouse Beast X 8K (Hợp Kim Magie Siêu Nhẹ 39g)",
    brand: "WLmouse",
    category: "mouse",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3690000,
    priceFormatted: "3.690.000đ",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Vỏ hợp kim Magie (Magnesium Alloy) gia công CNC tinh xảo",
      "Trọng lượng 39g siêu nhẹ thoáng mát tay",
      "Mắt đọc PixArt PAW3395 kèm Cat Dongle 8K độc đáo",
      "Optical TTC Nihil switches phản hồi tức thì"
    ],
    eloshapes: {
      shapeType: "Symmetrical - Low Hump",
      dimensionsMm: { length: 122.0, width: 62.0, height: 37.0 },
      weightGrams: 39,
      sensor: "PixArt PAW3395 Optical",
      maxPollingRate: "8000 Hz Wireless (Custom Screen Dongle)",
      connectivity: "2.4GHz Wireless & Type-C",
      batteryLife: "60 giờ (ở 1000Hz)",
      coating: "Metallic Anodized Magnesium",
      handSuitability: "Tay nhỏ đến vừa (16.5cm - 19cm)",
      comparableMice: ["Finalmouse Starlight-12", "Razer Viper Mini SE", "ATK F1"]
    },
    recommendedFor: {
      sensTypes: ["mid", "high"],
      grips: ["fingertip", "claw"],
      handSizes: ["small", "medium"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Tuyệt phẩm chế tác hợp kim Magie: Bề mặt kim loại sờ mát lạnh, thông thoáng tay không đổ mồ hôi, phản xạ ngón tay tức thì không có cảm giác trễ.",
    proUsers: ["something (thử nghiệm)", "Rank 1 Asia Radiants"],
    rating: 9.7
  },

  // ==========================================
  // --- BÀN PHÍM CƠ TỪ TÍNH RAPID TRIGGER (HE) ---
  // ==========================================
  {
    id: "gear-kb-wooting-60he",
    name: "Wooting 60HE+ / 60HE v2 (Tachyon Mode)",
    brand: "Wooting (Netherlands)",
    category: "keyboard",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 4890000,
    priceFormatted: "4.890.000đ - 5.400.000đ",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Switch Lekker Hall Effect L45 / L60 từ tính",
      "Tính năng Rapid Trigger độ nhạy 0.1mm siêu việt",
      "Tachyon Mode độ trễ ngõ vào < 0.1ms",
      "Hỗ trợ Rappy Snappy & SOCD Snappy Tapping"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Controller", "Initiator", "Sentinel", "Flex"]
    },
    highlightReason: "Bàn phím Esports số 1 thế giới: Hơn 90% siêu sao VCT Champions sử dụng Wooting nhờ cơ chế dừng bước Counter-strafe nhanh hơn phím cơ truyền thống 30-50ms.",
    proUsers: ["TenZ", "ZmjjKK", "zekken", "t3xture", "f0rsakeN", "Chronicle", "Wo0t", "Derke", "Benjyfishy"],
    rating: 10.0
  },
  {
    id: "gear-kb-drunkdeer-a75",
    name: "DrunkDeer A75 / G65 Magnetic Switch",
    brand: "DrunkDeer",
    category: "keyboard",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 1850000,
    priceFormatted: "1.850.000đ - 2.150.000đ",
    image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Switch từ tính Hall Effect nhận diện điểm tiếp xúc 0.2mm - 3.8mm",
      "Hỗ trợ Rapid Trigger thời gian thực",
      "Layout 75% có cụm phím điều hướng và núm xoay Volume",
      "Thời gian phản hồi 1ms siêu tốc"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Flex", "Initiator"]
    },
    highlightReason: "Lựa chọn Rapid Trigger quốc dân dưới 2 triệu: Giúp người chơi dừng bước nhả đạn tức thì không bị trôi bước di chuyển.",
    proUsers: ["APAC Challengers Stars", "Radiant Grinders"],
    rating: 9.6
  },
  {
    id: "gear-kb-razer-huntsman-v3-pro-tkl",
    name: "Razer Huntsman V3 Pro TKL (Analog Optical Gen-2)",
    brand: "Razer",
    category: "keyboard",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 4790000,
    priceFormatted: "4.790.000đ",
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Razer Gen-2 Analog Optical Switches thế hệ mới",
      "Rapid Trigger điều chỉnh từng 0.1mm từ 0.1 đến 4.0mm",
      "Đèn báo LED hiển thị trực quan mức hành trình phím",
      "Snap Tap (SOCD) chế độ ưu tiên phím di chuyển mới nhất"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Initiator"]
    },
    highlightReason: "Bàn phím thi đấu chính thức của Sentinels & Gen.G: Switch quang học analog thế hệ mới của Razer cho độ bền vô hạn và cảm giác gõ đầm chắc.",
    proUsers: ["Munchkin", "Meteor", "Lakia", "Sentinels Players"],
    rating: 9.8
  },

  // ==========================================
  // --- LÓT CHUỘT THI ĐẤU (MOUSEPADS) ---
  // ==========================================
  {
    id: "gear-pad-artisan-zero",
    name: "Artisan Ninja FX Zero Soft / XSoft (Nhật Bản)",
    brand: "Artisan Japan",
    category: "mousepad",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 1650000,
    priceFormatted: "1.650.000đ - 1.850.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Bề mặt sợi Microfiber dệt xoắn thủ công tại Kobe Nhật Bản",
      "Đế bọt xốp PORON chống trượt bám dính như keo lên mặt bàn",
      "Độ lún Soft/XSoft hỗ trợ lực hãm vi mô khi nhấn tay",
      "Bo viền thấp ngang bằng bề mặt không cọ xát cổ tay"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Flex", "Initiator", "Sentinel"]
    },
    highlightReason: "Lót chuột số 1 thế giới được hơn 70% VCT Pros tin dùng. Độ cân bằng hoàn hảo giữa tốc độ lướt mượt mà và khả năng ghìm tâm tức thì khi nhấn nhẹ ngón tay.",
    proUsers: ["TenZ", "zekken", "Chronicle", "CHICHOO", "Wo0t", "RieNs", "Smoggy"],
    rating: 10.0
  },
  {
    id: "gear-pad-lgg-saturn-pro",
    name: "Lethal Gaming Gear Saturn Pro XSoft",
    brand: "LGG (USA)",
    category: "mousepad",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 1550000,
    priceFormatted: "1.550.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Đế bọt xốp Poron cao cấp Nhật Bản",
      "Vải dệt mịn 100% không xước da tay",
      "Độ ma sát tĩnh thấp lướt êm dịu",
      "Kích thước XL 490x420mm và XXL 500x500mm"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      roles: ["Duelist", "Sentinel"]
    },
    highlightReason: "Đối thủ cạnh tranh trực tiếp 1:1 với Artisan Zero. Bề mặt siêu mịn không bám lông bụi, kiểm soát đường đạn Vandal One-Tap cực kỳ dính tâm.",
    proUsers: ["johnqt", "Demon1", "Karon", "Ethan"],
    rating: 9.8
  },
  {
    id: "gear-pad-qck-heavy",
    name: "SteelSeries QcK Heavy (Dày 6mm Cổ Điển)",
    brand: "SteelSeries",
    category: "mousepad",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 690000,
    priceFormatted: "690.000đ",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Độ dày 6mm đầm êm cổ tay triệt tiêu rung mặt bàn",
      "Bề mặt vải Micro-woven Cloth sợi dệt dày",
      "Stopping Power (Lực dừng) Cực Cao",
      "Đế cao su thiên nhiên chống xê dịch"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid"],
      roles: ["Operator Sniper", "Sentinel", "Tactical Anchor"]
    },
    highlightReason: "Lót chuột Control huyền thoại dành cho các tay súng bắn Sens Chậm (Low Sens): Độ dày 6mm êm tay, lực dừng cao giúp ghim tâm One-Tap đầu không bị trôi.",
    proUsers: ["Demon1", "ScreaM", "nAts", "crashies"],
    rating: 9.5
  },

  // ==========================================
  // --- TAI NGHE & IEMS (AUDIO ESPORTS) ---
  // ==========================================
  {
    id: "gear-audio-sennheiser-ie200",
    name: "Sennheiser IE 200 (IEM Thi Đấu Sân Khấu)",
    brand: "Sennheiser",
    category: "audio",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 3290000,
    priceFormatted: "3.290.000đ",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Driver TrueResponse 7mm độc quyền phát triển tại Đức",
      "Trọng lượng siêu nhẹ chỉ 4g mỗi bên tai",
      "Âm hình 3D Soundstage định vị chính xác khoảng cách bước chân",
      "Dual-tuning eartip cho phép chỉnh âm bass mở/kín"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Controller", "Flex"]
    },
    highlightReason: "Lựa chọn số 1 của các tuyển thủ VCT trên sân khấu thi đấu cách âm. Đeo nhiều giờ liền không đau vành tai, tái hiện âm thanh bước chân và tiếng gỡ Spike chuẩn xác từng cm.",
    proUsers: ["TenZ", "Karon", "SScary", "Chronicle", "t3xture"],
    rating: 9.9
  },
  {
    id: "gear-audio-moondrop-chu",
    name: "Moondrop Chu II / Tangzu Wan'er S.G",
    brand: "Moondrop / Tangzu",
    category: "audio",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 490000,
    priceFormatted: "490.000đ - 550.000đ",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Màng loa Dynamic Driver hợp kim Al-Mg (Nhôm-Magie)",
      "Âm treble trong trẻo nghe rõ tiếng kỹ năng lén lút",
      "Dây rời 2-Pin 0.78mm dễ dàng nâng cấp dây mic",
      "Vỏ kim loại Zinc Alloy cách âm thụ động tốt"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Initiator", "Controller"]
    },
    highlightReason: "Lựa chọn IEM quốc dân ngon-bổ-rẻ dưới 500k. Chi tiết âm thanh tách bạch vượt trội hoàn toàn so với các loại tai nghe chụp tai cồng kềnh cùng tầm giá.",
    proUsers: ["Rank Radiant Grinders", "VCT Challengers Talents"],
    rating: 9.5
  },

  // ==========================================
  // --- MÀN HÌNH THI ĐẤU ESPORTS (MONITORS) ---
  // ==========================================
  {
    id: "gear-mon-zowie-xl2566k",
    name: "BenQ ZOWIE XL2566K 360Hz DyAc+ (Esports King)",
    brand: "BenQ ZOWIE",
    category: "monitor",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 16500000,
    priceFormatted: "16.500.000đ",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Tần số quét 360Hz Fast TN chuyên biệt thi đấu",
      "Công nghệ độc quyền DyAc+ (Dynamic Accuracy) chống nhòe",
      "Tính năng Black eQualizer & Color Vibrance làm nổi bật địch",
      "Shield che chắn hai bên chống ánh sáng và phân tâm"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Sentinel", "Initiator", "Controller", "Flex"]
    },
    highlightReason: "Màn hình tiêu chuẩn bắt buộc tại 100% sân khấu thi đấu chính thức của Riot Games (VALORANT Champions Tour). Công nghệ DyAc+ triệt tiêu bóng ma hoàn toàn khi spray súng.",
    proUsers: ["100% Tuyển thủ VCT Champions & Masters"],
    rating: 10.0
  },
  {
    id: "gear-mon-asus-pg248qp",
    name: "ASUS ROG Swift Pro PG248QP 540Hz (Esports-TN)",
    brand: "ASUS ROG",
    category: "monitor",
    tier: "flagship",
    tierLabel: "Cao Cấp (Flagship End-game)",
    priceVnd: 22900000,
    priceFormatted: "22.900.000đ",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Tần số quét kỷ lục thế giới 540Hz (Overclock)",
      "Tấm nền Esports-TN (E-TN) thời gian phản hồi 0.2ms",
      "Công nghệ ULMB 2 (Ultra Low Motion Blur)",
      "Bộ vi xử lý NVIDIA G-SYNC & Reflex Analyzer tích hợp"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Flex"]
    },
    highlightReason: "Tần số quét 540Hz đỉnh cao công nghệ: Độ mượt mắt kinh ngạc, triệt tiêu độ trễ hệ thống xuống mức thấp nhất thế giới cho các tay súng Duelist phản xạ cực đại.",
    proUsers: ["demon1 (thử nghiệm)", "TenZ (Bootcamp Setup)"],
    rating: 9.9
  },
  {
    id: "gear-mon-viewsonic-240",
    name: "ViewSonic XG2431 240Hz (PureXP Blur Busters)",
    brand: "ViewSonic",
    category: "monitor",
    tier: "mid",
    tierLabel: "Tầm Trung (Mid-Range)",
    priceVnd: 6890000,
    priceFormatted: "6.890.000đ",
    image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80",
    specs: [
      "Tần số quét 240Hz Fast IPS màu sắc sống động",
      "Công nghệ khử nhòe PureXP chứng nhận Blur Busters Approved",
      "Độ trễ 0.5ms MPRT",
      "Màu sắc 100% sRGB và góc nhìn rộng"
    ],
    recommendedFor: {
      sensTypes: ["low", "mid", "high"],
      roles: ["Duelist", "Initiator"]
    },
    highlightReason: "Màn hình 240Hz tầm giá dưới 7 triệu có độ trong trẻo chuyển động tốt nhất nhờ công nghệ chớp đèn khử bóng mờ Blur Busters danh tiếng.",
    proUsers: ["Esports Training Centers", "Radiant Ranked Pros"],
    rating: 9.6
  }
];
