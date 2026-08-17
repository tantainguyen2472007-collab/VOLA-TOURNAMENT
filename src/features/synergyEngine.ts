import { Agent } from "../types";

export interface TeamSynergyAnalysis {
  score: number; // 0 - 100
  rating: "Hoàn Hảo" | "Rất Tốt" | "Cân Bằng" | "Thiếu Hụt" | "Nguy Hiểm";
  roleCounts: {
    Duelist: number;
    Initiator: number;
    Controller: number;
    Sentinel: number;
    [key: string]: number;
  };
  strengths: string[];
  warnings: string[];
  recommendations: string[];
}

export function analyzeValorantComposition(agents: (Agent | null)[]): TeamSynergyAnalysis {
  const locked = agents.filter((a): a is Agent => a !== null);
  
  const roleCounts: Record<string, number> = {
    Duelist: 0,
    Initiator: 0,
    Controller: 0,
    Sentinel: 0,
  };

  locked.forEach((a) => {
    if (roleCounts[a.role] !== undefined) {
      roleCounts[a.role]++;
    } else {
      roleCounts[a.role] = 1;
    }
  });

  const strengths: string[] = [];
  const warnings: string[] = [];
  const recommendations: string[] = [];

  let baseScore = 50;

  // 1. Kiểm tra Smoke (Controller)
  if (roleCounts.Controller >= 1) {
    baseScore += 20;
    strengths.push("Đầy đủ Smokes kiểm soát tầm nhìn và che chắn khi chiếm Site.");
    if (roleCounts.Controller >= 2) {
      strengths.push("Chiến thuật Double Controller cực mạnh cho việc bóp nghẹt bản đồ lớn.");
    }
  } else {
    baseScore -= 25;
    warnings.push("CẢNH BÁO: Đội hình hoàn toàn THIẾU SMOKES (Controller). Dễ bị AWP/Sniper đối phương bắt lẻ khi Retake.");
    recommendations.push("Nên bổ sung Omen, Brimstone, Viper hoặc Clove để chặn góc ngắm đối thủ.");
  }

  // 2. Kiểm tra Initiator (Flash / Info / Recon)
  if (roleCounts.Initiator >= 1) {
    baseScore += 15;
    strengths.push("Có khả năng thu thập thông tin vị trí địch (Recon) & Flash mở góc vào Site.");
  } else {
    baseScore -= 15;
    warnings.push("Thiếu Initiator dò thông tin. Đội sẽ phải mò mẫm vào bombsite mà không biết vị trí đặt bẫy.");
    recommendations.push("Bổ sung Sova, Fade hoặc Gekko để soi thông tin trước khi đẩy.");
  }

  // 3. Kiểm tra Sentinel (Phòng thủ / Neo Site)
  if (roleCounts.Sentinel >= 1) {
    baseScore += 15;
    strengths.push("Có khả năng neo giữ Site vững chắc (Anchor) & chống đối phương móc hậu (Flank).");
  } else {
    baseScore -= 10;
    warnings.push("Không có Sentinel giữ góc. Phía sau lưng dễ bị đối phương Flank bất ngờ.");
    recommendations.push("Khuyên dùng Cypher, Killjoy hoặc Chamber để giăng bẫy cảnh báo.");
  }

  // 4. Kiểm tra Duelist (Mở Site)
  if (roleCounts.Duelist >= 1 && roleCounts.Duelist <= 2) {
    baseScore += 10;
    strengths.push("Có hỏa lực dồi dào để Entry mở đường tiêu diệt mục tiêu đầu tiên.");
  } else if (roleCounts.Duelist > 2) {
    baseScore -= 20;
    warnings.push(`CẢNH BÁO: Quá nhiều Duelist (${roleCounts.Duelist} Duelists)! Đội hình thiếu tiện ích hỗ trợ, dễ bị khắc chế khi thủ.`);
    recommendations.push("Nên giảm bớt Duelist và thay bằng Sentinel hoặc Initiator để cân bằng.");
  } else if (roleCounts.Duelist === 0 && locked.length >= 3) {
    warnings.push("Chưa có Duelist mở đường. Việc xông pha vào bombsite sẽ phụ thuộc hoàn toàn vào utility.");
  }

  const finalScore = Math.max(10, Math.min(100, baseScore));

  let rating: TeamSynergyAnalysis["rating"] = "Cân Bằng";
  if (finalScore >= 90) rating = "Hoàn Hảo";
  else if (finalScore >= 75) rating = "Rất Tốt";
  else if (finalScore >= 55) rating = "Cân Bằng";
  else if (finalScore >= 40) rating = "Thiếu Hụt";
  else rating = "Nguy Hiểm";

  return {
    score: finalScore,
    rating,
    roleCounts: roleCounts as any,
    strengths,
    warnings,
    recommendations,
  };
}
