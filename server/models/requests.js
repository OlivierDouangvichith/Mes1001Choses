/*
* Put here the requests to the DataSystem.
* GeolocationLog et Identity en lowercase !!
*/

americano = require('americano');

module.exports = {
    geolocationlog: {
        all: americano.defaultRequests.all
    },
    
    identity: {
        all: americano.defaultRequests.all
        
    }    
};
