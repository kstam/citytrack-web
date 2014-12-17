'use strict';

var $ = require('jquery');
var sinon = require('sinon');
var areaService = require('client/services/areaService');
var AreaSelecteWidget = require('client/widgets/AreaSelectWidget');
var testUtils = require('../../testCommons/testUtils');
var expect = require('../../testCommons/chaiExpect');
var appState = require('client/appState');

describe('AreaSelectWidget', function() {

    var CONTAINER_ID = 'selectContainerId';
    var container, $container, $selectInput;
    var areaSelectWidget;
    var mockedData = [
        testUtils.createRandomArea('Athens'),
        testUtils.createRandomArea('Zurich')
    ];

    beforeEach(function() {
        $container = $('<div id="' + CONTAINER_ID + '"></div>');
        container = $container[0];

        $(document.body).prepend($container);

        sinon.stub(areaService, 'getAreas', function(callback) {
            callback(mockedData);
        });

        areaSelectWidget = new AreaSelecteWidget(container);
        $selectInput = $(container).find('input:first');
    });

    afterEach(function() {
        areaService.getAreas.restore();
        $container.remove();
    });

    describe('constructor', function() {
        it('should allow creation with a valid HTMLElement', function() {
            expect(new AreaSelecteWidget(container)).to.not.be.undefined();
        });

        it('should allow creation with a valid ID', function() {
            expect(new AreaSelecteWidget(CONTAINER_ID)).to.not.be.undefined();
        });

        it('should call the areaService to get the available locations from the server', function() {
            expect(areaService.getAreas).to.have.been.callCount(1);
            expect(areaSelectWidget.getAvailableAreas()['Athens']).to.equal(mockedData[0]);
        });
    });

    describe('set/get', function() {
        it('should return undefined if nothing is selected', function() {
            expect(areaSelectWidget.getArea()).to.be.undefined();
        });

        it('should allow setting the selected area programatically', function() {
            areaSelectWidget.setArea(mockedData[0]);
            expect(areaSelectWidget.getArea()).to.equal(mockedData[0]);
        });

        it('should not allow setting an invalid area', function() {
            expect(function() {
                areaSelectWidget.setArea(null);
            }).to.throw(Error);
        });
    });

    describe('listens to events and', function() {
        it('should update the appState when the selection changes', function() {
            areaSelectWidget.setArea(mockedData[0]);
            expect(appState.getArea()).to.equal(mockedData[0]);
            areaSelectWidget.setArea(mockedData[1]);
            expect(appState.getArea()).to.equal(mockedData[1]);
        });

        it('should update the selected area when the appState changes', function() {
            appState.setArea(mockedData[0]);
            appState.setArea(mockedData[1]);
            expect(areaSelectWidget.getArea()).to.equal(mockedData[1]);
            appState.setArea(mockedData[0]);
            expect(areaSelectWidget.getArea()).to.equal(mockedData[0]);
        });
    });
});
