'use strict';

//USER CONFIGURATION **********************//

const status = 'New';
const searchTerm = 'Emergency';

//DO NOT MODIFY BELOW THIS LINE ***********//

const moment = require('moment');
const schedule = require('node-schedule');
const alerter = require('./js/alerter.js');
const repairshopr = require('./js/repairshopr.js');

var pendingTickets = [];

//Check the API for tickets with a New status and the keyword Emergency in the subject

schedule.scheduleJob('*/1 * * * *', function(){
    console.log('Checking for tickets');
    repairshopr.checkTickets(status, searchTerm, (err, tickets) => {
        if (err) {
            console.log(err)
        } else if (tickets.length > 0) {
            console.log(tickets.length + ' Tickets found via API');
            tickets.forEach((ticket) => {

                // Check if a ticket is already known to the system and alert on it if not.
                if (checkPending(ticket).length === 0) {
                    console.log('Ticket is not yet known - adding to monitored ticket list');
                    pendingTickets.push({number: ticket.number, timer: moment()});
                    alerter.alert(ticket, (err, response) => {
                        if (response) {
                            console.log(response);
                        } else {
                            console.log(err);
                        }
                    });
                
                //If the ticket IS known has 15 minutes elapsed since the last alert.
                //TODO - Handle what happens post 15 minutes and remove tickets no longer in New status 
                } else if (checkPending(ticket).length > 0 && checkRecurring(ticket)) {
                    console.log('This ticket is monitored and more than 15 minutes old');
                    alerter.alert(ticket, (err, response) => {
                        if (response) {
                            console.log(response);
                        } else {
                            console.log(err);
                        }
                    });
                }
            });
        } else {
            console.log('No emergency tickets found');
        }
    });
});

// Check if a ticket returned from the API already exists in our monitored ticket array
function checkPending(ticket) {
    console.log('Checking if the ticket is already known');
    let found = pendingTickets.map((pending) => {
        return pending.number === ticket.number;
    });
    return found;
}

// Check if a ticket found in our monitored ticket array has been there longer than 15 minutes
function checkRecurring(ticket) {
    console.log('Checking the tickets timer');
    var found = pendingTickets.map((pending) => {
        if(pending.timer.add(15, 'minutes').isBefore(moment())) {
            return true;
        } else {
            return false;
        }
    });
    return found[0];
}