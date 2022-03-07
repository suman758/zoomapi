const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
var http = require('http').Server(app);
const path = require('path');
const fs = require('fs')
const rp = require('request-promise');
const jwt = require('jsonwebtoken');


const payload = {
  iss: '3rNrgLWGTXOP7n4sMVrPWA',
  exp: ((new Date()).getTime() + 5000)
};
const token = jwt.sign(payload, '9eYq7kYEcRqNmMnCf73Wy16lX8CK1vP2FXAK');
console.log(token);

app.get("/stopmeeting", (req, res) => {
  meetingId = req.query.id;
  var options = {
    method: "PUT",
    uri: "https://api.zoom.us/v2/meetings/" + meetingId + "/status",
    body: {
      "action": "end"
    },
    auth: {
      bearer: token
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json"
    },
    json: true //Parse the JSON string in the response
  };

  rp(options)
    .then(function (response) {
      console.log("response is: ", response);
      res.send("create meeting result: " + JSON.stringify(response));
    })
    .catch(function (err) {
      // API call failed...
      console.log("API call failed, reason ", err);
    });
});


app.get("/newmeeting", (req, res) => {
  email = "suman@wrctpl.com";
  var options = {
    method: "POST",
    uri: "https://api.zoom.us/v2/users/" + email + "/meetings",
    body: {
      topic: "test meeting title",
      type: 2,
      duration: 5,
      settings: {
        host_video: "true",
        participant_video: "true",
        watermark: "true"
      }
    },
    auth: {
      bearer: token
    },
    headers: {
      "User-Agent": "Zoom-api-Jwt-Request",
      "content-type": "application/json"
    },
    json: true //Parse the JSON string in the response
  };

  rp(options)
    .then(function (response) {
      console.log("response is: ", response);
      const data = {
        id: response.id,
        pwd: response.password
      };
      res.send(data);
    })
    .catch(function (err) {
      // API call failed...
      console.log("API call failed, reason ", err);
    });
});

http.listen(port, () => console.log(`Listening on port ${port}`));