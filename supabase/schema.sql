-- Run this in the Supabase SQL editor (Project -> SQL Editor -> New query)
-- on a fresh project. Safe to re-run: every statement is guarded.

create extension if not exists "pgcrypto";

-- One row per couple/account. The public site looks couples up by slug.
create table if not exists couples (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  partner_a_name text,
  partner_b_name text,
  anniversary_date date,
  theme text default 'default',
  created_at timestamptz not null default now()
);

-- The editable letter/timeline/quiz/etc. content for a couple. Mirrors the
-- shape of the old static config.js per-mode objects, but as one live row.
create table if not exists couple_content (
  couple_id uuid primary key references couples(id) on delete cascade,
  greeting text default '',
  paragraphs jsonb not null default '[]',
  closing text default '',
  signature text default '',
  timeline jsonb not null default '[]',
  quiz jsonb not null default '[]',
  reasons jsonb not null default '[]',
  playlist jsonb not null default '[]',
  gallery jsonb not null default '[]',
  updated_at timestamptz not null default now()
);

-- Gamification state (No-click count, achievements, XP, sealed letter) so
-- it survives a refresh instead of living only in React state.
create table if not exists couple_progress (
  couple_id uuid primary key references couples(id) on delete cascade,
  no_count int not null default 0,
  achievements jsonb not null default '[]',
  xp int not null default 0,
  letter_revealed_paragraphs int not null default 0,
  letter_sealed boolean not null default false,
  updated_at timestamptz not null default now()
);

alter table couples enable row level security;
alter table couple_content enable row level security;
alter table couple_progress enable row level security;

-- couples: anyone can look up a couple by slug (needed for the public
-- letter page); only the owner can create/edit/delete their own row.
drop policy if exists "couples public read" on couples;
create policy "couples public read" on couples
  for select using (true);

drop policy if exists "couples owner write" on couples;
create policy "couples owner write" on couples
  for insert with check (auth.uid() = owner_id);

drop policy if exists "couples owner update" on couples;
create policy "couples owner update" on couples
  for update using (auth.uid() = owner_id);

drop policy if exists "couples owner delete" on couples;
create policy "couples owner delete" on couples
  for delete using (auth.uid() = owner_id);

-- couple_content: public read (the whole point is a shareable page);
-- only the owning couple can write their own content.
drop policy if exists "content public read" on couple_content;
create policy "content public read" on couple_content
  for select using (true);

drop policy if exists "content owner write" on couple_content;
create policy "content owner write" on couple_content
  for insert with check (
    auth.uid() = (select owner_id from couples where id = couple_id)
  );

drop policy if exists "content owner update" on couple_content;
create policy "content owner update" on couple_content
  for update using (
    auth.uid() = (select owner_id from couples where id = couple_id)
  );

-- couple_progress: public read/update — this is low-stakes gamification
-- state (No-click count, XP), not sensitive data, and the partner reading
-- the public link (who isn't the account owner) is the one advancing it.
-- Only the owner can create the initial row (done at couple-creation time).
drop policy if exists "progress public read" on couple_progress;
create policy "progress public read" on couple_progress
  for select using (true);

drop policy if exists "progress public update" on couple_progress;
create policy "progress public update" on couple_progress
  for update using (true);

drop policy if exists "progress owner insert" on couple_progress;
create policy "progress owner insert" on couple_progress
  for insert with check (
    auth.uid() = (select owner_id from couples where id = couple_id)
  );

create index if not exists couples_slug_idx on couples (slug);
