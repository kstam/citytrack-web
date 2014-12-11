'use strict';
var MapWidget = require('../../../src/js/client/widgets/MapWidget.js');
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

        it('accepts an HTMLElement as initialization argument', function() {
            var containerElement = $('#' + CONTAINER_ID)[0];
            var mapWidget = new MapWidget(containerElement);
            expect(mapWidget.getMap()).to.not.be.undefined();
        });
    });

    it('should do correctly define a constructor object', function() {
        expect(MapWidget).to.not.be.undefined();
        expect(MapWidget instanceof Function).to.be.true();
    });
});
