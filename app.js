'use strict '

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "EAALz76Mu6HEBANvZBXhj79v7fU37mcoFeP376YCEyeuhn9kp6MfIWSzz5ds4MK8i2ZC6EUT571w8DrBvlBekJx1hnYHa4agSdbADUuWE5yv9pTK93UvPZBQYZBn9CrZAZCgl3T8tbHLdDZBzPSoZBJ8MouXtcCiTnJ5HGDgNt6xglEp0eE7myiMv"
const app = express();

app.set('port', 5000);
app.use(bodyParser.json());

app.get('/', function (req, response) {
  response.send('hola mundo!');
})

app.get('/webhook', function (req, response) {
  if (req.query['hub.verify_token'] == 'pugformacion_token') {
    response.send(req.query['hub.challenge']);
  } else {
    response.send('Pug formacion empresarial no tienes permisos')
  }
});

app.post('/webhook/', function (req, res) {
  const webhook_event = req.body.entry[0];
  if (webhook_event.messaging) {
    webhook_event.messaging.forEach(event => {
      handleEvent(event.sender.id, event);
    })
  }
  res.sendStatus(200);
})

//capturo el evento
function handleEvent(senderId, event){
  if(event.message){
    handleMessage(senderId, event.message);
  }
}

//llamo el evento que quiero hacer
function handleMessage(senderId, event){
    if(event.text){
      defaultMessage(senderId, event);
    }
}


//mensaje por defecto
function defaultMessage(senderId, event){

  if(event.text == 'hola'){
    const messageData= {
      "recipient": {
        "id": senderId
      },
      "message":{
        "text": "Saludo"
      }
    }
    callSendApi(messageData);
  }else{
    const messageData= {

      "recipient": {
        "id": senderId
      },
      "message":{
        "text": "Hola Soy el bot de formacion empresarial"
      }
    }
    callSendApi(messageData);
  }
}


function handmessage(event) {
  const senderId = event.sender.id;
  const messageText = event.message.text;
  const messageData = {
    recipient: {
      id: senderId
    },
    message: {
      text: messageText
    }
  }
  callSendApi(messageData)
}


function callSendApi(response) {
  request({
    //la api de facebook que nos vamos a conectar
    "uri": "https://graph.facebook.com/me/messages/",
    //token de la app de facebook
    "qs": {
      "access_token": access_token
    },
    "method": "POST",
    "json": response
  },
    function (err) {
      if (err) {
        console.log("Ha ocurrido un error")
      } else {
        console.log("Mensaje Enviado")
      }
    })
}



app.listen(app.get('port'), function () {
  console.log('nuestro servidor esta funcionando en el puerto', app.get('port'));
});
