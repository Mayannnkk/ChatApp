const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userroutes = require("./routes/userroutes")
const messagesroute = require("./routes/messagesroute");
const socket=require('socket.io')
const app= express();

const DB='mongodb+srv://heyitsmank:mankmongo@cluster0.rxgnrcs.mongodb.net/chatapp?retryWrites=true&w=majority'

app.use(cors())  
app.use(express.json());

app.use("/api/auth",userroutes); 
app.use("/api/messages",messagesroute); 

app.get("/",(req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true");
}

mongoose.connect(DB).then(()=>{
    console.log("db connected")
}).catch((err)=>{ 
    console.log(err) 
}) 

const server =app.listen(5000,()=>{
    console.log('server started on port 5000')
}) 

const io= socket(server,{
    cors:{
        origin:"http://localhost:3000"
    }
});

global.onlineUsers = new Map();

io.on('connection',(socket)=>{
    global.chatSocket = socket;
    socket.on("add-user",(userid)=>{
        onlineUsers.set(userid,socket.id);
    });

    socket.on("send-msg",(data)=>{
        const sendusersocket=onlineUsers.get(data.to);
    
        if(sendusersocket){
            socket.to(sendusersocket).emit("msg-recieve",data.message);
             
        } 
    });
     
})

