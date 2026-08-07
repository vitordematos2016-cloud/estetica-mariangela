const SPLASH_STORAGE_KEY = 'splash-mariangela-exibido-v1';

export function wasSplashAlreadyShown(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    return window.sessionStorage.getItem(SPLASH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function markSplashAsShown(): void {
  try {
    window.sessionStorage.setItem(SPLASH_STORAGE_KEY, 'true');
  } catch {
    /* sessionStorage indisponível — segue sem persistir */
  }
}
