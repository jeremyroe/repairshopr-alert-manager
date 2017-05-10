'use strict';

const twilio = require('./twilio.js');
const pushover = require('./pushover.js');
const slack = require('./slack.js');
const recipients = require('./recipients.js');

const rsUrl = process.env.rsurl;

exports.alert = function(ticket, callback) {
    var smsList = recipients.getAllSMS();
    var poList = recipients.getAllPushover();
    // Format the ticket object into a string for the SMS Message - Limit name to 15 characters and subject to 76 to allow consistent URL inclusion
    let message = 'EMERGENCY Ticket from ' + ticket.customer_business_then_name.substring(0,14) + ' ' + ticket.subject.substring(0,75) + ' https://' + rsUrl + '/' + ticket.number;
    twilioAlert(smsList, message, (err, response) => {
        if(response) {
            callback(response);
        } else if (err) {
            callback(new Error(err));
        }    
    });
    pushoverAlert(poList, message, (err, response) => {
        if(response) {
            callback(response);
        } else if (err) {
            callback(new Error(err));
        }
    });
    slackAlert(message, (err, response) => {
        if(response) {
            callback(response);
        } else if (err) {
            callback(new Error(err));
        }
    });
}


function twilioAlert(smsList, message, callback) {    
    // Additional safety Limit the message length to 160 characters to prevent split text messages and trigger the alert         
    twilio.alertAll(smsList, message.substring(0,159), (err, response) => {
        if(response) {
            callback(null, response.sid);
        } else {
            callback(new Error(err));
        }
    });
}

function pushoverAlert(poList, message, callback) {
    pushover.alertAll(poList, message, (err, response) => {
        if(response) {
            callback(null, response);
        } else {
            callback(new Error(err));
        }
    });
}

function slackAlert(message, callback) {
    slack.alert(message, (err, response) => {
        if(response) {
            callback(null, response);
        } else {
            callback(new Error(err));
        }
    });
}
        