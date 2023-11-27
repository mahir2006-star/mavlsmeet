import React from 'react';
import ReactDOM from 'react-dom';
import MyScheduledMeetings from './mymeetings.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import PricingPage from './PricicngPage.js';
import PrimarySearchAppBar from "./Appbardash.js";
import TricarySearchAppBar from './tricary.js';
class CheckStat extends React.Component{
  componentDidMount(){
var db=firebase.firestore();
firebase.auth().onAuthStateChanged(function(user){
  if(user!=null){
    db.collection("subscriptions").doc(user.uid)
        .onSnapshot((doc) => {
          if(doc.exists){
          ReactDOM.render(<div><PrimarySearchAppBar /><MyScheduledMeetings /></div>,document.getElementById("downboard"));
          }else{
            ReactDOM.render(<div><TricarySearchAppBar /><PricingPage /></div>,document.getElementById("downboard"));
          }
        });
  }
})

  }
  render(){
    return null;
  }
}
export default CheckStat;
