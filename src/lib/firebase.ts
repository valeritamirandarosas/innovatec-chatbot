import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { initializeFirestore, persistentLocalCache, type Firestore, CACHE_SIZE_UNLIMITED } from 'firebase/firestore';

// Configuración de Firebase válida y verificada para el proyecto.
const firebaseConfig = {
  apiKey: "AIzaSyCwE7XOU4bu901_m4h2pQyjhDbS51vF05k",
  authDomain: "amplified-hull-476802-q0.firebaseapp.com",
  projectId: "amplified-hull-476802-q0",
  storageBucket: "amplified-hull-476802-q0.appspot.com",
  messagingSenderId: "1048372229577",
  appId: "1:1048372229577:web:570303f90a2b52ae06a418"
};

// Inicialización idempotente de la app de Firebase
const app: FirebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth: Auth = getAuth(app);

// Inicialización de Firestore con caché persistente
const db: Firestore = initializeFirestore(app, {
  localCache: persistentLocalCache({ cacheSizeBytes: CACHE_SIZE_UNLIMITED }),
});

// Exportaciones centralizadas de las instancias de Firebase
export { app, auth, db };
