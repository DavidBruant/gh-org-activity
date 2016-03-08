"use strict";

const { connect } = ReactRedux;
//import GithubOrgActivity from '../GithubOrgActivity'

const mapStateToProps = state => state.toJS();

const mapDispatchToProps = dispatch => {
    return {
        onOrgChange(org){
            console.log('New org!!', org);
        }
    }
}

const TopContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Top);