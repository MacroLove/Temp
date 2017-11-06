import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import * as Colors from "../../constants/Colors";

import * as Apis from '../../actions/apis';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {Actions} from "react-native-router-flux";
import RoundImage from '../../widgets/RoundImage';

import SettingPage from './settings/settings';
import UserInfoPage from './person/userPage';
import AdsHistPage from './history/adsHistory';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class MyInfoMainView extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };

    constructor(props) {
        super(props);

    }

    componentDidMount() {
        this.props.actions.getUserInfo({token:this.props.userInfo.token});
    }

    componentWillUnmount() {

    }

    renderNavigationRightView() {
        return <NavigationBar.LinkButton
            title="设置"
            onPress={()=>{
                this.navigator.push({view: <SettingPage {...this.props} title="设置" showBackButton/>});
            }}
        />
    }

    //https://facebook.github.io/react/img/logo_og.png
    renderPage() {
        let topHeight = ScreenHeight/5;
        return (
            <ScrollView style={styles.container}>
                <View style={{flex: 1}}>
                    <View style={{width:ScreenWidth, height:topHeight, backgroundColor:Colors.COLOR_NAV_BG,
                        alignItems:'center', flexDirection:"row", paddingLeft:40, paddingRight:10}}>
                        <RoundImage
                            style={{width:64, height:64, borderRadius:32, backgroundColor:'#eee'}}
                            source = {this.props.userInfo.head_portrait+""}
                            placeholder = {require('../../assets/default_user.png')}
                        />
                        <View style={{flex:1, marginLeft: 10}}>
                            <Text style={{color:'white', fontSize:14,}}>昵称：{this.props.userInfo.nickname || this.props.userInfo.username}</Text>
                        </View>
                        <Icon.Button name="chevron-right" color="white" size={44} backgroundColor='#0000'
                                     underlayColor="#0000"
                            onPress={()=>{
                                this.navigator.push({view:<UserInfoPage userInfo={this.props.userInfo} actions={this.props.actions} dispatch={this.props.dispatch}/>});
                            }}
                        />
                    </View>

                    <ListRow title={'我的广告历史'} detail={'查看更多历史'} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                        onPress={()=>{
                            this.navigator.push({view:<AdsHistPage userInfo={this.props.userInfo} actions={this.props.actions}/>});
                        }}
                    />
                    <View style={styles.cellContainer}>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{
                            this.navigator.push({view:<AdsHistPage userInfo={this.props.userInfo} selectedTab={1}/>});
                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_his_waiting.png')} />
                            <Label style={styles.sendTitle} text='待发送' />
                        </Button>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{
                            this.navigator.push({view:<AdsHistPage userInfo={this.props.userInfo} selectedTab={2}/>});
                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_his_sending.png')} />
                            <Label style={styles.sendTitle} text='发送中' />
                        </Button>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{
                            this.navigator.push({view:<AdsHistPage userInfo={this.props.userInfo} selectedTab={3}/>});
                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_his_succ.png')} />
                            <Label style={styles.sendTitle} text='成功' />
                        </Button>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{
                            this.navigator.push({view:<AdsHistPage userInfo={this.props.userInfo} selectedTab={4}/>});
                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_his_fail.png')} />
                            <Label style={styles.sendTitle} text='失败' />
                        </Button>
                    </View>

                    <ListRow title={'工具'} style={{marginTop:4}}/>
                    <View style={[styles.cellContainer, {height:100}]}>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{

                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_tool_wifi.png')} />
                            <Label style={styles.sendTitle} text='Wi-Fi设置' />
                        </Button>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{

                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_tool_msg.png')} />
                            <Label style={styles.sendTitle} text='消息' />
                        </Button>
                        <Button style={styles.sendBtn} underlayColor="#0000" onPress={()=>{

                        }}>
                            <Image style={styles.sendImg} source={require('../../assets/me/ic_tool_favor.png')} />
                            <Label style={styles.sendTitle} text='收藏' />
                        </Button>
                    </View>

                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellContainer: {
        flex           : 1,
        height         : 90,
        backgroundColor: '#fff',
        flexDirection  : "row",
        alignItems     : 'center',
        justifyContent : "space-around"
    },
    sendBtn: {
        backgroundColor: '#0000', flexDirection:'column', borderColor:'#0000'
    },
    sendTitle: {
        color: '#888', fontSize: 14
    },
    sendImg: {

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

var InfoV = connect(mapStateToProps, mapDispatchToProps)(MyInfoMainView);

export default class MyInfo extends React.Component {
    render(){
        return (
            <TeaNavigator rootView={
                <InfoV {...this.props}/>
            }/>
        );
    }
}
