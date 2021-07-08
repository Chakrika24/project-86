import firebase from 'firebase';
require('@firebase/firestore')
 
const firebaseConfig = {
  apiKey: "AIzaSyACCFyoVredA8LNAv-dEaVWHQsBnXwB3f4",
  authDomain: "barter-system-57314.firebaseapp.com",
  projectId: "barter-system-57314",
  storageBucket: "barter-system-57314.appspot.com",
  messagingSenderId: "670289962854",
  appId: "1:670289962854:web:37ffdd5ae52a6752aa0aa7"
};
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();