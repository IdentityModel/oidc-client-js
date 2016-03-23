import JsonService from '../src/JsonService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("JsonService", function() {
    let subject;
    
    let fakeXMLHttpRequestFactory;
    let fakeHttpRequest;
    
    beforeEach(function(){
        fakeXMLHttpRequestFactory = new FakeXMLHttpRequestFactory();
        fakeHttpRequest = fakeXMLHttpRequestFactory.request;
        subject = new JsonService(fakeXMLHttpRequestFactory); 
    });
    
    describe("getJson", function() {
        
        it("should require a url parameter", function() {
            try {
                subject.getJson();
            }
            catch(e) {
                return;
            }
            
            assert.fail();
        });
        
        it("should return a promise", function() {
            var p = subject.getJson("http://test");
            p.should.be.instanceof(Promise);
        });
        
        it("should make GET request to url", function() {
            var p = subject.getJson("http://test");
            fakeHttpRequest.method.should.be.equal('GET');
            fakeHttpRequest.url.should.be.equal('http://test');
        });
        
        it("should set token as authorization header", function() {
            var p = subject.getJson("http://test", "token");
            fakeHttpRequest.headers.has('Authorization').should.be.true;
            fakeHttpRequest.headers.get('Authorization').should.be.equal('Bearer token');
        });
        
        it("should fulfill promise when http response is 200", function(done) {
            var p = subject.getJson("http://test");
            
            p.then(result => {
                result.should.not.be.undefined;
                result.foo.should.be.equal(1);
                result.bar.should.be.equal('test');
                
                done();
            });
            
            fakeHttpRequest.status = 200;
            fakeHttpRequest.response = JSON.stringify({foo:1, bar:'test'});
            fakeHttpRequest.onload();
        });
        
        it("should reject promise when http response is not 200", function(done) {
            var p = subject.getJson("http://test");
            
            p.then(result => {
                assert.fail();
            }, error => {
                error.should.be.instanceof(Error);
                error.message.should.contain('500');
                error.message.should.contain('server error');
                done();
            });
            
            fakeHttpRequest.status = 500;
            fakeHttpRequest.statusText = "server error";
            fakeHttpRequest.onload();
        });
        
        it("should reject promise when http response is error", function(done) {
            var p = subject.getJson("http://test");
            
            p.then(result => {
                assert.fail();
            }, error => {
                error.should.be.instanceof(Error);
                error.message.should.be.equal('Network Error');
                done();
            });
            
            fakeHttpRequest.onerror();
        });
    });
});


class FakeXMLHttpRequest {
    constructor(sendCallback) {
        this.headers = new Map();
    }
    
    open(method, url) {
        this.method = method;
        this.url = url;
    }
    
    setRequestHeader(header, value){
        this.headers.set(header, value);
    }
    
    send() {
    }
}

class FakeXMLHttpRequestFactory {
    constructor(request){
        this.request = request || new FakeXMLHttpRequest();
    }
    
    create() {
        return this.request;
    }
}