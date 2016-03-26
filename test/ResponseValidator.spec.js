import ResponseValidator from '../src/ResponseValidator';
import Log from '../src/Log';

import StubMetadataService from './StubMetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("ResponseValidator", function() {
    let settings;
    let subject;
    let stubMetadataService;
    let stubUserInfoService;
    
    let state;
    let response;

    beforeEach(function() {
        Log.setLogger(console);
        Log.level = Log.NONE;
        
        state = {
            id:"state"
        };
        response = {
          state:'state'  
        };

        settings = {};
        stubMetadataService = new StubMetadataService();
        stubUserInfoService = new StubUserInfoService();
        subject = new ResponseValidator(settings, () => stubMetadataService, () => stubUserInfoService);
    });

    describe("constructor", function() {

        it("should require a settings param", function() {
            try {
                new ResponseValidator(undefined, () => stubMetadataService, () => stubUserInfoService);
            }
            catch (e) {
                e.message.should.contain('settings');
                return;
            }
            assert.fail();
        });

    });

    describe("validateSigninResponse", function(done) {

        it("should validate that the client state matches response state", function() {

            subject.validateSigninResponse({ id: 1 }, { state: 2 }).then(null, err => {
                err.message.should.contain('match');
                done();
            });

        });
        
        it("should return error response", function(done) {
            
            response.error = "test";
            subject.validateSigninResponse(state, response).then(null, err=>{
                response.error.should.equal("test");
                done();
            });

        });
        
    });
});

// it("should filter protocol claims", function(done) {
//             stubMetadataService.userInfoEndpointResult = Promise.resolve("http://sts/userinfo");
//             stubJsonService.result = Promise.resolve({
//                 foo: 1, bar: 'test',
//                 aud:'some_aud', iss:'issuer', 
//                 sub:'123', email:'foo@gmail.com',
//                 role:['admin', 'dev'],
//                 nonce:'nonce', at_hash:"athash", 
//                 iat:5, nbf:10, exp:20
//             });
//             settings.filterProtocolClaims = true;

//             subject.getClaims("token").then(claims => {
//                 claims.should.deep.equal({
//                     foo: 1, bar: 'test',
//                     sub:'123', email:'foo@gmail.com',
//                     role:['admin', 'dev']
//                 });
//                 done();
//             });

//         });


class StubUserInfoService {
    getClaims() {
        return this.getClaimsResult;
    }
}