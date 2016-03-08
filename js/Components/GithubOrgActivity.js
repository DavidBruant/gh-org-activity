"use strict";

const format = 'MMMM Do YYYY';

const rel = React.createElement;

var GithubOrgActivity = React.createClass({
    displayName: "GithubOrgActivity",
  
    render: function(){
        const {props} = this;
        const {eventsByRepo, repos, org} = props;
        
        const allEvents = flatten([...eventsByRepo].map(([repo, events]) => events) );
        console.log('allEvents', allEvents)
        
        const timestamps = allEvents.map(e => new Date(e.created_at).getTime());
        const max = Math.max(...timestamps);
        const min = Math.min(...timestamps);
        
        const users = new Map();
        for(let e of allEvents)
            users.set(e.actor.id, e.actor);
        
        const colorByUserId = new Map(
            [...users].map(([id], i) => [id, 'hsl('+360*i/users.size+', 40%, 60%)'])
        );
        
        return rel('div', {className: 'github-org-activity'},
            rel('section', {className: 'users'},
                [...users].map(([id, user]) => {
                    const color = colorByUserId.get(id);
            
                    return rel('div', {},
                        rel('button',
                            { style: { backgroundColor: color } },
                            rel('img', {src: user.avatar_url})
                        ),       
                        rel('a',
                            { href: 'https://github.com/'+user.login, target: '_blank' },
                            user.login
                        )
                    )
                    
                    
                })
            ),   
            rel('section', {className: 'repos'},
                rel('div', {style: {position: 'absolute', top: 0, right: 0}}, moment(max).format(format)),
                rel('div', {style: {position: 'absolute', bottom: 0, right: 0}}, moment(min).format(format)),
                repos.map(repo => rel(RepositoryEvents, 
                    {
                        events: eventsByRepo.get(repo),
                        repo: repo,
                        colorByUserId: colorByUserId,
                        max: max,
                        min: min
                    }
                ))
            )
        );
    }
});
                       