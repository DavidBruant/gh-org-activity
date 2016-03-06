"use strict";

const org = 'mozilla';

const GITHUB_API_URL_PREFIX = 'https://api.github.com';

function fetchJSON(url){
    return fetch(url, {headers: {'Content-Type': 'application/json'}})
    .then(resp => {
        console.log(
            'Rate limit',
            resp.headers.get('X-RateLimit-Remaining'), '/', resp.headers.get('X-RateLimit-Limit'),
            '('+
            ((Number(resp.headers.get('X-RateLimit-Reset')) - Math.round(Date.now()/1000))/60).toFixed(1)
            +'mins remaining)'
        );
        
        if(resp.status >= 400){
            return resp.text()
            .then(body => {
                throw new Error('HTTP status for '+url+' : '+resp.status+'.\n'+body)
            })
        }
        
        return resp.json();
    })
}

function fetchMemoized(url){
    return remember(url)
    .then(data => data ?
        data :
        fetchJSON(url).then( data => (remember(url, data), data) )
    );
}


function flatten(arr){
    return [].concat.apply([], arr);
}

function flattenDeep(arr){
    const tmp = flatten(arr);
    return tmp.some(e => Array.isArray(e)) ? flattenDeep(tmp) : tmp;
}


function orgRepos(org){
    return fetchMemoized([
        GITHUB_API_URL_PREFIX,
        'orgs',
        org,
        'repos'
    ].join('/'))
}

function repoEvents(repo, page){
    return fetchMemoized([
        GITHUB_API_URL_PREFIX,
        'repos',
        repo,
        'events'
    ].join('/') + '?page='+page)
}

function allRepoEvents(repo){
    return Promise.all(Array(10).fill()
        .map( (e, i) => i+1 )
        .map( page => repoEvents(repo, page) )
    )
    .then(flatten)
}


/*
    event => boolean
    tells whether the event is a contribution to the repo
*/
function isContrbutionEvent(event){
    return event.type !== 'WatchEvent' && event.type !== 'MemberEvent' && event.type !== 'ForkEvent';
}



const container = document.body;

function render(props){
    ReactDOM.render(
        React.createElement(GithubOrgActivity, props),
        container
    )
}

// fetch repos of the org

orgRepos(org)
.then(repos => {
    // sort by most recently updated
    repos.sort((r1, r2) => new Date(r2.updated_at).getTime() - new Date(r1.updated_at).getTime());
    console.log('repos', repos);

    const consideredRepos = repos.slice(0, 4);
    
    return Promise.all(consideredRepos.map(r => allRepoEvents(r.full_name)))
    .then(events => events.reduce(
        ((map, evs, i) => (map.set(consideredRepos[i], evs.filter(isContrbutionEvent)), map)),
        new Map())
    )
    .then(eventsByRepo => render({
        repos: consideredRepos,
        eventsByRepo: eventsByRepo
    }))
})
.catch(err => console.error(err, err.stack))


