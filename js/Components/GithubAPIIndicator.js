"use strict";

// const rel = React.createElement;

var GithubAPIIndicator = React.createClass({
    displayName: "GithubAPIIndicator",
    
    render: function(){
        const {props} = this;
        const {login, remaining, limit, reset, method} = props;
        
        return ϼ('section', {},
            'Github API indicator'
        )
    }
});
