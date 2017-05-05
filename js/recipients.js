'use strict';

const fs = require('fs');

const configFile = '/../config/recipients.json';
const recipients = JSON.parse(
    fs.readFileSync(__dirname + configFile)
);

exports.getAllSMS = function() {
    let smsList = [];
    recipients.contacts.forEach((contact) => {
        smsList.push(contact.mobile);
    });
    return smsList;
}