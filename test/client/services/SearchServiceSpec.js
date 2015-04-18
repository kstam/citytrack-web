'use strict';

require('angular');
require('angular-mocks');
var ngResource = require('angular-resource');
var testUtils = require('../../testCommons/testUtils');
var SearchService = require('client/services/SearchService');
var poiData = require('../../data/poiResponse');
var photoData = require('../../data/photoResponse');
var eventData = require('../../data/eventResponse');
var Params = require('model/Params');
var AppState = require('client/services/AppState');
var types = require('model/types');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');

describe('SearchService', function() {
    var httpBackend, searchService;
    var params, mockedEventService, appState;

    beforeEach(angular.mock.module('ngResource'));

    beforeEach(function() {
        mockedEventService = {};
        appState = new AppState(mockedEventService);
    });

    beforeEach(inject(function($httpBackend, $resource) {
        httpBackend = $httpBackend;
        searchService = new SearchService($resource);
        httpBackend.whenGET(/api\/pois?.*/).respond(poiData);
        httpBackend.whenGET(/api\/photos?.*/).respond(photoData);
        httpBackend.whenGET(/api\/events?.*/).respond(eventData);
        httpBackend.whenGET(/api\/streets?.*/).respond(eventData);
        httpBackend.whenGET(/api\/scenicStreets?.*/).respond(eventData);
        params = new Params.Builder()
            .withKeyword('keyword')
            .withArea(testUtils.createRandomBoxArea('Athens'))
            .withType(types.poi).build();
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('query', function() {

        it('should return an errored promise if called invalid params', function() {
            expect(function() {
                searchService.query(Params(''));
            }).to.throw(Error);
        });

        it('should return a promise', function(done) {
            searchService.query(params)
                .then(function(data) {
                    expect(data).not.to.equal(undefined);
                    expect(data.rows).to.equal(20);
                    done();
                });
            httpBackend.flush();
        });

        it('should set the keyword in the request parameters', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('q=keyword') !== -1;
            });
            searchService.query(params);
            httpBackend.flush();
        });

        it('should set the box in the request parameters', function() {
            var area = testUtils.createRandomBoxArea('Athens');
            httpBackend.expectGET(function(url) {
                return url.indexOf('box=' + area.getBoundingBoxAsList().join(',')) !== -1;
            });
            params.area = area;
            searchService.query(params);
            httpBackend.flush();
        });

        it('should set the page in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pg=2') !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomBoxArea('Athens'))
                .withPage(2)
                .build();
            searchService.query(params);
            httpBackend.flush();
        });

        it('should set the pageSize in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pgsize=40') !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomBoxArea('Athens'))
                .withPageSize(40)
                .build();
            searchService.query(params);
            httpBackend.flush();
        });

        it('should set the src in the request', function() {
            var sources = ['ASource', 'AnotherSource'];
            httpBackend.expectGET(function(url) {
                return url.indexOf('src=' + sources.join(',')) !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomBoxArea('Athens'))
                .withSources(sources)
                .build();
            searchService.query(params);
            httpBackend.flush();
        });

        describe('when params.type is "poi"', function() {
            it('should call the "pois" rest endpoint', function() {
                httpBackend.expectGET(/api\/pois?.*/);
                searchService.query(params);
                httpBackend.flush();
            });

            it('should set the cat in the request', function() {
                var categories = ['ACategory', 'AnotherCategory'];
                httpBackend.expectGET(function(url) {
                    return url.indexOf('cat=' + categories.join(',')) !== -1;
                });
                var params = new Params.Builder().withType(types.poi)
                    .withKeyword('some').withArea(testUtils.createRandomBoxArea('Athens'))
                    .withCategories(categories)
                    .build();
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is "photo"', function() {
            it('should call the "photos" rest endpoint', function() {
                params.type = types.photo;
                httpBackend.expectGET(/api\/photos?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is "event"', function() {
            it('should call the "events" rest endpoint', function() {
                params.type = types.event;
                httpBackend.expectGET(/api\/events?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is streetofinterest', function() {
            it('should call the "streets" rest endpoint', function() {
                params.type = types.streetofinterest;
                httpBackend.expectGET(/api\/streets?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is scenicstreets', function() {
            it('should call the "scenicStreets" rest endpoint', function() {
                params.type = types.scenicstreets;
                httpBackend.expectGET(/api\/scenicStreets?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is poisforstreet', function() {
            it('should call the streets/id/pois rest endpoint with the correct streetId', function() {
                params.type = types.poisforstreet;
                params.streetId = 12345;
                httpBackend.expectGET(/api\/streets\/12345\/pois?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is photosforstreet', function() {
            it('should call the /streets/{id}/photos endpoint', function() {
                params.type = types.photosforstreet;
                params.streetId = 12345;
                httpBackend.expectGET(/api\/streets\/12345\/photos?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });

        describe('when params.type is diversestreetphotos', function() {
            it('should call the /streets/{id}/diversePhotos endpoint', function() {
                params.type = types.diversestreetphotos;
                params.streetId = 12345;
                httpBackend.expectGET(/api\/streets\/12345\/diversePhotos?.*/);
                searchService.query(params);
                httpBackend.flush();
            });
        });
    });
});
