"use strict";

const { Provider } = ReactRedux;
const { createStore } = Redux;
const { render } = ReactDOM;

const org = 'emailjs';
const GITHUB_API_URL_PREFIX = 'https://api.github.com';

const EL = React.createElement;

// const store = createStore(todoApp);

/*
    TODO:
        * Add input for personal access token
        * Add input for repo name
*/
const container = document.body;

function refresh(props){
    render(
        EL(Top, Object.assign({
            onOrgChange: function(org){
                console.log('New org!!', org);
            }
        }, props)),
        container
    )
}

/*
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
*/


/*
    Start !
*/
getOrgData(org)
.then(refresh)
.catch(err => console.error(err, err.stack))
