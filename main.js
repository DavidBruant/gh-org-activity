"use strict";

const org = 'sudweb';

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


function orgRepos(org){
    return fetchJSON([
        GITHUB_API_URL_PREFIX,
        'orgs',
        org,
        'repos'
    ].join('/'))
}

function repoEvents(repo, page){
    return fetchJSON([
        GITHUB_API_URL_PREFIX,
        'repos',
        repo,
        'events'
    ].join('/') + '?page='+page)
}

const container = document.body;

function render(events){
    console.log('events', events);
    
    ReactDOM.render(
        React.createElement(GithubOrgActivity, {
            events: events
        }),
        container
    )
}

// fetch repos of the org

const cachedEventsP = remember(org+'-events');

cachedEventsP
.then(events => events ? events : orgRepos(org)
    .then(repos => {
        // sort by most recently updated
        repos.sort((r1, r2) => new Date(r2.updated_at).getTime() - new Date(r1.updated_at).getTime());
        console.log('repos', repos);

        const consideredRepos = repos.slice(0, 1);

        return Promise.all(consideredRepos.map(r => repoEvents(r.full_name, 1)))
    })
    .then( eventsByRepo => {
        var events = eventsByRepo[0];
        console.log('eventsByRepo', events);
        
        remember(org+'-events', events);
        return events;
    })
    .catch(err => console.error(err, err.stack))
)
.then(render);






