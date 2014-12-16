'use strict';

var sinon = require('sinon');
var expect = require('../chaiExpect');

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

        it('should allow setting the area and should emit the corresponding events', function() {
            var appStateChangedListener = sinon.spy();
            var areaChangedListener = sinon.spy();

            eventBus.on(appState.APP_STATE_CHANGED_EVT, appStateChangedListener);
            eventBus.on(appState.AREA_CHANGED_EVT, areaChangedListener);

            var area = testUtils.createRandomArea('Athens');
            appState.setArea(area);

            expect(appState.getArea()).to.equal(area);
            expect(appStateChangedListener).to.have.been.calledWithExactly(area);
            expect(areaChangedListener).to.have.been.calledWithExactly(area);
        });
    });
});
