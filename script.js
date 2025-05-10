// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase, ref, set, get } from "firebase/database";
// Import Analytics only in the browser environment
import { getAnalytics, isSupported } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD9DHeQ_oegXfg_doCUDT2ASd2xkJrti48",
  authDomain: "shark-facts.firebaseapp.com",
  databaseURL: "https://shark-facts-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "shark-facts",
  storageBucket: "shark-facts.firebasestorage.app",
  messagingSenderId: "252033399358",
  appId: "1:252033399358:web:17e7265cc8be27456aaf6f",
  measurementId: "G-N0FHSQL3XF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics only if it's supported in the environment (browser)
if (typeof window !== 'undefined' && isSupported()) {
  const analytics = getAnalytics(app);
}

// Firebase Realtime Database initialization
const db = getDatabase(app);

// Example to interact with the Realtime Database
const factId = "whale-shark-1";
const factRef = ref(db, 'facts/' + factId);

// Set data to the database
set(factRef, {
  text: "The whale shark is the largest fish in the ocean, growing up to 40 feet long.",
  image: "whale-shark-1.jpg"
}).then(() => {
  console.log("Data has been written to Firebase!");
}).catch((error) => {
  console.error("Error writing data: ", error);
});

// Fetch data from Firebase
get(factRef).then((snapshot) => {
  if (snapshot.exists()) {
    console.log(snapshot.val());
  } else {
    console.log("No data available");
  }
}).catch((error) => {
  console.error("Error fetching data: ", error);
});
