
//校验是否全由数字组成
export function isDigit(s)
{
    var patrn=/^[0-9]{1,}$/;
    return patrn.test(s);
}

// 检测手机号
export function isPhone(s) {
    var patrn = /^(13[0-9]|14[7]|(15([0-3]|[5-9]))|17[0|7|8]|(18([0-3]|[5-9])))\d{8}$/;
    return patrn.test(s);
}

export function validPassword(s) {
    var patrn = /^(?![0-9]+$)\w{6,18}$/; //6-18非纯数字
    return patrn.test(s);
}

export function validCode(s) {
    var patrn = /^\d{6}$/; //6-18非纯数字
    return patrn.test(s);
}

export function isBetween (val, lo, hi) {
    if ((val < lo) || (val > hi)) { return(false); }
    else { return(true); }
}