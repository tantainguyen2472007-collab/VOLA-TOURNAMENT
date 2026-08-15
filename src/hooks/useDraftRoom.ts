import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "../lib/supabase";
import { createDraftChannel, broadcastAction } from "../lib/realtime";
import { useAuth } from "./useAuth";
import { VALORANT_AGENTS, VALORANT_MAPS } from "../data/valorant";
import { TURN_ORDER, getAvailableAgents } from "../features/draftRules";
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

export function useDraftRoom(roomId: string | undefined) {
  const { user } = useAuth();
  const [room, setRoom] = useState<Room | null>(null);
  const [slots, setSlots] = useState<DraftSlotState[]>([]);
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [selectedMap, setSelectedMap] = useState<string | null>(null);
  const [bannedMaps, setBannedMaps] = useState<string[]>([]);
  const [pickedMaps, setPickedMaps] = useState<string[]>([]);
  const [mapVetoPhase, setMapVetoPhase] = useState<"ban_a" | "ban_b" | "pick_a" | "pick_b">("ban_a");
  const [isSpinning, setIsSpinning] = useState(false);
  const [isSpinningMap, setIsSpinningMap] = useState(false);
  const [myRole, setMyRole] = useState<RoomRole>("viewer");
  const [loading, setLoading] = useState(true);
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
        const ordered = [...mapped].sort((a, b) => TURN_ORDER.findIndex((t) => t.teamId === a.teamId && t.playerIndex === a.playerIndex) - TURN_ORDER.findIndex((t) => t.teamId === b.teamId && t.playerIndex === b.playerIndex));
        setSlots(ordered);
        const pickingIdx = mapped.findIndex((s) => s.status === "picking");
        setCurrentTurnIndex(pickingIdx >= 0 ? pickingIdx : ordered.length);
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
        setSlots((prev) =>
          prev.map((s, i) =>
            i === action.slotIndex ? { ...s, selectedRole: action.role as DraftSlotState["selectedRole"] } : s
          )
        );
        break;

      case "LOCK":
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
        break;

      case "RANDOM_MAP":
        setSelectedMap(action.map);
        setIsSpinningMap(false);
        break;

      case "MAP_VETO":
        if (action.phase.startsWith("ban")) setBannedMaps((prev) => [...prev, action.map]);
        else setPickedMaps((prev) => [...prev, action.map]);
        setMapVetoPhase(action.phase === "ban_a" ? "ban_b" : action.phase === "ban_b" ? "pick_a" : action.phase === "pick_a" ? "pick_b" : "pick_b");
        setIsSpinningMap(false);
        break;

      case "RESET":
        setSlots((prev) =>
          prev.map((s, i) => ({
            ...s,
            status: i === 0 ? ("picking" as const) : ("waiting" as const),
            agent: null,
            selectedRole: null,
          }))
        );
        setCurrentTurnIndex(0);
        setSelectedMap(null);
        setBannedMaps([]);
        setPickedMaps([]);
        setMapVetoPhase("ban_a");
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
    if (!slot?.selectedRole || isSpinning) return;

    setIsSpinning(true);
    let spinCount = 0;
    const interval = setInterval(() => {
      spinCount++;
      const available = VALORANT_AGENTS.filter(
        (a) => slot.selectedRole === "Any" || a.role === slot.selectedRole
      );
      const randomAgent = available[Math.floor(Math.random() * available.length)];

      setSlots((prev) =>
        prev.map((s, i) =>
          i === currentTurnIndex ? { ...s, agent: randomAgent } : s
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

  const mapCanAct = myRole === "admin" ||
    (mapVetoPhase.endsWith("_a") && myRole === "captain_a") ||
    (mapVetoPhase.endsWith("_b") && myRole === "captain_b");

  const handleMapVeto = useCallback((map: string) => {
    if (isSpinningMap || !mapCanAct || bannedMaps.includes(map) || pickedMaps.includes(map)) return;
    broadcast({ type: "MAP_VETO", phase: mapVetoPhase, map });
  }, [isSpinningMap, mapCanAct, bannedMaps, pickedMaps, mapVetoPhase, broadcast]);

  const handleRandomMap = useCallback(() => {
    if (isSpinningMap) return;
    setIsSpinningMap(true);
    let spins = 0;
    const interval = setInterval(() => {
      spins++;
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
    handleRandomMap,
    handleMapVeto,
    mapCanAct,
    bannedMaps,
    pickedMaps,
    mapVetoPhase,
    handleReset,
    loading,
  };
}
