"use strict";

const { Provider } = ReactRedux;
const { createStore } = Redux;
const { render } = ReactDOM;

const ϼ = React.createElement;

const store = createStore(
    reducer,
    new Immutable.Map()
);

/*
    TODO:
    * Add option to clear PAT storage
    * Add index that remembers the date/time at which each thing is entered
    
    * Bug: repo name blinks on change
    
    * Add PureRenderMixin thing
        * revise const mapStateToProps = state => state.toJS(); (containers/Top.js) along the way
*/

function testTokenAndDispatchIfValid(token){
    if(!token)
        return Promise.reject(new Error('No token'));
    
    const ghapi = makeGithubAPI(token);
    
    return ghapi.authenticatedUser()
    .then(user => { // token is valid
        return store.dispatch({
            type: 'AUTHENTICATED_USER',
            user: user
        })
    })
    .then( () => ghapi )
    // no valid user, stay in anonymous mode
    .catch( err => makeGithubAPI() )
}

let previousState = new Immutable.Map();

store.subscribe( () => {
    const state = store.getState();
    const token = state.get('personalAccessToken');
    
    if(token !== previousState.get('personalAccessToken')){
        if(token){
            testTokenAndDispatchIfValid(token)
            .then( () => remember('personal-access-token', token) )
            .catch(err => console.error('authenticatedUser', err, err.stack))
        }
        else{ // logout
            forget('personal-access-token')
        }
        
    }
    
    previousState = state;
});


/*
    Start !
*/


remember('personal-access-token')
.then(testTokenAndDispatchIfValid)
.catch(err => console.error('personal-access-token error', err))
.then( githubAPI => {
    /*
        get org from query parameter
        if none
    */
    const url = new URL(location);

    let tentativeOrg;
    const paramOrg = url.searchParams.get('org');
    if(paramOrg){
        tentativeOrg = paramOrg;
    }
    else{
        const dotGithubDotIOIndex = url.hostname.lastIndexOf('.github.io');
        if(dotGithubDotIOIndex !== -1)
            tentativeOrg = url.hostname.slice(0, dotGithubDotIOIndex);
    }

    if(tentativeOrg){
        promiseLifecycleActions(store.dispatch, 'ORG', githubAPI.orgInfos, tentativeOrg)
        .then( org => {
            console.log('org', org)
            
            return promiseLifecycleActions(
                store.dispatch,
                'ORG_COMPLETE',
                githubAPI.getOrgData.bind(githubAPI),
                org.login
            );
        });
    }
})




const container = document.body;

render(
    ϼ(Provider, {store: store}, ϼ(TopContainer)),
    container
);
