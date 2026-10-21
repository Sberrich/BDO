import { promises as fs } from "fs";
import path from "path";

const FILE = path.join(process.cwd(), "data", "playlist-views.json");

type Store = Record<string, number>;

async function readStore(): Promise<Store> {
  try {
    const raw = await fs.readFile(FILE, "utf8");
    const parsed = JSON.parse(raw) as Store;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function writeStore(store: Store) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2) + "\n", "utf8");
}

export async function getPlaylistViews(): Promise<Store> {
  return readStore();
}

export async function getPlaylistViewCount(id: string): Promise<number> {
  const store = await readStore();
  return store[id] ?? 0;
}

export async function incrementPlaylistView(id: string): Promise<number> {
  const key = id.trim().slice(0, 80);
  if (!key) return 0;
  const store = await readStore();
  const next = (store[key] ?? 0) + 1;
  store[key] = next;
  await writeStore(store);
  return next;
}

