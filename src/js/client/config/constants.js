'use strict';

var constants = {};

// IDS
constants.CURRENT_AREA_ID = 'Around Me';
constants.CURRENT_VIEW_ID = 'Current View';

// EVENTS
constants.MAIN_QUERY_STARTED = 'MainQuery:Started';
constants.MAIN_QUERY_SUCCESS = 'MainQuery:Success';
constants.MAIN_QUERY_FAILURE = 'MainQuery:Failure';

constants.FETCH_NEXT_PAGE_STARTED= 'FetchNextPage:Started';
constants.FETCH_NEXT_PAGE_SUCCESS= 'FetchNextPage:Success';
constants.FETCH_NEXT_PAGE_FAILURE= 'FetchNextPage:Failure';

constants.KEYWORD_ENTER_PRESSED = 'Keyword:EnterPressed';

constants.MAP_VIEW_CHANGED = 'Map:ViewChanged';

// URLS
constants.NO_IMG_URL = 'img/no_image_available.jpg';

module.exports = constants;
