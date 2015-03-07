'use strict';

var L = require('leaflet');
var markerFactory = require('client/map/markerFactory');
var poiFeature = require('../../data/poiResponse').collection.features[0];

describe('markerFactory', function() {
    var latLng = L.latLng(10, 20);

    it('returns a marker when called with a feature and a latLng', function() {
        var marker = markerFactory.forPoint(poiFeature, latLng);
        expect(marker).not.to.be.undefined();
    });

    describe('defines appropriate icon for the marker and', function() {
        it('should return marker for everyfeature', function() {
            var marker = markerFactory.forPoint(poiFeature, latLng);
            expect(marker.options.icon.options.iconUrl).to.equal('img/marker-icon.png');
        });
    });
});
