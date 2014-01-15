/* 
* Set the routes of your app here.
*/ 
GeolocationLogs = require('./geolocationlogs');

module.exports = {
  'locations': {
      get: GeolocationLogs.list
  },
  
  'public': {
      get: GeolocationLogs.api
  },
  '*': {
      get: GeolocationLogs.home
  }  
};

