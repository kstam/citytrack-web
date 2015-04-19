'use strict';
var Area = require('model/Area');
var AreaBox = require('model/AreaBox');
var AreaCircle = require('model/AreaCircle');
var L = require('leaflet');

var testUtils = {};

testUtils.createRandomBoxArea = function(name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return new AreaBox(name, L.latLngBounds(L.latLng(lat - 10, lng - 10), L.latLng(lat + 10, lng + 10)), Area.INTERACTIVE_TYPE);
};

testUtils.createRandomCircleArea = function(name) {
    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;
    var radius = Math.floor(Math.random() * 1000 * 1024) / 1024;
    return new AreaCircle(name, L.latLng(lat + 10, lng + 10), radius, Area.INTERACTIVE_TYPE);
};


testUtils.createRandomAreaServerResult = function(name) {

    var lat = Math.floor(Math.random() * 161 * 1024) / 1024 - 80;
    var lng = Math.floor(Math.random() * 341 * 1024) / 1024 - 170;

    return {
        name: name,
        center: {lat: lat, lng: lng},
        bbox: {minLat: lat - 10, minLng: lng - 10, maxLat: lat + 10, maxLng: lng + 10}
    };
};


testUtils.cloneArea = function(area) {
    if (area instanceof AreaBox) {
        return new AreaBox(area.getName(), area.getBoundingBox(), area.getType());
    } else if (area instanceof AreaCircle) {
        return new AreaCircle(area.getName(), area.getCenter(), area.getRadius(), area.getType());
    } else if (area instanceof Area) {
        return new Area(area.getName(), area.getType());
    } else {
        throw new Error(area + ' type is not supported by clone');
    }
};


testUtils.createSearchServiceMock = function(data) {
    return {
        query: function() {
            return {
                then: function(success) {
                    success(data);
                }
            };
        }
    };
};

testUtils.getMockMap = function() {
    return {
        invalidateSize: function() {
        },
        addLayer: function() {
        },
        removeLayer: function() {
        }
    };
};

testUtils.createSearchServiceMockThatFails = function() {
    return {
        query: function() {
            return {
                then: function(success, failure) {
                    failure();
                }
            };
        }
    };
};

testUtils.createSearchServiceMockThatThrows = function() {
    return {
        query: function() {
            throw new Error();
        }
    };
};

module.exports = testUtils;
