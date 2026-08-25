-- NEONDO simple production features
-- Run this migration in Supabase SQL Editor once.

create table if not exists public.neondo_notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  title text not null,
  body text not null,
  kind text not null default 'general',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.neondo_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null,
  recipient_id uuid not null,
  shift_id uuid,
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now()
);

create table if not exists public.neondo_favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null,
  shift_id uuid not null,
  created_at timestamptz not null default now(),
  unique(user_id, shift_id)
);

create table if not exists public.neondo_reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null,
  reviewee_id uuid not null,
  shift_id uuid,
  rating integer not null check (rating between 1 and 5),
  comment text check (char_length(comment) <= 1000),
  created_at timestamptz not null default now(),
  unique(reviewer_id, reviewee_id, shift_id)
);

create index if not exists neondo_notifications_user_created_idx on public.neondo_notifications(user_id, created_at desc);
create index if not exists neondo_messages_pair_created_idx on public.neondo_messages(sender_id, recipient_id, created_at);
create index if not exists neondo_favorites_user_idx on public.neondo_favorites(user_id);
create index if not exists neondo_reviews_reviewee_idx on public.neondo_reviews(reviewee_id, created_at desc);

alter table public.neondo_notifications enable row level security;
alter table public.neondo_messages enable row level security;
alter table public.neondo_favorites enable row level security;
alter table public.neondo_reviews enable row level security;

-- Users can only read/update their own notifications.
create policy "notifications own read" on public.neondo_notifications for select using (auth.uid() = user_id);
create policy "notifications own update" on public.neondo_notifications for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Messages are private to sender/recipient.
create policy "messages participants read" on public.neondo_messages for select using (auth.uid() = sender_id or auth.uid() = recipient_id);
create policy "messages sender insert" on public.neondo_messages for insert with check (auth.uid() = sender_id);

-- Favorites belong to the current user.
create policy "favorites own all" on public.neondo_favorites for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Reviews can be read publicly, but only the reviewer can create their own review.
create policy "reviews read" on public.neondo_reviews for select using (true);
create policy "reviews own insert" on public.neondo_reviews for insert with check (auth.uid() = reviewer_id);
