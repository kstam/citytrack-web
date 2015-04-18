'use strict';

var Params = require('model/Params');
var testUtils = require('../testCommons/testUtils');
var types = require('model/types');

describe('Params', function() {

    describe('equals', function() {
        it('should return true if same instance', function() {
            var params = new Params();
            expect(params.equals(params)).to.be.true();
        });

        it('should return false if second argument is not Params type', function() {
            var params = new Params();
            expect(params.equals(undefined)).to.be.false();
            expect(params.equals({})).to.be.false();
        });

        it('should return true when everything is equal', function() {
            var area = testUtils.createRandomBoxArea('Athens');
            var params1 = new Params('keyword', area, 1, 10, ['Source1', 'Source2'], ['Cat1', 'Cat2'], types.poi);
            var params2 = new Params('keyword', testUtils.cloneArea(area), 1, 10,
                ['Source1', 'Source2'], ['Cat2', 'Cat1'], types.poi);
            expect(params1.equals(params2)).to.be.true();
        });

        it('should return false if types are not equal', function() {
            var area = testUtils.createRandomBoxArea('Athens');
            var params1 = new Params('keyword', area, 1, 10, ['Source1', 'Source2'], ['Cat1', 'Cat2'], types.poi);
            var params2 = new Params('keyword', testUtils.cloneArea(area), 1, 10,
                ['Source1', 'Source2'], ['Cat2', 'Cat1'], types.event);
            expect(params1.equals(params2)).to.be.false();
        });
    });

    describe('isValid', function() {
        describe('for photo/event/poi type', function() {
            it('should return false for empty params', function() {
                expect(new Params().isValid()).to.be.false();
            });

            it('should return true if keyword, area and type are valid', function() {
                var params = new Params.Builder()
                    .withType(types.poi)
                    .withKeyword('a')
                    .withArea(testUtils.createRandomBoxArea('Athens')).build();

                expect(params.isValid()).to.be.true();
            });

            it('should return false if type is missing', function() {
                var params = new Params.Builder()
                    .withKeyword('a')
                    .withArea(testUtils.createRandomBoxArea('Athens')).build();

                expect(params.isValid()).to.be.false();
            });

            it('should return true if everything is set and valid', function() {
                var params = new Params.Builder()
                    .withType(types.event)
                    .withKeyword('a')
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withPage(1).withPageSize(20)
                    .withCategories([]).withSources([])
                    .build();

                expect(params.isValid()).to.be.true();
            });

            it('should return false if page is invalid', function() {
                var params = new Params.Builder()
                    .withKeyword('a')
                    .withType(types.photo)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withPage('a')
                    .build();

                expect(params.isValid()).to.be.false();
            });

            it('should return false if pageSize is invalid', function() {
                var params = new Params.Builder()
                    .withKeyword('a')
                    .withType(types.photo)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withPageSize('a')
                    .build();

                expect(params.isValid()).to.be.false();
            });

            it('should return false if sources is invalid', function() {
                var params = new Params.Builder()
                    .withKeyword('a')
                    .withType(types.photo)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withSources({})
                    .build();

                expect(params.isValid()).to.be.false();
            });

            it('should return false if categories is invalid', function() {
                var params = new Params.Builder()
                    .withKeyword('a')
                    .withType(types.photo)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withCategories({})
                    .build();

                expect(params.isValid()).to.be.false();
            });
        });

        describe('for street of interest', function() {
            it('should return true when everything is set and valid', function() {
                var params = new Params.Builder()
                    .withType(types.streetofinterest)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .withCategories(['Food'])
                    .build();

                expect(params.isValid()).to.be.true();
            });

            it('should return true when only the type and the area are set', function() {
                var params = new Params.Builder()
                    .withType(types.streetofinterest)
                    .withArea(testUtils.createRandomBoxArea('Athens'))
                    .build();

                expect(params.isValid()).to.be.true();
            });

            it('should return false when the area is not set', function() {
                var params = new Params.Builder()
                    .withType(types.streetofinterest)
                    .build();

                expect(params.isValid()).to.be.false();
            });
        });
    });
});
