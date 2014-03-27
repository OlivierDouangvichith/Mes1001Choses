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

GeolocationLog.all = function(callback) {
    GeolocationLog.request(
        "all", 
        {},
        function(err, instances) {
            callback(null, instances);
        }
    );
};

