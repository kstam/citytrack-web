'use strict';

var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;
var Area = require('model/Area');
var testUtils = require('../testCommons/testUtils');

describe('Area', function() {

    describe('constructor', function() {
        var name = 'Athens';
        var center = latLng(20, 50);
        var boundingBox = latLngBounds(latLng(10, 40), latLng(30, 60));

        it('should not allow invocation without the new keyword', function() {
            expect(function() {
                Area(name, center, boundingBox);
            }).to.throw(TypeError);
        });

        it('should accept a name, center and bounding box arguments', function() {
            var area = new Area(name, center, boundingBox);
            expect(area.getName()).to.be.equal(name);
            expect(area.getCenter()).to.be.equal(center);
            expect(area.getBoundingBox()).to.be.equal(boundingBox);
        });

        it('should not a accept a non string name', function() {
            expect(function() {
                new Area({}, center, boundingBox);
            }).to.throw(Error);
        });

        it('should not a accept an empty string name', function() {
            expect(function() {
                new Area('', center, boundingBox);
            }).to.throw(Error);
        });

        it('should not a accept null center', function() {
            expect(function() {
                new Area(name, null, boundingBox);
            }).to.throw(Error);
        });

        it('should not a accept null bounding box', function() {
            expect(function() {
                new Area(name, center, null);
            }).to.throw(Error);
        });
    });

    describe('equals', function() {
        it('should return true if two areas are the same', function() {
            var area1 = testUtils.createRandomArea('Athens');
            var area2 = area1;
            var area3 = testUtils.cloneArea(area1);

            expect(area1.equals(area2)).to.be.true();
            expect(area1.equals(area3)).to.be.true();
        });

        it('should return false otherwise', function() {
            var area1 = testUtils.createRandomArea('Athens');
            var area2 = testUtils.createRandomArea('Zurich');

            expect(area1.equals(null)).to.be.false();
            expect(area1.equals()).to.be.false();
            expect(area1.equals(area2)).to.be.false();
        });
    });
});