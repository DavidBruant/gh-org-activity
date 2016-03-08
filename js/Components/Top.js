"use strict";

// const rel = React.createElement;

var Top = React.createClass({
    displayName: "Top",
    
    render: function(){
        const {props} = this;
        const {onOrgChange} = props;
        
        return rel('section', {},
            rel('header', {},
                rel('h1', 
                    {
                        contentEditable: true,
                        spellCheck: false,
                        onBlur: e => onOrgChange(e.target.textContent)
                    },
                    org
                ), 
                rel('button', {}, "✔"), // totally useless, just so the user focuses on something else
                
                rel(GithubAPIIndicator, {})
            ),
            
            rel(GithubOrgActivity, props)
                  
        )
    }
});
