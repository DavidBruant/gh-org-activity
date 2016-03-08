"use strict";

var Top = React.createClass({
    displayName: "Top",
    
    render: function(){
        const {props} = this;
        const {onOrgChange, eventsByRepo} = props;
        
        return ϼ('section', {},
            ϼ('header', {},
                ϼ('h1', 
                    {
                        contentEditable: true,
                        spellCheck: false,
                        onBlur: e => onOrgChange(e.target.textContent)
                    },
                    org
                ), 
                ϼ('button', {}, "✔"), // totally useless, just so the user focuses on something else
                
                ϼ(GithubAPIIndicator, {})
            ),
            
            eventsByRepo ? ϼ(GithubOrgActivity, props) : undefined
        )
    }
});
