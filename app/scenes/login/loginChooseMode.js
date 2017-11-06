import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, Dimensions} from "react-native";
import { Navigator } from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {
    TeaNavigator,
    NavigationBar,
    ListRow,
    Button,
    Label,
    Theme,
    Overlay,
    NavigationPage,
} from 'teaset';

import * as Apis from '../../actions/apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import {Actions} from "react-native-router-flux";
import * as ViewKeys from '../../constants/ViewKeys';
import * as Colors from '../../constants/Colors';
import LoginModeAcc0 from './loginModeAcc0';
import LoginModeAp from './loginModeAp';
import DataCenter from "../../models/DataCenter";
import {LoginType} from "../../constants/Defines";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "transparent",
    },
    text: {
        backgroundColor:'#0000',
        color: 'black',
        fontSize: 18,
    },
    textIcon: {
        backgroundColor:'#0000',
        color: '#555',
        fontSize: 14,
    }
});


let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth =  Dimensions.get('window').width;

class MainView extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };

    constructor(props) {
        super(props);
        this.state = {
            mode: 0, // 0 remote, 1 near,
        };
    }

    componentDidMount(){

    }

    componentWillUnmount(){

    }

    renderNavigationBar() {
        return null;
    }

    renderPage() {
        let imgRemote = this.state.mode == 0 ? require('../../assets/ic_ctl_remote1.png') : require('../../assets/ic_ctl_remote0.png');
        let imgLocal = this.state.mode == 1 ? require('../../assets/ic_ctl_local1.png') : require('../../assets/ic_ctl_local0.png');
        return (
            <View style={[styles.container, {justifyContent:'center'}]}>
                <View style={[{alignItems:'center', justifyContent:'space-around',
                     width:ScreenWidth, height:400,}]}>
                    <Text style={[styles.text, {}]}>
                        {'请选择控制卡类型'}
                    </Text>
                    <View style={{flexDirection:'row', justifyContent:'space-around', width:ScreenWidth}}>
                        <TouchableOpacity onPress={()=>{
                            this.setState({mode: 0});
                        }}>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Image style={{width:64, height:64}} source={imgRemote}/>
                                <Text style={styles.textIcon}>
                                    {'远程控制'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{
                            this.setState({mode: 1});
                        }}>
                            <View style={{flexDirection:'column', alignItems:'center'}}>
                                <Image style={{width:64, height:64}} source={imgLocal}/>
                                <Text style={styles.textIcon}>
                                    {'近距离控制'}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <Button
                        title={'下一步'}
                        onPress={()=>{
                            DataCenter.localMode = this.state.mode == 0 ? LoginType.Remote : LoginType.Ap;
                            if (this.state.mode == 0) {
                                this.navigator.push({view: <LoginModeAcc0 navigationBarInsets={false}/>});
                            }else{
                                this.navigator.push({view: <LoginModeAp />})
                            }
                        }}
                        style={{backgroundColor: Colors.COLOR_NAV_BG, borderColor: '#0000', width:ScreenWidth-80, height:40}}
                        titleStyle={{color:'white'}}
                    />
                </View>
            </View>
        );
    }
}

class LoginChooseMode extends React.Component {
    render(){
        return (
            <TeaNavigator rootView={
                <MainView {...this.props}/>
            }/>
        );
    }
}

module.exports = LoginChooseMode;
