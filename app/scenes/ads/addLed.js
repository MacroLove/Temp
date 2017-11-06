
import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, Vibration
} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    TeaNavigator,
    Theme,
    Toast,
} from 'teaset';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import ScanQRView from '../../widgets/QRScanView';
import {COLOR_NAV_BG} from "../../constants/Colors";

import HttpApi from "../../network/HttpApi";
import PopAlert from "../../widgets/PopAlertView";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class AddLed extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "添加屏",
        scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            inputCode: '',
            scanCode:'',
            isLoading: false,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderNavigationLeftView() {
        return (
            <NavigationBar.BackButton
                title={Theme.backButtonTitle}
                onPress={() => Actions.pop()}
            />
        );
    }
    renderPage() {
        return (
            <KeyboardAwareScrollView style={{flex: 1}}>
                    <ScanQRView
                        onBarCodeRead={this._onScanSuccess}>
                        <View style={{flex:1, alignItems:'center'}}>
                            <Text style={{color:'white', fontSize:12, marginTop:10}}>将二维码/条码放入框内，即可自动扫描</Text>
                            <Input style={{backgroundColor:'white', borderColor:'white', width:ScreenWidth-80, height:30, borderRadius:15, marginTop:30}}
                                defaultValue={this.state.inputCode} onChangeText={(t)=>(this.state.inputCode=t)}
                            />
                            <Text style={{color:'white', fontSize:12, marginTop:6}}>手动输入序列号添加LED屏</Text>
                            <Button
                                title="确定"
                                style={{backgroundColor: COLOR_NAV_BG, borderColor: '#0000', width: ScreenWidth-80, height: 44, marginTop:30}}
                                titleStyle={{color: 'white', fontSize: 14}}
                                onPress={() => {
                                    Keyboard.dismiss();
                                    if (this.state.inputCode.trim().length > 0) {
                                        this.addCodeToServer(this.state.inputCode.trim());
                                    }
                                }}
                            />
                        </View>
                    </ScanQRView>
            </KeyboardAwareScrollView>
        );
    }

    _onScanSuccess = (result) => {
        console.log(result);
        if (this.state.isLoading)
            return;
        this.state.isLoading = true;
        this.setState({inputCode:result.data+""});
        Vibration.vibrate();
        this.addCodeToServer(result.data+"");
    }

    addCodeToServer = (code) => {
        var thiz = this;
        PopAlert.showLoadingView();
        HttpApi.addLed({
            token:this.props.token,
            code:code
        }, (resp, error)=>{
            PopAlert.stopLoadingView();
            if (error) {
                PopAlert.showAlertView2("错误", error + '', ()=>{
                    thiz.state.isLoading = false;
                }, null);
            } else {
                HttpApi.syncData({token:thiz.props.token});
                thiz.props.callback && thiz.props.callback(true);
                Actions.pop();
            }
        });
    }
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    camera: {
        flex:1,
    }
});

module.exports = AddLed;