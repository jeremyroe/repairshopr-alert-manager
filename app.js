'use strict';

const repairshopr = require('./js/repairshopr.js');
const twilio = require('./js/twilio.js');
//const pushover = require('./js/pushover.js');
//const slack = require('./js/slack.js');
const recipients = require('./js/recipients.js');
const rsUrl = process.env.rsurl;

//Check the API for tickets with a New status and the keyword Emergency in the subject
repairshopr.checkTickets('New', 'Emergency', (err, tickets) => {
    if(err) {
        console.log(err)
    } else if (tickets.length > 0) {
        var smsList = recipients.getAllSMS();
        tickets.forEach((ticket) => {
            // Format the ticket object into a string for the SMS Message - Limit name to 15 characters and subject to 76 to allow consistent URL inclusion
            let message = 'EMERGENCY Ticket from ' + ticket.customer_business_then_name.substring(0,14) + ' ' + ticket.subject.substring(0,75) + ' https://' + rsUrl + '/' + ticket.number;
            // Additional safety Limit the message length to 160 characters to prevent split text messages and trigger the alert
            twilio.alertAll(smsList, message.substring(0,159), (err, response) => {
                if(response) {
                    console.log(response.sid);
                } else {
                    console.log(err);
                }
            });
        });
    } else {
        console.log('No emergency tickets found');
    }
});