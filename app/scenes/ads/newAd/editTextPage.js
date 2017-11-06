import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar, InteractionManager
} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    TeaNavigator,
    Popover,
    Overlay,
    Toast
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_NAV_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import DataCenter from '../../../models/DataCenter';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import {AdType_AutoText, AdType_Text} from "../../../constants/Defines";
import BaseEditPage from "./BaseEditPage";

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * 文字 + 自适应字幕
 * */
class EditTextPage extends BaseEditPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "字幕",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        var info = DataCenter.editingAdData[0].info_pos;
        var itemData = DataCenter.editingAdData[0].list_item[0];
        this.state = {
            itemData:itemData,
            program_id: DataCenter.editingAdPro.program_id,
            strPro: info.w +"x"+ info.h +"  "
                    + DataCenter.configs.PROGRAM_TYPE_COLOR[DataCenter.editingAdPro.type_color] + "  "
                    + DataCenter.configs.GRAY_LEVEL[DataCenter.editingAdPro.gray],

            strFont:DataCenter.configs.PROGRAM_FONT[itemData.font],
            strSize:itemData.fontSize,
            strAnim:DataCenter.configs.PROGRAM_ANIMATION[itemData.animationway],
            strSpeed:itemData.speed,
            strColor:DataCenter.configs.PROGRAM_FONT_COLOR[itemData.color],
            strDelay:itemData.remaintime,
            strAlignH:DataCenter.configs.PROGRAM_FONT_ALIGN[itemData.alignHorizontal],
            strAlignV:DataCenter.configs.PROGRAM_ALIGN_VERTICAL[itemData.align_vertical],
            strBorder:DataCenter.configs.PROGRAM_BORDER[itemData.bordercolor],
            //strBg:'',
            strVertical:itemData.vertical,
            strValue:itemData.value,

            // for new text
            everChangeName: false,
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderNavigationRightView() {
        if (this.props.fromFenqu) return null;
        return <NavigationBar.LinkButton
            title={'取消'}
            onPress={() => this.navigator.pop()}
        />
    }

    renderNavigationTitle() {
        return (this.props.type == "autotxt" ? "自适应字幕" : "字幕");
    }

    renderNavigationBar() {
        return (
            <NavigationBar
                style={{backgroundColor:'#12b7f5'}}
                title={this.renderNavigationTitle()}
                leftView={this.renderNavigationLeftView()}
                rightView={this.renderNavigationRightView()}
                statusBarColor="#12b7f5"
            />
        );
    }

    renderPage() {
        return (
            <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
            <ScrollView style={{flex: 1, backgroundColor:'#f2f2f2'}}>
                <Image style={{width:ScreenWidth, height:70}} resizeMode='stretch' source={require('../../../assets/newads/new/pixel_black_top.png')}/>

                {
                    this.props.fromFenqu ? null :
                        <ListRow style={[styles.cellContainer]}
                                 title="广告参数：" titleStyle={{color:'black', fontSize:16, fontWeight:'bold'}}
                                 detail={this.state.strPro}
                                 detailStyle={styles.editPcCellDetailStyle} bottomSeparator="full" topSeparator="full"
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 onPress={()=>{
                                     if (this.props.isNewTxt && !this.state.everChangeName && this.state.itemData.value.length > 0) { //新建，没改名字
                                         DataCenter.editingAdPro.program_name = this.state.itemData.value.substr(0, 10);
                                     }
                                     this.state.everChangeName = true; //认可了默认设置的名字
                                     this._onPressConfig();
                                 }}
                        />
                }

                <Input
                    style={{backgroundColor:'white', borderColor:'#12b7f5', borderWidth:2, borderRadius:6, height:100,
                        marginLeft:10, marginRight:10, marginTop:4, marginBottom:4,
                        textAlignVertical:'top'}}
                    defaultValue={this.state.strValue}
                    onChangeText={(t)=>(this.state.itemData.value=t)}
                    multiline={true}
                />

                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_wz.png')}/>}
                         detail={this.state.strFont} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditZiti((txt)=>{
                                 let k = dic_.findKey(DataCenter.configs.PROGRAM_FONT, function (t) {
                                     return t == txt;
                                 });
                                 this.state.itemData.font = k ? k : '1';
                                 this.state.strFont = k ? txt : '不支持';
                                 this.forceUpdate();
                             });
                         }}
                />
                {
                    this.props.type == 'autotxt' ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_wzdx.png')}/>}
                                 detail={this.state.strSize} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     PopAlert.popEditSize((txt)=>{
                                         this.state.itemData.fontSize = txt;
                                         this.state.strSize = txt;
                                         this.forceUpdate();
                                     });
                                 }}
                        />
                }
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_dhfs.png')}/>}
                         detail={this.state.strAnim} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditDonghua((txt, conti)=>{
                                 this.state.strAnim = txt;
                                 if (txt == "镭射") txt = "向右镭射";
                                 if (conti) {
                                     PopAlert.popEditJianGe("", (val)=>{
                                         this.state.itemData.animationway = 'left';
                                         this.state.itemData.continue = 1;
                                         if (conti) { //字幕 动画方式为 连续左移时 对齐方式为水屏居左 垂直居中对齐
                                             this.state.itemData.alignHorizontal = 'left';
                                             this.state.itemData.align_vertical = 'center';
                                         }
                                         this.state.itemData.size_interval = parseInt(val);
                                         this.forceUpdate();
                                     });
                                 }else {
                                     let k = dic_.findKey(DataCenter.configs.PROGRAM_ANIMATION, function (t) {
                                         return t == txt;
                                     });
                                     this.state.itemData.animationway = k;
                                     this.state.itemData.continue = 0;
                                     this.state.itemData.size_interval = 0;
                                     this.forceUpdate();
                                 }
                             });
                         }}
                />
                {
                    //立即显示没有移动速度
                    this.state.itemData.animationway == 1 ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_ydsd.png')}/>}
                                 detail={this.state.strSpeed} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     if (this.state.itemData.speed == 0) this.state.itemData.speed = 10;
                                     PopAlert.popEditSlider("当前移动速度：", 15, 1, '15（快）', '1（慢）', this.state.itemData.speed,
                                         (txt)=>{
                                             this.state.itemData.speed = txt;
                                             this.state.strSpeed = txt+"";
                                             this.forceUpdate();
                                         });
                                 }}
                        />
                }
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_ys.png')}/>}
                         detail={this.state.strColor} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditFontColor((txt)=>{
                                 let k = dic_.findKey(DataCenter.configs.PROGRAM_FONT_COLOR, function (t) {
                                     return t == txt;
                                 });
                                 this.state.itemData.color = k;
                                 this.state.strColor = txt+"";
                                 this.forceUpdate();
                             });
                         }}
                />
                {
                    //连续左移没有停留时间
                    this.state.itemData.animationway == 'left' ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_tlsj.png')}/>}
                                 detail={this.state.strDelay} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     if (this.state.itemData.remaintime == 0) this.state.itemData.remaintime = 3;
                                     PopAlert.popEditTimeStay(this.state.itemData.remaintime,
                                         (txt)=>{
                                             this.state.itemData.remaintime = txt;
                                             this.state.strDelay = txt+"";
                                             this.forceUpdate();
                                         });
                                 }}
                        />
                }
                {
                    //连续左移没有对齐方式
                    this.state.itemData.animationway == 'left' ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_dqfs.png')}/>}
                                 detail={this.state.strAlignH + " " + this.state.strAlignV} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={()=>{
                                     if (this.state.itemData.continue == 1) {
                                         return;
                                     }
                                     PopAlert.popEditDuiQi((dir, txt, t2)=>{
                                         if (dir == 'h') {
                                             let k = dic_.findKey(DataCenter.configs.PROGRAM_FONT_ALIGN, function (t) {
                                                 return t == txt;
                                             });
                                             this.state.itemData.alignHorizontal = k;
                                             this.state.strAlignH = t2+"";
                                         }else if (dir == 'v') {
                                             let k = dic_.findKey(DataCenter.configs.PROGRAM_ALIGN_VERTICAL, function (t) {
                                                 return t == txt;
                                             });
                                             this.state.itemData.align_vertical = k;
                                             this.state.strAlignV = t2+"";
                                         }
                                         this.forceUpdate();
                                     });
                                 }}
                        />
                }
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_hrbk.png')}/>}
                         detail={this.state.strBorder} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>{
                             PopAlert.popEditHuanRao((txt)=>{
                                 let k = dic_.findKey(DataCenter.configs.PROGRAM_BORDER, function (t) {
                                     return t == txt;
                                 });
                                 this.state.itemData.bordercolor = k;
                                 this.state.strBorder = txt+"";
                                 this.forceUpdate();
                             });
                         }}
                />
                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_dlxs.png')}/>}
                         accessory={
                             <Switch
                                 onTintColor={COLOR_NAV_BG}
                                 tintColor="#aaa"
                                 thumbTintColor="#eee"
                                 value={this.state.strVertical == 1}
                                 onValueChange={(toggle)=>{
                                     this.state.itemData.vertical = toggle ? 1 : 0;
                                     this.setState({strVertical:this.state.itemData.vertical});
                                 }}
                             />
                         }
                         bottomSeparator="full"
                         topSeparator="full"
                />
            </ScrollView>

                {
                    //this.props.fromFenqu ? null :
                        this._makeViewSaveAndSend()
                }
            </View>
        );
    }

    _onClickSave = (tf)=>{
        if (this.state.itemData.value.length == 0) {
            Toast.info("请输入内容");
            return;
        }
        if (this.props.fromFenqu) {
            this.navigator.pop();
            return;
        }
        if (this.props.isNewTxt && !this.state.everChangeName) { //新建，没改名字
            DataCenter.editingAdPro.program_name = this.state.itemData.value.substr(0, 10);
        }
        PopAlert.showLoadingView();
        let pa = {
            token: this.props.token,
            pro: DataCenter.editingAdPro,
            data: DataCenter.editingAdData,
            extend:{addtype:this.props.type == 'autotxt' ? AdType_AutoText : AdType_Text}
        };
        if (!this.props.isNew) {
            pa.program_id = this.state.program_id;
        }
        this._onSaveAdData(pa, tf);
    }
}

const styles = StyleSheet.create({
    cellContainer: {
        backgroundColor:'#fff',
        marginTop:10,
    },

    editPcCellImg:{
        width: 85,
        height: 30,
    },

    editPcCellDetailStyle: {
        color:'#888',
        fontSize:15,
        textAlign:'right',
        backgroundColor:'#0000',
        marginRight:10,
    },
});

module.exports = EditTextPage;