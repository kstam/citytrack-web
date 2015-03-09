'use strict';

var utils = require('../../src/js/common/utils');

describe('utils', function() {

    describe('isFunction', function() {
        it('should return true when object is a function', function() {
            function functionB() {}
            var functionA = function() {};
            var obj = {
                method: function() {}
            };
            expect(utils.isFunction(functionA)).to.be.true();
            expect(utils.isFunction(functionB)).to.be.true();
            expect(utils.isFunction(obj.method)).to.be.true();
        });

        it('should return false in any other case', function() {
            expect(utils.isFunction({})).to.be.false();
            expect(utils.isFunction(null)).to.be.false();
            expect(utils.isFunction()).to.be.false();
            expect(utils.isFunction([])).to.be.false();
            expect(utils.isFunction('')).to.be.false();
        });
    });

    describe('isString', function() {
        it('should return true when object is a string', function() {
            var stringA = 'asd';
            expect(utils.isString(stringA)).to.be.true();
        });

        it('should return false in any other case', function() {
            expect(utils.isString({})).to.be.false();
            expect(utils.isString(null)).to.be.false();
            expect(utils.isString()).to.be.false();
            expect(utils.isString([])).to.be.false();
        });
    });

    describe('isString', function() {
        it('should return true when object is an HTMLElement', function() {
            var element = document.createElement('div');
            expect(utils.isHTMLElement(element)).to.be.true();
        });

        it('should return false in any other case', function() {
            expect(utils.isHTMLElement({})).to.be.false();
            expect(utils.isHTMLElement(null)).to.be.false();
            expect(utils.isHTMLElement()).to.be.false();
            expect(utils.isHTMLElement([])).to.be.false();
            expect(utils.isHTMLElement('')).to.be.false();
        });
    });

    describe('getElement', function() {
        it('should not allow illegal element argument', function() {
            expect(function() {
                utils.getElement()
            }).to.throw(Error);
            expect(function() {
                utils.getElement('')
            }).to.throw(Error);
            expect(function() {
                utils.getElement(null)
            }).to.throw(Error);
            expect(function() {
                utils.getElement({})
            }).to.throw(Error);
            expect(function() {
                utils.getElement([])
            }).to.throw(Error);
        });
    });

    describe('getArrayFromString', function() {
        it('should return empty array if passed non-string', function() {
            expect(utils.getArrayFromString()).to.deep.equal([]);
            expect(utils.getArrayFromString(null)).to.deep.equal([]);
            expect(utils.getArrayFromString({})).to.deep.equal([]);
        });
        it('should return correct array if proper string is passed', function() {
            expect(utils.getArrayFromString('[a,b,c]')).to.deep.equal(['a', 'b', 'c']);
        });
        it('should not return array with duplicates', function() {
            expect(utils.getArrayFromString('[a,a,a]')).to.deep.equal(['a']);
        });
    });
});
