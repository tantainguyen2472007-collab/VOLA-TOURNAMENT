import { Agent } from "../types";
import { VALORANT_AGENTS } from "../data/valorant";

export type TacticalArchetype = "atk" | "def" | "tournament" | "recon" | "ranked";

export interface TacticalArchetypeInfo {
  id: TacticalArchetype;
  name: string;
  shortLabel: string;
  tagline: string;
  description: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  targetRoleRatio: {
    Duelist: number;
    Initiator: number;
    Controller: number;
    Sentinel: number;
  };
}

// Map-specific meta agent preferences (Tier S picks for each map)
export const MAP_META_PREFERENCES: Record<string, {
  name: string;
  bestControllers: string[];
  bestInitiators: string[];
  bestSentinels: string[];
  bestDuelists: string[];
  mapNotes: string;
}> = {
  ascent: {
    name: "Ascent",
    bestControllers: ["omen", "astra", "clove"],
    bestInitiators: ["sova", "kayo", "fade"],
    bestSentinels: ["killjoy", "cypher", "deadlock"],
    bestDuelists: ["jett", "reyna", "iso"],
    mapNotes: "Bản đồ quốc dân tận dụng tối đa Sova recon xuyên tường mỏng và Killjoy khóa chặt B Site."
  },
  bind: {
    name: "Bind",
    bestControllers: ["brimstone", "viper"],
    bestInitiators: ["fade", "skye", "gekko"],
    bestSentinels: ["cypher", "deadlock", "vyse"],
    bestDuelists: ["raze", "yoru", "jett"],
    mapNotes: "Không có Mid, cổng teleport xoay chuyển cực nhanh, ưu tiên Raze bay lượn và Brimstone/Viper smoke bao quát."
  },
  haven: {
    name: "Haven",
    bestControllers: ["omen", "astra", "clove"],
    bestInitiators: ["sova", "breach", "fade"],
    bestSentinels: ["cypher", "killjoy"],
    bestDuelists: ["jett", "neon", "reyna"],
    mapNotes: "3 Bombsite rộng lớn đòi hỏi Cypher giăng bẫy 2 đầu, Breach dọn góc và Omen linh hoạt tầm khói."
  },
  lotus: {
    name: "Lotus",
    bestControllers: ["omen", "clove", "viper"],
    bestInitiators: ["fade", "breach", "gekko"],
    bestSentinels: ["killjoy", "cypher", "vyse"],
    bestDuelists: ["raze", "neon", "jett"],
    mapNotes: "Cửa xoay và 3 Bombsite tạo điều kiện cho Fade/Breach dồn hiệu ứng CC và Raze bùng nổ Cửa A."
  },
  split: {
    name: "Split",
    bestControllers: ["omen", "astra", "viper"],
    bestInitiators: ["skye", "breach", "kayo"],
    bestSentinels: ["cypher", "deadlock", "sage"],
    bestDuelists: ["raze", "jett", "reyna"],
    mapNotes: "Dây đu và hành lang hẹp Mid/Vent ưu tiên Raze ném bom, Breach chấn động và Cypher/Sage dựng tường chặn."
  },
  sunset: {
    name: "Sunset",
    bestControllers: ["omen", "clove", "brimstone"],
    bestInitiators: ["fade", "breach", "gekko", "sova"],
    bestSentinels: ["cypher", "deadlock", "killjoy"],
    bestDuelists: ["neon", "raze", "jett"],
    mapNotes: "Khu vực B Market vuông vức và A Main góc hẹp biến Cypher, Breach và Neon thành bộ ba thống trị."
  },
  abyss: {
    name: "Abyss",
    bestControllers: ["omen", "astra", "viper"],
    bestInitiators: ["sova", "fade", "gekko"],
    bestSentinels: ["cypher", "killjoy", "vyse"],
    bestDuelists: ["jett", "yoru", "neon"],
    mapNotes: "Bản đồ không rào chắn rơi vực, Jett/Yoru/Omen cơ động bay nhảy qua hố và Sova recon thông thoáng."
  },
  breeze: {
    name: "Breeze",
    bestControllers: ["viper", "harbor"],
    bestInitiators: ["sova", "kayo", "skye"],
    bestSentinels: ["cypher", "chamber"],
    bestDuelists: ["jett", "yoru", "iso"],
    mapNotes: "Bản đồ rộng mênh mông, bắt buộc phải có tường độc dài của Viper và súng ngắm Op của Jett/Chamber."
  },
  icebox: {
    name: "Icebox",
    bestControllers: ["viper", "harbor", "omen"],
    bestInitiators: ["sova", "fade", "gekko"],
    bestSentinels: ["killjoy", "sage", "deadlock"],
    bestDuelists: ["jett", "reyna", "raze"],
    mapNotes: "Độ cao z-axis và ống trượt A Site cực hợp cho Viper toxic screen, Sova recon B Green và Sage cắm bom an toàn."
  },
  pearl: {
    name: "Pearl",
    bestControllers: ["astra", "viper", "harbor"],
    bestInitiators: ["fade", "skye", "sova"],
    bestSentinels: ["killjoy", "cypher"],
    bestDuelists: ["jett", "raze", "phoenix"],
    mapNotes: "Đường B Long dài và Mid Connector chằng chịt, ưu tiên tường khói dài, Killjoy lock B và Fade quét A Art."
  },
  fracture: {
    name: "Fracture",
    bestControllers: ["brimstone", "omen", "viper"],
    bestInitiators: ["breach", "fade", "kayo"],
    bestSentinels: ["cypher", "killjoy", "deadlock"],
    bestDuelists: ["raze", "neon", "jett"],
    mapNotes: "Bản đồ kẹp thịt chữ H từ 2 đầu, Breach chấn động toàn bộ hành lang và Raze/Neon tràn vào từ Zip."
  }
};

export const TACTICAL_ARCHETYPES: Record<TacticalArchetype, TacticalArchetypeInfo> = {
  atk: {
    id: "atk",
    name: "Team Mạnh Tấn Công (Heavy ATK)",
    shortLabel: "Mạnh ATK",
    tagline: "Chiếm Site thần tốc, mở góc quyết liệt & dồn hỏa lực áp đảo",
    description: "Tập trung vào các Duelist cơ động cao, Flash/Stun mở đường và Controller smoke nhanh để tràn vào bombsite trước khi đối thủ kịp chuẩn bị.",
    color: "text-rose-400",
    badgeBg: "bg-rose-500/10",
    badgeBorder: "border-rose-500/30",
    targetRoleRatio: { Duelist: 2, Initiator: 1, Controller: 1, Sentinel: 1 },
  },
  def: {
    id: "def",
    name: "Team Mạnh Phòng Thủ (Heavy DEF)",
    shortLabel: "Mạnh DEF",
    tagline: "Khóa chặt Site, câu giờ đỉnh cao & rải bẫy chặn mọi đợt đẩy",
    description: "Sở hữu hệ thống Sentinel giăng bẫy dày đặc, tường/smoke độc câu giờ và khả năng Retake có kiểm soát chặt chẽ.",
    color: "text-emerald-400",
    badgeBg: "bg-emerald-500/10",
    badgeBorder: "border-emerald-500/30",
    targetRoleRatio: { Duelist: 1, Initiator: 1, Controller: 1, Sentinel: 2 },
  },
  tournament: {
    id: "tournament",
    name: "Team Bắn Giải (VCT Tournament Meta)",
    shortLabel: "Bắn Giải VCT",
    tagline: "Chuẩn bài bản Esports chuyên nghiệp, công thủ toàn diện",
    description: "Đội hình cân bằng hoàn hảo theo meta VCT Champions: 1 Main Entry + 1 Recon Info + 1 Crowd Control Flash + 1 Controller + 1 Sentinel Anchor.",
    color: "text-accent",
    badgeBg: "bg-accent/10",
    badgeBorder: "border-accent/30",
    targetRoleRatio: { Duelist: 1, Initiator: 2, Controller: 1, Sentinel: 1 },
  },
  recon: {
    id: "recon",
    name: "Team Lấy Thông Tin (Recon & Info)",
    shortLabel: "Lấy Thông Tin",
    tagline: "Xóa sạch góc tối bản đồ, phát hiện vị trí địch trước khi giao tranh",
    description: "Sử dụng bộ đôi Initiator quét map từ xa kết hợp camera/bẫy phát hiện để không bao giờ bị đối phương bắt lẻ hay phục kích.",
    color: "text-cyan-400",
    badgeBg: "bg-cyan-500/10",
    badgeBorder: "border-cyan-500/30",
    targetRoleRatio: { Duelist: 1, Initiator: 2, Controller: 1, Sentinel: 1 },
  },
  ranked: {
    id: "ranked",
    name: "Team Bắn Rank SoloQ (Fragging & Carry)",
    shortLabel: "Bắn Rank SoloQ",
    tagline: "Tự cung tự cấp, hồi sinh gánh team & thắng mọi kèo đấu súng 1v1",
    description: "Các đặc vụ có khả năng tự hồi máu, tự hồi sinh, đấu súng cơ động cao và dễ dàng tỏa sáng cá nhân trong các trận đấu Rank cạnh tranh.",
    color: "text-purple-400",
    badgeBg: "bg-purple-500/10",
    badgeBorder: "border-purple-500/30",
    targetRoleRatio: { Duelist: 2, Initiator: 1, Controller: 1, Sentinel: 1 },
  },
};

export interface DetailedTeamEvaluation {
  score: number; // 0 - 100
  archetypeId: TacticalArchetype;
  stats: {
    attackPower: number;    // %
    defensePower: number;   // %
    infoGathering: number;  // %
    smokeControl: number;   // %
    clutchPotential: number;// %
  };
  keyStrengths: {
    title: string;
    detail: string;
  }[];
  keyWeaknesses: {
    title: string;
    detail: string;
  }[];
  tacticalAdvice: string[];
  recommendedMaps: {
    name: string;
    reason: string;
  }[];
}

// Categorize agent pools
const ATK_DUELISTS = ["jett", "raze", "neon", "reyna", "yoru"];
const ATK_INITIATORS = ["breach", "skye", "kayo", "gekko"];
const ATK_CONTROLLERS = ["omen", "clove", "brimstone"];
const ATK_FLEX = ["iso", "chamber", "fade", "clove"];

const DEF_SENTINELS = ["cypher", "killjoy", "deadlock", "vyse", "sage"];
const DEF_CONTROLLERS = ["viper", "astra", "brimstone", "omen"];
const DEF_INITIATORS = ["sova", "fade", "gekko"];
const DEF_DUELISTS = ["jett", "chamber", "iso", "raze"];

const TOURNAMENT_DUELISTS = ["jett", "raze", "neon"];
const TOURNAMENT_RECON = ["sova", "fade", "gekko"];
const TOURNAMENT_FLASH = ["breach", "kayo", "skye", "gekko"];
const TOURNAMENT_CONTROLLERS = ["omen", "viper", "astra", "brimstone"];
const TOURNAMENT_SENTINELS = ["cypher", "killjoy", "vyse"];

const RECON_INITIATORS = ["sova", "fade", "gekko", "skye"];
const RECON_SENTINELS = ["cypher", "killjoy", "chamber"];
const RECON_CONTROLLERS = ["astra", "omen", "harbor", "viper"];
const RECON_DUELISTS = ["jett", "iso", "reyna", "raze"];

const RANKED_DUELISTS = ["reyna", "jett", "iso", "phoenix", "raze", "neon"];
const RANKED_CONTROLLERS = ["clove", "omen", "brimstone"];
const RANKED_SENTINELS = ["chamber", "sage", "cypher"];
const RANKED_INITIATORS = ["skye", "gekko", "fade"];

function pickRandomUnique(poolIds: string[], count: number, excludeIds: Set<string>): Agent[] {
  const available = poolIds.filter(id => !excludeIds.has(id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  const selected: Agent[] = [];

  for (const id of shuffled) {
    if (selected.length >= count) break;
    const agentObj = VALORANT_AGENTS.find(a => a.id.toLowerCase() === id.toLowerCase());
    if (agentObj) {
      selected.push(agentObj);
      excludeIds.add(agentObj.id.toLowerCase());
    }
  }

  return selected;
}

/**
 * Generate a specialized 5-agent composition based on the chosen tactical archetype and optional selected map
 */
export function generateTacticalTeam(archetype: TacticalArchetype, mapId?: string): Agent[] {
  const chosen: Agent[] = [];
  const chosenIds = new Set<string>();

  const mapMeta = mapId && mapId !== "all" ? MAP_META_PREFERENCES[mapId.toLowerCase()] : null;

  // Build map-weighted agent pools
  const getPool = (basePool: string[], mapBest: string[] = []): string[] => {
    if (!mapMeta || mapBest.length === 0) return basePool;
    // Put map meta agents at the beginning to boost probability
    const priority = mapBest.filter(id => basePool.includes(id));
    const others = basePool.filter(id => !priority.includes(id));
    return [...priority, ...priority, ...others]; // double weight for map meta
  };

  const atkDuelists = getPool(ATK_DUELISTS, mapMeta?.bestDuelists);
  const atkInitiators = getPool(ATK_INITIATORS, mapMeta?.bestInitiators);
  const atkControllers = getPool(ATK_CONTROLLERS, mapMeta?.bestControllers);

  const defSentinels = getPool(DEF_SENTINELS, mapMeta?.bestSentinels);
  const defControllers = getPool(DEF_CONTROLLERS, mapMeta?.bestControllers);
  const defInitiators = getPool(DEF_INITIATORS, mapMeta?.bestInitiators);
  const defDuelists = getPool(DEF_DUELISTS, mapMeta?.bestDuelists);

  const tourDuelists = getPool(TOURNAMENT_DUELISTS, mapMeta?.bestDuelists);
  const tourRecon = getPool(TOURNAMENT_RECON, mapMeta?.bestInitiators);
  const tourFlash = getPool(TOURNAMENT_FLASH, mapMeta?.bestInitiators);
  const tourControllers = getPool(TOURNAMENT_CONTROLLERS, mapMeta?.bestControllers);
  const tourSentinels = getPool(TOURNAMENT_SENTINELS, mapMeta?.bestSentinels);

  const reconInitiators = getPool(RECON_INITIATORS, mapMeta?.bestInitiators);
  const reconSentinels = getPool(RECON_SENTINELS, mapMeta?.bestSentinels);
  const reconControllers = getPool(RECON_CONTROLLERS, mapMeta?.bestControllers);
  const reconDuelists = getPool(RECON_DUELISTS, mapMeta?.bestDuelists);

  const rankedDuelists = getPool(RANKED_DUELISTS, mapMeta?.bestDuelists);
  const rankedControllers = getPool(RANKED_CONTROLLERS, mapMeta?.bestControllers);
  const rankedSentinels = getPool(RANKED_SENTINELS, mapMeta?.bestSentinels);
  const rankedInitiators = getPool(RANKED_INITIATORS, mapMeta?.bestInitiators);

  if (archetype === "atk") {
    // 2 Duelists + 1 Initiator (Flash/Entry) + 1 Controller + 1 Flex
    chosen.push(...pickRandomUnique(atkDuelists, 2, chosenIds));
    chosen.push(...pickRandomUnique(atkInitiators, 1, chosenIds));
    chosen.push(...pickRandomUnique(atkControllers, 1, chosenIds));
    chosen.push(...pickRandomUnique([...ATK_FLEX, ...defSentinels], 1, chosenIds));
  } else if (archetype === "def") {
    // 2 Sentinels + 1 Controller (Stall) + 1 Initiator (Recon) + 1 Duelist/Flex
    chosen.push(...pickRandomUnique(defSentinels, 2, chosenIds));
    chosen.push(...pickRandomUnique(defControllers, 1, chosenIds));
    chosen.push(...pickRandomUnique(defInitiators, 1, chosenIds));
    chosen.push(...pickRandomUnique(defDuelists, 1, chosenIds));
  } else if (archetype === "tournament") {
    // 1 Main Entry + 1 Recon + 1 Flash/CC + 1 Controller + 1 Sentinel
    chosen.push(...pickRandomUnique(tourDuelists, 1, chosenIds));
    chosen.push(...pickRandomUnique(tourRecon, 1, chosenIds));
    chosen.push(...pickRandomUnique(tourFlash, 1, chosenIds));
    chosen.push(...pickRandomUnique(tourControllers, 1, chosenIds));
    chosen.push(...pickRandomUnique(tourSentinels, 1, chosenIds));
  } else if (archetype === "recon") {
    // 2 Recon Initiators + 1 Sentinel (Trap/Cam) + 1 Controller + 1 Duelist
    chosen.push(...pickRandomUnique(reconInitiators, 2, chosenIds));
    chosen.push(...pickRandomUnique(reconSentinels, 1, chosenIds));
    chosen.push(...pickRandomUnique(reconControllers, 1, chosenIds));
    chosen.push(...pickRandomUnique(reconDuelists, 1, chosenIds));
  } else if (archetype === "ranked") {
    // 2 Carry Duelists + 1 Combat Controller (Clove/Omen) + 1 Sentinel (Chamber/Sage) + 1 Self Initiator (Skye/Gekko)
    chosen.push(...pickRandomUnique(rankedDuelists, 2, chosenIds));
    chosen.push(...pickRandomUnique(rankedControllers, 1, chosenIds));
    chosen.push(...pickRandomUnique(rankedSentinels, 1, chosenIds));
    chosen.push(...pickRandomUnique(rankedInitiators, 1, chosenIds));
  }

  // Fallback if less than 5
  if (chosen.length < 5) {
    const remaining = VALORANT_AGENTS.filter(a => !chosenIds.has(a.id.toLowerCase()));
    const shuffledRem = [...remaining].sort(() => Math.random() - 0.5);
    while (chosen.length < 5 && shuffledRem.length > 0) {
      const extra = shuffledRem.pop()!;
      chosen.push(extra);
      chosenIds.add(extra.id.toLowerCase());
    }
  }

  return chosen.slice(0, 5);
}

/**
 * Detailed Assistant analysis: Strengths, Weaknesses, Tactical Advice & Map Matchups
 */
export function evaluateTeamComposition(agents: Agent[], archetype: TacticalArchetype, mapId?: string): DetailedTeamEvaluation {
  const names = agents.map(a => a.name.toLowerCase());
  const roles = agents.map(a => a.role);
  const mapMeta = mapId && mapId !== "all" ? MAP_META_PREFERENCES[mapId.toLowerCase()] : null;
  
  const duelistCount = roles.filter(r => r === "Duelist").length;
  const initiatorCount = roles.filter(r => r === "Initiator").length;
  const controllerCount = roles.filter(r => r === "Controller").length;
  const sentinelCount = roles.filter(r => r === "Sentinel").length;

  let attackPower = 50;
  let defensePower = 50;
  let infoGathering = 50;
  let smokeControl = 50;
  let clutchPotential = 50;

  // Calculate stats based on actual agents
  attackPower += duelistCount * 18 + (names.includes("breach") ? 15 : 0) + (names.includes("skye") ? 10 : 0);
  defensePower += sentinelCount * 20 + (names.includes("viper") ? 15 : 0) + (names.includes("cypher") ? 15 : 0);
  infoGathering += (names.includes("sova") ? 25 : 0) + (names.includes("fade") ? 22 : 0) + (names.includes("cypher") ? 18 : 0) + (names.includes("gekko") ? 15 : 0);
  smokeControl += controllerCount * 28 + (names.includes("viper") ? 10 : 0) + (names.includes("omen") ? 10 : 0);
  clutchPotential += (names.includes("clove") ? 20 : 0) + (names.includes("reyna") ? 18 : 0) + (names.includes("jett") ? 15 : 0) + (names.includes("omen") ? 12 : 0);

  // Clamp 10 - 98%
  attackPower = Math.min(98, Math.max(20, attackPower));
  defensePower = Math.min(98, Math.max(20, defensePower));
  infoGathering = Math.min(98, Math.max(15, infoGathering));
  smokeControl = Math.min(98, Math.max(15, smokeControl));
  clutchPotential = Math.min(98, Math.max(20, clutchPotential));

  const keyStrengths: { title: string; detail: string }[] = [];
  const keyWeaknesses: { title: string; detail: string }[] = [];
  const tacticalAdvice: string[] = [];
  const recommendedMaps: { name: string; reason: string }[] = [];

  // Evaluate strengths based on archetype and composition
  if (duelistCount >= 2) {
    keyStrengths.push({
      title: "Hỏa Lực Entry Tràn Site Cực Mạnh",
      detail: `Sở hữu ${duelistCount} Duelist (${agents.filter(a => a.role === "Duelist").map(a => a.name).join(", ")}) cho phép đội hình ép giao tranh chớp nhoáng, bẻ gãy tuyến phòng ngự đầu tiên của địch.`
    });
  } else if (duelistCount === 1) {
    keyStrengths.push({
      title: "Cân Bằng Vai Trò Chuẩn Meta Thi Đấu",
      detail: `1 Duelist (${agents.find(a => a.role === "Duelist")?.name}) đóng vai trò mũi nhọn mở đường, dành toàn bộ 4 vị trí còn lại cho tiện ích hỗ trợ, câu giờ và lấy thông tin.`
    });
  }

  if (sentinelCount >= 2) {
    keyStrengths.push({
      title: "Phòng Tuyến Bê Tông & Chặn Móc Hậu Tuyệt Đối",
      detail: `Double Sentinel (${agents.filter(a => a.role === "Sentinel").map(a => a.name).join(" + ")}) khóa chặt cả 2 bombsite khi phòng thủ và bảo vệ an toàn 100% đường sau lưng (Flank) khi tấn công.`
    });
  }

  if (names.includes("sova") || names.includes("fade") || names.includes("cypher")) {
    keyStrengths.push({
      title: "Nguồn Cung Cấp Thông Tin Thời Gian Thực",
      detail: "Khả năng quét bản đồ và định vị chính xác vị trí địch trước khi tiến hành Execute giúp giảm thiểu tối đa rủi ro bị bẫy hoặc sấy mù qua Smoke."
    });
  }

  if (controllerCount >= 1) {
    keyStrengths.push({
      title: "Kiểm Soát Tầm Nhìn & Cắt Đứt Góc Bắn Của Sniper",
      detail: `Smoke từ ${agents.filter(a => a.role === "Controller").map(a => a.name).join(", ")} đảm bảo che chắn toàn bộ góc AWP nguy hiểm tại Main và Choke points.`
    });
  }

  // Evaluate weaknesses
  if (controllerCount === 0) {
    keyWeaknesses.push({
      title: "CỰC KỲ NGUY HIỂM: Hoàn Toàn Không Có Smoker",
      detail: "Đội hình không có Smoke che góc. Địch chỉ cần dựng súng ngắm AWP kê thẳng Main là toàn đội sẽ gặp bế tắc khi tiến vào Site."
    });
  } else if (controllerCount === 1 && !names.includes("viper") && (names.includes("clove") || names.includes("brimstone"))) {
    keyWeaknesses.push({
      title: "Tầm Hoạt Động Smoke Bị Giới Hạn Ở Map Lớn",
      detail: "Smoke có phạm vi ngắn, gặp nhiều bất lợi trên các bản đồ rộng lớn (như Breeze, Lotus, Abyss) nếu phải hỗ trợ đồng đội ở Site đối diện."
    });
  }

  if (sentinelCount === 0) {
    keyWeaknesses.push({
      title: "Dễ Bị Địch Móc Hậu (Flank) Khi Tấn Công",
      detail: "Không có bẫy của Cypher hay Alarmbot của Killjoy canh chừng phía sau, toàn đội rất dễ bị đối phương Flank bất ngờ từ phía sau lưng."
    });
  }

  if (initiatorCount === 0) {
    keyWeaknesses.push({
      title: "Mù Thông Tin Khi Đẩy Bombsite",
      detail: "Thiếu chiêu do thám và Flash mở đường. Đội sẽ buộc phải xông vào bombsite bằng kỹ năng đấu súng chay mà không biết địch đang ẩn nấp góc nào."
    });
  } else if (duelistCount >= 3) {
    keyWeaknesses.push({
      title: "Thiếu Chiêu Thức Hỗ Trợ & Khó Khăn Khi Retake",
      detail: "Quá nhiều Duelist dẫn đến việc thiếu utility phối hợp. Khi mất Site ở phase phòng thủ, đội sẽ rất khó phối hợp để giải cứu bombsite (Retake)."
    });
  }

  // Add default strength/weakness if too few
  if (keyWeaknesses.length === 0) {
    keyWeaknesses.push({
      title: "Đòi Hỏi Phối Hợp Kỹ Năng Ăn Khớp Giữa Các Tuyến",
      detail: "Đội hình phụ thuộc nhiều vào việc canh chuẩn thời gian tung kĩ năng mở đường đồng bộ giữa Initiator và Duelist để đạt hiệu quả tối đa."
    });
  }

  // Tactical Advice
  if (archetype === "atk") {
    tacticalAdvice.push("Hãy chơi theo nhịp độ nhanh (Fast Pace), sử dụng Flash và Dash tràn thẳng vào bombsite ngay đầu round.");
    tacticalAdvice.push("Tận dụng lợi thế hỏa lực để ép đối phương phải đấu súng 1v1 hoặc trade mạng nhanh chóng.");
  } else if (archetype === "def") {
    tacticalAdvice.push("Ưu tiên cắm bẫy chéo góc, câu giờ cho đồng đội Rotate từ bombsite đối diện sang hỗ trợ.");
    tacticalAdvice.push("Khi tấn công, luôn cử 1 Sentinel đặt bẫy giữ Flank trước khi cả đội tập trung đẩy Site.");
  } else if (archetype === "tournament") {
    tacticalAdvice.push("Triển khai chiến thuật Default kiểm soát khu vực Giữa (Mid Control) trước khi tung đòn quyết định ở 30s cuối.");
    tacticalAdvice.push("Phối hợp Combo: Recon Dart/Haunt phát hiện -> Flash mở góc -> Duelist lao vào thanh trừng góc nấp.");
  } else if (archetype === "recon") {
    tacticalAdvice.push("Bắn chim/mũi tên do thám ngay đầu round để kiểm tra xem đối phương có dấu hiệu Rush nhanh hay không.");
    tacticalAdvice.push("Sấy xuyên khói (Spam Smoke) mỗi khi chiêu do thám phát hiện được bóng địch qua tường.");
  } else {
    tacticalAdvice.push("Tạo khoảng trống cho các tay to tự tin kê góc và tìm kiếm First Blood đầu round.");
    tacticalAdvice.push("Sử dụng kỹ năng hồi phục (Heal/Dismiss/Revive) để liên tục tạo lợi thế quân số cho đội.");
  }

  // Recommended Maps
  if (names.includes("cypher") || names.includes("fade") || names.includes("breach")) {
    recommendedMaps.push({ name: "Sunset", reason: "Nhiều góc vuông và hành lang B Market cực hợp cho Flash Breach và bẫy dây Cypher." });
  }
  if (names.includes("sova") || names.includes("killjoy") || names.includes("jett")) {
    recommendedMaps.push({ name: "Ascent", reason: "Bản đồ quốc dân tận dụng tối đa Sova Recon A Main và Killjoy khóa chặt B Site." });
  }
  if (names.includes("raze") || names.includes("brimstone") || names.includes("viper") || names.includes("fade")) {
    recommendedMaps.push({ name: "Bind", reason: "Không có khu vực Mid, thích hợp cho Raze bay lượn và Brimstone/Viper smoke cổng dịch chuyển." });
  }
  if (names.includes("breach") || names.includes("omen") || names.includes("skye")) {
    recommendedMaps.push({ name: "Haven / Lotus", reason: "Bản đồ có 3 Bombsite, các kĩ năng khống chế diện rộng phát huy sức mạnh tối đa." });
  }

  // Selected Map synergy check and scoring adjustment
  if (mapMeta) {
    let mapSynergyHits = 0;
    const mapAgentHits: string[] = [];
    const allMapBest = [
      ...mapMeta.bestControllers,
      ...mapMeta.bestInitiators,
      ...mapMeta.bestSentinels,
      ...mapMeta.bestDuelists
    ];

    agents.forEach(a => {
      if (allMapBest.includes(a.id.toLowerCase())) {
        mapSynergyHits++;
        mapAgentHits.push(a.name);
      }
    });

    if (mapSynergyHits >= 3) {
      keyStrengths.unshift({
        title: `Tương Thích Cực Cao Với Bản Đồ ${mapMeta.name} (${mapSynergyHits}/5 Tướng Meta)`,
        detail: `Đội hình quy tụ các quân bài tủ (${mapAgentHits.join(", ")}) phát huy tối đa địa hình và cơ chế đặc trưng của map ${mapMeta.name}. ${mapMeta.mapNotes}`
      });
    } else if (mapSynergyHits <= 1) {
      keyWeaknesses.unshift({
        title: `Cảnh Báo: Đội Hình Ít Tướng Meta Cho Map ${mapMeta.name}`,
        detail: `Bản đồ ${mapMeta.name} đòi hỏi các đặc vụ có bộ chiêu thức đặc thù. Việc thiếu các tướng quen thuộc có thể khiến đội gặp bất lợi về địa hình.`
      });
    }

    tacticalAdvice.unshift(`[Lời Khuyên Cho Map ${mapMeta.name.toUpperCase()}]: ${mapMeta.mapNotes}`);
  }

  // Base score calculation
  let baseScore = Math.round((attackPower * 0.25) + (defensePower * 0.25) + (infoGathering * 0.2) + (smokeControl * 0.2) + (clutchPotential * 0.1));
  if (controllerCount === 0) baseScore = Math.min(45, baseScore);

  return {
    score: baseScore,
    archetypeId: archetype,
    stats: {
      attackPower,
      defensePower,
      infoGathering,
      smokeControl,
      clutchPotential,
    },
    keyStrengths,
    keyWeaknesses,
    tacticalAdvice,
    recommendedMaps: recommendedMaps.slice(0, 3),
  };
}
