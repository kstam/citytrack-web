'use strict';

require('angular');
require('angular-mocks');
var ngResource = require('angular-resource');
var testUtils = require('../../testCommons/testUtils');
var PoiService = require('client/services/PoiService');
var mockedData = require('../../data/poiResponse');

describe('PoiService', function() {
    var httpBackend, poiService;

    beforeEach(angular.mock.module('ngResource'));

    beforeEach(inject(function($httpBackend, $resource) {
        httpBackend = $httpBackend;
        poiService = new PoiService($resource);
        httpBackend.whenGET(/api\/pois?.*/).respond(mockedData);
    }));

    afterEach(function() {
        httpBackend.verifyNoOutstandingExpectation();
        httpBackend.verifyNoOutstandingRequest();
    });

    describe('getPois', function() {
        it('should call the "pois" rest endpoint', function() {
            httpBackend.expectGET(/api\/pois?.*/);
            poiService.getPois({keyword: 'keyword', area: testUtils.createRandomArea('Athens')});
            httpBackend.flush();
        });

        it('should throw an error if called without keyword', function() {
            expect(function() {
                poiService.getPois({area: testUtils.createRandomArea('Athens')});
            }).to.throw(Error);
        });

        it('should throw an error if called with invalid area', function() {
            expect(function() {
                poiService.getPois({keyword: 'keyword'});
            }).to.throw(Error);
        });

        it('should return a promise', function(done) {
            poiService.getPois({keyword: 'keyword', area: testUtils.createRandomArea('Athens')})
                .then(function(data) {
                    expect(data).not.to.equal(undefined);
                    expect(data.rows).to.equal(20);
                    done();
                });
            httpBackend.flush();
        });

        it('should set the keyword in the request parameters', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('q=some') !== -1;
            });
            poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens')});
            httpBackend.flush();
        });

        it('should set the box in the request parameters', function() {
            var area = testUtils.createRandomArea('Athens');
            httpBackend.expectGET(function(url) {
                return url.indexOf('box=' + area.getBoundingBoxAsList().join(',')) !== -1;
            });
            poiService.getPois({keyword: 'some', area: area});
            httpBackend.flush();
        });

        it('should set the page in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pg=2') !== -1;
            });
            poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), page: 2});
            httpBackend.flush();
        });

        it('should throw an error if page was set to a non integer', function() {
            expect(function() {
                poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), page: 'wrong'});
            }).to.throw(Error);
        });

        it('should set the pageSize in the request', function() {
            httpBackend.expectGET(function(url) {
                return url.indexOf('pgsize=40') !== -1;
            });
            poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), pageSize: 40});
            httpBackend.flush();
        });

        it('should throw an error if the pageSize is not a valid int', function() {
            expect(function() {
                poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), pageSize: {}});
            }).to.throw(Error);
        });

        it('should set the src in the request', function() {
            var sources = ['ASource', 'AnotherSource'];
            httpBackend.expectGET(function(url) {
                return url.indexOf('src=' + sources.join(',')) !== -1;
            });
            poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), sources: sources});
            httpBackend.flush();
        });

        it('should throw an error if the sources is not a valid array', function() {
            expect(function() {
                poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), sources: 'source'});
            }).to.throw(Error);
        });

        it('should set the cat in the request', function() {
            var categories = ['ACategory', 'AnotherCategory'];
            httpBackend.expectGET(function(url) {
                return url.indexOf('cat=' + categories.join(',')) !== -1;
            });
            poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), categories: categories});
            httpBackend.flush();
        });

        it('should throw an error if the categories is not a valid array', function() {
            expect(function() {
                poiService.getPois({keyword: 'some', area: testUtils.createRandomArea('Athens'), categories: 'wrong'});
            }).to.throw(Error);
        });

    });

});
