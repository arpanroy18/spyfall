import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBsXA2EB_d-QaTrabVJTe5MMQHO8UZkCH4",
  authDomain: "spyfall-game-34324.firebaseapp.com",
  databaseURL: "https://spyfall-game-34324-default-rtdb.firebaseio.com",
  projectId: "spyfall-game-34324",
  storageBucket: "spyfall-game-34324.firebasestorage.app",
  messagingSenderId: "360435592906",
  appId: "1:360435592906:web:c6741dba578e6633e98e33",
  measurementId: "G-2Z5H7CYGB3"
};

const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const db = getDatabase(app);