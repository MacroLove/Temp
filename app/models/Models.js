export const LedGroup = {
    name: 'LedGroup',
    properties: {
        id:  'string',
        name: 'string',
        pid: 'string',
        origin_id: 'string',
        gcount: {type: 'int', default: 0},
    }
};

export const LedDevice = {
    name: 'LedDevice',
    properties: {
        device:  'string',
        title: 'string',
        screen_width: 'string',
        screen_height: 'string',
        color_value: 'string',
        server_version: 'string',
        status: 'string',
        last_time: 'string',
    }
};

export const AdPro = {
    program_type: 0,
    play_model: 'play_loop',
    count_play: 1,
    model_fixed_time: 3,
    program_no: 1,
    program_name: "广告-1",
    program_group: 0,
    type_color: 3,
    width: 64,
    height: 32,
    starttime: '2000-01-01',
    endtime:'2037-12-31',
    week:[1,2,3,4,5,6,7],
    type_bg:0,
    path_bg:0,
    bg_fit:1,
    auto_adapt:0,
    gray:0,
    platform:'APP',
    ignore_time_control:'1', //是否开启时间控制 0 开启 1 关
    time_sync:'',
};

export const AdInfoPos = {
    h:32, w:64, x:0, y:0
};

export const AdListItemZimu = {
    animationway : 1,
    continue: 0,
    size_interval :0,
    bordercolor : 0,
    speed : 10,
    remaintime : 3,
    font: 2,
    color: 255,
    bold: 0,
    fontSize: 16,
    alignHorizontal: 'left',
    value:'',
    type: 'text_pic',
    vertical: '0',
    rotate: '0',
    align_vertical:'top',
};
export const AdListItemTime = {
    animationway:1,
    bordercolor:0,
    speed:10,
    remaintime:3,
    color:255,
    fontSize:16,
    format:"",
    type:"time",

    //count down
    // timing:0,
    // value:"",
    // tg_data:"",
};
export const AdListItemPic = {
    animationway:1,
    continue:0,
    size_interval:0,
    bordercolor:'0',
    speed:10,
    remaintime:3,
    path:"",
    type:'image'
};
export const AdListItemWeather = {
    animationway:1,
    continue:0,
    size_interval:0,
    bordercolor:0,
    speed:10,
    remaintime:3,
    color:255,
    fontSize:16,
    value:"",
    type:'text_part',
    api_key:'baidu',
    city:'深圳'

};

// Deep copy json object {}.
export function make(parent, child) {
    var i, proxy;
    proxy = JSON.stringify(parent); //把parent对象转换成字符串
    proxy = JSON.parse(proxy) //把字符串转换成对象，这是parent的一个副本
    child = child || {};
    for(i in proxy) {
        if(proxy.hasOwnProperty(i)) {
            child[i] = proxy[i];
        }
    }
    proxy = null; //因为proxy是中间对象，可以将它回收掉
    return child;
}

/***
 Program.prototype.timeformatreplace = function (_v) {
    var t = new Date();
    _v = _v.replace("{YYYY}",t.getFullYear());
    _v = _v.replace("{YY}",t.getFullYear().toString().slice(2,4));
    var m = t.getUTCMonth()+1;
    if(m<10) m="0"+m;
    _v = _v.replace("{MM}",m);
    var d= t.getDate();
    if(d<10) d="0"+d;
    _v = _v.replace("{DD}",d);
    var w= t.getDay();
    switch (w) {
        case 1:w="一";break;
        case 2:w="二";break;
        case 3:w="三";break;
        case 4:w="四";break;
        case 5:w="五";break;
        case 6:w="六";break;
        case 7:w="日";break;
    }
    _v = _v.replace("{w}",w);
    var h = t.getHours();
    if(h<10) h="0"+h;
    _v = _v.replace("{hh}",h);
    var min = t.getMinutes();
    if(min<10) min="0"+min;
    _v = _v.replace("{mm}",min);
    var s = t.getSeconds();
    if(s<10) s="0"+s;
    _v = _v.replace("{ss}",s);
    return _v;
};
 Program.prototype.getCountTime = function (_t){
    var t1 = new Date(_t);
    var t2 = new Date();
    var day = Math.ceil((t1-t2)/86400000);
    if(day<10){
        return "000"+day;
    } else if(day<100){
        return "00"+day;
    } else if(day<1000){
        return "0"+day;
    } else {
        return day;
    }
}
 ***/