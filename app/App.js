import React, {Component} from "react";
import {StyleSheet, Text, View, BackHandler} from "react-native";
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import {Provider, connect} from "react-redux";
import configStore from "./store/configStore";
import Storage from 'react-native-storage';
import { AsyncStorage } from 'react-native';

// views
import * as Colors from './constants/Colors';
import * as ViewKeys from "./constants/ViewKeys";
import Splash from "./scenes/Splash";
import TabIcon from "./widgets/TabBarIcon";
import LoginChooseMode from "./scenes/login/loginChooseMode";
import LoginModeAcc from "./scenes/login/loginModeAcc";
import LoginModeAcc0 from "./scenes/login/loginModeAcc0";
import LoginModeAp from "./scenes/login/loginModeAp";
import Register from "./scenes/login/register";
import AdMain from './scenes/ads/adMain';
import MyInfo from './scenes/me/myInfo';
import Discover from './scenes/discover/discoverMain';
import Details from './scenes/discover/article/details';
import Comments from './scenes/discover/article/comments';
import AddLedScreen from './scenes/ads/addLed';
import LedMap from './scenes/ads/ledMap';

import {VIEW_ADD_LED_SCREEN} from "./constants/ViewKeys";

const styles = StyleSheet.create({
    tabBarStyle: {
        borderTopWidth: 1,
        borderColor: '#ddd',
        backgroundColor: '#fefefe',
        height: 54,
    },
    tabLabelStyle: {
        fontSize: 11,
    },
    tabIconStyle: {
        marginTop: -3,
    },
    tabIndicatorStyle: {
        backgroundColor:'transparent'
    }
});

import TTTT from './scenes/ads/newAd/editWeatherPage';
import {VIEW_TABS} from "./constants/ViewKeys";
import {VIEW_LOGIN} from "./constants/ViewKeys";
import {VIEW_LED_MAP} from "./constants/ViewKeys";
import {VIEW_ARTICLE_DETAILS} from "./constants/ViewKeys";
import {VIEW_ARTICLE_COMMENT} from "./constants/ViewKeys";

const scenes = Actions.create(
        <Scene key="modal" modal hideNavBar>

            {/*<Scene key="tttttttestttttt" component={TTTT} hideNavBar initial/>*/}

            <Scene key={ViewKeys.VIEW_SPLASH} component={Splash} type={ActionConst.RESET} hideNavBar initial/>

            {/*Login*/}
            <Scene key={VIEW_LOGIN} hideNavBar type={ActionConst.RESET}>
                <Scene key={ViewKeys.VIEW_LOGIN_CHOOSE_MODE}
                       component={LoginChooseMode}
                       title=""
                       onEnter={()=>console.log('onEnter')}
                       onExit={()=>console.log('onExit')}
                       hideNavBar/>

                <Scene key={ViewKeys.VIEW_LOGIN_MODE_ACC0}
                       component={LoginModeAcc0}
                       title=""
                       onEnter={()=>console.log('onEnter')}
                       onExit={()=>console.log('onExit')}
                       hideNavBar onLeft={Actions.pop}/>

                <Scene key={ViewKeys.VIEW_LOGIN_MODE_ACC}
                       component={LoginModeAcc}
                       title=""
                       onEnter={()=>console.log('onEnter')}
                       onExit={()=>console.log('onExit')}
                       hideNavBar onLeft={Actions.pop}/>

                <Scene key={ViewKeys.VIEW_LOGIN_MODE_AP}
                       component={LoginModeAp}
                       title="连接设备"
                       onEnter={()=>console.log('onEnter')}
                       onExit={()=>console.log('onExit')}
                       onLeft={Actions.pop}/>

                <Scene key={ViewKeys.VIEW_REGISTER}
                       component={Register}
                       title="注册"
                       titleStyle={{alignSelf: 'center'}}
                       onEnter={()=>console.log('onEnter')}
                       onExit={()=>console.log('onExit')}
                       onLeft={Actions.pop}/>
            </Scene>

            {/*Tab*/}
            <Scene key={VIEW_TABS} type={ActionConst.RESET}
                   gestureEnabled={true}
                   showLabel={true}
                   hideNavBar
                   tabs
                   showIcon
                   swipeEnabled={false}
                   animationEnabled={false}
                   scrollEnabled={false}
                   tabBarPosition={'bottom'}
                   tabBarStyle={styles.tabBarStyle}
                   labelStyle={styles.tabLabelStyle}
                   iconStyle={styles.tabIconStyle}
                   indicatorStyle={styles.tabIndicatorStyle}
                   inactiveTintColor='#555'
                   activeTintColor={Colors.COLOR_NAV_BG}>
                <Scene
                    key="tab1"
                    tabBarLabel="发送广告"
                    icon={(p)=>{
                        return (<TabIcon iconActive={require('./assets/tabs/ic_ad_1.png')} iconInactive={require('./assets/tabs/ic_ad_0.png')} focused={p.focused}/>);
                    }}
                    hideNavBar>
                    <Scene
                        key={ViewKeys.VIEW_TAB_ADS}
                        component={AdMain}
                        onRight={() => alert('Right button')}
                    />
                </Scene>
                <Scene
                    key="tab2"
                    tabBarLabel="发现"
                    icon={(p)=>{
                        return (<TabIcon iconActive={require('./assets/tabs/ic_disc_1.png')} iconInactive={require('./assets/tabs/ic_disc_0.png')} focused={p.focused}/>);
                    }}
                    hideNavBar>
                    <Scene
                        key={ViewKeys.VIEW_TAB_DISCOVER}
                        component={Discover}
                    />
                </Scene>
                <Scene
                    key="tab3"
                    tabBarLabel="我"
                    icon={(p)=>{
                        return (<TabIcon iconActive={require('./assets/tabs/ic_me_1.png')} iconInactive={require('./assets/tabs/ic_me_0.png')} focused={p.focused}/>);
                    }}
                    hideNavBar>
                    <Scene
                        key={ViewKeys.VIEW_TAB_ME}
                        component={MyInfo}
                        onRight={() => alert('Right button')}
                        hideNavBar
                    />
                </Scene>
            </Scene>

            {/*Ads*/}
            <Scene key={VIEW_ADD_LED_SCREEN}
                   component={AddLedScreen}
                   type={ActionConst.PUSH} hideNavBar/>

            {/*Map*/}
            <Scene key={VIEW_LED_MAP}
                   component={LedMap}
                   type={ActionConst.PUSH} hideNavBar/>

            {/*Discover*/}
            <Scene
                key={VIEW_ARTICLE_DETAILS}
                component={Details}
                type={ActionConst.PUSH} hideNavBar/>
            <Scene
                key={VIEW_ARTICLE_COMMENT}
                component={Comments}
                type={ActionConst.PUSH} hideNavBar/>

            {/*Me*/}

        </Scene>
);

const ReduxRouter = connect((state) => ({state: state.route}))(Router);

// it is important to load reducers AFTER actions.create (so no import here)
const reducers = require('./reduces/index').default;

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.initStorage();
        BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
    }

    initStorage(){
        var storage = new Storage({
            // 最大容量，默认值1000条数据循环存储
            size: 1000,

            // 存储引擎：对于RN使用AsyncStorage，对于web使用window.localStorage
            // 如果不指定则数据只会保存在内存中，重启后即丢失
            storageBackend: AsyncStorage,

            // 数据过期时间，默认一整天（1000 * 3600 * 24 毫秒），设为null则永不过期
            defaultExpires: null,

            // 读写时在内存中缓存数据。默认启用。
            enableCache: true,

            // 如果storage中没有相应数据，或数据已过期，
            // 则会调用相应的sync方法，无缝返回最新数据。
            // sync方法的具体说明会在后文提到
            // 你可以在构造函数这里就写好sync的方法
            // 或是在任何时候，直接对storage.sync进行赋值修改
            // 或是写到另一个文件里，这里require引入
            // sync: require('你可以另外写一个文件专门处理sync')
        });
        global.TGStorage = storage;
    }

    onBackPress = () => {
        if (Actions.state.routes.length === 1 || (Actions.state.routes[Actions.state.routes.length-1].routes && Actions.state.routes[Actions.state.routes.length-1].routes.length == 1)) {
            return false;
        }
        Actions.pop();
        return true;
    }

    render() {
        var oo = configStore(reducers, {}); //https://stackoverflow.com/questions/37042790/how-can-i-persist-react-native-redux-state-using-redux-persist
        return (
            <Provider store={oo[0]} persistor={oo[1]}>
                <ReduxRouter navigator={scenes}/>
            </Provider>
        );
    }
}