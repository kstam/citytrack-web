'use strict';

var sinon = require('sinon');
var expect = require('../../testCommons/chaiExpect');
var testUtils = require('../../testCommons/testUtils');
var AppState = require('client/services/AppState');
var NgEventService = require('client/services/NgEventService');

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
    });

    describe('setters', function() {
        var appStateChangedListener, areaChangedListener;

        beforeEach(function() {
            appStateChangedListener = sinon.spy();
            areaChangedListener = sinon.spy();
        });

        it('should not allow setting invalid area', function() {
            expect(function() {
                appState.set({});
            }).to.throw(Error);
            expect(function() {
                appState.set(null);
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
    });
});
