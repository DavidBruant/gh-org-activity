"use strict";

const format = "dddd, MMMM Do YYYY, h:mm:ss a";

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
        
        const nbUsers = new Set(events.map(e => e.actor.id)).size;
        
        const colorByUserId = new Map();
        const shiftByUserId = new Map();
        
        return React.createElement('div', {style: {width: '100%', minHeight: '100%', position: 'relative'}},
            React.createElement('div', {style: {position: 'absolute', top: '0'}}, moment(max).format(format)),
            React.createElement('div', {style: {position: 'absolute', bottom: '0'}}, moment(min).format(format)),
            events.map(e => {
                const date = new Date(e.created_at);
                const userId = e.actor.id;
            
                let color = colorByUserId.get(userId);
                if(color === undefined){
                    color = 'hsl('+360*(colorByUserId.size)/nbUsers+', 40%, 60%)';
                    colorByUserId.set(userId, color);
                }
            
                let shift = shiftByUserId.get(userId);
                if(shift === undefined){
                    shift = shiftByUserId.size;
                    shiftByUserId.set(userId, shift);
                }
            
                return React.createElement('div',
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
        );
    }
});
                       