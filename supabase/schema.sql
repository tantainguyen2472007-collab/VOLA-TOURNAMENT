-- ============================================
-- ESP-TOURNAMENT: Supabase Database Schema
-- ============================================

-- PROFILES: extends Supabase auth.users
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default 'Player',
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', 'Player'));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ROOMS: draft rooms
create type public.room_role as enum ('admin', 'captain_a', 'captain_b', 'caster', 'viewer');
create type public.room_status as enum ('lobby', 'drafting', 'completed');

create table if not exists public.rooms (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  team_a_name text not null default 'Team A',
  team_b_name text not null default 'Team B',
  game text not null default 'Valorant',
  status public.room_status not null default 'lobby',
  created_by uuid not null references public.profiles(id),
  config jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ROOM PARTICIPANTS: who is in the room and their role
create table if not exists public.room_participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role public.room_role not null default 'viewer',
  joined_at timestamptz not null default now(),
  unique(room_id, user_id)
);

-- DRAFT_SLOTS: the 10 player slots (5 per team)
create type public.slot_status as enum ('waiting', 'picking', 'locked');

create table if not exists public.draft_slots (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references public.rooms(id) on delete cascade,
  team_id text not null, -- 'team_a' or 'team_b'
  player_index int not null, -- 0-4
  status public.slot_status not null default 'waiting',
  selected_role text, -- 'Duelist', 'Controller', etc. or 'Any'
  agent_id text, -- valorant agent id
  agent_name text,
  agent_image text,
  agent_role text,
  locked_at timestamptz,
  unique(room_id, team_id, player_index)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table public.profiles enable row level security;
alter table public.rooms enable row level security;
alter table public.room_participants enable row level security;
alter table public.draft_slots enable row level security;

-- Profiles: users can read all profiles, update own
create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Rooms: anyone can read, only creator can update/delete
create policy "Rooms are viewable by everyone"
  on public.rooms for select using (true);

create policy "Authenticated users can create rooms"
  on public.rooms for insert with check (auth.uid() = created_by);

create policy "Room creator can update"
  on public.rooms for update using (auth.uid() = created_by);

-- Room Participants: viewable by all, manageable by room creator
create policy "Participants are viewable by everyone"
  on public.room_participants for select using (true);

create policy "Authenticated users can join rooms"
  on public.room_participants for insert with check (auth.uid() = user_id);

-- Draft Slots: viewable by all, updatable by room participants
create policy "Draft slots are viewable by everyone"
  on public.draft_slots for select using (true);

create policy "Room creator can manage draft slots"
  on public.draft_slots for all using (
    exists (
      select 1 from public.rooms
      where rooms.id = draft_slots.room_id
      and rooms.created_by = auth.uid()
    )
  );

create policy "Captains can update their team slots"
  on public.draft_slots for update using (
    exists (
      select 1 from public.room_participants rp
      where rp.room_id = draft_slots.room_id
      and rp.user_id = auth.uid()
      and (
        (rp.role = 'captain_a' and draft_slots.team_id = 'team_a')
        or (rp.role = 'captain_b' and draft_slots.team_id = 'team_b')
      )
    )
  );
