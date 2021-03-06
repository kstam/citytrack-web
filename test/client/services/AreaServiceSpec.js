'use strict';

var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');
var L = require('leaflet');
var AreaService = require('client/services/AreaService');
var testUtils = require('../../testCommons/testUtils');
var Area = require('model/Area');
var constants = require('client/config/constants');

describe('AreaService', function() {
    var server, areaService;

    beforeEach(function() {
        areaService = new AreaService();
    });

    describe('getAreas', function() {

        beforeEach(function() {
            server = sinon.fakeServer.create();
        });

        afterEach(function() {
            server.restore();
        });

        it('should make an ajax call to the api', function() {
            areaService.getAreas();
            expect(server.requests.length).to.equal(1);
            expect(server.requests[0].url).to.equal('/api/areas');
        });

        describe('on success', function() {

            it('should return undefined in the first parameter', function(done) {
                areaService.getAreas(function(err) {
                    expect(err).to.equal(undefined);
                    done();
                });
                respondJsonToRequest([]);
            });

            it('should correctly map the areas returned by the server for empty array', function(done) {
                areaService.getAreas(function(err, response) {
                    expect(response).to.deep.equal([]);
                    done();
                });
                respondJsonToRequest([]);
            });

            it('should correctly map the areas returned by the server for non empty array', function(done) {
                var data = [
                    testUtils.createRandomAreaServerResult('Athens')
                ];
                areaService.getAreas(function(err, response) {
                    expect(response[0] instanceof Area).to.be.true();
                    expect(response[0].getName()).to.equal(data[0].name);
                    expect(response[0].getType()).to.equal(Area.STATIC_TYPE);
                    expect(response[0].getBoundingBox().getWest()).to.equal(data[0].bbox.minLng);
                    expect(response[0].getBoundingBox().getEast()).to.equal(data[0].bbox.maxLng);
                    expect(response[0].getBoundingBox().getNorth()).to.equal(data[0].bbox.maxLat);
                    expect(response[0].getBoundingBox().getSouth()).to.equal(data[0].bbox.minLat);
                    done();
                });
                respondJsonToRequest(data);
            });
        });

        describe('on error', function() {
            it('should return an error in the first parameter', function(done) {
                areaService.getAreas(function(err) {
                    expect(err instanceof Error).to.equal(true);
                    expect(err.message).to.contain("400");
                    done();
                });
                respondWithError(400);
            });
        });
    });

    describe('getCurrentArea', function() {

        var mockedPosition = {
            coords: {
                latitude: 10,
                longitude: 50,
                accuracy: 5
            },
            timestamp: new Date().getTime()
        };

        var savedNavigator;
        beforeEach(function() {
            savedNavigator = window.navigator;
            window.navigator = {
                geolocation: {
                    getCurrentPosition: function() {
                    }
                }
            };
        });

        afterEach(function() {
            window.navigator = savedNavigator;
        });

        it('should not allow non function object to be passed as callback', function() {
            expect(function() {
                areaService.getCurrentArea({});
            }).to.throw(Error);
        });

        describe('when browser does not support geolocation', function() {
            it('should return appropriate error if navigator does not exist', function(done) {
                window.navigator = undefined;
                areaService.getCurrentArea(function(err, area) {
                    expect(err instanceof Error).to.be.true();
                    expect(area).to.be.undefined();
                    done();
                });
            });

            it('should return appropriate error if geolocation does not exist', function(done) {
                window.navigator.geolocation = undefined;
                areaService.getCurrentArea(function(err, area) {
                    expect(err instanceof Error).to.be.true();
                    expect(area).to.be.undefined();
                    done();
                });
            });
        });

        describe('on success', function() {
            beforeEach(function() {
                sinon.stub(window.navigator.geolocation, 'getCurrentPosition', function(success) {
                    success(mockedPosition);
                });
            });

            afterEach(function() {
                window.navigator.geolocation.getCurrentPosition.restore();
            });

            it('returns an area with a bounding box that contains the position', function(done) {
                areaService.getCurrentArea(function(err, area) {
                    expect(err).to.be.undefined();
                    var bbox = area.getBoundingBox();
                    expect(area.getName()).to.equal(constants.CURRENT_AREA_ID);
                    expect(area.getType()).to.equal(Area.INTERACTIVE_TYPE);
                    expect(bbox.contains(L.latLng(mockedPosition.coords.latitude, mockedPosition.coords.longitude)))
                        .to.equal(true);
                    done();
                });
            });
        });

        describe('on error', function() {
            beforeEach(function() {
                sinon.stub(window.navigator.geolocation, 'getCurrentPosition', function(success, error) {
                    error(new Error());
                });
            });

            afterEach(function() {
                window.navigator.geolocation.getCurrentPosition.restore();
            });

            it('returns an area with center the same as the position', function(done) {
                areaService.getCurrentArea(function(err, area) {
                    expect(err instanceof Error).to.be.true();
                    expect(area).to.be.undefined();
                    done();
                });
            });
        });
    });


    function respondJsonToRequest(data, requestNumber) {
        requestNumber = requestNumber || 0;
        server.requests[requestNumber].respond(
            200,
            {"Content-Type": "application/json"},
            JSON.stringify(data));
    }

    function respondWithError(errorNumber, requestNumber) {
        errorNumber = errorNumber || 400;
        requestNumber = requestNumber || 0;
        server.requests[requestNumber].respond(
            errorNumber,
            {"Content-Type": "application/json"}, "");
    }
});
