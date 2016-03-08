"use strict";

function fetchJSON(url){
    return fetch(url, {headers: {'Content-Type': 'application/json'}})
    .then(resp => {
        // this function shouldn't have access to this. TODO figure out another way
        store.dispatch({
            type: 'GITHUB_API_RATE_INFOS',
            githubAPIRateInfos: new Immutable.Map({
                remaining: Number(resp.headers.get('X-RateLimit-Remaining')),
                limit: Number(resp.headers.get('X-RateLimit-Limit')),
                reset: Number(resp.headers.get('X-RateLimit-Reset'))*1000
            })
        })
        
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
