'use strict';

var $ = require('jquery');
var sinon = require('sinon');
var HeaderController = require('client/controllers/HeaderController');
var domify = require('domify');
var headerAreaTemplate = require('partials/header.hbs');
var areaService = require('client/services/areaService');
var constants = require('client/config/constants');
var testUtils = require('../../testCommons/testUtils');
var appState = require('client/appState');

describe('HeaderController', function() {

    var headerArea;
    var mockedData = [
        testUtils.createRandomArea('Athens'),
        testUtils.createRandomArea('Zurich')
    ];
    var currentAreaMock = testUtils.createRandomArea(constants.CURRENT_AREA_ID);

    beforeEach(function() {
        headerArea = domify(headerAreaTemplate());
        sinon.stub(areaService, 'getAreas', function(callback) {
            callback(mockedData);
        });

        sinon.stub(areaService, 'getCurrentArea', function(callback) {
            callback(null, currentAreaMock);
        });
        $(document.body).prepend(headerArea);
    });

    afterEach(function() {
        areaService.getAreas.restore();
        areaService.getCurrentArea.restore();
        $(headerArea).remove();
    });

    describe('constructor', function() {
        it('should allow creation with a valid HTMLElement', function() {
            expect(new HeaderController(headerArea)).to.not.be.undefined();
        });

        it('should allow creation with a valid ID', function() {
            var areaId = 'theId';
            headerArea.id = areaId;
            expect(new HeaderController(areaId)).to.not.be.undefined();
        });
    });

    describe('listens to events and', function() {

        var headerController;
        var areaSelectWidget;

        beforeEach(function() {
            headerController = new HeaderController(headerArea);
            areaSelectWidget = headerController.getAreaSelectWidget();
        });

        it('should update the appState when the area selection changes', function() {
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
