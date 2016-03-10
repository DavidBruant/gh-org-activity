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
    * Add input for personal access token
        * call remember('personal-access-token').then
            * ghapi.authenticatedUser()
            * store.dispatch({
                type: 'AUTHENTICATED_USER',
                user: user
            })
    * Add input for repo name
        * dispatch({type: 'ORG_CHANGE', org: org}) at init (remember previous org)
        * dispatch({type: 'ORG_CHANGE', org: org}) on input change
    * Add PureRenderMixin thing
        * revise const mapStateToProps = state => state.toJS(); (containers/Top.js) along the way
*/

let githubAPI = makeGithubAPI();

let previousState = new Immutable.Map();

store.subscribe( () => {
    const state = store.getState();  
    const token = state.get('personalAccessToken');
    
    if(token !== previousState.get('personalAccessToken')){
        const ghapi = makeGithubAPI(token);
        ghapi.authenticatedUser()
        .then(user => { // token is valid
            githubAPI = ghapi;
            remember('personal-access-token', token);
            
            store.dispatch({
                type: 'AUTHENTICATED_USER',
                user: user
            })
        })
        .catch(err => console.error('authenticatedUser', err, err.stack))
    }
    
    previousState = state;
});

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
