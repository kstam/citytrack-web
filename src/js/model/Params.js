'use strict';

var utils = require('../common/utils');
var Area = require('./Area');

var Params = function(keyword, area, page, pageSize, sources, categories) {
    if (!(this instanceof Params)) {
        return new Params(keyword, area, page, pageSize, sources, categories);
    }

    this.keyword = keyword;
    this.area = area;
    this.page = page;
    this.pageSize = pageSize;
    this.sources = sources;
    this.categories = categories;

    this.isValid = function() {
        return (utils.isString(this.keyword) && this.keyword !== '') &&
            (this.area instanceof Area) &&
            utils.optional(this.page)(utils.isInteger) &&
            utils.optional(this.pageSize)(utils.isInteger) &&
            utils.optional(this.sources)(utils.isArray) &&
            utils.optional(this.categories)(utils.isArray);
    };

    this.equals = function(that) {
        if (this === that) {
            return true;
        }

        if (! (that  instanceof Params)) {
            return false;
        }

        return this.keyword === that.keyword &&
            equalAreas(this.area, that.area) &&
            this.page === that.page &&
            this.pageSize === that.pageSize &&
            arraysSameElements(this.sources, that.sources) &&
            arraysSameElements(this.categories, that.categories);
    };
};

function equalAreas(a1, a2) {
    return (utils.isNullOrUndefined(a1)) ? (a1 === a2) : a1.equals(a2);
}

function arraysSameElements(a1, a2) {
    if (utils.isArray(a1) && utils.isArray(a2)) {
        var i, map = {};
        a1.forEach(function(elm) {
            map[elm] = true;
        });
        for (i=0; i<a2.length; i++) {
            if (!map[a2[i]]) {
                return false;
            }
        }
        return true;
    } else {
        return a1 === a2;
    }
}

Params.Builder = function() {
    var keyword, area, page, pageSize, sources, categories;

    if (!(this instanceof Params.Builder)) {
        return new Params();
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

    this.build = function() {
        return new Params(keyword, area, page, pageSize, sources, categories);
    };
};

module.exports = Params;
