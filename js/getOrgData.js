"use strict";

/*
    event => boolean
    tells whether the event is a contribution to the repo
*/
function isContrbutionEvent(event){
    return event.type !== 'WatchEvent' && event.type !== 'MemberEvent' && event.type !== 'ForkEvent';
}

// fetch repos of the org

function getOrgData(org){
    return orgRepos(org)
    .then(repos => {
        // sort by most recently updated
        repos.sort((r1, r2) => new Date(r2.updated_at).getTime() - new Date(r1.updated_at).getTime());
        console.log('repos', repos);

        const consideredRepos = repos.slice(0, 1);

        return Promise.all(consideredRepos.map(r => allRepoEvents(r.full_name)))
        .then(events => events.reduce(
            ((map, evs, i) => (map.set(consideredRepos[i], evs.filter(isContrbutionEvent)), map)),
            new Map())
        )
        .then(eventsByRepo => ({
            repos: consideredRepos,
            eventsByRepo: eventsByRepo,
            org: org
        }))
    });
}        
