var express = require('express')
var bodyParser = require('body-parser')
const { header } = require('express/lib/request')
const { response } = require('express')
var app = express()
var http = require('http').Server(app)
// var io = require('socket.io')(3000)
// app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

app.get('/', (req, res) => {
    var url_page = req.query;
    var string = JSON.stringify(url_page);
    var objectValue = JSON.parse(string);
    var get_authorization_code = objectValue['code'];
    console.log("Authorization Code: " + get_authorization_code);
    // res.send(get_authorization_code);

    var request = require('request');
    var options = {
        'method': 'POST',
        'url': 'https://oauth.zaloapp.com/v4/oa/access_token',
        'headers': {
            'secret_key': 'q52K4eXpUtLN353SVUcN',
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            'app_id': '3264157168871710467',
            'code_verifier': 'yWjvLbkuOMEZWUcMaPF43ChOldw8H87P_Zm813H5m1M',
            'code': get_authorization_code,
            'grant_type': 'authorization_code'
        }
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log(response.body);
    
        res.send(response.body.access_token)
    });
})






// var messages =[
//     {au_code: get_authorization_code,ac_token:response.body.,rf_token},
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

var server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port', server.address().port)
})

