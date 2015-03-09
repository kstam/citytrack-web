'use strict';

var constants = {};

// IDS
constants.CURRENT_AREA_ID = 'Around Me';
constants.CURRENT_VIEW_ID = 'Current View';

// EVENTS
constants.KEYWORD_ENTER_PRESSED = 'Keyword:EnterPressed';
constants.MAIN_QUERY_STARTED = 'MainQuery:Started';
constants.MAIN_QUERY_SUCCESS = 'MainQuery:Success';
constants.MAIN_QUERY_FAILURE = 'MainQuery:Failure';

constants.FETCH_NEXT_PAGE_STARTED = 'FetchNextPage:Started';
constants.FETCH_NEXT_PAGE_SUCCESS = 'FetchNextPage:Success';
constants.FETCH_NEXT_PAGE_FAILURE = 'FetchNextPage:Failure';

constants.RESULTS_ROW_SELECTED = 'Results:RowSelected';
constants.MAP_VIEW_CHANGED = 'Map:ViewChanged';
constants.MAP_POINT_SELECTED = 'Map:PointSelected';
constants.FILTER_CHANGED_EVT = 'Filter:Changed';

// URLS
constants.NO_IMG_URL = 'img/no_image_available.jpg';

// MAP
constants.TARGET_MAP = 'map';

module.exports = constants;
