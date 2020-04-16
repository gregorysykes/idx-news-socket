const app = require('express')()
const http = require('http').createServer(app)
app.get('/', (req, res) => {
   res.send("Node Server is running. Yay!!")
})


const io = require('socket.io')(http)

io.on('connection',(socket)=>{
    socket.on('send_message',(data)=>{
        socket.broadcast.emit('receive_message',data)
    })
})
http.listen(8080)
