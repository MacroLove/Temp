import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image, KeyboardAvoidingView, ScrollView} from "react-native";
import { Navigator } from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {
    Button,
    NavigationPage,
    Input,
    Toast,
    Menu, ListRow
} from 'teaset';
import Icon from 'react-native-vector-icons/Ionicons';
import IconEvil from 'react-native-vector-icons/EvilIcons';
import SmartButton from 'react-native-smart-button';

import * as Apis from '../../actions/apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Actions} from "react-native-router-flux";

import CountDownButton from '../../widgets/CountdownBtn';
import {COLOR_NAV_BG} from "../../constants/Colors";
import PopAlert from "../../widgets/PopAlertView";
import HttpApi from "../../network/HttpApi";

import RegisterPage from './register';
import FindPswPage from './findPsw';
import {VIEW_TABS} from "../../constants/ViewKeys";

import * as Regex from '../../Utils/Regx';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cellContainer: {
        flexDirection: 'row', height: 44, alignItems: 'center', borderColor: '#eee', borderBottomWidth: 1
    },
});

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth =  Dimensions.get('window').width;

class LoginModeAcc extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };
    constructor(props) {
        super(props);
        this.state = {
            loginType: 0, // 0 is phone, else is acc.

            phoneNum:'',
            phoneCode:'',
            accUser:props.userInfo.username,
            accPwd: props.userInfo.password,
            accPwdSec: true,

            showUserHis: false,
            userHisData:[],
        };
    }

    resetState(){
        this.state.phoneNum = '';
        this.state.phoneCode = '';
        this.state.accPwdSec = true;
        this.state.accPwd = '';
        this.state.accUser = '';
    }

    componentDidMount(){

    }

    componentWillMount(){

    }

    componentWillReceiveProps(props) {
        if (props.userInfo.logining == false) {
            PopAlert.stopLoadingView();
            if(props.userInfo.loginStatus == 1) {
                TGStorage.save({key:'users', id:this.state.accUser.replace(/_/g, 'x'), data:{name:this.state.accUser, psw:this.state.accPwd}});
                Toast.show({text:'登录成功', icon:'success'}, ()=>{
                    Actions[VIEW_TABS]();
                });
            }else{
                PopAlert.showAlertView("登录失败", props.userInfo.loginingErr);
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {

        return true;
    }

    componentWillUnmount(){
        this.accView = null;
        this.phoneView = null;
    }

    renderNavigationBar(){
        return null;
    }

    renderPage() {
        var arrow0 = this.state.loginType == 0 ? require('../../assets/ic_login_arrowup1.png') : require('../../assets/ic_login_arrowup0.png');
        var arrow1 = this.state.loginType == 1 ? require('../../assets/ic_login_arrowup1.png') : require('../../assets/ic_login_arrowup0.png');
        return (
            <View style={styles.container}>
                <View style={{height:190, alignItems:'center', backgroundColor:COLOR_NAV_BG}}>
                    <Image source={require('../../assets/ic_head_led.png')} style={{marginTop:40}}/>
                    <View style={{flex:1, flexDirection:'row', alignItems:'flex-end', justifyContent:'space-around'}}>
                        {/*<View style={{alignItems:'center'}}>*/}
                            {/*<Button title='手机登录' titleStyle={{color:'white', fontSize:16}} style={{backgroundColor:'#0000', borderColor: '#0000'}} onPress={()=>this._onChangeTab(0)}/>*/}
                            {/*<Image source={arrow0}/>*/}
                        {/*</View>*/}
                        {/*<View style={{alignItems:'center', marginLeft:100}}>*/}
                            {/*<Button title='账号登录' titleStyle={{color:'white', fontSize:16}} style={{backgroundColor:'#0000', borderColor: '#0000'}} onPress={()=>this._onChangeTab(1)}/>*/}
                            {/*<Image source={arrow1}/>*/}
                        {/*</View>*/}
                    </View>
                </View>

                <View style={{flex:1}}>
                {
                    //this.state.loginType == 0 ? this._renderPhoneView() : this._renderAccView()
                    this._renderAccView()
                }
                </View>

                {/*<View style={{flex:1, alignItems:'center', justifyContent:'flex-end', paddingBottom:30}}>*/}
                    {/*<Image source={require('../../assets/ic_or_line.png')}/>*/}
                    {/*<View style={{width:ScreenWidth, marginTop:20, flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>*/}
                        {/*<SmartButton*/}
                            {/*touchableType={SmartButton.constants.touchableTypes.highlight}*/}
                            {/*style={{flexDirection:'column'}} onPress={()=>this._onClick3dParty(0)}>*/}
                            {/*<Image source={require('../../assets/ic_wx.png')}/>*/}
                        {/*</SmartButton>*/}
                        {/*<SmartButton*/}
                            {/*touchableType={SmartButton.constants.touchableTypes.highlight}*/}
                            {/*style={{flexDirection:'column'}} onPress={()=>this._onClick3dParty(1)}>*/}
                            {/*<Image source={require('../../assets/ic_wb.png')}/>*/}
                        {/*</SmartButton>*/}
                        {/*<SmartButton*/}
                            {/*touchableType={SmartButton.constants.touchableTypes.highlight}*/}
                            {/*style={{flexDirection:'column'}} onPress={()=>this._onClick3dParty(2)}>*/}
                            {/*<Image source={require('../../assets/ic_qq.png')}/>*/}
                        {/*</SmartButton>*/}
                    {/*</View>*/}
                {/*</View>*/}
            </View>
        );
    }

    _onClick3dParty = (i) => {
        switch (i){
            case 0:
                break;
        }
    }

    _onChangeTab = (i) => {
        this.resetState();
        this.setState({loginType:i});
    }

    _onClickLoginAcc = ()=>{
        if (this.state.accUser.length == 0 || this.state.accPwd.length == 0) {
            PopAlert.showAlertView("提示", "请输入正确的用户名和密码");
            return;
        }
        PopAlert.showLoadingView("");
        this.props.actions.login(this.state.accUser, this.state.accPwd);
    }

    _onClickSendSms = ()=>{
        HttpApi.sendSMS({mobile:this.state.phoneNum}, (rsp, err)=>{
            if (err){
                PopAlert.showAlertView("错误", err+'');
            }
        });
    }

    _onClickLoginPhone = ()=>{
        PopAlert.showLoadingView("");
        this.props.actions.login(this.state.phoneNum, this.state.phoneCode);
    }

    _renderPhoneView = ()=>{
        if (this.phoneView)
            return this.phoneView;

        this.phoneView = (<KeyboardAvoidingView style={{flex:1}}>
            <ScrollView style={styles.container}>
                <View style={{width:ScreenWidth, alignItems:'center', padding:20}}>
                    <View style={styles.cellContainer}>
                        <Text
                            style={{backgroundColor:'#0000', color:'black', fontWeight:'bold', fontSize:14, paddingRight:10, borderColor:'#eee', borderRightWidth:1}}>
                            {'+86'}
                        </Text>
                        <Input
                            style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                            size='md'
                            defaultValue={this.state.phoneNum}
                            placeholder='请输入您的手机号码'
                            onChangeText={text => (this.state.phoneNum = text)}
                        />
                    </View>
                    <View style={styles.cellContainer}>
                        <Input
                            style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                            size='md'
                            value={this.state.code}
                            placeholder='请输入短信验证码'
                            onChangeText={text => (this.state.phoneCode = text)}
                        />
                        <CountDownButton
                            title={'获取验证码'}
                            onPress={()=>{
                                this._onClickSendSms();
                            }}
                            style={{backgroundColor: '#39ceff', borderColor: '#0000', width:120, height:40}}
                            titleStyle={{color:'white'}}
                            styleDisabled={{backgroundColor: '#aaa', borderColor: '#0000', width:120, height:40}}
                            titleStyleDisabled={{color:'white'}}
                        />
                    </View>


                    <Button
                        title={'登录'}
                        onPress={()=>{
                            this._onClickLoginPhone();
                        }}
                        style={{backgroundColor: COLOR_NAV_BG,
                            marginTop: 30,
                            borderColor: '#0000', width:ScreenWidth - 40, height:40}}
                        titleStyle={{color:'white'}}
                    />

                    <View style={{flex:1, width:ScreenWidth-40, alignItems:'flex-start', marginTop:4}}>
                        <Button
                            title="立即注册"
                            titleStyle={{color:'black', fontSize:14}}
                            style={{backgroundColor:'#0000', borderColor:'#0000'}}
                            onPress={()=>{
                                this.navigator.push({view:<RegisterPage/>});
                            }} />
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>);
        return this.phoneView;
    }

    _renderAccView = () => {
        //if (this.accView)
            //return this.accView;

        let svH = (this.state.userHisData.length > 3 ? 3 : this.state.userHisData.length) * 40;
        let thiz = this;
        let accView = (
            <KeyboardAvoidingView style={{flex:1}}>
                <View style={styles.container}>
                    <View style={{width:ScreenWidth, alignItems:'center', padding:20, alignSelf:"stretch"}}>

                        <View style={{flexDirection:'row', alignItems:'center', borderColor:'#eee', borderBottomWidth:1}}>
                            <IconEvil name='user' color="#aaa"
                                      size={24}/>
                            <Text style={{color:'#aaa', fontSize:15}}>账号：</Text>
                            <Input style={{flex:1, height:40, backgroundColor:'#0000', borderRadius:0, borderColor:'#0000'}}
                                   ref={v=>this.inputAcc=v}
                                   placeholder='手机号/用户名'
                                   size={'md'}
                                   defaultValue={this.state.accUser}
                                   onChangeText={(name)=>{
                                       this.state.accUser = name;
                                   }}
                            />
                            <Icon.Button name="ios-arrow-down" color="#aaa"
                                         underlayColor="#0000" backgroundColor='#0000'
                                         style={{width:50, height:40}}
                                         size={30}
                                         onPress={()=>{
                                             this._showUsers();
                                         }}/>
                        </View>
                        {
                            this.state.showUserHis && this.state.userHisData.length > 0 ?
                                <ScrollView style={{marginLeft:80, alignSelf:"stretch", height:svH}}>
                                    {
                                        this.state.userHisData.map(function (o) {
                                            return <ListRow style={{alignSelf:"stretch", height:40}} title={o.name+""}
                                                     bottomSeparator="full"
                                                     onPress={()=>thiz._selectUser(o.name, o.psw)}/>
                                        })
                                    }
                                </ScrollView>
                                :
                                null
                        }
                        <View style={{flexDirection:'row', alignItems:'center', borderColor:'#eee', borderBottomWidth:1}}>
                            <IconEvil name='lock' color="#aaa"
                                      size={24}/>
                            <Text style={{color:'#aaa', fontSize:15}}>密码：</Text>
                            <Input style={{flex:1, height:40, backgroundColor:'#0000', borderRadius:0, borderColor:'#0000'}}
                                   ref = 'accPsw'
                                   placeholder='请输入密码'
                                   size={'md'}
                                   secureTextEntry={this.state.accPwdSec}
                                   defaultValue={this.state.accPwd}
                                   onChangeText={(name)=>{
                                       this.state.accPwd = name;
                                   }}
                            />
                            <Icon.Button name={this.state.accPwdSec ? "md-eye-off" : "md-eye"} color="#aaa"
                                         ref={component => this.accPswIcon = component}
                                         underlayColor="#0000" backgroundColor='#0000'
                                         style={{width:50, height:40}}
                                         size={24}
                                         onPress={()=>{
                                             this.state.accPwdSec = !this.state.accPwdSec;
                                             this.refs['accPsw'].setNativeProps({secureTextEntry:this.state.accPwdSec});
                                             this.accPswIcon.setNativeProps({name:this.state.accPwdSec ? "md-eye-off" : "md-eye"});
                                         }}/>
                        </View>

                        <Button
                            title={'登录'}
                            onPress={()=>{
                                this._onClickLoginAcc();
                            }}
                            style={{backgroundColor: COLOR_NAV_BG,
                                marginTop: 30,
                                borderColor: '#0000', width:ScreenWidth - 40, height:40}}
                            titleStyle={{color:'white'}}
                        />

                        <View style={{flexDirection:'row', width:ScreenWidth-40, height:40, alignItems:'center', justifyContent:'space-between', marginTop:4}}>
                            <Button
                                title="立即注册"
                                titleStyle={{color:'black', fontSize:14}}
                                style={{backgroundColor:'#0000', borderColor:'#0000'}}
                                onPress={()=>{
                                    this.navigator.push({view:<RegisterPage/>});
                                }} />
                            <Button
                                title="忘记密码？"
                                titleStyle={{color:'black', fontSize:14}}
                                style={{backgroundColor:'#0000', borderColor:'#0000'}}
                                onPress={()=>{
                                    this.navigator.push({view:<FindPswPage />});
                                }} />
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        );
        return accView;
    }

    _showUsers = ()=>{
        var thiz = this;
        TGStorage.getAllDataForKey('users').then(users => {
            if (users && users.length > 0) {
                // thiz.inputAcc.measureInWindow((x, y, width, height) => {
                //     let items = users.map(function (o) {
                //         return {title:o.name, onPress:()=>thiz._selectUser(o.name, o.psw)};
                //     });
                //     Menu.show({x:50, y, width, height}, items);
                // });
                thiz.setState({showUserHis:!thiz.state.showUserHis, userHisData:users});
            }
        }).catch((e)=>{});
    };

    _selectUser = (name, psw) => {
        this.state.accPwd = psw;
        this.state.accUser = name;
        this.refs['accPsw'].setNativeProps({text:this.state.accPwd});
        this.inputAcc.setNativeProps({text:this.state.accUser});
        this.setState({showUserHis:false});
    }
}


function mapStateToProps(state, ownProps) {
    return {
        userInfo:state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModeAcc);
