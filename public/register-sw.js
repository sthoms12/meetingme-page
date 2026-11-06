// Registers the service worker and shows a persistent "update available"
// toast when a new version is waiting (spec §4.3 — the toast stays until
// the user acts on it; it never auto-dismisses).
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      const showUpdateToast = () => {
        if (document.getElementById('sw-update-toast')) return;
        const toast = document.createElement('div');
        toast.id = 'sw-update-toast';
        toast.setAttribute('role', 'status');
        toast.style.cssText =
          'position:fixed;bottom:1rem;left:50%;transform:translateX(-50%);z-index:70;background:#14231f;color:#f8f4ea;padding:0.7rem 1rem;border-radius:10px;display:flex;gap:1rem;align-items:center;box-shadow:0 6px 24px rgb(0 0 0/0.25);font-family:system-ui,sans-serif;';
        const text = document.createElement('span');
        text.textContent = 'A new version of B4WeMeet is available.';
        const button = document.createElement('button');
        button.textContent = 'Reload to update';
        button.style.cssText =
          'background:transparent;border:0;color:inherit;font-weight:800;cursor:pointer;text-decoration:underline;';
        button.addEventListener('click', () => window.location.reload());
        toast.append(text, button);
        document.body.appendChild(toast);
      };
      if (registration.waiting) showUpdateToast();
      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;
        installing.addEventListener('statechange', () => {
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateToast();
          }
        });
      });
    } catch {
      // Offline support is progressive enhancement; failure is silent.
    }
  });
}
