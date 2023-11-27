
import ReactDOM from 'react-dom';
import React, { Component } from 'react'
import mylogo from './logo.png';
import './App.css';
// Firebase App (the core Firebase SDK) is always required and must be listed first
import firebase from "firebase/app";
import {Avatar} from "@material-ui/core";
import Dash from './dash.js';
// If you are using v7 or any earlier version of the JS SDK, you should import firebase using namespace import
// import * as firebase from "firebase/app"

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";
// Add the Firebase products that you want to use
import "firebase/auth";
import "firebase/firestore";
import MeetingUi from "./meetinguistart.js";
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        isLoggedIn: true
    }

}







  componentDidMount() {
    firebase.auth().onAuthStateChanged(user => {
      if (user) { this.setState({ isLoggedIn: true })

    }
      else { this.setState({ isLoggedIn: false })}
    })
  }

  render() {





    return (
      <BrowserRouter>
        <Switch>
        <Route path='/login' exact  render={() => (
            this.state.isLoggedIn ? <Redirect to='/dash' />: <CreateForm />
          )} />
          <Route path='/' exact render={() => (
            this.state.isLoggedIn ? <Redirect to='/dash' />: <Redirect to='/login' />
          )} />
        <Route path='/dash' exact render={() => (
            this.state.isLoggedIn ? <Dash />: <Redirect to='/login' />
          )} />
          <Route path='/meet/:id' exact render={() => (
              this.state.isLoggedIn ? <MeetingUi />: <Redirect to='/login' />
            )} />
          <Route path="*" exact render={() => (
              <Redirect to='/404.html' />
            )} />
        </Switch>
      </BrowserRouter>
    );

  }
}


function CreateForm(){
   const uiConfig = {
  // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: '/dash',
  // We will display Google and Facebook as auth providers.
  signInOptions: [

     firebase.auth.GoogleAuthProvider.PROVIDER_ID,
     firebase.auth.TwitterAuthProvider.PROVIDER_ID,
     firebase.auth.FacebookAuthProvider.PROVIDER_ID

  ]
};

  return <div>

  <div className="w3-container">

<center><img src={mylogo} className="logo"></img></center>
</div>
<h2 className="line">Premium Video Conferencing</h2>
 <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()}/>
 <footer >Made By Mahir Jain</footer>
   </div>

}

export default App;
