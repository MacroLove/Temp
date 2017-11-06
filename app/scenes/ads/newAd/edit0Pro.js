import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar,
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
    PullPicker,
    SegmentedView
} from 'teaset';
import { Col, Row, Grid } from "react-native-easy-grid";
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_NAV_BG} from "../../../constants/Colors";
import DataCenter from '../../../models/DataCenter';
import * as Modals from '../../../models/Models';
import EditTextPage from '../newAd/editTextPage';
import EditPicPage from '../newAd/editPicPage';
import EditTimePage from '../newAd/editTimePage';
import EditFenquPage from '../newAd/editFenquPage';
import EditWeatherPage from '../newAd/editWeatherPage';
import PopAlert from "../../../widgets/PopAlertView";
import WCheckBox from '../../../widgets/WCheckBox';
import ImageButton from '../../../widgets/ImageButton';
import * as Regx from '../../../Utils/Regx';
import Picker from 'react-native-picker';
import {kLastLedParam, kLastLedParam4Ad, kLastProgramParam} from "../../../constants/Defines";

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

export default class EditProPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "新建广告",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);

        let ds = this._createDateData();
        this.state = {
            groupData: props.groupData,
            program_id:0,
            dateList: ds,
        };

        console.log("isNewAdddddPro---",props.isNew);

        let thiz = this;
        if (props.isPopup) { // 是否是从上个页面jump回来的
            thiz._setupData(1, props);
        }else{
            if (!DataCenter.lastLedParam) {
                TGStorage.load({
                    key: kLastLedParam4Ad,
                    id: kLastLedParam4Ad
                }).then(ret => {
                    DataCenter.lastLedParam = ret;
                    thiz._setupAdData(props);
                }).catch(e => {
                    DataCenter.lastLedParam = null;
                    thiz._setupAdData(props);
                });
            }else{
                thiz._setupAdData(props);
            }
        }
    }

    // 初始化广告数据，尤其是编号。
    _setupAdData = (props)=>{
        let thiz = this;
        TGStorage.load({
            key: kLastProgramParam,
            id: kLastProgramParam
        }).then(ret => {
            let oldNo = parseInt(ret.program_no) + 1;
            DataCenter.lastAdParam = ret;
            thiz._setupData(oldNo, props);
            thiz.props.autoGoNew && thiz._onClickOk();
        }).catch(err => {
            DataCenter.lastAdParam = null;
            thiz._setupData(1, props);
            thiz.props.autoGoNew && thiz._onClickOk();
        });
    };

    _setupData = (oldNo, props)=>{
        if (props.isNew) {
            let infoData = Modals.make(Modals.AdInfoPos);
            DataCenter.editingAdPro = Modals.make(Modals.AdPro);

            if (DataCenter.lastAdParam) {
                Object.assign(DataCenter.editingAdPro, DataCenter.lastAdParam);
                delete DataCenter.editingAdPro.program_id; //remove old program id.
                infoData.w = DataCenter.editingAdPro.width;
                infoData.h = DataCenter.editingAdPro.height;
            }

            // 这些设置一定要在上面Object.assign后面，否则这些参数会被覆盖掉
            DataCenter.editingAdPro.program_group = props.groupData.id;
            // Inc program_no
            DataCenter.editingAdPro.program_no = oldNo > 95 ? 1 : oldNo;
            DataCenter.editingAdPro.program_name = "广告-" + DataCenter.editingAdPro.program_no;


            // 屏参包括:屏宽,屏高,屏彩,灰度
            if (DataCenter.lastLedParam) {
                infoData.w = DataCenter.editingAdPro.width = DataCenter.lastLedParam.width || DataCenter.lastLedParam.screen_width;
                infoData.h = DataCenter.editingAdPro.height = DataCenter.lastLedParam.height || DataCenter.lastLedParam.screen_height;
                DataCenter.editingAdPro.type_color = DataCenter.lastLedParam.color_value;
                DataCenter.editingAdPro.gray = DataCenter.lastLedParam.gray || 0;
            }

            switch (this.props.type) {
                case 'text':
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemZimu),
                        ]
                    }];
                    break;
                case 'autotxt':
                    DataCenter.editingAdPro.auto_adapt = 1;
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemZimu),
                        ]
                    }];

                    break;
                case 'image':
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemPic),
                        ]
                    }];
                    break;
                case 'time':
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemTime),
                        ]
                    }];
                    break;
                case 'weather':
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemWeather),
                        ]
                    }];
                    break;
                case 'fenqu':
                    DataCenter.editingAdData = [{
                        info_pos: infoData,
                        list_item:[
                            Modals.make(Modals.AdListItemZimu),
                        ],
                        isInit:true,
                    }];
                    break;
            }

            this.state.adData = DataCenter.editingAdData;

        }else{
            //loading data
            this.state.program_id = DataCenter.editingAdPro.program_id;
        }
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    _createDateData = ()=> {
        let date = [];
        for(let i=2017;i<2118;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        day.push(k+'日');
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29+'日');
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        day.push(k+'日');
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        day.push(k+'日');
                    }
                }
                let _month = {};
                _month[j+'月'] = day;
                month.push(_month);
            }
            let _date = {};
            _date[i+'年'] = month;
            date.push(_date);
        }
        return date;
    }

    _showDatePicker = (type) => {
        let t = type=='start' ? "起始日期" : '截止日期';
        Picker.init({
            pickerData: this.state.dateList,
            pickerTitleText:t,
            pickerCancelBtnText:'取消',
            pickerConfirmBtnText:'确定',
            pickerToolBarFontSize: 16,
            pickerFontSize: 16,
            pickerFontColor: [255, 0 ,0, 1],
            onPickerConfirm: (pickedValue, pickedIndex) => {
                let m = require('moment');
                let a = m(pickedValue.join(), 'YYYY-MM-DD').format('YYYY-MM-DD')+"";
                if (type == 'start')
                    DataCenter.editingAdPro.starttime = a;
                else
                    DataCenter.editingAdPro.endtime = a;
                this.forceUpdate();
            },
            onPickerCancel: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            },
            onPickerSelect: (pickedValue, pickedIndex) => {
                console.log('date', pickedValue, pickedIndex);
            }
        });
        Picker.show();
    }

    renderNavigationRightView() {
        if (this.props.isPopup)
            return null;
        return <NavigationBar.LinkButton
            title={'取消'}
            onPress={() => this.navigator.pop()}
        />
    }

    renderNavigationBar() {
        if (this.props.isPopup) {
            return (
                <NavigationBar
                    style={{backgroundColor:'#fff', borderBottomWidth:0.5, borderColor:"#eee"}}
                    title={<Text style={{color:"#333", fontSize:15}}>{this.props.title}</Text>}
                    leftView={<IonIcon.Button name="md-close" color="#ddd" size={24} backgroundColor="#0000" onPress={()=>{
                        this.props.onOK && this.props.onOK(0);
                    }} />}
                />
            );
        }
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

    makeInput(val, hint, type) {
        let mm = type == 'name' ? 10 : 100;
        let unedit = type == "no" && this.props.isNew; //this.props.isPopup == true && (type == "width" || type == "height");
        return (
            <Input
                ref={'txt'+type}
                style={{borderColor:'#0000', color:'#333', fontSize:14, flex:1}}
                defalutValue={val}
                value={val}
                placeholder={hint}
                maxLength = {mm}
                editable={unedit == false}
                onChangeText={(t)=>{
                    if (type == 'width') {
                        DataCenter.editingAdData[0].info_pos.w = t;
                        DataCenter.editingAdPro.width = t;
                    }else if(type == 'height') {
                        DataCenter.editingAdData[0].info_pos.h = t;
                        DataCenter.editingAdPro.height = t;
                    }else if(type == 'no') {
                        if (t.length > 0) {
                            let n = parseInt(t);
                            n = isNaN(n) ? 1 : (n > 95 ? 95 : n);
                            DataCenter.editingAdPro.program_no = n;
                        }else{
                            DataCenter.editingAdPro.program_no = "";
                        }
                    }else if(type == 'name') {
                        if (t.length > 10) {
                            t = t.substring(0, 10);
                        }
                        DataCenter.editingAdPro.program_name = t;
                    }
                    this.forceUpdate();
                }}
            />
        );
    }

    renderPage() {
        if (!DataCenter.editingAdPro || this.props.autoGoNew) {
            return null;
        }
        let topH = 160;
        let typeImg = require('../../../assets/newads/new/ic_type_txt.png');
        switch (this.props.type) {
            case 'text':
                break;
            case 'autotxt':
                typeImg = require('../../../assets/newads/new/ic_type_zimu.png');
                break;
            case 'image':
                typeImg = require('../../../assets/newads/new/ic_type_pic.png');
                break;
            case 'time':
                typeImg = require('../../../assets/newads/new/ic_type_time.png');
                break;
            case 'weather':
                typeImg = require('../../../assets/newads/new/ic_type_weather.png');
                break;
            case 'fenqu':
                typeImg = require('../../../assets/newads/new/ic_type_fenqu.png');
                break;
        }

        let svBg = this.props.isPopup ? "#fff" : '#f2f2f2';
        let styl = styles.styleForNormal;
        let imgBB = this.props.isPopup ? require('../../../assets/newads/new/bg_jiben.png') : require('../../../assets/newads/new/bg_jiben.png');
        return (
            <View style={{flex:1, backgroundColor:svBg}}>
                <ScrollView style={{flex: 1}} contentContainerStyle={{alignItems:'center'}}>
                    {
                        this.props.isPopup ? null :
                            <Image style={{position:'absolute', width:ScreenWidth, height:topH}} resizeMode='stretch' source={require('../../../assets/newads/new/bg_blue_top.png')}/>
                    }
                    {
                        this.props.isPopup ? null :
                            <Image style={{width:76, height:76, margin:10}} resizeMode="stretch" source={typeImg}/>
                    }
                    <View style={styl}>
                        <Image style={{flex:1, padding:12}} resizeMode="stretch" source={imgBB}>
                            {
                                this.props.isPopup ? null :
                                    <Text style={styles.editTitle}>节目设置</Text>
                            }
                            <ListRow topSeparator="full" icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_no.png')}/>}
                                     title="广告编号：" titleStyle={styles.editPcCellTitleStyle} detail={this.makeInput(DataCenter.editingAdPro.program_no+"", "1～95", 'no')}
                            />
                            <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_name.png')}/>}
                                     title="广告名称：" titleStyle={styles.editPcCellTitleStyle} detail={this.makeInput(DataCenter.editingAdPro.program_name+"", "输入名称", 'name')}
                            />
                            <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_group.png')}/>}
                                     title="广告分组：" titleStyle={styles.editPcCellTitleStyle} detail={this.state.groupData.title+""} detailStyle={styles.editPcCellDetailStyle}
                                     accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                         this._showGroupPiker();
                                     }}
                            />
                            {
                                this.props.type == 'autotxt' ? null :
                                    <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_width.png')}/>}
                                             title="屏体宽度：" titleStyle={styles.editPcCellTitleStyle}
                                             detail={this.makeInput(DataCenter.editingAdPro.width+"", "输入整数", 'width')}
                                             accessory={<Text>点</Text>}
                                    />
                            }
                            {
                                this.props.type == 'autotxt' ? null :
                                    <ListRow icon={
                                        <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_height.png')}/>}
                                             title="屏体高度：" titleStyle={styles.editPcCellTitleStyle}
                                             detail={this.makeInput(DataCenter.editingAdPro.height + "", "输入整数", 'height')}
                                             accessory={<Text>点</Text>}
                                    />
                            }
                            <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_color.png')}/>}
                                     title="屏彩：" titleStyle={styles.editPcCellTitleStyle} detail={DataCenter.configs.PROGRAM_TYPE_COLOR[DataCenter.editingAdPro.type_color]}
                                     detailStyle={styles.editPcCellDetailStyle} accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                         this._showColorPiker();
                                     }}
                            />
                            <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_huidu.png')}/>}
                                     title="灰度：" titleStyle={styles.editPcCellTitleStyle} detail={DataCenter.configs.GRAY_LEVEL[DataCenter.editingAdPro.gray]}
                                     detailStyle={styles.editPcCellDetailStyle} accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                         this._showGrayPiker();
                                     }}
                            />
                            <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_bg.png')}/>}
                                     title="背景：" titleStyle={styles.editPcCellTitleStyle} detail={DataCenter.configs.BACKGROUND[DataCenter.editingAdPro.type_bg]}
                                     detailStyle={styles.editPcCellDetailStyle} accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                         let sel = DataCenter.editingAdPro.bg_fit == 1 ? 0 : 1;
                                        PopAlert.popEditBackground(DataCenter.editingAdPro.type_bg+"", sel, (which, p)=>{
                                            if (which == 'none') {
                                                DataCenter.editingAdPro.type_bg = 0;
                                            }else if (which == 'img') {
                                                DataCenter.editingAdPro.type_bg = 4;
                                                DataCenter.editingAdPro.path_bg = p.path;
                                            }else if (which == 'imgS') {
                                                DataCenter.editingAdPro.bg_fit = p == 0 ? 1 : 2;
                                            }else if (which == 'ani') {
                                                DataCenter.editingAdPro.type_bg = 4;
                                                DataCenter.editingAdPro.path_bg = p.path;
                                            }else if (which == 'aniS') {
                                                DataCenter.editingAdPro.bg_fit = p == 0 ? 1 : 2;
                                            }else if (which == 'close') {
                                                this.forceUpdate();
                                            }
                                        });
                                     }}
                            />
                        </Image>
                    </View>
                    {
                        this._viewsForFenqu()
                    }
                </ScrollView>
                {
                    this.props.isPopup ?
                        <View style={{alignSelf:"stretch", height:44, flexDirection:'row', borderTopWidth:0.5,
                            borderColor:"#eee", alignItems:'flex-end', justifyContent:'space-around'}}>
                            <ImageButton
                                image={require('../../../assets/gaoji/btn_cancle.png')}
                                style={{borderWidth: 0}}
                                onPress={() => {
                                    this.props.onOK && this.props.onOK(0);
                                }}/>

                            <ImageButton
                                image={require('../../../assets/gaoji/btn_ok.png')}
                                style={{borderWidth: 0}}
                                onPress={() => {
                                    this._onClickOk()
                                }}/>
                        </View>
                        :
                        <Button
                            title="确定"
                            titleStyle={{color:'#fff', fontSize:16}}
                            style={{alignSelf:"stretch", height:44, marginTop:2, borderRadius:0, backgroundColor:COLOR_NAV_BG}}
                            onPress={()=>{
                                this._onClickOk()
                            }}
                        />
                }
            </View>
        );
    }

    _viewsForFenqu = ()=>{
        let ppPad = this.props.isPopup ? 20 : 0;
        return (
            <View style={{width:ScreenWidth, paddingLeft:ppPad, paddingRight:ppPad}}>
                <ListRow title="广告类型：" titleStyle={styles.editPcCellTitleStyle}
                         detail={DataCenter.configs.PROGRAM_TYPE[DataCenter.editingAdPro.program_type]}
                         detailStyle={styles.editPcCellDetailStyle} accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                         onPress={()=>{
                             this._showAdTypePicker();
                         }}
                />
                <View style={{width:ScreenWidth-40 - ppPad*2, height:100,marginLeft:20, marginRight:20, marginTop:10, marginBottom:10, borderRadius:6, backgroundColor:'#fff'}}>
                    <SegmentedView style={{flex: 1, borderRadius:6}} type='projector'
                                   activeIndex={(DataCenter.editingAdPro.play_model == "model_fixed_time") ? 1 : 0}
                                   onChange={(i)=>{
                                       console.log("CNM 不知道为什编辑完就走了一遍这个函数！！！！")
                                       if (i == 0) {
                                           DataCenter.editingAdPro.play_model = 'play_loop';
                                           this.forceUpdate();
                                       } else if (i == 1) {
                                           DataCenter.editingAdPro.play_model = 'model_fixed_time';
                                           this.forceUpdate();
                                       }
                                   }}>
                        <SegmentedView.Sheet title='循环播放'>
                            <View style={{flex: 1, flexDirection:'row', alignItems: 'center', justifyContent: 'center', borderTopWidth:0.7, borderColor:'#aaa', paddingLeft:20,paddingRight:20}}>
                                <Input style={{borderColor:'#0000', flex:1}}
                                       maxLength={3}
                                       placeholder="输入循环次数（1～999）"
                                       defaultValue={DataCenter.editingAdPro.count_play+""}
                                       onChangeText={(v)=>DataCenter.editingAdPro.count_play = v}/>
                                <Text>次</Text>
                            </View>
                        </SegmentedView.Sheet>
                        <SegmentedView.Sheet title='定时播放'>
                            <View style={{flex: 1, flexDirection:'row', alignItems: 'center', justifyContent: 'center', borderTopWidth:0.7, borderColor:'#aaa', paddingLeft:20,paddingRight:20}}>
                                <Input style={{borderColor:'#0000', flex:1}}
                                       placeholder="输入定时时长（1～9999）"
                                       maxLength={4}
                                       defaultValue={DataCenter.editingAdPro.model_fixed_time+""}
                                       onChangeText={(v)=>DataCenter.editingAdPro.model_fixed_time = v}/>
                                <Text>秒</Text>
                            </View>
                        </SegmentedView.Sheet>
                    </SegmentedView>
                </View>

                <ListRow title="播放时间控制：" titleStyle={styles.editPcCellTitleStyle}
                         detail={DataCenter.editingAdPro.ignore_time_control == "0" ? "开启" : "关闭"}
                         detailStyle={styles.editPcCellDetailStyle}
                         accessory={
                             <Switch
                                 onTintColor={COLOR_NAV_BG}
                                 tintColor="#aaa"
                                 thumbTintColor="#eee"
                                 value={DataCenter.editingAdPro.ignore_time_control == "0"}
                                 onValueChange={(toggle)=>{
                                     DataCenter.editingAdPro.ignore_time_control = toggle ? "0" : "1";
                                     this.forceUpdate();
                                 }}
                             />
                         }
                         bottomSeparator="full"
                         topSeparator="full"
                />

                {
                    DataCenter.editingAdPro.ignore_time_control == "0" ?
                        <ListRow title="播放时间：" titleStyle={styles.editPcCellTitleStyle}
                                 detail={this._genWeekStr()} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000"/>}
                                 onPress={() => {
                                     this._showWeekPicker();
                                 }}
                        />
                        : null
                }
                {
                    DataCenter.editingAdPro.ignore_time_control == "0" ?
                        <View style={{
                            width: ScreenWidth - ppPad*2,
                            height: 100,
                            flexDirection: 'row',
                            alignItems: 'center',
                            backgroundColor: '#fff'
                        }}>
                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                              onPress={() => this._showDatePicker('start')}>
                                <Text>起始日期</Text>
                                <Text style={{fontWeight: 'bold', fontSize: 14}}>
                                    {'' + DataCenter.editingAdPro.starttime}
                                    <Image source={require('../../../assets/arrow_down_red.png')}/>
                                </Text>
                            </TouchableOpacity>
                            <View style={{width: 1, height: 50, backgroundColor: '#aaa'}}/>
                            <TouchableOpacity style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
                                              onPress={() => this._showDatePicker('end')}>
                                <Text>截止日期</Text>
                                <Text style={{
                                    fontWeight: 'bold',
                                    fontSize: 14
                                }}>{'' + DataCenter.editingAdPro.endtime}
                                <Image source={require('../../../assets/arrow_down_red.png')}/>
                                </Text>
                            </TouchableOpacity>
                        </View>
                        : null
                }
            </View>
        );
    }

    _genWeekStr = ()=>{
        let MAP_W = {1:'星期一', 2:'星期二', 3:'星期三', 4:'星期四', 5:'星期五', 6:'星期六', 7:'星期日'};
        var str = "";
        DataCenter.editingAdPro.week && DataCenter.editingAdPro.week.forEach(function (w) {
            str += MAP_W[w]+"、";
        });
        return str;
    }

    _showWeekPicker = ()=>{
        if (this.overlayPullView) {
            Overlay.show(this.overlayPullView);
            return;
        }
        let c1 = false, c2 = false, c3 = false, c4 = false, c5 = false, c6 = false, c7 = false;
        DataCenter.editingAdPro.week.forEach(function (p) {
            if (p == 1) c1 = true;if (p == 4) c4 = true;if (p == 6) c6 = true;
            if (p == 2) c2 = true;if (p == 5) c5 = true;if (p == 7) c7 = true;
            if (p == 3) c3 = true;
        })
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.overlayPullView = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', minHeight:200}}>
                    <ImageButton image={require('../../../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.overlayPullView.close();
                                     this.overlayPullView = null;
                                     this.forceUpdate();
                                 }}/>
                    <Grid style={{backgroundColor:'#f5f5f5', height:180, width:ScreenWidth, padding:20}}>
                        <Col>
                            <Row><WCheckBox title="星期一" checked={c1} onPress={(tag, ch)=>this._onCheckWeek(1, ch)}/></Row>
                            <Row><WCheckBox title="星期四" checked={c4} onPress={(tag, ch)=>this._onCheckWeek(4, ch)}/></Row>
                            <Row><WCheckBox title="星期日" checked={c7} onPress={(tag, ch)=>this._onCheckWeek(7, ch)}/></Row>
                        </Col>
                        <Col>
                            <Row><WCheckBox title="星期二" checked={c2} onPress={(tag, ch)=>this._onCheckWeek(2, ch)}/></Row>
                            <Row><WCheckBox title="星期五" checked={c5} onPress={(tag, ch)=>this._onCheckWeek(5, ch)}/></Row>
                            <Row></Row>
                        </Col>
                        <Col>
                            <Row><WCheckBox title="星期三" checked={c3} onPress={(tag, ch)=>this._onCheckWeek(3, ch)}/></Row>
                            <Row><WCheckBox title="星期六" checked={c6} onPress={(tag, ch)=>this._onCheckWeek(6, ch)}/></Row>
                            <Row></Row>
                        </Col>
                    </Grid>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    _onCheckWeek = (w, c)=>{
        if (c) {
            DataCenter.editingAdPro.week = array_.unionWith(DataCenter.editingAdPro.week, [w], (v1, v2)=>{return v1 == v2;});
        }else{
            array_.remove(DataCenter.editingAdPro.week, (e)=>{return e == w});
        }
    }

    _showAdTypePicker = ()=>{
        PopAlert.popEditAdType((t)=>{
            DataCenter.editingAdPro.program_type = t;
            this.forceUpdate();
        });
    }

    _showGroupPiker = ()=>{
        let items = [];
        let sel = this.state.groupData.id;
        DataCenter.adGroups.map(function (o, i) {
            items.push(o.title);
            if (o.id == sel) sel = i;
        })
        PullPicker.show(
            '选择广告分组',
            items,
            sel,
            (item, index) => {
                DataCenter.editingAdPro.program_group = DataCenter.adGroups[index].id;
                this.setState({groupData:DataCenter.adGroups[index]});
            }
        );
    }
    _showColorPiker = ()=>{
        let items = dic_.values(DataCenter.configs.PROGRAM_TYPE_COLOR);
        let sel = 0;
        PullPicker.show(
            '选择屏幕色彩',
            items,
            sel,
            (item, index) => {
                DataCenter.editingAdPro.type_color = dic_.findKey(DataCenter.configs.PROGRAM_TYPE_COLOR, function (s) {
                    return s == item;
                });
                this.forceUpdate();
            }
        );
    }
    _showGrayPiker = ()=>{
        let items = DataCenter.configs.GRAY_LEVEL;
        let sel = DataCenter.editingAdPro.gray;
        PullPicker.show(
            '选择灰度级别',
            items,
            sel,
            (item, index) => {
                DataCenter.editingAdPro.gray = index;
                this.forceUpdate();
            }
        );
    }

    _onClickOk = ()=>{
        if (DataCenter.editingAdPro.program_name.length == 0 || (DataCenter.editingAdPro.program_no+"").length == 0
            || (DataCenter.editingAdPro.width+"").length == 0 || (DataCenter.editingAdPro.width+"").length == 0) {
            PopAlert.showAlertView("提示", "请输入有效值！");
            return;
        }else{
            if (!Regx.isDigit(DataCenter.editingAdPro.program_no) || !Regx.isBetween(DataCenter.editingAdPro.program_no, 1, 95)) {
                PopAlert.showAlertView("提示", "广告编号必须是1～95的数字！");
                return;
            }
        }
        if (this.props.isPopup) { //点击确定时，如果时popup，则关闭popup
            this.props.onOK && this.props.onOK(1);
            return;
        }
        let nav = this.props.autoGoNew || this.navigator;
        switch (this.props.type) {
            case 'text':
                nav.push({view: <EditTextPage isNewTxt={this.props.autoGoNew} fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                return;
            case 'autotxt':
                nav.push({view: <EditTextPage isNewTxt={this.props.autoGoNew} fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                break;
            case 'image':
                nav.push({view: <EditPicPage fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                break;
            case 'time':
                nav.push({view: <EditTimePage fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                break;
            case 'weather':
                nav.push({view: <EditWeatherPage fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                break;
            case 'fenqu':
                nav.push({view: <EditFenquPage fromPro={true} actions={this.props.actions} type={this.props.type} groupData={this.state.groupData} token={this.props.token}/>});
                break;
        }
    }
}

const styles = StyleSheet.create({

    editTitle: {
        color:'#666', fontSize:16, fontWeight:'bold',
        marginBottom:10, alignSelf:'center'
    },

    editPcCellImg:{
        width: 15,
        height: 15,
    },

    editPcCellTitleStyle: {
        color:'#aaa',
        fontSize:15,
        marginLeft:4,
    },

    editPcCellDetailStyle: {
        color:'#888',
        fontSize:15,
        textAlign:'left',
        backgroundColor:'#0000'
    },

    styleForPopup: {
        flex:1
    },
    styleForNormal: {
        width:ScreenWidth, height:480, padding: 10, paddingLeft:20, paddingRight:20,
        alignItems: 'center', borderColor:'#ddd', borderBottomWidth:1
    }
});

//module.exports = EditProPage;