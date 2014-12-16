'use strict';

var expect = require('../../testCommons/chaiExpect');
var $ = require('jquery');
var SearchDropdownWidget = require('client/widgets/SearchDropdownWidget.js');
var sinon = require('sinon');

describe('SearchDropdownWidget', function() {

    var CONTAINER_ID = 'selectContainerId';
    var searchWidget;
    var $selectInput;

    beforeEach(function() {
        var container = $('<div id="' + CONTAINER_ID + '"></div>');
        $(document.body).prepend(container);
        searchWidget = new SearchDropdownWidget(container[0]);
        $selectInput = $(container).find('input:first');
    });

    afterEach(function() {
        $('#' + CONTAINER_ID).remove();
    });

    describe('initialize data', function() {

        it('should have no data on initialization', function() {
            expect(searchWidget.getAvailableValues()).to.deep.equal([]);
        });

        it('should allow adding an array of rows', function() {
            var data = [
                {label: 'Kostas', value: 'k'},
                {label: 'Giorgos', value: 'g'}
            ];
            searchWidget.setData(data);
            expect(searchWidget.getAvailableValues()).to.deep.equal(['k', 'g']);
        });

        it('should keep the value selected if it is still in the new data', function() {
            searchWidget.setData([{label: 'Kostas', value: 'k'},
                {label: 'Giorgos', value: 'g'}]);
            searchWidget.selectValue('g');
            searchWidget.setData([{label: 'Nikos', value: 'n'},
                {label: 'Giorgos', value: 'g'}]);
            expect(searchWidget.getValue()).to.equal('g');
        });

        it('should reset the value selected if it is not in the new data', function() {
            searchWidget.setData([{label: 'Kostas', value: 'k'},
                {label: 'Giorgos', value: 'g'}]);
            searchWidget.selectValue('k');
            searchWidget.setData([{label: 'Nikos', value: 'n'},
                {label: 'Giorgos', value: 'g'}]);
            expect(searchWidget.getValue()).to.be.undefined();
        });
    });

    describe('select values', function() {

        beforeEach(function() {
            searchWidget.setData([
                {label: 'Kostas', value: 'k'},
                {label: 'Giorgos', value: 'g'}
            ]);
        });

        it('should have no selected value at initialization', function() {
            expect(searchWidget.getValue()).to.be.undefined();
        });

        it('should allow selecting a value', function() {
            searchWidget.selectValue('k');
            expect(searchWidget.getValue()).to.equal('k');
        });

        it('should reset the value to undefined if trying to select a value that does not exist', function() {
            searchWidget.selectValue('k');
            searchWidget.selectValue('wrong');
            expect(searchWidget.getValue()).to.be.undefined();
        });
    });

    describe('events', function() {

        beforeEach(function() {
            searchWidget.setData([
                {label: 'Kostas', value: 'k'},
                {label: 'Giorgos', value: 'g'}
            ]);
        });

        it('should allow registering an on change listener', function() {
            var callback = sinon.spy();
            searchWidget.onChange(callback);

            searchWidget.selectValue('k');
            expect(callback).to.have.been.calledWith('k');
        });

        it('should not fire a second onChange event if set is called with existing value', function() {
            var callback = sinon.spy();
            searchWidget.onChange(callback);

            searchWidget.selectValue('k');
            searchWidget.selectValue('k');

            expect(callback).to.have.callCount(1);
        });

        it('should allow registering an onType listener', function() {
            var callback = sinon.spy();
            searchWidget.onType(callback);

            $selectInput.attr('value', 'hello');
            $selectInput.trigger('keyup');

            expect(callback).to.have.been.calledWith('hello');
        });
    });
});
