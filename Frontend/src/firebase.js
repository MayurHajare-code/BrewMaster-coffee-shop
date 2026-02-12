import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDJQxIDepH8WzMsCTgn_KtSqep_hKyXGCo",
  authDomain: "brewmaster---coffee-shop.firebaseapp.com",
  projectId: "brewmaster---coffee-shop",
  storageBucket: "brewmaster---coffee-shop.appspot.com", // ← fix this too (remove ".app")
  messagingSenderId: "154166752750",
  appId: "1:154166752750:web:c63ab8d680c5ec09128aff"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);



// check the code and give me suggestion (keep remember don;'t change logic or any big changes, just clean and professional real world practice code i want )