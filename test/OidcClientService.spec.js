import OidcClientService from '../src/OidcClientService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientService", function() {
    let settings;
    let subject;
    
    beforeEach(function(){
        settings = {};
        subject = new OidcClientService(settings); 
    });
    
    describe("constructor", function() {
        it("should require a settings param", function(){
            try {
               new OidcClientService(); 
            }
            catch(e){
                return;
            }
            assert.fail();
        });
        
    });
});
