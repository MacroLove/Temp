import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import React from "react";
import {
    View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image,
    FlatList, TouchableOpacity, DatePickerAndroid, DatePickerIOS, TimePickerAndroid
} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage, Overlay,

} from "teaset";
import IconBadge from 'react-native-icon-badge';
import Icon from "react-native-vector-icons/Entypo"
import * as Progress from 'react-native-progress';
import Toast from 'react-native-root-toast';
import {COLOR_NAV_BG, COLOR_VIEW_BG} from "../../../constants/Colors";
import SearchInput from "../../../widgets/SearchInput/SearchInput";
import PTRListView, {RefreshState} from '../../../widgets/PTRListView';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";

var array_ = require('lodash/array');
var moment_ = require('moment');

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let IMAGE_OK = require('../../../assets/gaoji/ic_cmd_ok.png');
let IMAGE_FAILE = require('../../../assets/gaoji/ic_cmd_failed.png');
let IMAGE_WAIT = require('../../../assets/gaoji/ic_cmd_waiting.png');
let IMAGE_SEND = require('../../../assets/gaoji/ic_cmd_sending.png');
let IMAGE_TIMEOUT = require('../../../assets/gaoji/ic_cmd_timeout.png');
let LIST_ITEM_H = 80;
let MAP_STATUS_IMAGE = {1:IMAGE_WAIT, 2:IMAGE_SEND, 3:IMAGE_OK, 4:IMAGE_FAILE, 5:IMAGE_TIMEOUT};
let MAP_OPERATE_STR = {'set_param':'设置屏参', 'timing':'自动校时','part_refresh':'天气刷新','clear_screen':'清除屏幕',
    'open_screen':'开启屏幕','close_screen':'关闭屏幕','led_light':'亮度',}

class MyListItem extends React.PureComponent {
    _onPressButton = (type) => {
        this.props.onPressButton(this.props.item, type);
    };

    render() {
        var stImg = MAP_STATUS_IMAGE[this.props.item.status];
        var fsize = (this.props.badge+"").length >= 3 ? 8 : 10;
        return (
            <View style={styles.cellMiddle}>
                <IconBadge
                    MainElement={
                        <Image style={{margin: 8, resizeMode: 'contain'}}
                               source={require('../../../assets/gaoji/icon_cmd.png')}/>
                    }
                    BadgeElement={
                        <Text style={{color: '#fff', fontSize:fsize, backgroundColor:'#0000'}}>{this.props.badge || ""}</Text>
                    }
                    IconBadgeStyle={
                        {
                            width: 20,
                            height: 20,
                            borderRadius:10,
                            backgroundColor: '#00bdbf'
                        }
                    }
                    hidden
                />
                <View style={{flex:1, marginLeft:10, }}>
                    <Text style={{color: 'black', fontSize: 15, fontWeight:'200'}}>{'设备号：'+ (this.props.item.device)}</Text>
                    <Text style={{color: 'gray', fontSize: 14}}>{'指令：'+ MAP_OPERATE_STR[this.props.item.operate]}</Text>
                </View>
                <View style={{position:'absolute', width:ScreenWidth, height:LIST_ITEM_H-20, paddingRight:20,
                    alignItems:'flex-end', justifyContent:'space-between', backgroundColor:'#0000'}}>
                    <Image source={MAP_STATUS_IMAGE[this.props.item.status]}/>
                    <Text style={{color: 'gray', fontSize: 12}}>{this.props.item.ctime}</Text>
                </View>
            </View>
        )
    }
}

class CmdRecordList extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "指令历史",
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 0,
            dataAll: [],
            refreshState: RefreshState.Idle,

        };
    }

    componentDidMount() {
        this.loadData(1);
    }

    componentWillUnmount() {

    }

    renderNavigationRightView() {
        // return <NavigationBar.LinkButton
        //     title="清除指令"
        //     onPress={()=>{
        //         this._clearCmd();
        //     }}
        // />
        return null;
    }

    renderPage() {
        return (
            <View style={styles.container}>
                <PTRListView
                    style={{flex: 1}}
                    data={this.state.dataAll}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
            </View>
        );
    }

    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.loadData(1);
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.loadData(this.state.page+1);
    }

    loadData = (page) => {
        var thiz = this;
        HttpApi.getCmdSendHistory({token:this.props.userInfo.token, p:page, data:{}}, (resp, error)=>{
            let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                if (resp && resp.length > 0) {
                    if (page <= 1) {
                        thiz.state.dataAll = resp;
                    }else{
                        thiz.state.dataAll = thiz.state.dataAll.concat(resp);
                    }
                }
            }
            thiz.setState({
                page:page,
                refreshState
            });
        });
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item, index}) => (
        <MyListItem
            id={item.id}
            item={item}
            badge={""+(index+1)}
            onPressButton={this._onPressItemButtons}
        />
    );

    _clearCmd = ()=>{
        PopAlert.showAlertView2("清除指令", "确定要清除指令吗？", null, ()=>{

        });
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    cellMiddle: {
        width:ScreenWidth, height: LIST_ITEM_H,backgroundColor:'#f9f9f9',
        flexDirection: 'row', paddingLeft: 10, paddingRight: 20, paddingTop:10, paddingBottom:4,
        borderBottomWidth:0.7, borderColor:"#ddd",
        alignItems: 'center', justifyContent: 'flex-start'
    },
});

module.exports = CmdRecordList;
