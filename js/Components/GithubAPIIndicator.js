"use strict";

// const rel = React.createElement;

var GithubAPIIndicator = React.createClass({
    displayName: "GithubAPIIndicator",
    
    render: function(){
        const {props} = this;
        const {authenticatedUser, remaining, limit, reset, onPersonalAccessToken, onLogout} = props;
        
        return ϼ('section', {className: 'github-api-indicator'},
            authenticatedUser ?
                ϼ('div', {},
                    'Hi '+authenticatedUser.login+'!',
                    ϼ('button', {onClick: onLogout}, 'log out')
                ) : 
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
            ϼ('div', {}, 'Rate limit: ',
                ϼ('progress', {
                    value: remaining,
                    max: limit,
                    title: remaining+'/'+limit
                }, remaining+'/'+limit)
            ),
            ϼ('div', {}, authenticatedUser ? '(personal access token)' : '(anonymous)'),
            ϼ('div', {}, 'Reset ', moment(reset).fromNow())
        )
    }
});
