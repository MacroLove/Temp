/**
 * This is base/common page for different types of Ad.
 *
 * **/

import React from 'react';
import {
    View, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, ListView, Switch, StatusBar, Text as TextRN, Animated
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
    SegmentedView,
    Menu,
    Toast
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_NAV_BG, COLOR_VIEW_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import DataCenter from '../../../models/DataCenter';
import * as Modals from '../../../models/Models';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Text,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
import IconBadge from 'react-native-icon-badge';
import EditProPage from "./edit0Pro";
import {kLastLedParam4Ad, kLastProgramParam} from "../../../constants/Defines";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let PADDING = 20;
let CanvasWidth = ScreenWidth - PADDING*2;
let CanvasHeight = 0;
let ContainerWidth = ScreenWidth;
let ContainerHeight = 0;
let WScale = 0, HScale = 0;
let array_ = require('lodash/array');

export default class BaseEditPage extends NavigationPage {

    _makeViewSaveAndSend = ()=>{
        return (
            <View style={{flexDirection: 'row', height: 44, width: ScreenWidth}}>
                <Button
                    title="保存"
                    titleStyle={{color: '#000', fontSize: 16}}
                    style={{
                        flex           : 1,
                        borderRadius   : 0,
                        backgroundColor: '#fff',
                        borderColor    : COLOR_NAV_BG
                    }}
                    onPress={() => {
                        this._onClickSave();
                    }}
                />
                {
                    this.props.fromFenqu ? null :
                        <Button
                            title="发送"
                            titleStyle={{color: '#fff', fontSize: 16}}
                            style={{
                                flex: 1,
                                borderRadius: 0,
                                backgroundColor: COLOR_NAV_BG,
                                borderColor: COLOR_NAV_BG
                            }}
                            onPress={() => {
                                this._onClickSave(true);
                            }}
                        />
                }
            </View>
        );
    };


    /**
     * On click [广告参数]
     **/
    _onPressConfig = ()=>{
        if (this.overlayPopViewPro)
            return;
        let oldV = DataCenter.editingAdPro;
        DataCenter.editingAdPro = JSON.parse(JSON.stringify(DataCenter.editingAdPro));
        let proView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                autoKeyboardInsets = {false}
                ref={v => this.overlayPopViewPro = v}
            >
                <View style={{width:ScreenWidth-40, height:ScreenHeight-160}}>
                    <EditProPage
                        title="广告设置"
                        style={{flex:1, borderRadius:6}}
                        actions={this.props.actions}
                        groupData={this.props.groupData}
                        type={this.props.type}
                        token={this.props.token}
                        isNew={false}
                        isPopup={true}
                        onOK={(e)=>{
                            if (e == 1) {
                                this.state.strPro = DataCenter.editingAdPro.width+"x"+DataCenter.editingAdPro.height+"  "
                                    + DataCenter.configs.PROGRAM_TYPE_COLOR[DataCenter.editingAdPro.type_color] + "  "
                                    + DataCenter.configs.GRAY_LEVEL[DataCenter.editingAdPro.gray];
                                this._calCanvasWH && this._calCanvasWH();
                                this.forceUpdate();
                            }else{
                                DataCenter.editingAdPro = oldV;
                            }
                            this.overlayPopViewPro && this.overlayPopViewPro.close();
                            this.overlayPopViewPro = null;
                        }}
                    />
                </View>
            </Overlay.PopView>
        );

        Overlay.show(proView);
    };


    // Common save ad data to server
    _onSaveAdData = (data, isToufang)=>{
        console.log("save ad", data);
        HttpApi.createAd(data, (resp, error) => {
            PopAlert.stopLoadingView();
            if (error) {
                PopAlert.showAlertView("错误", error + '');
            } else {
                DataCenter.lastLedParam = null;
                TGStorage.remove({key:kLastLedParam4Ad, id:kLastLedParam4Ad});
                TGStorage.save({key:kLastProgramParam, id:kLastProgramParam, data:DataCenter.editingAdPro});
                if (isToufang) {
                    DataCenter.tmpAdData = resp;
                    Toast.success("请选择投放设备");
                }else{
                    Toast.success("保存成功！");
                }
                this.props.actions.refreshAdsList();
                this.navigator.popN(this.props.fromPro ? 1 : 1);
            }
        });
    };


}
