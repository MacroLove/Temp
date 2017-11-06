
let Collections_ = require("lodash/collection");

// 1 means AP mode; else is online mode.
export const LoginType = {
    "Remote": 0,
    "Ap" : 1,
    "Lan" : 2,
};

export const kLastProgramParam = "lastProgramNo";
export const kLastLedParam = "lastPc";
export const kLastLedParam4Ad = "lastPc4Ad";

/************** [广告扩展属性（extend.addtype）参数说明] **************/

export const AdType_AutoText = "text";
export const AdType_Weather = "text_part";
export const AdType_Text = "text_pic";
export const AdType_Image = "image";
export const AdType_Time = "time";
export const AdType_TimeCountDown = "text_timing";
export const AdType_Area = "subarea";

export const FenquType_Text = "text_pic";
export const FenquType_Image = "image";
export const FenquType_Time = "time";
export const FenquType_Weather = "text_part";

export const TimeFormats = [
    // "今天是{YYYY}年{MM}月{DD}日 星期{w}, 现在时间{hh}时{mm}分{ss}秒",
    // "今天是{YYYY}年{MM}月{DD}日 星期{w}",
    // "{hh}时{mm}分{ss}秒"
    "{YYYY}.{MM}.{DD}--{hh}:{mm}:{ss}--星期{w}",
    "{YYYY}.{MM}.{DD}",
    "{hh}:{mm}:{ss}"
];


export const WeatherFormats = {
    Types : {
        City:"w_city",
        Date:"w_date",
        Weather:"w_weather",
        PM:"w_pm",
        Clothes:"w_clothes",
        CarWash:"w_carwash",
        Travel:"w_travel",
        ColdDes:"w_cold_des",
        Rays:"w_rays",
        Weather1:"w_weather1",
        Weather2:"w_weather2",
        Weather3:"w_weather3",
    },
    "w_city": "{city}",
    "w_date": "{date}",
    "w_weather": "{week}{weather}{wind}{temperature}",
    "w_pm": "PM2.5:{pm}.",
    "w_clothes": "{clothes}:{clothes_des}",
    "w_carwash": "{carwash}:{carwash_des}",
    "w_travel": "{travel}:{travel_des}",
    "w_cold_des": "{cold}:{cold_des}",
    "w_rays": "{rays}:{rays_des}",
    "w_weather1": "{week1}{weather1}{wind1}{temperature1}",
    "w_weather2": "{week2}{weather2}{wind2}{temperature2}",
    "w_weather3": "{week3}{weather3}{wind3}{temperature3}",
};

export function hasWeather(type, str) {
    if (!str)
        return false;
    if (type == WeatherFormats.Types.City) {
        return Collections_.includes(str, "{city}");
    }else if(type == WeatherFormats.Types.CarWash) {
        return Collections_.includes(str, "{date}");
    }else if(type == WeatherFormats.Types.Weather) {
        return (Collections_.includes(str, "{weather}") || Collections_.includes(str, "{wind}") || Collections_.includes(str, "{temperature}"));
    }else if(type == WeatherFormats.Types.PM) {
        return Collections_.includes(str, "{pm}");
    }else if(type == WeatherFormats.Types.Clothes) {
        return Collections_.includes(str, "{clothes_des}");
    }else if(type == WeatherFormats.Types.CarWash) {
        return Collections_.includes(str, "{carwash_des}");
    }else if(type == WeatherFormats.Types.Travel) {
        return Collections_.includes(str, "{travel_des}");
    }else if(type == WeatherFormats.Types.ColdDes) {
        return Collections_.includes(str, "{cold_des}");
    }else if(type == WeatherFormats.Types.Rays) {
        return Collections_.includes(str, "{rays_des}");
    }else if(type == WeatherFormats.Types.Weather1) {
        return (Collections_.includes(str, "{weather1}") || Collections_.includes(str, "{wind1}") || Collections_.includes(str, "{temperature1}"));
    }else if(type == WeatherFormats.Types.Weather2) {
        return (Collections_.includes(str, "{weather2}") || Collections_.includes(str, "{wind2}") || Collections_.includes(str, "{temperature2}"));
    }else if(type == WeatherFormats.Types.Weather3) {
        return (Collections_.includes(str, "{weather3}") || Collections_.includes(str, "{wind3}") || Collections_.includes(str, "{temperature3}"));
    }
    return false;
};