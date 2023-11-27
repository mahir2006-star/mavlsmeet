var app = require('express')();
var cors=require("cors");
app.use(cors());
var http = require('http').Server(app);
let path=require("path");
var Razorpay=require("razorpay");
var stream=require("./ws/stream");
var rn = require('random-number');
const crypto = require("crypto");
var admin = require("firebase-admin");
var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mahirjain2006@gmail.com',
    pass: 'mahir2006'
  }
});
var ars=[];
const io = require("socket.io")(http,{
cors:[{
  origins:"http://localhost:3000"
}
]
});
var instance = new Razorpay({
  key_id: 'rzp_test_NtDXQdlGUoG1b4',
  key_secret: 'zbI0PAJa4MMSsoSbLYBkjItE',
});
app.get('/', function(req, res) {
   res.send("");
});
app.get('/mailconfirmation',function(req,res){
  var mailid=req.query.emailid;
  var idkey=req.query.transactionkey;
  var orderamnt=req.query.amt;
var mailOptions = {
  from: 'mahirjain2006@gmail.com',
  to: mailid,
  subject: 'Mavls Meet Subscription',
  text: 'You have successfully subscribed to our plan with transaction id '+idkey+'.Regards,Mavls Meet.'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
  res.send(error);
  } else {
  res.send("ok");
  }
});
});
app.get("/verifysignature",function(req,res){
  const hmac = crypto.createHmac('sha256',"zbI0PAJa4MMSsoSbLYBkjItE");
  hmac.update(req.query.orderid + "|" + req.query.paymentid);
  let generatedSignature = hmac.digest('hex');
  let isSignatureValid = generatedSignature ==req.query.signature;
  if(isSignatureValid){
    res.json({"status":"successful"});
  }else{
      res.json({"status":"failed"});
  }
});
app.post('/createbasicorder', function (req, res) {

    var gen = rn.generator({
  min:  -1000, max:  1000, integer: true
})
    instance.orders.create({amount:50000, currency:"INR", receipt:gen(500, null, false), payment_capture:true}).then(function(order){
      res.json(order);
    });
})
app.post('/createpremiumorder', function (req, res) {

    var gen = rn.generator({
  min:  -1000, max:  1000, integer: true
})
    instance.orders.create({amount:590000, currency:"INR", receipt:gen(500, null, false), payment_capture:true}).then(function(order){
      res.json(order);
    });
})
io.of( '/stream' ).on( 'connection', function(socket){
  socket.on( 'subscribe', ( data ) => {
      socket.join( data.room );
      socket.join(data.socketId);
        socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
  } );
  socket.on('newscreenshare',function(data){
    socket.to(data.room).emit('screen',data);
  });
  socket.on("speaking",function(data){
    socket.to(data.roomid).emit("speaker",data);
  });
  socket.on('screenname',function(data){
    socket.to(data.room).emit('nameofscreen',data);
  });
  socket.on("blurvideo",function(data){
    socket.to(data.roomid).emit("blurstream",data);
  })
  socket.on("unblurvideo",function(data){
    socket.to(data.roomid).emit("unblurstream",data);
  })
socket.on('messager',function(data){
socket.to(data.roomid).emit('chatmessage',data);
});
socket.on("videoff",function(data){
socket.to(data.roomid).emit("videooffchange",data);
});
socket.on("videon",function(data){
  socket.to(data.roomid).emit("videoonchange",data);
});
socket.on("micoff",function(data){
socket.to(data.roomid).emit("micoffchange",data);
});
socket.on("micon",function(data){
  socket.to(data.roomid).emit("miconchange",data);
});
socket.on('userinfo',function(data){
socket.to(data.roomid).emit('myinfo',data);
})
socket.on("blockscreenshare",function(data){
  socket.to(data.roomid).emit('blockscreen',data);
});
socket.on('screensharingended',function(data){
  socket.to(data.roomid).emit('endscreenshare',data);
});
socket.on('razorinfo',function(data){
socket.to(data.roomid).emit('newinfo',data);
});
  socket.on( 'newUserStart', ( data ) => {
      socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
  } );
  socket.on('disconnectioner',function(data){
    socket.to(data.roomid).emit('connectionend',data);
  });
  socket.on("removeparticipant",function(data){
    socket.to(data.roomid).emit("exitparticipant",data);
  });
  socket.on( 'sdp', ( data ) => {
      socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
  } );


  socket.on( 'ice candidates', ( data ) => {
      socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
  } );


  socket.on( 'chat', ( data ) => {
      socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
  } );
} );

http.listen( 8000 );
