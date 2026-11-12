-- Created automatically on first use by src/lib/store.ts. Kept here for reference / manual setup.
create table if not exists orders (
  reference  text primary key,             -- Paystack reference
  email      text not null,
  product    text not null,                -- e.g. course:plan-your-business-website | resource:website-project-brief
  amount     integer not null,             -- subunit (kobo / cents)
  currency   text not null,
  status     text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists entitlements (
  email      text not null,
  product    text not null,
  source     text not null,                -- purchase | grant
  reference  text,
  created_at timestamptz not null default now(),
  primary key (email, product)
);

-- Give someone free access (comp, review copy, team member):
-- insert into entitlements (email, product, source) values ('person@example.com', 'course:plan-your-business-website', 'grant');
