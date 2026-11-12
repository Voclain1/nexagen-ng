import "server-only";
import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { isProduction } from "./config";

/**
 * Persistence for orders and entitlements (who owns which course/resource).
 *
 * Production: set DATABASE_URL to any Postgres (Neon, Supabase, Vercel Postgres…).
 * Tables are created automatically on first use; see db/schema.sql.
 * Development without DATABASE_URL: a JSON file in .data/ (git-ignored).
 */

export type Entitlement = { email: string; product: string; source: "purchase" | "grant"; reference?: string; createdAt: string };
export type Order = { reference: string; email: string; product: string; amount: number; currency: string; status: "pending" | "paid" | "failed"; createdAt: string };

interface Store {
  hasEntitlement(email: string, product: string): Promise<boolean>;
  listEntitlements(email: string): Promise<Entitlement[]>;
  grant(entitlement: Omit<Entitlement, "createdAt">): Promise<void>;
  createOrder(order: Omit<Order, "createdAt" | "status">): Promise<void>;
  getOrder(reference: string): Promise<Order | null>;
  setOrderStatus(reference: string, status: Order["status"]): Promise<void>;
}

/* ------------------------------------------------------------- postgres */

let sql: ReturnType<typeof postgres> | null = null;
let ready: Promise<unknown> | null = null;

function db() {
  sql ??= postgres(process.env.DATABASE_URL!, { max: 3, idle_timeout: 20, prepare: false });
  ready ??= sql`
    create table if not exists orders (reference text primary key, email text not null, product text not null, amount integer not null, currency text not null, status text not null default 'pending', created_at timestamptz not null default now());
    create table if not exists entitlements (email text not null, product text not null, source text not null, reference text, created_at timestamptz not null default now(), primary key (email, product));
  `.simple();
  return ready.then(() => sql!);
}

const postgresStore: Store = {
  async hasEntitlement(email, product) {
    const rows = await (await db())`select 1 from entitlements where email = ${email} and product = ${product} limit 1`;
    return rows.length > 0;
  },
  async listEntitlements(email) {
    const rows = await (await db())`select email, product, source, reference, created_at from entitlements where email = ${email} order by created_at desc`;
    return rows.map((r) => ({ email: r.email, product: r.product, source: r.source, reference: r.reference ?? undefined, createdAt: new Date(r.created_at).toISOString() }));
  },
  async grant(e) {
    await (await db())`insert into entitlements (email, product, source, reference) values (${e.email}, ${e.product}, ${e.source}, ${e.reference ?? null}) on conflict (email, product) do nothing`;
  },
  async createOrder(o) {
    await (await db())`insert into orders (reference, email, product, amount, currency) values (${o.reference}, ${o.email}, ${o.product}, ${o.amount}, ${o.currency})`;
  },
  async getOrder(reference) {
    const [r] = await (await db())`select * from orders where reference = ${reference}`;
    return r ? { reference: r.reference, email: r.email, product: r.product, amount: r.amount, currency: r.currency, status: r.status, createdAt: new Date(r.created_at).toISOString() } : null;
  },
  async setOrderStatus(reference, status) {
    await (await db())`update orders set status = ${status} where reference = ${reference}`;
  },
};

/* --------------------------------------------------------- dev json file */

const FILE = path.join(process.cwd(), ".data", "store.json");
type FileData = { orders: Order[]; entitlements: Entitlement[] };
const load = (): FileData => (fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE, "utf8")) : { orders: [], entitlements: [] });
const save = (data: FileData) => { fs.mkdirSync(path.dirname(FILE), { recursive: true }); fs.writeFileSync(FILE, JSON.stringify(data, null, 2)); };

const fileStore: Store = {
  async hasEntitlement(email, product) { return load().entitlements.some((e) => e.email === email && e.product === product); },
  async listEntitlements(email) { return load().entitlements.filter((e) => e.email === email); },
  async grant(e) { const data = load(); if (!data.entitlements.some((x) => x.email === e.email && x.product === e.product)) data.entitlements.push({ ...e, createdAt: new Date().toISOString() }); save(data); },
  async createOrder(o) { const data = load(); data.orders.push({ ...o, status: "pending", createdAt: new Date().toISOString() }); save(data); },
  async getOrder(reference) { return load().orders.find((o) => o.reference === reference) ?? null; },
  async setOrderStatus(reference, status) { const data = load(); const order = data.orders.find((o) => o.reference === reference); if (order) order.status = status; save(data); },
};

export function store(): Store {
  if (process.env.DATABASE_URL) return postgresStore;
  if (isProduction) throw new Error("DATABASE_URL must be set in production to store orders and course access.");
  return fileStore;
}

export const isStoreConfigured = () => Boolean(process.env.DATABASE_URL) || !isProduction;
