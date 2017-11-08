import React from 'react';
import {
    Dimensions,
    Image,
    Keyboard,
    RefreshControl,
    ScrollView,
    SectionList,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Platform,
    InteractionManager,
    PanResponder
} from "react-native";
import {Button, Input, ListRow, NavigationPage, Overlay, TeaNavigator,
    Toast, Menu} from 'teaset';
import {Col, Grid, Row} from "react-native-easy-grid";
import IconBadge from 'react-native-icon-badge';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import EtIcon from 'react-native-vector-icons/Entypo';
import {
    COLOR_BUTTON_CYON, COLOR_DOT_OFFLINE, COLOR_DOT_ONLINE, COLOR_NAV_BG,
    COLOR_VIEW_BG
} from "../../constants/Colors";
import SearchInput from "../../widgets/SearchInput/SearchInput";
import {VIEW_ADD_LED_SCREEN, VIEW_LED_MAP} from "../../constants/ViewKeys";
import CheckBox from '../../widgets/CheckBox';
import PopAlert from '../../widgets/PopAlertView';
import EditMorePage from './led/editMorePage';
import ImageButton from '../../widgets/ImageButton';
import LedMapPage from './ledMap';
import PTRListView, {RefreshState} from '../../widgets/PTRListView';
import ExpanableList from '../../widgets/ExpanableList';

import {Utils, GPSUtils} from '../../Utils/Utils';
import HttpApi from "../../network/HttpApi";
import * as Apis from '../../actions/apis';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";
import DataCenter from '../../models/DataCenter';

import EditProPage from './newAd/edit0Pro';
import EditTextPage from './newAd/editTextPage';
import EditPicPage from './newAd/editPicPage';
import EditTimePage from './newAd/editTimePage';
import EditFenquPage from './newAd/editFenquPage';
import EditWeatherPage from './newAd/editWeatherPage';

import {
    AdType_Area, AdType_AutoText, AdType_Image, AdType_Text, AdType_Time, AdType_TimeCountDown,
    AdType_Weather, kLastLedParam, kLastLedParam4Ad, kLastProgramParam, LoginType
} from "../../constants/Defines";
import PopEditAdsGroup from "./xyz/PopEditAdsGroup";
import PopAdSendIn from "./xyz/PopAdSendIn";
import YsWebSocket from "../../network/YsWebSocket";
import WifiLedSettings from "./led/wifiLedSettings";

var array_ = require('lodash/array');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * Led list item
 * */
let ImgLed = require('../../assets/ic_his_led.png');
let ImgAd = require('../../assets/ic_his_cellIcon.png');
let COLOR_5_ONLINE = '#ff7534';
let COLOR_OFFLINE = '#cccccc';
let COLOR_4_ONLINE = '#00bdbf';

var gSelectGroup = {'led':[], 'ad':[]};
var gSelectItem = {'led':[], 'ad':[]};
var gCancelSelect = {'led':[], 'ad':[]};
var gTmpLedGroupDic = {}; //临时存储每个id对应的count， 方便计算。
var gTmpLedItemDic = {};
var gTmpAdGroupDic = {};
var gTmpAdItemDic = {};

class MyLedListItem extends React.PureComponent {
    _onPressButton = (which) => {
        this.props.onPressButton(which, this.props.item);
    };

    _onChangeCheckbox = (checked) => {
        this.props.onCheckBoxPressed && this.props.onCheckBoxPressed(this.props.isLed, this.props.item, checked);
    }

    render() {
        let ic = this.props.isLed ? ImgLed : ImgAd;
        if (!this.props.isLed) {
            let at = this.props.item.extend.addtype;
            if (at == AdType_Area) {
                ic = require('../../assets/ads/ad_listitem_fenqu.png');
            }else if (at == AdType_AutoText) {
                ic = require('../../assets/ads/ad_listitem_auto.png');
            }else if (at == AdType_Text) {
                ic = require('../../assets/ads/ad_listitem_wenzi.png');
            }else if (at == AdType_Image) {
                ic = require('../../assets/ads/ad_listitem_tupian.png');
            }else if (at == AdType_Weather) {
                ic = require('../../assets/ads/ad_listitem_tianqi.png');
            }else if (at == AdType_Time || at == AdType_TimeCountDown) {
                ic = require('../../assets/ads/ad_listitem_time.png');
            }
        }
        let color_b = this.props.isLed ? (this.props.item.status == 1 ? (this.props.item.server_version == 4 ? COLOR_4_ONLINE : COLOR_5_ONLINE) : COLOR_OFFLINE) : '#0000';
        let zhVer = this.props.item.server_version == 4 ? "四" : "五";
        return (
            <View style={[styles.cellItem, this.props.style]} key={""+this.props.key}>
                <View style={styles.cellMiddle}>
                    {
                        this.props.hiddenCheck ? null :
                            <CheckBox color={COLOR_NAV_BG} size={25} checked={this.props.isChecked} onCheckBoxPressed={(c) => {
                                this._onChangeCheckbox(c);
                            }}/>
                    }
                    <IconBadge
                        MainElement={
                            <Image style={{margin: 8, marginLeft:0, resizeMode: 'contain'}}
                                   source={ic}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#fff', fontSize: 10}}>{this.props.isLed ? zhVer : ""}</Text>
                        }

                        IconBadgeStyle={
                            {
                                minWidth       : 16,
                                width          : 16,
                                height         : 16,
                                borderRadius   : 8,
                                backgroundColor: color_b
                            }
                        }
                    />
                    <View style={{flex: 1, marginLeft: 4}}/>
                    {
                        this.props.isLed ?

                            <View style={{flex: 1, left:94, top:8, position:'absolute'}}>
                                <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000', maxWidth:160}} numberOfLines={1}>
                                    {'名称:' + this.props.item.title}
                                </Text>
                                <View style={{flexDirection:"row", alignSelf:"stretch",width:ScreenWidth-90-20-18-10, justifyContent:"space-between", alignItems:"center"}}>
                                    <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000'}} numberOfLines={1}>
                                        {'ID:' + this.props.item.device}
                                    </Text>
                                    <Text style={{color: 'gray', fontSize: 12}}>
                                        {this.props.item.last_time + ''}
                                    </Text>
                                </View>
                                <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000'}} numberOfLines={1}>
                                    {'宽高:' + this.props.item.screen_width + 'x' + this.props.item.screen_height +" "+ DataCenter.configs.PROGRAM_TYPE_COLOR[this.props.item.color_value]}
                                </Text>
                            </View>
                            :
                            <View style={{flex: 1, left:90, top:8, position:'absolute'}}>
                                <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000', maxWidth:180}} numberOfLines={1}>
                                    {'名称:' + this.props.item.program_name}
                                </Text>
                                <View style={{flexDirection:"row", alignSelf:"stretch",width:ScreenWidth-90-20-14-10, justifyContent:"space-between", alignItems:"center"}}>
                                    <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000'}} numberOfLines={1}>
                                        {'编号:' + this.props.item.program_no}
                                    </Text>
                                    <Text style={{color: 'gray', fontSize: 13}}>
                                        {this.props.item.etime + ''}
                                    </Text>
                                </View>
                                <Text style={{color: 'gray', fontSize: 13, backgroundColor:'#0000'}} numberOfLines={1}>
                                    {'宽高:' + this.props.item.width + 'x' + this.props.item.height +" "+ DataCenter.configs.PROGRAM_TYPE_COLOR[this.props.item.type_color]}
                                </Text>
                            </View>
                    }
                    <View>
                        <View style={{
                            flexDirection  : 'row',
                            height         : 20,
                            alignItems     : 'center',
                            justifyContent : 'flex-end',
                            backgroundColor: '#0000'
                        }}>
                            {
                                this.props.isLed ?
                                    <View style={{
                                        width: 14,
                                        height: 14,
                                        borderRadius: 7,
                                        backgroundColor: this.props.item.status == 1 ? COLOR_DOT_ONLINE : COLOR_DOT_OFFLINE
                                    }}/>
                                    :
                                    null
                            }
                            {
                                this.props.isLed ?
                                    <Text style={{
                                        color: this.props.item.status == 1 ? COLOR_DOT_ONLINE : COLOR_DOT_OFFLINE,
                                        fontSize: 14,
                                        marginLeft: 4
                                    }}>
                                        {this.props.item.status == 1 ? '在线' : '离线'}
                                    </Text>
                                    :
                                    null
                            }
                        </View>
                    </View>
                </View>
                {
                    this.props.isLed ? (
                        <View style={styles.cellBottom}>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems   : 'center'
                            }} onPress={() => this._onPressButton('pc')}>
                                <Image source={require('../../assets/ic_ad.png')}/>
                                <Text style={{fontSize: 15, color: '#13b7f6', marginLeft: 5}}>广告</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems   : 'center',
                                marginLeft   : 10
                            }} onPress={() => this._onPressButton('gj')}>
                                <Image source={require('../../assets/ic_gaoji.png')}/>
                                <Text style={{fontSize: 15, color: '#ff7e00', marginLeft: 12}}>高级</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.cellBottom}>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems   : 'center'
                            }} onPress={() => this._onPressButton('bj')}>
                                <Image source={require('../../assets/ic_bianji.png')}/>
                                <Text style={{fontSize: 15, color: '#13b7f6', marginLeft: 5}}>编辑</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems   : 'center',
                                marginLeft   : 10
                            }} onPress={() => this._onPressButton('sc')}>
                                <Image source={require('../../assets/ic_shanchu.png')}/>
                                <Text style={{fontSize: 15, color: '#ff7e00', marginLeft: 12}}>删除</Text>
                            </TouchableOpacity>
                        </View>
                    )
                }
            </View>
        )
    }
}

/**
 * Search page
 * */

class SearchPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "搜索",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            searchKey: '',
            selectType:'',
            datas:[],
            refreshState:RefreshState.Idle,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderNavigationLeftView() {return null;}
    renderNavigationRightView() {return null;}

    renderNavigationTitle() {
        return (
            <View style={{
                width            : ScreenWidth,
                height           : 70,
                padding          : 10,
                flexDirection    : 'row',
                alignItems       : 'center',
                borderColor      : '#fff',
                borderBottomWidth: 1
            }}>
                <SearchInput
                    placeholder="LED屏、广告名称"
                    value={this.state.searchKey}
                    onChangeText={(t) => this.setState({searchKey: t.trim()})}
                    style={{flex: 1, marginRight: 10, borderRadius: 20, borderColor:'#fff'}}
                />
                <Button
                    title="取消"
                    style={{backgroundColor: '#39ceff', borderColor: '#0000', width: 60, height: 30}}
                    titleStyle={{color: 'white', fontSize: 14}}
                    onPress={() => {
                        Keyboard.dismiss();
                        this.navigator.pop();
                    }}
                />
            </View>
        );
    }

    renderPage() {
        return (
            <View style={{flex: 1, backgroundColor: '#fff'}}>
                {
                    this.state.searchKey.length == 0 ? null :
                        <View style={{width:ScreenWidth, height:88}}>
                            <ListRow title={this.state.searchKey} detail="搜LED屏" accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                        this._onClickSearch('led');
                                     }}/>
                            <ListRow title={this.state.searchKey} detail="搜广告" accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888" backgroundColor="#0000" />}
                                     onPress={()=>{
                                         this._onClickSearch('ads');
                                     }}/>
                        </View>
                }

                <PTRListView
                    style={{flex: 1, backgroundColor: COLOR_VIEW_BG}}
                    data={this.state.datas}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
                {
                    this.state.datas.length > 0 ?
                        <ImageButton
                            style={{position:'absolute', right:1, bottom:1}}
                            image={require('../../assets/ic_btn_send.png')}
                            onPress={
                                ()=>{
                                    this.props.onClickSendAds && this.props.onClickSendAds();
                                    this.navigator.pop();
                                }
                            }
                        />
                        :
                        null
                }
            </View>
        );
    }

    _renderItem = ({item}) => {
        let checked = false;
        if (this.state.selectType == 'led')
            checked = gSelectItem.led.indexOf(item.device) != -1 || gSelectGroup.led.indexOf(item.gid) != -1;
        else
            checked = gSelectItem.ad.indexOf(item.program_id) != -1 || gSelectGroup.ad.indexOf(item.program_group) != -1;
        item.isChecked = checked;
        return (
            <MyLedListItem
                item={item}
                isChecked={checked}
                isLed={this.state.selectType == 'led'}
                onPressButton={this._onPressItemButtons}
                onCheckBoxPressed={this._onChangeCheckboxChild}
            />
        );
    }

    _onChangeCheckboxChild = (isLed, item, checked) => {
        item.isChecked = checked;
        this.props.onCheckItems && this.props.onCheckItems(isLed, item, checked);
    }

    _onClickSearch = (type) => {
        Keyboard.dismiss();
        if (this.state.selectType != type) {
            this.state.selectType = type;
            this.loadData(1);
        }
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.loadData(1);
    }

    onFooterRefresh = () => {
        if (this.state.refreshState == RefreshState.NoMoreData)
            return;
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.loadData(this.state.page+1);
    }

    loadData = (page) => {
        if (this.state.searchKey.trim().length == 0) {
            this.setState({
                refreshState: RefreshState.Idle
            });
            return;
        }
        var thiz = this;
        var params = {token:this.props.userInfo.token, p:page};
        if (page <= 1) {
            thiz.state.datas = [];
            PopAlert.showLoadingView();
        }
        if (this.state.selectType == 'led') {
            params.keysword = this.state.searchKey.trim();
            HttpApi.getLedList(params, (resp, error)=>{
                PopAlert.stopLoadingView();
                let refreshState = resp && !error ? RefreshState.NoMoreData : RefreshState.Idle;
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    if (resp && resp.length > 0) {
                        if (page <= 1) {
                            thiz.state.datas = resp;
                        }else{
                            thiz.state.datas = thiz.state.datas.concat(resp);
                        }
                    }else{
                        PopAlert.showAlertView("提示", "暂无数据！");
                    }
                }
                thiz.setState({
                    page:page,
                    refreshState
                });
            });
        }else{
            params.title = this.state.searchKey.trim();
            HttpApi.getAdsList(params, (resp, error)=>{
                PopAlert.stopLoadingView();
                let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    if (Utils.typeOf(resp, "Array")) {
                        for(let i=0; i<resp.length; ++i) {
                            try {
                                resp[i].extend = eval("(" + resp[i].extend + ")");
                            }catch(e){
                                resp[i].extend = {addtype: ""};
                            }
                        }
                        if (page <= 1) {
                            thiz.state.datas = resp;
                        }else{
                            thiz.state.datas = thiz.state.datas.concat(resp);
                        }
                    } else {
                        PopAlert.showAlertView("提示", '没有获取到数据！');
                    }
                }
                thiz.setState({
                    page:page,
                    refreshState
                });
            });
        }
    }

    _keyExtractor = (item, index) => item.id;

    _onPressItemButtons = (which, item) => {
        if (this.state.selectType == 'led') {
            this._onPressLedItemButtons(which, item);
        }else{
            this._onPressAdsItemButtons(which, item);
        }
    }
    _onPressLedItemButtons = (which, item) => {
        var gD = null;
        for (let i=0; i<DataCenter.ledGroups.length; ++i) {
            if (item.gid == DataCenter.ledGroups[i].origin_id){
                gD = DataCenter.ledGroups[i];
                break;
            }
        }
        if (which == 'pc') {
            this.navigator.push({view: <EditMorePage initTab={0} device={item} groupData={gD} userInfo={this.props.userInfo} onDel={()=>{}}/>});
            return;
        } else if (which == 'gj') {
            this.navigator.push({view: <EditMorePage initTab={1} device={item} groupData={gD} userInfo={this.props.userInfo} onDel={()=>{}}/>});
        }
    }

    _onPressAdsItemButtons = (which, item) => {
        if (which == 'bj') {
            //find group
            let gdata = null;
            for (let i =0; i<DataCenter.adGroups.length; ++i) {
                if (DataCenter.adGroups[i].id == item.program_group) {
                    gdata = DataCenter.adGroups[i];
                    break;
                }
            }

            PopAlert.showLoadingView();
            HttpApi.getAdInfo({token:this.props.userInfo.token, program_id:item.program_id}, (resp, error) => {
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error + '');
                } else {
                    if (resp) {
                        if (typeof(resp.config) == 'string'){
                            DataCenter.editingAdPro = resp;
                            let d = JSON.parse(resp.config);
                            console.log(resp);
                            if (typeof (resp.info_period_pro) == 'string') {
                                //"{"date_play":"2000-01-01 2037-12-31","week":["1","2","3","4","5","6","7"],"period":null,"ignore_time_control":""}"
                                let d2 = JSON.parse(resp.info_period_pro);
                                DataCenter.editingAdPro.week = d2.week || [1,2,3,4,5,6,7];
                                DataCenter.editingAdPro.ignore_time_control = d2.ignore_time_control || '0';
                                let arrT = d2.date_play.split(' ');
                                DataCenter.editingAdPro.starttime = arrT[0] || '2000-01-01';
                                DataCenter.editingAdPro.endtime = arrT[1]||'2037-12-31';
                            }
                            DataCenter.editingAdPro.count_play = DataCenter.editingAdPro.model_fixed_time = DataCenter.editingAdPro.play_model_value;
                            DataCenter.editingAdData = d;

                            let t = item.extend ? item.extend.addtype : null;
                            if (t) {
                                //如果数据中有extend字段，以这个为准！
                                t = (t == 'text' || t == 'text_pic') ? (resp.auto_adapt == '1' ? 'autotxt' : 'text')
                                    : (t == 'text_part' ? 'weather' : (t == "subarea" ? "fenqu" : t));
                            }else {
                                if (d && d.length == 1) { //正常类型
                                    t = d[0].list_item[0].type;
                                    t = (t == 'text' || t == 'text_pic') ? (resp.auto_adapt == '1' ? 'autotxt' : 'text') : (t == 'text_part' ? 'weather' : t);
                                } else if (d && d.length > 1) { //自由分区
                                    t = "fenqu";
                                } else {
                                    Toast.info("广告数据异常");
                                    return;
                                }
                            }

                            switch (t) {
                                case 'text':
                                    this.navigator.push({view: <EditTextPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    return;
                                case 'autotxt':
                                    this.navigator.push({view: <EditTextPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'image':
                                    this.navigator.push({view: <EditPicPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'time':
                                case "text_time":
                                    this.navigator.push({view: <EditTimePage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'weather':
                                    this.navigator.push({view: <EditWeatherPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'fenqu':
                                    this.navigator.push({view: <EditFenquPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                            }
                        }
                    }
                }
            });
        }
        else if (which == 'sc') {
            let selAds = [];
            for (let i=0;i<this.state.datas.length;++i) {
                if (this.state.datas[i].isChecked) {
                    selAds.push(this.state.datas[i].program_id);
                }
            }
            if (selAds.indexOf(item.program_id) == -1) {
                selAds.push(item.program_id);
            }
            PopAlert.showAlertView("删除广告", (
                <View style={{height:135, paddingLeft:5, paddingRight:5}}>
                    <Text style={{flex:1, textAlign:'center', textAlignVertical:'center',
                        fontSize:14, color:'#333', padding:10}} numberOfLines={6}>
                        {"确定要删除广告吗？\n(已选择"+selAds.length+")"}
                    </Text>
                    <Button style={{minWidth:250, height:44, borderColor:"#eee", borderTopWidth:0.5, borderLeftWidth:0, borderRightWidth:0, borderBottomWidth:0, borderRadius:0}}
                            title="确定"
                            onPress={()=>{
                                PopAlert.dismissAlertView();
                                PopAlert.showLoadingView();
                                let thiz = this;
                                HttpApi.deleteAd({
                                    token:thiz.props.userInfo.token,
                                    program_ids:selAds
                                }, (resp, error)=>{
                                    PopAlert.stopLoadingView();
                                    if (error) {
                                        PopAlert.showAlertView("错误", error + '');
                                    } else {
                                        thiz.loadData(1);
                                        thiz.props.onReloadAds && thiz.props.onReloadAds();
                                        Toast.success("删除成功");
                                    }
                                });
                            }}
                    />
                </View>
            ));
        }
    }
}

let CircleSize = 70;
let MaxOffsetLeft = ScreenWidth - CircleSize;

// Ads main view
class MainView extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            initiated: false,
            selectedTab    : 0,
            isRefreshingLed: false,
            isRefreshingAds: false,
            ledDatas       : [],
            adsDatas       : [],
            tmpLedChildData: [],
            tmpAdChildData: [],
            tmpLedSectionData: [],
            tmpAdSectionData:[],
            filterLed: 0,
            ledCountOfAll: 0,
            ledCountOfOnline: 0,
            openedLedRow :-1,
            openedAdRow: -1,

            //选择的Led和Ad数量
            countOfSelLed: 0,
            countOfSelAd: 0,

            pswPC: '',
            lastEditPcTime:0, //上次编辑PC时间

        };
    }

    resetSelections = (notState=false)=>{
        gSelectGroup = {'led':[], 'ad':[]};
        gSelectItem = {'led':[], 'ad':[]};
        gCancelSelect = {'led':[], 'ad':[]};
        if (notState) {
            this.forceUpdate();
        }else {
            this.state.tmpLedChildData = [];
            this.state.tmpAdChildData = [];
            if (this.state.tmpLedSectionData) this.state.tmpLedSectionData.data = [];
            if (this.state.tmpAdSectionData) this.state.tmpAdSectionData.data = [];
            this.state.openedAdRow = -1;
            this.state.openedLedRow = -1;
        }
        this.state.countOfSelLed = 0;
        this.state.countOfSelAd = 0;
    }

    componentWillMount() {
        this._panResponder = {};
        this._previousRight = 0;
        this._previousBottom = 0;
        this._circleStyles = {};
        this.circle = (null : ?{ setNativeProps(props: Object): void });

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: this._handleStartShouldSetPanResponder,
            onMoveShouldSetPanResponder: this._handleMoveShouldSetPanResponder,
            onPanResponderGrant: this._handlePanResponderGrant,
            onPanResponderMove: this._handlePanResponderMove,
            onPanResponderRelease: this._handlePanResponderEnd,
            onPanResponderTerminate: this._handlePanResponderEnd,
        });
        this._previousRight = 1;
        this._previousBottom = 1;
        this._circleStyles = {
            style: {
                right: this._previousRight,
                bottom: this._previousBottom,
                position: "absolute",
            }
        };
    };

    componentDidMount() {
        this._updateNativeStyles();
        if (this.props.userInfo.token && this.state.initiated == false) {
            this.state.initiated = true;
            this._setupInitDatas();
            return;
        }
    }

    /***************************[Circle Pan - start]*********************************************************/
    _updateNativeStyles = () => {
        this.circle && this.circle.setNativeProps(this._circleStyles);
    };

    _handleStartShouldSetPanResponder = (e: Object, gestureState: Object) => {
        // Should we become active when the user presses down on the circle?
        return true;
    };

    _handleMoveShouldSetPanResponder = (e: Object, gestureState: Object) => {
        // Should we become active when the user moves a touch over the circle?
        return true;
    };

    _handlePanResponderGrant = (e: Object, gestureState: Object) => {

    };

    _handlePanResponderMove = (e: Object, gestureState: Object) => {
        if (Math.abs(gestureState.dx) <= 5) {
            return;
        }
        this._circleStyles.style.right = this._previousRight - gestureState.dx;
        //this._circleStyles.style.bottom = this._previousBottom - gestureState.dy;
        if (this._circleStyles.style.right > MaxOffsetLeft)
            this._circleStyles.style.right = MaxOffsetLeft;
        else if (this._circleStyles.style.right < 1)
            this._circleStyles.style.right = 1;
        this._updateNativeStyles();
    };

    _handlePanResponderEnd = (e: Object, gestureState: Object) => {
        if (Math.abs(gestureState.dx) <= 5) {
            this._onClickSendAds();
            return;
        }
        this._previousRight -= gestureState.dx;
        //this._previousBottom -= gestureState.dy;
        if (this._previousRight > MaxOffsetLeft)
            this._previousRight = MaxOffsetLeft;
        else if (this._previousRight < 1)
            this._previousRight = 1;
    };
    /***************************[Circle Pan - end]***********************************************************/


    _setupInitDatas(){
        InteractionManager.runAfterInteractions(() => {
            YsWebSocket.startWithUserAndToken(this.props.userInfo.username, this.props.userInfo.token);

            HttpApi.getConfigs({token:this.props.userInfo.token}, (resp, error) => {
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("配置信息错误", error + '');
                } else {
                    if (resp && resp.maxProNo) {
                        //DataCenter.configs = resp;
                    }
                }
            });

            HttpApi.getBackground({token:this.props.userInfo.token}, (resp, error)=>{
                if (resp) {
                    DataCenter.backgroundDatas = resp;
                }
            });

            this._loadLedDatas();
            this._loadAdsDatas();
        });
    }

    componentWillUnmount() {
        console.info("AdMain is Unmount!!!");
        YsWebSocket.disConnect();
        this.state.initiated = false;
    }

    componentWillReceiveProps(nextProps, nextState) {

        if (nextProps.userInfo.token && this.state.initiated == false) {
            this.state.initiated = true;
            this._setupInitDatas();
            return;
        }
        if (nextProps.uiState.stateAdsList != this.props.uiState.stateAdsList) {
            let tmp = DataCenter.tmpAdData;
            if (tmp) { //点击了投放，需要继续选择设备
                this.state.selectedTab = 0;
            }
            this._onRefreshAdsList(tmp);
            DataCenter.tmpAdData = null;
        }
        if (nextProps.uiState.stateLedList != this.props.uiState.stateLedList) {
            this._onRefreshLedList();
        }
    }

    renderNavigationLeftView() {
        return (
            <ImageButton
                image={require('../../assets/ic_nav_map.png')}
                style={{width:15, height:20, marginLeft:10, marginRight:14}}
                onPress={() => {
                    this.resetSelections();
                    this.forceUpdate();
                    Actions[VIEW_LED_MAP]({userInfo:this.props.userInfo, callback:this._callbackForLedMap});
                }}
            />
        );
    }

    renderNavigationRightView() {
        var yt = Platform.OS == 'ios' ? 40 : 18;
        var tsAll = this.state.filterLed == 0 ? {color:'red'} : {};
        var tsOnline = this.state.filterLed == 1 ? {color:'red'} : {};
        return (
            <ImageButton ref="navRight"
                image={require('../../assets/ic_nav_filter.png')}
                style={{width:20, height:20, marginLeft:14, marginRight:10}}
                onPress={() => {
                    Menu.show({x:ScreenWidth-130, y:yt, width:140, height:20},
                        [{title:' 全部屏('+this.state.ledCountOfAll+") ", titleStyle:tsAll, onPress:()=>this._onPressFilter(1)},
                         {title:' 在线屏('+this.state.ledCountOfOnline+") ", titleStyle:tsOnline, onPress:()=>this._onPressFilter(2)},
                            {title:' 添加屏  ', onPress:()=>this._onPressFilter(3)}]);
                }}
            />
        );
    }

    renderNavigationTitle() {
        return (
            <TouchableOpacity style={{
                flex             : 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-start',
                marginLeft       : 5, marginRight: 5, paddingBottom: 4,
                borderBottomWidth: 1, borderColor: '#eee'
            }} onPress={() => {
                this.resetSelections();
                this.navigator.push({view: <SearchPage userInfo={this.props.userInfo} onCheckItems={(isLed, item, checked)=>{
                    if (isLed) {
                        this._onChangeCheckboxLedChild(isLed, item, checked);
                    }else{
                        this._onChangeCheckboxAdChild(isLed, item, checked);
                    }
                }} onClickSendAds={()=>{
                    this._onClickSendAds();
                }} onReloadAds={()=>{
                    this._loadAdsDatas(null);
                }}/>})
            }}>
                <Icon
                    name="magnifier"
                    size={19}
                    color="white"
                />
                <Text style={{color: '#eee', fontSize: 15, marginLeft: 4}}>LED屏、广告名称</Text>
            </TouchableOpacity>
        );
    }

    renderPage() {
        return (
            <View style={{flex: 1}}>
                <View style={{
                    backgroundColor: '#fff',
                    paddingLeft    : 20,
                    paddingRight   : 20,
                    paddingTop     : 10,
                    paddingBottom  : 10,
                    alignItems     : 'center', borderColor: '#ddd', borderBottomWidth: 1
                }}>
                    <SegmentedControlTab
                        values={['我的LED屏', '广告列表']}
                        selectedIndex={this.state.selectedTab}
                        onTabPress={this._onTabChanged.bind(this)}
                        tabStyle={styles.tabStyle}
                        tabTextStyle={styles.tabTextStyle}
                        activeTabStyle={styles.activeTabStyle}
                        activeTabTextStyle={styles.activeTabTextStyle}
                    />
                </View>
                {
                    this.state.selectedTab == 0 ? this._renderLedList() : this._renderAdsList()
                }
                <Image
                    ref={(circle) => {
                        this.circle = circle;
                    }}
                    style={styles.circle}
                    source={require('../../assets/ic_btn_send.png')}

                    {...this._panResponder.panHandlers}
                />

                {
                    ((this.state.selectedTab == 0 && this.state.countOfSelLed > 0) || (this.state.selectedTab == 1 && this.state.countOfSelAd > 0)) ?
                        <View style={{
                            flexDirection: 'row',
                            position: 'absolute',
                            width: ScreenWidth - 40,
                            height: 32,
                            paddingLeft: 15,
                            paddingRight: 15,
                            left: 20, top:45,
                            backgroundColor: '#000a',
                            borderRadius: 16,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                flex: 1,
                                fontSize: 14,
                                color: '#fff',
                                textAlign: 'center',
                                textAlignVertical: 'center'
                            }}>
                                {this.state.selectedTab == 0 ? ("已选中" + this.state.countOfSelLed + "块屏") : ("已选中" + this.state.countOfSelAd + "条广告")}
                            </Text>
                        </View>
                        :
                        null
                }
            </View>
        );
    }

    _onTabChanged = (index) => {
        if (index == this.state.selectedTab)
            return;
        this.setState({selectedTab: index}, () => {
            if (index == 0 && this.state.ledDatas.length == 0) {
                this._loadLedDatas();
            } else if (index == 1 && this.state.adsDatas.length == 0) {
                this._loadAdsDatas();
            }
        });
    }

    _onClickSendAds = () => {
        if (gSelectItem.led.length == 0 && gSelectGroup.led.length == 0) {
            Toast.info("请选择要发送广告的设备！");
            if (this.state.selectedTab != 0) {
                this.setState({selectedTab:0});
            }
            return;
        }else{
            let found = false;
            for (let ia=0; ia < this.state.ledDatas.length; ia++) {
                for (let ib=0; ib<this.state.ledDatas[ia].data.length; ++ib) {
                    if (this.state.ledDatas[ia].data[ib].device == gSelectItem.led[0]) {
                        DataCenter.lastLedParam = this.state.ledDatas[ia].data[ib];
                        TGStorage.save({key:kLastLedParam4Ad, id:kLastLedParam4Ad, data:DataCenter.lastLedParam});
                        found = true;
                        break;
                    }
                }
                if (found)
                    break;
            }
        }

        if (gSelectItem.ad.length == 0 && gSelectGroup.ad.length == 0) {
            Toast.info("请选择要发送的广告！");
            if (this.state.selectedTab != 1) {
                this.setState({selectedTab:1});
            }
            return;
        }

        let thiz = this;
        let ps = {
            token:this.props.userInfo.token,
            selectGroup:gSelectGroup,
            selectItem:gSelectItem,
            cancelSelect:gCancelSelect,
            filter:{keysword:'', title:''},
            status:this.state.filterLed,
        };
        console.log(ps);
        PopAlert.showLoadingView();
        HttpApi.sendAd(ps, (resp, error, data)=>{
            PopAlert.stopLoadingView();
            if (error) {
                if (data && data.status == -9) {
                    PopAlert.showAlertView2("提示", error + '', ()=>{}, ()=>{
                        ps.attr = 1;
                        HttpApi.sendAd(ps, (resp, error, data)=>{});
                        thiz.resetSelections(true);
                        PopAdSendIn.show(thiz.props.userInfo.token);
                        PopAlert.dismissAlertView();
                    });
                }else {
                    PopAlert.showAlertView("错误", error + '');
                }
            } else {
                thiz.resetSelections(true);
                PopAdSendIn.show(thiz.props.userInfo.token);
            }
        });
    }

    /** LED list */

    _renderLedList = () => {
        if (this.state.ledDatas.length == 0 && !this.state.isRefreshingLed) {
            if (DataCenter.localMode != LoginType.Remote) {
                return (
                    <ScrollView style={{flex:1, backgroundColor:'#fff'}} contentContainerStyle={{flex:1, alignItems:'center', padding:20}}>
                        <Image style={{marginTop:10,}} resizeMode="contain" source={require('../../assets/tip_local_no_led.png')}/>
                        <ImageButton
                            style={{width:100, height:35, marginTop:10}}
                            image={require('../../assets/btn_find_led.png')}
                            onPress={()=>{
                                this._gotoAddLed();
                            }}
                        />
                    </ScrollView>
                );
            }
            return (
                <ScrollView style={{flex:1, backgroundColor:'#fff'}} contentContainerStyle={{flex:1, alignItems:'center', padding:20}}>
                    <Image style={{marginTop:10,}} resizeMode="contain" source={require('../../assets/tip_online_no_led.png')}/>
                    <ImageButton
                        style={{width:100, height:35, marginTop:10}}
                        image={require('../../assets/btn_add_led.png')}
                        onPress={()=>{
                            this._gotoAddLed();
                        }}
                    />
                </ScrollView>
            );
        }else
        return (<SectionList style={{flex: 1}}
                             initialNumToRender = {6}
                             onRefresh={this._onRefreshLedList}
                             refreshing={this.state.isRefreshingLed}
                             renderItem={this._renderLedGroupChilds}
                             renderSectionHeader={this._renderLedGroupHeader}
                             sections={this.state.ledDatas}
                             extraData={this.state}
            />
        );
    }

    _onRefreshLedList = () => {
        this._loadLedDatas();
    }

    _loadLedDatas = () => {
        if (this.state.isRefreshingLed)
            return;
        this.setState({isRefreshingLed: true});
        var thiz = this;
        HttpApi.getLedGroupList({token:this.props.userInfo.token}, (resp, error) => {
            if (error) {
                PopAlert.showAlertView("错误", error + '');
                thiz.setState({isRefreshingLed: false});
            } else {
                thiz.resetSelections();
                thiz.state.ledCountOfAll = 0;
                thiz.state.ledCountOfOnline = 0;
                if (Utils.typeOf(resp, "Array")) {
                    DataCenter.ledGroups = resp;
                    thiz.setState({ledDatas: resp.map(function (e, i) {
                        thiz.state.ledCountOfAll += parseInt(e.gcount);
                        thiz.state.ledCountOfOnline += parseInt(e.online_count);
                        e.data = []; e.key = i;
                        return e;
                    }), isRefreshingLed: false});
                } else {
                    thiz.setState({ledDatas: [], isRefreshingLed: false});
                }
            }
        });
    }

    _loadLedChilds = (section) => {
        PopAlert.showLoadingView();
        var thiz = this;
        HttpApi.getLedList({token: this.props.userInfo.token, gid: section.origin_id, p: 0, status:this.state.filterLed}, (resp, error) => {
            PopAlert.stopLoadingView();
            if (error) {
                PopAlert.showAlertView("错误", error + '');
            } else {
                if (Utils.typeOf(resp, "Array")) {
                    section.data = resp;
                    if (gSelectGroup.led.indexOf(section.origin_id) != -1) {
                        resp.forEach(function (v) {
                            gSelectItem.led.push(v.device);
                            gTmpLedItemDic[v.device] = section.origin_id;
                        });
                    }
                    thiz.forceUpdate();
                } else {
                    PopAlert.showAlertView("提示", '没有获取到数据！');
                }
            }
        });
    }

    _renderLedGroupHeader = (info) => {
        var section = info.section;
        var checked = gSelectGroup.led.indexOf(section.origin_id) != -1;
        return (
            <View style={{
                height        : 44, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                borderColor   : '#ddd', borderBottomWidth: 1, justifyContent: 'space-between',
            }} key={"sled"+section.key}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex:1,backgroundColor:"#fff", height:44, paddingLeft: 10, paddingRight: 10}}>
                    <CheckBox color={COLOR_NAV_BG} size={25} checked={checked} onCheckBoxPressed={(c) => {
                        this._onChangeCheckboxLedGroup(true, section, c);
                    }}/>
                    <IonIcon name="md-arrow-dropdown" color="#666" size={25}/>
                    <TouchableOpacity style={{flex:1, marginLeft: 4, height:44, justifyContent:"center"}}
                                      onPress={()=>{
                                          if (this.state.openedLedRow != section.key) {
                                              if (this.state.tmpLedChildData[section.key]) {
                                                  section.data = this.state.tmpLedChildData[section.key];
                                                  this.state.tmpLedSectionData = section;
                                              }else if (section.gcount > 0 && (!section.data || (section.data && section.data.length == 0))) {
                                                  this._loadLedChilds(section);
                                              }
                                              this.setState({openedLedRow:section.key});
                                          }else{
                                              this.state.tmpLedChildData[section.key] = section.data;
                                              section.data = [];
                                              this.setState({openedLedRow:-1});
                                          }
                                      }}>
                        {
                            this.state.filterLed == 0 ?
                                <Text style={{
                                    fontSize  : 14,
                                    color     : 'black',
                                }}>
                                    {section.name + "("}
                                    <Text style={{color:'red'}}>{section.online_count+""}</Text>
                                    <Text style={{color:'black'}}>{"/"+section.gcount+")"}</Text>
                                </Text>
                                :
                                <Text style={{
                                    fontSize  : 14,
                                    color     : 'black',
                                }}>
                                    {section.name + "("}
                                    <Text style={{color:'red'}}>{section.online_count+")"}</Text>
                                </Text>
                        }
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _renderLedGroupChilds = ({item, index, section}) => {
        if (section.key != this.state.openedLedRow)
            return null;
        let checked = gSelectItem.led.indexOf(item.device) != -1 ||
            gSelectGroup.led.indexOf(item.gid) != -1;
        return <MyLedListItem
                    key={""+section+""+index+""+item.device}
                    item={item}
                    isChecked={checked}
                    isLed={true}
                    onPressButton={this._onPressLedItemButtons}
                    onCheckBoxPressed={this._onChangeCheckboxLedChild}
                />
    }

    _onChangeCheckboxLedGroup = (isLed, data, checked)=>{
        //console.log(data)
        if (checked) {
            if (array_.indexOf(gSelectGroup.led, data.origin_id) == -1)
            {
                gSelectGroup.led.push(data.origin_id);
                gTmpLedGroupDic[data.origin_id] = this.state.filterLed == 0 ? data.gcount : data.online_count;
                let i = 0, j= 0;
                for (;i<this.state.ledDatas.length; ++i) {
                    if (this.state.ledDatas[i].origin_id == data.origin_id) {
                        let gg = this.state.ledDatas[i].data;
                        for (; j<gg.length;++j){
                            if (gSelectItem.led.indexOf(gg[j].device) == -1) {
                                gSelectItem.led.push(gg[j].device);
                                gTmpLedItemDic[gg[j].device] = data.origin_id;
                            }
                            if (gCancelSelect.led.indexOf(gg[j].device != -1)) {
                                array_.remove(gCancelSelect.led, function (o) {
                                    return o == gg[j].device;
                                })
                            }
                        }
                        break;
                    }
                }
                this._calSelLedCount();
                this.forceUpdate();
            }
        }else{
            if (array_.indexOf(gSelectGroup.led, data.origin_id) != -1){
                array_.remove(gSelectGroup.led, function (o) {
                    return o == data.origin_id;
                });
                let i = 0, j= 0;
                for (;i<this.state.ledDatas.length; ++i) {
                    if (this.state.ledDatas[i].origin_id == data.origin_id) {
                        let gg = this.state.tmpLedChildData[data.key] || this.state.ledDatas[i].data;
                        for (; gg && j<gg.length;++j){
                            if (gg[j].gid == data.origin_id) {
                                array_.remove(gSelectItem.led, function (o) {
                                    return o == gg[j].device;
                                })
                            }
                            if (gg[j].gid == data.origin_id) {
                                array_.remove(gCancelSelect.led, function (o) {
                                    return o == gg[j].device;
                                })
                            }
                        }
                        break;
                    }
                }
                this._calSelLedCount();
                this.forceUpdate();
            }
        }
    }

    _onChangeCheckboxLedChild = (isLed, data, checked)=>{
        if (checked) {
            if (gSelectItem.led.indexOf(data.device) == -1){
                gSelectItem.led.push(data.device);
                gTmpLedItemDic[data.device] = data.gid;
                this.forceUpdate();
            }
            if (gCancelSelect.led.indexOf(data.device) != -1){
                array_.remove(gCancelSelect.led, function (o) {
                    return o == data.device;
                });
            }
        }else{
            if (gSelectItem.led.indexOf(data.device) != -1){
                array_.remove(gSelectItem.led, function (o) {
                    return o == data.device;
                });
            }
            if (gSelectGroup.led.indexOf(data.gid) != -1){
                array_.remove(gSelectGroup.led, function (o) {
                    return o == data.gid;
                });
            }
            if (gCancelSelect.led.indexOf(data.device) == -1){
                gCancelSelect.led.push(data.device);
            }
        }
        this._calSelLedCount();
        this.forceUpdate();
    }

    _onPressLedItemButtons = (which, item) => {
        var gD = null;
        for (let i=0; i<this.state.ledDatas.length; ++i) {
            if (item.gid == this.state.ledDatas[i].origin_id){
                gD = this.state.ledDatas[i];
                break;
            }
        }
        if (which == 'pc') {
            this.navigator.push({view: <EditMorePage initTab={0} device={item} groupData={gD} userInfo={this.props.userInfo} onDel={()=>{}}/>});
            return;
        } else if (which == 'gj') {
            this.navigator.push({view: <EditMorePage initTab={1} device={item} groupData={gD} userInfo={this.props.userInfo} onDel={(t)=>{
                if (t == 'reloadLedName') {
                    // reload led UI for rename.
                    let old = this.state.openedLedRow;
                    if (old != -1) {
                        this.setState({openedLedRow: -1});
                    }
                }else {
                    this._loadLedDatas();
                }
            }}/>});
        }
    }

    /** Ads list */

    _renderAdsList = () => {
        return (<SectionList style={{flex: 1}}
                             initialNumToRender = {6}
                             onRefresh={this._onRefreshAdsList}
                             refreshing={this.state.isRefreshingAds}
                             renderItem={this._renderAdsGroupChilds}
                             renderSectionHeader={this._renderAdsGroupHeader}
                             sections={this.state.adsDatas}
                             extraData={this.state}
            />
        );
    }

    _onRefreshAdsList = (tmp) => {
        this._loadAdsDatas(tmp);
    }

    _loadAdsDatas = (tmp) => {
        if (this.state.isRefreshingAds)
            return;
        this.setState({isRefreshingAds: true});
        var thiz = this;
        HttpApi.getAdsGroups({token: this.props.userInfo.token}, (resp, error) => {
            if (error) {
                PopAlert.showAlertView("错误", error + '');
                thiz.setState({isRefreshingAds: false});
            } else {
                thiz.resetSelections();
                if (tmp) {
                    console.log("tttttt", tmp);
                    gSelectItem.ad.push(tmp.program_id);
                }
                if (Utils.typeOf(resp, "Array")) {
                    DataCenter.adGroups = resp;
                    thiz.setState({adsDatas: resp.map(function (e, i) {
                        e.data = []; e.key = i;
                        return e;
                    }), isRefreshingAds: false});
                } else {
                    thiz.setState({adsDatas: [], isRefreshingAds: false});
                }
            }
        });
    }

    _loadAdsChilds = (section) => {
        PopAlert.showLoadingView();
        var thiz = this;
        HttpApi.getAdsList({token: this.props.userInfo.token, gid: section.id}, (resp, error) => {
            PopAlert.stopLoadingView();
            if (error) {
                PopAlert.showAlertView("错误", error + '');
            } else {
                if (Utils.typeOf(resp, "Array")) {
                    for(let i=0; i<resp.length; ++i) {
                        try {
                            resp[i].extend = eval("(" + resp[i].extend + ")");
                        }catch(e){
                            resp[i].extend = {addtype: ""};
                        }
                    }
                    section.data = resp;
                    if (gSelectGroup.ad.indexOf(section.id) != -1) {
                        resp.forEach(function (v) {
                            gSelectItem.ad.push(v.program_id);
                            gTmpAdItemDic[v.program_id] = section.id;
                        });
                    }
                    thiz.forceUpdate();
                } else {
                    PopAlert.showAlertView("提示", '没有获取到数据！');
                }
            }
        });
    }

    _renderAdsGroupHeader = (info) => {
        var section = info.section;
        var checked = gSelectGroup.ad.indexOf(section.id) != -1;
        return (
            <View style={{
                height        : 44, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
                borderColor   : '#ddd', borderBottomWidth: 1, justifyContent: 'space-between'
            }}>
                <View style={{flexDirection: 'row', alignItems: 'center', flex:1,backgroundColor:"#fff", height:44, paddingLeft: 10, paddingRight: 10}}>
                    <CheckBox color={COLOR_NAV_BG} size={25} checked={checked} onCheckBoxPressed={(c) => {
                        this._onChangeCheckboxAdsGroup(false, section, c);
                    }}/>
                    <IonIcon name="md-arrow-dropdown" color="#666" size={25}/>
                    <TouchableOpacity style={{flex:1, marginLeft: 4, height:44, justifyContent:"center"}}
                                      onPress={()=>{
                                          if (this.state.openedAdRow != section.key) {
                                              if (this.state.tmpAdChildData[section.key]) {
                                                  section.data = this.state.tmpAdChildData[section.key];
                                                  this.state.tmpAdSectionData = section;
                                              }else if (section.gcount > 0 && (!section.data || (section.data && section.data.length == 0))) {
                                                  this._loadAdsChilds(section);
                                              }
                                              this.setState({openedAdRow:section.key});
                                          }else{
                                              this.state.tmpAdChildData[section.key] = section.data;
                                              section.data = [];
                                              this.setState({openedAdRow:-1});
                                          }
                                      }}>
                        <Text style={{
                            fontSize  : 14,
                            color     : 'black',
                        }}>{section.title + "(" + section.gcount + ")"}</Text>
                    </TouchableOpacity>
                </View>
                <EtIcon.Button name="plus" color={COLOR_BUTTON_CYON} underlayColor="#0000" backgroundColor="#0000" size={30}
                               iconStyle={{marginRight: -10}}
                               onPress={(e) => {
                                   this._onPressAddAd(section, e.nativeEvent.pageY);
                               }}/>
            </View>
        );
    }

    _renderAdsGroupChilds = ({item, section}) => {
        if (section.key != this.state.openedAdRow)
            return null;
        let checked = gSelectItem.ad.indexOf(item.program_id) != -1 ||
            gSelectGroup.ad.indexOf(item.program_group) != -1;
        return <MyLedListItem
            item={item}
            isChecked={checked}
            isLed={false}
            onPressButton={this._onPressAdsItemButtons}
            onCheckBoxPressed={this._onChangeCheckboxAdChild}
        />
    }

    _onChangeCheckboxAdsGroup = (isLed, data, checked)=>{
        if (checked) {
            if (array_.indexOf(gSelectGroup.ad, data.id) == -1){
                gSelectGroup.ad.push(data.id);
                gTmpAdGroupDic[data.id] = data.gcount;
                let i = 0, j= 0;
                for (;i<this.state.adsDatas.length; ++i) {
                    if (this.state.adsDatas[i].id == data.id) {
                        let gg = this.state.adsDatas[i].data;
                        for (; j<gg.length;++j){
                            if (gSelectItem.ad.indexOf(gg[j].program_id) == -1) {
                                gSelectItem.ad.push(gg[j].program_id);
                                gTmpAdItemDic[gg[j].program_id] = data.id;
                            }
                            if (gCancelSelect.ad.indexOf(gg[j].program_id != -1)) {
                                array_.remove(gCancelSelect.ad, function (o) {
                                    return o == gg[j].program_id;
                                })
                            }
                        }
                        break;
                    }
                }
                this._calSelAdCount();
                this.forceUpdate();
            }
        }else{
            if (array_.indexOf(gSelectGroup.ad, data.id) != -1){
                array_.remove(gSelectGroup.ad, function (o) {
                    return o == data.id;
                });
                let i = 0, j= 0;
                for (;i<this.state.adsDatas.length; ++i) {
                    if (this.state.adsDatas[i].id == data.id) {
                        let gg = this.state.tmpAdChildData[data.key] || this.state.adsDatas[i].data;
                        for (; j<gg.length;++j){
                            if (gSelectItem.ad.indexOf(gg[j].program_id) != -1) {
                                array_.remove(gSelectItem.ad, function (o) {
                                    return o == gg[j].program_id;
                                })
                            }
                            if (gCancelSelect.ad.indexOf(gg[j].program_id != -1)) {
                                array_.remove(gCancelSelect.ad, function (o) {
                                    return o == gg[j].program_id;
                                })
                            }
                        }
                        break;
                    }
                }
                this._calSelAdCount();
                this.forceUpdate();
            }
        }
    }

    _onChangeCheckboxAdChild = (isLed, data, checked)=>{
        if (checked) {
            if (gSelectItem.ad.indexOf(data.program_id) == -1){
                gSelectItem.ad.push(data.program_id);
                gTmpAdItemDic[data.program_id] = data.program_group;
                this.forceUpdate();
            }
            if (gCancelSelect.ad.indexOf(data.program_id) != -1){
                array_.remove(gCancelSelect.ad, function (o) {
                    return o == data.program_id;
                });
            }
        }else{
            if (gSelectItem.ad.indexOf(data.program_id) != -1){
                array_.remove(gSelectItem.ad, function (o) {
                    return o == data.program_id;
                });
            }
            if (gSelectGroup.ad.indexOf(data.program_group) != -1){
                array_.remove(gSelectGroup.ad, function (o) {
                    return o == data.program_group;
                });
            }
            if (gCancelSelect.ad.indexOf(data.program_id) == -1){
                gCancelSelect.ad.push(data.program_id);
            }
        }
        this._calSelAdCount();
        this.forceUpdate();
    }


    _onPressAdsItemButtons = (which, item) => {
        if (which == 'bj') {
            console.log(item)
            //find group
            let gdata = null;
            for (let i =0; i<this.state.adsDatas.length; ++i) {
                if (this.state.adsDatas[i].id == item.program_group) {
                    gdata = this.state.adsDatas[i];
                    break;
                }
            }
            PopAlert.showLoadingView();
            HttpApi.getAdInfo({token:this.props.userInfo.token, program_id:item.program_id}, (resp, error) => {
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error + '');
                } else {
                    if (resp) {
                        if (typeof(resp.config) == 'string'){
                            DataCenter.editingAdPro = resp;
                            let d = JSON.parse(resp.config);
                            console.log(resp);
                            if (typeof (resp.info_period_pro) == 'string') {
                                //"{"date_play":"2000-01-01 2037-12-31","week":["1","2","3","4","5","6","7"],"period":null,"ignore_time_control":""}"
                                let d2 = JSON.parse(resp.info_period_pro);
                                DataCenter.editingAdPro.week = d2.week || [1,2,3,4,5,6,7];
                                DataCenter.editingAdPro.ignore_time_control = d2.ignore_time_control || '0';
                                let arrT = d2.date_play.split(' ');
                                DataCenter.editingAdPro.starttime = arrT[0] || '2000-01-01';
                                DataCenter.editingAdPro.endtime = arrT[1]||'2037-12-31';
                            }
                            DataCenter.editingAdPro.count_play = DataCenter.editingAdPro.model_fixed_time = DataCenter.editingAdPro.play_model_value;
                            DataCenter.editingAdData = d;

                            let t = item.extend ? item.extend.addtype : null;
                            if (t) {
                                //如果数据中有extend字段，以这个为准！
                                t = (t == 'text' || t == 'text_pic') ? (resp.auto_adapt == '1' ? 'autotxt' : 'text')
                                    : (t == 'text_part' ? 'weather' : (t == "subarea" ? "fenqu" : t));
                            }else {
                                if (d && d.length == 1) { //正常类型
                                    t = d[0].list_item[0].type;
                                    t = (t == 'text' || t == 'text_pic') ? (resp.auto_adapt == '1' ? 'autotxt' : 'text') : (t == 'text_part' ? 'weather' : t);
                                } else if (d && d.length > 1) { //自由分区
                                    t = "fenqu";
                                } else {
                                    Toast.info("广告数据异常");
                                    return;
                                }
                            }

                            switch (t) {
                                case 'text':
                                    this.navigator.push({view: <EditTextPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    return;
                                case 'autotxt':
                                    this.navigator.push({view: <EditTextPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case AdType_Image:
                                    this.navigator.push({view: <EditPicPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case AdType_Time:
                                case AdType_TimeCountDown:
                                    this.navigator.push({view: <EditTimePage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'weather':
                                    this.navigator.push({view: <EditWeatherPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                                case 'fenqu':
                                    this.navigator.push({view: <EditFenquPage actions={this.props.actions} type={t} groupData={gdata} token={this.props.userInfo.token}/>});
                                    break;
                            }
                        }
                    }
                }
            });

        }
        else if (which == 'sc') {
            let thiz = this;

            PopAlert.showAlertView("删除广告", (
                <View style={{height:135, paddingLeft:5, paddingRight:5}}>
                    <Text style={{flex:1, textAlign:'center', textAlignVertical:'center',
                        fontSize:14, color:'#333', padding:10}} numberOfLines={6}>
                        {"确定要删除广告吗？" + "\n\n" + "已选中(" + thiz.state.countOfSelAd + ")"}
                    </Text>
                    <Button style={{minWidth:250, height:44, borderColor:"#eee", borderTopWidth:0.5, borderLeftWidth:0, borderRightWidth:0, borderBottomWidth:0, borderRadius:0}}
                            title="确定"
                            onPress={()=>{
                                PopAlert.dismissAlertView();
                                PopAlert.showLoadingView();
                                HttpApi.deleteAd({
                                    token:thiz.props.userInfo.token,
                                    program_ids:gSelectItem.ad,
                                    program_group:gSelectGroup.ad,
                                }, (resp, error)=>{
                                    PopAlert.stopLoadingView();
                                    if (error) {
                                        PopAlert.showAlertView("错误", error + '');
                                    } else {
                                        Toast.success("删除成功");
                                        thiz._onRefreshAdsList();
                                    }
                                });
                            }}
                    />
                </View>
            ));

        }
    }

    _onPressAddAd = (gdata, offsetY) => {
        if (this.overlayView) {
            return;
        }
        var h = ScreenWidth * 463.0 / 720.0;
        var padBottom = h * 48 / ScreenHeight;
        var padTop = h * 180 / ScreenHeight;
        var maxOffsetY = (ScreenHeight - h - 10);
        var bgImg = require('../../assets/newads/pop_bg.png');
        if (offsetY > maxOffsetY) {
            offsetY = maxOffsetY;
            bgImg = require('../../assets/newads/pop_bg2.png');
        }

        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', paddingTop: offsetY}}
                type={'zoomOut'}
                modal={false}
                ref={v => this.overlayView = v}>
                <View style={{backgroundColor: '#0000', width: ScreenWidth, height: h}}>
                    <Image source={bgImg} resizeMode="stretch" style={{
                        position: 'absolute',
                        left    : 1,
                        top     : 1,
                        width   : ScreenWidth,
                        height  : h,
                    }}/>
                    <Button
                        style={{backgroundColor:'#0000', borderWidth:0, position:'absolute', right:1, top:padBottom, width:90,height:34}}
                        onPress={()=>{
                            this.overlayView && this.overlayView.close();
                            this.overlayView = null;
                            this._showEditAdsGroup(offsetY);
                        }}
                    />
                    <Grid style={{marginTop: padTop, paddingBottom: padBottom, paddingLeft: 6, paddingRight: 6}}>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_wenzi.png')}
                                             onPress={() => {
                                                 this._onPressPopNew('text', gdata)
                                             }}/>
                            </Row>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_fenqu.png')} onPress={() => {
                                    this._onPressPopNew('fenqu', gdata)
                                }}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_time.png')} onPress={() => {
                                    this._onPressPopNew('time', gdata)
                                }}/>
                            </Row>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_autotxt.png')} onPress={() => {
                                    this._onPressPopNew('autotxt', gdata)
                                }}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_pic.png')} onPress={() => {
                                    this._onPressPopNew('image', gdata)
                                }}/>
                            </Row>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_none.png')}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_weather.png')} onPress={() => {
                                    this._onPressPopNew('weather', gdata)
                                }}/>
                            </Row>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../assets/newads/ic_new_none.png')}/>
                            </Row>
                        </Col>
                    </Grid>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }

    _onPressPopNew = (t, gdata) => {
        this.overlayView && this.overlayView.close();
        this.overlayView = null;

        let tt =new EditProPage({actions:this.props.actions, token:this.props.userInfo.token, groupData:gdata, type:t, isNew:true, autoGoNew:this.navigator});

        //this.navigator.push({view: <EditProPage actions={this.props.actions} groupData={gdata} type={t} token={this.props.userInfo.token} isNew={true}/>})
    };

    _showEditAdsGroup = (offsetY) => {
        let thiz = this;
        PopEditAdsGroup.show(this.props.userInfo.token, this.state.adsDatas, ()=>{
            thiz.forceUpdate();
        });
    }

    _onPressFilter = (index) => {
        if (index == 1) {
            this.state.filterLed = 0;
            this._loadLedDatas();
        }else if (index == 2) {
            this.state.filterLed = 1;
            this._loadLedDatas();
        }else if (index == 3) {
            this._gotoAddLed();
        }
    };

    _gotoAddLed = ()=>{
        let thiz = this;
        Actions[VIEW_ADD_LED_SCREEN]({token:this.props.userInfo.token, callback:(needReload)=>{
            needReload && thiz._onRefreshLedList();
            needReload && thiz._showAddLedSuccessDialog();
        }});
    };

    _showAddLedSuccessDialog = ()=>{
        if (this.overlayPopViewAddOK)
            return;
        let w = ScreenWidth - 80;
        let h = w * 626 / 596;
        let thiz = this;
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                ref={v => this.overlayPopViewAddOK = v}
            >
                <View style={{backgroundColor: '#0000', width: w, height: h, alignItems:"center"}}>
                    <Image style={{flex:1, position:"absolute"}} source={require("../../assets/led/add_ok.png")}/>
                    <View style={{flexDirection:"row", width: w, height:48, position:"absolute", bottom:1}}>
                        <Button style={{flex:1, margin:6, backgroundColor:"#0000", borderWidth:0}}
                        onPress={()=>{
                            thiz.overlayPopViewAddOK.close();
                            thiz.overlayPopViewAddOK = null;
                            thiz.setState({selectedTab:0});
                        }}/>
                        <Button style={{flex:1, margin:6, backgroundColor:"#0000", borderWidth:0}}
                                onPress={()=>{
                                    thiz.overlayPopViewAddOK.close();
                                    thiz.overlayPopViewAddOK = null;
                                    thiz.navigator.push({view:<WifiLedSettings userInfo={thiz.props.userInfo}/>})
                                }}/>
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    };

    // LedMap 选择Led后的回调
    _callbackForLedMap = (needReload, data) => {
        if (needReload) {
            if (data.selectLeds && data.selectLeds.length > 0) {
                let i = 0;
                for (i = 0; i<data.selectLeds.length;++i) {
                    if (gSelectItem.led.indexOf(data.selectLeds[i]) == -1) {
                        gSelectItem.led.push(data.selectLeds[i]);
                    }
                }
                this.state.countOfSelLed = data.selectLeds.length;
                Toast.info("请选择要发送的广告！");
                this.state.selectedTab = 1;
            }
            this.forceUpdate();
        }
    };

    // 计算选择的数量
    _calSelLedCount = ()=>{
        let thiz = this;
        this.state.countOfSelLed = 0;
        gSelectGroup.led.forEach(function (e) {
            thiz.state.countOfSelLed += parseInt(gTmpLedGroupDic[e]);
        });
        gSelectItem.led.forEach(function (e) {
            if (gSelectGroup.led.indexOf(gTmpLedItemDic[e]) == -1) {
                thiz.state.countOfSelLed += 1;
            }
        });
    };
    _calSelAdCount = ()=>{
        let thiz = this;
        this.state.countOfSelAd = 0;
        gSelectGroup.ad.forEach(function (e) {
            thiz.state.countOfSelAd += parseInt(gTmpAdGroupDic[e]);
        });
        gSelectItem.ad.forEach(function (e) {
            if (gSelectGroup.ad.indexOf(gTmpAdItemDic[e]) == -1) {
                thiz.state.countOfSelAd += 1;
            }
        });
    };
}


const styles = StyleSheet.create({
    tabsContainerStyle: {
        //custom styles
    },
    tabStyle          : {
        backgroundColor: '#ffffff',
        borderColor    : '#999999',
        height         : 34,
    },
    tabTextStyle      : {
        color   : '#666666',
        fontSize: 15,
    },
    activeTabStyle    : {
        backgroundColor: COLOR_NAV_BG,
        borderColor    : COLOR_NAV_BG
    },
    activeTabTextStyle: {
        color   : 'white',
        fontSize: 15,
    },

    cellItem  : {
        backgroundColor: '#fff', height: 100, marginTop: 4, marginBottom: 4, marginLeft: 20, marginRight: 20,
        borderRadius   : 8, borderColor: '#aaa', borderBottomWidth: 0.5,
    },
    cellMiddle: {
        flexDirection: 'row', paddingLeft: 10, paddingRight: 10, paddingTop: 6,
        flex         : 1, justifyContent: 'space-between'
    },
    cellBottom: {
        flexDirection: 'row', paddingLeft: 10, paddingRight: 10,
        height       : 40,
        alignItems   : 'center', justifyContent: 'flex-end',
        position     : 'absolute',
        right        : 1,
        bottom       : 1,

    },

    rowOfNewPop          : {
        alignItems    : 'center',
        justifyContent: 'center',
        padding       : 10,
        width         : ScreenWidth / 4,
    },
    colOfNewPop          : {
        alignItems: 'center',
    },

    circle:{position:'absolute', right:1, bottom:1},
});


function mapStateToProps(state, ownProps) {
    return {
        userInfo: state.login,
        uiState: state.ui,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}

var MainV = connect(mapStateToProps, mapDispatchToProps)(MainView);

export default class AdMain extends React.Component {
    render() {
        return (
            <TeaNavigator rootView={
                <MainV {...this.props}/>
            }/>
        );
    }
}

