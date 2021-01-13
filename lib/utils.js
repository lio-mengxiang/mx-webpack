const { OBJECT_TAG, ARRAY_TAG } = require('./constants');

function getType(target){
  return Object.prototype.toString.call(target).slice(8, -1);
}

function isObject(target){
  return getType(target) === OBJECT_TAG;
}

function isArray(target){
  return getType(target) === ARRAY_TAG;
}

module.exports = {
  isObject,
  isArray,
}
