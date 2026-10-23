/** Persist CV / photo drafts in IndexedDB so a closed tab can restore them (localStorage cannot store File). */

const DB = "cfo40-candidature-files";
const STORE = "uploads";
const VERSION = 1;

export type DraftFileRecord = {
  field: string;
  name: string;
  type: string;
  lastModified: number;
  blob: Blob;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: "field" });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("indexedDB open failed"));
  });
}

function txDone(tx: IDBTransaction) {
  return new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("indexedDB tx failed"));
    tx.onabort = () => reject(tx.error ?? new Error("indexedDB tx aborted"));
  });
}

export async function saveDraftFile(field: string, file: File) {
  const db = await openDb();
  try {
    const record: DraftFileRecord = {
      field,
      name: file.name,
      type: file.type,
      lastModified: file.lastModified,
      blob: file,
    };
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put(record);
    await txDone(tx);
  } finally {
    db.close();
  }
}

export async function removeDraftFile(field: string) {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).delete(field);
    await txDone(tx);
  } finally {
    db.close();
  }
}

export async function clearDraftFiles() {
  const db = await openDb();
  try {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).clear();
    await txDone(tx);
  } finally {
    db.close();
  }
}

export async function loadDraftFiles(fields: string[]): Promise<Record<string, File>> {
  const db = await openDb();
  try {
    const out: Record<string, File> = {};
    await Promise.all(
      fields.map(
        (field) =>
          new Promise<void>((resolve, reject) => {
            const tx = db.transaction(STORE, "readonly");
            const req = tx.objectStore(STORE).get(field);
            req.onsuccess = () => {
              const row = req.result as DraftFileRecord | undefined;
              if (row?.blob) {
                out[field] = new File([row.blob], row.name, {
                  type: row.type || undefined,
                  lastModified: row.lastModified || Date.now(),
                });
              }
              resolve();
            };
            req.onerror = () => reject(req.error ?? new Error("indexedDB get failed"));
          }),
      ),
    );
    return out;
  } finally {
    db.close();
  }
}

/** Put a File into an <input type="file"> so FormData / validation see it. */
export function assignFileToInput(input: HTMLInputElement, file: File | null) {
  const dt = new DataTransfer();
  if (file) dt.items.add(file);
  input.files = dt.files;
}
