'use strict';

module.exports = {
    poi: {
        id: 'poi',
        caption: 'Places',
        iconClass: 'fa-map-marker',
        selectable: true
    },
    photo: {
        id: 'photo',
        caption: 'Photos',
        iconClass: 'fa-photo',
        selectable: true
    },
    event: {
        id: 'event',
        caption: 'Events',
        iconClass: 'fa-calendar',
        selectable: true
    },
    streetofinterest: {
        id: 'streetofinterest',
        caption: 'Streets of Interest',
        iconClass: ['fa-road', 'fa-map-marker'],
        selectable: true
    },
    scenicstreets: {
        id: 'scenicstreets',
        caption: 'Scenic Streets',
        iconClass: ['fa-road', 'fa-photo'],
        selectable: true
    },
    regionofinterest: {
        id: 'regionofinterest',
        caption: 'Regions of Interest',
        iconClass: 'fa-dot-circle-o',
        selectable: true
    },
    poisforstreet: {
        id: 'poisforstreet',
        iconClass: '',
        selectable: false
    },
    photosforstreet: {
        id: 'photosforstreet',
        iconClass: '',
        selectable: false
    },
    diversestreetphotos: {
        id: 'diversestreetphotos',
        iconClass: '',
        selectable: false
    }
};
