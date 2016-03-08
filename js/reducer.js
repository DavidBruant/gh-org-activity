"use strict";

function reducer(state, action){
    console.log('reducer', action.type, state, action);
    
    switch(action.type){
        case 'ORG_DATA':
            return state.merge(action.data);
        default:
            console.warn('Unknown action.type:', action.type);
            return state;
    }
}