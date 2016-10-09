var assert = require('assert');
process.chdir("../");
describe('Meta Test', function () {
    it('runs', function () {
        var server = require('./server.js');
        assert.ok(server);
    });
});