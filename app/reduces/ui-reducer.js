/**
 * This is used for UI related refresh signals. Like reload ads list or led list.
 * */

import * as ActionConst from '../actions/actionConst';

const UiStates = {
    stateLedList: 0,
    stateAdsList: 0,
};

export default (state = UiStates, action) => {
    switch (action.type) {
        case ActionConst.ACTION_REFRESH_ADS_LIST:
            return Object.assign({}, state, {stateAdsList:state.stateAdsList+1});
        case ActionConst.ACTION_REFRESH_LED_LIST:
            return Object.assign({}, state, {stateLedList:state.stateLedList+1});
        default:
            return state;
    }
}