"use strict";


function flatten(arr){
    return [].concat.apply([], arr);
}

function flattenDeep(arr){
    const tmp = flatten(arr);
    return tmp.some(e => Array.isArray(e)) ? flattenDeep(tmp) : tmp;
}
