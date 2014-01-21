/*
* Put here the requests to the DataSystem.
* GeolocationLog et Identity en lowercase !!
*/

americano = require('americano');

module.exports = {
    GeolocationLog: {
        all: americano.defaultRequests.all
    },
    
    Identity: {
        all: americano.defaultRequests.all
        
    }    
};
