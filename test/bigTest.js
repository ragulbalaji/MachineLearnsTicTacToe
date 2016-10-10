var assert = require('assert');
describe('Meta Test', function () {
    it('runs', function (done) {
        var server = require('../server.js');
        server.start(8080, function () { done(); });
    });
});