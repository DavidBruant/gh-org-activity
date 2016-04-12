"use strict";

var Top = React.createClass({
    displayName: "Top",
    
    componentWillReceiveProps(nextProps){
        const {org} = this.props;
        
        this.setState({
            orgName: org && org.login
        })
    },
    
    getInitialState(){
        const {org} = this.props;
        
        return {
            orgName: org && org.login
        };
    },
    
    render(){
        const {props, state} = this;
        const {
            authenticatedUser, org, eventsByRepo, githubAPIRateInfos,
            onPersonalAccessToken, onLogout, onOrgChange
        } = props;
        
        console.log('org', org)
        
        return ϼ('section', {},
            ϼ('header', {},
                ϼ('input', 
                    {
                        onChange: e => this.setState({orgName: e.target.value}),
                        onBlur: e => onOrgChange(e.target.value.trim()),
                        type: 'text',
                        value: state.orgName
                    }
                ), 
                ϼ('button', {}, "✔"), // totally useless, just so the user focuses on something else
                
                ϼ(
                    GithubAPIIndicator,
                    Object.assign(
                        {
                            onPersonalAccessToken: onPersonalAccessToken,
                            onLogout: onLogout,
                            authenticatedUser: authenticatedUser
                        },
                        githubAPIRateInfos
                    )
                )
            ),
            
            eventsByRepo ? ϼ(GithubOrgActivity, props) : undefined
        )
    }
});
