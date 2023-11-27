import React from 'react';
import ReactDOM from 'react-dom';
import {Button,CircularProgress,LinearProgress,Typography,Avatar,IconButton} from '@material-ui/core';
import firebase from 'firebase/app';
import mylogo from './logo.png';
import 'firebase/auth';
import 'firebase/firestore';
import MicIcon from '@material-ui/icons/Mic';
import userposter from './defaultuserphoto.jpg';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import BlurOnIcon from '@material-ui/icons/BlurOn';
import * as DetectRTC from 'detectrtc';
import hark from 'hark';
import * as tfjs from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import BlurOffIcon from '@material-ui/icons/BlurOff';
import { makeStyles } from '@material-ui/core/styles';
import SettingsIcon from '@material-ui/icons/Settings';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import $ from 'jquery';
import Meeting from './meet.js';
import {
  useParams
} from "react-router-dom";
let micparam=true;
let videoparam=true;
let blurred=false;
let cameraid,micid;
let ownerofmeet=false;
var camerarr=[];
var micarr=[];
var micarrs=[];
var camerarrs=[];
let roomid,roomowner;
const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    '& > *': {
      margin: theme.spacing(1),
    },
  },
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  large: {
    width: theme.spacing(20),
    height: theme.spacing(20),
  },
}));
const join=()=>{
  if(ownerofmeet){
        ReactDOM.render(<div><Typography>Joining</Typography><br /><CircularProgress /></div>,document.querySelector(".info"));
        ReactDOM.render(<Meeting roomid={roomid} videoblur={blurred} owner={true} cameraid={cameraid} camera={videoparam} micid={micid} mic={micparam} />,document.querySelector("#react"));
  }else{
            ReactDOM.render(<div><Typography>Joining(Waiting for permission)</Typography><br /><CircularProgress /></div>,document.querySelector(".info"));
            var db=firebase.firestore();
    db.collection("requests").add({
    name: firebase.auth().currentUser.displayName,
    roomid:roomid,
    email:firebase.auth().currentUser.email,
    accept:"1",
    owner:firebase.auth().currentUser.uid,
    roomowner:roomowner
})
.then((docRef) => {
  db.collection("requests").doc(docRef.id)
      .onSnapshot((doc) => {
          if(doc.data().accept=="2"){
              ReactDOM.render(<Meeting roomid={roomid} cameraid={cameraid} micid={micid} videoblur={blurred} camera={videoparam} mic={micparam} owner={false} token={docRef.id} />,document.querySelector("#react"));
          }else if(doc.data().accept=="3"){
            if(document.querySelector(".info")){
                          ReactDOM.render(<div><Typography>Sorry! Request Rejected</Typography></div>,document.querySelector(".info"));
            }
          }
      });
})
.catch((error) => {
    console.error("Error adding document: ", error);
});
  }

}
const blur=()=>{
        document.querySelector(".hrline").style.display="block";
  if(blurred){
      const canvas=document.querySelector(".previewcanvas");
      canvas.style.display="none";
    blurred=false;
          document.querySelector(".hrline").style.display="none";
      ReactDOM.render( <IconButton title="Blur Background" onClick={blur} id="circback" ><BlurOnIcon style={{color:"black"}} /></IconButton>,document.querySelector(".blurdiv"));
  }else{
    ReactDOM.render(<IconButton title="Blur Background" onClick={blur} id="circback" ><BlurOffIcon style={{color:"black"}} /></IconButton>,document.querySelector(".blurdiv"));
    blurred=true;
      const canvas=document.querySelector(".previewcanvas");
    var video=document.querySelector(".previewvideo");
    video.height=video.videoHeight;
    video.width=video.videoWidth;
    canvas.style.display="block";
    var options = {
       multiplier: 1,
       stride: 23,
       quantBytes: 4
     }
     bodyPix.load(options)
       .then(net => blurvideo(net))
       .catch(err => console.log(err))
  }
}
async function blurvideo(net){
  if(document.querySelector(".hrline") && document.querySelector(".hrline").style.display!="none"){
        document.querySelector(".hrline").style.display="none";
  }
  const canvas=document.querySelector(".previewcanvas");
  var video=document.querySelector(".previewvideo");
  if(video){
    const segmentation = await net.segmentPerson(video);

       const backgroundBlurAmount = 6;
       const edgeBlurAmount = 2;
       const flipHorizontal =false;

       bodyPix.drawBokehEffect(
         canvas,video, segmentation, backgroundBlurAmount,
         edgeBlurAmount, flipHorizontal);
         if(blurred){
              blurvideo(net);
         }
  }

   }
const mutevideo=()=>{
  var stream=document.querySelector(".previewvideo").srcObject;
  if(videoparam){
    const canvas=document.querySelector(".previewcanvas");
    canvas.style.display="none";
    var video=document.querySelector(".previewvideo");
    video.style.display="block";
    var camoff=document.querySelector(".videoff");
    camoff.style.display="block";
    videoparam=false;
    stream.getVideoTracks()[0].enabled=false;
    document.querySelector(".blurdiv").style.display="none";
    ReactDOM.render(<VideocamOffIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("videordx"));
  }else{
        document.querySelector(".blurdiv").style.display="block";
    var camoff=document.querySelector(".videoff");
    camoff.style.display="none";
    const canvas=document.querySelector(".previewcanvas");
    canvas.style.display="none";
    var video=document.querySelector(".previewvideo");
    video.style.display="block";
    if(blurred){
      blurred=false;
      blur();
    }
      videoparam=true;
    stream.getVideoTracks()[0].enabled=true;
    ReactDOM.render(<VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("videordx"));
  }

}
const applychanges=()=>{
micid=document.getElementById("micid").value;
cameraid=document.getElementById("camid").value;
document.getElementById("mediadevuices").remove();
}
const getsettings=()=>{
  var div=document.createElement("div");
  document.body.appendChild(div);
  ReactDOM.render(  <Dialog id="mediadevuices" open={true} onClose={()=>{}} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Devices</DialogTitle>
        <DialogContent>
        <p>Cameras</p>
        <select id="camid">
        {camerarr.map((person, index) => (
    <option value={person.id}>{person.name}</option>
  ))}
        </select>
        <br />
        <p>Mics</p>
        <select id="micid">
        {micarr.map((person, index) => (
      <option value={person.id}>{person.name}</option>
      ))}
        </select>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{div.remove();document.getElementById("mediadevuices").remove();}} color="primary">
            Cancel
          </Button>
          <Button onClick={applychanges} color="primary">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>,div);
}
const mutemic=()=>{
  var stream=document.querySelector(".previewvideo").srcObject;
  if(micparam){
    micparam=false;
    stream.getAudioTracks()[0].enabled=false;
    ReactDOM.render(<MicOffIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("micrdx"));
  }else{
      micparam=true;
    stream.getAudioTracks()[0].enabled=true;
    ReactDOM.render(<MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("micrdx"));
  }
}
function MeetingUi() {
  const styles=useStyles();
  let { id } = useParams();
  roomid=id;
  var db=firebase.firestore();
  DetectRTC.load(function() {
            DetectRTC.videoInputDevices.forEach(function(device, idx) {
              if(!camerarrs.includes(device.id)){
                var mso={};
                mso.id=device.id;
                mso.name=device.label;
                camerarr.push(mso);
                camerarrs.push(device.id);
              }
                if(idx==0){
                  cameraid=device.id;
                }
            });
            DetectRTC.audioInputDevices.forEach(function(device, idx) {
              if(!micarrs.includes(device.id)){
                var mso={};
                mso.id=device.id;
                mso.name=device.label;
              micarr.push(mso);
              micarrs.push(device.id);
              }
                if(idx==0){
                  micid=device.id;
                }
            });
        });
    const constraints = {
      "video":true,
    'audio':true
}
navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
      if(document.querySelector(".previewvideo").srcObject==null){
            document.querySelector(".previewvideo").srcObject=stream;
      }
      if(document.querySelector(".hrline")){
            document.querySelector(".hrline").style.display="none";
      }
      var options = {};
       var speechEvents = hark(document.querySelector(".previewvideo").srcObject, options);

       speechEvents.on('speaking', function() {
       });
       ReactDOM.render(<IconButton title="Settings" id="circfront" onClick={getsettings}><SettingsIcon style={{color:"black"}} /></IconButton>,document.querySelector(".settingsdiv"));
 ReactDOM.render( <IconButton title="Blur Background" onClick={blur} id="circback" ><BlurOnIcon style={{color:"black"}} /></IconButton>,document.querySelector(".blurdiv"));
      ReactDOM.render(<div><IconButton id="micrdx" onClick={mutemic}><MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton>
      <IconButton id="videordx" onClick={mutevideo}><VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton></div>,document.querySelector(".ucr"));
    })
    .catch(error => {
        alert('Error accessing media devices.', error);
        window.location="/dash";
    });
    var db=firebase.firestore();
    db.collection("rooms").doc(id).get().then(function(doc){
      if(doc.exists){
        if(doc.data().owner==firebase.auth().currentUser.uid){
          ownerofmeet=true;
          firebase.auth().onAuthStateChanged(function(user){
            if(user!=null){
              db.collection("subscriptions").doc(user.uid)
                  .onSnapshot((doc) => {
                    if(doc.exists){

                    }else{
                    window.location="/dash";
                    }
                  });
            }
          })
        }
        roomowner=doc.data().owner;
        var meetnamer=doc.data().name;
        if(meetnamer.length>15){
          meetnamer=meetnamer=meetnamer.substring(0,15)+"...";
        }
        ReactDOM.render(<div><Typography>{meetnamer}</Typography><br /><Button onClick={join} variant="contained" color="primary">Join</Button></div>,document.querySelector(".info"));
      }else{
window.location="/dash";
      }
    }).catch(function(error){
window.location="/dash";
    });
    firebase.auth().onAuthStateChanged(function(user){
      if(user!=null){
        var name=user.displayName;
        if(name.length>15){
          name=name.substring(0,15)+"...";
        }
        var prourl=userposter;
        if(user.photoURL!=null){
          prourl=user.photoURL;
        }
        ReactDOM.render(<div><p>{user.email}<Avatar src={prourl} alt={user.displayName} className="userphoto" /><br/>{name}</p></div>,document.querySelector(".userphoto"));
ReactDOM.render(<img height="100%" width="100%" src={prourl} />,document.querySelector(".videoff"));
}
    });
    return(
      <div>
      <div className="w3-container">
<img src={mylogo} alt="MavlsMeet" className="meetuilogo" onClick={()=>{window.location="/dash"}} />
    <div className="userphoto">
    </div>
    </div>
    <div className="preview">
    <video className="previewvideo"  autoPlay={true} playsInline={true}  muted volume="0" width="100%" height="100%" />
      <canvas className="previewcanvas"  width="100%" height="100%" style={{display:"none"}}/>
            <div className="videoff" style={{display:"none"}}></div>
        <center className="mediafail" style={{display:"none"}}><Typography>Media Devices failed</Typography></center>
      <div className="blurdiv"></div>
      <div className="settingsdiv"></div>
          <LinearProgress className="hrline" />
        <center className="ucr"></center>

    </div>
    <div className="info">
    <CircularProgress />
    </div>
    </div>
  );


}
export default MeetingUi;
