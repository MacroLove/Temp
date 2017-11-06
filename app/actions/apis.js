import axios from 'axios';
import * as types from './actionConst';
import { Platform, NativeModules } from 'react-native';
import HttpApi from '../network/HttpApi';
import YsWebSocket from "../network/YsWebSocket";


export function login(user, pwd){
	return function (dispatch) {
		dispatch({
			type: types.ACTION_LOGIN_BEGIN,
		});
		HttpApi.login(user, pwd, (resp, error) => {
		    //console.log("Login", resp, error);
            dispatch({
                type: types.ACTION_LOGIN_END,
				user: user,
				pwd: pwd,
				token: resp ? resp.token : '',
				err: error+"",
            });
		});
	};
}

export function getUserInfo(params){
    return function (dispatch) {
        dispatch({
            type: types.ACTION_GET_USERINFO_BEGIN,
        });
        HttpApi.getUserInfo(params, (resp, error) => {
            let o = {type: types.ACTION_GET_USERINFO_END};
            if (resp && resp.head_portrait)
                o.head_portrait = resp.head_portrait;
            if (resp && resp.nickname)
                o.nickname = resp.nickname;

            dispatch(o);
        });
    };
}

export function setHeadPortrait(urla) {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_SET_USERINFO_END,
            head_portrait: urla,
        });
    };
}
export function setNickname(nn) {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_SET_USERINFO_END,
            nickname: nn,
        });
    };
}
export function setPassword(nn) {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_SET_USERINFO_END,
            psw: nn,
        });
    };
}
export function setToken(nn) {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_SET_USERINFO_END,
            token: nn,
        });
    };
}

export function refreshLedList() {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_REFRESH_LED_LIST,
        });
    };
}

export function refreshAdsList() {
    return function (dispatch) {
        dispatch({
            type: types.ACTION_REFRESH_ADS_LIST,
        });
    };
}

export function quit() {
    YsWebSocket.disConnect();
    return function (dispatch) {
        dispatch({
            type : types.ACTION_LOGIN_QUIT
        });
    }
}