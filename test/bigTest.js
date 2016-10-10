var assert = require('assert');
describe('Meta Test', function () {
    it('runs', function () {
        var server = require('../server.js');
        assert.ok(server);
    });
});