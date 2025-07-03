import http from "http"
import express from "express"
import { Server } from "socket.io"

let app = express()

const server=http.createServer(app)
const io=new Server(server,{
    cors:{
        origin:"https://chatit-ubir.onrender.com"
    }
})
 const userSocketMap ={}
 export const getReceiverSocketId=(receiver)=>{
    return userSocketMap[receiver]
 }
io.on("connection",(socket)=>{
  const userId=socket.handshake.query.userId
  if(userId!=undefined){
    userSocketMap[userId]=socket.id
  }
  io.emit("getOnlineUsers",Object.keys(userSocketMap))

  // Handle typing events
  socket.on("typing", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("typing", userId)
    }
  })

  socket.on("stop_typing", (receiverId) => {
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stop_typing", userId)
    }
  })

socket.on("disconnect",()=>{
  delete userSocketMap[userId]  
 io.emit("getOnlineUsers",Object.keys(userSocketMap))

})
   
})



export {app,server,io}
