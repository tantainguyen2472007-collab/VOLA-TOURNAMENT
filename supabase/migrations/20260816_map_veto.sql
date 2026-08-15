create table if not exists public.draft_sessions (id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade, mode text not null default 'valorant_map_veto', format text not null default 'BO3', state jsonb not null, status text not null default 'active', version bigint not null default 0, turn_deadline timestamptz, created_at timestamptz not null default now(), unique(room_id, mode));
create table if not exists public.draft_actions (id uuid primary key default gen_random_uuid(), session_id uuid not null references public.draft_sessions(id) on delete cascade, sequence_no bigint not null, actor_id uuid references auth.users(id), actor_role text not null, action jsonb not null, created_at timestamptz not null default now(), unique(session_id, sequence_no));
create table if not exists public.overlay_tokens (id uuid primary key default gen_random_uuid(), room_id uuid not null references public.rooms(id) on delete cascade, token_hash text not null unique, label text not null, created_at timestamptz not null default now());
alter table public.draft_sessions enable row level security; alter table public.draft_actions enable row level security; alter table public.overlay_tokens enable row level security;
create policy "Draft sessions readable" on public.draft_sessions for select using (true);
create policy "Draft sessions room creator writes" on public.draft_sessions for all to authenticated using (exists (select 1 from public.rooms r where r.id = room_id and r.created_by = (select auth.uid()))) with check (exists (select 1 from public.rooms r where r.id = room_id and r.created_by = (select auth.uid())));
create policy "Draft actions readable" on public.draft_actions for select using (true);
create policy "Overlay tokens readable by room creator" on public.overlay_tokens for select to authenticated using (exists (select 1 from public.rooms r where r.id = room_id and r.created_by = (select auth.uid())));
create index if not exists draft_sessions_room_id_idx on public.draft_sessions(room_id); create index if not exists draft_actions_session_seq_idx on public.draft_actions(session_id, sequence_no); create index if not exists overlay_tokens_hash_idx on public.overlay_tokens(token_hash);
create or replace function public.apply_map_veto_action(p_session_id uuid, p_action jsonb, p_actor_role text, p_expected_version bigint)
returns public.draft_sessions
language plpgsql
security invoker
as $$
declare v_session public.draft_sessions; v_state jsonb; v_team text; v_phase text; v_map_id text; v_type text;
begin
  select * into v_session from public.draft_sessions where id = p_session_id for update;
  if not found then raise exception 'Map veto session not found'; end if;
  if v_session.version <> p_expected_version then raise exception 'Stale map veto version'; end if;
  v_state := v_session.state; v_phase := v_state->>'phase'; v_map_id := p_action->>'mapId'; v_type := p_action->>'type';
  v_team := case when v_phase in ('team_a_ban','team_a_pick') then 'team_a' when v_phase in ('team_b_ban','team_b_pick') then 'team_b' else null end;
  if p_actor_role <> 'admin' and p_actor_role <> case when v_team = 'team_a' then 'captain_a' else 'captain_b' end then raise exception 'Role cannot act in current turn'; end if;
  if (v_phase like '%ban' and v_type <> 'ban') or (v_phase like '%pick' and v_type <> 'pick') then raise exception 'Invalid action for current phase'; end if;
  if not exists (select 1 from jsonb_array_elements(v_state->'maps') m where m->>'id' = v_map_id and m->>'status' = 'available') then raise exception 'Map unavailable'; end if;
  update public.draft_sessions set state = jsonb_set(jsonb_set(v_state, '{phase}', to_jsonb(case v_phase when 'team_a_ban' then 'team_b_ban' when 'team_b_ban' then 'team_a_pick' when 'team_a_pick' then 'team_b_pick' else 'completed' end)), '{status}', to_jsonb(case when v_phase = 'team_b_pick' then 'completed' else 'active' end)), version = version + 1, turn_deadline = now() + interval '30 seconds' where id = p_session_id returning * into v_session;
  insert into public.draft_actions(session_id, sequence_no, actor_id, actor_role, action) values (p_session_id, v_session.version, (select auth.uid()), p_actor_role, p_action);
  return v_session;
end;
$$;
revoke execute on function public.apply_map_veto_action(uuid,jsonb,text,bigint) from public, anon;
grant execute on function public.apply_map_veto_action(uuid,jsonb,text,bigint) to authenticated;
