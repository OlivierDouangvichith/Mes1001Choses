americano = require('americano');

module.exports = Identity = americano.getModel('identity', {
    'idMesInfos': String,
    'lastName': String,
    'firstName': String
});

Identity.touch = function() {
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

    Identity.rawRequest("all", params, cbGen("identity/all"));

};

Identity.one = function(callback) {
    Identity.request(
        "all",
        {limit: 1},
        function(err, instances) {
            callback(null, instances);
        });
}