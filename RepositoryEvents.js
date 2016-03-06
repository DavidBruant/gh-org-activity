"use strict";

// const rel = React.createElement;

var RepositoryEvents = React.createClass({
    displayName: "RepositoryEvents",
    
    render: function(){
        const {props} = this;
        const {events, repo, colorByUserId, max, min} = props;
        
        const nbEventsByUserId = new Map();
        events.forEach(e => {
            const userId = e.actor.id;
            const nbEvents = nbEventsByUserId.get(userId);
                  
            nbEventsByUserId.set(
                userId,
                nbEvents ? nbEvents+1 : 1
            )
        });
        
        
        const shiftByUserId = new Map(
            [...nbEventsByUserId]
            .sort( ([id1, nb1], [id2, nb2]) => nb2 - nb1 )
            .map( ([id, nb], i) => {
                return [
                    id,
                    i === 0 ?
                        0 : 
                        (i % 2 === 0 ? 1 : -1) * Math.floor(i/2)
                ]
            })
        );
        
        console.log('shiftByUserId', repo.name, [...shiftByUserId]);
        
        
        return rel('section', 
            {
                className: 'repo-events'
            },
            rel('div', {className: 'repo-name'}, repo.name),
            events.map(e => {
                const date = new Date(e.created_at);
                const userId = e.actor.id;

                let color = colorByUserId.get(userId);

                let shift = shiftByUserId.get(userId);

                return rel('div',
                    {
                        className: 'event',
                        title: moment(date).format('YYYY-MM-DD'),
                        style: {
                            bottom: 5+(90*(date.getTime() - min)/(max-min))+'%',
                            backgroundColor: color,
                            left: 'calc(50% + '+shift/2+'em)'
                        },
                        onClick: function(){
                            console.log(
                                'event', e.type,
                                'in', e.repo.name, 
                                'by', e.actor.login,
                                'on', moment(date).format('YYYY-MM-DD')
                            );
                        }
                    }
                )
            })
        );
    }
});
                       