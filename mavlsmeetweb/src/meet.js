import React, { useState }  from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import Pinon from './pin.svg';
import Pinoff from './pinoff.svg';
import muteicon from './mute.svg';
import Popover from '@material-ui/core/Popover';
import './meet.css';
import 'firebase/auth';
import hark from 'hark';
import 'firebase/firestore';
import $ from 'jquery';
import Peer from 'peerjs';
import RecordRTC from 'recordrtc';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import SecurityIcon from '@material-ui/icons/Security';
import {IconButton,Typography,Button,List,ListItem,ListItemText,Avatar,ListItemIcon,AppBar,Toolbar} from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import PeopleIcon from '@material-ui/icons/People';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import ChatIcon from '@material-ui/icons/Chat';
import * as tfjs from '@tensorflow/tfjs';
import * as bodyPix from '@tensorflow-models/body-pix';
import MicIcon from '@material-ui/icons/Mic';
import userposter from './defaultuserphoto.jpg';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import CallEndIcon from '@material-ui/icons/CallEnd';
import CloseIcon from '@material-ui/icons/Close';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import * as VideoStreamMerger from 'video-stream-merger';
import AlbumIcon from '@material-ui/icons/Album';
import StopIcon from '@material-ui/icons/Stop';
import h from './helpers.js';
import { io } from 'socket.io-client';
import * as DetectRTC from 'detectrtc';
let merger,addedstream;
let recorder;
var camerarr=[];
var micarr=[];
var micarrs=[];
var camerarrs=[];
let cameraid,micid;
let mode="grid";
let secondaryscreen="";
let beforeuser=[];
var canvnet;
let divider=0;;
let socket,roomid,discretion;
let activespeaker;
let screensocket;
let socketId;
let screenrecstream;
var peers=[];
var pinnedevivsarr=[];
let px,peer,call;
var pc = [];
let myStream;
let streamarr=[];
  var userinfoobj={};
let pinned="";
let rcstart=false;
let screenshared=false;
var peerids=[];
let camerastat,micstat,blurred,token,status,ownerofmeet;
let localPeerConnection;
let index=0;
var screen='';
let recstart=false;
let blockscreensharing=false;
let ifscreenshareisblocked=false;
var livestreams=[];
var blurredstreams=[];
const meetinfo=()=>{
  var mxv=document.createElement("div");
  document.body.appendChild(mxv);
  ReactDOM.render(<Dialog id="meetinginfo" open={true}><DialogTitle>{"Meeting Info"}</DialogTitle><DialogContent><DialogContentText><span style={{display:"none"}} id="meetinfo">Meeting Name:-{document.getElementById("meetnamebottomleft").innerHTML} Meeting Id:-{roomid} Link:- {window.location.href}</span><span  style={{color:"black"}}>Meeting Name:-{document.getElementById("meetnamebottomleft").innerHTML}<br />Meeting Id:-{roomid} <br />Link:- {window.location.href}</span></DialogContentText></DialogContent><DialogActions>
<Button onClick={()=>{window.open("mailto:?body="+document.getElementById("meetinfo").innerHTML);mxv.remove();document.getElementById("meetinginfo").remove();}} color="primary">Invite</Button><Button color="primary" onClick={()=>{mxv.remove();document.getElementById("meetinginfo").remove();}}>Close</Button>
  </DialogActions></Dialog>,mxv);
}
const blockscreenshare=()=>{
if(!blockscreensharing){
  blockscreensharing=true;
  socket.emit("blockscreenshare",{roomid:roomid,isittrue:true});
  document.querySelector("button[data-text=screensharecontroller]").style.background="grey";
}else{
    blockscreensharing=false;
      socket.emit("blockscreenshare",{roomid:roomid,isittrue:false});
      document.querySelector("button[data-text=screensharecontroller]").style.background="white";
}
}
function recordmeet(){
  if(!recstart){
    recstart=true;
merger = new VideoStreamMerger();
    if(document.querySelector('#'+activespeaker+' video') && document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
      merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{
        x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
      })
    }else if(document.querySelector('#'+activespeaker+' video') && !document.querySelector(".screen video").srcObject){

      merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{x: 0, // position of the topleft corner
      y: 0,
      width: merger.width,
      height: merger.height})
    }else if(!document.querySelector('#'+activespeaker+' video') && !document.querySelector(".screen video").srcObject){
      merger.addStream(document.querySelector(".localvideo").srcObject,{x: 0, // position of the topleft corner
      y: 0,
      width: merger.width,
      height: merger.height,
      mute: false})
    }else if(!document.querySelector('#'+activespeaker+' video') && document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
      merger.addStream(document.querySelector('.localvideo').srcObject,{
        x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
      })
    }
    if(!micstat){
      micstat=false;
      mutemic(true);
      micstat=true;
      mutemic(false);
    }
  merger.start();
recorder = RecordRTC(merger.result, {
        type: 'video'
    });
    recorder.startRecording();
    ReactDOM.render(<StopIcon style={{color:"black"}} className="actbutn"  />,document.getElementById("meetnamebottomlefttwo"));
  }else{
recstart=false;
recorder.stopRecording(function() {
  ReactDOM.render(<AlbumIcon style={{color:"black"}} className="actbutn" />,document.getElementById("meetnamebottomlefttwo"));
    let blob = recorder.getBlob();
    var uri=URL.createObjectURL(blob);
    window.open(uri);
    recorder=null;
    merger.destroy();
});
  }
}
function rejectproposal(e){
  document.getElementById("dialog"+e).remove();
  firebase.firestore().collection("requests").doc(e).update({
    accept:"3"
  });
}
function acceptproposal(e){
document.getElementById("dialog"+e).remove();
firebase.firestore().collection("requests").doc(e).update({
  accept:"2"
});
}
function removeparticipant(e){
  $("div[data-participant="+e+"]").remove();
  socket.emit("removeparticipant",{sockid:e,roomid:roomid});
}
function pinner(e){
  if(pinnedevivsarr[e]){
    unpindiv(e);
    pinnedevivsarr[e]=false;
    ReactDOM.render(<img src={Pinoff} />,document.querySelector("."+e+"lenddiv"));
  }else{
    pindiv(e);
    pinnedevivsarr[e]=true;
      ReactDOM.render(<img src={Pinon} />,document.querySelector("."+e+"lenddiv"));
  }
}
function changebackground(){
  ReactDOM.render(null,document.getElementById("popup"));
  if(blurred){
      blurrer();
    blurred=false;
    userinfoobj.blur=blurred;
    socket.emit("unblurvideo",{roomid:roomid,sockid:socketId});
  }else{
      blurrer();
    blurred=true;
    userinfoobj.blur=blurred;
    socket.emit("blurvideo",{roomid:roomid,sockid:socketId});
  }

}
function changelayout(){
ReactDOM.render(null,document.getElementById("popup"));
if(mode=="grid"){
  mode="active";
  $("#"+activespeaker).appendTo(".activeview");
    $(".uservideoconatiner").appendTo(".bill")
  $(".activeview").show();
  $(".gridview").hide();
}else{
  mode="grid";
  pc.forEach(function(item){
    $("#"+item).appendTo(".gridview");
  });

  $(".uservideoconatiner").prependTo(".gridview");
  $(".activeview").hide();
  $(".gridview").show();
}
}
function unpindiv(e){
    ReactDOM.render(<IconButton onClick={()=>{pindiv(e)}}><img src={Pinoff} /></IconButton>,document.querySelector("#"+e+" .pinbtn"));
    if(mode=="grid" && e!="local"){
      $("#"+e).appendTo(".gridview");
    }else if(mode!="grid" && e!="local"){
      if(e==activespeaker){
        $("#"+e).appendTo(".activeview");
      }else{
                $("#"+e).appendTo("#videocontainer");
      }
    }else if(e=="local" &&mode=="grid" && peerids.length>0){
              $("#"+e).prependTo(".gridview");
      $("#"+e).attr("id","");
    }else if(e=="local" && mode=="grid" && peerids.length==0){
      $("#"+e).prependTo(".bill");
$("#"+e).attr("id","local");
    }else if(e=="local" && mode!="grid"){
        $("#"+e).attr("id","");
    }
    if(e=="local"){
          ReactDOM.render(<IconButton onClick={()=>{pindiv('local')}}><img src={Pinoff} /></IconButton>,document.querySelector(".myownimager"));
    }else{
      pinnedevivsarr[e]=false;
      ReactDOM.render(<img src={Pinoff} />,document.querySelector("."+e+"lenddiv"));
    }
    pinned="";
$(".pinneddiv").css('display','none');
}
function pindiv(e){
  if(pinned!=null && pinned!=""){
    ReactDOM.render(<IconButton onClick={()=>{pindiv(pinned)}}><img src={Pinoff} /></IconButton>,document.querySelector("#"+pinned+" .pinbtn"));
    if(mode=="grid"){
      $("#"+pinned).appendTo(".gridview");
    }else{
        $("#"+pinned).appendTo(".uservideoconatiner");
    }
    if(pinned=="local"){
      $(".uservideoconatiner").attr("id","");
      ReactDOM.render(<IconButton onClick={()=>{pindiv('local')}}><img src={Pinoff} /></IconButton>,document.querySelector(".myownimager"));
    }else{
      pinnedevivsarr[pinned]=false;
      ReactDOM.render(<img src={Pinoff} />,document.querySelector("."+pinned+"lenddiv"));
    }
  }
  if(e=="local"){
      pinned=e;
      $(".uservideoconatiner").attr('id','local');
      $(".pinneddiv").css('display','none');
      if(mode=="grid"){
        $(".uservideoconatiner").appendTo(".bill");
      }
      ReactDOM.render(<IconButton onClick={()=>{unpindiv('local')}}><img src={Pinon} /></IconButton>,document.querySelector(".myownimager"));
  }else{
      pinned=e;
      $("#"+e).appendTo(".pinneddiv");
      $(".pinneddiv").css('display','block');
      pinnedevivsarr[e]=true;
      ReactDOM.render(<img src={Pinon} />,document.querySelector("."+e+"lenddiv"));
  }
      ReactDOM.render(<IconButton onClick={()=>{unpindiv(e)}}><img src={Pinon} /></IconButton>,document.querySelector("#"+e+" .pinbtn"));
}
const screenshare=()=>{
  var constraints={
    'audio':true,
    'video':true
  }
   navigator.mediaDevices.getDisplayMedia(constraints).then(function(stream){
     for(var i=0;i<pc.length;i++){
       pc.forEach(function(item){
         stream.getTracks().forEach((track) => {
           pc[item].addTrack(track,stream);
         });

       });

     }

   });
}
const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};
function openup(){
  firebase.auth().onAuthStateChanged(function(user){
    if(user!=null){
      socket=new io(h.url()+'stream');
        socket.on('connect',function(){

          socketId=socket.id;
          socketId=socketId.replace(/[&\/\\#, +()$~%.'":*?<>{}]/g, '');
           socketId=socketId.replace(/[0-9]/g, '');
           socket.on("exitparticipant",function(data){
             if(data.sockid==socketId){
               window.location="/dash";
             }
           });
           $(window).on('beforeunload', function() {
       socket.emit('disconnectioner',{roomid:roomid,sockid:socketId});
       if(beforeuser.length==0 && screenshared){
         socket.emit('screensharingended',{roomid:roomid,sockid:socketId});
       }
    });
      socket.emit("blockscreenshare",{roomid:roomid,isittrue:false});
    socket.on('connectionend',function(data){
      if(recstart){
        merger.removeStream(document.querySelector("#"+data.sockid+" video").srcObject);
        if(document.querySelector(".screen video").srcObject){
          if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
            merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
            y: 0,
            width: merger.width,
            height: merger.height,
          mute:true})
          }else{
            merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
            y: 0,
            width: merger.width,
            height: merger.height,
          mute:false})
        }
        merger.addStream(document.querySelector('.localvideo').srcObject,{
          x: 0,
    y: merger.height - 100,
    width: 100,
    height: 100,
    mute: false
    });
      }else{
          merger.addStream(document.querySelector('.localvideo').srcObject,{
            x: 0,
    y: 0,
    width:merger.width,
    height:merger.height,
    mute: false
          })
    }
      }
      if(beforeuser.includes(data.sockid)){
        const index = beforeuser.indexOf(data.sockid);
  if (index > -1) {
    beforeuser.splice(index, 1);
  }
      }
      if(ownerofmeet){
        $("div[data-participant="+data.sockid+"]").remove();
      }
      for(var i=0;i<peerids.length;i++){
        if(peerids[i]==data.sockid){
          var zind=peerids.indexOf(data.sockid);
          peerids.splice(zind);
        }
      }
      if(data.sockid==secondaryscreen){
        socket.emit('screensharingended',{roomid:roomid,sockid:socketId});
        document.querySelector(".screen").style.display="none";
        document.querySelector(".screen video").srcObject=null;
        secondaryscreen="";
      }
    $("#"+data.sockid).remove();
    $(".lenddiv[data-"+data.sockid+"="+data.sockid+"]").remove();
    if(pinned==data.sockid){
      pinned="";
      $(".pinneddiv").hide();
    }
    if(peerids.length==0){
        $(".uservideoconatiner").attr("id","local");
      $(".uservideoconatiner").appendTo(".bill");
    }
    });
          let purl=userposter;
          let displayname=user.displayName;
var room=roomid;
            socket.emit( 'subscribe', {
                room: room,
                socketId: socketId
            } );
            socket.on('disconnect', () => {
   socket.removeAllListeners();
});
if(user.photoURL!=null){
  purl=user.photoURL;
}
            userinfoobj.name=user.displayName;
            userinfoobj.photo=purl;
            userinfoobj.email=user.email;
            userinfoobj.uid=user.uid;
            userinfoobj.sockid=socketId;
            userinfoobj.roomid=room;
            userinfoobj.cam=camerastat;
            userinfoobj.mic=micstat;
            userinfoobj.blur=blurred;
socket.emit('userinfo',userinfoobj);
socket.on('myinfo',function(data){
  if(data.sockid!=socketId && !peerids.includes(data.sockid)){
    if(peerids.length==0 && mode=="grid" && pinned!="local"){
      $(".uservideoconatiner").prependTo(".gridview");
    }
    peerids.push(data.sockid);
    peers.push(data);
    userinfoobj.uids=data.sockid;
    socket.emit('razorinfo',userinfoobj);
    var photourl=data.photo;
    if(photourl==null){
    photourl=userposter;
    }
    var divcontrols=document.createElement("div");
    divcontrols.setAttribute("data-participant",data.sockid);
    document.getElementById("controlsofparticipants").appendChild(divcontrols);
    var divx=document.createElement("div");
  divx.setAttribute("class","remoteuservideo");
      divx.style.display="none";
    document.getElementById(data.sockid).appendChild(divx);
    var img=document.createElement("img");
    img.src=data.photo;
    divx.appendChild(img);
    var name=data.name;
    if(name.length>20){
      var name=name.substring(0,20)+"...";
    }
          var dispname=name;
          if(ownerofmeet){
                ReactDOM.render(<ListItem><ListItemIcon><img className="imgalt" src={photourl} /></ListItemIcon><ListItemText>{dispname}</ListItemText><Button onClick={()=>{removeparticipant(data.sockid)}}>Remove</Button></ListItem>,divcontrols);
          }

      var p=document.createElement("p");
      if(!data.mic){
        dispname=dispname+"<img src="+muteicon+" />";
      }
      p.innerHTML=dispname;
      document.getElementById(data.sockid).appendChild(p);
    var len=pc.length+1;
    if(!data.cam){
        $("#"+data.sockid+" .remoteuservideo").css("display","block");
    }
    blurredstreams[data.sockid]=data.blur;
        document.getElementById("count").innerHTML="Participants("+len+")";
    var div=document.createElement("div");
    div.setAttribute("class","lenddiv");
      div.setAttribute("data-"+data.sockid,data.sockid);
    document.getElementById("meetpartlist").appendChild(div);
    if(mode=="grid"){
      $("#"+data.sockid).appendTo(".gridview");
    }
    if(status && blockscreensharing){
  socket.emit("blockscreenshare",{roomid:roomid,isittrue:true});
    }
        $("#"+data.sockid+" .pinbtn").appendTo("#"+data.sockid);
    var pinbtnrms=data.sockid+"lenddiv";
    ReactDOM.render(<div><List><ListItem style={{height:"10%"}}><ListItemIcon><img className="imgalt" src={photourl} /></ListItemIcon><ListItemText>{name}</ListItemText><IconButton className={pinbtnrms} onClick={()=>{pinner(data.sockid)}}><img src={Pinoff} /></IconButton></ListItem></List></div>,div);
  }
})
socket.on('blockscreen',function(data){
  if(!status){
    if(data.isittrue){
      ifscreenshareisblocked=true;
    }else{
        ifscreenshareisblocked=false;
    }
  }
});
socket.on('newinfo',function(data){
  if(data.uids==socketId){
    beforeuser.push(data.sockid);
    if(peers.length==0 && mode=="grid"  && pinned!="local"){
      $(".uservideoconatiner").prependTo(".gridview");
    }
    peerids.push(data.sockid);
    peers.push(data);
    var photourl=data.photo;
    if(photourl==null){
    photourl=userposter;
    }
    if(!document.getElementById(data.sockid)){
      var dim=document.createElement('div');
      dim.id=data.sockid;
      document.querySelector("#videocontainer").appendChild(dim);
      if(pinned!="local"){
        document.querySelector(".uservideoconatiner").removeAttribute("id");
      }
      var pindivx=document.createElement("div");
      pindivx.setAttribute("class","pinbtn");
      dim.appendChild(pindivx);
      ReactDOM.render(<IconButton onClick={()=>{pindiv(data.sockid)}}><img src={Pinoff} /></IconButton>,pindivx);
      if(mode=="grid"){
        $("#"+data.socketId).appendTo(".gridview");
      }
    }
    var divx=document.createElement("div");
  divx.setAttribute("class","remoteuservideo");
      divx.style.display="none";
    document.getElementById(data.sockid).appendChild(divx);
    var img=document.createElement("img");
    img.src=data.photo;
    divx.appendChild(img);
    var divcontrols=document.createElement("div");
        divcontrols.setAttribute("data-participant",data.sockid);
    document.getElementById("controlsofparticipants").appendChild(divcontrols);
    var name=data.name;
    if(name.length>20){
      var name=name.substring(0,20)+"...";
    }
    var len=pc.length+1;
      var p=document.createElement("p");
      var dispname=name;
      if(ownerofmeet){
            ReactDOM.render(<ListItem><ListItemIcon><img className="imgalt" src={photourl} /></ListItemIcon><ListItemText>{dispname}</ListItemText><Button onClick={()=>{removeparticipant(data.sockid)}}>Remove</Button></ListItem>,divcontrols);
      }

      if(!data.mic){
        dispname=dispname+"<img src="+muteicon+" />";
      }
      p.innerHTML=dispname;
      document.getElementById(data.sockid).appendChild(p);
      if(!data.cam){
          $("#"+data.sockid+" .remoteuservideo").css("display","block");
      }
      blurredstreams[data.sockid]=data.blur;
        document.getElementById("count").innerHTML="Participants("+len+")";
    var div=document.createElement("div");
    div.setAttribute("class","lenddiv");
    div.setAttribute("data-"+data.sockid,data.sockid);
    document.getElementById("meetpartlist").appendChild(div);
    if(mode=="grid"){
      $("#"+data.sockid).appendTo(".gridview");
    }
    if(status && blockscreensharing){
  socket.emit("blockscreenshare",{roomid:roomid,isittrue:true});
    }
    $("#"+data.sockid+" .pinbtn").appendTo("#"+data.sockid);
    var pinbtnrms=data.sockid+"lenddiv";
    ReactDOM.render(<div><List><ListItem style={{height:"10%"}}><ListItemIcon><img className="imgalt" src={photourl} /></ListItemIcon><ListItemText>{name}</ListItemText><IconButton className={pinbtnrms} onClick={()=>{pinner(data.sockid)}}><img src={Pinoff} /></IconButton></ListItem></List></div>,div);
}
});
socket.on("endscreenshare",function(data){
  document.querySelector(".screen").style.display="none";
  document.querySelector(".screen video").remove();
  var md=document.createElement("video");
  md.autoplay=true;
  document.querySelector(".screen").appendChild(md);
      $(".screen video").prependTo(".screen");
  ReactDOM.render(<div><IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={sharescreen}><ScreenShareIcon  style={{color:"black"}} fontSize="large"/></IconButton>
  <IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}}  onClick={moreoptions}><MoreVertIcon style={{color:"black"}}  fontSize="large"/></IconButton></div>,document.querySelector("#actionright"));
if(recstart){
  merger.addStream(document.querySelector(".localvideo").srcObject,{x: 0, // position of the topleft corner
  y: 0,
  width: merger.width,
  height: merger.height,
mute:false})
}
merger.removeStream(screenrecstream);
merger.addStream(document.querySelector(".localvideo").srcObject);
screenrecstream=null;
});
            socket.on( 'new user', ( data ) => {
                socket.emit( 'newUserStart', { to: data.socketId, sender: socketId } );
                pc.push( data.socketId );
                init( true, data.socketId );
                if(pinned!="local"){
                  document.querySelector(".uservideoconatiner").removeAttribute("id");
                }
                var div=document.createElement("div");
                div.id=data.socketId;
                document.getElementById("videocontainer").appendChild(div);
                var pindivx=document.createElement("div");
                pindivx.setAttribute("class","pinbtn");
                div.appendChild(pindivx);
                ReactDOM.render(<IconButton onClick={()=>{pindiv(data.socketId)}}><img src={Pinoff} /></IconButton>,pindivx);
                if(mode=="grid"){
                  $("#"+data.socketId).appendTo(".gridview");
                }
               } );


            socket.on( 'newUserStart', ( data ) => {
                pc.push( data.sender );
                init(false, data.sender );
                if(pinned!="local"){
                  document.querySelector(".uservideoconatiner").removeAttribute("id");
                }
                var div=document.createElement("div");
                div.id=data.sender;
                document.getElementById("videocontainer").appendChild(div);
                var pindivx=document.createElement("div");
                pindivx.setAttribute("class","pinbtn");
                div.appendChild(pindivx);
                ReactDOM.render(<IconButton onClick={()=>{pindiv(data.sender)}}><img src={Pinoff} /></IconButton>,pindivx);
                if(mode=="grid"){
                  $("#"+data.sender).appendTo(".gridview");
                }
                          } );

socket.on('unblurstream',function(data){
    blurredstreams[data.sockid]=false;
});
socket.on('blurstream',function(data){
      blurredstreams[data.sockid]=true;
      document.querySelector("#"+data.sockid+" video").height=document.querySelector("#"+data.sockid+" video").videoHeight;
      document.querySelector("#"+data.sockid+" video").width=document.querySelector("#"+data.sockid+" video").videoWidth;
      blurremotevideo(document.querySelector("#"+data.sockid+" video"),data.sockid);
});
            socket.on( 'ice candidates', async ( data ) => {
              if(data.candidate){
                     await pc[data.sender].addIceCandidate( new RTCIceCandidate( data.candidate ) );
              }
            } );
socket.on('chatmessage',function(data){
  if(data.sockid!=socketId){
    var message=document.getElementById("message").value;
    var p=document.createElement("p");
    p.setAttribute("class","messagep");
    p.innerHTML="<b>"+data.sendername+"</b>"+"<br />"+
    data.message+"<br />";
    document.getElementById("messages").appendChild(p);
  }
});
socket.on('screen',function(data){
if(beforeuser.length==0){
  secondaryscreen=data.mockid;
  px=new Peer({host:'beryl-ruddy-beak.glitch.me',port:'80',path:"/peerjs"});

   px.on('open', function(id) {
     call = px.call(data.sockid,
     document.querySelector(".localvideo").srcObject);
       call.on('stream', function(stream) {
      document.querySelector(".screen").style.display="block";
      document.querySelector(".screen video").srcObject=stream;
      screenrecstream=stream;
      if(recstart){
        if(document.querySelector("#"+activespeaker+" video")){
          if(document.querySelector(".screen video").srcObject){
            if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
              merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
              y: 0,
              width: merger.width,
              height: merger.height,
            mute:true})
            }else{
              merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
              y: 0,
              width: merger.width,
              height: merger.height,
            mute:false})
          }
          merger.addStream(document.querySelector('.localvideo').srcObject,{
            x: 0,
      y: merger.height - 100,
      width: 100,
      height: 100,
      mute: false
      });
        }else{
            merger.addStream(document.querySelector('.localvideo').srcObject,{
              x: 0,
      y: 0,
      width:merger.width,
      height:merger.height,
      mute: false
            })
      }
      }
    }
      document.querySelector(".screen video").muted=false;
        ReactDOM.render(<IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={moreoptions} ><MoreVertIcon   style={{color:"black"}}  fontSize="large"/></IconButton>,document.querySelector("#actionright"));
      pc.forEach(function(item){
        stream.getTracks().forEach(function(track){
                  pc[item].addTrack(track,stream);
        })

      });
     });
     });
}

});

socket.on("speaker",function(data){
  if(data.sockid!=socketId && data.sockid!=activespeaker){
    if(mode=="active"){
          $("#"+activespeaker).appendTo(".gridview");
          activespeaker=data.sockid;
          $("#"+activespeaker).appendTo(".activeview");
    }
changeactivespeaker();
if(recstart){
  if(document.querySelector("#"+activespeaker+" video")){
    if(document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
    merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{
      x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
});
  }else{
    console.log(document.querySelector('#'+activespeaker+' video').srcObject);
      merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{
        x: 0,
y: 0,
width:merger.width,
height:merger.height,
mute: false
      })
}
  }
}else{

}

}else if(recstart && data.sockid==activespeaker){
  if(document.querySelector("#"+activespeaker+" video")){
    if(document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
    merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{
      x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
});
  }else{
    console.log(document.querySelector('#'+activespeaker+' video').srcObject);
      merger.addStream(document.querySelector('#'+activespeaker+' video').srcObject,{
        x: 0,
y: 0,
width:merger.width,
height:merger.height,
mute: false
      })
}
}
}
})
socket.on("videooffchange",function(data){
  $("#"+data.sockid+" .remoteuservideo").css("display","block");
});
socket.on("videoonchange",function(data){
  $("#"+data.sockid+" .remoteuservideo").css("display","none");
});
socket.on("micoffchange",function(data){
  if(document.querySelector("#"+data.sockid+" p")){
    var val=document.querySelector("#"+data.sockid+" p").innerHTML;
    val=val+"<img src="+muteicon+" />";
    document.querySelector("#"+data.sockid+" p").innerHTML=val;
  }

});
socket.on('nameofscreen',function(data){
  var name=data.name;
  if(name.length>15){
    name=name.substring(0,15)+"...";
  }
  $(".screen p").text(name+"'s screen");
});
socket.on("miconchange",function(data){
for(var i=0;i<peers.length;i++){
  if(peers[i].sockid==data.sockid){
      if(document.querySelector("#"+data.sockid+" p")){
    var name=peers[i].name;
    if(name.length>15){
      name=name.substring(0,15)+"...";
    }
    document.querySelector("#"+data.sockid+" p").innerHTML=name;
  }
}
}
});
            socket.on( 'sdp', async ( data ) => {
                if ( data.description.type === 'offer' ) {
                    await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) );

                    h.getUserFullMedia().then( async ( stream ) =>{
                        myStream =document.querySelector(".localvideo").srcObject;
                        stream.getTracks().forEach( ( track ) => {
                            pc[data.sender].addTrack( track, stream );
                        } );
                        setTimeout(function(){
                          if(screenshared){
                            var sct=document.querySelector(".screen video").srcObject;
                            sct.getTracks().forEach((item, i) => {
                              pc[data.sender].addTrack(item,sct)
                            });
                            socket.emit('screenname',{name:firebase.auth().currentUser.displayName,room:roomid});
                          }
                        },3000);

                        let answer = await pc[data.sender].createAnswer();

                        await pc[data.sender].setLocalDescription( answer );

                        socket.emit( 'sdp', { description: pc[data.sender].localDescription, to: data.sender, sender: socketId } );
                    } ).catch( ( e ) => {
                        console.error( e );
                    } );
                }

                else if ( data.description.type === 'answer' ) {
                    await pc[data.sender].setRemoteDescription( new RTCSessionDescription( data.description ) );
                }
            } );
        });
    }
  })

}
function onCreateSessionDescriptionError(error) {

}
function init( createOffer, partnerName ) {
            pc[partnerName] = new RTCPeerConnection( h.getIceServer() );

          if ( myStream ) {

                myStream.getTracks().forEach( ( track ) => {
                    pc[partnerName].addTrack( track, myStream );
                    setTimeout(function(){
                      if(screenshared){
                        var sct=document.querySelector(".screen video").srcObject;
                        sct.getTracks().forEach((item, i) => {
                          pc[partnerName].addTrack(item,sct)
                        });
                      }
                    },3000);
                    socket.emit('screenname',{name:firebase.auth().currentUser.displayName,room:roomid});
                } );
            }

            else {
                h.getUserFullMedia().then( ( stream ) => {
                    myStream =document.querySelector(".localvideo").srcObject;
                    myStream.getTracks().forEach( ( track ) => {
                        pc[partnerName].addTrack( track, myStream );
                    } );
                    setTimeout(function(){
                      if(screenshared){
                        var sct=document.querySelector(".screen video").srcObject;
                        sct.getTracks().forEach((item, i) => {
                          pc[partnerName].addTrack(item,sct)
                        });
                      }
                    },3000);
                    socket.emit('screenname',{name:firebase.auth().currentUser.displayName,room:roomid});
                } ).catch( ( e ) => {

                    console.error( `stream error: ${ e }` );
                } );
            }



if(createOffer){
  pc[partnerName].onnegotiationneeded = async () => {
      let offer = await pc[partnerName].createOffer();

      await pc[partnerName].setLocalDescription( offer );

      socket.emit( 'sdp', { description: pc[partnerName].localDescription, to: partnerName, sender: socketId } );
  };
}
            pc[partnerName].onicecandidate = ( { candidate } ) => {
                socket.emit( 'ice candidates', { candidate: candidate, to: partnerName, sender: socketId } );
            };



            //add
            pc[partnerName].ontrack = ( e ) => {
                let str = e.streams[0];
                if(!livestreams.includes(str.id)){
                  livestreams.push(str.id);
                  streamarr.push(str);
                  if(activespeaker!="" && activespeaker!=null &&mode=="active"){
                    $("#"+activespeaker).appendTo("#videocontainer");
                  }
                  activespeaker=partnerName;
                  changeactivespeaker();
                  var videodiv=document.querySelector("#"+partnerName+"video");
                  if(!videodiv){
                    var video=document.createElement("video");
                    video.srcObject=str;
                    video.setAttribute("id",partnerName+"video");
                    video.setAttribute("autoplay","true");
                    document.getElementById(partnerName).appendChild(video);
                    var canvas=document.createElement("canvas");
                    canvas.style.display="none";
                    document.getElementById(partnerName).appendChild(canvas);
                    $("#"+partnerName+" canvas").prependTo("#"+partnerName);
                    $("#"+partnerName+" video").prependTo("#"+partnerName);
                    if(mode=="grid"){
                      $("#"+partnerName).appendTo(".gridview");
                    }
                    if(blurredstreams[partnerName]){
                      video.onloadedmetadata = function() {
                        video.width=video.videoWidth;
                        video.height=video.videoHeight;
                        document.querySelector("#"+partnerName+" canvas").style.display="block";
                          blurremotevideo(document.querySelector("#"+partnerName+" video"),partnerName);
  };

                    }
                  }else if(!document.querySelector(".screen video").srcObject && document.querySelector(".screen video").srcObject==null){
                    document.querySelector(".screen").style.display="block";
                    document.querySelector(".screen video").srcObject=str;
                      document.querySelector(".screen video").muted=false;
                      screenrecstream=str;
                            ReactDOM.render(<IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={moreoptions} ><MoreVertIcon   style={{color:"black"}}  fontSize="large"/></IconButton>,document.querySelector("#actionright"));
if(recstart){
  if(document.querySelector(".screen video").srcObject){
    if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
      merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
      y: 0,
      width: merger.width,
      height: merger.height,
    mute:true})
    }else{
      merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
      y: 0,
      width: merger.width,
      height: merger.height,
    mute:false})
  }
  merger.addStream(document.querySelector('.localvideo').srcObject,{
    x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
});
}else{
    merger.addStream(document.querySelector('.localvideo').srcObject,{
      x: 0,
y: 0,
width:merger.width,
height:merger.height,
mute: false
    })
}
}
                  }

                }

            };

            pc[partnerName].onconnectionstatechange = ( d ) => {
              if( pc[partnerName].iceConnectionState=="disconnected"){
                $("#"+partnerName).remove();
              }
            };
pc[partnerName].onstream=(e)=>{
  console.log(e);
}


            pc[partnerName].onsignalingstatechange = ( d ) => {
                switch ( pc[partnerName].signalingState ) {
                    case 'closed':
                      $("#"+partnerName).remove();
                        break;
                }
            };
        }
const blurrer=()=>{
  if(blurred){
blurred=false;
var canvas=document.querySelector(".blurcanvas");
canvas.style.display="none";
  }else{
    blurred=true;
    var video=document.querySelector(".localvideo");
    video.width=video.videoWidth;
    video.height=video.videoHeight;
  var options = {
     multiplier: 1,
     stride:32,
     quantBytes:4
   }
   bodyPix.load(options)
     .then(net => blurvideor(net))
     .catch(err => console.log(err))
  }
}
const changedevices=()=>{
  DetectRTC.load(function() {
    for(var i=0;i<2;i++){
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
    }
                  getsettings();
        });

}
function moreoptions(event){
ReactDOM.render(<Popover
      open={true}
      anchorEl={event.currentTarget}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
  <List>
<ListItem ><Button onClick={changelayout} fullWidth><ListItemText>Change Layout</ListItemText></Button></ListItem>
<ListItem ><Button onClick={changedevices} fullWidth><ListItemText>Change Devices</ListItemText></Button></ListItem>
<ListItem ><Button onClick={changebackground} fullWidth><ListItemText>Change Background</ListItemText></Button></ListItem>
<ListItem>  <Button fullWidth onClick={()=>{ReactDOM.render(null,document.getElementById("popup"))}}><ListItemText>Close</ListItemText></Button></ListItem>
  </List>
    </Popover>,document.getElementById("popup"));
}
async function blurvideor(net){
  var video=document.querySelector(".localvideo");
    var canvas=document.querySelector(".blurcanvas");
    canvas.style.display="block";
  const segmentation = await net.segmentPerson(video);

  const backgroundBlurAmount = 6;
  const edgeBlurAmount = 2;
  const flipHorizontal =false;

     bodyPix.drawBokehEffect(
       canvas,video, segmentation, backgroundBlurAmount,
       edgeBlurAmount, flipHorizontal);
       if(blurred && camerastat){
            blurvideor(net);
       }
   }
   const mutemic=(e)=>{
     var stream=document.querySelector(".localvideo").srcObject;
     if(micstat){
       userinfoobj.mic=false;
       micstat=false;
       stream.getAudioTracks()[0].enabled=false;
       ReactDOM.render(<MicOffIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("micrdx"));
       if(e){
                socket.emit("micoff",{roomid:roomid,sockid:socketId});
       }
     }else{
        userinfoobj.mic=true;
         micstat=true;
       stream.getAudioTracks()[0].enabled=true;
       ReactDOM.render(<MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("micrdx"));
       if(e){
                socket.emit("micon",{roomid:roomid,sockid:socketId});
       }
     }
   }
   const mutevideo=(e)=>{
     var stream=document.querySelector(".localvideo").srcObject;
     if(camerastat){
       userinfoobj.cam=false;
       const canvas=document.querySelector(".blurcanvas");
       canvas.style.display="none";
       var video=document.querySelector(".localvideo");
       video.style.display="block";
      camerastat=false;
       stream.getVideoTracks()[0].enabled=false;
       document.querySelector(".userimgblock").style.display="block";
       ReactDOM.render(<VideocamOffIcon fontSize="large" className="actbutn" style={{ color:"black" }}/>,document.getElementById("videordx"));
       if(e){
          socket.emit("videoff",{roomid:roomid,sockid:socketId});
       }

     }else{
              userinfoobj.cam=true;
       var video=document.querySelector(".localvideo");
          document.querySelector(".userimgblock").style.display="none";
       video.style.display="block";
       if(blurred){
         blurred=false;
         blurrer();
       }
         camerastat=true;
       stream.getVideoTracks()[0].enabled=true;
        if(e){
        socket.emit("videon",{roomid:roomid,sockid:socketId});
      }
       ReactDOM.render(<VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} />,document.getElementById("videordx"));
     }

   }
const participants=()=>{
  document.querySelector(".participantslist").style.display="block";
  document.querySelector(".header").style.display="none";
}
class Meeting extends React.Component{
  lockroom=()=>{
    document.querySelector(".req").style.background="white";
        document.querySelector(".lock").style.background="grey";
            document.querySelector(".allow").style.background="white";
            discretion=1;
  }
  allowroom=()=>{
    document.querySelector(".req").style.background="white";
        document.querySelector(".lock").style.background="white";
            document.querySelector(".allow").style.background="grey";
            discretion=2;
  }
  reqroom=()=>{
    document.querySelector(".req").style.background="grey";
        document.querySelector(".lock").style.background="white";
            document.querySelector(".allow").style.background="white";
            discretion=3;
  }
  constructor(props) {
    super(props);
    this.state = {
        allowcolor:"white",
        reqcolor:"grey",
        lockcolor:"white"
    }
}
  componentDidMount(){
   merger=new VideoStreamMerger();
   discretion=3;
    var db=firebase.firestore();
    document.querySelector("video").addEventListener("contextmenu", (event) => {
         event.preventDefault();
       });
    if(mode=="active"){
        document.querySelector(".activeview").style.display="block";
    }else{
      document.querySelector(".gridview").style.display="block";
    }
    roomid=this.props.roomid;
    var options = {
       multiplier: 1,
       stride:32,
       quantBytes:4
     }
     bodyPix.load(options)
       .then(function(net){
         canvnet=net;
       })
       .catch(err => console.log(err))
       var camidx=this.props.cameraid;
       var micidx=this.props.micid;
    const constraints = {
      video: {deviceId: camidx ? {exact: camidx} : undefined},
     audio: {deviceId: micidx ? {exact: micidx} : undefined}
}
var name="You("+firebase.auth().currentUser.displayName+")";
if(name.length>20){
  name=name.substring(0,20)+"..)";
}
var photourl=firebase.auth().currentUser.photoURL;
if(photourl==null){
  photourl=userposter;
}
  var div=document.createElement("div");
  div.setAttribute("class","lenddiv");
  document.getElementById("meetpartlist").appendChild(div);
  ReactDOM.render(<div><List><ListItem style={{height:"10%"}}><ListItemIcon><img className="imgalt" src={photourl} /></ListItemIcon><ListItemText>{name}</ListItemText><div className="myownimager"><IconButton onClick={()=>{pindiv('local')}} ><img src={Pinoff} /></IconButton></div></ListItem></List></div>,div);
ReactDOM.render(<img src={photourl} width="100%" height="100%" />,document.querySelector(".userimgblock"));

    var current=new Date();
    var current=new Date();
    var mins=current.getMinutes();
    if(mins.toString().length<2){
      mins="0"+mins;
    }
    var txt=current.getHours()+":"+mins;
    document.getElementById('time').innerHTML=txt;
    setInterval(function(){
      var current=new Date();
      var mins=current.getMinutes();
      if(mins.toString().length<2){
        mins="0"+mins;
      }
      var txt=current.getHours()+":"+mins;
      document.getElementById('time').innerHTML=txt;
    },1000);
    camerastat=this.props.camera;
    micstat=this.props.mic;
    blurred=this.props.videoblur;
    token=this.props.token;
    ownerofmeet=this.props.owner;
    var db=firebase.firestore();
    var rmid=this.props.roomid;
    db.collection("rooms").doc(this.props.roomid).get().then(function(doc){
        if(doc.exists){
        var meetnamer=doc.data().name;
        if(meetnamer.length>15){
          meetnamer=meetnamer.substring(0,15);
        }
          document.getElementById("meetnamebottomleft").innerHTML=meetnamer;
          if(doc.data().owner==firebase.auth().currentUser.uid){
             status=true;
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
             ReactDOM.render(<div><IconButton onClick={recordmeet} id="meetnamebottomlefttwo"></IconButton><IconButton id="micrdx" onClick={()=>{mutemic(true)}}><MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton>
             <IconButton onClick={()=>{window.location="/dash"}}><CallEndIcon style={{color:"black"}} /></IconButton>
             <IconButton id="videordx" onClick={()=>{mutevideo(true)}}><VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton></div>,document.querySelector(".ucr"));
               ReactDOM.render(<AlbumIcon fontSize="large" className="actbutn" style={{ color:"black" }}  />,document.getElementById("meetnamebottomlefttwo"));
              ReactDOM.render(<SecurityIcon />,document.getElementById("meetnamebottomfloatleft"));
             db.collection("requests").where("roomid", "==",rmid).where("accept","==","1")
               .onSnapshot((querySnapshot) => {
                   querySnapshot.forEach((doc) => {
                     if(discretion==3){
                     var dgid="dialog"+doc.id;
                     if(!document.getElementById(dgid)){
                       var midx=document.createElement("div");
                       document.body.appendChild(midx);
                       ReactDOM.render(<Dialog
                         id={dgid}
           open={true}
           onClose={()=>{}}
           aria-labelledby="alert-dialog-title"
           aria-describedby="alert-dialog-description"
         >
           <DialogTitle id="alert-dialog-title">{"Entry Request"}</DialogTitle>
           <DialogContent>
             <DialogContentText id="alert-dialog-description">
             {doc.data().name}({doc.data().email}) is requesting permission to enter the meeting.
             </DialogContentText>
           </DialogContent>
           <DialogActions>
             <Button onClick={()=>{rejectproposal(doc.id)}} color="primary">
             Reject
             </Button>
             <Button onClick={()=>{acceptproposal(doc.id)}} color="primary" autoFocus>
                 Accept
             </Button>
           </DialogActions>
         </Dialog>,midx);
                     }
}else if(discretion==2){
  firebase.firestore().collection("requests").doc(doc.id).update({
    accept:"2"
  });
}else if(discretion==1){
  firebase.firestore().collection("requests").doc(doc.id).update({
    accept:"3"
  });
}
                   });
               });

          }else{
             status=false;
             ReactDOM.render(<div><IconButton id="micrdx" onClick={()=>{mutemic(true)}}><MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton>
             <IconButton onClick={()=>{window.location="/dash"}}><CallEndIcon style={{color:"black"}} /></IconButton>
             <IconButton id="videordx" onClick={()=>{mutevideo(true)}}><VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton></div>,document.querySelector(".ucr"));
             document.getElementById("meetnamebottomfloatleft").remove();
             db.collection("requests").doc(token).get().then(function(req){
               if(req.exists){
                 if(req.data().accept=="1"){
                      window.location="/dash";
                 }else if(req.data().accept=="2"){
                   db.collection("requests").doc(token).update({
                     accept:"3"
                   });
                 }else{
                      window.location="/dash";
                 }
               }else{
                   window.location="/dash";
               }
             }).catch(function(error){
                  window.location="/dash";
             });
          }
        }else{

        }
    }).catch(function(error){
window.location="/dash";
    });
    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          document.querySelector(".localvideo").srcObject=stream;
                  streamarr.push(document.querySelector(".localvideo").srcObject);
          myStream=document.querySelector(".localvideo").srcObject;
          ReactDOM.render(<Dialog className="hostdialog" style={{display:"none"}} fullScreen open={true} onClose={()=>{}} >
          <AppBar style={{height:"10%"}}>
                   <Toolbar>
                     <IconButton edge="start" color="inherit"  aria-label="close" onClick={()=>{document.querySelector(".hostdialog").style.display="none";}}>
                       <CloseIcon />
                     </IconButton>
                     <Typography>Host Controls</Typography>
                   </Toolbar>
                 </AppBar>
                 <center style={{position:"absolute",top:"10%",height:"90%",width:"100%",bottom:"0",right:"0",left:"0"}}><Button style={{background:this.state.lockcolor}} className="lock" onClick={()=>{this.lockroom();}}>Lock Room</Button><Button style={{background:this.state.allowcolor}} className="allow" onClick={()=>{this.allowroom();}}>Allow anyone</Button><Button style={{background:this.state.reqcolor}} className="req" onClick={()=>{this.reqroom();}}>Allow only on request</Button>  <br />  <center> <Button data-text="screensharecontroller" onClick={blockscreenshare}>Block ScreenSharing</Button></center></center>

                 <List id="controlsofparticipants" style={{position:"absolute",top:"20%",height:"90%",bottom:"0",right:"0",left:"0",overflow:"scroll"}}></List>
          </Dialog>,document.querySelector(".hostcontrols"));
                    openup();
          var options = {};
   var speechEvents = hark(document.querySelector(".localvideo").srcObject, options);

   speechEvents.on('speaking', function() {
    socket.emit("speaking",{sockid:socketId,roomid:roomid});
    if(document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
    merger.addStream(document.querySelector('.localvideo').srcObject,{
      x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
});
  }else{
      merger.addStream(document.querySelector('.localvideo').srcObject,{
        x: 0,
y: 0,
width:merger.width,
height:merger.height,
mute: false
      })
}
});
            document.querySelector(".localvideo").onloadeddata = function() {
              if(blurred && camerastat){
                blurred=false;
          blurrer();
              }

};
ReactDOM.render(<div><IconButton onClick={recordmeet}></IconButton><IconButton id="micrdx" onClick={()=>{mutemic(true)}}><MicIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton>
<IconButton onClick={()=>{window.location="/dash"}}><CallEndIcon style={{color:"black"}} /></IconButton>
<IconButton id="videordx" onClick={()=>{mutevideo(true)}}><VideocamIcon fontSize="large" className="actbutn" style={{ color:"black" }} /></IconButton></div>,document.querySelector(".ucr"));
if(camerastat && micstat){

}
if(!camerastat && micstat){
camerastat=true;
mutevideo(false);
}
if(!camerastat && !micstat){
  camerastat=true;
  micstat=true;
  mutemic(false);
  mutevideo(false);
}
if(!micstat && camerastat){
  micstat=true;
mutemic(false);
}
if(pc.length>0){

}else{
  document.querySelector(".uservideoconatiner").id="local";
}
        })
        .catch(error => {
        window.location="/dash";
        });

  }
  render(){
    return (
      <div className="mavlsmeet" >
        <div className="activeview"  style={{display:"none"}}></div>
        <div className="gridview" style={{display:"none"}}></div>

        <div className="screen" style={{display:"none"}}><video autoPlay /><p></p></div>
        <div className="bill">
        <div className="uservideoconatiner" >

        <video className="localvideo" width="100%"  muted volume="0" height="100%" autoPlay playsInline />
        <canvas className="blurcanvas" style={{display:"none"}} />
        <div className="userimgblock"   style={{display:"none"}}></div>
        <p className="usernamep">You</p>
        <div className="pinbtn"><IconButton onClick={()=>{pindiv('local')}}><img src={Pinoff} /></IconButton></div>
        </div>
        </div>
<div className="pinneddiv" style={{display:"none"}}></div>
      <div className="header"><IconButton  onClick={participants}><PeopleIcon style={{color:"black"}} /></IconButton><IconButton onClick={showchatcontainer}><ChatIcon style={{color:"black"}}  /></IconButton>
      <Button id="time"></Button></div>
<div className="meetcontrols">
<div id="popup"></div>
<center className="ucr"></center>
<div id="actionright">
<IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={sharescreen}><ScreenShareIcon  style={{color:"black"}} fontSize="large"/></IconButton>
<IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={moreoptions}><MoreVertIcon style={{color:"black"}}  fontSize="large"/></IconButton>
</div>
<Button id="meetnamebottomleft" onClick={meetinfo}></Button>
<Button id="meetnamebottomfloatleft" onClick={()=>{document.querySelector(".hostdialog").style.display="block";}}></Button>
</div>
<div className="participantslist" style={{display:"none",position:"absolute",top:"0",bottom:"0"}}>
<p id="parttile" style={{position:"absolute",top:"0",height:"10%",width:"100%"}}><span id="count">Participants(1)</span><IconButton style={{float:"right"}} onClick={closeparticipantslist}><CloseIcon /></IconButton><br /><hr /></p>

<div id="meetpartlist" style={{position:"absolute",top:"10%"}}></div>
</div>
<div className="chatcontainer" style={{display:"none",position:"absolute",top:"0",bottom:"0"}}>
<p id="parttile" style={{position:"absolute",top:"0",height:"10%",width:"100%"}}>Chat<IconButton style={{float:"right"}} onClick={closechatlist}><CloseIcon /></IconButton><br /><hr /></p>

<div id="messages" style={{position:"absolute",top:"10%",bottom:"10%"}}></div>
<TextField variant="filled" id="message" label="Your message" onKeyPress={sendmessage} className="chatcontent" style={{width:"100%",height:"10%",position:"absolute",bottom:"0",top:"90%"}} />
</div>
<div id="videocontainer" style={{display:"none"}}></div>
<div className="hostcontrols" style={{display:"block"}}></div>
</div>
    );
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
          <Button onClick={applychangestodevices} color="primary">
            Apply Changes
          </Button>
        </DialogActions>
      </Dialog>,div);
}
const applychangestodevices=()=>{
  var prevstream=  document.querySelector(".uservideoconatiner video").srcObject;
var camid=document.getElementById("camid").value;
var micid=document.getElementById("micid").value;
  document.getElementById("mediadevuices").remove();
  const constraintsx = {
    video: {deviceId: camid ? {exact: camid} : undefined},
   audio: {deviceId: micid ? {exact: micid} : undefined}
}
navigator.mediaDevices.getUserMedia(constraintsx).then(function(stream){
  document.querySelector(".uservideoconatiner video").srcObject=stream;
  myStream=stream;
  broadcastNewTracks( stream, 'video', false );
    broadcastNewTracks( stream, 'audio', false );
    if(camerastat && micstat){

    }
    if(!camerastat && micstat){
    camerastat=true;
    mutevideo(false);
    }
    if(!camerastat && !micstat){
      camerastat=true;
      micstat=true;
      mutemic(false);
      mutevideo(false);
    }
    if(!micstat && camerastat){
      micstat=true;
    mutemic(false);
    }
});
}
const sendmessage=(e)=>{
  if(e.charCode==13){
    var message=document.getElementById("message").value;
    if(message.trim()!=null && message.trim()!=""){
      document.getElementById("message").value="";
      var p=document.createElement("p");
      p.setAttribute("class","messagep");
      var name=firebase.auth().currentUser.displayName;
      if(name.length>15){
        name=name.substring(0,15)+'...';
      }
      p.innerHTML="<b>"+name+"</b>"+"<br />"+
      message+"<br />";
      document.getElementById("messages").appendChild(p);
      socket.emit('messager',{sockid:socketId,message:message,sendername:name,roomid:roomid});
    }
  }

}

        function broadcastNewTracks( stream, type, mirrorMode = true ) {
            h.setLocalStream( stream, mirrorMode );

            let track = type == 'audio' ? stream.getAudioTracks()[0] : stream.getVideoTracks()[0];

            for ( let p in pc ) {
                let pName = pc[p];

                if ( typeof pc[pName] == 'object' ) {
                    h.replaceTrack( track, pc[pName] );
                }
            }
        }
function changeactivespeaker(){
  if(mode=="active"){
     $("#"+activespeaker).appendTo(".activeview");
  }
}
function closeparticipantslist(){
  document.querySelector(".header").style.display="block";
  document.querySelector(".participantslist").style.display="none";
}
function closechatlist(){
  document.querySelector(".header").style.display="block";
  document.querySelector(".chatcontainer").style.display="none";
}
function showchatcontainer(){
  document.querySelector(".header").style.display="none";
  document.querySelector(".chatcontainer").style.display="block";
}
async function blurremotevideo(e,f){
    const segmentation = await canvnet.segmentPerson(e);
  document.querySelector("#"+f+" canvas").style.display="block";
        const backgroundBlurAmount = 6;
        const edgeBlurAmount = 2;
        const flipHorizontal =false;

        bodyPix.drawBokehEffect(
        document.querySelector("#"+f+" canvas"),e, segmentation, backgroundBlurAmount,
          edgeBlurAmount, flipHorizontal);
          if(blurredstreams[f]){
            blurremotevideo(e,f);
}else{
    document.querySelector("#"+f+" canvas").style.display="none";
}
  }
const sharescreen=()=>{
  if(status || !ifscreenshareisblocked){
var constraints={
    'audio':true,
    'video':true
  };
  navigator.mediaDevices.getDisplayMedia(constraints).then(function(stream){
    screenshared=true;
    screenrecstream=stream;
    ReactDOM.render(<IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={moreoptions} ><MoreVertIcon   style={{color:"black"}}  fontSize="large"/></IconButton>,document.querySelector("#actionright"));
  stream.getVideoTracks()[0].onended =()=>{
    if(recstart){
      merger.removeStream(screenrecstream);
      merger.addStream(document.querySelector(".localvideo").srcObject,{x: 0, // position of the topleft corner
      y: 0,
      width: merger.width,
      height: merger.height,
    mute:false})
    }
    screenrecstream=null;
    screenshared=false;
    socket.emit("screensharingended",{roomid:roomid,render:true});
    document.querySelector(".screen").style.display="none";
    document.querySelector(".screen video").remove();
    var md=document.createElement("video");
    md.autoplay=true;
    document.querySelector(".screen").appendChild(md);
    $(".screen video").prependTo(".screen");
      ReactDOM.render(<div><IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}} onClick={sharescreen}><ScreenShareIcon  style={{color:"black"}} fontSize="large"/></IconButton>
      <IconButton style={{position:"aboslute",top:"0",bottom:"0",height:"100%"}}  onClick={moreoptions}><MoreVertIcon style={{color:"black"}}  fontSize="large"/></IconButton></div>,document.querySelector("#actionright"));

}
if(beforeuser.length==0){
  pc.forEach(function(item){
    stream.getTracks().forEach(function(track){
          pc[item].addTrack(track,stream);
    });
  });
}else{
  peer=new Peer({host:'beryl-ruddy-beak.glitch.me',port:'80',path:"/peerjs"});
  peer.on('open', function(id) {
    socket.emit('newscreenshare',{sockid:id,room:roomid,mockid:socketId});
    peer.on('call',function(call){
      call.answer(stream);
      call.on('stream', function(stream) {
  });
    });
});
}
$(".screen p").text("Your Screen");
socket.emit('screenname',{name:firebase.auth().currentUser.displayName,room:roomid});
document.querySelector(".screen video").srcObject=stream;
if(recstart){
  if(document.querySelector("#"+activespeaker+" video")){
    if(document.querySelector(".screen video").srcObject){
      if(document.querySelector(".screen video").srcObject.getAudioTracks().length==0){
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:true})
      }else{
        merger.addStream(document.querySelector(".screen video").srcObject,{x: 0, // position of the topleft corner
        y: 0,
        width: merger.width,
        height: merger.height,
      mute:false})
    }
    merger.addStream(document.querySelector('.localvideo').srcObject,{
      x: 0,
y: merger.height - 100,
width: 100,
height: 100,
mute: false
});
  }else{
      merger.addStream(document.querySelector('.localvideo').srcObject,{
        x: 0,
y: 0,
width:merger.width,
height:merger.height,
mute: false
      })
}
}
if(!micstat){
  mutemic(false);
  mutemic(true);
}
}
document.querySelector(".screen video").muted=true;
document.querySelector(".screen").style.display="block";
document.querySelector(".screen video").muted=true;
  }).catch(function(error){

  });
}else{
var div=document.createElement("div");
document.body.appendChild(div);
ReactDOM.render( <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="alertdialog"
      >
        <DialogTitle id="alert-dialog-title">{"Blocked"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
        Oops!ScreenSharing is blocked.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>{div.remove();document.getElementById("alertdialog").remove();}} color="primary" autoFocus>
            CLOSE
          </Button>
        </DialogActions>
      </Dialog>,div);
}
}
export default Meeting;
