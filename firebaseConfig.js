// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDWtCaW15D9CfM1l3cLjrL5PCvrjihePxY",
  authDomain: "bloomimageupload.firebaseapp.com",
  projectId: "bloomimageupload",
  storageBucket: "bloomimageupload.appspot.com",
  messagingSenderId: "363498154459",
  appId: "1:363498154459:web:46bc3a90e2483af6f61ffe"
};
const app = initializeApp(firebaseConfig);


export const storage = getStorage();