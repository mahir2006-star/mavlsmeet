import React from 'react';
import ReactDOM from 'react-dom';
import {Avatar,TextField,Button,Snackbar,Dialog,DialogTitle,DialogContent,DialogContentText,CircularProgress,Drawer,List,ListItem,ListItemText} from "@material-ui/core";
import Alert from '@material-ui/lab/Alert';
import firebase from "firebase/app";
import "firebase/analytics";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import Compressor from 'compressorjs';
const removephoto=()=>{
ReactDOM.render(null,document.getElementById("modal"));
var divj=document.createElement("div");
document.body.appendChild(divj);
ReactDOM.render( <Dialog id="rmmodal"
      open={true}
      onClose={()=>{}}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">Updating Profile</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <center><CircularProgress /></center>
        </DialogContentText>
      </DialogContent>
    </Dialog>,divj);
    var user=firebase.auth().currentUser;
    user.updateProfile({
      photoURL:null
    }).then(function(){
           divj.remove();
           var divx=document.createElement("div");
           document.body.appendChild(divx);
           ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
             <Alert severity="success">
               Profile Updated Successfully!
             </Alert>
           </Snackbar>,divx);
           setInterval(function(){
             divx.remove();
           },5000);
           ReactDOM.render(<ProfileUi />,document.getElementById("profcen"));
           document.getElementById("rmmodal").remove();
    }).catch(function(err){
   divj.remove();
document.getElementById("rmmodal").remove();
    })
}
const imagemodal=()=>{
  if(document.getElementById("modal")){
    ReactDOM.render(<Drawer anchor="bottom" open={true} onClose={()=>{}}>
    <List>
    <ListItem>
    <ListItemText primary="Cancel" onClick={()=>{ReactDOM.render(null,document.getElementById("modal"))}}>Cancel</ListItemText>
    </ListItem>
    <ListItem>
    <label htmlFor="filed"><ListItemText primary="Upload Photo"></ListItemText></label>
    </ListItem>
    <ListItem>
    <ListItemText primary="Remove Photo" onClick={()=>{removephoto()}}></ListItemText>
    </ListItem>

    </List>
        </Drawer>,document.getElementById("modal"));
  }else{
    var div=document.createElement("div");
    div.id="modal";
    document.body.appendChild(div);
    ReactDOM.render(  <Drawer anchor="bottom" open={true} onClose={()=>{}}>
    <List>
    <ListItem>
    <ListItemText primary="Cancel" onClick={()=>{ReactDOM.render(null,document.getElementById("modal"))}}>Cancel</ListItemText>
    </ListItem>
    <label htmlFor="filed">
    <ListItem>
    <ListItemText primary="Upload Photo"></ListItemText>
    </ListItem>
    </label>
    <ListItem>
    <ListItemText primary="Remove Photo" onClick={()=>{removephoto()}}></ListItemText>
    </ListItem>

    </List>
        </Drawer>,div);
  }

}
const updateprofilename=()=>{
  var divj=document.createElement("div");
  document.body.appendChild(divj);
  ReactDOM.render( <Dialog id="avtmodal"
        open={true}
        onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Updating Profile</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,divj);
      var user=firebase.auth().currentUser;
      user.updateProfile({
        displayName:document.getElementById("usernamefield").value
      }).then(function(){
        ReactDOM.render(<ProfileUi />,document.getElementById("profcen"));
    document.getElementById("avtmodal").remove();
    divj.remove();
    var divx=document.createElement("div");
    document.body.appendChild(divx);
    ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
      <Alert severity="success">
        Profile Updated Successfully!
      </Alert>
    </Snackbar>,divx);
    setInterval(function(){
      divx.remove();
    },5000);
      }).catch(function(error){
        ReactDOM.render(<ProfileUi />,document.getElementById("profcen"));
    document.getElementById("avtmodal").remove();
    divj.remove();
      })
}
const avatarchange=()=>{
ReactDOM.render(null,document.getElementById("modal"));
const files=document.getElementById("filed").files;
var ext=files[0].name.split('.').pop();
if(ext=="jpg" || ext=="jpeg" || ext=="png"){
  var divj=document.createElement("div");
  document.body.appendChild(divj);
  ReactDOM.render( <Dialog id="avtmodal"
        open={true}
        onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Updating Profile</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,divj);
  new Compressor(files[0], {
     quality: 0.4,
     success(result) {
       var storage = firebase.storage();
 var storageRef = storage.ref();
 var spaceRef = storageRef.child('userimages/'+firebase.auth().currentUser.uid+"/profile."+ext);
 spaceRef.put(result).then(function(snapshot) {
  spaceRef.getDownloadURL().then(function(url){
      var user = firebase.auth().currentUser;
      user.updateProfile({
        photoURL:url
      }).then(function(){
            divj.remove();
            ReactDOM.render(<ProfileUi />,document.getElementById("profcen"));
        document.getElementById("avtmodal").remove();
        var divx=document.createElement("div");
        document.body.appendChild(divx);
        ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
          <Alert severity="success">
            Profile Updated Successfully!
          </Alert>
        </Snackbar>,divx);
        setInterval(function(){
          divx.remove();
        },5000);
      }).catch(function(err){
        divj.remove();
  document.getElementById("avtmodal").remove();
      });
  }).catch(function(error){
        divj.remove();
  document.getElementById("avtmodal").remove();
  });
});
     },
     error(err) {
       var div=document.createElement("div");
       document.body.appendChild(div);
       ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
         <Alert severity="error">
           Unknown Error Occured
         </Alert>
       </Snackbar>,div);
       setInterval(function(){
         div.remove();
       },5000);
     },
   });
}else{
  var div=document.createElement("div");
  document.body.appendChild(div);
  ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
    <Alert severity="error">
      File Format Not Supported
    </Alert>
  </Snackbar>,div);
  setInterval(function(){
    div.remove();
  },5000);
}
}
const verify=()=>{
  var user = firebase.auth().currentUser;
var div=document.createElement("div");
document.body.appendChild(div);
ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
  <Alert severity="success">
    Sent verification Email!
  </Alert>
</Snackbar>,div);
setInterval(function(){
  div.remove();
},5000);
user.sendEmailVerification().then(function() {

}).catch(function(error) {

});
}
export default class ProfileUi extends React.Component{
  componentDidMount(){
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        var dsb="arf";
if(user.photoURL!=null){
  dsb=user.photoURL;
}else{
  dsb="arf";
}
        if(user.emailVerified){
          ReactDOM.render(<div><input type="file" onChange={avatarchange} accept="image/*" id="filed" style={{display:"none"}}/><Avatar src={dsb} onClick={imagemodal} style={{height:100,width:100}} className="avt" alt={user.displayName}></Avatar><br />
          <p>{user.email}</p>
           <TextField id="usernamefield" variant="filled" label="Name" defaultValue={user.displayName} /><br /><br /><Button variant="contained" color="primary" onClick={updateprofilename}>Update Profile Name</Button><br /><hr />
        <div id="dhf">Made By Mahir Jain</div></div>,document.getElementById("profcen"));
        }else{
          ReactDOM.render(<div><input type="file" onChange={avatarchange} accept="image/*" id="filed" style={{display:"none"}}/><Avatar src={user.photoURL} style={{height:100,width:100}} className="avt" alt={user.displayName} onClick={imagemodal}></Avatar><br />
          <p>{user.email}</p>
           <TextField id="usernamefield" variant="filled" label="Name" defaultValue={user.displayName} /><br /><br /><Button variant="contained" color="primary" onClick={updateprofilename}>Update Profile Name</Button><br /><hr />
           <center><Button variant="contained" color="primary" onClick={verify}>Verify Email</Button></center> <div id="dhf">Made By Mahir Jain</div></div>,document.getElementById("profcen"));
        }

      }
      else {
      }
    })
  }
  render(){
    return null;
  }
}
