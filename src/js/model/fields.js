'use strict';

var fields = {};

fields.CATEGORY_ID = 'gs_category_level1';
fields.SOURCE_ID = 'source';
fields.TAG_ID = 'tag';

fields[fields.CATEGORY_ID] = {
    id: fields.CATEGORY_ID,
    userFriendly: 'category'
};

fields[fields.SOURCE_ID] = {
    id: fields.SOURCE_ID,
    userFriendly: 'source'
};

fields[fields.TAG_ID] = {
    id: fields.TAG_ID,
    userFriendly: 'tag'
};

fields.isCategory = function(field) {
    return field === fields.CATEGORY_ID;
};

fields.isSource = function(field) {
    return field === fields.SOURCE_ID;
};

fields.isTag = function(field) {
    return field === fields.TAG_ID;
};

module.exports = fields;
