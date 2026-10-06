-- Voit Proof, slice 1. Lives in its own schema inside the shared v0-voit-lab project.
-- Only the server's direct Postgres connection uses it: RLS on, no policies, no API roles.

create schema if not exists proof;
revoke all on schema proof from anon, authenticated;

create table proof.sessions (
  id            uuid primary key default gen_random_uuid(),
  pack          text not null,
  mode          text not null check (mode in ('embed', 'practice')),
  item_ids      text[] not null,                 -- the shuffled set; never sent to the browser
  current_index integer not null default 0,
  served_at     timestamptz not null default now(), -- when the current item was served
  started_at    timestamptz not null default now(),
  finished_at   timestamptz
);

create table proof.answers (
  session_id  uuid not null references proof.sessions (id) on delete cascade,
  item_id     text not null,
  position    integer not null,
  answer      jsonb not null,
  served_at   timestamptz not null,
  answered_at timestamptz not null default now(),
  score       numeric check (score in (0, 0.5, 1)), -- null for open and write items: never scored
  signals     jsonb not null default '{}'::jsonb,
  primary key (session_id, item_id)                -- answers are final
);
-- labels and the graduation report read answers by item
create index answers_item_id_idx on proof.answers (item_id);

create table proof.item_exposure (
  item_id         text primary key,
  first_served_at timestamptz not null default now(),
  serve_count     integer not null default 0
);

alter table proof.sessions enable row level security;
alter table proof.answers enable row level security;
alter table proof.item_exposure enable row level security;
