import MetadataService from '../src/MetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("MetadataService", function() {
    let subject;
    let settings;
    
    beforeEach(function(){
        settings = {};
        subject = new MetadataService(settings); 
    });
    
    describe("parseResult", function() {
        
        it("should require a settings param", function() {
            try{
                new MetadataService();
            }
            catch(e){
                return;
            }
            assert.fail();
        });
        
    });
});
