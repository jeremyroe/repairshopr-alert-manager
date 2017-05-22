'use strict';

const axios = require('axios');

const url = process.env.slurl;

const post = function(message, callback) {
    axios.post(url, { text: message })
    .then((response) => {
        if(response.status === 200 && response.statusText === 'OK') {
	        callback(null, 'Slack alert succesful');
        }
    })
    .catch((err) => {
        callback(new Error(err));
    });
}

exports.alert = function(message, callback) {
    post(message, (err, response) => {
        if (response) {
            callback(null, response);
        } else {
            callback(new Error(err));
        }
    });
}
