"use strict";

var Top = React.createClass({
    displayName: "Top",
    
    render: function(){
        const {props} = this;
        const {
            onOrgChange, eventsByRepo, githubAPIRateInfos,
            onPersonalAccessToken, authenticatedUser, org
        } = props;
        
        return ϼ('section', {},
            ϼ('header', {},
                ϼ('h1', 
                    {
                        contentEditable: true,
                        spellCheck: false,
                        onBlur: e => onOrgChange(e.target.textContent)
                    },
                    org ? org.login : undefined
                ), 
                ϼ('button', {}, "✔"), // totally useless, just so the user focuses on something else
                
                ϼ(
                    GithubAPIIndicator,
                    Object.assign(
                        {onPersonalAccessToken: onPersonalAccessToken, authenticatedUser: authenticatedUser},
                        githubAPIRateInfos
                    )
                )
            ),
            
            eventsByRepo ? ϼ(GithubOrgActivity, props) : undefined
        )
    }
});
