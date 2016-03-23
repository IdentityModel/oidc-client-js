import OidcClientSettings from '../src/OidcClientSettings';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientSettings", function() {
    
    describe("constructor", function() {
        it("should require a settings param", function(){
            try {
               new OidcClientSettings(); 
            }
            catch(e){
                return;
            }
            assert.fail();
        });
        
    });
});
