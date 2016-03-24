import Log from '../src/Log';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("Log", function() {
    
    beforeEach(function () {
        Log.reset();
        Log.enabled = true;
    });
    
    describe("enabled", function() {
        
        it("should stop logging when set to false", function() {
            let fake = {
                info(arg) {
                    this.infoWasCalled = true;
                }
            };
            fake.infoWasCalled = false;
            
            Log.setLogger(fake);
            Log.enabled = false;
            Log.info("test info");
            
            fake.infoWasCalled.should.be.false;
        });
        
    });
    
    describe("setLogger", function() {
        
        it("should use the logger specified", function() {
            let fake = {
                info(arg) {
                    this.infoParam = arg;
                },
                warn(arg) {
                    this.warnParam = arg;
                },
                error(arg) {
                    this.errorParam = arg;
                },
            }
            Log.setLogger(fake);
            Log.info("test info");
            Log.warn("test warn");
            Log.error("test error");

            fake.infoParam.should.equal("test info");
            fake.warnParam.should.equal("test warn");
            fake.errorParam.should.equal("test error");
        });
        
    });
    
    describe("info", function() {
        
        it("should work with no config", function() {
            Log.info("test");
        });
        
    });
    
    describe("warn", function() {
        
        it("should work with no config", function() {
            Log.warn("test");
        });
        
    });
    
    describe("error", function() {
        
        it("should work with no config", function() {
            Log.error("test");
        });
        
    });
});
