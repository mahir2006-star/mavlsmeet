import React from 'react';
import ReactDOM from 'react-dom';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {Snackbar,CircularProgress} from '@material-ui/core';
import {Alert} from '@material-ui/lab';

const checkmeetid=()=>{
  var db=firebase.firestore();
  var val=document.getElementById("meetid").value;
if(val.trim()!="" && val.trim()!=null){
  var divj=document.createElement("div");
  document.body.appendChild(divj);
  ReactDOM.render( <Dialog id="rmmodal"
        open={true}
        onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Joining Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,divj);
  db.collection("rooms").doc(val.toLowerCase()).get().then(function(doc){
if(doc.exists){
window.location="/meet/"+val.toLowerCase();
}else{
  divj.remove();
  document.getElementById("rmmodal").remove();
  var divx=document.createElement("div");
  document.body.appendChild(divx);
  ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
    <Alert severity="error">
    Meet not found
    </Alert>
  </Snackbar>,divx);
  setInterval(function(){
    divx.remove();
  },5000);
}
  }).catch(function(error){
    var divx=document.createElement("div");
    document.body.appendChild(divx);
    ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
      <Alert severity="error">
      Meet not found
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
    MeetId cannot be empty
    </Alert>
  </Snackbar>,divx);
  setInterval(function(){
    divx.remove();
  },5000);
}
}
const cancelmodal=()=>{
document.getElementById("joinmodal").remove();
document.getElementById("joinmeetdiv").remove();
}
class JoinFormDialog extends React.Component{
  render(){
    return (
        <Dialog open={true} onClose={()=>{}} id="joinmodal" aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">JOIN MEETING</DialogTitle>
          <DialogContent>
            <DialogContentText>
            Enter a Meeting Id
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="meetid"
              label="Meeting Id"
              type="text"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button  color="primary" onClick={cancelmodal}>
              Cancel
            </Button>
            <Button  color="primary" onClick={checkmeetid}>
              Join
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}
export default JoinFormDialog;
