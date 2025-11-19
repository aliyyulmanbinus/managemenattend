import { initializeApp } from "firebase/app";

export const firebaseConfig = {
  apiKey: "AIzaSyAy86sfPVgIRtDphStfEdlnqODPeHGGqK0",
  authDomain: "dataattend-da1c2.firebaseapp.com",
  projectId: "dataattend-da1c2",
  storageBucket: "dataattend-da1c2.appspot.com", // sudah dibenarkan
  messagingSenderId: "887038539310",
  appId: "1:887038539310:web:886cffd779bc19fcec51bf"
};

export const app = initializeApp(firebaseConfig);
