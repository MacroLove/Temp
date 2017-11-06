import React from 'react';
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    Toast
} from 'teaset';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Colors from '../../constants/Colors';
import HttpApi from "../../network/HttpApi";
import PopAlert from "../../widgets/PopAlertView";
import CountDownButton from '../../widgets/CountdownBtn';
import * as Regex from '../../Utils/Regx';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class Register extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "注册",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            psw: '',
            code: '',
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
            <KeyboardAvoidingView style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <View style={{width:ScreenWidth, alignItems:'center', padding:20}}>
                        <View style={styles.cellContainer}>
                            <Text
                                style={{backgroundColor:'#0000', color:'black', fontWeight:'bold', fontSize:14, paddingRight:10, borderColor:'lightgray', borderRightWidth:1}}>
                                {'+86'}
                            </Text>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md'
                                defaultValue={this.state.phone}
                                placeholder='请输入您的手机号码'
                                onChangeText={text => (this.state.phone = text)}
                            />
                        </View>
                        <View style={styles.cellContainer}>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md'
                                defaultValue={this.state.psw}
                                placeholder='请设置6～18密码（不能全是数字）'
                                onChangeText={text => this.state.psw = text}
                            />
                        </View>
                        <View style={styles.cellContainer}>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md'
                                defaultValue={this.state.code}
                                placeholder='请输入短信验证码'
                                onChangeText={text => this.state.code = text}
                            />

                            <CountDownButton
                                ref = {v=>this.btnCountDown = v}
                                title={'获取验证码'}
                                onPress={()=>{
                                    if(this.state.phone == '' || !Regex.isPhone(this.state.phone)) {
                                        this.btnCountDown.stopAndReset();
                                        var txt = '请输入正确的电话号码';
                                        Toast.info(txt);
                                        return;
                                    }
                                    HttpApi.sendSMS({mobile:this.state.phone}, (rsp, err)=>{
                                        if (err){
                                            this.btnCountDown.stopAndReset();
                                            PopAlert.showAlertView("错误", err+'');
                                        }
                                    });
                                }}
                                style={{backgroundColor: '#39ceff', borderColor: '#0000', width:120, height:40}}
                                titleStyle={{color:'white'}}
                                styleDisabled={{backgroundColor: '#aaa', borderColor: '#0000', width:120, height:40}}
                                titleStyleDisabled={{color:'white'}}
                            />
                        </View>


                        <Button
                            title={'立即注册'}
                            onPress={()=>{
                                if(this.state.phone == '' || !Regex.isPhone(this.state.phone)) {
                                    var txt = '请输入正确的电话号码';
                                    Toast.info(txt);
                                    return;
                                }
                                if(this.state.psw == '' || !Regex.validPassword(this.state.psw)) {
                                    var txt = '密码格式错误';
                                    Toast.info(txt);
                                    return;
                                }
                                if(this.state.code == '' || !Regex.validCode(this.state.code)) {
                                    var txt = '请输入验证码';
                                    Toast.info(txt);
                                    return;
                                }

                                PopAlert.showLoadingView(null);
                                HttpApi.register({user:this.state.phone, pwd:this.state.psw, code:this.state.code}, (rsp, err)=>{
                                    PopAlert.stopLoadingView();
                                    if (rsp){
                                        PopAlert.showAlertView("注册成功", '请返回登录界面，继续登录。', ()=>{
                                            this.navigator.pop();
                                        });
                                        return;
                                    }
                                    PopAlert.showAlertView("错误", err+'');
                                });
                        }}
                            style={{backgroundColor: Colors.COLOR_NAV_BG,
                            marginTop: 30,
                            borderColor: '#0000', width:ScreenWidth - 40, height:40}}
                            titleStyle={{color:'white'}}
                        />

                        <View style={{flex:1, width:ScreenWidth-40, alignItems:'flex-end'}}>
                            <Icon.Button
                                name="ios-checkbox-outline"
                                color="#39ceff"
                                backgroundColor='#0000'
                                underlayColor="#0000"
                                onPress={()=>{}}
                            >
                                {'同意《xxxx服务协议》'}
                            </Icon.Button>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellContainer: {
        flexDirection: 'row', height: 44, alignItems: 'center', borderColor: 'lightgray', borderBottomWidth: 1
    },
});

module.exports = Register;
