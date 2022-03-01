var express = require('express')
var bodyParser = require('body-parser')
const { header } = require('express/lib/request')
const { response } = require('express')
var app = express()
const fs = require('fs');
const { stringify } = require('querystring')
const { json } = require('body-parser')
var http = require('http').Server(app)
// var io = require('socket.io')(3000)
// app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
        var infor = JSON.parse(response.body);
        var ac_token = infor.access_token
        var rf_token = infor.refresh_token
        var messages = {
            'au_code': get_authorization_code,
            'ac_token': ac_token,
            'rf_token': rf_token
        }
        res.send(messages)
        fs.writeFile("accesstoken.json", JSON.stringify(messages), function (err) {
            if (err) {
                return console.log(err);
            }
            console.log("The file was saved!");
        });
    });
})

app.get('/follower',(req,res)=>{
    var request = require('request');
    fs.readFile('accesstoken.json', 'utf8' , (err, data) => {
        if (err) {
          console.error(err)
          return
        }
        console.log("read file success")
        console.log(data)
        var options2 = {
            'method': 'GET',
            'url': 'https://openapi.zalo.me/v2.0/oa/getfollowers',
            'headers': {
              'access_token': JSON.parse(data).ac_token,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              "offset": 0,
              "count": 10
            })
          
          };
          request(options2, function (error, response) {
            if (error) throw new Error(error);
            console.log(response.body)
            res.send(JSON.parse(response.body).user_id);
          });
      })
})






var server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port', server.address().port)
})

