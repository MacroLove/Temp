import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import React from "react";
import {
    View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image,
    FlatList, TouchableOpacity, DatePickerAndroid, DatePickerIOS, TimePickerAndroid, Keyboard, Platform,
    Modal, InteractionManager
} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage, Overlay,

} from "teaset";
import IconBadge from 'react-native-icon-badge';
import Icon from "react-native-vector-icons/Entypo"
import * as Progress from 'react-native-progress';
import Toast from 'react-native-root-toast';
import {COLOR_NAV_BG, COLOR_VIEW_BG} from "../../../constants/Colors";
import SearchInput from "../../../widgets/SearchInput/SearchInput";
import PTRListView, {RefreshState} from '../../../widgets/PTRListView';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import Utils from '../../../Utils/Utils';
import {
    AdType_Area, AdType_AutoText, AdType_Image, AdType_Text, AdType_Time, AdType_TimeCountDown,
    AdType_Weather
} from "../../../constants/Defines";
import YsWebSocket from "../../../network/YsWebSocket";
import DataCenter from '../../../models/DataCenter';
import EditProPage from "../../ads/newAd/edit0Pro";

var array_ = require('lodash/array');
var moment_ = require('moment');

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
const ColorSending="#0b8ded";
const ColorFail = "#ff0000";
const ColorOk = "#18ab3f";
const ColorWaiting="#999999";
let MAP_STATUS = {1:"等待发送", 2:"正在发送", 3:"成功", 4:"失败"};
let MAP_STATUS_COLOR = {1:ColorWaiting, 2:ColorSending, 3:ColorOk, 4:ColorFail};

class MyListItem extends React.PureComponent {
    _onPressButton = (type) => {
        this.props.onPressButton(this.props.item, type);
    };

    render() {
        var stColor = MAP_STATUS_COLOR[this.props.item.status];
        var styl = {color: stColor, fontSize: 14};
        let ic = require('../../../assets/ic_his_cellIcon.png');
        if (this.props.item.extend) {
            let at = this.props.item.extend.addtype;
            if (at == AdType_Area) {
                ic = require('../../../assets/ads/ad_listitem_fenqu.png');
            }else if (at == AdType_AutoText) {
                ic = require('../../../assets/ads/ad_listitem_auto.png');
            }else if (at == AdType_Text) {
                ic = require('../../../assets/ads/ad_listitem_wenzi.png');
            }else if (at == AdType_Image) {
                ic = require('../../../assets/ads/ad_listitem_tupian.png');
            }else if (at == AdType_Weather) {
                ic = require('../../../assets/ads/ad_listitem_tianqi.png');
            }else if (at == AdType_Time || at == AdType_TimeCountDown) {
                ic = require('../../../assets/ads/ad_listitem_time.png');
            }
        }
        return (
            <View
                style={styles.cellItem}
                onPress={this._onPress}
            >
                <View style={styles.cellTop}>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Image
                            style={{resizeMode: 'contain',marginRight:5, width:20, height:20}}
                            source={require('../../../assets/ic_his_led.png')}
                        />
                        <Text style={{color: 'black', fontSize: 13}}>{this.props.item.device}</Text>
                        <Icon name="chevron-thin-right" color="#aaa" size={14}/>
                    </View>
                    <Text style={styl}>{MAP_STATUS[this.props.item.status]}</Text>
                </View>
                <View style={styles.cellMiddle}>
                    <IconBadge
                        Hidden
                        MainElement={
                            <Image style={{margin: 8, resizeMode: 'contain'}}
                                   source={ic}/>
                        }
                        BadgeElement={
                            <Text style={{color: '#fff', fontSize:10}}>{this.props.badge}</Text>
                        }

                        IconBadgeStyle={
                            {
                                minWidth: 16,
                                width: 16,
                                height: 16,
                                borderRadius:8,
                                backgroundColor: '#00bdbf'
                            }
                        }
                    />
                    <View style={{flex:1}}>
                        <Text style={{color: 'black', fontSize: 15, fontWeight:'200'}}>{'广告编号：'+ (this.props.item.no || this.props.item.sno)}</Text>
                        <Text style={{color: 'gray', fontSize: 14}}>{'名称：'+ (this.props.item.program_name || this.props.item.type_title)}</Text>
                    </View>
                    <View style={{width:150, height:40, alignItems:'flex-end', justifyContent:'flex-start', backgroundColor:'#0000'}}>
                        <Text style={{color: 'gray', fontSize: 12}}>{this.props.item.ctime}</Text>
                    </View>
                </View>
                <View style={styles.cellBottom}>
                    <Button title="查看广告" titleStyle={{color:'#0b8ded', fontSize:15}} style={{borderColor:'#0b8ded', height:32, borderRadius:16, marginLeft:10}}
                        onPress={()=>{
                            this._onPressButton("cha")
                        }}
                    />
                    {
                        (this.props.item.status == 4 || this.props.item.status == 1) ? null : ( this.props.item.status == 3 ?
                            <Button title="发送详情" titleStyle={{color:'#333333', fontSize:15}} style={{borderColor:'#999999', height:32, borderRadius:16, marginLeft:10}}
                                    onPress={()=>{
                                        this._onPressButton("detail")
                                    }}
                            />
                            :
                            <Button title="发送进度" titleStyle={{color:'#333333', fontSize:15}} style={{borderColor:'#999999', height:32, borderRadius:16, marginLeft:10}}
                                    onPress={()=>{
                                        this._onPressButton("fa")
                                    }}
                            />)
                    }
                    {/*<Button title="删除记录" titleStyle={{color:'#333333', fontSize:15}} style={{borderColor:'#999999', height:32, borderRadius:16, marginLeft:10}}*/}
                            {/*onPress={()=>{*/}
                                {/*this._onPressButton("shan")*/}
                            {/*}}*/}
                    {/*/>*/}
                </View>
            </View>
        )
    }
}

class AdsHistoryPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "我的广告历史",
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        let today = moment_().format('YYYY-MM-DD');
        this.state = {
            page: 0,
            data: [],
            dataAll: [],
            dataSending:[],
            dataWaiting:[],
            dataFailed:[],
            dataOK:[],
            refreshState: RefreshState.HeaderRefreshing,

            initialTab: this.props.selectedTab || 0,
            selectedTab: this.props.selectedTab || 0,

            searchStr: '',
            filterDateFrom: today,
            filterDateTo: today,
            filterTimeFrom: '00:01',
            filterTimeTo: "23:59",
            selectedButton: 0,

            iosDate: new Date(),
            wsKey: Utils.guid(),
        };
        YsWebSocket.addCallback({key:this.state.wsKey, cmd:'program', callback:this._wsCallbackProgram});
        YsWebSocket.addCallback({key:this.state.wsKey, cmd:'adSendProgress', callback:this._wsCallbackProgress});
    }

    componentDidMount() {
        InteractionManager.runAfterInteractions(() => {
            this.loadData(1);
        });
    }

    componentWillUnmount() {
        YsWebSocket.removeCallback(this.state.wsKey);
    }

    _wsCallbackProgram = (msgs, cmds)=> {
        var devids = msgs.ids_dev.split(',');
        var sno = msgs.sno;
        var status = msgs.status;
        var thiz = this;
        devids.forEach(function(devid){
            let o = null;
            for (let i=0; i<thiz.state.dataAll.length; ++i) {
                o = thiz.state.dataAll[i];
                if (o.device == devid && o.sno == sno) {
                    o.status = status;
                }
            }
        });
        InteractionManager.runAfterInteractions(() => {
            thiz.forceUpdate();
        });
    };

    _wsCallbackProgress = (msgs, cmds)=> {
        var devids = msgs.ids_dev;
        var sno = msgs.sno;
        var progress = msgs.progress;
        var thiz = this;
        if (thiz.refTxtProgress) {
            thiz.refTxtProgress.setNativeProps({text:"当前广告已发送"+progress+"%"});
        }
        if (thiz.refBarProgress) {
            thiz.refBarProgress.setProgress(progress);
        }
    };

    renderNavigationRightView() {
        return <NavigationBar.LinkButton
            title="筛选"
            onPress={()=>{
                this._showFilter();
            }}
        />
    }

    renderPage() {
        return (
            <View style={styles.container}>
                <View style={{width: ScreenWidth, height: 50}}>
                    <ScrollableTabView scrollWithoutAnimation
                        style={{backgroundColor:'white'}}
                        tabBarTextStyle={{fontSize: 15}}
                        tabBarActiveTextColor={COLOR_NAV_BG}
                        tabBarInactiveTextColor="#888"
                        initialPage={this.state.initialTab}
                        renderTabBar={() => <DefaultTabBar underlineStyle={{backgroundColor: COLOR_NAV_BG}}/>}
                        onChangeTab={(e) => (this._onChangeTab(e))}
                    >
                        <View tabLabel="全部" style={styles.fakeTabView}/>
                        <View tabLabel="待发送" style={styles.fakeTabView}/>
                        <View tabLabel="发送中" style={styles.fakeTabView}/>
                        <View tabLabel="成功" style={styles.fakeTabView}/>
                        <View tabLabel="失败" style={styles.fakeTabView}/>
                    </ScrollableTabView>
                </View>
                <PTRListView
                    style={{flex: 1, backgroundColor: COLOR_VIEW_BG}}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
            </View>
        );
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.loadData(1);
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.loadData(this.state.page+1);
    }

    loadData = (page) => {
        var thiz = this;
        var data = {status:0};
        if (this.state.searchStr.trim().length > 0) {
            data.keysword = this.state.searchStr.trim();
        }
        if (this.state.selectedButton != 0) {
            data.starttime = moment_(this.state.filterDateFrom + " " + this.state.filterTimeFrom).valueOf()/1000;
            data.endtime = moment_(this.state.filterDateTo + " " + this.state.filterTimeTo).valueOf()/1000;
        }
        HttpApi.getAdsHistory({token:this.props.userInfo.token, p:page, data:data}, (resp, error)=>{
            let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                if (resp && resp.length >= 0) {
                    //console.log(resp[0]);
                    if (page <= 1) {
                        thiz.state.dataAll = resp;
                        thiz.state.dataFailed = [];thiz.state.dataOK = []; thiz.state.dataSending=[]; thiz.state.dataWaiting=[];
                        thiz.state.dataAll.forEach(function (o, i) {
                           if (o.status == 1) {
                               thiz.state.dataWaiting.push(o);
                           }else if (o.status == 2) {
                               thiz.state.dataSending.push(o);
                           }else if (o.status == 3) {
                               thiz.state.dataOK.push(o);
                           }else{
                               thiz.state.dataFailed.push(o);
                           }
                        });
                    }else{
                        thiz.state.dataAll = thiz.state.dataAll.concat(resp);
                        resp.forEach(function (o, i) {
                            if (o.status == 1) {
                                thiz.state.dataWaiting.push(o);
                            }else if (o.status == 2) {
                                thiz.state.dataSending.push(o);
                            }else if (o.status == 3) {
                                thiz.state.dataOK.push(o);
                            }else{
                                thiz.state.dataFailed.push(o);
                            }
                        });
                    }
                }
            }
            thiz.setState({
                page:page,
                refreshState
            }, ()=> thiz._reloadTabData(thiz));
        });
    }

    _keyExtractor = (item, index) => item.id;

    _onChangeTab = (e) => {
        console.log(e.i);
        this.state.selectedTab = e.i;
        this._reloadTabData(this);
    }

    _reloadTabData = (ctx)=>{
        if (ctx.state.selectedTab == 0) {
            ctx.setState({data: ctx.state.dataAll});
        }else if (ctx.state.selectedTab == 1) {
            ctx.setState({data:ctx.state.dataWaiting})
        }else if (ctx.state.selectedTab == 2) {
            ctx.setState({data:ctx.state.dataSending});
        }else if (ctx.state.selectedTab == 3) {
            ctx.setState({data:ctx.state.dataOK});
        }else if (ctx.state.selectedTab == 4) {
            ctx.setState({data:ctx.state.dataFailed});
        }
    }

    _onPressItemButtons = (item: any, type:string) => {
        if (type == 'cha') {
            //find group
            console.log(item);
            let gdata = null;
            for (let i =0; i<DataCenter.adGroups.length; ++i) {
                if (DataCenter.adGroups[i].id == item.program_group) {
                    gdata = DataCenter.adGroups[i];
                    break;
                }
            }

            PopAlert.showLoadingView();
            HttpApi.getAdInfo({token:this.props.userInfo.token, program_id:item.id}, (resp, error) => {
                console.log("adInfo", resp);
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error + '');
                } else {
                    if (resp) {
                        if (typeof(resp.config) == 'string'){
                            DataCenter.editingAdPro = resp;
                            let d = JSON.parse(resp.config);
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

                            if (d && d.length == 1){ //正常类型
                                DataCenter.editingAdData = d;
                                let t = d[0].list_item[0].type;
                                t = (t == 'text' || t == 'text_pic') ? (resp.auto_adapt == '1' ? 'autotxt' : 'text') : (t == 'text_part' ? 'weather' : t);
                                //this.navigator.push({view: <EditProPage actions={this.props.actions} title="编辑广告" groupData={gdata} type={t} token={this.props.userInfo.token} isNew={false}/>})
                                let tt =new EditProPage({actions:this.props.actions, token:this.props.userInfo.token, groupData:gdata, type:t, isNew:false, autoGoNew:this.navigator});

                            }else if (d && d.length > 1) { //自由分区
                                DataCenter.editingAdData = d;
                                //this.navigator.push({view: <EditProPage actions={this.props.actions} title="编辑广告" groupData={gdata} type={'fenqu'} token={this.props.userInfo.token} isNew={false}/>})
                                let tt =new EditProPage({actions:this.props.actions, token:this.props.userInfo.token, groupData:gdata, type:t, isNew:fa, autoGoNew:this.navigator});

                            }
                        }
                    }
                }
            });
        }else if (type == 'fa') {
            this._showSendStatus(item);
        }else if (type == 'shan') {
            var thiz = this;
            let par = {token:thiz.props.userInfo.token, selectItem:{ad:[item.id]}};
            PopAlert.showLoadingView();
            HttpApi.deleteAdHistory(par, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    array_.remove(thiz.state.dataAll, function (o) {
                        return o.id == item.id;
                    });
                    thiz.forceUpdate();
                }
            });
        }else if (type == 'detail') {
            this._showSendOkDetail(item);
        }
    };

    _renderItem = ({item}) => (
        <MyListItem
            id={item.id}
            item={item}
            onPressButton={this._onPressItemButtons}
        />
    );

    _showDatePicker = async (type) => {
        if (this.state.selectedButton != 3) return;

        if (Platform.OS == 'ios') {
            if (this.dialogIosDate) {
                Overlay.show(this.dialogIosDate);
                return;
            }
            let overlayView = (
                <Overlay.PullView modal={false} rootTransform={'scale'} ref={v => this.dialogIosDate = v}>
                    {
                        this._genIosDatePickerChildren(type, "date")
                    }
                </Overlay.PullView>
            );
            Overlay.show(overlayView);
        }else {
            try {
                const {action, year, month, day} = await DatePickerAndroid.open({
                    // 要设置默认值为今天的话，使用`new Date()`即可。
                    // 下面显示的会是2020年5月25日。月份是从0开始算的。
                    date: new Date()
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                    if (type == 1) {
                        this.state.filterDateFrom = year + "-" + Utils.add0(month + 1) + '-' + Utils.add0(day);
                    } else {
                        this.state.filterDateTo = year + "-" + Utils.add0(month + 1) + '-' + Utils.add0(day);
                    }
                    var cc = this._genFilterChildren();
                    this.overlayPullView.setReload(cc);
                }
            } catch ({code, message}) {
                console.warn('Cannot open date picker', message);
            }
        }
    }

    _showTimePicker = async (type) => {
        if (this.state.selectedButton != 3) return;

        if (Platform.OS == 'ios') {
            if (this.dialogIosDate) {
                Overlay.show(this.dialogIosDate);
                return;
            }
            let overlayView = (
                <Overlay.PullView modal={false} rootTransform={'scale'} ref={v => this.dialogIosDate = v}>
                    {
                        this._genIosDatePickerChildren(type, "time")
                    }
                </Overlay.PullView>
            );
            Overlay.show(overlayView);
            return;
        }

        let op = {
            hour: 14,
            minute: 0,
            is24Hour: true, // 会显示为'2 PM'
        };
        if (type == 1) {
            op.hour = parseInt(this.state.filterTimeFrom.split(":")[0]);
            op.minute = parseInt(this.state.filterTimeFrom.split(":")[1]);
        }else{
            op.hour = parseInt(this.state.filterTimeTo.split(":")[0]);
            op.minute = parseInt(this.state.filterTimeTo.split(":")[1]);
        }
        try {
            const {action, hour, minute} = await TimePickerAndroid.open(op);
            if (action !== TimePickerAndroid.dismissedAction) {
                // 这里开始可以处理用户选好的时分两个参数：hour (0-23), minute (0-59)
                if (type == 1) {
                    this.state.filterTimeFrom = Utils.add0(hour) + ":" + Utils.add0(minute);
                }else{
                    this.state.filterTimeTo = Utils.add0(hour) + ":" + Utils.add0(minute);
                }
                var cc = this._genFilterChildren();
                this.overlayPullView.setReload(cc);
            }
        } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
        }
    }

    // This is for updating the Overlay of iOS date picker.
    _genIosDatePickerChildren = (type, mode)=> {
        let chi = (
            <View style={{width:ScreenWidth, minHeight:320, alignItems:'center', backgroundColor:'#fff'}}>
                <View style={{width:ScreenWidth, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between',
                    borderColor:'#aaa', borderBottomWidth:0.5, paddingLeft:20, paddingRight:20}}>
                    <Button
                        title="取消"
                        style={{borderColor:'#0000', backgroundColor:'#888'}}
                        titleStyle={{color:'#fff', fontSize:14}}
                        onPress={()=>{this.dialogIosDate&&this.dialogIosDate.close()}}
                    />
                    <Text style={{fontSize:16}}>选择日期</Text>
                    <Button
                        title="完成"
                        style={{borderColor:'#0000', backgroundColor:COLOR_NAV_BG}}
                        titleStyle={{color:'#fff', fontSize:14}}
                        onPress={()=>{
                            if (mode == 'time') {
                                let d = moment_(this.state.iosDate).format("HH:mm");
                                if (type == 1) {
                                    this.state.filterTimeFrom = d;
                                } else {
                                    this.state.filterTimeTo = d;
                                }
                            }else {
                                let d = moment_(this.state.iosDate).format("YYYY-MM-DD");
                                if (type == 1) {
                                    this.state.filterDateFrom = d;
                                } else {
                                    this.state.filterDateTo = d;
                                }
                            }
                            var cc = this._genFilterChildren(type);
                            this.overlayPullView.setReload(cc);
                            this.dialogIosDate&&this.dialogIosDate.close();
                        }}
                    />
                </View>
                <DatePickerIOS
                    ref = {(v)=>this.iosDatePicker = v}
                    style={{width:ScreenWidth, minHeight:260}}
                    date={this.state.iosDate}
                    mode={mode}
                    onDateChange={(d)=>{
                        this.state.iosDate = d;
                        this.dialogIosDate.setReload(this._genIosDatePickerChildren(type, mode));
                    }}
                />
            </View>
        );
        return chi;
    };

    // This is for updating the Overlay of Filter.
    _genFilterChildren = ()=> {
        return (
            <View style={{backgroundColor: '#fff', minWidth: 300, minHeight: 260}}>
                <View style={{flexDirection:'row', width:ScreenWidth, height:50, backgroundColor:COLOR_NAV_BG,
                    paddingLeft:20, paddingRight:10,paddingBottom:10, paddingTop:10,
                    justifyContent: 'space-between', alignItems: 'center'}}>
                    <SearchInput style={{flex:1,borderColor:'#0000', borderRadius:20}}
                                 placeholder='请输入LED屏名称或编号'
                                 clearButtonMode='always'
                                 value={this.state.searchStr}
                                 onChangeText={(text) => {
                                     this.setState({searchStr: text})
                                 }}
                    />
                    <Button title="收起"
                            titleStyle={{color:'white', fontSize:15}}
                            style={{borderColor:'#0000', backgroundColor:'#0000', width:60}}
                            onPress={()=>{
                                this.overlayPullView && this.overlayPullView.close();
                            }}/>
                </View>
                <View style={{padding:20}}>
                    <Text style={styles.dateTitle}>选择日期</Text>
                    <View style={this.state.selectedButton == 3 ? styles.dateContainerSel : styles.dateContainer}>
                        <Text style={this.state.selectedButton == 3 ? [styles.dateTitle, {color:'orange', width:40, paddingLeft:10}] : [styles.dateTitle, {color:'gray', width:40, paddingLeft:10}]}>从</Text>
                        <Button titleStyle={styles.dateTitle} title={this.state.filterDateFrom}
                                style={{flex:1, borderColor:'#0000', backgroundColor:'#0000'}}
                                onPress={()=>this._showDatePicker(1)}/>
                        <View style={this.state.selectedButton == 3 ? {width:1, height:50, backgroundColor:'orange'}:{width:1, height:50, backgroundColor:'#aaa'}}/>
                        <Button titleStyle={styles.dateTitle} title={this.state.filterTimeFrom}
                                style={{width:80, borderColor:'#0000', backgroundColor:'#0000'}}
                                onPress={()=>this._showTimePicker(1)}/>
                    </View>
                    <View style={this.state.selectedButton == 3 ?[styles.dateContainerSel, {marginTop:5}] : [styles.dateContainer, {marginTop:5}]}>
                        <Text style={this.state.selectedButton == 3 ? [styles.dateTitle, {color:'orange', width:40, paddingLeft:10}] : [styles.dateTitle, {color:'gray', width:40, paddingLeft:10}]}>到</Text>
                        <Button titleStyle={styles.dateTitle} title={this.state.filterDateTo}
                                style={{flex:1, borderColor:'#0000', backgroundColor:'#0000'}}
                                onPress={()=>this._showDatePicker(2)}/>
                        <View style={this.state.selectedButton == 3 ? {width:1, height:50, backgroundColor:'orange'}:{width:1, height:50, backgroundColor:'#aaa'}}/>
                        <Button titleStyle={styles.dateTitle} title={this.state.filterTimeTo}
                                style={{width:80, borderColor:'#0000', backgroundColor:'#0000'}}
                                onPress={()=>this._showTimePicker(2)}/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', height:40, marginTop:6}}>
                        <Button style={this.state.selectedButton == 0 ? styles.dateBtnsSelect : styles.dateBtnsNormal}
                                titleStyle={this.state.selectedButton == 0 ? styles.dateBtnsTitleSelect : styles.dateBtnsTitleNormal}
                                title="全部"
                                onPress={()=>{
                                    this.state.selectedButton = 0;
                                    var cc = this._genFilterChildren();
                                    this.overlayPullView.setReload(cc);
                                }}
                        />
                        <Button style={this.state.selectedButton == 1 ? styles.dateBtnsSelect : styles.dateBtnsNormal}
                                titleStyle={this.state.selectedButton == 1 ? styles.dateBtnsTitleSelect : styles.dateBtnsTitleNormal}
                                title="一周内"
                                onPress={()=>{
                                    this.state.selectedButton = 1;
                                    this.state.filterDateTo = moment_().format('YYYY-MM-DD');
                                    this.state.filterDateFrom = moment_().day(-7).format('YYYY-MM-DD');
                                    this.state.filterTimeFrom = '00:01';
                                    this.state.filterTimeTo = '23:59';
                                    var cc = this._genFilterChildren();
                                    this.overlayPullView.setReload(cc);
                                }}
                        />
                        <Button style={this.state.selectedButton == 2 ? styles.dateBtnsSelect : styles.dateBtnsNormal}
                                titleStyle={this.state.selectedButton == 2 ? styles.dateBtnsTitleSelect : styles.dateBtnsTitleNormal}
                                title="半月内"
                                onPress={()=>{
                                    this.state.selectedButton = 2;
                                    this.state.filterDateTo = moment_().format('YYYY-MM-DD');
                                    this.state.filterDateFrom = moment_().day(-15).format('YYYY-MM-DD');
                                    this.state.filterTimeFrom = '00:01';
                                    this.state.filterTimeTo = '23:59';
                                    var cc = this._genFilterChildren();
                                    this.overlayPullView.setReload(cc);
                                }}
                        />
                        <Button style={this.state.selectedButton == 3 ? styles.dateBtnsSelect : styles.dateBtnsNormal}
                                titleStyle={this.state.selectedButton == 3 ? styles.dateBtnsTitleSelect : styles.dateBtnsTitleNormal}
                                title="自定义"
                                onPress={()=>{
                                    this.state.selectedButton = 3;
                                    var cc = this._genFilterChildren();
                                    this.overlayPullView.setReload(cc);
                                }}
                        />
                    </View>
                </View>
                <View style={{flexDirection:'row', height:50, borderTopWidth:1, borderColor:'#aaa'}}>
                    <Button title="重置" style={{flex:1, backgroundColor:'#0000', borderWidth:0}} titleStyle={{color:'#aaa', fontSize:15}}
                        onPress={()=>{
                            Keyboard.dismiss();
                            this.state.searchStr = "";
                            this.state.selectedButton = 0;
                            this.overlayPullView && this.overlayPullView.close();
                            this.loadData(1);
                        }}
                    />
                    <Button title="确定" style={{flex:1, backgroundColor:COLOR_NAV_BG, borderWidth:0, borderRadius: 0}} titleStyle={{color:'white', fontSize:15}}
                        onPress={()=>{
                            Keyboard.dismiss();
                            this.overlayPullView && this.overlayPullView.close();
                            this.loadData(1);
                        }}
                    />
                </View>
            </View>
        );
    }

    _showFilter(){
        if (this.overlayPullView) {
            Overlay.show(this.overlayPullView);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'top'} modal={false} rootTransform={'scale'} ref={v => this.overlayPullView = v}
            children={this._genFilterChildren()}>

            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    _showSendStatus(item) {
        if (this.overlayPopViewStatus)
            return;
        let prg = (item.progress ? item.progress : "0")/100.0;
        let strP = "当前广告已发送" + (item.progress ? item.progress : "0") + "%";
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                ref={v => this.overlayPopViewStatus = v}
            >
                <View style={{backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 5}}>
                    <View style={{height:44, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', borderColor:'#eee', borderBottomWidth:1}}>
                        <Icon.Button name="cross" size={30} color="#ddd" backgroundColor="#0000" underlayColor="#0000"
                                     onPress={()=> {
                                         this.refBarProgress = null;
                                         this.refTxtProgress = null;
                                         this.overlayPopViewStatus.close();
                                         this.overlayPopViewStatus = null;
                                     }}/>
                        <Text style={{color:'#888', fontSize:17, flex:1, textAlign:'center', marginRight:60}}>发送进度</Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', flex:1, marginTop:-10}}>
                        <TextInput ref={v=>this.refTxtProgress = v} editable={false} underlineColorAndroid="transparent"
                                   style={{color:'orange', fontSize:14, margin:10, width:150, textAlign:'center'}}
                                   defaultValue={strP}/>
                        <Progress.Bar ref={v=>this.refBarProgress = v} unfilledColor="#eee" color='#00ca05' progress={prg} width={200} height={16} borderRadius={8} borderColor="#eee" />
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }

    _showSendOkDetail(item) {
        let end = moment_.unix(item.etime).format('YYYY-MM-DD HH:mm:ss') + "";
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                ref={v => this.overlayPopView = v}
            >
                <View style={{backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 5}}>
                    <View style={{height:44, flexDirection:'row', alignItems:'center', justifyContent:'flex-start', borderColor:'#eee', borderBottomWidth:1}}>
                        <Icon.Button name="cross" size={30} color="#ddd" backgroundColor="#0000" underlayColor="#0000"
                                     onPress={()=>this.overlayPopView.close()}/>
                        <Text style={{color:'#888', fontSize:17, flex:1, textAlign:'center', marginRight:60}}>发送详情</Text>
                    </View>
                    <View style={{justifyContent:'center', alignItems:'center', flex:1}}>
                        <Image source={require('../../../assets/me/ic_detail_send_ok.png')} />
                        <View style={{flex:1, flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start'}}>
                            <Text>{"    "+item.ctime}</Text><Text>{'        '}</Text><Text>{end+"    "}</Text>
                        </View>
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLOR_VIEW_BG,
    },
    fakeTabView: {
        width:ScreenWidth, height:0,
    },
    cellItem: {
        backgroundColor: '#fff', height: 150, marginTop: 4, marginBottom: 4
    },
    cellTop: {
        flexDirection: 'row', paddingLeft: 10, paddingRight: 10,
        height: 30,
        alignItems: 'center', justifyContent: 'space-between'
    },
    cellMiddle: {
        backgroundColor:'#f9f9f9',
        flexDirection: 'row', paddingLeft: 20, paddingRight: 10,
        height: 80,
        alignItems: 'center', justifyContent: 'space-between'
    },
    cellBottom: {
        flexDirection: 'row', paddingLeft: 10, paddingRight: 10,
        height: 40,
        alignItems: 'center', justifyContent: 'flex-end',
        borderTopWidth:0.6, borderBottomWidth:0.6,
        borderColor: '#dbdbdb',
    },
    dateContainer: {
        flexDirection:'row',
        borderColor:'#aaa',
        borderWidth: 1,
        borderRadius: 6,
        alignItems:'center',
        height: 50,
    },
    dateContainerSel: {
        flexDirection:'row',
        borderColor:'orange',
        borderWidth: 1,
        borderRadius: 6,
        alignItems:'center',
        height: 50,
    },
    dateTitle: {
        color:'#333', fontSize:16, fontWeight:'300'
    },
    dateBtnsNormal: {
        width: 70,
        height: 30,
        backgroundColor:'#0000',
        borderColor:'#aaa',
    },
    dateBtnsSelect: {
        width: 70,
        height: 30,
        backgroundColor:'#0000',
        borderColor:'orange',
    },
    dateBtnsTitleNormal: {
        fontSize: 12,
        color:'black',
    },
    dateBtnsTitleSelect: {
        fontSize: 12,
        color:'orange',
    }
});

module.exports = AdsHistoryPage;
