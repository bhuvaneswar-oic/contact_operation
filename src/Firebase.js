import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const settings = {timestampsInSnapshots: true};

const config = {
  apiKey: "AIzaSyDxY6aVBAihymP7qtL7dXd17tysnh7E9CY",
    authDomain: "task-b3d5c.firebaseapp.com",
    databaseURL: "https://task-b3d5c.firebaseio.com",
    projectId: "task-b3d5c",
    storageBucket: "task-b3d5c.appspot.com",
    messagingSenderId: "707663171005",
    appId: "1:707663171005:web:69c7307ad5514fe9d816d4",
    measurementId: "G-1FBKM0P5BM"
};
firebase.initializeApp(config);

firebase.firestore().settings(settings);

export default firebase;