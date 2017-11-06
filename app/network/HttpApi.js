import Qs from 'qs';
import axios from 'axios';


const Options = {
    url: '/',

    baseURL: '/',

    transformRequest: [function (data) {
        var seria = Qs.stringify(data);
        return seria;
    }],

    transformResponse: [function (data) {
        var p = Qs.parse(data);
        return p;
    }],

    headers: {'X-Requested-With': 'XMLHttpRequest'},

    params: {

    },

    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
    },

    data: {

    },

    timeout: 5000,

    withCredentials: true, // default

    responseType: 'json', // default
};
const ConfigOptions = {
    url: '/',

    baseURL: 'http://api.popled.cn/mb',

    transformRequest: [function (data) {
        var seria = Qs.stringify(data);
        return seria;
    }],

    transformResponse: [function (data) {
        var p = Qs.parse(data);
        return p;
    }],

    headers: {'X-Requested-With': 'XMLHttpRequest'},

    params: {

    },

    paramsSerializer: function(params) {
        return Qs.stringify(params, {arrayFormat: 'brackets'})
    },

    data: {

    },

    timeout: 5000,

    withCredentials: true, // default

    responseType: 'json', // default
};


const HttpApi = {
    /////////// Common //////////////
    post:function(url, params, callback, option=Options){
        axios.post(url, params, option)
            .then(function (response) {
                if (callback) {
                    if (response.data)
                        if (response.data.status == '1')
                            callback(response.data.data || response.data.msg, null);
                        else
                            callback(null, response.data.msg + '', response.data);
                    else
                        callback(null, "数据解析错误！");
                }
            })
            .catch(function (error) {
                //console.log(error);
                if (callback) {
                    callback(null, error);
                }
            });
    },
    get:function(url, params, callback, option=Options){
        axios.get(url, {params:params},option)
            .then(function (response) {
                if (callback) {
                    if (response.data)
                        if (response.data.status == '1')
                            callback(response.data.data || response.data.msg, null);
                        else
                            callback(null, response.data.msg + '', response.data);
                    else
                        callback(null, "数据解析错误！");
                }
            })
            .catch(function (error) {
                if (callback) {
                    callback(null, error);
                }
            });
    },

    makePost: function (url, params, option=Options) {
        var p = axios.post(url, params, option);
        return p;
    },

    all: function (posts, callback) {
        axios.all(posts).then(axios.spread(callback)).catch(axios.spread(callback));
    },

    /////////// Websocket ////////////////////
    _websocket: null,

    /////////// below is business Api //////////////
    login:function (user, pwd, callback) {
        this.post('/user/user_auth', {user:user, pwd:pwd}, callback);
    },

    getConfigs: function (params, callback) {
        this.post('/config/get', params, (resp, error)=>{
            if (resp && resp.API_URL) {
                Options.baseURL = resp.API_URL.startsWith('http://') ? resp.API_URL : ('http://'+resp.API_URL);
            }
            callback(resp, error);
        }, ConfigOptions);
    },


    quitWx:function (openid, user, callback) {
        this.post('/user/wechatquit', {user:user, openid:openid}, callback);
    },

    quitBrowser:function (token, callback) {
        this.post('/user/quit', {token:token}, callback);
    },

    switchUser:function (openid, user, callback) {
        this.post('/user/switchit', {user:user, openid:openid}, callback);
    },

    getUserList:function (openid, callback) {
        this.post('/user/user_list', {openid:openid}, callback);
    },

    deleteGroup:function (params, callback) {
        this.post('/program/del_group', params, callback);
    },

    createOrModifyGroup:function (params, callback) {
        this.post('/program/create_group', params, callback);
    },

    getJsSign:function (params, callback) {
        this.post('/config/getJsSign', params, callback);
    },

    renameLed:function (params, callback) {
        this.post('/led/rename/', params, callback);
    },

    addLed:function (params, callback) {
        this.post('/led/create/', params, callback);
    },

    deleteLed:function (params, callback) {
        this.post('/led/del/', params, callback);
    },

    findPsw:function (params, callback) {
        this.post('/user/findpass/', params, callback);
    },
    resetPsw:function (params, callback) {
        this.post('/user/resetpass/', params, callback);
    },

    register:function (params, callback) {
        this.post('/user/register/', params, callback);
    },

    sendSMS:function (params, callback) {
        this.post('/sms/send/', params, callback);
    },

    syncData:function (params, callback) {
        this.post('/data/sync/', params, callback);
    },

    getAdsHistory:function (params, callback) {
        this.post('/program/record/', params, callback);
    },

    getLedAds:function (params, callback) {
        this.post('/program/show/', params, callback);
    },

    sendAd:function (params, callback) {
        this.post('/send/program/', params, callback);
    },
    sendAdToo:function (params, callback) {
        this.post('/send/program/', params, callback);
    },
    sendCmd:function (params, callback) {
        this.post('/cmd/send/', params, callback);
    },

    bindWx:function (params, callback) {
        this.post('/user/bind/', params, callback);
    },

    authWx:function (params, callback) {
        this.post('/user/oauth/', params, callback);
    },

    getAdInfo:function (params, callback) {
        this.post('/program/info/', params, callback);
    },

    deleteAd:function (params, callback) {
        this.post('/program/del/', params, callback);
    },
    deleteAdHistory:function (params, callback) {
        this.post('/Adhistory/del', params, callback);
    },

    getCmdSendHistory:function (params, callback) {
        this.post('/cmd/record/', params, callback);
    },

    getLedPc:function (params, callback) {
        this.post('/cmd/trend/', params, callback);
    },

    getAdsList:function (params, callback) {
        this.post('/program/program_list/', params, callback);
    },

    getAdsGroups:function (params, callback) {
        this.post('/program/group/', params, callback);
    },

    getWeather:function (params, callback) {
        this.post('/part/get/', params, callback);
    },

    createAd:function (params, callback) {
        this.post('/program/create/', params, callback);
    },

    getLedList:function (params, callback) {
        this.post('/led/led_list', params, callback);
    },
    getLedGroupList:function (params, callback) {
        this.post('/led/group_list', params, callback);
    },

    // params={token, base64, type=[program/background], path}
    uploadImage:function (params, callback) {
        this.post('/image/save', params, callback);
    },

    // { img:[ {1:,4:}, ...], ani:[ {1:,4:}, ...] } # 1 qian, 4 bei
    getBackground:function (params, callback) {
        this.post('/image/getbackground', params, callback);
    },

    getDeviceGps: function (params, callback) {
        this.post('/map/get_dev_gi', params, callback);
    },

    setGpsInfo: function (params, callback) {
        this.post('/map/dev_gi', params, callback);
    },

    getFixedDevices: function (params, callback) {
        this.post('/map/get_user_gi', params, callback);
    },
    getGpsDevices: function (params, callback) {
        this.post('/map/get_gps_gi', params, callback);
    },
    
    getArticles: function (params, callback) {
        this.post('/article/get_article/', params, callback);
    },

    getArticleDetail: function (params, callback) {
        this.post('/article/article_info/', params, callback);
    },

    getArticleComments: function (params, callback) {
        this.post('/article/get_comment/', params, callback);
    },

    saveArticle: function (params, callback) {
        this.post('/article/collect/', params, callback);
    },

    getSavedArticle: function (params, callback) {
        this.post('/article/get_collect/', params, callback);
    },

    comment: function (params, callback) {
        this.post('/article/comment/', params, callback);
    },

    upvote: function (params, callback) {
        this.post('/article/upvote/', params, callback);
    },

    feedback: function (params, callback) {
        this.post('/article/feedback/', params, callback);
    },

    setNickName: function (params, callback) {
        this.post('/user/nickname/', params, callback);
    },

    setHeadImg: function (params, callback) {
        this.post('/user/head_portrait/', params, callback);
    },

    getUserInfo: function (params, callback) {
        this.post('/user/config/', params, callback);
    },

    sendIn: function (params, callback) {
        this.post('/send/sendIn', params, callback);
    },

    //－－－－－－－－－－－－－－－ 地图相关接口 －－－－－－－－－－－－－－－//
    reqTokenDecodeLoc: null,
    getGpsAddressFromLoc: function (lat, long, callback) {
        if (this.reqTokenDecodeLoc) {
            this.reqTokenDecodeLoc.cancel();
            this.reqTokenDecodeLoc = null;
        }
        let URL_DECODE_POS = "http://restapi.amap.com/v3/geocode/regeo?key=2c6ea92b66ed486fdf8f89656b29041c&output=json&location="; //long,lat
        let url = URL_DECODE_POS + long + "," + lat;
        this.reqTokenDecodeLoc = axios.CancelToken.source();
        axios.get(url, {cancelToken:this.reqTokenDecodeLoc.token})
            .then(function (response) {
                HttpApi.reqTokenDecodeLoc = null;
                if (response &&response.data && response.data.status ==1 &&response.data.regeocode && response.data.regeocode.formatted_address)
                    callback(response.data.regeocode.formatted_address);
                else
                    callback(null);
            })
            .catch(function (error) {
                HttpApi.reqTokenDecodeLoc = null;
                callback(null);
            });
    }
};

export default HttpApi;


