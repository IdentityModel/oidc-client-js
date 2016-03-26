import OidcClientService from '../src/OidcClientService';
import SigninRequest from '../src/SigninRequest';
import SigninResponse from '../src/SigninResponse';
import SigninResponseError from '../src/SigninResponseError';
import SignoutRequest from '../src/SignoutRequest';
import Log from '../src/Log';

import StubMetadataService from './StubMetadataService';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("OidcClientService", function() {
    let settings;
    let subject;
    let stubMetadataService;
    let stubStore;
    let stubValidator;

    beforeEach(function() {
        Log.setLogger(console);
        Log.level = Log.NONE;

        settings = {
            client_id: 'client',
            redirect_uri: "http://app"
        };

        stubStore = new StubStateStore();
        stubValidator = new StubResponseValidator();
        stubMetadataService = new StubMetadataService();

        subject = new OidcClientService(settings, stubStore, () => stubValidator, () => stubMetadataService);
    });

    describe("constructor", function() {
        it("should require a settings param", function() {
            try {
                new OidcClientService(undefined, stubStore, stubMetadataService);
            }
            catch (e) {
                e.message.should.contain('settings');
                return;
            }
            assert.fail();
        });

    });

    describe("createSigninRequest", function() {

        it("should return a promise", function() {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");
            subject.createSigninRequest().should.be.instanceof(Promise);
        });

        it("should return SigninRequest", function(done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest();

            p.then(request => {
                request.should.be.instanceof(SigninRequest);
                done();
            });
        });

        it("should pass params to SigninRequest", function(done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest({
                data: 'foo',
                response_type: 'bar',
                scope: 'baz',
                redirect_uri: 'quux',
                prompt: 'p',
                display: 'd',
                max_age: 'm',
                ui_locales: 'u',
                id_token_hint: 'ith',
                login_hint: 'lh',
                acr_values: 'av'
            });

            p.then(request => {
                request.state.data.should.equal('foo');

                var url = request.signinUrl;
                url.should.contain("http://sts/authorize");
                url.should.contain("response_type=bar");
                url.should.contain("scope=baz");
                url.should.contain("redirect_uri=quux");
                url.should.contain("prompt=p");
                url.should.contain("display=d");
                url.should.contain("max_age=m");
                url.should.contain("ui_locales=u");
                url.should.contain("id_token_hint=ith");
                url.should.contain("login_hint=lh");
                url.should.contain("acr_values=av");

                done();
            });
        });

        it("should fail if metadata fails", function(done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.reject("test");

            var p = subject.createSigninRequest();

            p.then(null, err => {
                err.message.should.contain("signin");
                done();
            });
        });

        it("should store state", function(done) {
            stubMetadataService.getAuthorizationEndpointResult = Promise.resolve("http://sts/authorize");

            var p = subject.createSigninRequest();

            p.then(request => {
                stubStore.item.should.be.ok;
                done();
            });
        });

    });

    describe("processSigninResponse", function() {

        it("should return a promise", function() {
            subject.processSigninResponse("state=state").should.be.instanceof(Promise);
        });

        it("should fail if no state on response", function(done) {
            stubStore.item = "state";
            subject.processSigninResponse("").then(null, err => {
                err.message.should.contain('state');
                done();
            });
        });
        
        it("should fail if storage fails", function(done) {
            stubStore.error = "fail";
            subject.processSigninResponse("state=state").then(null, err => {
                err.message.should.contain('response');
                done();
            });
        });

        it("should call validator", function(done) {
            stubStore.item = "state";
            subject.processSigninResponse("state=state").then(response => {
                stubValidator.state.should.equal('state');
                stubValidator.response.should.be.deep.equal(response);
                done();
            });
        });
        
    });

    describe("createSignoutRequest", function() {

        it("should return a promise", function() {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");
            subject.createSignoutRequest().should.be.instanceof(Promise);
        });

        it("should return SignoutRequest", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                request.should.be.instanceof(SignoutRequest);
                done();
            });
        });

        it("should pass params to SignoutRequest", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest({
                data: 'foo',
                post_logout_redirect_uri: "bar",
                id_token_hint: "baz"
            });

            p.then(request => {
                request.state.data.should.equal('foo');
                var url = request.signoutUrl;
                url.should.contain("http://sts/signout");
                url.should.contain("post_logout_redirect_uri=bar");
                url.should.contain("id_token_hint=baz");
                done();
            });
        });

        it("should fail if metadata fails", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.reject("test");

            var p = subject.createSignoutRequest();

            p.then(null, err => {
                err.message.should.contain("signout");
                done();
            });
        });

        it("should store state", function(done) {
            stubMetadataService.getEndSessionEndpointResult = Promise.resolve("http://sts/signout");

            var p = subject.createSignoutRequest();

            p.then(request => {
                stubStore.item.should.be.ok;
                done();
            });
        });

    });
});

class StubStateStore {
    set(key, value) {
        this.item = value;
        return Promise.resolve();
    }

    remove(key) {
        if (this.error) {
            return Promise.reject(new Error(this.error));
        }
        return Promise.resolve(this.item);
    }
}

class StubResponseValidator {
    validateSigninResponse(state, response) {
        
        this.state = state;
        this.response = response;
        
        if (this.validateSigninResult) {
            return this.validateSigninResult;
        }

        return Promise.resolve(response);
    }
}