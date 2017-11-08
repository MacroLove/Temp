import React from 'react';
import {View, Text, StyleSheet, Image} from "react-native";
import Button from "react-native-button";
import {Actions} from "react-native-router-flux";
import * as Colors from '../constants/Colors';
import {Utils, GPSUtils} from '../Utils/Utils';
import * as ViewKeys from '../constants/ViewKeys';
import * as Apis from '../actions/apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import HttpApi from "../network/HttpApi";
import PopAlert from '../widgets/PopAlertView';
import DataCenter from '../models/DataCenter';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    logo: {
        width: Utils.pixelSize * 219,
        height: Utils.pixelSize * 375,
    },
});

var CONNECT_STATUS = 0;

class Splash extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isLogining: false,
            reLoginState: 0, // 1 is re login ok.
        };
    }

    componentDidMount(){
        console.log("dddmmmmmm splash");
    }

    componentWillUnmount(){
        this.state.reLoginState = 0;
        this.state.isLogining = false;
        console.log("ummmmmmmm splash");
    }

    componentWillReceiveProps(props){
        if (this.state.reLoginState == 1) {
            Actions[ViewKeys.VIEW_TABS]({});
            return;
        }
        if (this.state.isLogining)
            return;
        this.state.isLogining = true;

        this._configRequest();
    }

    _configRequest = ()=>{
        var thiz = this;
        HttpApi.getConfigs({}, (resp, error) => {
            if (error) {
                PopAlert.showAlertView2("配置信息错误", error + '', null, ()=>{
                    thiz._configRequest();
                });
            } else {
                if (resp && resp.maxProNo) {
                    DataCenter.setConfigData(resp);
                    thiz._loginRequest();
                }else{
                    PopAlert.showAlertView2("配置信息错误", error + '', null, ()=>{
                        thiz._configRequest();
                    });
                }
            }
        });
    };

    _loginRequest = ()=>{
        console.log("eadae", this.props.userInfo);
        if (this.props.userInfo.loginStatus == 1) {
            var thiz = this;
            HttpApi.login(this.props.userInfo.username, this.props.userInfo.password, (resp, error)=>{
                if (resp && resp.token) {
                    console.log("11111----"+resp.token);
                    thiz.state.reLoginState = 1;
                    thiz.props.actions.setToken(resp.token);
                }else{
                    Actions[ViewKeys.VIEW_LOGIN]({});
                }
            });
        }else {
            setTimeout(() => {
                Actions[ViewKeys.VIEW_LOGIN]({});
            }, 2000);
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render(){
        return (
            <View {...this.props}  style={styles.container}>
                <Image
                    source={require('../assets/splash_logo.png')}
                    style={styles.logo}
                />
            </View>
        );
    }
}

function mapStateToProps(state, ownProps) {
    CONNECT_STATUS += 1;
    return {
        userInfo:state.login,
        reduxState:CONNECT_STATUS,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(Splash);