import Vue from 'vue';

let EventBus = new Vue();

// Reads a value from the "meta" object of an API item, with a fallback.
function meta(item, key, fallback = null) {
    const value = item && item.meta ? item.meta[key] : null;
    return value === null || value === undefined || value === '' ? fallback : value;
}

// CMS meta values are strings, so "true"/"1" are treated as true.
function metaBool(item, key) {
    const value = meta(item, key);
    return value === true || value === 'true' || value === '1' || value === 1;
}

// Comma separated meta string ("hybrid,hybridPlugin") to array.
function metaList(item, key) {
    const value = meta(item, key, '');
    return String(value).split(',').map((part) => part.trim()).filter(Boolean);
}

// Returns only active children (active is optional in the API, missing means active).
function activeItems(items) {
    return (items || []).filter((item) => item && item.active !== 0 && item.active !== false);
}

export {
    EventBus,
    meta,
    metaBool,
    metaList,
    activeItems
}
