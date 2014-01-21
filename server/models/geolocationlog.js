americano = require('americano');

module.exports = GeolocationLog = americano.getModel('GeolocationLog', {
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

GeolocationLog.all = function(callback) {
    GeolocationLog.request(
        "all", 
        {},
        function(err, instances) {
            callback(null, instances);
        }
    );
};

