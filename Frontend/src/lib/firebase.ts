
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDcLJqcVojK3S8eTcmgzwfrSdQXFJWclGY",
  authDomain: "xeno-crm.firebaseapp.com",
  projectId: "xeno-crm",
  storageBucket: "xeno-crm.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnopqrstuv"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
