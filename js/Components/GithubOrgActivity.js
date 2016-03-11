"use strict";

const format = 'MMMM Do YYYY';

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
        
        return ϼ('div', {className: 'github-org-activity'},
            ϼ('section', {className: 'users'},
                [...users].map(([id, user]) => {
                    const color = colorByUserId.get(id);
            
                    return ϼ('div', {key: id},
                        ϼ('button',
                            { style: { backgroundColor: color } },
                            ϼ('img', {src: user.avatar_url})
                        ),       
                        ϼ('a',
                            { href: 'https://github.com/'+user.login, target: '_blank' },
                            user.login
                        )
                    )
                    
                    
                })
            ),   
            ϼ('section', {className: 'repos'},
                ϼ('div', {style: {position: 'absolute', top: 0, right: 0}}, moment(max).format(format)),
                ϼ('div', {style: {position: 'absolute', top: 0, left: 0}}, moment(min).format(format)),
                repos.map(repo => ϼ(RepositoryEvents, 
                    {
                        key: repo.id,
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
                       