"use strict";

const format = "dddd, MMMM Do YYYY, h:mm:ss a";

const rel = React.createElement;

/*
    TODO:
    * Users
        * Add list of users & color
    * Repos
        * Add repo names
        * Add one line per repo
        * Shift should be per repo
        * Put to the center the most active users of the repo
*/

var GithubOrgActivity = React.createClass({
    displayName: "GithubOrgActivity",
    
    render: function(){
        const {props} = this;
        const {events} = props
        
        const timestamps = events.map(e => new Date(e.created_at).getTime());
        const max = Math.max(...timestamps);
        const min = Math.min(...timestamps);
        
        const users = new Map();
        events.forEach(e => users.set(e.actor.id, e.actor));
        
        const colorByUserId = new Map(
            [...users].map(([id], i) => [id, 'hsl('+360*i/users.size+', 40%, 60%)'])
        );
        const shiftByUserId = new Map();
        
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
            rel('section', 
                {
                    style: {width: '100%', minHeight: '80%', position: 'absolute'},
                    className: 'viz'
                },
                rel('div', {style: {position: 'absolute', top: '0'}}, moment(max).format(format)),
                rel('div', {style: {position: 'absolute', bottom: '0'}}, moment(min).format(format)),
                events.map(e => {
                    const date = new Date(e.created_at);
                    const userId = e.actor.id;

                    let color = colorByUserId.get(userId);

                    let shift = shiftByUserId.get(userId);
                    if(shift === undefined){
                        shift = shiftByUserId.size;
                        shiftByUserId.set(userId, shift);
                    }

                    return rel('div',
                        {
                            className: 'event',
                            title: moment(date).format('YYYY-MM-DD'),
                            style: {
                                bottom: 5+(90*(date.getTime() - min)/(max-min))+'%',
                                backgroundColor: color,
                                left: 'calc(20% + '+shift/2+'em)'
                            },
                            onClick: function(){
                                console.log('event', e, 'by', e.actor);
                            }
                        }
                    )
                })
            )
        );
    }
});
                       