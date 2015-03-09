'use strict';

var fields = require('model/fields');

describe('fields', function() {

    it('should define fields and their userFriendlyNames', function() {
        expect(fields.source).not.to.be.undefined();
        expect(fields.source.userFriendly).not.to.be.undefined();
    });

    describe('exposes isCategory method that', function() {
        it('should return true only for category id', function() {
            expect(fields.isCategory(fields.CATEGORY_ID)).to.be.true();
            expect(fields.isCategory('anything else')).to.be.false();
        });
    });

    describe('exposes isSource method that', function() {
        it('should return true only for source id', function() {
            expect(fields.isSource(fields.SOURCE_ID)).to.be.true();
            expect(fields.isSource('anything else')).to.be.false();
        });
    });

    describe('exposes isTag method that', function() {
        it('should return true only for tag id', function() {
            expect(fields.isTag(fields.TAG_ID)).to.be.true();
            expect(fields.isTag('anything else')).to.be.false();
        });
    });
});
