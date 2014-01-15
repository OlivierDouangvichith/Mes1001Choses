GeolocationLog = require('../models/geolocationlog')

module.exports.list = function(req, res) {
  GeolocationLog.all(function(err, instances) {
    if(err != null) {
      res.send(500, "An error has occurred -- " + err);
    }
    else {
      data = {"GeolocationLog": instances};
      res.send(200, data);
    }
  });
};

module.exports.home = function(req, res) {
  res.send(200, 'HOME');
};

module.exports.api = function(req, res) {
  res.send(200, 'API');  
}


