import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAuth } from "firebase/auth";
import { initializeAppCheck, ReCaptchaV3Provider } from "firebase/app-check";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

let app;
let analytics = { options: {} };
let perf;
let db;
let functions;
let auth;

if (firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
      perf = getPerformance(app);
      const recaptchaKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;
      if (recaptchaKey) {
        try {
          initializeAppCheck(app, {
            provider: new ReCaptchaV3Provider(recaptchaKey),
            isTokenAutoRefreshEnabled: true,
          });
        } catch {
          // App Check initialisation is best-effort in development
        }
      }
    }

    db = getFirestore(app);
    functions = getFunctions(app);
    try {
      enableIndexedDbPersistence(db).catch(() => {
        // Persistence unavailable (multiple tabs or unsupported browser)
      });
    } catch {
      // Persistence not supported
    }
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
}

/** @type {import("firebase/app").FirebaseApp} */
export { app, analytics, perf, db, functions, auth };
