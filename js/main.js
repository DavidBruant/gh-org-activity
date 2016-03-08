"use strict";

const { Provider } = ReactRedux;
const { createStore } = Redux;
const { render } = ReactDOM;

const org = 'emailjs';

const ϼ = React.createElement;

const store = createStore(
    reducer,
    new Immutable.Map()
);

/*
    TODO:
        * Add input for personal access token
        * Add input for repo name
*/
const container = document.body;

render(
    ϼ(Provider, {store: store}, ϼ(TopContainer)),
    container
)

/*
    Start !
*/
getOrgData(org)
.then(data => store.dispatch({type: 'ORG_DATA', data: new Immutable.Map(data)}))
.catch(err => console.error(err, err.stack))
