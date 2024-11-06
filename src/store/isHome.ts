// src/stores/isHome.ts
import { writable } from 'svelte/store';
import { page } from '$app/stores';
import { goto } from '$app/navigation';
import type { Readable } from 'svelte/store';
import { cookieConsent } from "../store";

// Define `isHome` as a readable store
const isHome: Readable<boolean> = writable(false, (set) => {
  // Subscribe to changes in the `page` store
  const unsubscribePage = page.subscribe(($page) => {
    // Check if the pathname is '/' and there's no query string
    set($page.url.pathname === '/' && !$page.url.search);
  });

  // Unsubscribe when the store is no longer in use
  return () => {
    unsubscribePage();
  };
});

export default isHome;