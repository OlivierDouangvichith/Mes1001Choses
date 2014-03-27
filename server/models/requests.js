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

        all: function(doc) {
            if (!doc.state) {
                emit(doc._id, doc);
            }
        }

    },
    
    identity: {
        all: americano.defaultRequests.all
        
    }    
};
