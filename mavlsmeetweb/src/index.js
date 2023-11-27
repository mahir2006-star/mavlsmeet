import React from 'react';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
var firebaseConfig = {
  apiKey: "AIzaSyBivT-PWoH_BpzIaCOsXQklZHtxxZRXoG0",
  authDomain: "mavlsmeet.firebaseapp.com",
  projectId: "mavlsmeet",
  storageBucket: "mavlsmeet.appspot.com",
  messagingSenderId: "462029514202",
  appId: "1:462029514202:web:e29d91cdeae09c1dc2cce3",
  measurementId: "G-JQ4WRC9DD8"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db=firebase.firestore();
firebase.auth().onAuthStateChanged(function(user){
  if(user!=null){
    db.collection("subscriptions").doc(user.uid)
        .onSnapshot((doc) => {
          if(doc.exists){
            var interval=setInterval(function(){
              var d=new Date();
              var date=d.getUTCDate();
              var month=d.getUTCMonth()+1;
              var year=d.getUTCFullYear();
              if(doc.data().expyear<year){
                db.collection("subscriptions").doc(user.uid).delete();
                  clearInterval(interval);
              }else if(doc.data().expyear==year && doc.data().expmonth<month){
                  db.collection("subscriptions").doc(user.uid).delete();
                    clearInterval(interval);
              }else if(doc.data().expyear==year && doc.data().expmonth==month && doc.data().expdate<date){
                  db.collection("subscriptions").doc(user.uid).delete();
                    clearInterval(interval);
              }
            },1000 * 60 * 60);
            var d=new Date();
            var date=d.getUTCDate();
            var month=d.getUTCMonth()+1;
            var year=d.getUTCFullYear();
            if(doc.data().expyear<year){
              db.collection("subscriptions").doc(user.uid).delete();
              clearInterval(interval);
            }else if(doc.data().expyear==year && doc.data().expmonth<month){
                db.collection("subscriptions").doc(user.uid).delete();
                  clearInterval(interval);
            }else if(doc.data().expyear==year && doc.data().expmonth==month && doc.data().expdate<date){
                db.collection("subscriptions").doc(user.uid).delete();
                  clearInterval(interval);
            }

          }else{
          }
        });
  }
})

ReactDOM.render(
  <React.StrictMode>
 <App />
  </React.StrictMode>,
  document.getElementById('react')
);

reportWebVitals();
