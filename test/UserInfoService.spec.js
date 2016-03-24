import Log from '../src/Log';
import UserInfoService from '../src/UserInfoService';

import StubJsonService from './StubJsonService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UserInfoService", function() {
    let subject;
    let settings;
    let stubJsonService;

    beforeEach(function() {
        settings = {};
        stubJsonService = new StubJsonService();
        subject = new UserInfoService(settings, ()=>stubJsonService);
    });

    describe("constructor", function() {

        it("should require a settings param", function() {
            try {
                new UserInfoService();
            }
            catch (e) {
                return;
            }
            assert.fail();
        });

    });

    describe("getUserInfo", function() {

        it("should return a promise", function() {
            subject.getUserInfo().should.be.instanceof(Promise);
        });

    });
});
