"use strict";

function reducer(state, action){
    //console.log('reducer', action.type, state, action);
    
    switch(action.type){
        case 'ORG_DATA':
            return state.merge(action.data).merge({org: action.org});
        case 'GITHUB_API_RATE_INFOS':
            return state.set('githubAPIRateInfos', action.githubAPIRateInfos);
        case 'PERSONAL_ACCESS_TOKEN_INPUT':
            return state.set('personalAccessToken', action.token);
        case 'AUTHENTICATED_USER':
            return state.set('authenticatedUser', action.user);
        default:
            console.warn('Unknown action.type:', action.type);
            return state;
    }
}