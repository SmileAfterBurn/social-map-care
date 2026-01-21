import { initializeApp, getApps, getApp } from 'firebase/app';
import * as appCheckModule from 'firebase/app-check';

const { initializeAppCheck, ReCaptchaEnterpriseProvider, getToken } = appCheckModule as any;

// Використовуємо змінні середовища для конфігурації клієнтського SDK
const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY || "",
  authDomain: "gen-lang-client-0037516686.firebaseapp.com",
  projectId: "gen-lang-client-0037516686",
  storageBucket: "gen-lang-client-0037516686.firebasestorage.app",
  messagingSenderId: "763949740694",
  appId: "1:763949740694:web:d7377c20bc30c08805c8b7",
  measurementId: "G-KGEFYXVSP3"
};

let app: any;
try {
  // Ініціалізація синглтона додатка
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
} catch (e) {
  console.error("Firebase initialization failed:", e);
}

let appCheck: any = null;

if (typeof window !== 'undefined' && app) {
  try {
    // App Check ініціалізується тільки у браузері після ініціалізації додатка
    appCheck = initializeAppCheck(app, {
      provider: new ReCaptchaEnterpriseProvider('6LcVm6EqAAAAAabcdefghijklmnopqrstuvwxyz'), 
      isTokenAutoRefreshEnabled: true,
    });
    console.log("Firebase App Check initialized.");
  } catch (error) {
    console.warn('App Check initialization skipped or failed:', error);
  }
}

/**
 * Отримання токена для Google Maps (App Check integration)
 */
export const fetchAppCheckTokenForMaps = async () => {
  if (!appCheck) return { token: '' };
  try {
    const result = await getToken(appCheck, false);
    return result;
  } catch (error) {
    console.error("Error fetching App Check token:", error);
    return { token: '' };
  }
};

export { app, appCheck };