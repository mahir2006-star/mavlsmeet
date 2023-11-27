import React from 'react';
import ReactDOM from 'react-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Snackbar,CircularProgress} from '@material-ui/core';
import {Alert} from '@material-ui/lab';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
export default function CreateFormDialog() {
  var db=firebase.firestore();
  const cancelmodal=()=>{
    document.getElementById("createmodal").remove();
    document.getElementById("createmeetdiv").remove();
  }
  const create=()=>{
    var val=document.getElementById("meetname").value;
if(val.trim()!="" && val.trim()!=null){
  var divj=document.createElement("div");
  document.body.appendChild(divj);
  ReactDOM.render( <Dialog id="rmmodal"
        open={true}
        onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Creating Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,divj);
      var d = new Date();
      var n = d.getTimezoneOffset();
            var minm = 100000000;
            var maxm = 999999999;
            var meetid = Math.floor(Math
            .random() * (maxm - minm + 1)) + minm;
db.collection("rooms").doc('m'+meetid).set({
  owner:firebase.auth().currentUser.uid,
  name:val.trim(),
  type:"fast",
  createdat: firebase.firestore.FieldValue.serverTimestamp()
})
.then(function() {
window.location="/meet/m"+meetid;
})
.catch(function(error) {
divj.remove();
document.getElementById("rmmodal").remove();
var divx=document.createElement("div");
document.body.appendChild(divx);
ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
  <Alert severity="error">
    Could not create meet!
  </Alert>
</Snackbar>,divx);
setInterval(function(){
  divx.remove();
},5000);
});
}else{
  var divx=document.createElement("div");
  document.body.appendChild(divx);
  ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
    <Alert severity="error">
    Name cannot be empty
    </Alert>
  </Snackbar>,divx);
  setInterval(function(){
    divx.remove();
  },5000);
}
  }
  return (
      <Dialog open={true} onClose={()=>{}} id="createmodal" aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">CREATE MEETING</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Enter a Meeting Name
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="meetname"
            label="Meeting Name"
            type="text"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button  color="primary" onClick={cancelmodal}>
            Cancel
          </Button>
          <Button  color="primary" onClick={create}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
  );
}
