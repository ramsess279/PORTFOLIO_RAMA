import type { PortfolioContent } from "@/types/portfolio";

type Resume = PortfolioContent["resume"];
const legacyKey = "rg-admin-resume-draft";
const valid = (value: unknown): value is Resume => !!value && typeof value === "object" && typeof (value as Resume).url === "string" && !!(value as Resume).url;

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("rg-resume-drafts", 1);
    request.onupgradeneeded = () => request.result.createObjectStore("drafts");
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function loadResumeDraft(): Promise<Resume | null> {
  const db = await openDatabase();
  try {
    const saved = await new Promise<unknown>((resolve, reject) => {
      const request = db.transaction("drafts").objectStore("drafts").get("current");
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    if (valid(saved)) return saved;
    const legacy = sessionStorage.getItem(legacyKey);
    if (legacy) {
      const resume: unknown = JSON.parse(legacy);
      if (valid(resume)) { await saveResumeDraft(resume); return resume; }
    }
    return null;
  } finally { db.close(); }
}

// One atomic transaction preserves the last five PDFs as well as the current draft.
// IndexedDB avoids the small localStorage quota for base64-encoded documents.
export async function saveResumeDraft(resume: Resume): Promise<void> {
  if (!valid(resume)) return; // Never replace a recoverable PDF with the empty default.
  const db = await openDatabase();
  try {
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction("drafts", "readwrite");
      const store = tx.objectStore("drafts");
      const previous = store.get("current");
      previous.onsuccess = () => {
        if (valid(previous.result) && previous.result.url !== resume.url) {
          const history = store.get("history");
          history.onsuccess = () => store.put([previous.result, ...(Array.isArray(history.result) ? history.result : [])].slice(0, 5), "history");
        }
        store.put(resume, "current");
      };
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
      tx.onabort = () => reject(tx.error ?? new Error("Sauvegarde interrompue"));
    });
  } finally { db.close(); }
}
