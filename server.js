var express = require('express')
var bodyParser = require('body-parser')
const { header } = require('express/lib/request')
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

    var access_token ={
        'method' : 'POST',
        'url': 'https://oauth.zaloapp.com/v4/oa/access_token',
        'headers':{
            'secret_key': 'q52K4eXpUtLN353SVUcN',
            'Content-Type':'application/x-www-form-urlencoded'
        },
        form:{
            'code':get_authorization_code,
            'app_id': '3264157168871710467',
            'code_verifier':'yWjvLbkuOMEZWUcMaPF43ChOldw8H87P_Zm813H5m1M'
        }
    }

    http(access_token,(err,res)=>{
        if (err) throw new Error(error);
    // json data
    // parse json
    var resultJSON = JSON.parse(res.body);
    // stringify JSON Object
    var jsonContent = JSON.stringify(resultJSON);
    fs.writeFile("access_token.json", jsonContent, 'utf8', function (err) {
      if (err) {
        console.log("An error occured while writing JSON Object to File.");
        return console.log(err);
      }
    });

    var obj;
    fs.readFile('access_token.json', 'utf8', function (err, data) {
      if (err) throw err;
      obj = JSON.parse(data);
      var firstKey = Object.keys(obj)[0];
      var access_token = obj[firstKey];

      console.log("Access Token: " + access_token);
      processFile(access_token);
    });
    })
})

function processFile(token) {

    var get_OA_info = {
      'method': 'GET',
      'url': 'https://openapi.zalo.me/v2.0/oa/getoa',
      'headers': {
        'access_token': token
      }
    };
  
    http(get_OA_info, function (error, response) {
      if (error) throw new Error(error);
      var resultJSON2 = JSON.parse(response.body);
      var jsonContent2 = JSON.stringify(resultJSON2);
  
      console.log(jsonContent2);
    });
  }





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

