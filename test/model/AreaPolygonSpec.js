'use strict';

var latLng = require('leaflet').latLng;
var Area = require('model/Area');
var AreaPolygon = require('model/AreaPolygon');
var testUtils = require('../testCommons/testUtils');
var utils = require('common/utils');

describe('AreaPolygon', function() {

    describe('constructor', function() {
        var name = 'Athens';
        var polygon = [latLng(30, 60), latLng(40, 50), latLng(50, 60), latLng(30, 60)];
        var type = Area.STATIC_TYPE;

        it('should not allow invocation without the new keyword', function() {
            expect(function() {
                AreaPolygon(name, polygon, Area.INTERACTIVE_TYPE);
            }).to.throw(TypeError);
        });

        it('should accept polygon argument', function() {
            var area = new AreaPolygon(name, polygon, type);
            expect(area.getName()).to.equal(name);
            expect(area.getPolygon()).to.equal(polygon);
        });

        it('should not accept a non string name', function() {
            expect(function() {
                new AreaPolygon({}, polygon, type);
            }).to.throw(Error);
        });

        it('should not accept an empty string name', function() {
            expect(function() {
                new AreaPolygon('', polygon, type);
            }).to.throw(Error);
        });

        it('should not accept null polygon', function() {
            expect(function() {
                new AreaPolygon(name, null, type);
            }).to.throw(Error);
        });

        it('should not accept empty array as polygon', function() {
            expect(function() {
                new AreaPolygon(name, [], type);
            }).to.throw(Error);
        });

        it('should not accept array that doesnt end with the same element it starts with', function() {
            expect(function() {
                new AreaPolygon(name, [latLng(1, 0), latLng(2, 1), latLng(3, 1)], type);
            }).to.throw(Error);
        });

        it('should not accept an invalid type', function() {
            expect(function() {
                new AreaPolygon(name, polygon, 'wrong')
            }).to.throw(Error);
        });
    });

    describe('equals', function() {
        it('should return true if two areas are the same', function() {
            var polygon1 = [latLng(1, 0), latLng(2, 0), latLng(2,1), latLng(1, 0)];
            var polygon2 = [latLng(1, 0), latLng(2, 0), latLng(2,1), latLng(1, 0)];
            var area1 = new AreaPolygon("Athens", polygon1, Area.INTERACTIVE_TYPE);
            var area2 = new AreaPolygon("Athens", polygon2, Area.INTERACTIVE_TYPE);
            var area3 = area1;

            expect(area1.equals(area2)).to.be.true();
            expect(area1.equals(area3)).to.be.true();
        });

        it('should return false otherwise', function() {
            var polygon1 = [latLng(1, 0), latLng(2, 0), latLng(2,1), latLng(1, 0)];
            var polygon2 = [latLng(1, 0), latLng(3, 0), latLng(2,1), latLng(1, 0)];
            var area1 = new AreaPolygon("Athens", polygon1, Area.INTERACTIVE_TYPE);
            var area2 = new AreaPolygon("Zurich", polygon1, Area.INTERACTIVE_TYPE);
            var area3 = new AreaPolygon("Athens", polygon2, Area.INTERACTIVE_TYPE);

            expect(area1.equals(null)).to.be.false();
            expect(area1.equals()).to.be.false();
            expect(area1.equals(area2)).to.be.false();
            expect(area1.equals(area3)).to.be.false();
        });
    });

    describe('getPolygonAsList', function() {
        it('should return an appropriate list of strings', function() {
            var area = testUtils.createRandomPolygonArea('Athens');
            var polygon = area.getPolygon();
            var list = area.getPolygonAsList();
            expect(utils.isArray(list)).to.equal(true);
            list.forEach(function(element, idx) {
                expect(element).to.equal(polygon[idx].lat + ';' + polygon[idx].lng);
            });
        });
    });

    describe('getBoundingBox', function() {
        it('should return a latlngBounds object', function() {
            var area = testUtils.createRandomPolygonArea('Athens');
            var bounds = area.getBoundingBox();
            expect(bounds).to.not.be.undefined();
        });
    });
});
