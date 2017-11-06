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
import {Actions} from "react-native-router-flux";

import * as Colors from '../../../constants/Colors';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import CountDownButton from '../../../widgets/CountdownBtn';
import * as Regex from '../../../Utils/Regx';
import {VIEW_LOGIN} from "../../../constants/ViewKeys";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class ResetPswPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "重置密码",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            phone: '',
            psw: '',
            psw2: '',
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
                        <View style={[styles.cellContainer, {width:ScreenWidth, height:64}]}>
                            <Text style={{flex:1, backgroundColor:'#0000', color:'#666', fontWeight:'bold', fontSize:14, textAlign:'center', marginBottom:20}}>
                                {'请为您的账号 ' + this.props.userInfo.username.substr(0, 3) + "******"
                                + this.props.userInfo.username.substr(this.props.userInfo.username.length - 2, 2) + " 设置一个\n新密码"}
                            </Text>
                        </View>
                        <View style={styles.cellContainer}>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md' secureTextEntry
                                defaultValue={this.state.psw}
                                placeholder='请设置6~18位 (不能全是数字)'
                                onChangeText={text => this.state.psw = text}
                            />
                        </View>
                        <View style={styles.cellContainer}>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md' secureTextEntry
                                defaultValue={this.state.psw2}
                                placeholder='再次输入新密码'
                                onChangeText={text => this.state.psw2 = text}
                            />
                        </View>
                        <Button
                            title={'提交'}
                            onPress={()=>{
                                if (this.state.psw != this.state.psw2) {
                                    PopAlert.showAlertView("错误", "两次密码不一致");
                                    return;
                                }
                                if (!Regex.validPassword(this.state.psw) || this.state.psw.length <= 0) {
                                    PopAlert.showAlertView("错误", "请设置6~18位 (不能全是数字)");
                                    return;
                                }
                                PopAlert.showLoadingView(null);
                                var thiz = this;
                                HttpApi.resetPsw({token:this.props.userInfo.token, pwd:this.state.psw}, (rsp, err)=>{
                                    PopAlert.stopLoadingView();
                                    if (err){
                                        PopAlert.showAlertView("错误", err+'');
                                        return;
                                    }
                                    //thiz.props.actions.setPassword(thiz.state.psw);
                                    TGStorage.save({key:'users', id:thiz.props.userInfo.username.replace(/_/g, 'x'), data:{name:thiz.props.userInfo.username, psw:""}});
                                    thiz.props.actions.quit();
                                    Toast.success("重置成功", 'short', 'center', ()=>{
                                        Actions[VIEW_LOGIN]();
                                    });
                                });
                        }}
                            style={{backgroundColor: Colors.COLOR_NAV_BG,
                            marginTop: 30,
                            borderColor: '#0000', width:ScreenWidth - 40, height:40}}
                            titleStyle={{color:'white'}}
                        />

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

module.exports = ResetPswPage;
