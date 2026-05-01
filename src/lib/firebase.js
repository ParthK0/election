import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getPerformance } from "firebase/performance";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
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

if (firebaseConfig.projectId) {
  try {
    app = initializeApp(firebaseConfig);
    if (typeof window !== "undefined") {
      analytics = getAnalytics(app);
      perf = getPerformance(app);
      try {
        initializeAppCheck(app, {
          provider: new ReCaptchaV3Provider("6Lc_dummy_site_key_for_app_check"),
          isTokenAutoRefreshEnabled: true
        });
      } catch (e) {
        console.warn("App Check failed to initialize:", e);
      }
    }

    db = getFirestore(app);
    functions = getFunctions(app);
    try {
      enableIndexedDbPersistence(db).catch((err) => {
        if (err.code == "failed-precondition") {
          console.warn(
            "Multiple tabs open, persistence can only be enabled in one tab at a time.",
          );
        } else if (err.code == "unimplemented") {
          console.warn("Browser does not support persistence");
        }
      });
    } catch (e) {
      console.warn("Could not enable persistence:", e);
    }

    console.log(
      "Firebase initialized successfully with Firestore and Performance Monitoring",
    );
  } catch (error) {
    console.error("Firebase initialization failed:", error);
  }
} else {
  console.log("Firebase config not found. Skipping initialization.");
}

/** @type {import("firebase/app").FirebaseApp} */
export { app, analytics, perf, db, functions };
