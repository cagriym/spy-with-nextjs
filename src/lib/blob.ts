import { put } from "@vercel/blob";

const BLOB_BASE_URL = "https://ynvobcb9ww2grixg.public.blob.vercel-storage.com";

// Kullanıcı adlarını blob'a kaydet
export async function saveUsernamesToBlob(usernames: string[]) {
  const blob = new Blob([JSON.stringify(usernames)], {
    type: "application/json",
  });
  // 'usernames.json' dosyasını blob'a yükle (public erişim)
  const { url } = await put(`usernames.json`, blob, {
    access: "public",
    token: undefined,
  });
  return url;
}

// Kullanıcı adlarını blob'dan oku
export async function getUsernamesFromBlob(): Promise<string[]> {
  const res = await fetch(`${BLOB_BASE_URL}/usernames.json`);
  if (!res.ok) return [];
  return await res.json();
}

// Bölüm verisini blob'a kaydet
export async function saveSectionToBlob(
  sectionName: string,
  data: Record<string, unknown>
) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const { url } = await put(`${sectionName}.json`, blob, {
    access: "public",
    token: undefined,
  });
  return url;
}

// Bölüm verisini blob'dan oku
export async function getSectionFromBlob(
  sectionName: string
): Promise<Record<string, unknown> | null> {
  const res = await fetch(`${BLOB_BASE_URL}/${sectionName}.json`);
  if (!res.ok) return null;
  return await res.json();
}
