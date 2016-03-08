"use strict";

// const rel = React.createElement;

var GithubAPIIndicator = React.createClass({
    displayName: "GithubAPIIndicator",
    
    render: function(){
        const {props} = this;
        const {login, remaining, limit, reset, method} = props;
        
        return rel('section', {},
            'Github API indicator'
                  
        )
    }
});
