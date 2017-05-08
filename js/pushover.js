'user strict';

const axios = require('axios');

var token = process.env.pokey;

const url = 'https://api.pushover.net/1/messages.json';


const post = function(user, message, callback) {
    axios.post(url, null, {
        params: {
            token: token,
            user: user,
            message: message
        }
    })
    .then((response) => {
        if(response.status === 200 && response.statusText === 'OK')
        callback(null, 'Pushover alert succesful');
    })
    .catch((err) => {
        callback(new Error(err));
    });
}

exports.alertAll = function(poList, message, callback) {
    poList.map((poUser) => {
        post(poUser, message, (err, response) => {
            if (response) {
                callback(null, response);
            } else {
                callback(new Error(err));
            }
        })
    })
}
