import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import {CircularProgress,List,ListItem,IconButton,ListItemSecondaryAction,ListItemText,Button} from '@material-ui/core';
import DeleteIcon from '@material-ui/icons/Delete';
import LaunchIcon from '@material-ui/icons/Launch';
const deletemeet=(e)=>{
  firebase.firestore().collection("rooms").doc(e).delete();
}
class MyScheduledMeetings extends React.Component{
  componentDidMount(){
var db=firebase.firestore();
firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    db.collection("subscriptions").doc(user.uid)
        .onSnapshot((doc) => {
        document.querySelector("span[data-context=expiry]").innerHTML="Your plan will expire on "+doc.data().expdate+"/"+doc.data().expmonth+"/"+doc.data().expyear;
        });
    db.collection("rooms").where("owner", "==",user.uid).where("type","!=","fast")
        .onSnapshot(function(querySnapshot) {
          ReactDOM.render(null,document.getElementById("meetlist"));
    if(querySnapshot.size>0){
      if(document.getElementById("metcrc")){
          document.getElementById("metcrc").remove();
      }
  document.getElementById("meetinglist").style.display="block";
    }else{
      var dxv=document.createElement('div');
      dxv.id="metcrc";
      document.getElementById("downboard").appendChild(dxv);
      document.getElementById("meetinglist").style.display="none";
 db.collection("subscriptions").doc(user.uid)
        .onSnapshot((doc) => {
        ReactDOM.render(<center><span data-context="expiry">Your plan will expire on {doc.data().expdate}/{doc.data().expmonth}/{doc.data().expyear}</span><br/><br/><p>No scheduled meetings found!</p></center>,document.getElementById("metcrc"));
        });

    }
            querySnapshot.forEach(function(doc) {
              var div=document.createElement("div");
              div.style.width="100%";
              document.getElementById("meetlist").appendChild(div);
              var hours=doc.data().hours;
              var meetnamer=doc.data().name;
              if(meetnamer.length>15){
                meetnamer=meetnamer.substring(0,15)+'...';
              }
              ReactDOM.render(<ListItem><ListItemText>{meetnamer}</ListItemText><Button>{doc.id}</Button><Button>{doc.data().datenum}/{doc.data().month}/{doc.data().year}({hours}:{doc.data().mins})</Button><Button onClick={()=>{window.location="/meet/"+doc.id}}><LaunchIcon /></Button><Button onClick={()=>{deletemeet(doc.id)}}><DeleteIcon /></Button></ListItem>,div);
            });

        });
  } else {

  }
});

  }
  render(){
    return(
         <div id="meetinglist"><center><span data-context="expiry"></span></center><List id="meetlist"></List></div>
    );
  }
}
export default MyScheduledMeetings;
