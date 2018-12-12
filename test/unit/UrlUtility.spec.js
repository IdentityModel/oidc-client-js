// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import { UrlUtility } from '../../src/UrlUtility';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("UrlUtility", function() {

    describe("addQueryParam", function() {

        it("should add ? if not present", function() {
            UrlUtility.addQueryParam("url", "foo", "test").should.equal("url?foo=test");
        });

        it("should not add ? if already present", function() {
            UrlUtility.addQueryParam("url?", "foo", "test").should.equal("url?foo=test");
        });

        it("should add & if needed", function() {
            UrlUtility.addQueryParam("url?x=1", "foo", "test").should.equal("url?x=1&foo=test");
        });

        it("should urlencode key and value", function() {
            UrlUtility.addQueryParam("url", "#", "#").should.equal("url?%23=%23");
        });
    });

    describe("parseUrlFragment", function() {

        it("should parse key/value pairs", function() {
            let result = UrlUtility.parseUrlFragment("a=apple&b=banana&c=carrot");
            result.should.deep.equal({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse any order", function() {
            let result = UrlUtility.parseUrlFragment("b=banana&c=carrot&a=apple");
            result.should.deep.equal({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse past host name and hash fragment", function() {
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=xoxo/#a=apple&b=banana&c=carrot");
            result.should.deep.equal({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should parse query string", function() {
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=yoyo", "?");
            result.should.deep.equal({ test1: "xoxo", test2: "yoyo" });
        });
        
        it("should parse query string up to hash", function() {
            let result = UrlUtility.parseUrlFragment("http://server?test1=xoxo&test2=yoyo#a=apple&b=banana&c=carrot", "?");
            result.should.deep.equal({ test1: "xoxo", test2: "yoyo" });
        });

        it("should return error for long values", function() {
            let result = UrlUtility.parseUrlFragment("a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple&a=apple");
            result.should.have.property('error');
        });

        it("should use Global.location when no value is passed", function() {
            let w = {
                location: {
                    href : "a=apple&b=banana&c=carrot"
                }
            };
            let result = UrlUtility.parseUrlFragment(null, "#", w);
            result.should.deep.equal({ a: "apple", b: "banana", c: "carrot" });
        });

        it("should return empty object for empty string", function() {
            let result = UrlUtility.parseUrlFragment("");
            result.should.deep.equal({});
        });
    });

});
