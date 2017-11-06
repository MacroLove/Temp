import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, InteractionManager
} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import Slider from 'react-native-slider';
import IconBadge from 'react-native-icon-badge';
import EtIcon from 'react-native-vector-icons/Entypo';
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    TeaNavigator,
    Toast,
    Overlay
} from 'teaset';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import { Col, Row, Grid } from "react-native-easy-grid";
import {COLOR_NAV_BG} from "../../../constants/Colors";
import LocationSearch from '../../../widgets/LocationSearch';
import CheckBox from '../../../widgets/CheckBox';
import CmdRecordList from './cmdRecord';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import PTRListView, {RefreshState} from '../../../widgets/PTRListView';
import ImageButton from '../../../widgets/ImageButton';
import MapView from 'react-native-maps';
import flagPinkImg from '../../../assets/map/flag_red.png';
import Utils from '../../../Utils/Utils';
import WifiLedSettings from "./wifiLedSettings";
import EditPcPage from '../led/editLedPc';
import PasswordInput from "../../../widgets/PasswordInput";

var array_ = require('lodash/array');

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

let ASPECT_RATIO = ScreenWidth / ScreenHeight;
let LATITUDE = 39.902895;
let LONGITUDE = 116.427915;
let LATITUDE_DELTA = 0.0922;
let LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let tabIconAd0 = require('../../../assets/gaoji/ic_ad0.png');
let tabIconAd1 = require('../../../assets/gaoji/ic_ad1.png');
let tabIconGj0 = require('../../../assets/gaoji/ic_setting0.png');
let tabIconGj1 = require('../../../assets/gaoji/ic_setting1.png');
let tabIconDw0 = require('../../../assets/gaoji/ic_loc0.png');
let tabIconDw1 = require('../../../assets/gaoji/ic_loc1.png');

const ColorSending="#0b8ded";
const ColorFail = "#ff0000";
const ColorOk = "#18ab3f";
const ColorWaiting="#999999";
let MAP_STATUS = {1:"等待发送", 2:"正在发送", 3:"成功", 4:"失败"};
let MAP_STATUS_COLOR = {1:ColorWaiting, 2:ColorSending, 3:ColorOk, 4:ColorFail};

class MyListItem extends React.PureComponent {
    constructor(props) {
        super(props);
    }

    render() {
        var stStyl = {color: MAP_STATUS_COLOR[this.props.item.status], fontSize: 14};
        return (
            <View style={styles.cellMiddle}>
                <View style={{position:'absolute', width:ScreenWidth, height:80-20, paddingRight:20,
                    alignItems:'flex-end', justifyContent:'space-between', backgroundColor:'#0000'}}>
                    {/*<Text style={stStyl}>{MAP_STATUS[this.props.item.status]}</Text>*/}
                    <Text style={{color: 'gray', fontSize: 12}}>{this.props.item.ctime}</Text>
                </View>
                <CheckBox color="#ddd" size={25} checked={this.props.checked} onCheckBoxPressed={(c) => {
                    this.props.onPressButton && this.props.onPressButton(this.props.item, c);
                }}/>
                <IconBadge
                    MainElement={
                        <Image style={{margin: 8, resizeMode: 'contain'}}
                               source={require('../../../assets/ic_his_cellIcon.png')}/>
                    }
                    BadgeElement={
                        <Text style={{color: '#fff', fontSize:10}}>{this.props.item.badge}</Text>
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
                    hidden
                />
                <View style={{flex:1, marginLeft:10, marginRight:10}}>
                    <Text style={{color: 'black', fontSize: 15, fontWeight:'200', flex:0.3}}>{'广告编号：'+ (this.props.item.no)}</Text>
                    <Text style={{color: 'gray', fontSize: 14, flex:0.3}}>{'名称：'+ this.props.item.program_name}</Text>
                    <Text style={{color: 'gray', fontSize: 12, flex:0.3, textAlign:"right"}}>{''+ this.props.item.ctime}</Text>
                </View>
            </View>
        )
    }
}

/**
 * 高级 page
 * */
class EditMorePage extends NavigationPage {
    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "高级设置",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    renderNavigationTitle() {
        return (
            <View style={{alignItems:'center'}}>
                <Text style={{color:'#fff', fontSize:16, fontWeight:'bold'}}>
                    {""+this.props.device.device}
                </Text>
                <Text style={{color:'#fff', fontSize:12}}>
                    {((this.props.device.title || "高级设置"))}
                </Text>
            </View>
        );
    }

    constructor(props) {
        super(props);
        this.state = {
            initTab: props.initTab,
            adsData:[],
            page: 0,
            selectAll: false,
            selectedAds:[],
            refreshState:RefreshState.Idle,
            strLedName: props.device.title+"",

            locationChanged: false,
            locInfo:{
                info:'',
                lat:0,
                lng:0,
            },
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            marker: {
                title:'定位中...',
                coordinate:{
                    latitude:LATITUDE,
                    longitude:LONGITUDE,
                },
                key:'0',
            },
        };

        let thiz = this;
        InteractionManager.runAfterInteractions(()=>{
            thiz._onChangeTab(thiz.state.initTab);
        });
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
            <View style={{flex:1, backgroundColor:'#f8f8f8'}}>
                <ScrollableTabView
                    style={{backgroundColor:'white'}}
                    tabBarTextStyle={{fontSize: 15}}
                    tabBarActiveTextColor={COLOR_NAV_BG}
                    tabBarInactiveTextColor="#b3b3b3"
                    initialPage={this.state.initTab}
                    renderTabBar={() =>
                        <DefaultTabBar underlineStyle={{backgroundColor: COLOR_NAV_BG}} style={{backgroundColor:'#f8f8f8', height:80}}
                                       renderTabIcon={(page, isTabActive)=>{
                                            if (page == 0)
                                                return <Image style={{flex:1}} source={isTabActive ? tabIconAd1 : tabIconAd0} resizeMode='contain'/>
                                            if (page == 1)
                                                return <Image style={{flex:1}} source={isTabActive ? tabIconGj1 : tabIconGj0} resizeMode='contain'/>
                                            if (page == 2)
                                                return <Image style={{flex:1}} source={isTabActive ? tabIconDw1 : tabIconDw0} resizeMode='contain'/>
                                       }}
                        />
                    }
                    onChangeTab={(e) => (this._onChangeTab(e.i))}
                >
                    <View tabLabel="当前广告" style={{flex:1}}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingLeft:10, paddingRight:10}}>
                            <CheckBox color="#ddd" size={25} checked={this.state.selectAll} onCheckBoxPressed={(c) => {
                                this._onClickSelectAll(c);
                            }}>
                                <Text>{'  全部'}</Text>
                            </CheckBox>
                            <ImageButton
                                image={require('../../../assets/gaoji/ic_trash.png')}
                                onPress={()=>{
                                    this._onClickDeleteAds();
                                }}
                            />
                        </View>
                        <PTRListView
                            style={{flex: 1}}
                            data={this.state.adsData}
                            extraData={this.state}
                            keyExtractor={this._keyExtractor}
                            renderItem={this._renderItem}
                            refreshState={this.state.refreshState}
                            onHeaderRefresh={this.onHeaderRefresh}
                            // onFooterRefresh={this.onFooterRefresh}
                        />
                    </View>
                    <ScrollView tabLabel="高级功能" style={{height:ScreenWidth, width:ScreenWidth}}>
                        <Grid>
                            <Col style={{alignItems:'center'}}>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('kqpm')}>
                                        <Image source={require('../../../assets/gaoji/ic_kqpm.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('pc')}>
                                        <Image source={require('../../../assets/gaoji/ic_pc.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('del')}>
                                        <Image source={require('../../../assets/gaoji/ic_delled.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('tbgx')}>
                                        <Image source={require('../../../assets/gaoji/ic_tbgx.png')}/>
                                    </TouchableOpacity>
                                </Row>
                            </Col>
                            <Col style={{borderColor:'#eee', borderLeftWidth:1, alignItems:'center'}}>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('gbpm')}>
                                        <Image source={require('../../../assets/gaoji/ic_gbpm.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('qcgg')}>
                                        <Image source={require('../../../assets/gaoji/ic_qcgg.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('zlls')}>
                                        <Image source={require('../../../assets/gaoji/ic_lsjl.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('cmm')}>
                                        <Image source={require('../../../assets/gaoji/ic_cmm.png')}/>
                                    </TouchableOpacity>
                                </Row>
                            </Col>
                            <Col style={{borderColor:'#eee', borderLeftWidth:1, alignItems:'center'}}>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('zdjs')}>
                                        <Image source={require('../../../assets/gaoji/ic_zdjs.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('pmld')}>
                                        <Image source={require('../../../assets/gaoji/ic_pmld.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('wifiset')}>
                                        <Image source={require('../../../assets/gaoji/ic_wifiset.png')}/>
                                    </TouchableOpacity>
                                </Row>
                                <Row style={styles.gridRow}>
                                    <TouchableOpacity onPress={()=>this._onPressGaojiButton('dkf')}>
                                        <Image source={require('../../../assets/gaoji/ic_dkf.png')}/>
                                    </TouchableOpacity>
                                </Row>
                            </Col>
                        </Grid>
                    </ScrollView>
                    <View tabLabel="定位" style={{flex:1}}>
                        <MapView
                            ref = {v=>this.mapView = v}
                            style={styles.map}
                            cacheEnabled={false}
                            initialRegion={this.state.region}
                            onRegionChangeComplete={(e)=>{
                                if (e && e.latitude) {
                                    this._onMapRegionChanged(e);
                                }
                            }}
                        >
                                <MapView.Marker
                                    title={this.state.marker.title || "定位中..."}
                                    image={flagPinkImg}
                                    key={this.state.marker.key}
                                    coordinate={this.state.marker.coordinate}
                                />
                        </MapView>

                        <Image
                            style={{position:"absolute", left:ScreenWidth/2-10, top:ScreenHeight/2-ScreenWidth/3+40, width:20, height:20}}
                            source={require("../../../assets/map/ic_map_anchor.png")}
                        />

                        <LocationSearch onSelectAddress={(data)=>{
                            if (typeof(data.location) != 'string')
                                return;
                            var loc = data.location.split(',');
                            this.state.marker = {coordinate:{latitude:parseFloat(loc[1]), longitude: parseFloat(loc[0])},
                                title:""+data.district + "" + data.address + "" + data.name};
                            this.mapView && this.mapView.animateToRegion({
                                latitude:parseFloat(loc[1]), longitude:parseFloat(loc[0]),
                                latitudeDelta: LATITUDE_DELTA,
                                longitudeDelta: LONGITUDE_DELTA,});
                            this.state.locationChanged = true;
                            this.forceUpdate();
                        }}/>
                        {
                            this.state.locationChanged ? <Button title="保存位置" style={{width:ScreenWidth, height:44, borderColor:'#0000',
                                borderWidth:0, backgroundColor:'#39ceff'}}  titleStyle={{color:'#fff', fontSize:16}} onPress={()=>{
                                this._onClickSavePostion();
                            }}/> : null
                        }
                    </View>
                </ScrollableTabView>
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
        HttpApi.getLedAds({token:this.props.userInfo.token,device:this.props.device.device}, (resp, error)=>{
            //console.log(resp);
            let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                if (resp && resp.length > 0) {
                    if (page <= 1) {
                        thiz.state.adsData = resp;
                    }else{
                        thiz.state.adsData = thiz.state.adsData.concat(resp);
                    }
                }
            }
            thiz.setState({
                page:page,
                refreshState
            });
        });
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) =>{
        var cc = this.state.selectedAds.indexOf(item.id) != -1;
        return (
            <MyListItem
                id={item.id}
                item={item}
                checked={cc}
                onPressButton={this._onPressItemButtons}
            />
        );
    }

    _onPressItemButtons = (item, checked) => {
        if (checked) {
            if (this.state.selectedAds.indexOf(item.id) == -1) {
                this.state.selectedAds.push(item.id);
            }
        }else{
            if (this.state.selectedAds.indexOf(item.id) != -1) {
                array_.remove(this.state.selectedAds, function (o) {
                    return o == item.id;
                });
            }
            this.setState({selectAll:false});
        }
    }

    _onClickSelectAll = (c) => {
        this.state.selectedAds = [];
        if (c) {
            var thiz = this;
            this.state.adsData.forEach(function (o) {
                thiz.state.selectedAds.push(o.no);
            });
        }
        this.setState({selectAll:c});
    }

    _onChangeTab = (selectedTab) => {
        if (selectedTab == 0 && this.state.adsData.length == 0) {
            this.loadData(1);
        }else if (selectedTab == 2){
            if (this.state.locInfo.lat == 0 || this.state.locInfo.lng == 0) {
                var thiz = this;
                HttpApi.getDeviceGps({
                    token: thiz.props.userInfo.token,
                    devid: thiz.props.device.device
                }, (resp, error) => {
                    console.log("LOcation----",resp);
                    if (error) {
                        PopAlert.showAlertView("错误", "无法获取设备位置！" + error);
                    } else if(resp && resp[this.props.device.device] && resp[this.props.device.device].lat){
                        resp = resp[this.props.device.device];
                        thiz.state.region.longitude = thiz.state.locInfo.lng = parseFloat(resp.lon);
                        thiz.state.region.latitude = thiz.state.locInfo.lat = parseFloat(resp.lat);
                        thiz.state.locInfo.info = resp.info;
                        thiz.state.marker = {coordinate:{latitude:thiz.state.locInfo.lat, longitude: thiz.state.locInfo.lng}, title:thiz.state.locInfo.info};

                        thiz.forceUpdate();
                    } e
                });
            }
        }
    }

    _onPressGaojiButton = (str) => {
        if (str == 'zlls') {
            this.navigator.push({view:<CmdRecordList userInfo={this.props.userInfo} device={this.props.device}/>})
        }else if (str == 'kqpm') {
            PopAlert.showLoadingView();
            let ps = {token:this.props.userInfo.token, data:{instruct:'power', ids_dev:[this.props.device.device], type:1,}};
            HttpApi.sendCmd(ps, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error){
                    PopAlert.showAlertView("错误", error+"");
                }else {
                    Toast.success(""+resp);
                }
            });
        }else if (str == 'gbpm') {
            PopAlert.showLoadingView();
            let ps = {token:this.props.userInfo.token, data:{instruct:'power', ids_dev:[this.props.device.device], type:0,}};
            HttpApi.sendCmd(ps, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error){
                    PopAlert.showAlertView("错误", error+"");
                }else {
                    Toast.success(""+resp);
                }
            });
        }else if (str == 'zdjs') {
            PopAlert.showLoadingView();
            let ps = {token:this.props.userInfo.token, data:{instruct:'timing', ids_dev:[this.props.device.device]}};
            HttpApi.sendCmd(ps, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error){
                    PopAlert.showAlertView("错误", error+"");
                }else {
                    Toast.success(""+resp);
                }
            });
        }else if (str == 'qcgg') {
            PopAlert.showAlertView2("清除广告", "确定要清除全部广告吗？", null, ()=>{
                PopAlert.dismissAlertView();
                PopAlert.showLoadingView();
                let devids = [this.props.device.device]; // this.props.device.server_version == 4 ? {4:[this.props.device.device]} : {5:[this.props.device.device]};
                let ps = {token:this.props.userInfo.token, data:{instruct:'delete', ids_dev:devids, type:1}};
                console.log(ps)
                HttpApi.sendCmd(ps, (resp, error)=>{
                    PopAlert.stopLoadingView();
                    if (error){
                        PopAlert.showAlertView("错误", error+"");
                    }else {
                        Toast.success(""+resp);
                    }
                });
            });
        }else if (str == 'pmld') {
            var thiz = this;
            thiz.vv = "10";
            let chid = (
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1, marginTop:8}}>
                    <TextInput underlineColorAndroid="transparent" editable={false} ref={v=>thiz.pmldValTxt = v}
                               style={{fontSize:12, color:'red', textAlign:'center'}} defaultValue={"10"}/>
                <View style={{flexDirection:'row', alignItems:'center'}}>
                    <Text style={{color:'#333', margin:5}}>{"1"}</Text>
                    <Slider
                        maximumValue={15}
                        minimumValue={1}
                        step={1}
                        value={10}
                        trackStyle={PopAlert.SliderStyle.track}
                        thumbStyle={PopAlert.SliderStyle.thumb}
                        minimumTrackTintColor='#00ff00'
                        onValueChange={(v)=>{
                            thiz.vv = v;
                            thiz.pmldValTxt && thiz.pmldValTxt.setNativeProps({text:v+""});
                        }}
                    />
                    <Text style={{color:'#333', margin:5}}>{"15"}</Text>
                </View>
            </View>
            );

            PopAlert.showAlertView2("屏体亮度", chid, ()=>{}, ()=>{
                PopAlert.dismissAlertView();
                var v = thiz.vv;
                PopAlert.showLoadingView();
                let ps = {token:this.props.userInfo.token, data:{instruct:'light', ids_dev:[this.props.device.device],
                    light_type:0, light:v
                }};
                HttpApi.sendCmd(ps, (resp, error)=>{
                    PopAlert.stopLoadingView();
                    if (error){
                        PopAlert.showAlertView("错误", error+"");
                    }else {
                        Toast.success(""+resp);
                    }
                });
            });
        }else if (str == 'del') {
            var thiz = this;
            PopAlert.showAlertView2("删除LED屏", "确定要删除该LED屏吗？", null, ()=>{
                PopAlert.dismissAlertView();
                PopAlert.showLoadingView();
                let ps = {token:this.props.userInfo.token, devid:[this.props.device.device]};
                HttpApi.deleteLed(ps, (resp, error)=>{
                    PopAlert.stopLoadingView();
                    if (error){
                        PopAlert.showAlertView("错误", error+"");
                    }else {
                        Toast.success(""+resp);
                        thiz.props.onDel && thiz.props.onDel();
                        thiz.navigator.pop();
                    }
                });
            })
        }else if (str == 'tbgx') {
            PopAlert.showLoadingView();
            var thiz = this;
            let ps = {token:this.props.userInfo.token};
            HttpApi.syncData(ps, (resp, error, data) =>{
                PopAlert.stopLoadingView();
               if (resp) {
                   Toast.success("更新成功");
                   thiz.props.onDel && thiz.props.onDel();
                   thiz.navigator.pop();
               }else{
                   PopAlert.showAlertView("更新失败", error+"");
               }
            });
        }else if (str == 'cmm') {
            var thiz = this;
            let chid = (
                <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center', flex:1, marginTop:8}}>
                    <View style={{flexDirection:'row', alignItems:'center'}}>
                        <Input
                            style={{backgroundColor:'white', borderColor:'#eee', borderWidth:1, borderRadius:5, width:200, height:36, textAlign:'center', textAlignVertical:'center'}}
                            defaultValue={this.state.strLedName}
                            onChangeText={(t)=>(this.state.strLedName=t)}
                            maxLength={20}
                            multiline={false}
                        />
                    </View>
                </View>
            );

            PopAlert.showAlertView2("重命名", chid, null, ()=>{
                if (thiz.state.strLedName.length <= 0) {
                    return;
                }
                PopAlert.dismissAlertView();
                PopAlert.showLoadingView();
                let ps = {token:this.props.userInfo.token, devid:this.props.device.device, title:thiz.state.strLedName};
                HttpApi.renameLed(ps, (resp, error)=>{
                    PopAlert.stopLoadingView();
                    if (error){
                        PopAlert.showAlertView("错误", error+"");
                    }else {
                        Toast.success(""+resp);
                        thiz.props.device.title = thiz.state.strLedName;
                        thiz.forceUpdate();
                        thiz.props.onDel && thiz.props.onDel('reloadUI');
                    }
                });
            });
        }else if (str == 'wifiset') {
            this.navigator.push({view:<WifiLedSettings/>});
        }else if (str == 'pc') {
            let item = this.props.device;
            let gD = this.props.groupData;

            let oneMin = 1000 * 60;
            if (this.state.lastEditPcTime != 0 && (new Date().getTime() - this.state.lastEditPcTime) < oneMin) {
                this.navigator.push({view: <EditPcPage userInfo={this.props.userInfo} device={item} groupData={gD}/>});
                return;
            }
            this.state.pswPC = "";
            PopAlert.showAlertView("修改屏参请输入密码", (
                <View style={{flex: 1, alignItems: 'center'}}>

                    <PasswordInput style={{width: 140, marginTop: 10, marginLeft: 20, marginRight: 20}}
                                   maxLength={3}
                                   secureTextEntry={false}
                                   defaultValue={this.state.pswPC}
                                   onChange={text => {
                                       this.state.pswPC = text;
                                       if (text.length == 3) Keyboard.dismiss();
                                   }}
                    />
                    <Text style={{color: 'orange', fontSize: 13, margin: 10}}>非专业人士请勿修改</Text>
                    <Button
                        style={{backgroundColor: '#1998e6', borderColor: '#0000', width: 160}}
                        titleStyle={{color: 'white', fontSize: 15}}
                        title='确定'
                        onPress={() => {
                            Keyboard.dismiss();
                            PopAlert.dismissAlertView();
                            if (this.state.pswPC != '168') {
                                Toast.sad("密码错误");
                                return;
                            }
                            this.state.lastEditPcTime = new Date().getTime();
                            this.navigator.push({view: <EditPcPage userInfo={this.props.userInfo} device={item} groupData={gD}/>});
                        }}
                    />
                </View>
            ), null, true);
        }else if (str == 'dkf') {

        }
    }

    _onClickDeleteAds = () => {
        if (this.state.selectedAds.length == 0) {
            PopAlert.showAlertView("提示",'请选择要删除的广告！');
        }else{
            PopAlert.showLoadingView();
            var thiz = this;
            let devids = [this.props.device.device];//this.props.device.server_version == 4 ? {4:[this.props.device.device]} : {5:[this.props.device.device]};
            let ps = {token:this.props.userInfo.token, data:{instruct:'delete', devids:devids, type:0, clear_proNo:this.state.selectedAds}};
            PopAlert.showAlertView2("清除广告", "确定要清除选中广告吗？", null, ()=>{
                PopAlert.dismissAlertView();
                PopAlert.showLoadingView();
                HttpApi.sendCmd(ps, (resp, error)=>{
                    PopAlert.stopLoadingView();
                    if (error){
                        PopAlert.showAlertView("错误", error+"");
                    }else {
                        Toast.success(""+resp);
                        array_.remove(thiz.state.adsData, function (o) {
                            return thiz.state.selectedAds.indexOf(o.no) != -1;
                        });
                        thiz.state.selectedAds = [];
                        thiz.forceUpdate();
                    }
                });
            });
        }
    }

    _onClickSavePostion = ()=>{
        this.state.locInfo.info = this.state.marker.title;
        this.state.locInfo.lat = this.state.marker.coordinate.latitude;
        this.state.locInfo.lng = this.state.marker.coordinate.longitude;
        Utils.convertMapToGps({lat:this.state.locInfo.lat, lng:this.state.locInfo.lng}, (loc)=>{
            this.state.locInfo.lng = loc.lng;
            this.state.locInfo.lat = loc.lat;
            HttpApi.setGpsInfo({token:this.props.userInfo.token, devid:this.props.device.device, data:this.state.locInfo}, (resp, error)=>{
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                } else {
                    Toast.success("保存成功");
                }
            });
        });
    }

    _onMapRegionChanged = (e) => {
        let thiz = this;
        this.state.locationChanged = true;
        this.setState({marker:{coordinate:{latitude:e.latitude, longitude: e.longitude}, title:"定位中..."}}, ()=>{
            HttpApi.getGpsAddressFromLoc(e.latitude, e.longitude, (resp)=>{
                console.log("got code----",resp);
                if (resp) {
                    thiz.setState({marker:Object.assign(thiz.state.marker, {title:resp+""})});
                }
            });
        });
    }
}

const styles = StyleSheet.create({

    gridRow: {
        height: ScreenWidth/3,
        width: ScreenWidth/3,
        alignItems:'center',
        justifyContent:'center',
        borderColor:'#eee',
        borderBottomWidth:1,
    },

    cellMiddle: {
        width:ScreenWidth, height: 80,backgroundColor:'#f9f9f9',
        flexDirection: 'row', paddingLeft: 10, paddingRight: 20, paddingTop:10, paddingBottom:4,
        borderBottomWidth:0.7, borderColor:"#ddd",
        alignItems: 'center', justifyContent: 'flex-start'
    },

    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

module.exports = EditMorePage;