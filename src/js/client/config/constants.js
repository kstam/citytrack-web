'use strict';

var constants = {};

// IDS
constants.CURRENT_AREA_ID = 'My Location';
constants.CUSTOM_POINT = 'Custom Point';
constants.CURRENT_VIEW_ID = 'Current View';
constants.ANY_CATEGORY = 'All Categories';

// EVENTS
constants.KEYWORD_ENTER_PRESSED = 'Keyword:EnterPressed';
constants.MAIN_QUERY_STARTED = 'MainQuery:Started';
constants.MAIN_QUERY_SUCCESS = 'MainQuery:Success';
constants.MAIN_QUERY_FAILURE = 'MainQuery:Failure';

constants.FETCH_NEXT_PAGE_STARTED = 'FetchNextPage:Started';
constants.FETCH_NEXT_PAGE_SUCCESS = 'FetchNextPage:Success';
constants.FETCH_NEXT_PAGE_FAILURE = 'FetchNextPage:Failure';

constants.RESULTS_ROW_SELECTED = 'Results:RowSelected';
constants.RESULTS_ROW_MOUSE_OVER = 'Results:RowMouseOver';
constants.RESULTS_ROW_MOUSE_OUT = 'Results:RowMouseOut';

constants.MAP_VIEW_CHANGED = 'Map:ViewChanged';
constants.MAP_FEATURE_SELECTED = 'Map:FeatureSelected';
constants.MAP_CONTEXT_CLOSE_EVT = 'Map:CloseContext';

constants.FILTER_CHANGED_EVT = 'Filter:Changed';

constants.PERFORM_SEARCH_NO_RESET_EVT = 'Search:Perform:NoReset';

// URLS
constants.NO_IMG_URL = 'img/no_image_available.jpg';

// MAP
constants.TARGET_MAP = 'map';

module.exports = constants;
