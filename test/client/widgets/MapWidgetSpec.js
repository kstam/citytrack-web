'use strict';
var MapWidget = require('client/widgets/MapWidget.js');
var Area = require('model/Area');
var $ = require('jquery');

describe('MapWidget', function() {

    var CONTAINER_ID = 'mapContainerId';

    beforeEach(function() {
        var container = $('<div id="' + CONTAINER_ID + '"></div>');
        $(document.body).prepend(container);
    });

    afterEach(function() {
        $('#' + CONTAINER_ID).remove();
    });

    describe('allows initialization of a map and', function() {
        it('should not allow illegal mapId', function() {
            expect(function() {
                new MapWidget()
            }).to.throw(Error);
            expect(function() {
                new MapWidget('')
            }).to.throw(Error);
            expect(function() {
                new MapWidget(null)
            }).to.throw(Error);
            expect(function() {
                new MapWidget({})
            }).to.throw(Error);
            expect(function() {
                new MapWidget([])
            }).to.throw(Error);
        });

        it('should be properly initialized with a correct mapId', function() {
            var mapWidget = new MapWidget(CONTAINER_ID);
            expect(mapWidget.getMap()).to.not.be.undefined();
        });

        it('should accept an HTMLElement as initialization argument', function() {
            var containerElement = $('#' + CONTAINER_ID)[0];
            var mapWidget = new MapWidget(containerElement);
            expect(mapWidget.getMap()).to.not.be.undefined();
        });

        it('should pass the options given to the map', function() {
            var options = {
                zoom: 1.5,
                center: [20, 90]
            };
            var mapWidget = new MapWidget(CONTAINER_ID, options);
            expect(mapWidget.getMap().getZoom()).to.be.equal(1.5);
            expect(mapWidget.getMap().getCenter().lat).to.be.equal(20);
            expect(mapWidget.getMap().getCenter().lng).to.be.equal(90);
        });
    });

    describe('setView', function() {
        var mapWidget;
        beforeEach(function() {
            mapWidget = new MapWidget(CONTAINER_ID);
        });

        it('should allow centering the view to a given area', function() {
            var athens = new Area('Athens', {lat: 30, lng: 50}, [{lat: 20, lng: 40}, {lat: 40, lng: 60}]);

            mapWidget.setView(athens);
            var center = mapWidget.getMap().getCenter();

            expect(center.lat).to.equal(athens.getCenter().lat);
            expect(center.lng).to.equal(athens.getCenter().lng);
        });
    });

    it('should do correctly define a constructor object', function() {
        expect(MapWidget).to.not.be.undefined();
        expect(MapWidget instanceof Function).to.be.true();
    });
});
