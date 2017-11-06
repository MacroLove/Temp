import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar, InteractionManager
} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    TeaNavigator,
    Popover,
    Overlay,
    Toast
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_BUTTON_CYON, COLOR_NAV_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import DataCenter from '../../../models/DataCenter';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import {AdType_Time, AdType_TimeCountDown, TimeFormats, WeatherFormats} from "../../../constants/Defines";
import BaseEditPage from "./BaseEditPage";
import PopCountDown from "../xyz/PopCountDown";

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
var collection_ = require("lodash/collection");
var moment_ = require('moment');

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * 时钟
 * */
class EditTimePage extends BaseEditPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "时间",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        var info = DataCenter.editingAdData[0].info_pos;
        var itemData = DataCenter.editingAdData[0].list_item[0];
        this.state = {
            itemData:itemData,
            program_id: DataCenter.editingAdPro.program_id,
            strPro: info.w +"x"+ info.h +"  "
            + DataCenter.configs.PROGRAM_TYPE_COLOR[DataCenter.editingAdPro.type_color] + "  "
            + DataCenter.configs.GRAY_LEVEL[DataCenter.editingAdPro.gray],

            strFont:DataCenter.configs.PROGRAM_FONT[itemData.font],
            strSize:itemData.fontSize,
            strAnim:DataCenter.configs.PROGRAM_ANIMATION[itemData.animationway],
            strSpeed:itemData.speed,
            strColor:DataCenter.configs.PROGRAM_FONT_COLOR[itemData.color],
            strDelay:itemData.remaintime,
            strAlign:DataCenter.configs.PROGRAM_FONT_ALIGN[itemData.alignHorizontal],
            strBorder:DataCenter.configs.PROGRAM_BORDER[itemData.bordercolor],
            //strBg:'',
            strVertical:itemData.vertical,
            strValue:itemData.value,

            selectFormat:0,
        };

        // Init format
        this.state.selectFormat = this._initTimeFormatIndex(itemData.format+"", props);
    }

    _initTimeFormatIndex = (str, props)=>{
        if (props.type == AdType_TimeCountDown) {
            return 3;
        }
        let f = 0;
        if (!collection_.includes(str, "YYYY") && collection_.includes(str, "hh")) {
            f = 2;
        }else if (collection_.includes(str, "YYYY") && !collection_.includes(str, "hh")) {
            f = 1;
        }else{
            f = 0;
        }
        this.state.itemData.format = TimeFormats[f]; //For initial unknown format value.
        return f;
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderNavigationRightView() {
        if (this.props.fromFenqu) return null;
        return <NavigationBar.LinkButton
            title={'取消'}
            onPress={() => this.navigator.pop()}
        />
    }

    renderNavigationBar() {
        return (
            <NavigationBar
                style={{backgroundColor:'#12b7f5'}}
                title={this.renderNavigationTitle()}
                leftView={this.renderNavigationLeftView()}
                rightView={this.renderNavigationRightView()}
                statusBarColor="#12b7f5"
            />
        );
    }

    renderPage() {
        return (
            <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
            <ScrollView style={{flex: 1, backgroundColor:'#f2f2f2'}}>
                <Image style={{width:ScreenWidth, height:70}} resizeMode='stretch' source={require('../../../assets/newads/new/pixel_black_top.png')}/>

                {
                    this.props.fromFenqu ? null :
                        <ListRow style={[styles.cellContainer]}
                                 title="广告参数：" titleStyle={{color: 'black', fontSize: 16, fontWeight: 'bold'}}
                                 detail={this.state.strPro}
                                 detailStyle={styles.editPcCellDetailStyle} bottomSeparator="full" topSeparator="full"
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 onPress={() => {
                                     this._onPressConfig()
                                 }}
                        />
                }
                <View style={{width:ScreenWidth, height:210, backgroundColor:'#f5f5f5', paddingTop:20, paddingBottom:20, paddingRight:10, paddingLeft:10}}>
                    <View style={{borderColor:'#aaa', borderWidth:0.7, borderRadius:4, flex:1, paddingTop:10}}>
                        <IonIcon.Button name={this.state.selectFormat == 0 ? "ios-radio-button-on" : "ios-radio-button-off"} color="#aaa" size={15} backgroundColor="#0000"
                                        onPress={()=>{
                                            this._onSelectFormat(0);
                                        }}>年月日/时分秒</IonIcon.Button>
                        <IonIcon.Button name={this.state.selectFormat == 1 ? "ios-radio-button-on" : "ios-radio-button-off"} color="#aaa" size={15} backgroundColor="#0000"
                                        onPress={()=>{
                                            this._onSelectFormat(1);
                                        }}>年月日</IonIcon.Button>
                        <IonIcon.Button name={this.state.selectFormat == 2 ? "ios-radio-button-on" : "ios-radio-button-off"} color="#aaa" size={15} backgroundColor="#0000"
                                        onPress={()=>{
                                            this._onSelectFormat(2);
                                        }}>时分秒</IonIcon.Button>
                        <IonIcon.Button name={this.state.selectFormat == 3 ? "ios-radio-button-on" : "ios-radio-button-off"} color="#aaa" size={15} backgroundColor="#0000"
                                        onPress={()=>{
                                            this._onSelectFormat(3);
                                        }}><Text style={{backgroundColor:COLOR_BUTTON_CYON, color:"#fff", borderRadius:4, height:34, padding:5}}>倒计时模式</Text></IonIcon.Button>
                    </View>
                    <Image
                        source={require('../../../assets/newads/new/ic_e_format_time.png')}
                        style={{width:85, height:27, position:'absolute', left:9, top:7}}
                    />
                </View>

                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_wzdx.png')}/>}
                         detail={this.state.strSize} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditSize((txt)=>{
                                 this.state.itemData.fontSize = txt;
                                 this.state.strSize = txt;
                                 this.forceUpdate();
                             }, "time");
                         }}
                />
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_ys.png')}/>}
                         detail={this.state.strColor} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditFontColor((txt)=>{
                                 let k = dic_.findKey(DataCenter.configs.PROGRAM_FONT_COLOR, function (t) {
                                     return t == txt;
                                 });
                                 this.state.itemData.color = k;
                                 this.state.strColor = txt+"";
                                 this.forceUpdate();
                             });
                         }}
                />
                {
                    // 时间没有动画方式，默认立即显示
                    1 == 1 ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_dhfs.png')}/>}
                                 detail={this.state.strAnim} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     PopAlert.popEditDonghua((txt, conti)=>{
                                         this.state.strAnim = txt;
                                         if (txt == "镭射") txt = "向右镭射";
                                         if (conti) {
                                             PopAlert.popEditJianGe("", (val)=>{
                                                 this.state.itemData.animationway = 'left';
                                                 this.state.itemData.continue = 1;
                                                 if (conti) { //字幕 动画方式为 连续左移时 对齐方式为水屏居左 垂直居中对齐
                                                     this.state.itemData.alignHorizontal = 'left';
                                                     this.state.itemData.align_vertical = 'center';
                                                 }
                                                 this.state.itemData.size_interval = parseInt(val);
                                                 this.forceUpdate();
                                             });
                                         }else {
                                             let k = dic_.findKey(DataCenter.configs.PROGRAM_ANIMATION, function (t) {
                                                 return t == txt;
                                             });
                                             this.state.itemData.animationway = k;
                                             this.state.itemData.continue = 0;
                                             this.state.itemData.size_interval = 0;
                                             this.forceUpdate();
                                         }
                                     });
                                 }}
                        />
                }
                {
                    //连续左移没有停留时间
                    this.state.itemData.animationway == 'left' ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg}
                                              source={require('../../../assets/newads/new/ic_e_tlsj.png')}/>}
                                 detail={this.state.strDelay} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={() => {
                                     if (this.state.itemData.remaintime == 0) this.state.itemData.remaintime = 3;
                                     PopAlert.popEditTimeStay(this.state.itemData.remaintime,
                                         (txt) => {
                                             this.state.itemData.remaintime = txt;
                                             this.state.strDelay = txt + "";
                                             this.forceUpdate();
                                         });
                                 }}
                        />
                }
                {
                    //立即显示没有移动速度
                    this.state.itemData.animationway == 1 ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_ydsd.png')}/>}
                                 detail={this.state.strSpeed} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     if (this.state.itemData.speed == 0) this.state.itemData.speed = 10;
                                     PopAlert.popEditSlider("当前移动速度：", 15, 1, '15（快）', '1（慢）', this.state.itemData.speed,
                                         (txt)=>{
                                             this.state.itemData.speed = txt;
                                             this.state.strSpeed = txt+"";
                                             this.forceUpdate();
                                         });
                                 }}
                        />
                }
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_hrbk.png')}/>}
                         detail={this.state.strBorder} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditHuanRao((txt)=>{
                                 let k = dic_.findKey(DataCenter.configs.PROGRAM_BORDER, function (t) {
                                     return t == txt;
                                 });
                                 this.state.itemData.bordercolor = k;
                                 this.state.strBorder = txt+"";
                                 this.forceUpdate();
                             });
                         }}
                />
            </ScrollView>

                {
                    //this.props.fromFenqu ? null :
                        this._makeViewSaveAndSend()
                }
            </View>
        );
    }

    _onSelectFormat = (t) => {
        this.setState({selectFormat: t});
        if (t < 3) {
            this.state.itemData.format = TimeFormats[t];
            this.state.itemData.timing = 0;
            this.state.itemData.type = AdType_Time;
            DataCenter.editingAdPro.extend = {addtype:AdType_Time};
        }else {
            this.state.itemData.timing = 1;
            this.state.itemData.type = AdType_TimeCountDown;
            DataCenter.editingAdPro.extend = {addtype:AdType_TimeCountDown};
            this._showCoutDownPop();
        }
    }

    _showCoutDownPop = ()=>{
        if (!this.state.itemData.tg_date) {
            let d = moment_().format("YYYY-MM-DD");
            this.state.itemData.tg_date = d;
            this.state.itemData.value = "距离{T} 还有{N}天"
        }

        let thiz = this;
        PopCountDown.show({date:this.state.itemData.tg_date, value:this.state.itemData.value},
        (date, value) => {
            if (value.length <= 0) {
                thiz.state.itemData.value = "距离{T} 还有{N}天"
            }else{
                thiz.state.itemData.value = value;
            }
            thiz.state.itemData.tg_date = date;
        });
    };

    _onClickSave = (tf)=>{
        if (this.props.fromFenqu) {
            this.navigator.pop();
            return;
        }
        PopAlert.showLoadingView();
        let pa = {
            token: this.props.token,
            pro: DataCenter.editingAdPro,
            data: DataCenter.editingAdData,
            extend:{addtype:this.state.selectFormat == 3 ? AdType_TimeCountDown : AdType_Time}
        };
        if (!this.props.isNew) {
            pa.program_id = this.state.program_id;
        }
        this._onSaveAdData(pa, tf);
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        backgroundColor:'#fff',
        marginTop:10,
    },

    editPcCellImg:{
        width: 85,
        height: 30,
    },

    editPcCellDetailStyle: {
        color:'#888',
        fontSize:15,
        textAlign:'right',
        backgroundColor:'#0000',
        marginRight:10,
    },
});

module.exports = EditTimePage;