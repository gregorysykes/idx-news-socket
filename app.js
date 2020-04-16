const io = require('socket.io-client')
os = require('os')
// let socket = io.connect('https://investindo.herokuapp.com/')
let socket = io.connect('http://localhost:8080')

if(socket)
	console.log('connected')

sendMessage();

function sendMessage(){
	socket.emit('send_message','keivin')
}

socket.on('receive_message',(data)=>{
	console.log(data)
})