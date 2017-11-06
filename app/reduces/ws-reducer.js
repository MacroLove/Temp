import * as ActionConst from '../actions/actionConst';

const MessageData = {
    data:null,
    state: 'idle', //idle, openning, received, error, closed,
};

export default (state = MessageData, action) => {
    switch (action.type) {
        case ActionConst.ACTION_LOGIN_BEGIN:
            return Object.assign({}, state, {logining: true, loginStatus:0});
        case ActionConst.ACTION_LOGIN_END:
            if (action.token && action.token.length > 2) {
                return Object.assign({}, state, {
                    username: action.user,
                    password: action.pwd,
                    token   : action.token,

                    logining   : false,
                    loginStatus: 1,
                    loginingErr: action.err
                });
            } else {
                return Object.assign({}, state, {logining: false, loginingErr: action.err, loginStatus: 0});
            }
        case ActionConst.ACTION_LOGIN_QUIT:
            return Object.assign({}, state);
            break;
        default:
            return state;
    }
}