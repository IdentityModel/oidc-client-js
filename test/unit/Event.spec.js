
// Copyright (c) Brock Allen & Dominick Baier. All rights reserved.
// Licensed under the Apache License, Version 2.0. See LICENSE in the project root for license information.

import Event from '../../src/Event';

import chai from 'chai';
chai.should();
let assert = chai.assert;

describe("Event", function () {

    let subject;

    beforeEach(function () {
        subject = new Event();
    });

    describe("addHandler", function () {

        it("should allow callback to be invoked", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            subject.addHandler(cb);

            subject.raise();

            cb.wasCalled.should.be.true;
        });
        
        it("should allow multiple callbacks", function () {
            var count = 0;
            var cb = function () {
                count++;
            };
            subject.addHandler(cb);
            subject.addHandler(cb);
            subject.addHandler(cb);
            subject.addHandler(cb);

            subject.raise();

            count.should.equal(4);
        });

    });

    describe("removeHandler", function () {

        it("should remove callback from being invoked", function () {
            var cb = function () {
                cb.wasCalled = true;
            };
            cb.wasCalled = false;
            
            subject.addHandler(cb);
            subject.removeHandler(cb);
            subject.raise();

            cb.wasCalled.should.be.false;
        });
        
        it("should remove individual callback", function () {
            var count = 0;
            var cb1 = function () {
                count++;
            };
            var cb2 = function () {
                cb2.wasCalled = true;
            };

            subject.addHandler(cb1);
            subject.addHandler(cb2);
            subject.addHandler(cb1);
            subject.removeHandler(cb1);
            subject.removeHandler(cb1);
            
            subject.raise();

            count.should.equal(0);
            cb2.wasCalled.should.be.true;
        });

    });

});
