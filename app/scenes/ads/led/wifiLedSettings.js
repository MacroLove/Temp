import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar, InteractionManager, NativeModules
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

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * SImpleCOnfig wifi
 * */
export default class WifiLedSettings extends NavigationPage {
    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "WiFi设置",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);

        this.state = {
            ssid: "",
            psw: "",
            isConfiging: false,
        };
    }

    componentWillMount() {
        let thiz = this;
        Utils.getSSID((s)=>{
           thiz.setState({ssid: s});
        });
    }

    componentDidMount() {

    }

    componentWillUnmount() {
        Utils.stopSimpleConfig();
    }

    renderPage() {
        let thiz = this;
        return (
            <View style={{flex:1, backgroundColor:"#eee"}}>
                <Image style={{alignSelf:"center", margin:10}} source={require("../../../assets/wifi/ic_wifi.png")}/>
                <Text style={{alignSelf:"center", marginBottom:10}}>{"WiFi名称："+this.state.ssid}</Text>

                <View style={{paddingLeft:10, paddingRight:10, alignSelf:"stretch", height:44, backgroundColor:"#fff", flexDirection:"row", alignItems:"center"}}>
                    <Text>WiFi密码：</Text>
                    <Input style={{borderWidth:0, flex:1}}
                           placeholder="请输入WiFi密码"
                           defaultValue={this.state.psw}
                           secureTextEntry={true}
                           onChangeText={(t)=>this.state.psw = t}
                           editable={!this.state.isConfiging}
                    />
                </View>

                <Button title={this.state.isConfiging ? "配置中,请耐心等待" : "开始配置"}
                        titleStyle={{color:"#fff"}}
                        diabled={this.state.isConfiging}
                        style={this.state.isConfiging?styles.btnDisable:styles.btnNormal}
                    onPress={()=>{
                        if (this.state.isConfiging)
                            return;
                        Keyboard.dismiss();
                        thiz.setState({isConfiging:true});
                        //PopAlert.showLoadingView();
                        Utils.startSimpleConfig(this.state.ssid, this.state.psw, (res)=>{
                           //PopAlert.stopLoadingView();
                           Toast.info(res.status == true ? "设备入网成功" : "未配置到任何设备");
                           thiz.setState({isConfiging:false});
                        });
                    }}
                />

                <Text style={{padding:10}}>{"注：请输入当前手机连接的WiFi密码；\n        仅支持2.4GHz频段的WiFi"}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({

    btnNormal:{
        marginTop:20, marginLeft:10, marginRight:10, alignSelf:"stretch", height:40, borderWidth:0,
        backgroundColor:COLOR_NAV_BG,
    },

    btnDisable: {
        marginTop:20, marginLeft:10, marginRight:10, alignSelf:"stretch", height:40, borderWidth:0,
        backgroundColor:"#888",
    }

});
