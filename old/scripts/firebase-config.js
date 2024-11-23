const firebaseConfig = {
    apiKey: "AIzaSyBGL4qe8Qf4t0KqSkB48One76sV2HHbmjY",
    authDomain: "cangoldinvestment.firebaseapp.com",
    databaseURL: "https://cangoldinvestment-default-rtdb.firebaseio.com",
    projectId: "cangoldinvestment",
    storageBucket: "cangoldinvestment.appspot.com",
    messagingSenderId: "1052369951680",
    appId: "1:1052369951680:web:5c0a1bb89a58df91718625"
};

console.log("Initializing Firebase...");
firebase.initializeApp(firebaseConfig);
const database = firebase.database();