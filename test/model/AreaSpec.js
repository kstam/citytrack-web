'use strict';

var Area = require('model/Area');
var testUtils = require('../testCommons/testUtils');
var utils = require('common/utils');

describe('Area', function() {

    describe('constructor', function() {
        var name = 'Athens';

        it('should not allow invocation without the new keyword', function() {
            expect(function() {
                Area(name, Area.STATIC_TYPE);
            }).to.throw(TypeError);
        });

        it('should accept name and type args', function() {
            var area = new Area(name, Area.INTERACTIVE_TYPE);
            expect(area.getName()).to.be.equal(name);
            expect(area.getType()).to.be.equal(Area.INTERACTIVE_TYPE);
        });

        it('should not accept a non string name', function() {
            expect(function() {
                new Area({});
            }).to.throw(Error);
        });

        it('should not accept an empty string name', function() {
            expect(function() {
                new Area('');
            }).to.throw(Error);
        });

        it('should not accept an invalid type', function() {
            expect(function() {
                new Area(name, 'wrong')
            }).to.throw(Error);
        });
    });

    describe('equals', function() {
        it('should return true if two areas are the same', function() {
            var area1 = new Area('Athens', Area.INTERACTIVE_TYPE);
            var area2 = area1;
            var area3 = testUtils.cloneArea(area1);

            expect(area1.equals(area2)).to.be.true();
            expect(area1.equals(area3)).to.be.true();
        });

        it('should return false otherwise', function() {
            var area1 = new Area('Athens', Area.INTERACTIVE_TYPE);
            var area2 = new Area('Volos', Area.INTERACTIVE_TYPE);

            expect(area1.equals(null)).to.be.false();
            expect(area1.equals()).to.be.false();
            expect(area1.equals(area2)).to.be.false();
        });
    });
});
