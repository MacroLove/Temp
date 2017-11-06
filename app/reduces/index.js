/**
 * Created by Tomk on 2017/8/14.
 */
import { combineReducers } from 'redux';

import routeReducer from './route-reducer';
import loginReducer from './login-reducer';
import uiReducer from './ui-reducer';
// ... other reducers

export default combineReducers({
    route: routeReducer,
    login: loginReducer,
    ui:uiReducer,
    // ... other reducers

});

