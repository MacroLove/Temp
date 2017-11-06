import React from 'react';
import {
    View, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, ListView, Switch, StatusBar, Text as TextRN, Animated
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
    SegmentedView,
    Menu,
    Toast
} from 'teaset';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {COLOR_NAV_BG, COLOR_VIEW_BG} from "../../../constants/Colors";
import ImageButton from '../../../widgets/ImageButton';
import DataCenter from '../../../models/DataCenter';
import * as Modals from '../../../models/Models';
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";
import Svg,{
    Circle,
    Ellipse,
    G,
    LinearGradient,
    RadialGradient,
    Line,
    Path,
    Polygon,
    Polyline,
    Rect,
    Text,
    Symbol,
    Use,
    Defs,
    Stop
} from 'react-native-svg';
import {Col, Grid, Row} from "react-native-easy-grid";
import IconBadge from 'react-native-icon-badge';
import EditPic from './editPicPage';
import EditText from './editTextPage';
import EditTime from './editTimePage';
import EditWeather from './editWeatherPage';
import {
    AdType_Area, FenquType_Image, FenquType_Text, FenquType_Time,
    FenquType_Weather
} from "../../../constants/Defines";
import BaseEditPage from "./BaseEditPage";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let PADDING = 20;
let CanvasWidth = ScreenWidth - PADDING*2;
let CanvasHeight = 0;
let ContainerWidth = ScreenWidth;
let ContainerHeight = 0;
let WScale = 0, HScale = 0;
let array_ = require('lodash/array');

class FenquItem extends React.PureComponent {
    _onPressButton = (which, view) => {
        if (which == 'bj') {
            this.props.onPressButton && this.props.onPressButton(which, this.props.item, view);
        }else {
            this.props.onPressButton && this.props.onPressButton(which, this.props.item, view);
        }
    };

    render() {
            let at = this.props.fqType;
            let ic = null;
            if (this.props.item.isInit) {
                ic = require('../../../assets/ads/ad_listitem_fenqu.png');
            }else{
                if (at == FenquType_Time) {
                    ic = require('../../../assets/ads/ad_listitem_time.png');
                }else if (at == FenquType_Text) {
                    ic = require('../../../assets/ads/ad_listitem_wenzi.png');
                }else if (at == FenquType_Image) {
                    ic = require('../../../assets/ads/ad_listitem_tupian.png');
                }else if (at == FenquType_Weather) {
                    ic = require('../../../assets/ads/ad_listitem_tianqi.png');
                }else {
                    ic = require('../../../assets/ads/ad_listitem_fenqu.png');
                }
            }

        return (
            <View style={styles.cellItem}>
                <View style={styles.cellMiddle}>
                    <IconBadge
                        MainElement={
                            <Image style={{margin: 8, marginLeft:0, resizeMode: 'contain'}}
                                   source={ic}/>
                        }
                        BadgeElement={
                            <TextRN style={{color: '#fff', fontSize: 10}}>{''}</TextRN>
                        }

                        IconBadgeStyle={
                            {
                                minWidth       : 16,
                                width          : 16,
                                height         : 16,
                                borderRadius   : 8,
                                backgroundColor: '#0000'
                            }
                        }
                        hidden
                    />
                    <View style={{flex: 1, marginLeft: 4}}>
                        <TextRN style={{color: 'black', fontSize: 15, fontWeight: '200'}} numberOfLines={1}>
                            {('分区:'+this.props.fqName)}
                        </TextRN>
                        <TextRN style={{color: 'gray', fontSize: 14}} numberOfLines={1}>
                            {'内容:'+this.props.fqDesc}
                        </TextRN>
                    </View>
                    <View style={{
                        flexDirection  : 'row',
                        height         : 20,
                        alignItems     : 'center',
                        justifyContent : 'flex-end',
                        backgroundColor: '#0000'
                    }}>
                        <TextRN style={{color: '#aaa', fontSize: 12, marginLeft: 4}}>
                            {'分区大小:' + this.props.fqSize}
                        </TextRN>
                    </View>
                </View>
                <View style={styles.cellBottom}>
                    <TouchableOpacity ref={(v)=>this._bjV = v} style={{
                        flexDirection: 'row',
                        alignItems   : 'center'
                    }} onPress={() => this._onPressButton('bj', this._bjV)}>
                        <Image source={require('../../../assets/ic_bianji.png')}/>
                        <TextRN style={{fontSize: 15, color: '#13b7f6', marginLeft: 5}}>编辑</TextRN>
                    </TouchableOpacity>
                    <TouchableOpacity style={{
                        flexDirection: 'row',
                        alignItems   : 'center',
                        marginLeft   : 10
                    }} onPress={() => this._onPressButton('sc')}>
                        <Image source={require('../../../assets/ic_shanchu.png')}/>
                        <TextRN style={{fontSize: 15, color: '#ff7e00', marginLeft: 12}}>删除</TextRN>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}


class EditFenquPage extends BaseEditPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "分区节目",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        if (!DataCenter.editingAdData) DataCenter.editingAdData = [];
        var itemDatas = DataCenter.editingAdData;
        this._calCanvasWH();
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        this.state = {
            dataSource: ds.cloneWithRows(itemDatas),
            itemDatas:itemDatas,
            program_id: DataCenter.editingAdPro.program_id,
            strPro: DataCenter.editingAdPro.width+"x"+DataCenter.editingAdPro.height+"  "
            + DataCenter.configs.PROGRAM_TYPE_COLOR[DataCenter.editingAdPro.type_color] + "  "
            + DataCenter.configs.GRAY_LEVEL[DataCenter.editingAdPro.gray],

            editingFenquData: itemDatas[0], //当前正编辑的Rect data
            editingFenquW:0,
            editingFenquH:0,
            editingFenquX:0,
            editingFenquY:0,
            isEditing:false,

            animValLongPress: new Animated.Value(0), //Long press
            longpressType: null,
            isLongPressed: false, // Wether now is LP active.

        };
        if (this.state.editingFenquData)
            this._mapDataPosToState(this.state.editingFenquData);
    }

    _calCanvasWH = () => {
        CanvasHeight = CanvasWidth * DataCenter.editingAdPro.height / DataCenter.editingAdPro.width; // 根据尺寸，计算内部高度。
        ContainerHeight = CanvasHeight + PADDING*2;
        WScale = DataCenter.editingAdPro.width/CanvasWidth;
        HScale = DataCenter.editingAdPro.height/CanvasHeight;
        if (WScale == 0) WScale = 1;
        if (HScale == 0) HScale = 1;
    };

    componentDidMount() {

    }

    componentWillUnmount() {
        this.lpTimer && clearTimeout(this.lpTimer);
        this.lpTimer = null;
    }

    renderNavigationRightView() {
        return <NavigationBar.LinkButton
            title={'取消'}
            onPress={() => {
                if (this.state.isEditing) {
                    this.setState({isEditing:false});
                    return;
                }
                this.navigator.pop();
            }}
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

    makeInput(val, hint, type) {
        return (
            <Input
                ref={'txt'+type}
                style={{borderColor:'#0000', color:'#333', fontSize:14, flex:1}}
                defalutValue={val}
                value={val}
                placeholder={hint}
                onChangeText={(t)=>{
                    if (type == 'width') {
                        this.setState({editingFenquW:t});
                    }else if(type == 'height') {
                        this.setState({editingFenquH:t});
                    }else if(type == 'x') {
                        this.setState({editingFenquX:t});
                    }else if(type == 'y') {
                        this.setState({editingFenquY:t});
                    }
                    this.forceUpdate();
                }}
            />
        );
    }

    renderPage() {
        return (
            <View style={{flex:1, backgroundColor:'#f2f2f2'}}>
                <ScrollView style={{flex: 1}}>
                    <View style={{width:ContainerWidth, height:ContainerHeight, padding:PADDING}}>
                        <Image style={{position:'absolute', width:ContainerWidth, height:ContainerHeight, left:0, top:0}} source={require('../../../assets/newads/new/bg_transp.png')} resizeMode="stretch"/>
                        <View style={{width:CanvasWidth, height:CanvasHeight}}>
                            <Image style={{position:'absolute', width:CanvasWidth, height:CanvasHeight, left:0, top:0}} source={require('../../../assets/newads/new/bg_led_black.png')} resizeMode="stretch"/>
                            <Svg
                                ref="svg"
                                width={CanvasWidth+""}
                                height={CanvasHeight+""}
                            >
                                {
                                    this._renderRectItems()
                                }
                            </Svg>
                        </View>
                    </View>

                    {
                        this.state.isEditing ?
                            <View style={{flex:1}}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:80, width:ScreenWidth}}>
                                    <ImageButton image={require('../../../assets/newads/new/ic_move_up.png')}
                                                 onPress={()=>{this._onClickMove('u')}}
                                                 onPressIn={(e)=>{this._onLongPressIn(e, 'u')}}
                                                 onPressOut={()=>{this._onLongPressOut('u')}}
                                    />
                                    <ImageButton image={require('../../../assets/newads/new/ic_move_down.png')}
                                                 onPress={()=>{this._onClickMove('d')}}
                                                 onLongPress={(e)=>{this._onLongPressIn(e, 'd')}}
                                                 onPressOut={()=>{this._onLongPressOut('d')}}
                                    />
                                    <ImageButton image={require('../../../assets/newads/new/ic_move_left.png')}
                                                 onPress={()=>{this._onClickMove('l')}}
                                                 onLongPress={(e)=>{this._onLongPressIn(e, 'l')}}
                                                 onPressOut={()=>{this._onLongPressOut('l')}}
                                    />
                                    <ImageButton image={require('../../../assets/newads/new/ic_move_right.png')}
                                                 onPress={()=>{this._onClickMove('r')}}
                                                 onLongPress={(e)=>{this._onLongPressIn(e, 'r')}}
                                                 onPressOut={()=>{this._onLongPressOut('r')}}
                                    />
                                </View>
                                <SegmentedView style={{width:ScreenWidth, height:150, borderColor:'#aaa', borderTopWidth:0.7, backgroundColor:'#fff'}} type='projector'
                                               onChange={(i)=>{

                                               }}>
                                    <SegmentedView.Sheet title='分区大小'>
                                        <View style={{flex: 1, justifyContent:'center', backgroundColor:COLOR_VIEW_BG}}>
                                            <ListRow style={{ borderLeftWidth:4, borderLeftColor:'#1d8af1'}}
                                                     topSeparator="full" bottomSeparator="full"
                                                     title="分区宽度：" titleStyle={styles.editPcCellTitleStyle}
                                                     detail={this.makeInput(this.state.editingFenquW+"", "输入数字", 'width')}
                                            />
                                            <ListRow style={{ borderLeftWidth:4, borderLeftColor:'#ddbb00', marginTop:10}}
                                                     topSeparator="full" bottomSeparator="full"
                                                     title="分区高度：" titleStyle={styles.editPcCellTitleStyle}
                                                     detail={this.makeInput(this.state.editingFenquH+"", "输入数字", 'height')}
                                            />
                                        </View>
                                    </SegmentedView.Sheet>
                                    <SegmentedView.Sheet title='分区设置'>
                                        <View style={{flex: 1, justifyContent:'center', backgroundColor:COLOR_VIEW_BG}}>
                                            <ListRow style={{ height:44 }}
                                                     topSeparator="full" bottomSeparator="full"
                                                     title={<Image style={{height:40}} source={require('../../../assets/newads/new/ic_fenqu_x.png')} resizeMode="cover"/>}
                                                    detail={this.makeInput(this.state.editingFenquX+"", "输入数字", 'x')}
                                            />
                                            <ListRow style={{ height:44, marginTop:10 }}
                                                     topSeparator="full" bottomSeparator="full"
                                                     title={<Image style={{height:40}}  source={require('../../../assets/newads/new/ic_fenqu_y.png')} resizeMode="cover"/>}
                                                    detail={this.makeInput(this.state.editingFenquY+"", "输入数字", 'y')}
                                            />
                                        </View>
                                    </SegmentedView.Sheet>
                                </SegmentedView>
                                <Button
                                    title="确定"
                                    titleStyle={{color: '#fff', fontSize: 16}}
                                    style={{
                                        flex: 1,
                                        borderRadius: 0,
                                        backgroundColor: COLOR_NAV_BG,
                                        borderColor: COLOR_NAV_BG,
                                        margin:20,
                                        height:40,
                                    }}
                                    onPress={() => {
                                        this._onClickSetFenquOK();
                                    }}
                                />
                            </View>
                            :
                            <View style={{flex: 1}}>
                                <ListRow style={[styles.cellContainer]}
                                         title="广告参数：" titleStyle={{color: 'black', fontSize: 16, fontWeight: 'bold'}}
                                         detail={this.state.strPro}
                                         detailStyle={styles.editPcCellDetailStyle} bottomSeparator="full"
                                         topSeparator="full"
                                         accessory={<IonIcon name="ios-arrow-forward" size={22} color='#ddd'/>}
                                         onPress={()=>{
                                             this._onPressConfig();
                                         }}
                                />

                                <View style={{
                                    width: ScreenWidth,
                                    height: 44,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    marginTop: 8,
                                    backgroundColor: '#fff',
                                    borderBottomWidth: 1,
                                    borderColor: '#aaa'
                                }}>
                                    <Label text="分区列表" style={{
                                        color: 'black',
                                        fontSize: 16,
                                        fontWeight: 'bold',
                                        width: ScreenWidth / 2,
                                        paddingLeft: 12
                                    }}/>
                                    <ImageButton ref={v=>this.btnAdd=v} image={require('../../../assets/newads/new/ic_fenqu_add.png')} onPress={()=>this._onClickAddFenqu()}/>
                                    <View style={{
                                        width: 1,
                                        height: 22,
                                        backgroundColor: '#aaa',
                                        marginLeft: 5,
                                        marginRight: 5
                                    }}/>
                                    <ImageButton image={require('../../../assets/newads/new/ic_fenqu_set.png')} onPress={()=>this._onClickSetFenqu()}/>
                                </View>

                                <ListView
                                    style={{flex: 1, backgroundColor: '#fff'}}
                                    dataSource={this.state.dataSource}
                                    renderRow={this._renderFenquItem}
                                />

                            </View>
                    }
                </ScrollView>
                {
                    this.state.isEditing ? null :
                        this._makeViewSaveAndSend()
                }
            </View>
        );
    }

    _renderFenquItem = (data, sectionID: number, rowID: number) => {
        let name = (parseInt(rowID) + 1) + '';
        return (
            <FenquItem
                vkey={"fqItem"+rowID}
                item={data}
                fqSize={data.info_pos.w+"x"+data.info_pos.h}
                fqDesc=""
                fqName={name}
                fqType={data.list_item[0].type}
                onPressButton={(which, d, v)=>this._onClickItemButtons(which, d, v)}
            />
        );
    }
    _mapPositionToView = (infoPos) => {
        let s = {x:infoPos.x / WScale, y:infoPos.y/HScale, w:infoPos.w/WScale, h:infoPos.h/HScale};
        return s;
    }
    _renderRectItems = ()=>{
        var items = [];
        var thiz = this;
        if (this.state.itemDatas && this.state.itemDatas.length > 0) {
            var i = 1;
            this.state.itemDatas.map(function (d) {
                let isSelect = d == thiz.state.editingFenquData;
                let pos = thiz._mapPositionToView(d.info_pos);
                if (isSelect) {
                    pos = thiz._mapPositionToView({h:thiz.state.editingFenquH, w:thiz.state.editingFenquW, x:thiz.state.editingFenquX, y:thiz.state.editingFenquY});
                }
                let szIn = 16;
                let posIn = {x:pos.w-szIn, y:pos.h-szIn, w:szIn, h:szIn};
                let posT = {x:posIn.x + szIn/2, y:posIn.y+2};
               items.push(
                   <G
                       key={i}
                       x={""+pos.x}
                       y={""+pos.y}
                       width={""+pos.w}
                       height={""+pos.h}
                       onPress={()=>{thiz._onClickRect(d)}}>
                       <Rect
                           x={"0"}
                           y={"0"}
                           width={""+pos.w}
                           height={""+pos.h}
                           stroke="red"
                           strokeWidth="1"
                           fill="none"
                           strokeDasharray={isSelect ? [] : [3,3,3]}
                       />
                       <Rect
                           x={""+posIn.x}
                           y={""+posIn.y}
                           width={""+posIn.w}
                           height={""+posIn.h}
                           stroke="red"
                           strokeWidth="1"
                           fill={isSelect ? "red" : "none"}
                           strokeDasharray={isSelect ? [] : [3,3,3]}
                       />
                       <Text
                           fill={isSelect ? "white" : "red"}
                           fontSize="10"
                           fontWeight="bold"
                           x={""+posT.x}
                           y={""+posT.y}
                           textAnchor="middle"
                       >{i+''}</Text>
                   </G>
               );
               i+=1;
            });
        }
        return items;
    }
    _mapPosStateToData = () => {
        this.state.editingFenquData.info_pos.w = this.state.editingFenquW;
        this.state.editingFenquData.info_pos.h = this.state.editingFenquH;
        this.state.editingFenquData.info_pos.x = this.state.editingFenquX;
        this.state.editingFenquData.info_pos.y = this.state.editingFenquY;
    }
    _mapDataPosToState = (data) => {
        this.state.editingFenquW = data.info_pos.w;
        this.state.editingFenquH = data.info_pos.h;
        this.state.editingFenquX = data.info_pos.x;
        this.state.editingFenquY = data.info_pos.y;
    }
    _onClickItemButtons = (which, data, view) => {
        if (which == 'bj') {
            var thiz = this;
            view.measureInWindow((x, y, width, height) => {
                let p = {x, y, width:width, height};
                thiz._showNewFenquPop(p, data);
            });
        }else if (which == 'sc') {
            if (this.state.itemDatas.length <= 1) {
                Toast.info("至少保留1个分区");
                return;
            }else{
                let thiz = this;
                PopAlert.showAlertView2("提示", "确定删除该分区吗？", ()=>{}, ()=>{
                    PopAlert.dismissAlertView();
                    array_.remove(thiz.state.itemDatas, function (p) {
                        return p == data;
                    });
                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    var dataSource = ds.cloneWithRows(thiz.state.itemDatas);
                    thiz.setState({dataSource});
                });
            }
        }
    }
    _onClickRect = (data) => {
        this.state.editingFenquData = data;
        this._mapDataPosToState(data);
        this.forceUpdate();
    }
    _onClickMove = (dir) => {
        if (dir == 'u') {
            this.state.editingFenquY -= 1;
        }else if (dir == 'd') {
            this.state.editingFenquY += 1;
        }else if (dir == 'l') {
            this.state.editingFenquX -= 1;
        }else if (dir == 'r') {
            this.state.editingFenquX += 1;
        }
        this._mapPosStateToData();
        this.forceUpdate();
    }
    _onClickAddFenqu = ()=>{
        if (DataCenter.editingAdPro.type_bg == 0) {
            // "无背景"时,最大可新建8个分区
            if (this.state.itemDatas.length >= 8) {
                PopAlert.showAlertView("提示", '[无背景]时,最大可新建8个分区！');
                return;
            }
        }else{
            // 有"背景"时,不管背景是"图片"还是"动画",最大可新建7个分区
            if (this.state.itemDatas.length >= 7) {
                PopAlert.showAlertView("提示", '[有背景]时,最大可新建7个分区！');
                return;
            }
        }
        let item = {
            isInit: true, // For App, means not real data, just placeholder.
            info_pos: Modals.make(Modals.AdInfoPos),
            list_item:[
                Modals.make(Modals.AdListItemZimu),
            ],
        };
        item.info_pos.w = 4;
        item.info_pos.h = 4;
        this.state.itemDatas.push(item);
        var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
        var dataSource = ds.cloneWithRows(this.state.itemDatas);
        this.setState({dataSource})
    };

    _showNewFenquPop = (pos, data) => {
        if (this.overlayViewFenqu) {
            return;
        }
        var h = ScreenWidth * 186.0 / 720.0;
        var padBottom = h * 48 / ScreenHeight;
        var padTop = h * 10 / ScreenHeight;
        var maxOffsetY = (ScreenHeight - h - 10);
        var bgImg = require('../../../assets/newads/pop_fenqu_bg2.png');
        if (pos.y > maxOffsetY) {
            pos.y = maxOffsetY;
        }

        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', paddingTop: pos.y}}
                type={'zoomOut'}
                modal={false}
                ref={v => this.overlayViewFenqu = v}>
                <View style={{backgroundColor: '#0000', width: ScreenWidth, height: h}}>
                    <Image source={bgImg} resizeMode="stretch" style={{
                        position: 'absolute',
                        left    : 1,
                        top     : 1,
                        width   : ScreenWidth,
                        height  : h,
                    }}/>
                    <Grid style={{marginTop: padTop, paddingBottom: padBottom, paddingLeft: 6, paddingRight: 6}}>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../../assets/newads/ic_new_wenzi.png')}
                                             onPress={() => {
                                                 this._onSelectMenuItem('text_pic', data)
                                             }}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../../assets/newads/ic_new_time.png')} onPress={() => {
                                    this._onSelectMenuItem('time', data)
                                }}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../../assets/newads/ic_new_pic.png')} onPress={() => {
                                    this._onSelectMenuItem('image', data)
                                }}/>
                            </Row>
                        </Col>
                        <Col style={styles.colOfNewPop}>
                            <Row style={styles.rowOfNewPop}>
                                <ImageButton image={require('../../../assets/newads/ic_new_weather.png')} onPress={() => {
                                    this._onSelectMenuItem('text_part', data)
                                }}/>
                            </Row>
                        </Col>
                    </Grid>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }

    _onSelectMenuItem = (type, data) => {
        this.overlayViewFenqu && this.overlayViewFenqu.close();

        let item = data;

        if (data.isInit) {
            item = this._makeNewFenquTypeData(type);

            // replace old placeholder item
            data.isInit = false; data.info_pos = item.info_pos; data.list_item = item.list_item;
            item = data;
            var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
            var dataSource = ds.cloneWithRows(this.state.itemDatas);
            this.setState({dataSource});
        }else{
            // Already has editted data.
            if (data.list_item[0].type != type) { // reset type data
                let thiz = this;
                PopAlert.showAlertView2("提示", "更改类型将重置之前类型数据，是否继续？", ()=>{}, ()=>{
                    PopAlert.dismissAlertView();
                    let itm = thiz._makeNewFenquTypeData(type);

                    // replace old placeholder item
                    data.isInit = false; data.info_pos = itm.info_pos; data.list_item = itm.list_item;
                    itm = data;
                    var ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
                    var dataSource = ds.cloneWithRows(thiz.state.itemDatas);
                    thiz.setState({dataSource});

                    DataCenter.editingAdData = [itm];
                    switch (itm.list_item[0].type) {
                        case 'text':
                        case 'text_pic':
                            thiz.navigator.push({view: <EditText type={itm.type} groupData={null} token={this.props.token} fromFenqu/>});
                            break;
                        case 'text_part':
                            thiz.navigator.push({view: <EditWeather type={itm.type} groupData={null} token={this.props.token} fromFenqu/>});
                            break;
                        case 'time':
                            thiz.navigator.push({view: <EditTime type={itm.type} groupData={null} token={this.props.token} fromFenqu/>});
                            break;
                        case 'image':
                            thiz.navigator.push({view: <EditPic type={itm.type} groupData={null} token={this.props.token} fromFenqu/>});
                            break;
                    }
                });
                return;
            }
        }
        DataCenter.editingAdData = [item];
        switch (item.list_item[0].type) {
            case 'text':
            case 'text_pic':
                this.navigator.push({view: <EditText type={item.type} groupData={null} token={this.props.token} fromFenqu/>});
                break;
            case 'text_part':
                this.navigator.push({view: <EditWeather type={item.type} groupData={null} token={this.props.token} fromFenqu/>});
                break;
            case 'time':
                this.navigator.push({view: <EditTime type={item.type} groupData={null} token={this.props.token} fromFenqu/>});
                break;
            case 'image':
                this.navigator.push({view: <EditPic type={item.type} groupData={null} token={this.props.token} fromFenqu/>});
                break;
        }
    };

    _makeNewFenquTypeData = (type)=>{
        let item = null;
        if (type == FenquType_Text) {
            item = {
                info_pos: Modals.make(Modals.AdInfoPos),
                list_item:[
                    Modals.make(Modals.AdListItemZimu),
                ]
            };
        }else if (type == FenquType_Image) {
            item = {
                info_pos: Modals.make(Modals.AdInfoPos),
                list_item:[
                    Modals.make(Modals.AdListItemPic),
                ]
            };
        }else if (type == FenquType_Time) {
            item = {
                info_pos: Modals.make(Modals.AdInfoPos),
                list_item:[
                    Modals.make(Modals.AdListItemTime),
                ]
            };
        }else if (type == FenquType_Weather) {
            item = {
                info_pos: Modals.make(Modals.AdInfoPos),
                list_item:[
                    Modals.make(Modals.AdListItemWeather),
                ]
            };
        }
        item.info_pos.w = 4;
        item.info_pos.h = 4;
        return item;
    };

    _onClickSetFenqu = ()=>{
        this.setState({isEditing:true});
    };

    _onClickSetFenquOK = ()=>{
        this._mapPosStateToData();
        this.setState({isEditing:false});
    };

    _onLongPressIn = (e, type) => {
        this.state.longpressType = type;
        this.state.animValLongPress.setValue(0);
        this.state.isLongPressed = true;
        this.state.animValLongPress.removeAllListeners();
        this.state.animValLongPress.addListener(this._onLongPressAnimValue);
        this.lpTimer && clearTimeout(this.lpTimer);

        this.lpTimer = setTimeout(()=>{
            Animated.loop(
                Animated.timing(this.state.animValLongPress, {
                    toValue: 10,
                    duration: 0.1,
                    delay: 100
                })
            ).start()
        }, 300);
    }

    _onLongPressOut = (type) => {
        this.lpTimer && clearTimeout(this.lpTimer);
        let that = this;
        this.state.animValLongPress.removeAllListeners();
        this.state.animValLongPress.stopAnimation(()=>{
            that.state.longpressType = null;
            that.state.animValLongPress.setValue(0);
            that.state.isLongPressed = false;
        });
    }

    _onLongPressAnimValue = (v) => {
        if (v.value >= 1) {
            this._onClickMove(this.state.longpressType);
        }
    }

    _onClickSave = (isToufang)=>{
        if (DataCenter.editingAdData.length <= 0) {
            PopAlert.showAlertView("提示", "请编辑播放内容!");
            return;
        }else {
            for (let i=0; i<DataCenter.editingAdData.length; ++i) {
                if (DataCenter.editingAdData[i].isInit) {
                    PopAlert.showAlertView("提示", "请编辑播放内容!");
                    return;
                }
            }
        }
        PopAlert.showLoadingView();
        let pa = {
            token: this.props.token,
            pro: DataCenter.editingAdPro,
            data: this.state.itemDatas,
            extend:{addtype:AdType_Area}
        };
            if (!this.props.isNew) {
            pa.program_id = this.state.program_id;
        }
        this._onSaveAdData(pa, isToufang);
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
    editPcCellTitleStyle: {
        color:'#aaa',
        fontSize:15,
        marginLeft:4,
    },

    editPcCellDetailStyle: {
        color:'#888',
        fontSize:15,
        textAlign:'right',
        backgroundColor:'#0000',
        marginRight:10,
    },

    cellItem  : {
        backgroundColor: '#fff', height: 80, paddingLeft: 10, paddingRight: 10,
        borderColor: '#ddd', borderBottomWidth: 0.7,
    },
    cellMiddle: {
        flexDirection: 'row', paddingTop: 6,
        flex         : 1, justifyContent: 'space-between'
    },
    cellBottom: {
        flexDirection: 'row', paddingLeft: 10, paddingRight: 10,
        height       : 40,
        alignItems   : 'center', justifyContent: 'flex-end',
        position     : 'absolute',
        right        : 1,
        bottom       : 1,

    },
    rowOfNewPop          : {
        alignItems    : 'center',
        justifyContent: 'center',
        padding       : 10,
        width         : ScreenWidth / 4,
    },
    colOfNewPop          : {
        alignItems: 'center',
    }
});

module.exports = EditFenquPage;