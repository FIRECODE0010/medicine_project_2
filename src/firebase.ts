// firebase.ts
import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyBOb96hgU2q0rAqEetTjXDjQuavKjCzoXs',
  authDomain: 'schoolsystem-76875.firebaseapp.com',
  projectId: 'schoolsystem-76875',
  storageBucket: 'schoolsystem-76875.appspot.com',
  messagingSenderId: '130437181027',
  appId: '1:130437181027:web:2f6d7f8be62fe974989256',
  measurementId: 'G-DT44FE0T0Y',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);

export { storage };
