"use strict";

const { connect } = ReactRedux;
//import GithubOrgActivity from '../GithubOrgActivity'

const mapStateToProps = state => state.toJS();

const mapDispatchToProps = dispatch => {
    return {
        onOrgChange(orgName){
            throw 'githubAPI is not defined. Where to find the token?'
            promiseLifecycleActions(dispatch, 'ORG', githubAPI.orgInfos, orgName);
        },
        onPersonalAccessToken(token){
            dispatch({
                type: 'PERSONAL_ACCESS_TOKEN_INPUT',
                token: token
            })
        },
        onLogout(){
            dispatch({
                type: 'LOGOUT'
            })
        }
    }
}

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);