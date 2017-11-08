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
    PullPicker,
    Toast
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_NAV_BG} from "../../../constants/Colors";
import DataCenter from '../../../models/DataCenter';
import * as Modals from '../../../models/Models';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import YsWebSocket from "../../../network/YsWebSocket";
import {Utils, GPSUtils} from '../../../Utils/Utils';
import {kLastLedParam, kLastLedParam4Ad, kLastProgramParam} from "../../../constants/Defines";

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
var isVer4 = false;

/**
 * Edit ping can page
 * */
class EditPcPage extends NavigationPage {
    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "编辑屏参",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        let is4 = (props.device.server_version == 4);
        isVer4 = is4;
        this.state = {
            device:Object.assign({}, props.device, {pola:0, oe:0, scan:is4 ? 0 : 6, gray:0, background:0}), //for maybe cancel. AND add missing props for ws.
            ws: null,
            groupData : props.groupData,
            configScans: (is4 ? DataCenter.configs.TYPE_SCAN : DataCenter.configs.TRENDS) || [],
        };
        this.state.wsKey = Utils.guid();
        console.log(this.state.wsKey);
        YsWebSocket.addCallback({key:this.state.wsKey, cmd:'get_instruct', callback:this._onSocketCallbak});

        // 获取上次屏参
        let kk = kLastLedParam;
        let thiz = this;
        TGStorage.load({
            key: kk,
            id: kk
        }).then(ret => {
            if (ret&&ret.data) {
                thiz.state.device.pola = ret.data.polar_data || 0;
                thiz.state.device.oe = ret.data.polar_oe || 0;
                thiz.state.device.scan = is4 ? (ret.data.type_scan || 0) : (ret.data.trend == undefined ? 6 : 0);
                thiz.state.device.gray = ret.data.gray || 0;
                thiz.state.device.background = parseInt(ret.data.background) || 0;
                thiz.forceUpdate();
            }
        }).catch(err => {
        });
    }

    componentDidMount() {
    }

    componentWillUnmount() {
        YsWebSocket.removeCallback(this.state.wsKey);
    }

    _loadPcData = ()=>{
        let ps = {token:this.props.userInfo.token, data:{instruct:'get_param_dev', ids_dev:[this.props.device.device]}};
        PopAlert.showLoadingView();
        HttpApi.sendCmd(ps, (resp, error)=>{
            PopAlert.stopLoadingView();
            if (error){
                PopAlert.showAlertView("错误", error+"");
            }else {
                // wait for websocket data.
            }
        });
    };

    _onSocketCallbak = (msg, cmd) => {
        //{"cmd":"get_instruct",
        // "msg":{"ids_dev":"1176150005","sno":1000052261,
        //      "data":{"width":128,"height":32,"polar_data":0,"polar_oe":1,"type_color":1,"gray":0,"decoder":1,"type_scan":4,"frame_line":1,"segment":1,"delay_frame":10,"rate_frame":255,"backgroup":1,"count_io":12,"data_out":[0,1,2,3,4,5,6,7,8,9,10,11],"id_dev":"1176150005","instruct":"param_dev"},
        // "model":"param_dev"}
        // }
        let thiz = this;
        if (msg && cmd == 'get_instruct' && msg.ids_dev == thiz.props.device.device) {
            if (msg.data) {
                let d = msg.data;
                thiz.state.device.color_value = d.type_color;
                thiz.state.device.pola = d.polar_data;
                thiz.state.device.oe = d.polar_oe;
                thiz.state.device.gray = d.gray;
                thiz.state.device.background = d.backgroup;
                thiz.state.device.scan = d.type_scan;
                if (d.width) thiz.state.device.screen_width = d.width + "";
                if (d.height) thiz.state.device.screen_height = d.height + "";
                if (!thiz.state.configScans[thiz.state.device.scan+""]) {
                    thiz.state.device.scan = isVer4 ? 0 : 6;
                }
            }
        }
        InteractionManager.runAfterInteractions(() => {
            thiz.forceUpdate();
        });
    };

    makeInput(val, hint, type) {
        return (
            <Input
                ref={'txt'+type}
                style={{borderColor:'#0000', color:'#333', fontSize:14, flex:1}}
                defalutValue={val}
                value={val}
                placeholder={hint}
                disabled={type == 'id'}
                editable={type != 'id'}
                onChangeText={(t)=>{
                    if (type == 'width') {
                        this.state.device.screen_width = t;
                    }else if(type == 'height') {
                        this.state.device.screen_height = t;
                    }else if(type == 'id') {
                        this.state.device.device = t;
                    }else if(type == 'name') {
                        this.state.device.title = t;
                    }
                    this.forceUpdate();
                }}
            />
        );
    }

    renderPage() {
        return (
            <ScrollView style={{flex: 1}}>
                <View style={{
                    width     : ScreenWidth, height: 320, padding: 10, paddingLeft: 20, paddingRight: 20,
                    alignItems: 'center', borderColor: '#ddd', borderBottomWidth: 1
                }}>
                    <Image style={{
                        flex   : 1,
                        padding: 12
                    }} resizeMode="stretch" source={require('../../../assets/pc_edit_bg.png')}>
                        <ListRow icon={
                            <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_no.png')}/>}
                                 title="LED显示屏ID：" titleStyle={styles.editPcCellTitleStyle}
                                 detail={this.makeInput(this.state.device.device+"", "输入编号", 'id')}
                        />
                        <ListRow icon={
                            <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_name.png')}/>}
                                 title="LED显示屏名称：" titleStyle={styles.editPcCellTitleStyle}
                                 detail={this.makeInput(this.state.device.title+"", "输入名称", 'name')}
                        />
                        <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_group.png')}/>}
                                 title="LED显示屏分组：" titleStyle={styles.editPcCellTitleStyle} detail={this.state.groupData.name+""} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                 onPress={()=>{
                                     this._showGroupPiker();
                                 }}
                        />
                        <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_width.png')}/>}
                                 title="屏体宽度：" titleStyle={styles.editPcCellTitleStyle}
                                 detail={this.makeInput(this.state.device.screen_width+"", "输入整数", 'width')}
                                 accessory={<Text>点</Text>}
                        />
                        <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_height.png')}/>}
                                 title="屏体高度：" titleStyle={styles.editPcCellTitleStyle}
                                 detail={this.makeInput(this.state.device.screen_height+"", "输入整数", 'height')}
                                 accessory={<Text>点</Text>}
                        />
                    </Image>
                </View>
                <ListRow icon={
                    <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_color.png')}/>}
                         title="色彩类型：" titleStyle={styles.editPcCellTitleStyle}
                         detail={DataCenter.configs.PROGRAM_TYPE_COLOR[this.state.device.color_value]} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888"/>}
                         onPress={()=>{
                             this._showColorPiker();
                         }}
                />
                <ListRow style={{marginTop: 6}} icon={
                    <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_data.png')}/>}
                         title="数据极性：" titleStyle={styles.editPcCellTitleStyle}
                         detail={this.state.device.pola > 0 ? "高" : "低"} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888"/>}
                         onPress={()=>{
                             this._showPolaPiker();
                         }}
                />
                <ListRow style={{marginTop: 6}} icon={
                    <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_oe.png')}/>}
                         title="OE极性：" titleStyle={styles.editPcCellTitleStyle}
                         detail={this.state.device.oe > 0 ? "高" : "低"} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888"/>}
                         onPress={()=>{
                             this._showOEPiker();
                         }}
                />
                <ListRow style={{marginTop: 6}} icon={
                    <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_scan.png')}/>}
                         title="扫描方式：" titleStyle={styles.editPcCellTitleStyle}
                         detail={this.state.configScans[this.state.device.scan]} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={18} color="#888"/>}
                         onPress={()=>{
                             this._showScanPiker();
                         }}
                />
                {
                    this.props.device.server_version == 4 ? null :

                        <ListRow icon={<Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_huidu.png')}/>}
                                 title="灰度：" titleStyle={styles.editPcCellTitleStyle} detail={DataCenter.configs.GRAY_LEVEL[this.state.device.gray]}
                                 detailStyle={styles.editPcCellDetailStyle} accessory={<IonIcon name="ios-arrow-down" size={18} color="#888" backgroundColor="#0000" />}
                                 onPress={()=>{
                                     this._showGrayPiker();
                                 }}
                        />
                }
                {
                    this.props.device.server_version == 4 ? null :
                        <ListRow style={{marginTop: 6}} icon={
                            <Image style={styles.editPcCellImg} source={require('../../../assets/pingcan/ic_bg.png')}/>}
                                 title="背景" titleStyle={styles.editPcCellTitleStyle} detail="" detailStyle={styles.editPcCellDetailStyle}
                                 accessory={
                                     <Switch
                                         onTintColor={COLOR_NAV_BG}
                                         tintColor="#aaa"
                                         thumbTintColor="#eee"
                                         value={this.state.device.background == 1}
                                         onValueChange={(toggle) => {
                                             this.state.device.background = toggle ? 1 : 0;
                                             this.forceUpdate();
                                         }}
                                     />
                                 }
                        />
                }
                <View style={{flexDirection:'row', width:ScreenWidth, height:44,marginTop      : 40,}}>
                    <Button
                        title="读取屏参"
                        titleStyle={{color: '#333', fontSize: 16}}
                        style={{
                            flex:1,
                            borderRadius   : 0,
                            backgroundColor: '#fff'
                        }}
                        onPress={() => {
                            this._loadPcData();
                        }}
                    />
                    <Button
                        title="保存"
                        titleStyle={{color: '#fff', fontSize: 16}}
                        style={{
                            flex:1,
                            borderRadius   : 0,
                            backgroundColor: COLOR_NAV_BG
                        }}
                        onPress={() => {
                            this._onClickDone();
                        }}
                    />
                </View>
            </ScrollView>
        );
    }

    _onClickDone = ()=>{
        let ps = {};
        if (this.state.device.server_version == 4) {
            ps = {token:this.props.userInfo.token, data:{instruct:'param_dev',
                ids_dev:[this.props.device.device],
                width:this.state.device.screen_width,
                height:this.state.device.screen_height,
                type_color:this.state.device.color_value,
                polar_data:this.state.device.pola,
                polar_oe:this.state.device.oe,
                type_scan:this.state.device.scan,
            }};
        }else if (this.state.device.server_version == 5) {
            ps = {token:this.props.userInfo.token, data:{instruct:'param_dev_5',
                ids_dev:[this.props.device.device],
                width:this.state.device.screen_width,
                height:this.state.device.screen_height,
                senior: 1,
                type_color:this.state.device.color_value,
                polar_data:this.state.device.pola,
                polar_oe:this.state.device.oe,
                trend:this.state.device.scan,
                gray:this.state.device.gray,
                background:this.state.device.background,
            }};
        }

        TGStorage.save({key:kLastLedParam, id:kLastLedParam, data:ps});

        let thiz = this;
        let ren = {token:this.props.userInfo.token, devid:this.props.device.device, title:this.state.device.title};
        let grp = {token:this.props.userInfo.token, devid:this.props.device.device, gid:this.state.groupData.origin_id};
        PopAlert.showLoadingView();
        HttpApi.all([
                HttpApi.makePost('/cmd/send/', ps),
                HttpApi.makePost('/led/rename/', ren),
                HttpApi.makePost('/led/mv_group/', grp)
            ],
            (rspCmd, rspRename, rspMv)=>{
                PopAlert.stopLoadingView();
                let ok1 = false, ok2 = false, ok3 = false;
                ok1 = rspCmd && rspCmd.data && rspCmd.data.status == '1';
                ok2 = rspRename && rspRename.data && rspCmd.data.status == '1';
                ok3 = rspMv && rspMv.data && rspCmd.data.status == '1';
                if (ok1) {
                    DataCenter.lastLedParam = thiz.state.device;
                    TGStorage.save({key:kLastLedParam4Ad, id:kLastLedParam4Ad, data:DataCenter.lastLedParam});
                }
                if (ok1 && ok2 && ok3) {
                    Toast.success("保存成功");
                }else{
                    let msg = '保存失败，请重试！';
                    PopAlert.showAlertView("失败", !ok1 ? "参数保存失败！" : (!ok2 ? "命名失败！" : (!ok3 ? "分组更改失败！" : msg)));
                }
            }
        );
    }

    _showGroupPiker = ()=>{
        let items = [];
        let sel = this.state.groupData.origin_id;
        DataCenter.ledGroups.map(function (o, i) {
            items.push(o.name);
            if (o.origin_id == sel) sel = i;
        });
        PullPicker.show(
            '选择分组',
            items,
            sel,
            (item, index) => {
                this.setState({groupData:DataCenter.ledGroups[index]});
            }
        );
    }
    _showColorPiker = ()=>{
        let items = dic_.values(DataCenter.configs.PROGRAM_TYPE_COLOR);
        let keys = dic_.keys(DataCenter.configs.PROGRAM_TYPE_COLOR);
        let sel = 0;
        for (let i=0; i<keys.length; ++i) {
            if (keys[i] == this.state.device.color_value){
                sel = i;
                break;
            }
        }
        PullPicker.show(
            '选择屏幕色彩',
            items,
            sel,
            (item, index) => {
                this.state.device.color_value = dic_.findKey(DataCenter.configs.PROGRAM_TYPE_COLOR, function (s) {
                    return s == item;
                });
                this.forceUpdate();
            }
        );
    }
    _showPolaPiker = ()=>{
        let items = DataCenter.configs.POLAR_DATA;
        let sel = this.state.device.pola;
        PullPicker.show(
            '选择数据极性',
            items,
            sel,
            (item, index) => {
                this.state.device.pola = index;
                this.forceUpdate();
            }
        );
    }
    _showOEPiker = ()=>{
        let items = DataCenter.configs.POLAR_OE;
        let sel = this.state.device.oe;
        PullPicker.show(
            '选择OE极性',
            items,
            sel,
            (item, index) => {
                this.state.device.oe = index;
                this.forceUpdate();
            }
        );
    }
    _showGrayPiker = ()=>{
        let items = DataCenter.configs.GRAY_LEVEL;
        let sel = this.state.device.gray;
        PullPicker.show(
            '选择灰度级别',
            items,
            sel,
            (item, index) => {
                this.state.device.gray = index;
                this.forceUpdate();
            }
        );
    }
    _showScanPiker = ()=>{
        let items = dic_.values(this.state.configScans);
        let sel = this.state.device.scan;
        let keys = dic_.keys(this.state.configScans);
        for (let i=0; i<keys.length; ++i) {
            if (keys[i] == sel) {
                sel = i;
                break;
            }
        }
        PullPicker.show(
            '选择扫描方式',
            items,
            sel,
            (item, index) => {
                this.state.device.scan = keys[index];
                this.forceUpdate();
            }
        );
    }
}

const styles = StyleSheet.create({

    editPcCellImg: {
        width : 15,
        height: 15,
    },

    editPcCellTitleStyle: {
        color     : '#aaa',
        fontSize  : 15,
        marginLeft: 4,
    },

    editPcCellDetailStyle: {
        color          : '#888',
        fontSize       : 15,
        textAlign      : 'left',
        backgroundColor: '#0000'
    },
});

module.exports = EditPcPage;