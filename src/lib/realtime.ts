import { supabase } from "./supabase";
import type { RealtimeChannel } from "@supabase/supabase-js";
import type { DraftAction } from "../types";

export function createDraftChannel(roomId: string): RealtimeChannel {
  return supabase.channel(`draft:${roomId}`, {
    config: { broadcast: { self: true } },
  });
}

export function broadcastAction(
  channel: RealtimeChannel,
  action: DraftAction
) {
  channel.send({
    type: "broadcast",
    event: "draft_action",
    payload: action,
  });
}
