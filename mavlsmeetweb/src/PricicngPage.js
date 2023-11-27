import React from 'react';
import mylogo from './logo.png';
import {PricingTable, PricingSlot, PricingDetail} from 'react-pricing-table';
import h from './helpers.js';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
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
var db;
const buyplan=(plan)=>{
var dmx=document.createElement("div");
document.body.appendChild(dmx);
ReactDOM.render(  <Dialog
        open={true}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        id="payloader"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
          <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,dmx);
if(plan=="BASIC"){
  fetch(h.url()+'createbasicorder', {
 method: 'post',
 headers: {'Content-Type':'application/text'},
 body:""
}).then(res => res.json())
    .then(
      (result) => {
        var options = {
          "key":h.key(), // Enter the Key ID generated from the Dashboard
          "amount": "50000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": "INR",
          "name": "Mavls Meet",
          "description": "Basic Plan",
          "image": mylogo,
          "order_id":result.id,
          "handler": function (response){
            var payid=response.razorpay_payment_id;
            var payorder=response.razorpay_order_id;
            var signature=response.razorpay_signature;
            fetch(h.url()+"verifysignature?orderid="+payorder+"&paymentid="+payid+"&signature="+signature)
     .then(res => res.json())
     .then(
       (result) => {
         if(result.status=="successful"){
             createsubscription("BASIC");
             fetch(h.url()+"mailconfirmation?transactionkey="+payid+"&amt=500&emailid="+firebase.auth().currentUser.email)
      .then(
        (result) => {

        },
        (error) => {
        }
      )
         }else{
           var divx=document.createElement("div");
           document.body.appendChild(divx);
           ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
             <Alert severity="error">
               Failed
             </Alert>
           </Snackbar>,divx);
           setInterval(function(){
             divx.remove();
           },5000);
         }
       },
       (error) => {
             console.log(error);
         var divx=document.createElement("div");
         document.body.appendChild(divx);
         ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
           <Alert severity="error">
             Could not create subscription
           </Alert>
         </Snackbar>,divx);
         setInterval(function(){
           divx.remove();
         },5000);
       }
     )
          },
          "prefill": {
              "name":firebase.auth().currentUser.displayName,
              "email":firebase.auth().currentUser.email
          },
          "theme": {
              "color": "#3399cc"
          }
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
      dmx.remove();
      document.getElementById("payloader").remove();
      },
      (error) => {
        console.log(error);
        var divx=document.createElement("div");
        document.body.appendChild(divx);
        ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
          <Alert severity="error">
            Could not create
          </Alert>
        </Snackbar>,divx);
        setInterval(function(){
          divx.remove();
        },5000);
      }
    )
}else{
  fetch(h.url()+'createpremiumorder', {
 method: 'post',
 headers: {'Content-Type':'application/text'},
 body:""
}).then(res => res.json())
    .then(
      (result) => {
        var options = {
          "key": h.key(), // Enter the Key ID generated from the Dashboard
          "amount": "590000", // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
          "currency": "INR",
          "name": "Mavls Meet",
          "description": "Professional Plan",
          "image": mylogo,
          "order_id":result.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
          "handler": function (response){
            var payid=response.razorpay_payment_id;
            var payorder=response.razorpay_order_id;
            var signature=response.razorpay_signature;
            fetch(h.url()+"verifysignature?orderid="+payorder+"&paymentid="+payid+"&signature="+signature)
     .then(res => res.json())
     .then(
       (result) => {
         if(result.status=="successful"){
   createsubscription("PREMIUM");
   fetch(h.url()+"mailconfirmation?transactionkey="+payid+"&amt=5900&emailid="+firebase.auth().currentUser.email)
.then(
(result) => {

},
(error) => {
}
)
         }else{
           var divx=document.createElement("div");
           document.body.appendChild(divx);
           ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
             <Alert severity="error">
              Failed
             </Alert>
           </Snackbar>,divx);
           setInterval(function(){
             divx.remove();
           },5000);
         }
       },
       (error) => {
         console.log(error);
         var divx=document.createElement("div");
         document.body.appendChild(divx);
         ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
           <Alert severity="error">
             Could not create
           </Alert>
         </Snackbar>,divx);
         setInterval(function(){
           divx.remove();
         },5000);
       }
     )
          },
          "prefill": {
              "name":firebase.auth().currentUser.displayName,
              "email":firebase.auth().currentUser.email
          },
          "theme": {
              "color": "#3399cc"
          }
      };
      var rzp1 = new window.Razorpay(options);
      rzp1.open();
      dmx.remove();
      document.getElementById("payloader").remove();
      },
      (error) => {
        console.log(error);
        var divx=document.createElement("div");
        document.body.appendChild(divx);
        ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
          <Alert severity="error">
            Could not create
          </Alert>
        </Snackbar>,divx);
        setInterval(function(){
          divx.remove();
        },5000);
      }
    )
}
};
class PricingPage extends React.Component{
  componentDidMount(){
    db=firebase.firestore();
  }
  render(){
    return <div><PricingTable  highlightColor='#1976D2'>
    <PricingSlot highlighted onClick={()=>{buyplan('BASIC')}} buttonText='SIGN UP' title='BASIC' priceText='Rs500/Month'>
        <PricingDetail> <b>Unlimited Meetings</b></PricingDetail>
        <PricingDetail> <b>Upto 256 Participants</b></PricingDetail>
        <PricingDetail> <b>Screen Sharing</b></PricingDetail>
        <PricingDetail> <b>Host Controls</b></PricingDetail>
        <PricingDetail> <b>Hd conferencing</b></PricingDetail>
          <PricingDetail> <b>Video Recording</b></PricingDetail>
    </PricingSlot>
    <PricingSlot  onClick={()=>{buyplan('PRO')}} buttonText='SIGN UP' title='PROFESSIONAL' priceText='Rs5900/Year'>
    <PricingDetail> <b>Unlimited Meetings</b></PricingDetail>
    <PricingDetail> <b>Upto 256 Participants</b></PricingDetail>
    <PricingDetail> <b>Screen Sharing</b></PricingDetail>
    <PricingDetail> <b>Host Controls</b></PricingDetail>
    <PricingDetail> <b>Hd conferencing</b></PricingDetail>
    <PricingDetail> <b>Video Recording</b></PricingDetail>
    </PricingSlot>
</PricingTable><p><center>Contact us via email at <a href="mailto:mahirjain2006@gmail.com">mahirjain2006@gmail.com</a></center></p></div>;
  }
}
function createsubscription(e){
  var divj=document.createElement("div");
  document.body.appendChild(divj);
  var date = new Date();
  ReactDOM.render( <Dialog id="subscriptionmodal"
        open={true}
        onClose={()=>{}}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Subscribing</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <center><CircularProgress /></center>
          </DialogContentText>
        </DialogContent>
      </Dialog>,divj);
      if(e=="BASIC"){
db.collection("subscriptions").doc(firebase.auth().currentUser.uid).set({
  plan:"BASIC",
  expdate:(date.getUTCDate()-1),
  expyear:date.getUTCFullYear(),
  expmonth:(date.getUTCMonth()+2)
}).then(function(){
  document.getElementById("subscriptionmodal").remove();
}).catch(function(error){
  console.log(error);
    document.getElementById("subscriptionmodal").remove();
    var divx=document.createElement("div");
    document.body.appendChild(divx);
    ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
      <Alert severity="error">
        Could not create subscription for you
      </Alert>
    </Snackbar>,divx);
    setInterval(function(){
      divx.remove();
    },5000);
});
      }else{
        db.collection("subscriptions").doc(firebase.auth().currentUser.uid).set({
          plan:"PREMIUM",
          expdate:(date.getUTCDate()-1),
          expyear:(date.getUTCFullYear()+1),
          expmonth:(date.getUTCMonth()+1)
        }).then(function(){
          document.getElementById("subscriptionmodal").remove();
        }).catch(function(error){
          console.log(error);
            document.getElementById("subscriptionmodal").remove();
            var divx=document.createElement("div");
            document.body.appendChild(divx);
            ReactDOM.render(<Snackbar open={true} autoHideDuration={6000} onClose={()=>{}}>
              <Alert severity="error">
                Could not create subscription for you
              </Alert>
            </Snackbar>,divx);
            setInterval(function(){
              divx.remove();
            },5000);
        });
      }
}
export default PricingPage;
