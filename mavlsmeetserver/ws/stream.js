const stream = ( socket ) => {
    socket.on( 'subscribe', ( data ) => {
        //subscribe/join a room
        socket.join( data.room );
        socket.join( data.socketId );
        socket.to( data.room ).emit( 'new user', { socketId: data.socketId } );
    } );
    socket.on("speaking",function(data){
      socket.to(data.roomid).emit("speaker",data)
    });
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
socket.on('razorinfo',function(data){
  socket.to(data.roomid).emit('newinfo',data);
});
    socket.on( 'newUserStart', ( data ) => {
        socket.to( data.to ).emit( 'newUserStart', { sender: data.sender } );
    } );


    socket.on( 'sdp', ( data ) => {
        socket.to( data.to ).emit( 'sdp', { description: data.description, sender: data.sender } );
    } );


    socket.on( 'ice candidates', ( data ) => {
        socket.to( data.to ).emit( 'ice candidates', { candidate: data.candidate, sender: data.sender } );
    } );


    socket.on( 'chat', ( data ) => {
        socket.to( data.room ).emit( 'chat', { sender: data.sender, msg: data.msg } );
    } );
};

module.exports = stream;
