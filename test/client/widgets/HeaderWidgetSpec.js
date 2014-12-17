'use strict';

var $ = require('jquery');
var HeaderWidget = require('client/widgets/HeaderWidget');
var domify = require('domify');
var headerAreaTemplate = require('partials/header.hbs');


describe('HeaderWidget', function() {

    var headerArea;

    beforeEach(function() {
        headerArea = domify(headerAreaTemplate());
        $(document.body).prepend(headerArea);
    });

    afterEach(function() {
        $(headerArea).remove();
    });

    describe('constructor', function() {
        it('should allow creation with a valid HTMLElement', function() {
            expect(new HeaderWidget(headerArea)).to.not.be.undefined();
        });

        it('should allow creation with a valid ID', function() {
            var areaId = 'theId';
            headerArea.id = areaId;
            expect(new HeaderWidget(areaId)).to.not.be.undefined();
        });
    });
});
