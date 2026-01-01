import { useUserStore } from "../store/UserStore";

export async function waitForUserStoreHydration(timeoutMs = 50000) {
  const state = useUserStore.getState();

  // Already hydrated or error present
  if (state.isHydrated || state.error) return;

  await new Promise((resolve) => {
    const unsub = useUserStore.subscribe(
      (state) => ({ hydrated: state.isHydrated, error: state.error }),
      ({ hydrated, error }) => {
        if (hydrated || error) {
          resolve();
          unsub();
        }
      }
    );

    // Fallback timeout
    const timer = setTimeout(() => {
      resolve();
      unsub();
    }, timeoutMs);
  });

  return;
}
