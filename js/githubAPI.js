"use strict";

const GITHUB_API_URL_PREFIX = 'https://api.github.com';

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
    return Promise.all(Array(2).fill()
        .map( (e, i) => i+1 )
        .map( page => repoEvents(repo, page) )
    )
    .then(flatten)
}