"use strict";

const { Provider } = ReactRedux;
const { createStore } = Redux;
const { render } = ReactDOM;

const org = 'sudweb';

const ϼ = React.createElement;

const store = createStore(
    reducer,
    new Immutable.Map()
);

/*
    TODO:
    * Add input for repo name
        * replace the h1@contenteditable with an input
        * dispatch({type: 'ORG_CHANGE', org: org}) at init (remember previous org)
        * dispatch({type: 'ORG_CHANGE', org: org}) on input change
    * Add option to clear PAT storage
    * Add PureRenderMixin thing
        * revise const mapStateToProps = state => state.toJS(); (containers/Top.js) along the way
*/

let githubAPI = makeGithubAPI();

let previousState = new Immutable.Map();

function testTokenAndDispatchIfValid(token){
    if(!token)
        return Promise.reject(new Error('No token'));
    
    const ghapi = makeGithubAPI(token);
    
    return ghapi.authenticatedUser()
    .then(user => { // token is valid
        githubAPI = ghapi;

        store.dispatch({
            type: 'AUTHENTICATED_USER',
            user: user
        })
    })
}


store.subscribe( () => {
    const state = store.getState();  
    const token = state.get('personalAccessToken');
    
    if(token !== previousState.get('personalAccessToken')){
        testTokenAndDispatchIfValid(token)
        .then( () => remember('personal-access-token', token) )
        .catch(err => console.error('authenticatedUser', err, err.stack))
    }
    
    previousState = state;
});

remember('personal-access-token')
.then(testTokenAndDispatchIfValid)

/*
    Start !
*/
githubAPI.getOrgData(org)
.then(data => store.dispatch({type: 'ORG_DATA', data: new Immutable.Map(data)}))
.catch(err => console.error(err, err.stack))

const container = document.body;

render(
    ϼ(Provider, {store: store}, ϼ(TopContainer)),
    container
);
