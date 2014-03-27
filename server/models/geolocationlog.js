americano = require('americano');

module.exports = GeolocationLog = americano.getModel('geolocationlog', {
 'origin': String,
 'idMesInfos': String,
 'timestamp': Date,
 'latitude': Number,
 'longitude': Number,
 'radius': Number,
 'msisdn': String,
 'deviceState': String,
 'snippet': String
 });


GeolocationLog.touch = function() {
    var cbGen = function(reqName) {
        var startTime = Date.now();

        return function() {
            console.log("Touch " + reqName + " in " + (Date.now() - startTime) + "ms");
        };
    };

    var params = {
        limit: 1,
        reduce: false
    };

    GeolocationLog.rawRequest("all", params, cbGen("geolocationlog/all"));

};

GeolocationLog.slice = function(start, callback) {
    GeolocationLog.request(
        "byTimestamp", 
        {
            startkey: start,
            limit: 1000
        },
        function(err, instances) {
            if (err) {
                callback(err, null);
            } else if (instances.length == 0) {
                callbakc("No data", null);
            } else {
                callback(null, instances);
            }
        }
    );
};    

