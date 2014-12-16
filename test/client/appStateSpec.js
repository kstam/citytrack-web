'use strict';

var sinon = require('sinon');
var expect = require('../testCommons/chaiExpect');

var eventBus = require('client/eventBus');
var testUtils = require('../testCommons/testUtils');

var appState = require('client/appState');

describe('appState', function() {

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

        it('does not allow setting invalid area', function() {
            expect(function() {
                appState.set({});
            }).to.throw(Error);
            expect(function() {
                appState.set();
            }).to.throw(Error);
            expect(function() {
                appState.set(null);
            }).to.throw(Error);
        });

        it('should allow setting the area and should emit the corresponding events', function() {
            eventBus.once(appState.APP_STATE_CHANGED_EVT, appStateChangedListener);
            eventBus.once(appState.AREA_CHANGED_EVT, areaChangedListener);

            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);

            expect(appState.getArea()).to.equal(area);
            expect(appStateChangedListener).to.have.been.calledWithExactly(area);
            expect(areaChangedListener).to.have.been.calledWithExactly(area);
        });

        it('should not emit an event twice if the setter is called with an existing value', function() {
            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);

            eventBus.once(appState.APP_STATE_CHANGED_EVT, appStateChangedListener);
            eventBus.once(appState.AREA_CHANGED_EVT, areaChangedListener);

            appState.setArea(area);
            expect(appStateChangedListener).to.have.callCount(0);
            expect(areaChangedListener).to.have.callCount(0);

            appState.setArea(testUtils.cloneArea(area));
            expect(appStateChangedListener).to.have.callCount(0);
            expect(areaChangedListener).to.have.callCount(0);
        });
    });
});
