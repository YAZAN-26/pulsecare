import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC_vBojIlAlfkBnaHtxOorznJOqfV_8JTQ",
  authDomain: "pulsecare-b9eaa.firebaseapp.com",
  projectId: "pulsecare-b9eaa",
  storageBucket: "pulsecare-b9eaa.firebasestorage.app",
  messagingSenderId: "699831636784",
  appId: "1:699831636784:web:ea560eee97797547fd6ef5"
};

// تهيئة تطبيق Firebase بطريقة آمنة لا تتكرر
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);