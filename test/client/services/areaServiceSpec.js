'use strict';

var expect = require('../../chaiExpect');
var sinon = require('sinon');
var areaService = require('client/services/areaService');
var utils = require('client/services/areaService');
var Area = require('model/Area');

describe('areaService', function() {
    var server;

    function respondJsonToRequest(data, requestNumber) {
        requestNumber = requestNumber || 0;
        server.requests[requestNumber].respond(
            200,
            { "Content-Type": "application/json" },
            JSON.stringify(data));
    }

    it('should be properly defined', function() {
        expect(areaService).to.not.be.null();
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

        it('should correctly map the areas returned by the server', function() {
            var callback = sinon.spy();
            areaService.getAreas(callback);

            server.requests[0].respond(
                200,
                { "Content-Type": "application/json" },
                JSON.stringify([]));

            expect(callback.firstCall.args[0]).to.deep.equal([]);
        });

        it('should correctly map the areas returned by the server for empty array', function() {
            var callback = sinon.spy();
            areaService.getAreas(callback);
            respondJsonToRequest([]);
            expect(callback.firstCall.args[0]).to.deep.equal([]);
        });

        it('should correctly map the areas returned by the server for non empty array', function() {
            var callback = sinon.spy();
            areaService.getAreas(callback);
            var data = [
                new Area('Athens', {lat: 12, lng: 14}, [{lat: 11, lng: 13}, {lat: 13, lng: 15}])
            ];
            respondJsonToRequest(data);

            var response = callback.firstCall.args[0];

            expect(response[0] instanceof Area).to.be.true();
            expect(response[0].getName()).to.equal(data[0].getName());
            expect(response[0].getCenter()).to.deep.equal(data[0].getCenter());
            expect(response[0].getBoundingBox()).to.deep.equal(data[0].getBoundingBox());
        });
    });
});
