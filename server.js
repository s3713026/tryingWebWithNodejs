var express = require('express')
var bodyParser = require('body-parser')
const { header } = require('express/lib/request')
const { response } = require('express')
var app = express()
const fs = require('fs');
const { stringify } = require('querystring')
const { json } = require('body-parser')
const { send } = require('process')
var http = require('http').Server(app)
// var io = require('socket.io')(3000)
// app.use(express.static(__dirname))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// Lấy token
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

// Lấy id người quan tâm
app.get('/follower', (req, res) => {
    var request = require('request');
    fs.readFile('accesstoken.json', 'utf8', (err, data) => {
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
            var uid = JSON.parse(response.body).data.followers
            res.send(JSON.stringify(uid))
            fs.writeFile("userid.json", JSON.stringify(uid), function (err) {
                if (err) {
                    return console.log(err);
                }
                console.log("The file was saved!");
            });
        });
    })
})

app.get('/profile', (req, res) => {
    var request = require('request');
    fs.readFile('accesstoken.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log("read file access token success")
        fs.readFile('userid.json', 'utf8', (err, userdata) => {
            if (err) {
                console.error(err)
                return
            }

            console.log(userdata)
            console.log("read file userid success")
            JSON.parse(userdata).forEach(element => {
                console.log("PRINT" + JSON.stringify(element))
                var userid = JSON.stringify(element)
                var options = {
                    'method': 'GET',
                    'url': 'https://openapi.zalo.me/v2.0/oa/getprofile',
                    'headers': {
                        'Content-Type': 'application/json',
                        'access_token': JSON.parse(data).ac_token
                    },
                    body: JSON.stringify({
                        "user_id": element.user_id
                    })

                };
                request(options, function (error, response) {
                    if (error) throw new Error(error);
                    console.log(response.body);
                    res.send(response.body)
                });
            });
        })
    })

})

app.get('/sendmes', (req, res) => {
    var request = require('request');
    fs.readFile('accesstoken.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log("read file access token success")
        fs.readFile('userid.json', 'utf8', (err, userdata) => {
            if (err) {
                console.error(err)
                return
            }

            console.log(userdata)
            console.log("read file userid success")
            var request = require('request');
            var options = {
                'method': 'POST',
                'url': 'https://openapi.zalo.me/v2.0/oa/message',
                'headers': {
                    'access_token': JSON.parse(data).ac_token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "recipient": {
                        "user_id": "8577983785350353613"
                    },
                    "message": {
                        "text": "Thanks for đăng kí theo dõi!"
                    }
                })

            };
            request(options, function (error, response) {
                if (error) throw new Error(error);
                console.log(response.body);
            });
        })
    })

})

app.post('/webhook', (req, res) => {  
    console.log("User had send mess")
    res.status(200)
    // let body = req.body;
    // // Checks this is an event from a page subscription
    // if (body.object === 'page') {
  
    // //   Iterates over each entry - there may be multiple if batched
    //   body.entry.forEach(function(entry) {
  
    //     // Gets the message. entry.messaging is an array, but 
    //     // will only ever contain one message, so we get index 0
    //     let webhook_event = entry.messaging[0];
    //     console.log(webhook_event);
    //   });
  
    //   // Returns a '200 OK' response to all requests
    //   res.status(200).send('EVENT_RECEIVED');
    // } else {
    //   // Returns a '404 Not Found' if event is not from a page subscription
    //   res.sendStatus(404);
    // }
  
  });

var server = app.listen(process.env.PORT || 3000, () => {
    console.log('Server is listening on port', server.address().port)
})

