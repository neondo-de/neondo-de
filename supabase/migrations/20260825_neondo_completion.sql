-- NEONDO completion migration; mirrors the production migrations applied through the Supabase connector.

create table if not exists public.neondo_member_emblems (
  user_id uuid primary key references auth.users(id) on delete cascade,
  emblem text not null check (emblem in ('founder','co-founder','ceo','coo','admin','staff','developer','moderator','company','verified-company','organizer','crew','top-crew','verified')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.neondo_member_emblems enable row level security;
create policy if not exists "member emblems public read" on public.neondo_member_emblems for select using (true);
create policy if not exists "member emblems admin write" on public.neondo_member_emblems for all using ((select is_admin())) with check ((select is_admin()));
create index if not exists neondo_member_emblems_emblem_idx on public.neondo_member_emblems(emblem);

create table if not exists public.neondo_messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references auth.users(id) on delete cascade,
  recipient_id uuid not null references auth.users(id) on delete cascade,
  shift_id uuid references public.shifts(id) on delete set null,
  body text not null check (char_length(body) between 1 and 2000),
  read_at timestamptz,
  created_at timestamptz not null default now()
);
alter table public.neondo_messages enable row level security;
create policy if not exists "messages participants read" on public.neondo_messages for select to authenticated using ((select auth.uid())=sender_id or (select auth.uid())=recipient_id);
create policy if not exists "messages sender insert" on public.neondo_messages for insert to authenticated with check ((select auth.uid())=sender_id);
create policy if not exists "messages recipient update" on public.neondo_messages for update to authenticated using ((select auth.uid())=recipient_id) with check ((select auth.uid())=recipient_id);

create table if not exists public.neondo_favorites (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  shift_id uuid not null references public.shifts(id) on delete cascade, created_at timestamptz not null default now(), unique(user_id,shift_id)
);
alter table public.neondo_favorites enable row level security;
create policy if not exists "favorites own all" on public.neondo_favorites for all to authenticated using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);

create table if not exists public.neondo_reviews (
  id uuid primary key default gen_random_uuid(), reviewer_id uuid not null references auth.users(id) on delete cascade,
  reviewee_id uuid not null references auth.users(id) on delete cascade, shift_id uuid references public.shifts(id) on delete set null,
  rating integer not null check (rating between 1 and 5), comment text check (char_length(comment)<=1000), created_at timestamptz not null default now(), unique(reviewer_id,reviewee_id,shift_id)
);
alter table public.neondo_reviews enable row level security;
create policy if not exists "reviews public read" on public.neondo_reviews for select using (true);
create policy if not exists "reviews own insert" on public.neondo_reviews for insert to authenticated with check ((select auth.uid())=reviewer_id);
create policy if not exists "reviews own update" on public.neondo_reviews for update to authenticated using ((select auth.uid())=reviewer_id) with check ((select auth.uid())=reviewer_id);

create index if not exists neondo_messages_pair_idx on public.neondo_messages(least(sender_id,recipient_id),greatest(sender_id,recipient_id),created_at desc);
create index if not exists neondo_reviews_reviewee_idx on public.neondo_reviews(reviewee_id,created_at desc);

create index if not exists notifications_user_unread_idx on public.notifications(user_id,read_at,created_at desc);
create schema if not exists neondo_internal;
revoke all on schema neondo_internal from public;
grant usage on schema neondo_internal to authenticated;

create or replace function neondo_internal.notify_application_change()
returns trigger language plpgsql security definer set search_path=public,neondo_internal as $$
declare company_id uuid; shift_title text;
begin
  select e.company_id,s.title into company_id,shift_title from public.shifts s join public.events e on e.id=s.event_id where s.id=new.shift_id;
  if tg_op='INSERT' then
    insert into public.notifications(user_id,title,body,link) values(company_id,'New crew application','A crew member applied to '||coalesce(shift_title,'your shift')||'.','/company/applications');
  elsif tg_op='UPDATE' and old.status is distinct from new.status and new.status in ('accepted','rejected') then
    insert into public.notifications(user_id,title,body,link) values(new.worker_id,case when new.status='accepted' then 'Application accepted' else 'Application update' end,case when new.status='accepted' then 'Your shift application was accepted.' else 'Your shift application was rejected.' end,'/schedule');
  end if;
  return new;
end; $$;
revoke all on function neondo_internal.notify_application_change() from public;
grant execute on function neondo_internal.notify_application_change() to authenticated;
drop trigger if exists neondo_application_change_notification on public.applications;
create trigger neondo_application_change_notification after insert or update of status on public.applications for each row execute function neondo_internal.notify_application_change();
