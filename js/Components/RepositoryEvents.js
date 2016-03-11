"use strict";

var RepositoryEvents = React.createClass({
    displayName: "RepositoryEvents",
    
    render: function(){
        const {props} = this;
        const {events, repo, colorByUserId, max, min} = props;
        
        const nbEventsByUserId = new Map();
        for(let e of events){
            const userId = e.actor.id;
            const nbEvents = nbEventsByUserId.get(userId);
                  
            nbEventsByUserId.set(
                userId,
                nbEvents ? nbEvents+1 : 1
            )
        }
        
        
        const shiftByUserId = new Map(
            [...nbEventsByUserId]
            .sort( ([id1, nb1], [id2, nb2]) => nb2 - nb1 )
            .map( ([id, nb], i) => {
                return [
                    id,
                    i === 0 ?
                        0 : 
                        (i % 2 === 0 ? 1 : -1) * Math.ceil(i/2)
                ]
            })
        );
                
        return ϼ('section', 
            {
                className: 'repo-events'
            },
            ϼ('div', {className: 'repo-name'}, repo.name),
            events.map(e => {
                const date = new Date(e.created_at);
                const userId = e.actor.id;
                const color = colorByUserId.get(userId);
                const shift = shiftByUserId.get(userId);

                return ϼ('div',
                    {
                        key: e.id,
                        className: 'event',
                        title: moment(date).format('YYYY-MM-DD'),
                        style: {
                            left: 5+(90*(date.getTime() - min)/(max-min))+'%',
                            backgroundColor: color,
                            top: 'calc(50% + '+shift/1.5+'em)'
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
                       