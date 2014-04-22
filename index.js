var util = require("util"),
  events = require("events"),
  colors = require("colors"),
  pins = require("./mock-pins");

function MockFirmata(opt) {
  opt = opt || {};
  this.name = "Mock";
  this.isReady = true;
  this.pins = opt.pins || pins.UNO;
  this.analogPins = opt.analogPins || pins.UNOANALOG;
  this.MODES = {
    INPUT: 0x00,
    OUTPUT: 0x01,
    ANALOG: 0x02,
    PWM: 0x03,
    SERVO: 0x04
  };
  this.HIGH = 1;
  this.LOW = 0;
  this.debug = opt.debug;
}

util.inherits(MockFirmata, events.EventEmitter);

[
  "digitalWrite", "analogWrite", "servoWrite", "sendI2CWriteRequest",
  "analogRead", "digitalRead", "sendI2CReadRequest",
  "pinMode", "queryPinState", "sendI2CConfig"
].forEach(function(value) {
  MockFirmata.prototype[value] = function() {
    this.log(value, arguments);
  };
});

MockFirmata.prototype.pulseIn = function(opt, callback) {
  this.log("pulseIn", arguments);
  callback(this.pulseValue);
  this.log("pulseIn callback", [this.pulseValue]);
};

MockFirmata.prototype.log = function(func, args){
  if (!this.debug) { return; }
  args = [].slice.call(args);
  console.log(
      // Timestamp
      String(+new Date()).grey,
      // color matches the info type from J5
      "MockFirmata".magenta,
      // which function?
      func.cyan,
      // What was it called with?
      args.join(", ")
  );
};

module.exports = MockFirmata;
