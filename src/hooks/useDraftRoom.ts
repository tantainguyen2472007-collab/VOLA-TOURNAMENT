import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { createDraftChannel, broadcastAction } from "../lib/realtime";
import { useAuth } from "./useAuth";
import { VALORANT_AGENTS, VALORANT_MAPS } from "../data/valorant";
import { getTurnOrder, getAvailableAgents } from "../features/draftRules";
import {
  playRoleSelect,
  playLockInSound,
  playSpinTick,
  playCoinTossSound,
  playMapVetoSound,
  playVictoryFanfare,
} from "../lib/soundEngine";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { Agent, DbDraftSlot, DraftAction, RoomRole, Room } from "../types";

export interface DraftSlotState {
  id: string;
  teamId: string;
  playerIndex: number;
  status: "waiting" | "picking" | "locked";
  agent: Agent | null;
  selectedRole: Agent["role"] | "Any" | null;
}

function dbSlotToState(s: DbDraftSlot): DraftSlotState {
  return {
    id: s.id,
    teamId: s.team_id,
    playerIndex: s.player_index,
    status: s.status,
    selectedRole: (s.selected_role as DraftSlotState["selectedRole"]) ?? null,
    agent: s.agent_id
      ? {
          id: s.agent_id,
          name: s.agent_name!,
          role: s.agent_role as Agent["role"],
          image: s.agent_image!,
        }
      : null,
  };
}

export type MatchPrediction = "team_a_2_0" | "team_a_2_1" | "team_b_2_0" | "team_b_2_1";

export function useDraftRoom(roomId: string | undefined) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [slots, setSlots] = useState<DraftSlotState[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [bannedMaps, setBannedMaps] = useState<string[]>([]);
  const [pickedMaps, setPickedMaps] = useState<string[]>([]);
  const [deciderMap, setDeciderMap] = useState<string | null>(null);
  const [coinTossWinner, setCoinTossWinner] = useState<"team_a" | "team_b" | null>(null);
  const [isTossingCoin, setIsTossingCoin] = useState(false);
  const [mvpVotes, setMvpVotes] = useState<Record<string, string>>({});
  const [predictions, setPredictions] = useState<Record<string, MatchPrediction>>({});
  const voterId = useRef(Math.random().toString(36).substring(7)).current;
  const [mapVetoPhase, setMapVetoPhase] = useState<"ban_a" | "ban_b" | "pick_a" | "pick_b" | "completed">("ban_a");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningMap, setIsSpinningMap] = useState(false);
  const [myRole, setMyRole] = useState<RoomRole>("viewer");
  const [loading, setLoading] = useState(true);
  const [turnDeadline, setTurnDeadline] = useState<number | null>(null);
  const channelRef = useRef<RealtimeChannel | null>(null);

  // Load initial data from DB
  useEffect(() => {
    if (!roomId) {
      setLoading(false);
      return;
    }

    async function loadRoom() {
      const { data: roomData } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomId)
        .single();

      if (roomData) setRoom(roomData as Room);

      const { data: slotData } = await supabase
        .from("draft_slots")
        .select("*")
        .eq("room_id", roomId)
        .order("team_id", { ascending: true })
        .order("player_index", { ascending: true });

      if (slotData) {
        const mapped = (slotData as DbDraftSlot[]).map(dbSlotToState);
        const order = getTurnOrder("team_a");
        const ordered = [...mapped].sort((a, b) => order.findIndex((t) => t.teamId === a.teamId && t.playerIndex === a.playerIndex) - order.findIndex((t) => t.teamId === b.teamId && t.playerIndex === b.playerIndex));
        const seenAgents = new Set<string>();
        const normalized = ordered.map((slot) => {
          if (!slot.agent || !seenAgents.has(slot.agent.id)) {
            if (slot.agent) seenAgents.add(slot.agent.id);
            return slot;
          }
          supabase.from("draft_slots").update({ status: "waiting", agent_id: null, agent_name: null, agent_role: null, agent_image: null, locked_at: null }).eq("id", slot.id).then(() => {});
          return { ...slot, status: "waiting" as const, agent: null };
        });
        setSlots(normalized);
        const pickingIdx = normalized.findIndex((s) => s.status === "picking");
        setCurrentTurnIndex(pickingIdx >= 0 ? pickingIdx : normalized.length);
      }

      // Check my role
      if (user) {
        const { data: participant } = await supabase
          .from("room_participants")
          .select("role")
          .eq("room_id", roomId!)
          .eq("user_id", user.id)
          .single();

        if (participant) {
          setMyRole(participant.role as RoomRole);
        } else {
          // Auto-join as viewer from URL role param
          const urlRole = new URLSearchParams(window.location.search).get("role") as RoomRole | null;
          const role = urlRole ?? "viewer";
          await supabase.from("room_participants").insert({
            room_id: roomId,
            user_id: user.id,
            role,
          });
          setMyRole(role);
        }
      }

      setLoading(false);
    }

    loadRoom();
  }, [roomId, user]);

  // Apply action to local state
  const applyAction = useCallback((action: DraftAction) => {
    switch (action.type) {
      case "SELECT_ROLE":
        playRoleSelect();
        setSlots((prev) =>
          prev.map((s, i) =>
            i === action.slotIndex ? { ...s, selectedRole: action.role as DraftSlotState["selectedRole"] } : s
          )
        );
        break;

      case "LOCK":
        playLockInSound();
        setSlots((prev) =>
          prev.map((s, i) => {
            if (i === action.slotIndex) return { ...s, status: "locked" as const, agent: action.agent };
            if (i === action.slotIndex + 1) return { ...s, status: "picking" as const };
            return s;
          })
        );
        setCurrentTurnIndex(action.slotIndex + 1);
        if (roomId) {
          const lockedSlot = slots[action.slotIndex];
          const nextSlot = slots[action.slotIndex + 1];
          if (!lockedSlot) break;
          supabase
            .from("draft_slots")
            .update({
              status: "locked",
              agent_id: action.agent.id,
              agent_name: action.agent.name,
              agent_role: action.agent.role,
              agent_image: action.agent.image,
              locked_at: new Date().toISOString(),
            })
            .eq("room_id", roomId)
            .eq("team_id", lockedSlot.teamId)
            .eq("player_index", lockedSlot.playerIndex)
            .then(() => {
              if (nextSlot) {
                supabase
                  .from("draft_slots")
                  .update({ status: "picking" })
                  .eq("room_id", roomId)
                  .eq("team_id", nextSlot.teamId)
                  .eq("player_index", nextSlot.playerIndex)
                  .then(() => {});
              }
            });
        }
        setTurnDeadline(null);
        break;

      case "RANDOM_MAP":
        playLockInSound();
        setSelectedMap(action.map);
        setIsSpinningMap(false);
        break;

      case "MAP_VETO":
        playMapVetoSound(action.phase.startsWith("ban"));
        if (action.phase.startsWith("ban")) setBannedMaps((prev) => [...prev, action.map]);
        else setPickedMaps((prev) => [...prev, action.map]);
        
        setMapVetoPhase(action.phase === "ban_a" ? "ban_b" : action.phase === "ban_b" ? "pick_a" : action.phase === "pick_a" ? "pick_b" : "completed");
        break;

      case "DECIDER_MAP":
        playLockInSound();
        setDeciderMap(action.map);
        setIsSpinningMap(false);
        break;

      case "TOSSING_COIN":
        playCoinTossSound();
        setIsTossingCoin(true);
        break;

      case "COIN_TOSS": {
        playLockInSound();
        setCoinTossWinner(action.result);
        setIsTossingCoin(false);

        // Re-order slots according to coin toss winner
        const newTurnOrder = getTurnOrder(action.result);
        setSlots((prev) => {
          const sorted = [...prev].sort((a, b) => {
            const idxA = newTurnOrder.findIndex((t) => t.teamId === a.teamId && t.playerIndex === a.playerIndex);
            const idxB = newTurnOrder.findIndex((t) => t.teamId === b.teamId && t.playerIndex === b.playerIndex);
            return idxA - idxB;
          });
          const hasLocked = sorted.some((s) => s.status === "locked");
          if (!hasLocked) {
            return sorted.map((s, i) => ({
              ...s,
              status: i === 0 ? ("picking" as const) : ("waiting" as const),
            }));
          }
          return sorted;
        });
        setCurrentTurnIndex(0);
        break;
      }

      case "VOTE_MVP":
        playVictoryFanfare();
        setMvpVotes((prev) => ({ ...prev, [action.voterId]: action.slotId }));
        break;

      case "VOTE_PREDICTION":
        playRoleSelect();
        setPredictions((prev) => ({ ...prev, [action.voterId]: action.prediction }));
        break;

      case "APPLY_TEAM_COMPOSITION": {
        playVictoryFanfare();
        setSlots((prev) => {
          let agentIdx = 0;
          const updated = prev.map((s) => {
            if (s.teamId === action.teamId && agentIdx < action.agents.length) {
              const assignedAgent = action.agents[agentIdx++];
              return {
                ...s,
                status: "locked" as const,
                agent: assignedAgent,
                selectedRole: assignedAgent.role,
              };
            }
            return s;
          });

          // Check if there are still picking/waiting slots
          const firstUnlockedIdx = updated.findIndex((s) => s.status !== "locked");
          if (firstUnlockedIdx >= 0) {
            updated[firstUnlockedIdx].status = "picking";
            setCurrentTurnIndex(firstUnlockedIdx);
          } else {
            setCurrentTurnIndex(updated.length);
          }
          return updated;
        });

        if (roomId) {
          action.agents.forEach((agent, idx) => {
            supabase
              .from("draft_slots")
              .update({
                status: "locked",
                agent_id: agent.id,
                agent_name: agent.name,
                agent_role: agent.role,
                agent_image: agent.image,
                locked_at: new Date().toISOString(),
              })
              .eq("room_id", roomId)
              .eq("team_id", action.teamId)
              .eq("player_index", idx)
              .then(() => {});
          });
        }
        break;
      }

      case "RESET": {
        const defaultOrder = getTurnOrder("team_a");
        setSlots((prev) => {
          const sorted = [...prev].sort((a, b) => {
            const idxA = defaultOrder.findIndex((t) => t.teamId === a.teamId && t.playerIndex === a.playerIndex);
            const idxB = defaultOrder.findIndex((t) => t.teamId === b.teamId && t.playerIndex === b.playerIndex);
            return idxA - idxB;
          });
          return sorted.map((s, i) => ({
            ...s,
            status: i === 0 ? ("picking" as const) : ("waiting" as const),
            agent: null,
            selectedRole: null,
          }));
        });
        setCurrentTurnIndex(0);
        setSelectedMap(null);
        setBannedMaps([]);
        setPickedMaps([]);
        setDeciderMap(null);
        setCoinTossWinner(null);
        setMvpVotes({});
        setPredictions({});
        setMapVetoPhase("ban_a");
        setTurnDeadline(null);
        break;
      }

      case "SYNC_TIMER":
        setTurnDeadline(action.deadline);
        break;
    }
  }, [roomId, slots]);

  // Subscribe to realtime channel
  useEffect(() => {
    if (!roomId) return;

    const channel = createDraftChannel(roomId);
    channelRef.current = channel;

    channel
      .on("broadcast", { event: "draft_action" }, ({ payload }) => {
        const action = payload as DraftAction;
        applyAction(action);
      })
      .subscribe();

    return () => {
      channel.unsubscribe();
      channelRef.current = null;
    };
  }, [roomId, applyAction]);

  // Broadcast helpers
  const broadcast = useCallback(
    (action: DraftAction) => {
      if (channelRef.current) {
        broadcastAction(channelRef.current, action);
      }
    },
    []
  );

  const handleRoleSelect = useCallback(
    (role: Agent["role"] | "Any") => {
      broadcast({ type: "SELECT_ROLE", slotIndex: currentTurnIndex, role });
    },
    [broadcast, currentTurnIndex]
  );

  const handleSpin = useCallback(() => {
    const slot = slots[currentTurnIndex];
    if (!slot || isSpinning) return;

    const roleToUse = slot.selectedRole || "Any";

    setIsSpinning(true);
    let spinCount = 0;
    const interval = setInterval(() => {
      spinCount++;
      playSpinTick();
      const assignedAgentIds = slots
        .filter((candidate) => candidate.id !== slot.id && candidate.agent && candidate.teamId === slot.teamId)
        .map((candidate) => candidate.agent!.id);
      const available = getAvailableAgents(roleToUse, assignedAgentIds);
      const randomAgent = available[Math.floor(Math.random() * available.length)];

      setSlots((prev) =>
        prev.map((s, i) =>
          i === currentTurnIndex ? { ...s, agent: randomAgent, selectedRole: randomAgent?.role } : s
        )
      );

      if (spinCount > 15) {
        clearInterval(interval);
        setIsSpinning(false);
        // Get final random agent and broadcast LOCK
        const finalAgent = available[Math.floor(Math.random() * available.length)];
        broadcast({
          type: "LOCK",
          slotIndex: currentTurnIndex,
          agent: finalAgent,
        });
      }
    }, 100);
  }, [slots, currentTurnIndex, isSpinning, broadcast]);

  const handleApplyTeamComposition = useCallback(
    (teamId: "team_a" | "team_b", agents: Agent[]) => {
      broadcast({ type: "APPLY_TEAM_COMPOSITION", teamId, agents });
    },
    [broadcast]
  );

  // Decider Map Roll trigger (Auto or Manual) to guarantee 3 maps for BO3
  const handleRollDeciderMap = useCallback(() => {
    if (isSpinningMap) return;
    const remainingMaps = VALORANT_MAPS.filter((m) => !bannedMaps.includes(m) && !pickedMaps.includes(m));
    if (remainingMaps.length === 0) return;
    
    setIsSpinningMap(true);
    let spins = 0;
    const interval = setInterval(() => {
      spins++;
      playSpinTick();
      const randomCandidate = remainingMaps[Math.floor(Math.random() * remainingMaps.length)];
      setDeciderMap(randomCandidate);

      if (spins > 18) {
        clearInterval(interval);
        const finalMap = remainingMaps[Math.floor(Math.random() * remainingMaps.length)];
        broadcast({ type: "DECIDER_MAP", map: finalMap });
        setIsSpinningMap(false);
      }
    }, 100);
  }, [isSpinningMap, bannedMaps, pickedMaps, broadcast]);

  // Auto-roll Decider Map when Map Veto reaches completed and exactly 2 maps are picked
  useEffect(() => {
    if (mapVetoPhase === "completed" && pickedMaps.length === 2 && !deciderMap && !isSpinningMap) {
      handleRollDeciderMap();
    }
  }, [mapVetoPhase, pickedMaps.length, deciderMap, isSpinningMap, handleRollDeciderMap]);

  const mapCanAct = myRole === "admin" ||
    (mapVetoPhase.endsWith("_a") && myRole === "captain_a") ||
    (mapVetoPhase.endsWith("_b") && myRole === "captain_b");

  const handleMapVeto = useCallback((map: string) => {
    if (isSpinningMap || !mapCanAct || bannedMaps.includes(map) || pickedMaps.includes(map) || mapVetoPhase === "completed") return;
    broadcast({ type: "MAP_VETO", phase: mapVetoPhase as "ban_a" | "ban_b" | "pick_a" | "pick_b", map });
  }, [isSpinningMap, mapCanAct, bannedMaps, pickedMaps, mapVetoPhase, broadcast]);

  const handleRandomMap = useCallback(() => {
    if (isSpinningMap) return;
    setIsSpinningMap(true);
    let spins = 0;
    const interval = setInterval(() => {
      spins++;
      playSpinTick();
      setSelectedMap(VALORANT_MAPS[Math.floor(Math.random() * VALORANT_MAPS.length)]);
      if (spins > 20) {
        clearInterval(interval);
        const finalMap = VALORANT_MAPS[Math.floor(Math.random() * VALORANT_MAPS.length)];
        broadcast({ type: "RANDOM_MAP", map: finalMap });
      }
    }, 100);
  }, [isSpinningMap, broadcast]);

  const handleReset = useCallback(() => {
    broadcast({ type: "RESET" });
    if (roomId) {
      supabase
        .from("draft_slots")
        .update({ status: "waiting", selected_role: null, agent_id: null, agent_name: null, agent_image: null, agent_role: null, locked_at: null })
        .eq("room_id", roomId)
        .then(() => {
          supabase.from("draft_slots").update({ status: "picking" }).eq("room_id", roomId).eq("team_id", "team_a").eq("player_index", 0).then(() => {});
        });
    }
  }, [roomId, broadcast]);

  const canAct = myRole === "admin" ||
    (myRole === "captain_a" && slots[currentTurnIndex]?.teamId === "team_a") ||
    (myRole === "captain_b" && slots[currentTurnIndex]?.teamId === "team_b");

  const handleVoteMVP = useCallback((slotId: string) => {
    broadcast({ type: "VOTE_MVP", slotId, voterId });
  }, [broadcast, voterId]);

  const handleVotePrediction = useCallback((prediction: MatchPrediction) => {
    broadcast({ type: "VOTE_PREDICTION", prediction, voterId });
  }, [broadcast, voterId]);

  const handleCoinToss = useCallback(() => {
    if (coinTossWinner || isTossingCoin || !canAct) return;
    broadcast({ type: "TOSSING_COIN" });
    
    setTimeout(() => {
      const winner = Math.random() > 0.5 ? "team_a" : "team_b";
      broadcast({ type: "COIN_TOSS", result: winner });
    }, 2200); // spin for 2.2s
  }, [coinTossWinner, isTossingCoin, canAct, broadcast]);

  // Is pre-match setup complete? (Coin toss done AND 3 maps determined for BO3)
  const isMapSetupComplete = deciderMap !== null || (pickedMaps.length >= 2 && mapVetoPhase === "completed");
  const isSetupComplete = coinTossWinner !== null && isMapSetupComplete;

  return {
    room,
    slots,
    currentTurnIndex,
    selectedMap,
    isSpinning,
    isSpinningMap,
    myRole,
    canAct,
    handleRoleSelect,
    handleSpin,
    handleApplyTeamComposition,
    handleRandomMap,
    handleMapVeto,
    handleRollDeciderMap,
    mapCanAct,
    bannedMaps,
    pickedMaps,
    deciderMap,
    coinTossWinner,
    isTossingCoin,
    handleCoinToss,
    mvpVotes,
    handleVoteMVP,
    predictions,
    handleVotePrediction,
    voterId,
    mapVetoPhase,
    handleReset,
    loading,
    turnDeadline,
    broadcast,
    isMapSetupComplete,
    isSetupComplete,
  };
}

