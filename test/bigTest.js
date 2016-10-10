var assert = require('assert');
describe('Meta Test', function () {
    it('runs', function (done) {
        var server = require('../server.js')(function () {
            done();
        }, true);
    });
});