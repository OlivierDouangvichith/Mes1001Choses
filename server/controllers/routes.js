/* 
* Set the routes of your app here.
*/ 
GeolocationLogs = require('./geolocationlogs');

module.exports = {
  'mobileLogin': {
      get: GeolocationLogs.login
  },
  
  'public': {
      get: GeolocationLogs.api
  },
  
  '*': {
      get: GeolocationLogs.home
  }  
};

