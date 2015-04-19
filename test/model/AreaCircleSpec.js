'use strict';

var latLng = require('leaflet').latLng;
var Area = require('model/Area');
var AreaCircle = require('model/AreaCircle');
var testUtils = require('../testCommons/testUtils');
var utils = require('common/utils');

describe('AreaCircle', function() {

    describe('constructor', function() {
        var name = 'Athens';
        var center = latLng(30, 60);
        var radius = 100.5;
        var type = Area.STATIC_TYPE;

        it('should not allow invocation without the new keyword', function() {
            expect(function() {
                AreaCircle(name, center, 100.5, Area.INTERACTIVE_TYPE);
            }).to.throw(TypeError);
        });

        it('should accept name center and radius arguments', function() {
            var area = new AreaCircle(name, center, radius, type);
            expect(area.getName()).to.be.equal(name);
            expect(area.getCenter()).to.be.equal(center);
            expect(area.getRadius()).to.be.equal(radius);
        });

        it('should not accept a non string name', function() {
            expect(function() {
                new AreaCircle({}, center, radius, type);
            }).to.throw(Error);
        });

        it('should not accept an empty string name', function() {
            expect(function() {
                new AreaCircle('', center, radius, type);
            }).to.throw(Error);
        });

        it('should not accept null center', function() {
            expect(function() {
                new AreaCircle(name, null, radius, type);
            }).to.throw(Error);
        });

        it('should not accept null radius', function() {
            expect(function() {
                new AreaCircle(name, center, null, type);
            }).to.throw(Error);
        });

        it('should not accept zero or negative radius', function() {
            expect(function() {
                new AreaCircle(name, center, 0, type);
            }).to.throw(Error);
        });

        it('should not accept zero or negative radius', function() {
            expect(function() {
                new AreaCircle(name, center, -1, type);
            }).to.throw(Error);
        });

        it('should not accept an invalid type', function() {
            expect(function() {
                new AreaCircle(name, center, radius, 'wrong')
            }).to.throw(Error);
        });
    });

    describe('equals', function() {
        it('should return true if two areas are the same', function() {
            var area1 = testUtils.createRandomCircleArea('Athens');
            var area2 = area1;
            var area3 = testUtils.cloneArea(area1);
            expect(area1.equals(area2)).to.be.true();
            expect(area1.equals(area3)).to.be.true();
        });

        it('should return false otherwise', function() {
            var area1 = testUtils.createRandomCircleArea('Athens');
            var area2 = testUtils.createRandomCircleArea('Zurich');

            expect(area1.equals(null)).to.be.false();
            expect(area1.equals()).to.be.false();
            expect(area1.equals(area2)).to.be.false();
        });
    });

    describe('getCenterAsList', function() {
       it('should return an appropriate list of numbers', function() {
           var area = testUtils.createRandomCircleArea('Athens');
           var center = area.getCenter();
           var list = area.getCenterAsList();
           expect(utils.isArray(list)).to.equal(true);
           expect(list[0]).to.equal(center.lat);
           expect(list[1]).to.equal(center.lng);
       });
    });

    describe('getBoundingBox', function() {
        it('should return a latlngBounds object that contains the center', function() {
            var area = testUtils.createRandomCircleArea('Athens');
            var bounds = area.getBoundingBox();
            expect(bounds.contains(area.getCenter())).to.be.true();
        });
    });
});
