import { randomBytes } from "node:crypto";
import { appendFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

export type StoredFile = { field: string; label: string; filename: string; size: number };

export type Submission = {
  id: string;
  createdAt: string;
  type: string;
  fields: Record<string, string>;
  files: StoredFile[];
};

const IGNORED = new Set(["_hp", "_ts", "type"]);

/** Must live outside the build output and survive redeploys (VM folder or Docker volume). */
export function dataDir() {
  return process.env.DATA_DIR?.trim() || path.join(process.cwd(), "data");
}

const logFile = () => path.join(dataDir(), "submissions.jsonl");
const uploadDir = (id: string) => path.join(dataDir(), "uploads", id);

function newId() {
  const stamp = new Date().toISOString().replace(/[-:T]/g, "").slice(0, 14);
  return `${stamp}-${randomBytes(4).toString("hex")}`;
}

export async function saveSubmission(
  type: string,
  body: Record<string, unknown>,
  files: (StoredFile & { content: Buffer })[],
): Promise<Submission> {
  const id = newId();
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(body)) {
    if (IGNORED.has(key) || typeof value !== "string") continue;
    const v = value.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "").trim().slice(0, 2000);
    if (v) fields[key] = v;
  }

  if (files.length) {
    await mkdir(uploadDir(id), { recursive: true });
    for (const f of files) await writeFile(path.join(uploadDir(id), f.filename), f.content);
  }

  const record: Submission = {
    id,
    createdAt: new Date().toISOString(),
    type,
    fields,
    files: files.map(({ field, label, filename, size }) => ({ field, label, filename, size })),
  };
  await mkdir(dataDir(), { recursive: true });
  await appendFile(logFile(), `${JSON.stringify(record)}\n`, "utf8");
  return record;
}

/** Newest first. */
export async function listSubmissions(): Promise<Submission[]> {
  let raw = "";
  try {
    raw = await readFile(logFile(), "utf8");
  } catch {
    return [];
  }
  const out: Submission[] = [];
  for (const line of raw.split("\n")) {
    if (!line.trim()) continue;
    try {
      out.push(JSON.parse(line) as Submission);
    } catch {
      /* skip a partially written line */
    }
  }
  return out.reverse();
}

export async function readSubmissionFile(id: string, filename: string) {
  if (!/^[0-9]{14}-[a-f0-9]{8}$/.test(id)) return null;
  const all = await listSubmissions();
  const file = all.find((s) => s.id === id)?.files.find((f) => f.filename === filename);
  if (!file) return null;
  try {
    return { file, content: await readFile(path.join(uploadDir(id), path.basename(file.filename))) };
  } catch {
    return null;
  }
}
