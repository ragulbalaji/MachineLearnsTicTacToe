var assert = require('assert');
var fs = require('fs');
var neural = require('../neural.js');
describe('Neural Network', function() {
    it('loadTrainingData', function () {
        fs.createReadStream("../../data/trainingdata.json");

        neural.loadTrainingData();
        assert.equals
    })

    it('Test 2', function() {
        assert.ok(1 === 1, "This shouldn't fail");
        assert.ok(false, "This should fail");
    })
})
