import PocketBase from 'https://cdn.jsdelivr.net/npm/pocketbase@0.21.3/dist/pocketbase.es.mjs';
export const pb = new PocketBase('http://127.0.0.1:8090');

// Mantener sesión entre recargas
pb.authStore.loadFromCookie(document.cookie);
pb.authStore.onChange(() => {
  document.cookie = pb.authStore.exportToCookie({ httpOnly: false });
});
