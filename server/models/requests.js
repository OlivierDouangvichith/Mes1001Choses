/*
* Put here the requests to the DataSystem.
* GeolocationLog et Identity en lowercase !!
* 
*/
americano = require('americano');

module.exports = {

    geolocationlog: {

        byTimestamp: function(doc) {
            if (!doc.deviceState) {
                emit(doc.timestamp, doc);
            }
        }

    },
    
    identity: {
        all: americano.defaultRequests.all
        
    }    
};
