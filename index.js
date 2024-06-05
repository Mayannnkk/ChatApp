const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userroutes = require("./routes/userroutes")
const messagesroute = require("./routes/messagesroute");
const socket=require('socket.io')
const app= express();
const multer = require('multer');
const { addpfp } = require("./controllers/usercontroller");

const DB='mongodb+srv://heyitsmank:mankmongo@cluster0.rxgnrcs.mongodb.net/chatapp?retryWrites=true&w=majority'

app.get("/",(req,res)=>{
    res.setHeader("Access-Control-Allow-Credentials","true");
    res.send("backend is running")
})
app.use(cors({
    origin:["https://letschat.onrender.com"]
}))  
app.use(express.json());

app.use("/api/auth",userroutes); 
app.use("/api/messages",messagesroute); 

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"../public/src/uploadedImage")
    },
    filename:(req,file,cb)=>{
        cb(null,Date.now()+file.originalname)
    }
})
const upload = multer({storage:storage});

app.post("/api/auth/addpfp",upload.single("image"),addpfp)

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
        origin:"https://letschat.onrender.com"
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
            socket.to(sendusersocket).emit("msg-recieve",data);
             
        } 
    });
     
})

