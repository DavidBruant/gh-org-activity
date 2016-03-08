"use strict";

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
