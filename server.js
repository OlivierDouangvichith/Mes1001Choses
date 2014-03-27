var americano = require('americano');

var port = process.env.PORT || 9250;
americano.start({name: 'Mes1001Choses', port: port},

function(app, server) {
        // Init the watcher, after americano'setup.
        require('./server/models/geolocationlog').touch();
        require('./server/models/identity').touch();
    }
);
