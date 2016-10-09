var assert = require('assert');
var fs = require('fs');
var neural = require('../neural.js');
describe('Neural Network', function () {
    fs.createReadStream("data/trainingdata.json").pipe(fs.createWriteStream("data/oldtrainingdata.json"));
    neural.dataPath = "data/trainingdata.json";
    it('loadTrainingData', function () {
        var a = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], output: [0, 0, 0, 0, 0, 0, 1, 0, 0]
        };
        var b = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5], output: [0, 0, 1, 0, 0, 0, 0, 0, 0]
        };
        fs.writeFileSync("data/trainingdata.json", JSON.stringify(a) + JSON.stringify(b));
        neural.loadTrainingData(function (success) {
            if (success) {
                assert.deepEqual(neural.trainingSet[0], a);
                assert.deepEqual(neural.trainingSet[1], b);
            }
        });
    });
    it('learnMove', function () {
        var a = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], output: [0, 0, 0, 0, 0, 0, 1, 0, 0]
        };
        var b = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5], output: [0, 0, 1, 0, 0, 0, 0, 0, 0]
        };
        fs.writeFileSync("data/trainingdata.json", JSON.stringify(a) + JSON.stringify(b));
        var move = { input: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], output: [0, 0, 1, 0, 0, 0, 0, 0, 0] };
        neural.loadTrainingData();
        neural.learnMove(move, function (success) {
            if (success) {
                assert.deepEqual(neural.trainingSet[3], move);
                var string = fs.readFileSync("data/trainingdata.json");
                assert.equal(string, JSON.stringify(a) + JSON.stringify(b) + JSON.stringify(move));
            }
        });
    });
    it('makeGuess', function () {
        var a = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], output: [0, 0, 0, 0, 0, 0, 1, 0, 0]
        };
        var b = {
            input: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 1, 0.5, 0.5], output: [0, 0, 1, 0, 0, 0, 0, 0, 0]
        };
        var string = JSON.stringify(a) + JSON.stringify(b);
        for (var i = 0; i < 20; i++) {
            string += JSON.stringify(a);
        }
        fs.writeFileSync("data/trainingdata.json", string );
        var move = { input: [1, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5], output: [0, 0, 1, 0, 0, 0, 0, 0, 0] };
        neural.loadTrainingData(function (success) {
            neural.train(10);
            var index = neural.makeGuess(move);
            assert.ok(index >= 0 && index <= 8);
        });
    });
    fs.createReadStream("data/trainingdata.json").pipe(fs.createWriteStream("data/oldtrainingdata.json"));
});
