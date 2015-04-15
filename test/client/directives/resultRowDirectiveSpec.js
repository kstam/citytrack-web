'use strict';

var $ = require('jquery');
require('angular');
require('angular-mocks');
var directives = require('client/directives/directives');
var controllers = require('client/controllers/controllers');
var mockedData = require('../../data/poiResponse');
var diversePhotoResponse = require('../../data/diversePhotosResponse');
var utils = require('common/utils');
var types = require('model/types');
var constants = require('client/config/constants');
var expect = require('../../testCommons/chaiExpect');
var sinon = require('sinon');

describe('result-row directive', function() {
    var element, scope, $$compile, row, eventService, searchService, searchServiceResult;

    beforeEach(angular.mock.module('templates/resultRow.html'));

    beforeEach(angular.mock.module(directives.name));
    beforeEach(angular.mock.module(controllers.name));

    beforeEach(function() {
        var mockedResponse = {
            then: function(callback) {
                callback(searchServiceResult);
            }
        };
        searchService = {
            query: function() {
                return mockedResponse;
            }
        };
        angular.mock.module(function($provide) {
            $provide.value('SearchService', searchService);
        });
    });

    beforeEach(inject(function($rootScope, $compile, _NgEventService_, _SearchService_) {
        row = angular.copy(mockedData.collection.features[0]);
        scope = $rootScope.$new();
        $$compile = $compile;
        eventService = _NgEventService_;
        searchService = _SearchService_;
        element = '<result-row model="row"></result-row>';
    }));

    it('should compile the element using the "row" in the scope', function() {
        scope.row = row;
        compileDirective();
        expect($(element).find('.title:first').text()).to.equal(scope.row.properties.label);
        expect($(element).find('.description > span').text()).to.equal(scope.row.properties.description);
    });

    describe('creates intermediate "data" object and', function() {
        it('should define the correct "categories"', function() {
            scope.row = row;
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.categories).to.deep.equal(utils.getArrayFromString(scope.row.properties.category));
        });
        it('should define "description" correctly when none exists', function() {
            scope.row = row;
            scope.row.properties.description = '';
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.description).to.equal('No description available.');
        });
        it('should define the "mainPhoto to no-photo when none exist', function() {
            scope.row = row;
            compileDirective();
            var isolateScope = element.isolateScope();
            expect(isolateScope.data.mainPhoto).to.equal(constants.NO_IMG_URL);
        });
        it('should define "target" under data which should be equal to row.properties.target', function() {
            scope.row = row;
            scope.row.properties.target = constants.TARGET_MAP;
            compileDirective();

            var isolateScope = element.isolateScope();
            expect(isolateScope.data.target).to.equal('map');
        });
    });

    describe('is handled differently based on the "target"', function() {
        describe('when target is not "map"', function() {

            beforeEach(function() {
                scope.row = row;
                compileDirective();
                var isolateScope = element.isolateScope();
                expect(isolateScope.isMap()).to.be.false();
                expect(isolateScope.isResult()).to.be.true();
            });

            it('should display the result-image', function() {
                expect($(element).find('.result-image').length).to.equal(1);
            });

            it('should not display the description-image', function() {
                expect($(element).find('.description-image').length).to.equal(0);
            });

            it('should not display the photos section', function() {
                expect($(element).find('.photos').length).to.equal(0);
            });
        });

        describe('when target is "map"', function() {
            beforeEach(function() {
                scope.row = row;
                scope.row.properties.target = constants.TARGET_MAP;
                scope.row.properties.photo = '[a,b]';
                compileDirective();
                var isolateScope = element.isolateScope();
                expect(isolateScope.isMap()).to.be.true();
                expect(isolateScope.isResult()).to.be.false();
            });

            it('should not display the result-image', function() {
                expect($(element).find('.result-image').length).to.equal(0);
            });

            it('should display the description-image', function() {
                expect($(element).find('.description-image').length).to.equal(1);
            });

            it('should display the photos section if there are more than 1 photos', function() {
                expect($(element).find('.photos').length).to.equal(1);
                expect($(element).find('.photos img.photo').length).to.equal(1);
            });

            describe('listens to MAP_FEATURE_SELECTED and RESULT_ROW_SELECTED events and', function() {
                it('should invoke the resultSelected method when event id is the feature id', function() {
                    var isolateScope = element.isolateScope();
                    isolateScope.data.id = 'theId';
                    var spy = sinon.spy(isolateScope, 'resultSelected');
                    eventService.broadcastEvent(constants.MAP_FEATURE_SELECTED, 'theId');
                    expect(spy).to.have.callCount(1);
                    eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, 'theId');
                    expect(spy).to.have.callCount(2);
                });
                it('should not invoke the resultSelected method if event id does not match the feature id', function() {
                    var isolateScope = element.isolateScope();
                    isolateScope.data.id = 'theId';
                    var spy = sinon.spy(isolateScope, 'resultSelected');
                    eventService.broadcastEvent(constants.MAP_FEATURE_SELECTED, 'otherId');
                    expect(spy).to.have.callCount(0);
                    eventService.broadcastEvent(constants.RESULTS_ROW_SELECTED, 'otherId');
                    expect(spy).to.have.callCount(0);
                });
            });

            describe('when type is street', function() {
                it('should load the diverse photos for the streat when popup is opened', function() {
                    var isolateScope = element.isolateScope();
                    isolateScope.data.type = types.streetofinterest.id;
                    isolateScope.data.id = 12314;
                    searchServiceResult = diversePhotoResponse;
                    isolateScope.resultSelected();
                    expect(isolateScope.extras.diversePhotos.length).to.equal(diversePhotoResponse.rows);
                });
            });
        });
    });

    // Helper functions

    function compileDirective() {
        element = $$compile(element)(scope);
        scope.$digest();
    }
});
