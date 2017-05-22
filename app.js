'use strict';

//USER CONFIGURATION **********************//

const status = 'New';
const searchTerm = 'Emergency';
const recurringTimer = 15; // The interval to wait before triggering additional alerts on existing tickets

//DO NOT MODIFY BELOW THIS LINE ***********//

const moment = require('moment');
const schedule = require('node-schedule');
const alerter = require('./js/alerter.js');
const repairshopr = require('./js/repairshopr.js');

var pendingTickets = [];

//Check the API for tickets with monitored statuses and keywords in the subject

schedule.scheduleJob('*/1 * * * *', function(){

    console.log('Checking for tickets');
    repairshopr.checkTickets(status, searchTerm, (err, tickets) => {

        if (err) {
            console.log(err);
        } else if (tickets) {
            console.log(tickets.length + ' Tickets found via API');
            console.log('Known Tickets:\n' + JSON.stringify(pendingTickets));            
            tickets.forEach((ticket) => {

                // Check if a ticket was already alerted and is in the monitored queue

                if ( !checkPending(ticket) ) {
                    console.log('Ticket ID: ' + ticket.id + ' is a new ticket - alerting and adding to monitored queue');
                    pendingTickets.push({id: ticket.id, timer: moment()});
                    alerter.alert(ticket, (err, response) => {
                        if (response) {
                            console.log(response);
                        } else {
                            console.log(err);
                        }
                    });
                
                // //If the ticket IS monitored and the set time has elapsed since the last alert.
                
                // //TODO - Handle what happens post 15 minutes and remove tickets no longer in New status 
                
                } else if (checkPending(ticket) && checkRecurring(ticket)) {
                    console.log('Reccurring Alert interval reached:\n' + 'Triggering alert on Ticket ID ' + ticket.id);
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

            // API returned no Tickets

            console.log('No tickets to alert discovered');
            
            // Clear the monitored tickets queue
            
            pendingTickets = [];
        }

    });
});


// Check if a ticket returned from the API already exists in our monitored ticket array

function checkPending(ticket) {
    return pendingTickets.some((pending) => {
        return pending.id === ticket.id;
    });
};

// Check if a ticket found in our monitored ticket array has been there longer than the set interval

function checkRecurring(ticket) {
    return pendingTickets.some((pending) => {
        return pending.timer.clone().add(recurringTimer, 'minutes').isBefore(moment());
    });
};