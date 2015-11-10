/**
 * Created by user on 15/11/5.
 */

var apiRoute = require('./routeApi');
var controllerRoute = require('./routeController');

(function() {
    module.exports = function(app) {
        apiRoute(app);
        controllerRoute(app);
    }
})();