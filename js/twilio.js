'use strict';

var accountSid = process.env.twsid;
var authToken = process.env.twtoken;
var msgSource = process.env.twsource;

var client = require('twilio')(accountSid, authToken);

const send = function(to, body, callback) {
    client.messages.create({
        to: to,
        from: msgSource,
        body: body
    }, (err, message) => {
        if(message){
            callback(null, 'SMS alert succesful');
        } else {
            callback(new Error(err));
        }
    });
}

exports.alertAll = function(smsList, message, callback) {
    smsList.map((number) => {
        send(number, message, (err, response) => {
            if(response) {
                callback(null, response);
            } else {
                callback(new Error(err));
            }
        });
    });
}