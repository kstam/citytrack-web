'use strict';

var popupFactory = require('client/map/popupFactory');
var mockedPois= require('../../data/poiResponse').collection.features;
var utils = require('common/utils');

describe('popupFactory', function() {

    describe('getPopupHmtl', function() {
        it('should return a valid template for a poi', function() {
            var poi = mockedPois[0];
            var html = popupFactory.getPopupHtml(mockedPois[0]);
            var categories = utils.getArrayFromString(poi.properties.category);
            expect(html).to.contain(poi.properties.label);
                expect(html).to.contain(poi.properties.description);
            expect(html).to.contain(categories[0]);
            expect(html).to.contain(categories[1]);
        });
    });
});
