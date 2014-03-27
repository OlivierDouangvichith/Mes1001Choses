/*
* Put here the requests to the DataSystem.
* GeolocationLog et Identity en lowercase !!
* 
* 
    geolocationlog: {
        all: americano.defaultRequests.all
    },

*/

americano = require('americano');

module.exports = {

    geolocationlog: {

        byTimestamp: function(doc) {
            if (!doc.state) {
                emit(doc.timestamp, doc);
            }
        }

    },
    
    identity: {
        all: americano.defaultRequests.all
        
    }    
};
