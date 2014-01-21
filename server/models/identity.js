americano = require('americano');

module.exports = Identity = americano.getModel('identity', {
    'idMesInfos': String,
    'lastName': String,
    'firstName': String
});

Identity.one = function(callback) {
    Identity.request(
        "all",
        {limit: 1},
        function(err, instances) {
            callback(null, instances);
        });
}