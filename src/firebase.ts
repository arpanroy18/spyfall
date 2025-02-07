import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "[REDACTED_API_KEY]",
  authDomain: "spyfall-game-34324.firebaseapp.com",
  databaseURL: "https://spyfall-game-34324-default-rtdb.firebaseio.com",
  projectId: "spyfall-game-34324",
  storageBucket: "spyfall-game-34324.firebasestorage.app",
  messagingSenderId: "[REDACTED_SENDER_ID]",
  appId: "1:[REDACTED_SENDER_ID]:web:c6741dba578e6633e98e33",
  measurementId: "[REDACTED_MEASUREMENT_ID]"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);