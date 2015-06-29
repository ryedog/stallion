// Chai Setup
// -------------------------
global.chai   = require('chai')
global.expect = chai.expect
global.assert = chai.assert


// Chai Promise Setup
var chaiAsPromised = require("chai-as-promised");
    chai.use(chaiAsPromised);

// Sinon Setup
global.sinon = require("sinon");
var sinonChai = require("sinon-chai");


global.should = chai.should();
chai.use(sinonChai);

// Replay (Like Ruby's VCR)
global.Replay  = require('replay');
Replay.fixtures = __dirname + '/fixtures/replay';


global.l = console.log;