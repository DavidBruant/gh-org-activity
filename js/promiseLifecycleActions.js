'use strict';

function promiseLifecycleActions(dispatch, name, promising, ...args){
    dispatch({
        type: name,
        lifecycle: 'waiting',
        args: args
    });
    
    return promising(...args)
    .then( result => {
        dispatch({
            type: name,
            lifecycle: 'success',
            result: result
        })
        
        return result;
    })
    .catch( error => {
        dispatch({
            type: name,
            lifecycle: 'error',
            error: error
        })
        
        throw error;
    })
}