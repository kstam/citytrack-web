'use strict';

var latLngBounds = require('leaflet').latLngBounds;
var latLng = require('leaflet').latLng;
var Area = require('model/Area');
var testUtils = require('../testCommons/testUtils');
var utils = require('common/utils');

describe('Area', function() {

    describe('constructor', function() {
        var name = 'Athens';
        var boundingBox = latLngBounds(latLng(10, 40), latLng(30, 60));
        var type = latLngBounds(latLng(10, 40), latLng(30, 60));

        it('should not allow invocation without the new keyword', function() {
            expect(function() {
                Area(name, boundingBox, Area.STATIC_TYPE);
            }).to.throw(TypeError);
        });

        it('should accept name and bounding box arguments', function() {
            var area = new Area(name, boundingBox, Area.INTERACTIVE_TYPE);
            expect(area.getName()).to.be.equal(name);
            expect(area.getBoundingBox()).to.be.equal(boundingBox);
        });

        it('should not accept a non string name', function() {
            expect(function() {
                new Area({}, boundingBox);
            }).to.throw(Error);
        });

        it('should not accept an empty string name', function() {
            expect(function() {
                new Area('', boundingBox);
            }).to.throw(Error);
        });

        it('should not accept null bounding box', function() {
            expect(function() {
                new Area(name, null);
            }).to.throw(Error);
        });

        it('should not accept an invalid type', function() {
            expect(function() {
                new Area(name, boundingBox, 'wrong')
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

    describe('getBoundingBoxAsList', function() {
       it('should return an appropriate list of numbers', function() {
           var area = testUtils.createRandomArea('Athens');
           var bbox = area.getBoundingBox();
           var list = area.getBoundingBoxAsList();
           expect(utils.isArray(list)).to.equal(true);
           expect(list[0]).to.equal(bbox.getSouth());
           expect(list[1]).to.equal(bbox.getWest());
           expect(list[2]).to.equal(bbox.getNorth());
           expect(list[3]).to.equal(bbox.getEast());
       });
    });
});
