import * as ActionConst from '../actions/actionConst';

const LoginInfo = {
    // Current login user
    username: '',
    password: '',
    session : '',
    token   : null,

    nickname: '',
    head_portrait: '',

    // For login ing.
    logining   : false,
    loginStatus: 0,
    loginingErr: null,

};

export default (state = LoginInfo, action) => {
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
            return Object.assign({}, state, {
                username: '',
                password: '',
                token   : '',

                logining   : false,
                loginStatus: 0,
                loginingErr: '请重新登录！'
            });
            break;
        case ActionConst.ACTION_GET_USERINFO_BEGIN:
            return state;
        case ActionConst.ACTION_GET_USERINFO_END:
            let o = {};
            if (action.nickname)
                o.nickname = action.nickname;
            if (action.head_portrait)
                o.head_portrait = action.head_portrait;
            if (action.token)
                o.token = action.token;
            return Object.assign({}, state, o);

        case ActionConst.ACTION_SET_USERINFO_END:
            let o2 = {};
            if (action.head_portrait)
                o2.head_portrait = action.head_portrait;
            if (action.nickname)
                o2.nickname = action.nickname;
            if (action.psw)
                o2.password = action.psw;
            if (action.token)
                o2.token = action.token;
            return Object.assign({}, state, o2);
        default:
            return state;
    }
}