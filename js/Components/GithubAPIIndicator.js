"use strict";

// const rel = React.createElement;

var GithubAPIIndicator = React.createClass({
    displayName: "GithubAPIIndicator",
    
    render: function(){
        const {props} = this;
        const {authenticatedUser, remaining, limit, reset, onPersonalAccessToken} = props;
        
        return ϼ('section', {className: 'github-api-indicator'},
            authenticatedUser ?
                'Hi '+authenticatedUser.login+'!' : 
                ϼ('label', {},
                    ϼ(
                        'a',
                        {
                            href: 'https://github.com/settings/tokens',
                            target: '_blank'
                        },
                        'Enter personal access token'
                    ),
                    ' ',
                    ϼ('input', {
                        onChange: e => onPersonalAccessToken(e.target.value.trim())
                    })  
                ),
            ϼ('div', {}, remaining, '/', limit, ' ',
              authenticatedUser ? '(personal access token)' : '(anonymous)'
            ),
            ϼ('div', {}, moment(reset).fromNow())
        )
    }
});
