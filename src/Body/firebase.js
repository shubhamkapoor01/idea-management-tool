import firebase from "firebase/compat/app";
import "firebase/analytics";
import "firebase/compat/auth";
import "firebase/compat/firestore";

const config = {
  apiKey: "AIzaSyCGgcnhJpc0opdwtQJTzJcj75gz89mhhvQ",
  authDomain: "ideamanagementtool.firebaseapp.com",
  projectId: "ideamanagementtool",
  storageBucket: "ideamanagementtool.appspot.com",
  messagingSenderId: "1009875366293",
  appId: "1:1009875366293:web:c843b686adebac749dc69c",
  measurementId: "G-9KKN027LNH"
};
firebase.initializeApp(config);
const db = firebase.firestore();

export default db;