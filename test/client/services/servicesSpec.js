'use strict';

require('client/shims/angular');
require('angular-mocks');
var services = require('client/services/services');
var AppState = require('client/services/AppState');

describe('services', function() {

    beforeEach(angular.mock.module(services.name));

    it('correctly defines a NgEventService', inject(['NgEventService', function(eventService) {
        expect(eventService.broadcastEvent).not.to.be.undefined;
        expect(eventService.on).not.to.be.undefined;
    }]));

    it('correctly defines an AppState as a service', inject(['AppState', function(appState) {
        expect(appState.getArea).not.to.be.undefined;
    }]));

    it('correctly defines an AreaService', inject(['AreaService', function(areaService) {
        expect(areaService.getAreas).not.to.be.undefined;
        expect(areaService.getCurrentArea).not.to.be.undefined;
    }]));

    it('correctly defines SearchService', inject(['SearchService', function(searchService) {
        expect(searchService.query).not.to.be.undefined;
    }]));

    it('correctly defines CategoryService', inject(['CategoryService', function(categoryService) {
        expect(categoryService.getCategories).not.to.be.undefined;
    }]));

    it('correctly defines TagCloudService', inject(['TagCloudService', function(tagCloudService) {
        expect(tagCloudService.getRegionTagCloud).not.to.be.undefined();
        expect(tagCloudService.getStreetTagCloud).not.to.be.undefined();
    }]));
});
