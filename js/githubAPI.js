"use strict";

const GITHUB_API_URL_PREFIX = 'https://api.github.com';

/*
    event => boolean
    tells whether the event is a contribution to the repo
*/
function isContrbutionEvent(event){
    return event.type !== 'WatchEvent' && event.type !== 'MemberEvent' && event.type !== 'ForkEvent';
}

function makeGithubAPI(token){
    
    return {
        orgInfos(org){
            return fetchMemoized([
                GITHUB_API_URL_PREFIX,
                'orgs',
                org
            ].join('/'), token)
        },
        
        orgRepos(org){
            return fetchMemoized([
                GITHUB_API_URL_PREFIX,
                'orgs',
                org,
                'repos'
            ].join('/'), token)
        },

        repoEvents(repo, page){
            return fetchJSON([
                GITHUB_API_URL_PREFIX,
                'repos',
                repo,
                'events'
            ].join('/') + '?page='+page, token)
        },

        authenticatedUser(){
            if(!token)
                return Promise.reject(new Error('Cannot get the authenticated user without a token'))
            
            return fetchJSON([
                GITHUB_API_URL_PREFIX,
                'user'
            ].join('/'), token);
        },

        allRepoEvents(repo){
            // TODO: these reqs should be sequential, not parallel to save for the rate limit
            return Promise.all(Array(10).fill()
                .map( (e, i) => i+1 )
                .map( page => this.repoEvents(repo, page) )
            )
            .then(flatten)
        },
        // fetch repos of the org

        getOrgData(org){
            return this.orgRepos(org)
            .then(repos => {
                // sort by most recently updated
                repos.sort((r1, r2) => new Date(r2.updated_at).getTime() - new Date(r1.updated_at).getTime());
                console.log('repos', repos);

                const consideredRepos = repos.slice(0, 6);

                return Promise.all(consideredRepos.map(r => this.allRepoEvents(r.full_name)))
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
    }
}
