"use strict";

function reducer(state, action){
    //console.log('reducer', action.type, state, action);
    
    switch(action.type){
        case 'ORG':
            switch(action.lifecycle){
                case 'waiting': return state.setIn('org.login', action.args[0]);
                case 'success': return state.set('org', action.result);
                case 'error': return state.setIn('org.error', action.error);
                default:
                    console.error('missing lifecycle field', action);
                    return state;
            }
        case 'ORG_COMPLETE':
            switch(action.lifecycle){
                case 'waiting': return state;
                case 'success': return state
                    .set('repos', action.result.repos)
                    .set('eventsByRepo', action.result.eventsByRepo);
                case 'error': return state.setIn('org.error', action.error);
                default:
                    console.error('missing lifecycle field', action);
                    return state;
            }
        case 'GITHUB_API_RATE_INFOS':
            return state.set('githubAPIRateInfos', action.githubAPIRateInfos);
        case 'PERSONAL_ACCESS_TOKEN_INPUT':
            return state.set('personalAccessToken', action.token);
        case 'LOGOUT':
            return state
                .delete('authenticatedUser')
                .delete('personalAccessToken');
        case 'AUTHENTICATED_USER':
            return state.set('authenticatedUser', action.user);
        default:
            console.warn('Unknown action.type:', action.type);
            return state;
    }
}