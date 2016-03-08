"use strict";

function reducer(state, action){
    console.log('reducer', action.type, state, action);
    
    switch(action.type){
        case 'ORG_DATA':
            return state.merge(action.data);
        case 'GITHUB_API_RATE_INFOS':
            return state.set('githubAPIRateInfos', action.githubAPIRateInfos);
        default:
            console.warn('Unknown action.type:', action.type);
            return state;
    }
}