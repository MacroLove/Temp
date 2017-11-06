import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage, Toast} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import * as Colors from "../../../constants/Colors";

import * as Apis from '../../../actions/apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";

import AboutPage from './about';
import HelpPage from './help';
import AccPage from './accountManage';
import {VIEW_LOGIN} from "../../../constants/ViewKeys";
import HttpApi from "../../../network/HttpApi";


let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class SettingsPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "注册",
        showBackButton: true,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        HttpApi.getArticles({token:this.props.userInfo.token, type:2, page:1}, (resp, error)=>{
           console.log(resp);
        });
    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
                <View style={styles.container}>
                    <View>
                    <ListRow title={'账号管理'} titleStyle={styles.cellTitle} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{
                                 this.navigator.push({view: <AccPage {...this.props} title="帐号管理" showBackButton/>});
                        }}
                    />
                    <ListRow title={'清除缓存'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{
                                 //TGStorage.clearMap();
                                 Toast.success("缓存已清除");
                        }}
                    />

                    <ListRow title={'帮助与反馈'} titleStyle={styles.cellTitle} style={[{marginTop:4}]} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{
                                 this.navigator.push({view: <HelpPage {...this.props} title="帮助与反馈" showBackButton/>});
                        }}
                    />
                    <ListRow title={'关于'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{
                                 this.navigator.push({view: <AboutPage title="关于" showBackButton />});
                        }}
                    />
                    </View>

                    <Button title="退出登录" style={{alignSelf:'center', backgroundColor:Colors.COLOR_NAV_BG, width:ScreenWidth-80, height:40, marginBottom:100}}
                            titleStyle={{color:'white'}}
                            onPress={()=>{
                        this.props.actions.quit();
                        Actions[VIEW_LOGIN]();
                    }} />

                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent:'space-between',
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellTitle: {
        color:'#555'
    },
});

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

export default connect(mapStateToProps, mapDispatchToProps)(SettingsPage);
