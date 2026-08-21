-- Profiles, one row per auth user
create table profiles (
    id uuid primary key references auth.users on delete cascade,
    username text unique not null,
    bio text default ''
);

-- Every distinct skill in the system, stored once
create table skills (
    id bigint generated always as identity primary key,
    name text unique not null
);

-- Links a user to a skill, either as something they teach or want to learn
create table user_skills (
    id bigint generated always as identity primary key,
    user_id uuid references profiles on delete cascade,
    skill_id bigint references skills on delete cascade,
    type text not null check (type in ('teach', 'learn'))
);

-- One row per swipe action
create table swipes (
    id bigint generated always as identity primary key,
    swiper_id uuid references profiles on delete cascade,
    swiped_id uuid references profiles on delete cascade,
    direction text not null check (direction in ('like', 'pass')),
    created_at timestamptz default now(),
    unique (swiper_id, swiped_id)
);

-- Created when two users like each other
create table matches (
    id bigint generated always as identity primary key,
    user1_id uuid references profiles on delete cascade,
    user2_id uuid references profiles on delete cascade,
    created_at timestamptz default now()
);

create table messages (
    id bigint generated always as identity primary key,
    sender_id uuid references profiles on delete cascade,
    receiver_id uuid references profiles on delete cascade,
    content text not null,
    sent_at timestamptz default now()
);
