import firebase from "firebase";

var firebaseConfig = {
    apiKey: "AIzaSyBHl1g2tLiLoDJIoKaWCsrdJG_T5xaoj_E",
    authDomain: "music-app-2a7e7.firebaseapp.com",
    databaseURL: "https://music-app-2a7e7.firebaseio.com",
    projectId: "music-app-2a7e7",
    storageBucket: "music-app-2a7e7.appspot.com",
    messagingSenderId: "4335188008",
    appId: "1:4335188008:web:b38bfddbe8feae83dfdd1d"
  };
  // Initialize Firebase
  const fire = firebase.initializeApp(firebaseConfig);
  export default fire;