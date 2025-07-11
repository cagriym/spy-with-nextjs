import { put } from "@vercel/blob";

// Kullanıcı adlarını blob'a kaydet
export async function saveUsernamesToBlob(usernames: string[]) {
  const blob = new Blob([JSON.stringify(usernames)], {
    type: "application/json",
  });
  // 'usernames.json' dosyasını blob'a yükle (public erişim)
  const { url } = await put("usernames.json", blob, { access: "public" });
  return url;
}

// Kullanıcı adlarını blob'dan oku
export async function getUsernamesFromBlob(blobUrl: string): Promise<string[]> {
  const res = await fetch(blobUrl);
  if (!res.ok) return [];
  return await res.json();
}

// Bölüm verisini blob'a kaydet
export async function saveSectionToBlob(
  sectionName: string,
  data: Record<string, unknown>
) {
  const blob = new Blob([JSON.stringify(data)], { type: "application/json" });
  const { url } = await put(`${sectionName}.json`, blob, { access: "public" });
  return url;
}

// Bölüm verisini blob'dan oku
export async function getSectionFromBlob(
  blobUrl: string
): Promise<Record<string, unknown> | null> {
  const res = await fetch(blobUrl);
  if (!res.ok) return null;
  return await res.json();
}
