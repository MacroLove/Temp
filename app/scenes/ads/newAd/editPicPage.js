import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar, InteractionManager, ActivityIndicator
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
import Icon from "react-native-vector-icons/Entypo";
import {COLOR_NAV_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import DataCenter from '../../../models/DataCenter';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import {AdType_Image} from "../../../constants/Defines";
import BaseEditPage from "./BaseEditPage";

var array_ = require('lodash/array');
var dic_ = require('lodash/object');
let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 * 图片
 * */
class EditPicPage extends BaseEditPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "图片",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        var info = DataCenter.editingAdData[0].info_pos;
        var itemData = DataCenter.editingAdData[0].list_item[0];
        var imgPath = "" + DataCenter.editingAdData[0].list_item[0].img_url;
        var cnt = imgPath.indexOf("http:") == -1 ? 0 : 1;
        var phs = cnt > 0 ? [{path:imgPath}] : [];
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
            strAlign:DataCenter.configs.PROGRAM_FONT_ALIGN[itemData.alignHorizontal],
            strBorder:DataCenter.configs.PROGRAM_BORDER[itemData.bordercolor],
            //strBg:'',
            strVertical:itemData.vertical,
            strValue:itemData.value,

            isLoadingImage: true,
            selectFormat:0,
            picCount: cnt,
            photos:phs, // {path:, data:} , data is base64 image data for thumbnail; for ios see the docs.
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
            <View style={{flex: 1, backgroundColor:'#f2f2f2'}}>
                <ScrollView style={{flex: 1, backgroundColor:'#f2f2f2'}}>
                <Image style={{width:ScreenWidth, height:70}} resizeMode='stretch' source={require('../../../assets/newads/new/pixel_black_top.png')}/>

                {
                    this.props.fromFenqu ? null :
                        <ListRow style={[styles.cellContainer]}
                                 title="广告参数：" titleStyle={{color: 'black', fontSize: 16, fontWeight: 'bold'}}
                                 detail={this.state.strPro}
                                 detailStyle={styles.editPcCellDetailStyle} bottomSeparator="full" topSeparator="full"
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 onPress={() => {
                                     this._onPressConfig()
                                 }}
                        />
                }
                <View style={{width:ScreenWidth, height:100, backgroundColor:'#f5f5f5', justifyContent:'center',
                    paddingTop:20, paddingBottom:20, paddingRight:10, paddingLeft:10}}>
                     {
                         this._makeImages()
                     }
                </View>

                {
                    //连续左移没有停留时间
                    this.state.itemData.animationway == 'left' ? null :
                        <ListRow style={[styles.cellContainer]}
                                 icon={<Image style={styles.editPcCellImg}
                                              source={require('../../../assets/newads/new/ic_e_tlsj.png')}/>}
                                 detail={this.state.strDelay} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={() => {
                                     if (this.state.itemData.remaintime == 0) this.state.itemData.remaintime = 3;
                                     PopAlert.popEditTimeStay(this.state.itemData.remaintime,
                                         (txt) => {
                                             this.state.itemData.remaintime = txt;
                                             this.state.strDelay = txt + "";
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
                                 icon={<Image style={styles.editPcCellImg}
                                              source={require('../../../assets/newads/new/ic_e_ydsd.png')}/>}
                                 detail={this.state.strSpeed} detailStyle={styles.editPcCellDetailStyle}
                                 accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                 bottomSeparator="full"
                                 topSeparator="full"
                                 onPress={() => {
                                     if (this.state.itemData.speed == 0) this.state.itemData.speed = 10;
                                     PopAlert.popEditSlider("当前移动速度：", 15, 1, '15（快）', '1（慢）', this.state.itemData.speed,
                                         (txt) => {
                                             this.state.itemData.speed = txt;
                                             this.state.strSpeed = txt + "";
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
            </ScrollView>

                {
                    //this.props.fromFenqu ? null :
                        this._makeViewSaveAndSend()
                }
            </View>
        );
    }


    _makeImages = ()=>{
        var imgViews = [];
        let thiz = this;
        this.state.photos.map((p, i)=>{
            imgViews.push(
                <View key = {''+i}>
                    <Image
                        style={styles.imageCell}
                        source={{ uri: p.data || p.path }}
                        onLoadEnd={()=>{
                            thiz.setState({isLoadingImage:false});
                        }}
                    >
                        <ActivityIndicator
                            animating={thiz.state.isLoadingImage}
                            style={{alignSelf:"center"}}
                            size="small"
                        />
                    </Image>
                    <View style={{position:'absolute', left: 40, top: -15}}>
                        <Icon.Button name="circle-with-minus" color="#f00" size={20}
                                     underlayColor="#0000"
                                     backgroundColor="#0000"
                                     onPress={()=>{
                                         this._onPressDel(i);
                                     }}/>
                    </View>
                </View>);
        });
        if (this.state.photos.length < 1) {
            imgViews.push(<TouchableOpacity onPress={this._onPressAddButton} key="99">
                <Image
                    style={styles.imageCell}
                    source={require('../../../assets/ic_add_pic.png')}
                />
            </TouchableOpacity>);
        }
        var left = 1 - this.state.picCount - 1;
        for (; left > 0; left--) {
            imgViews.push(<View
                key = {'e'+left}
                style={styles.imageCell}
            />);
        }
        return imgViews;
    }

    _onPressAddButton = ()=>{
        var ImagePicker = require('react-native-image-picker');
        var options = {
            title: '',
            quality: 1,
            mediaType: 'photo',
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: '拍摄',
            chooseFromLibraryButtonTitle:'从相册选择',
            maxWidth: 1024,
            maxHeight: 1024,
            noData: false,
        };
        ImagePicker.showImagePicker(options, (response) => {
            console.log(response.type);
            if (response.uri){
                this.state.photos.push({path:response.path, data:'data:image/jpeg;base64,' + response.data});
                this.state.itemData.path = 'data:image/jpeg;base64,' + response.data;
                this.setState({
                    picCount:this.state.photos.length
                });
            }
        });
    }

    _onPressDel = (i) => {
        this.state.itemData.path = "";
        this.state.photos = this.state.photos.slice(0, i).concat(this.state.photos.slice(i+1, this.state.photos.length));
        var picCount = this.state.picCount - 1;
        if (picCount < 0) picCount = 0;
        this.setState({
            picCount
        });
    }

    _onClickSave = (tf)=>{
        if (this.state.picCount <= 0) {
            Toast.info("请添加图片");
            return;
        }
        if (this.props.fromFenqu) {
            this.navigator.pop();
            return;
        }
        PopAlert.showLoadingView();
        let pa = {
            token: this.props.token,
            pro: DataCenter.editingAdPro,
            data: DataCenter.editingAdData,
            extend:{addtype:AdType_Image}
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
        alignItems:"center",
    },

    editPcCellDetailStyle: {
        color:'#888',
        fontSize:15,
        textAlign:'right',
        backgroundColor:'#0000',
        marginRight:10,
    },
    imageCell: {
        width: 58,
        height: 58,
        alignItems:"center",

    }
});

module.exports = EditPicPage;