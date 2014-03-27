americano = require('americano');

module.exports = MMUCSession = americano.getModel(
    "mmucsession", {
    'id': String,
    'token': String,
    'lastSentDate': String
//    'config': Object,
});

//Mes1001Choses.setToken = function(doc, callback) {
MMUCSession.setToken = function(token, callback) {
    var d = {
        id : token,
        token: token,
        lastSendDate: ''
    };
    
    MMUCSession.updateOrCreate(d, callback);
};
