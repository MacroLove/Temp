import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, ListRow, Input, NavigationPage, Toast} from "teaset";
import Icon from "react-native-vector-icons/Entypo";
import * as Colors from "../../../constants/Colors";
import RoundImage from '../../../widgets/RoundImage';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import * as Apis from '../../../actions/apis';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";
import ResetPswPage from './resetPsw';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class UserInfoPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "个人资料",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        let accSize = 16;
        return (
            <ScrollView style={[styles.container, {padding: 0}]}>
                <View>
                    <ListRow title={''} detail={'更换头像'} titleStyle={[styles.cellTitle, {marginLeft:6}]}
                             accessory={<Icon name="chevron-thin-right" color='#aaa' size={accSize}/>}
                             icon={<RoundImage
                                style={{width:42, height:42, borderRadius:21}}
                                placeholder={require('../../../assets/default_user.png')}
                                source={this.props.userInfo.head_portrait+""}
                             />}
                             onPress={()=>{
                                 this._onPressChangePhoto();
                             }}
                    />
                    <ListRow title={'昵称'} detail={this.props.userInfo.nickname || this.props.userInfo.username} titleStyle={[styles.cellTitle, {marginLeft:6}]}
                             accessory={<Icon name="chevron-thin-right" color='#aaa' size={accSize}/>}
                             onPress={()=>{
                                this.navigator.push({view:<ChangeNamePage {...this.props} title="更改昵称" showBackButton/>});
                             }}
                    />
                    <ListRow title={'帐号'} detail={''+this.props.userInfo.username} titleStyle={[styles.cellTitle, {marginLeft:6}]}
                    />
                    <ListRow title={'密码重置'} titleStyle={[styles.cellTitle, {marginLeft:6}]}
                             accessory={<Icon name="chevron-thin-right" color='#aaa' size={accSize}/>}
                             onPress={()=>{
                                this.navigator.push({view:<ResetPswPage {...this.props} title="重置密码" showBackButton/>});
                             }}
                    />
                </View>

            </ScrollView>
        );
    }

    _onPressChangePhoto = () => {
        var ImagePicker = require('react-native-image-picker');
        var options = {
            title                       : '',
            quality                     : 0.8,
            mediaType                   : 'photo',
            cancelButtonTitle           : "取消",
            takePhotoButtonTitle        : '拍摄',
            chooseFromLibraryButtonTitle: '从相册选择',
            maxWidth                    : 64,
            maxHeight                   : 64,
            noData                      : false,
        };
        var thiz = this;
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri) {
                HttpApi.setHeadImg({token:thiz.props.userInfo.token, image:'data:image/jpeg;base64,'+response.data}, (resp, error) => {
                    if (error) {
                        PopAlert.showAlertView("错误", error+"");
                        //thiz.props.actions.setHeadPortrait('https://gss0.baidu.com/7LsWdDW5_xN3otqbppnN2DJv/dmas/pic/item/52adcbef76094b3657c63e7babcc7cd98c109dd4.jpg');
                    }else{
                        thiz.props.actions.setHeadPortrait(resp.head_portrait);
                        Toast.success("上传成功");
                    }
                });
            }
        });
    }
}

// 更换昵称
class ChangeNamePage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "更换昵称",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            nickname:props.userInfo.nickname,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        let accSize = 16;
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Input style={{width:ScreenWidth, height:48, backgroundColor:'#fff', borderRadius:0, borderColor:'#fff'}} placeholder="请输入昵称"
                           placeholderTextColor='#aaa'
                           size={'md'}
                           defaultValue={this.state.nickname}
                           onChangeText={(name)=>{
                            this.state.nickname = name.trim();
                        }}
                    />

                    <Button title="保存" style={{alignSelf:'center', backgroundColor:Colors.COLOR_NAV_BG, width:ScreenWidth-40, height:40, marginTop:60}}
                            titleStyle={{color:'white'}}
                            onPress={()=>{
                            this._onSaveName();
                    }}/>
                </View>

            </ScrollView>
        );
    }

    _onSaveName = () => {
        if (this.state.nickname.length <= 0) {
            PopAlert.showAlertView("提示", "请输入有效昵称！");
        }else{
            var thiz = this;
            PopAlert.showLoadingView();
            HttpApi.setNickName({token:this.props.userInfo.token, nickname:this.state.nickname}, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", ""+error);
                }else{
                    thiz.props.actions.setNickname(thiz.state.nickname);
                    Toast.success("设置成功", 'short', 'center', ()=>{
                        thiz.navigator.pop();
                    });
                }
            })
        }
    }
}

//// 密码重置
//class ResetPswPage extends NavigationPage {
//
//    static defaultProps = {
//        ...NavigationPage.defaultProps,
//        title         : "密码重置",
//        //scene: Navigator.SceneConfigs.FloatFromBottom,
//        showBackButton: true,
//    };
//
//    constructor(props) {
//        super(props);
//        this.state = {
//            code: "",
//            psw1: "",
//            psw2: "",
//            sec1: false,
//            sec2: false,
//        };
//    }
//
//    componentDidMount() {
//
//    }
//
//    componentWillUnmount() {
//
//    }
//
//    renderPage() {
//        let accSize = 16;
//        return (
//            <ScrollView style={[styles.container, {padding: 20,}]}>
//                <View>
//                    <View style={{flexDirection:'row', alignItems:'center'}}>
//                        <Input style={{flex:1, height:40, backgroundColor:'#0000', borderRadius:0, borderColor:'#aaa', borderLeftWidth:0, borderRightWidth:0, borderTopWidth:0}}
//                               placeholder="请输入短信验证码"
//                               placeholderTextColor='#aaa'
//                               size={'md'}
//                               onChangeText={(name)=>{
//
//                        }}
//                        />
//                        <Button title="获取验证码"
//                                underlayColor="#0000"
//                                style={{width:120, height:40, backgroundColor:Colors.COLOR_BUTTON_CYON, borderColor:'white'}}
//                                titleStyle={{color:'white'}}
//                                onPress={()=>{
//
//                            }}/>
//                    </View>
//                    <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
//                        <Input style={{flex:1, height:40, backgroundColor:'#0000', borderRadius:0, borderColor:'#aaa', borderLeftWidth:0, borderRightWidth:0, borderTopWidth:0}}
//                               placeholder='设置新密码'
//                               placeholderTextColor='#aaa'
//                               size={'md'}
//                               secureTextEntry={this.state.sec1}
//                               value={this.state.psw1}
//                               onChangeText={(name)=>{
//                                   this.setState({psw1:name});
//                        }}
//                        />
//                        <View style={{position:'absolute', left:ScreenWidth-50-40}}>
//                            <Icon.Button name={this.state.sec1 ? "eye-with-line" : "eye"} color="#aaa"
//                                         underlayColor="#0000" backgroundColor='#0000'
//                                         style={{width:50, height:40}}
//                                         size={24}
//                                         onPress={()=>{
//                            this.setState({sec1:!this.state.sec1});
//                            }}/>
//                        </View>
//                    </View>
//                    <View style={{flexDirection:'row', alignItems:'center', marginTop:20}}>
//                        <Input style={{flex:1, height:40, backgroundColor:'#0000', borderRadius:0, borderColor:'#aaa', borderLeftWidth:0, borderRightWidth:0, borderTopWidth:0}}
//                               placeholder='再次输入新密码'
//                               placeholderTextColor='#aaa'
//                               size={'md'}
//                               secureTextEntry={this.state.sec2}
//                               value={this.state.psw2}
//                               onChangeText={(name)=>{
//                                   this.setState({psw2:name});
//                        }}
//                        />
//                        <View style={{position:'absolute', left:ScreenWidth-50-40}}>
//                            <Icon.Button name={this.state.sec2 ? "eye-with-line" : "eye"} color="#aaa"
//                                         underlayColor="#0000" backgroundColor='#0000'
//                                         style={{width:50, height:40}}
//                                         size={24}
//                                         onPress={()=>{
//                                this.setState({sec2:!this.state.sec2});
//                            }}/>
//                        </View>
//                    </View>
//
//                    <Button title="保存" style={{alignSelf:'center', backgroundColor:Colors.COLOR_NAV_BG, width:ScreenWidth-40, height:40, marginTop:60}}
//                            titleStyle={{color:'white'}}
//                            onPress={()=>{
//                            this._onSaveName();
//                    }}/>
//                </View>
//
//            </ScrollView>
//        );
//    }
//
//    _onSaveName = () => {
//
//    }
//}

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    tipTitle : {
        color: '#aaa', fontSize: 13, marginTop: 10, marginLeft: 14, marginBottom: 4,
    },
    cellTitle: {
        color: '#555'
    },
});

function mapStateToProps(state, ownProps) {
    return {
        userInfo: state.login
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions : bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(UserInfoPage);

