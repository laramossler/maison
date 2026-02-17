-- The Ledger: Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- Profiles (linked to auth.users)
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  family_name text default '',
  residence text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Guests
create table guests (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  relationship text default '',
  dietary text default '',
  preferences text default '',
  personal_notes text default '',
  conversation_topics text default '',
  birthday text,
  anniversary text,
  children_birthdays jsonb default '[]',
  life_events jsonb default '[]',
  nationality text,
  cultural_background text,
  languages jsonb default '[]',
  religious_observances jsonb default '[]',
  gift_history jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Events
create table events (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  date text not null,
  title text not null,
  purpose text,
  occasion text not null,
  location text default '',
  guest_ids jsonb default '[]',
  guest_of_honor_id text,
  menu jsonb default '{"courses":[],"wines":[],"notes":""}',
  atmosphere jsonb default '{"tableSettings":"","flowers":"","lighting":"","music":"","scent":""}',
  outfit jsonb,
  seating_notes text default '',
  planned_timeline jsonb default '[]',
  reflection jsonb,
  status text default 'planning',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Weekly Menus
create table menus (
  id text primary key,
  user_id uuid references auth.users on delete cascade not null,
  week_start_date text not null,
  week_end_date text not null,
  days jsonb default '[]',
  pantry_slots jsonb default '[]',
  ready_board jsonb default '[]',
  special_notes text default '',
  hosting_planned boolean default false,
  hosting_notes text default '',
  seasonal_notes text default '',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable Row Level Security on all tables
alter table profiles enable row level security;
alter table guests enable row level security;
alter table events enable row level security;
alter table menus enable row level security;

-- Profiles: users can only access their own
create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);
create policy "Users can insert own profile"
  on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

-- Guests: users can only access their own
create policy "Users can view own guests"
  on guests for select using (auth.uid() = user_id);
create policy "Users can insert own guests"
  on guests for insert with check (auth.uid() = user_id);
create policy "Users can update own guests"
  on guests for update using (auth.uid() = user_id);
create policy "Users can delete own guests"
  on guests for delete using (auth.uid() = user_id);

-- Events: users can only access their own
create policy "Users can view own events"
  on events for select using (auth.uid() = user_id);
create policy "Users can insert own events"
  on events for insert with check (auth.uid() = user_id);
create policy "Users can update own events"
  on events for update using (auth.uid() = user_id);
create policy "Users can delete own events"
  on events for delete using (auth.uid() = user_id);

-- Menus: users can only access their own
create policy "Users can view own menus"
  on menus for select using (auth.uid() = user_id);
create policy "Users can insert own menus"
  on menus for insert with check (auth.uid() = user_id);
create policy "Users can update own menus"
  on menus for update using (auth.uid() = user_id);
create policy "Users can delete own menus"
  on menus for delete using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
