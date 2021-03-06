import {LoginType} from "../constants/Defines";

function DataCenterSingleton() {
    // the cached instance
    var instance = this;

    // rewrite the contructor
    DataCenterSingleton = function () {
        return instance;
    };

    instance.prototype = this;

    // Datas------------------- start
    this.configs = {
        "minProNo"                     : 1,
        "maxProNo"                     : 95,
        "textPicMinFontSize"           : 5,
        "textPicMaxFontSize"           : 256,
        "PROGRAM_TYPE"                 : ["普通广告", "插播广告", "报警广告"],
        "PROGRAM_TYPE_COLOR"           : {"1": "单色", "2": "双色", "3": "全彩"},
        "PLAY_MODE"                    : {"play_loop": "循环播放", "play_fixed_time": "定长播放"},
        "POLAR_DATA"                   : ["低", "高"],
        "POLAR_OE"                     : ["低", "高"],
        "TYPE_SCAN"                    : {
            "0"  : "1/16扫描:直行走线,一路数据带16行",
            "16" : "1.0扫描:90接口静态模组",
            "17" : "1.1扫描:73接口静态模组",
            "33" : "2/1 扫描：75接口二扫模组",
            "64" : "0/4 扫描",
            "65" : "1/4扫描:四扫下行(1路16行)(04-P16-08)",
            "66" : "2/4扫描:四扫下行(1路8行)(04-P08-08)",
            "67" : "3/4扫描:每8点打折，行反列正8（1路16行)",
            "68" : "4/4扫描:四扫下行(1路8行)(04-P16-08)",
            "69" : "5/4扫描:四扫下行(1路8行)(04-P16-08)(无138译码)",
            "70" : "6/4扫描",
            "71" : "7/4扫描",
            "72" : "8/4扫描:75接口全彩模组",
            "73" : "9/4 扫描",
            "74" : "10/4 扫描",
            "75" : "11/4 扫描",
            "76" : "12/4 扫描",
            "77" : "13/4 扫描",
            "78" : "14/4 扫描：在4.2扫基础上U型扫(1路16行)",
            "79" : "15/4 扫描：每4点打折，两个信号反向特殊(1路16行)",
            "80" : "16/4 扫描",
            "97" : "1/6 扫描：聚融特殊6扫程序",
            "128": "0/8 扫描:不打折,一路数据带8行",
            "129": "1/8 扫描:每8点向下打折一次,一路数据带16行",
            "130": "2/8 扫描:每8点向上打折一次,一路数据带16行",
            "131": "3/8 扫描：每16点向下打折一次，一路数据带8行",
            "132": "4/8 扫描：每16点向上打折一次，一路数据带8行",
            "133": "5/8 扫描:每8点向上打折一次,一路数据带16行",
            "134": "6/8 扫描:每8点向上打折一次,一路数据带16行",
            "135": "7/8 扫描:每8点向上打折一次,一路数据带16行",
            "136": "8/8 扫描：一路折扫16行，R与B信号反",
            "137": "9/8 扫描：一路折扫16行，与8.8信号反"
        },
        TRENDS                         : {

            6 :
                "1/4 扫描：四扫下行(1路16行)(04-P16-08)",
            7 :
                "5/8 扫描：每8点向下打折一次，一路数据带16行",
            8 :
                "6/4 扫描：向上4点打折，一路数据带16行",
            9 :
                "12/4 扫描",
            10:
                "0/8 扫描：不打折，一路数据带8行&lt;/item&gt;",
            11:
                "0/2扫描：常规2.0扫",
            12:
                "1/16 扫描：直行走线，一路数据带16行",
            13:
                "5/4 扫描：四扫下行(1路8行)(04-P16-08)(无138译码)",
            14:
                "4/4 扫描：四扫下行(1路8行)(04-P16-08)",
            15:
                "8/4 扫描：75接口全彩模组",
            16:
                "9/4 扫描：一路数据带8点，向下4点打折",
            17:
                "17/4 扫描",
            18:
                "3/4 扫描：每8点打折，行反列正8(1路16行)",
            19:
                "3/8 扫描：每16点向下打折一次，一路数据带8行",
            20:
                "0/3扫描",
            21:
                "11/4扫描：一路数据带4行反向8点打折",
            22:
                "6/8扫描：道仆单元板32×24车载屏",
            23:
                "7/8扫描：精琢定制模组",
            24:
                "6/4 扫描：红蓝对调",
            25:
                "5/8扫描：绿蓝对调",
            26:
                "明炜2.0扫",
            27:
                "1/2扫：    P10   16*16",
            28:
                "1/2扫：红蓝对调",
            29:
                "1/16扫描：绿蓝对调",
            30:
                "2/8扫描：红蓝对调",
            31:
                "2/8 扫描：每16点向下打折一次，一路数据带8行",
            32:
                "0/10扫描：32*20点特色屏走线，10扫直行。",
            33:
                "MXL-P4全彩",
            34:
                "0/5扫描：直行走线一路数据带16行",
            35:
                "11/8扫描：P4-32*16-8S-15A",
            36:
                "12/8扫描：KING-B762D8023-8S-B-1.PCB,跳线屏",
            37:
                "13/4",
            38:
                "13/8扫描：一路数据带8行向上打折，48*32",
            39:
                "14/8扫描：一路数据带8行向上打折，48*32模组",
        },
        "TIMEZONE"                     : {"GMT +8": "北京,香港,乌鲁木齐,台北"},
        "VERSION"                      : {
            "2" : "8WN-A",
            "6" : "6CN-GD",
            "9" : "6CG-GD",
            "11": "60",
            "12": "63N",
            "13": "66N",
            "14": "67N",
            "15": "66G",
            "16": "6CG",
            "17": "66GS",
            "18": "6CGA",
            "19": "6CN",
            "21": "70N",
            "22": "71N",
            "31": "93",
            "32": "95",
            "33": "9XG",
            "34": "9XC",
            "35": "9XN",
            "36": "9XW",
            "37": "9CN",
            "38": "9CG",
            "39": "9XL",
            "40": "50W",
            "52": "5W",
            "62": "6W",
            "72": "7WN-A",
            "1A": "6CNA",
            "1B": "6CNB",
            "1C": "6CNC",
            "1D": "3CZN",
            "1E": "3CZG",
            "3F": "100",
            "0e": "3CZG-GD",
            "0d": "3CZN-GD"
        },
        "DEFAULT_WIDTH"                : 128,
        "DEFAULT_HEIGHT"               : 32,
        "DEFAULT_POLAR_DATA"           : 1,
        "DEFAULT_POLAR_OE"             : 0,
        "DEFAULT_TYPE_SCAN"            : 0,
        "DEFAULT_PROGRAM_TYPE"         : 0,
        "DEFAULT_PROGRAM_TYPE_COLOR"   : 2,
        "DEFAULT_PROGRAM_ANIMATION"    : 1,
        "DEFAULT_PROGRAM_BORDER"       : 0,
        "DEFAULT_RFC"                  : 255,
        "DEFAULT_RFZ"                  : 16,
        "DEFAULT_PROGRAM_FONT"         : 2,
        "DEFAULT_AUDIO_SPEAKER"        : 0,
        "DEFAULT_AUDIO_HINT"           : 0,
        "PROGRAM_RFL"                  : "left",
        "DEFAULT_PROGRAM_SCL_ANIMATION": "left",
        "DEFAULT_VERSION"              : "11",
        "DEFAULT_TIMEZONE"             : "GMT +8",
        "DEFAULT_DATE_PLAY"            : {"starttime": "2000-01-01", "endtime": "2037-12-31"},
        "PROGRAM_BORDER"               : ["无边框", "红4点", "绿4点", "黄4点", "红1点", "绿1点", "黄1点", "红单线闪烁", "绿单线闪烁", "黄单线闪烁", "红单线环绕", "绿单线环绕", "黄单线环绕", "红双线环绕", "绿双线环绕", "黄双线环绕"],
        "PROGRAM_ANIMATION"            : {
            "1" : "立即显示",
            "2" : "左移",
            "3" : "右移",
            "4" : "上移",
            "5" : "下移",
            "6" : "从左向右展开",
            "7" : "从上向下展开",
            "8" : "从右向左展开",
            "9" : "飘雪",
            "10": "冒泡",
            "11": "分散左拉",
            "12": "陨落",
            "13": "向上镭射",
            "14": "向下镭射",
            "15": "向右镭射",
            "16": "画卷合",
            "17": "画卷开",
            "18": "卷轴左",
            "19": "卷轴右",
            "20": "水平穿插",
            "21": "上下交错",
            "22": "左右合",
            "23": "左右开",
            "24": "上下合",
            "25": "上下开",
            "26": "随机"
        },
        "PROGRAM_SCL_ANIMATION"        : {"left": "连续左移"},
        "PROGRAM_FONT_ALIGN"           : {"left": "居左对齐", "center": "居中对齐", "right": "居右对齐"},
        "PROGRAM_ALIGN_VERTICAL"       : {"top": "居上对齐", "center": "居中对齐", "bottom": "居下对齐"},
        "PROGRAM_FONT_COLOR"           : {
            "255"     : "红色",
            "65280"   : "绿色",
            "65535"   : "黄色",
            "16711680": "蓝色",
            "16711935": "紫色",
            "16776960": "青色",
            "16777215": "白色"
        },
        "COLOR_FONT_COLOR"             : {
            "1": ["255"],
            "2": ["255", "65280", "65535"],
            "3": ["255", "65280", "65535", "16711680", "16711935", "16776960", "16777215"]
        },
        "PROGRAM_FONT_SIZE"            : {"16": "16", "24": "24", "32": "32"},
        "PROGRAM_FONT"                 : {
            "1": "黑体",
            "2": "宋体",
            "3": "楷体",
            "4": "隶书",
            "5": "微软雅黑",
            "6": "幼圆",
            "7": "华文琥珀"
        },
        "AUDIO_SPEAKER"                : ["女主播1", "男主播1", "男主播2", "女主播2", "唐老鸭", "女童音"],
        "AUDIO_HINT"                   : ["无", "短消息提示音01", "信息提示音01", "短消息提示音02", "电话铃音", "短消息提示音", "信息提示音02", "信息提示音03", "警报声", "信息提示音04", "振动声", "信息提示音05", "水滴声", "信息提示音06", "出错提示", "\"布谷\"声提示音", "紧急警报声", "警报声01", "警报声02", "局促提示音", "门铃声"],
        "WEEK"                         : {
            "1": "星期一",
            "2": "星期二",
            "3": "星期三",
            "4": "星期四",
            "5": "星期五",
            "6": "星期六",
            "7": "星期日"
        },
        "GRAY_LEVEL"                   : ["2级灰度", "4级灰度", "8级灰度", "16级灰度", "32级灰度", "64级灰度", "128级灰度", "256级灰度"],

        // 背景
        "BACKGROUND": {
            "0": "无背景",
            "1": "前景",
            "4": "背景",
        }
    };

    instance.setConfigData = (configs) => {
        if (configs) {
            instance.configs = configs;
            instance.configs.BACKGROUND = {
                "0": "无背景",
                "1": "前景",
                "4": "背景",
            };
            instance.configs.PROGRAM_ANIMATION["left"] = "连续左移";
        }
    };

    this.adGroups = []; //广告数组，备用
    this.ledGroups = [];
    this.backgroundDatas = {img: [], ani: []}; //背景图片数据
    this.editingAdPro = {}; //编辑中广告pro
    this.editingAdData = {}; //编辑中广告data

    // 一下4个是临时传递数据，注意：如果数据传递并消费后，一定要置空空！！
    this.tmpAdData = null;
    this.tmpAdGroupData = null;
    this.tmpLedData = null;
    this.tmpLedGroupData = null;

    // Last led and pc Params
    this.lastLedParam = null;
    this.lastAdParam = null;

    this.localMode = LoginType.Remote;

    // Datas------------------- end


    // Functions------------------- start

    // Functions------------------- end


};
const DataCenter = new DataCenterSingleton();
export default DataCenter;
