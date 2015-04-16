'use strict';

var utils = require('../common/utils');
var types = require('./types');
var Area = require('./Area');

var Params = function(keyword, area, page, pageSize, sources, categories, type, streetId) {

    var validator = new Params.Validator();

    if (!(this instanceof Params)) {
        return new Params(keyword, area, page, pageSize, sources, categories, type, streetId);
    }

    this.keyword = keyword;
    this.area = area;
    this.page = page;
    this.pageSize = pageSize;
    this.sources = sources || [];
    this.categories = categories || [];
    this.type = type;
    this.streetId = streetId;

    this.isValid = function() {
        return validator.isValid(this);
    };

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (!(that  instanceof Params)) {
            return false;
        }

        return this.keyword === that.keyword &&
            equalAreas(this.area, that.area) &&
            (this.type === that.type || (this.type.id === that.type.id && this.type.iconClass === that.type.iconClass)) &&
            this.page === that.page &&
            this.pageSize === that.pageSize &&
            utils.sameContent(this.sources, that.sources) &&
            utils.sameContent(this.categories, that.categories) &&
            this.streetId === that.streetId;
    };
};

Params.Validator = function() {

    var isValidForPoiPhotoOrEvent = function(params) {
        return (utils.isString(params.keyword) && params.keyword !== '') &&
            (params.area instanceof Area) &&
            utils.optional(params.page)(utils.isInteger) &&
            utils.optional(params.pageSize)(utils.isInteger) &&
            utils.optional(params.sources)(utils.isArray) &&
            utils.optional(params.categories)(utils.isArray);
    };

    var isValidForStreetOfInterest = function(params) {
        return (params.area instanceof Area) &&
            utils.optional(params.page)(utils.isInteger) &&
            utils.optional(params.pageSize)(utils.isInteger) &&
            utils.optional(params.categories)(utils.isArray);
    };

    var isValidForPoisForStreet = function(params) {
        return utils.isInteger(params.streetId) &&
            utils.optional(params.categories)(utils.isArray);
    };

    return {
        isValid: function(params) {
            var type = params.type;
            if (utils.isNotNullOrUndefined(type) && (utils.isString(type.id))) {
                switch (type.id) {
                    case types.poi.id:
                    case types.event.id:
                    case types.photo.id:
                        return isValidForPoiPhotoOrEvent(params);
                    case types.streetofinterest.id:
                        return isValidForStreetOfInterest(params);
                    case types.poisforstreet.id:
                    case types.diversestreetphotos.id:
                    case types.photosforstreet.id:
                        return isValidForPoisForStreet(params);
                    default:
                        break;
                }
            }
            return false;
        }
    };
};

function equalAreas(a1, a2) {
    return (utils.isNullOrUndefined(a1)) ? (a1 === a2) : a1.equals(a2);
}

Params.Builder = function() {
    var keyword, area, page, pageSize, type,
        sources = [], categories = [], streetId;

    if (!(this instanceof Params.Builder)) {
        return new Params.Builder();
    }

    this.withKeyword = function(theKeyword) {
        keyword = theKeyword;
        return this;
    };

    this.withArea = function(theArea) {
        area = theArea;
        return this;
    };

    this.withPage = function(thePage) {
        page = thePage;
        return this;
    };

    this.withPageSize = function(thePageSize) {
        pageSize = thePageSize;
        return this;
    };

    this.withSources = function(theSources) {
        sources = theSources;
        return this;
    };


    this.withCategories = function(theCategories) {
        categories = theCategories;
        return this;
    };

    this.withType = function(theType) {
        type = theType;
        return this;
    };

    this.withStreetId = function(theStreetId) {
        streetId = theStreetId;
        return this;
    };

    this.build = function() {
        return new Params(keyword, area, page, pageSize, sources, categories, type, streetId);
    };
};

module.exports = Params;
