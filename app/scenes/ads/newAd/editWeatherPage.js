import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, FlatList, Switch, StatusBar
} from "react-native";
import Slider from 'react-native-slider';
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
    Toast,
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import { Col, Row, Grid } from "react-native-easy-grid";
import {COLOR_NAV_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import JsPicker from '../../../widgets/PureJSPicker';
import AreaData from '../../../widgets/area.json';
import DataCenter from '../../../models/DataCenter';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import WCheckBox from "../../../widgets/WCheckBox";
import {AdType_Weather, hasWeather, WeatherFormats} from "../../../constants/Defines";
import BaseEditPage from "./BaseEditPage";


var array_ = require('lodash/array');
var dic_ = require('lodash/object');
var collection_ = require("lodash/collection");

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

function createAreaData(area, initCity){
    let data = {};
    let initC = initCity && initCity.length > 1 ? ['中国', '北京', initCity] : ['中国', '北京', '北京'];
    let found = false;
    let len = area.length;
    for(let i=0;i<len;i++){
        let country = area[i]['name'];
        let city = area[i]['city'];
        let cityLen = city.length;
        let ProvinceName = area[i]['name'];
        data[ProvinceName] = [];
        for(let j=0;j<cityLen;j++){
            let cityName = city[j]['name'];
            if (!found && initCity && (cityName.indexOf(initCity) != -1 || initCity.indexOf(cityName) != -1)) {
                initC[1] = ProvinceName;
                initC[2] = cityName;
                found = true;
            }
            data[ProvinceName].push(cityName);
        }
    }
    return [{"中国":data}, initC];
};

var initCC = null;


/**
 * -----天气
 * */
class EditWeatherPage extends BaseEditPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "天气",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        var info = DataCenter.editingAdData[0].info_pos;
        var itemData = DataCenter.editingAdData[0].list_item[0];
        initCC = createAreaData(AreaData, DataCenter.editingAdData[0].list_item[0].city);
        this.state = {
            //city
            selectedCity: initCC[1],

            // data
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
            <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
            <ScrollView style={{flex: 1}}>
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
                <Input
                    style={{backgroundColor:'white', borderColor:'#12b7f5', borderWidth:2, borderRadius:6, height:100,
                        marginLeft:10, marginRight:10, marginTop:4, marginBottom:4,
                        textAlignVertical:'top'}}
                    defaultValue={this.state.itemData.value+""}
                    onChangeText={(t)=>(this.state.itemData.value=t)}
                    multiline={true}
                />


                <ListRow style={[styles.cellContainer]}
                         icon={<Image style={styles.editPcCellImg} source={require('../../../assets/newads/new/ic_e_cs.png')}/>}
                         detail={this.state.itemData.city} detailStyle={styles.editPcCellDetailStyle}
                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                         bottomSeparator="full"
                         topSeparator="full"
                         onPress={()=>this._popEditCity()}
                />

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
        if ((this.state.itemData.value+"").length == 0) {
            Toast.info("请输入天气内容");
            return;
        }
        console.log(this.state.itemData);
        if (this.props.fromFenqu){
            this.navigator.pop();
            return;
        }
        PopAlert.showLoadingView();
        let pa = {
            token:this.props.token,
            pro:DataCenter.editingAdPro,
            data:DataCenter.editingAdData,
            extend:{addtype:AdType_Weather}
        };
        if (!this.props.isNew) {
            pa.program_id = this.state.program_id;
        }
        this._onSaveAdData(pa, tf);
    }

    _popEditCity(){
        if (this.overlayPullView) {
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.overlayPullView = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', minHeight:560}}>
                    <ImageButton image={require('../../../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.overlayPullView.close();
                                     this.overlayPullView = null;
                                 }}/>
                    <View style={{height:280, backgroundColor:'#fff', marginTop:8}}>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, paddingRight:10, height:40, backgroundColor:'#f5f5f5', justifyContent:'space-between'}}>
                            <Button title="取消" style={{borderColor:'#0000'}} titleStyle={{color:'#666'}} onPress={()=>{
                                this.overlayPullView && this.overlayPullView.close();
                                this.overlayPullView = null;
                            }}/>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{height:40}} resizeMode="contain" source={require('../../../assets/newads/ic_loc_red.png')}/>
                                <Text style={{color:'#444', fontSize:16}}>选择城市</Text>
                            </View>

                            <Button title="完成" style={{borderColor:'#0000'}} titleStyle={{color:'#666'}} onPress={()=>{
                                console.log(""+this.picker.pickedValue); //中国,辽宁,本溪
                                this.state.selectedCity = ((this.picker.pickedValue+"").split(','));
                                this.state.itemData.city = this.state.selectedCity[2];
                                this.overlayPullView.close();
                                this.overlayPullView = null;
                                this.forceUpdate();
                            }}/>
                        </View>
                        <JsPicker
                            ref={picker => this.picker = picker}
                            style={{height: 240, width:ScreenWidth}}
                            showMask={false}
                            showDuration={1}
                            pickerData={initCC[0]}
                            selectedValue={this.state.selectedCity}
                        />
                    </View>
                    <View style={{flexDirection:'row', height:36, backgroundColor:'#f5f5f5', width:ScreenWidth}}>
                        <Text style={{color:'white', fontSize:15, height:36, width:100, backgroundColor:'#d94863', textAlignVertical:'center', textAlign:'center'}}>显示内容</Text>
                    </View>
                    <Grid style={{backgroundColor:'#f5f5f5', height:180, width:ScreenWidth, padding:12}}>
                        <Col style={{width:ScreenWidth/3}}>
                            <Row><WCheckBox title="城市" checked={hasWeather(WeatherFormats.Types.City, this.state.itemData.value)} onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.City, ch)}/></Row>
                            <Row><WCheckBox title="日期" checked={hasWeather(WeatherFormats.Types.Date, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Date, ch)}/></Row>
                            <Row><WCheckBox title="今天天气" checked={hasWeather(WeatherFormats.Types.Weather, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Weather, ch)}/></Row>
                            <Row><WCheckBox title="明天天气" checked={hasWeather(WeatherFormats.Types.Weather1, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Weather1, ch)}/></Row>
                        </Col>
                        <Col style={{width:ScreenWidth/3}}>
                            <Row><WCheckBox title="PM2.5指数" checked={hasWeather(WeatherFormats.Types.PM, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.PM, ch)}/></Row>
                            <Row><WCheckBox title="穿衣指数" checked={hasWeather(WeatherFormats.Types.Clothes, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Clothes, ch)}/></Row>
                            <Row><WCheckBox title="洗车指数" checked={hasWeather(WeatherFormats.Types.CarWash, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.CarWash, ch)}/></Row>
                            <Row><WCheckBox title="后天天气" checked={hasWeather(WeatherFormats.Types.Weather2, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Weather2, ch)}/></Row>
                        </Col>
                        <Col style={{width:ScreenWidth/3}}>
                            <Row><WCheckBox title="旅游指数" checked={hasWeather(WeatherFormats.Types.Travel, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Travel, ch)}/></Row>
                            <Row><WCheckBox title="感冒指数" checked={hasWeather(WeatherFormats.Types.ColdDes, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.ColdDes, ch)}/></Row>
                            <Row><WCheckBox title="紫外线指数" checked={hasWeather(WeatherFormats.Types.Rays, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Rays, ch)}/></Row>
                            <Row><WCheckBox title="3天后天气" checked={hasWeather(WeatherFormats.Types.Weather3, this.state.itemData.value)}  onPress={(tag, ch)=>this._onChecked(WeatherFormats.Types.Weather3, ch)}/></Row>
                        </Col>
                    </Grid>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }



    _onChecked = (tag, checked) => {
        let w = WeatherFormats[tag];
        let a = ""+this.state.itemData.value;
        if (checked) {
            if (!collection_.includes(a, w)) {
                a = a.concat(w);
            }
        }else{
            if (collection_.includes(a, w)) {
                a = a.replace(w, "");
            }
        }
        this.state.itemData.value = a;
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

module.exports = EditWeatherPage;