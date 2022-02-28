var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(3000)

app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))
var messages =[
    {name: 'Cuong',message:'Hi'},
    {name: 'Cuong2', message:'Hello'}
]

app.get('/messages',(req,res)=>{
    res.send(messages)
})

app.post('/messages',(req,res)=>{
    messages.push(req.body)
    io.emit('message',req.body)
    res.sendStatus(200)
})

io.on('connection',(socket)=>{
    console.log('a user connected')
})

var server = app.listen(process.env.PORT || 3000, ()=> {
    console.log('Server is listening on port',server.address().port)
})

