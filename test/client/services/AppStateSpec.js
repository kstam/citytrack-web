'use strict';

var sinon = require('sinon');
var expect = require('../../testCommons/chaiExpect');
var testUtils = require('../../testCommons/testUtils');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');
var Params = require('model/Params');
var types = require('model/types');

describe('appState', function() {

    var appState, mockedEventService;

    beforeEach(function() {
        mockedEventService = {
            on: sinon.spy(),
            broadcastEvent: sinon.spy()
        };
        appState = new AppState(mockedEventService);
    });

    describe('default state', function() {
        it('should set area to undefined by default', function() {
            expect(appState.getArea()).to.be.undefined();
        });

        it('should set keyword to empty string by default', function() {
            expect(appState.getKeyword()).to.equal('');
        });

        it('should set the type to undefined', function() {
            expect(appState.getType()).to.be.undefined();
        });
    });

    describe('setters', function() {

        it('should not allow setting invalid area', function() {
            expect(function() {
                appState.setArea({});
            }).to.throw(Error);
            expect(function() {
                appState.setArea(null);
            }).to.throw(Error);
        });

        it('should allow setting the area back to undefined', function() {
            appState.setArea(undefined);
            expect(appState.getArea()).to.be.undefined();
        });

        it('should allow setting the area and should emit the corresponding events', function() {
            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);

            expect(appState.getArea()).to.equal(area);
            expect(mockedEventService.broadcastEvent).to.have.callCount(2);
        });

        it('should not emit an event twice if the setter is called with an existing value', function() {
            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);
            appState.setArea(area);
            expect(mockedEventService.broadcastEvent).to.have.callCount(2);

            appState.setArea(testUtils.cloneArea(area));
            expect(mockedEventService.broadcastEvent).to.have.callCount(2);
        });

        it('should emit proper events when setting the keyword', function() {
            appState.setKeyword('newKeyword1');
            expect(mockedEventService.broadcastEvent).to.have.callCount(2);

            appState.setKeyword('newKeyword2');
            expect(mockedEventService.broadcastEvent).to.have.callCount(4);

            appState.setKeyword('newKeyword2');
            expect(mockedEventService.broadcastEvent).to.have.callCount(4);
        });

        it('should not allow setting invalid keyword', function() {
            expect(function() {
                appState.setKeyword({});
            }).to.throw(Error);
            expect(function() {
                appState.setKeyword(null);
            }).to.throw(Error);
            expect(function() {
                appState.setKeyword(undefined);
            }).to.throw(Error);
        });

        it('should not allow setting invalid type', function() {
            expect(function() {
                appState.setType({});
            }).to.throw(Error);
            expect(function() {
                appState.setType(undefined);
            }).to.throw(Error);
        });

        it('should properly set a valid type', function() {
            appState.setType(types.poi);
            expect(appState.getType()).to.equal(types.poi);
        });

        it('should emmit change events when setting a new type', function() {
            appState.setType(types.poi);
            expect(mockedEventService.broadcastEvent).to.have.callCount(2);

            appState.setType(types.poi);
            expect(mockedEventService.broadcastEvent).to.have.callCount(2); //Didn't fire new event

            appState.setType(types.photo);
            expect(mockedEventService.broadcastEvent).to.have.callCount(4);
        });
    });

    describe('getParams', function() {
        it('should return a params object representing the current appState', function() {
            expect(appState.getParams().equals(new Params(''))).to.be.true();

            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);
            expect(appState.getParams().equals(new Params('', area))).to.be.true();
            appState.setType(types.poi);
            expect(appState.getParams().type).to.equal(types.poi);
        });
    });
});
