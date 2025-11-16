
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, type Firestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Usando la configuración original y correcta del proyecto de Firebase.
// La clave de API es la que estaba configurada con los dominios correctos.
const firebaseConfig = {
  apiKey: "AIzaSyCwE7XOU4bu901_m4h2pQyjhDbS51vF05k",
  authDomain: "amplified-hull-476802-q0.web.app",
  projectId: "amplified-hull-476802-q0",
  storageBucket: "amplified-hull-476802-q0.appspot.com",
  messagingSenderId: "1048372229577",
  appId: "1:1048372229577:web:8d2a71f00889c12b13c75e"
};


// Initialize Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Initialize Firestore with the correct region and persistence settings.
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }),
});


// Export the initialized instances
export { app, auth, db };
