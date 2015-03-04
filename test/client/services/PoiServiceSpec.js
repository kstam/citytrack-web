'use strict';

require('angular');
require('angular-mocks');
var ngResource = require('angular-resource');
var testUtils = require('../../testCommons/testUtils');
var PoiService = require('client/services/PoiService');
var mockedData = require('../../data/poiResponse');
var Params = require('model/Params');
var types = require('model/types');

describe('PoiService', function() {
    var httpBackend, poiService;
    var params;

    beforeEach(angular.mock.module('ngResource'));

    beforeEach(inject(function($httpBackend, $resource) {
        httpBackend = $httpBackend;
        poiService = new PoiService($resource);
        httpBackend.whenGET(/api\/pois?.*/).respond(mockedData);
        params = new Params.Builder()
            .withKeyword('keyword')
            .withArea(testUtils.createRandomArea('Athens'))
            .withType(types.poi).build();
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('getPois', function() {
        it('should call the "pois" rest endpoint', function() {

            httpBackend.expectGET(/api\/pois?.*/);
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should throw an error if called invalid params', function() {
            expect(function() {
                poiService.getPois(Params(''));
            }).to.throw(Error);
        });

        it('should return a promise', function(done) {
            poiService.getPois(params)
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
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should set the box in the request parameters', function() {
            var area = testUtils.createRandomArea('Athens');
            httpBackend.expectGET(function(url) {
                return url.indexOf('box=' + area.getBoundingBoxAsList().join(',')) !== -1;
            });
            params.area = area;
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should set the page in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pg=2') !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomArea('Athens'))
                .withPage(2)
                .build();
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should set the pageSize in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pgsize=40') !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomArea('Athens'))
                .withPageSize(40)
                .build();
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should set the src in the request', function() {
            var sources = ['ASource', 'AnotherSource'];
            httpBackend.expectGET(function(url) {
                return url.indexOf('src=' + sources.join(',')) !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomArea('Athens'))
                .withSources(sources)
                .build();
            poiService.getPois(params);
            httpBackend.flush();
        });

        it('should set the cat in the request', function() {
            var categories = ['ACategory', 'AnotherCategory'];
            httpBackend.expectGET(function(url) {
                return url.indexOf('cat=' + categories.join(',')) !== -1;
            });
            var params = new Params.Builder().withType(types.poi)
                .withKeyword('some').withArea(testUtils.createRandomArea('Athens'))
                .withCategories(categories)
                .build();
            poiService.getPois(params);
            httpBackend.flush();
        });
    });
});
