-- ============================================================
-- SkillSwap database schema
-- Run once in the Supabase SQL editor.
-- ============================================================

-- One profile row per authenticated user
create table if not exists profiles (
    id uuid primary key references auth.users on delete cascade,
    username text unique not null,
    bio text default ''
);

-- Every distinct skill in the system, stored once
create table if not exists skills (
    id bigint generated always as identity primary key,
    name text unique not null
);

-- Links a user to a skill, either as something they teach or want to learn
create table if not exists user_skills (
    id bigint generated always as identity primary key,
    user_id uuid references profiles(id) on delete cascade,
    skill_id bigint references skills(id) on delete cascade,
    type text not null check (type in ('teach', 'learn'))
);

-- One row per swipe action
create table if not exists swipes (
    id bigint generated always as identity primary key,
    swiper_id uuid references profiles(id) on delete cascade,
    swiped_id uuid references profiles(id) on delete cascade,
    direction text not null check (direction in ('like', 'pass')),
    created_at timestamptz default now(),
    unique (swiper_id, swiped_id)
);

-- Created automatically when two users like each other
create table if not exists matches (
    id bigint generated always as identity primary key,
    user1_id uuid references profiles(id) on delete cascade,
    user2_id uuid references profiles(id) on delete cascade,
    created_at timestamptz default now(),
    unique (user1_id, user2_id)
);

create table if not exists messages (
    id bigint generated always as identity primary key,
    sender_id uuid references profiles(id) on delete cascade,
    receiver_id uuid references profiles(id) on delete cascade,
    content text not null,
    sent_at timestamptz default now()
);

-- ------------------------------------------------------------
-- Create a profile row whenever a new auth user signs up
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    insert into public.profiles (id, username)
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1))
    );
    return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
    after insert on auth.users
    for each row execute function public.handle_new_user();

-- ------------------------------------------------------------
-- Create a match when a like is reciprocated
-- ------------------------------------------------------------
create or replace function public.handle_new_swipe()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
    if new.direction = 'like' and exists (
        select 1 from public.swipes
        where swiper_id = new.swiped_id
          and swiped_id = new.swiper_id
          and direction = 'like'
    ) then
        insert into public.matches (user1_id, user2_id)
        values (
            least(new.swiper_id, new.swiped_id),
            greatest(new.swiper_id, new.swiped_id)
        )
        on conflict do nothing;
    end if;
    return new;
end;
$$;

drop trigger if exists on_swipe_created on public.swipes;
create trigger on_swipe_created
    after insert on public.swipes
    for each row execute function public.handle_new_swipe();

-- ------------------------------------------------------------
-- Backfill profiles for accounts created before the trigger
-- ------------------------------------------------------------
insert into public.profiles (id, username)
select
    id,
    coalesce(raw_user_meta_data->>'username', split_part(email, '@', 1))
from auth.users
on conflict (id) do nothing;

-- ------------------------------------------------------------
-- Lock the tables down. The frontend only uses Supabase for auth
-- and reaches all data through the API, which authenticates with
-- the secret key. Enabling RLS with no policies means the
-- publishable key cannot read or write any of these tables.
-- ------------------------------------------------------------
alter table profiles enable row level security;
alter table skills enable row level security;
alter table user_skills enable row level security;
alter table swipes enable row level security;
alter table matches enable row level security;
alter table messages enable row level security;

notify pgrst, 'reload schema';
