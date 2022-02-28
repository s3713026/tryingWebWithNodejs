var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var http = require('http').Server(app)
// var io = require('socket.io')(3000)

app.get('/',(req,res)=>{
    var url_page = req.query;
    var string = JSON.stringify(url_page);
    var objectValue = JSON.parse(string);
    var get_authorization_code = objectValue['code'];
    console.log("Authorization Code: " + get_authorization_code);
    res.send(get_authorization_code);
})

// app.use(express.static(__dirname))
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({extended:false}))
// var messages =[
//     {name: 'Cuong',message:'Hi'},
//     {name: 'Cuong2', message:'Hello'}
// ]

// app.get('/messages',(req,res)=>{
//     res.send(messages)
// })

// app.post('/messages',(req,res)=>{
//     messages.push(req.body)
//     // io.emit('message',req.body)
//     res.sendStatus(200)
// })


// io.on('connection',(socket)=>{
//     console.log('a user connected')
// })

var server = app.listen(process.env.PORT || 3000, ()=> {
    console.log('Server is listening on port',server.address().port)
})

