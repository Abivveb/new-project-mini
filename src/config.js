import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDy9IA5R1QuyCLVciewMutOojxTnuD9iCM",
  authDomain: "storage-post-d20ed.firebaseapp.com",
  projectId: "storage-post-d20ed",
  storageBucket: "storage-post-d20ed.appspot.com",
  messagingSenderId: "38849219491",
  appId: "1:38849219491:web:8fc9290bde2e939c57e816"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)
export const db = getDatabase(app)