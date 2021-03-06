'use strict';

const axios = require('axios');

var apiKey = process.env.rskey;
var apiUrl = process.env.rsurl;

const basePath = '/api/v1';

const get = function(extPath, params, callback) {
  axios.get('https://' + apiUrl + basePath + extPath + (params ? '?' + params : ''))
  .then((response) => {
    if(response.data){
      callback(null, response.data);
    }
  }).catch((error) => {
    callback(error, null);
  });
}

// A function to check for tickets based on a single status and a single keyword in a subject

exports.checkTickets = function(status, keyword, callback) {
  const extPath = '/tickets';
  const params = 'api_key=' + apiKey + '&' + 'status=' + status + '&' + 'term=' + keyword;
  get(extPath, params, function(err, data){
    if(err){
      callback(err, null);
    } else {
      callback(null, data.tickets);
    }
  });
};