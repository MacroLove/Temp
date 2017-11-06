import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView
} from "react-native";
import PropTypes from 'prop-types';
import {
    ModalIndicator,
    Overlay,
    SegmentedView,
    Button,
    Input,
    Toast
} from 'teaset';
import Icon from "react-native-vector-icons/EvilIcons"
import Slider from 'react-native-slider';
import ImageButton from './ImageButton';
import DataCenter from "../models/DataCenter";
import GridBgView from '../widgets/views/GridBackgroundView';
import Radio2Buttons from '../widgets/views/Radio2Buttons';
import TextButton from '../widgets/TextButton';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

function PopAlertViewS() {
    // the cached instance
    var instance = this;

    // rewrite the contructor
    PopAlertViewS = function () {
        return instance;
    };

    instance.prototype = this;

    // Child minH = 135.
    instance.showAlertView = function (title, childs, callbackClose = null, autoKeyboard = false) {
        if (this.overlayPopView)
            return;
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                autoKeyboardInsets = {autoKeyboard}
                ref={v => this.overlayPopView = v}
            >
                <View style={{backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 5}}>
                    <View style={{
                        height           : 44,
                        flexDirection    : 'row',
                        alignItems       : 'center',
                        justifyContent   : 'flex-start',
                        borderColor      : '#eee',
                        borderBottomWidth: 1
                    }}>
                        <Icon.Button name="close" size={25} color="#ddd" backgroundColor="#0000" underlayColor="#0000"
                                     onPress={() => {
                                         this.overlayPopView.close();
                                         this.overlayPopView = null;
                                         callbackClose && callbackClose();
                                     }}/>
                        <Text style={{
                            color      : '#666',
                            fontSize   : 15,
                            flex       : 1,
                            textAlign  : 'center',
                            marginRight: 50
                        }}>{title}</Text>
                    </View>
                    {
                        React.isValidElement(childs) ? childs : <Text style={{
                            flex    : 1, textAlign: 'center', textAlignVertical: 'center',
                            fontSize: 14, color: '#333', padding: 10
                        }} numberOfLines={6}>{childs ? childs + '' : ''}</Text>
                    }
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    };

    instance.showAlertView2 = function (title, childs, callbackClose = null, callbackOK = null) {
        if (this.overlayPopView2)
            return;
        let stl = (callbackOK && callbackClose) ? alertStyle.alertCancleAndOk : alertStyle.alertCancleOrOk;
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={'zoomOut'}
                modal={true}
                ref={v => this.overlayPopView2 = v}
            >
                <View style={{backgroundColor: '#fff', minWidth: 260, minHeight: 180, borderRadius: 5}}>
                    <View style={{
                        height           : 44,
                        flexDirection    : 'row',
                        alignItems       : 'center',
                        justifyContent   : 'flex-start',
                        borderColor      : '#eee',
                        borderBottomWidth: 1
                    }}>
                        <Icon.Button name="close" size={25} color="#ddd" backgroundColor="#0000" underlayColor="#0000"
                                     onPress={() => {
                                         this.overlayPopView2.close();
                                         this.overlayPopView2 = null;
                                         callbackClose && callbackClose();
                                     }}/>
                        <Text style={{
                            color      : '#666',
                            fontSize   : 15,
                            flex       : 1,
                            textAlign  : 'center',
                            marginRight: 50
                        }}>{title}</Text>
                    </View>
                    {
                        React.isValidElement(childs) ? childs : <Text style={{
                            flex    : 1, textAlign: 'center', textAlignVertical: 'center',
                            fontSize: 14, color: 'orange', padding: 10
                        }} numberOfLines={6}>{childs ? childs + '' : ''}</Text>
                    }
                    <View style={stl}>
                        {
                            callbackClose ?
                                <ImageButton
                                    image={require('../assets/gaoji/btn_cancle.png')}
                                    style={{borderWidth: 0}}
                                    onPress={() => {
                                        this.overlayPopView2.close();
                                        this.overlayPopView2 = null;
                                        callbackClose && callbackClose();
                                    }}/>
                                : null
                        }
                        {
                            callbackOK ?
                                <ImageButton
                                    image={require('../assets/gaoji/btn_ok.png')}
                                    style={{borderWidth: 0}}
                                    onPress={() => {
                                        callbackOK && callbackOK();
                                    }}/>
                                : null
                        }
                    </View>
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    };

    instance.dismissAlertView = function () {
        if (this.overlayPopView)
            this.overlayPopView.close();
        if (this.overlayPopView2)
            this.overlayPopView2.close();
    };

    instance.showLoadingView = function (title = null) {
        if (this.loading)
            return;
        this.loading = true;
        ModalIndicator.show(title ? title : '');
    };

    instance.stopLoadingView = function () {
        if (!this.loading)
            return;
        this.loading = false;
        ModalIndicator.hide();
    };

    ///////////////////---
    instance.popEditZiti = function (callback) {
        if (this.popEditZitiV) {
            Overlay.show(this.popEditZitiV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditZitiV = v} containerStyle={{backgroundColor: '#0000'}}>
                <View style={{alignItems: 'center', backgroundColor: '#0000', height: 310}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height: 30}}
                                 onPress={() => {
                                     this.popEditZitiV.close();
                                     this.popEditZitiV = null;
                                 }}/>
                    <View style={{
                        flexDirection  : 'row',
                        alignItems     : 'center',
                        flex           : 1,
                        backgroundColor: '#fff',
                        marginTop      : 8
                    }}>
                        <ImageButton image={require('../assets/newads/new/ic_zt_heiti.png')}
                                     style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('黑体');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_zt_song.png')}
                                     style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('宋体');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_zt_kai.png')}
                                     style={{flex: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('楷体');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: '#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_zt_lishu.png')}
                                     style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('隶书');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_zt_yahei.png')}
                                     style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('微软雅黑');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_zt_youyuan.png')}
                                     style={{flex: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('幼圆');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, backgroundColor: '#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_zt_huawen.png')}
                                     style={{flex: 1, borderRightWidth: 1, borderBottomWidth: 1, borderColor: '#eee'}}
                                     onPress={() => {
                                         callback && callback('华文琥珀');
                                         this.popEditZitiV.close();
                                         this.popEditZitiV = null;
                                     }}/>
                        <View style={{flex: 1}}/>
                        <View style={{flex: 1}}/>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance.popEditDuiQi = function (callback) {
        if (this.popEditDuiQiV) {
            Overlay.show(this.popEditDuiQiV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditDuiQiV = v} containerStyle={{backgroundColor: '#0000'}}>
                <View style={{alignItems: 'center', backgroundColor: '#0000', height: 190}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height: 30, margin:10}}
                                 onPress={() => {
                                     this.popEditDuiQiV.close();
                                     this.popEditDuiQiV = null;
                                 }}/>
                    <SegmentedView style={{width:ScreenWidth, height:140, backgroundColor:'#fff'}} type='projector'
                                   barStyle={{borderColor:'#eee', borderBottomWidth:0.5, height:40}}>
                        <SegmentedView.Sheet title='水平方向'>
                            <View style={{
                                flexDirection  : 'row',
                                alignItems     : 'center',
                                justifyContent:'space-around',
                                paddingTop:20, paddingBottom:20, width:ScreenWidth, height:100,
                                backgroundColor: '#fff',
                            }}>
                                <TextButton title="居左" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_l.png')}
                                            onPress={() => {
                                                callback && callback('h', '居左对齐', '居左对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                                <TextButton title="水平居中" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_m.png')}
                                            onPress={() => {
                                                callback && callback('h', '居中对齐', '居中对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                                <TextButton title="居右" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_r.png')}
                                            onPress={() => {
                                                callback && callback('h', '居右对齐', '居右对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                            </View>
                        </SegmentedView.Sheet>
                        <SegmentedView.Sheet title='垂直方向'>
                            <View style={{
                                flexDirection  : 'row',
                                alignItems     : 'center',
                                justifyContent:'space-around',
                                paddingTop:20, paddingBottom:20, width:ScreenWidth, height:100,
                                backgroundColor: '#fff',
                            }}>
                                <TextButton title="居上" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_t.png')}
                                            onPress={() => {
                                                callback && callback('v', '居上对齐', '居上对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                                <TextButton title="垂直居中" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_vm.png')}
                                            onPress={() => {
                                                callback && callback('v', '居中对齐', '居中对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                                <TextButton title="居下" titleStyle={{color:'#666', fontSize:15, fontWeight:'bold'}} textPosition="down"
                                            bgImage={require('../assets/newads/new/ic_dq_b.png')}
                                            onPress={() => {
                                                callback && callback('v', '居下对齐', '居下对齐');
                                                this.popEditDuiQiV.close();
                                                this.popEditDuiQiV = null;
                                            }}/>
                            </View>
                        </SegmentedView.Sheet>
                    </SegmentedView>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance.popEditDonghua = function(callback){
        if (this.popEditDonghuaV) {
            Overlay.show(this.popEditDonghuaV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditDonghuaV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:310}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditDonghuaV.close();
                                     this.popEditDonghuaV = null;
                                 }}/>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff', marginTop:8}}>
                        <ImageButton image={require('../assets/newads/new/ic_dh_ljxs.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("立即显示");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_sy.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("上移");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_lxzy.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("连续左移", true);
                                     }}/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_dh_zy.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("左移");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_xy.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("下移");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_yy.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("右移");
                                     }}/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_dh_ls.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("镭射");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_px.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("飘雪");
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_dh_mp.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         this.popEditDonghuaV.close();
                                         this.popEditDonghuaV = null;
                                         callback && callback("冒泡");
                                     }}/>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance.popEditFontColor = function(callback){
        if (this.popEditFontColorV) {
            Overlay.show(this.popEditFontColorV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditFontColorV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:310}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditFontColorV.close();
                                     this.popEditFontColorV = null;
                                 }}/>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff', marginTop:8}}>
                        <ImageButton image={require('../assets/newads/new/ic_ys_hong.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('红色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_ys_lv.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('绿色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_ys_huang.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('黄色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_ys_lan.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('蓝色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_ys_zi.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('紫色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_ys_qing.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('青色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                    </View>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff'}}>
                        <ImageButton image={require('../assets/newads/new/ic_ys_bai.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('白色');
                                         this.popEditFontColorV.close();
                                         this.popEditFontColorV = null;
                                     }}/>
                        <View style={{flex:1}}/>
                        <View style={{flex:1}}/>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance.popEditSize = function(callback, typeAd){
        if (this.popEditSizeV) {
            Overlay.show(this.popEditSizeV);
            return;
        }

        let ss = [];
        let cc = ["#01cbcd", "#edca0b", "#2583f7", "#edca0b"];
        for (let i=12; i<128; i+=12){
            let i1 = typeAd == "time" ? 16 : i;
            let i2 = typeAd == "time" ? 24 : (i + 4);
            let i3 = typeAd == "time" ? 32 : (i + 8);
            ss.push(
                <View style={{flexDirection:'row', alignItems:'center', width:ScreenWidth, height:60}}>
                    <TextButton style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                title={""+i1}
                                titleStyle={{fontSize:15, fontWeight:"bold", color:"white", width:40, height:40, borderRadius:20, backgroundColor:cc[i%4]}}
                                tag={""+i1}
                                onPress={({tag})=>{
                                     callback && callback(''+tag);
                                     this.popEditSizeV.close();
                                     this.popEditSizeV = null;
                                }}/>
                    <TextButton style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                title={""+i2}
                                titleStyle={{fontSize:15, fontWeight:"bold", color:"white", width:40, height:40, borderRadius:20, backgroundColor:cc[(i+1)%4]}}
                                tag={""+i2}
                                onPress={({tag})=>{
                                    callback && callback(''+tag);
                                    this.popEditSizeV.close();
                                    this.popEditSizeV = null;
                                }}/>
                    <TextButton style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                title={""+i3}
                                titleStyle={{fontSize:15, fontWeight:"bold", color:"white", width:40, height:40, borderRadius:20, backgroundColor:cc[(i+2)%4]}}
                                tag={""+i3}
                                onPress={({tag})=>{
                                    callback && callback(''+tag);
                                    this.popEditSizeV.close();
                                    this.popEditSizeV = null;
                                }}/>
                </View>
            );
            if (typeAd == "time") break;
        }
        let hAll = typeAd == "time" ? 100 : 220;
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditSizeV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:hAll}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditSizeV.close();
                                     this.popEditSizeV = null;
                                 }}/>
                    <ScrollView style={{flex:1, backgroundColor:'#fff', marginTop:8}}>
                    {
                        ss
                    }
                    </ScrollView>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance.popEditJianGe = function(val, callback){
        this.varJianGe = ""+val;
        if (this.popEditJianGeV) {
            Overlay.show(this.popEditJianGeV);
            return;
        }
        let wLeft = ScreenWidth - 70;
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={(v) => this.popEditJianGeV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:260, width:ScreenWidth}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30, margin:8}}
                                 onPress={()=>{
                                     this.txtJianGe = null;
                                     this.popEditJianGeV.close();
                                     this.popEditJianGeV = null;
                                 }}/>
                    <View style={{backgroundColor:'#f2f2f2', flex:1, justifyContent:'center'}}>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:"center", margin:10, backgroundColor:'#f2f2f2', width:ScreenWidth, height:40}}>
                            <Text>{'间隔  '}</Text>
                            <Input ref={v=>this.txtJianGe = v} value={this.varJianGe} editable={false} underlineColorAndroid='transparent' numberOfLines={1} maxLength={3}
                                       style={{width:100, height:32, borderWidth:2, borderColor:'#1998e6',
                                           textAlign:'center', textAlignVertical:'center', backgroundColor:'#fff', color:'#333'}}/>
                            <Text>{'  %'}</Text>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', width:ScreenWidth}}>
                            <View style={{flex:4, marginLeft:5}}>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:44}}>
                                    <TextButton title="1" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "1")}/>
                                    <TextButton title="2" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "2")}/>
                                    <TextButton title="3" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "3")}/>
                                    <TextButton title="4" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "4")}/>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:44}}>
                                    <TextButton title="5" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "5")}/>
                                    <TextButton title="6" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "6")}/>
                                    <TextButton title="7" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "7")}/>
                                    <TextButton title="8" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "8")}/>
                                </View>
                                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around', height:44}}>
                                    <TextButton title="9" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "9")}/>
                                    <TextButton title="0" titleStyle={{color:'#000', fontSize:14, fontWeight:'bold'}} bgImage={require('../assets/newads/pad_num_btn.png')}
                                                onPress={()=>this._setNumPadValue("a", "0")}/>
                                    <TextButton title="" bgImage={require('../assets/newads/pad_clear_btn.png')}
                                                onPress={()=>this._setNumPadValue("c")}/>
                                </View>
                            </View>
                            <View style={{flex:1}}>
                                <TextButton title="" bgImage={require('../assets/newads/pad_back_btn.png')} height={44}
                                            onPress={()=>this._setNumPadValue("b")}/>
                                <TextButton title="" bgImage={require('../assets/newads/pad_ok_btn.png')} height={44*2}
                                            onPress={()=>{
                                                if (this.varJianGe.length <= 0) {
                                                    Toast.info("请输入0-100数值");
                                                }else{
                                                    this.txtJianGe = null;
                                                    this.popEditJianGeV.close();
                                                    this.popEditJianGeV = null;
                                                    callback && callback(this.varJianGe);
                                                }
                                            }}/>
                            </View>
                        </View>

                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }
    instance._setNumPadValue = function (t, v) {
        if (t == 'a') {
            this.varJianGe += v;
        }else if (t == 'c') {
            this.varJianGe = '';
        }else if (t == 'b') {
            this.varJianGe = this.varJianGe.substring(0, this.varJianGe.length-1);
        }
        if (this.varJianGe.length > 0 && parseInt(this.varJianGe) > 100) {
            this.varJianGe = this.varJianGe.substring(0, this.varJianGe.length-1);
            Toast.info("请输入0-100数值");
        }
        this.txtJianGe && this.txtJianGe.setNativeProps({text:this.varJianGe});
    };
    instance.popEditHuanRao = function(callback){
        if (this.popEditHuanRaoV) {
            Overlay.show(this.popEditHuanRaoV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditHuanRaoV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:130}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditHuanRaoV.close();
                                     this.popEditHuanRaoV = null;
                                 }}/>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff', marginTop:8}}>
                        <ImageButton image={require('../assets/newads/new/ic_hrbk_none.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('无边框');
                                         this.popEditHuanRaoV.close();
                                         this.popEditHuanRaoV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_hrbk_h4d.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('红4点');
                                         this.popEditHuanRaoV.close();
                                         this.popEditHuanRaoV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_hrbk_dxss.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback('红单线闪烁');
                                         this.popEditHuanRaoV.close();
                                         this.popEditHuanRaoV = null;
                                     }}/>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    };

    instance.popEditTimeStay = function(value, callback){
        this.vv = (value < 1 ? 1 : value) + "";
        if (this.popEditSliderV) {
            Overlay.show(this.popEditSliderV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditSliderV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', height:220, width:ScreenWidth}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this._txtRef = null;
                                     this.popEditSliderV.close();
                                     this.popEditSliderV = null;
                                 }}/>
                    <View style={{alignItems:'center', width:ScreenWidth, height:190, backgroundColor:'#fff', marginTop:8}}>
                        <View style={{flexDirection:'row', width:ScreenWidth, height:40, alignItems:'center', backgroundColor:"#eee",
                            justifyContent:'space-between', paddingLeft:10, paddingRight:10}}>
                            <Text style={{color:'#333', fontSize:12}} onPress={()=>{
                                this._txtRef = null;
                                this.popEditSliderV.close();
                                this.popEditSliderV = null;
                            }}>{"取消"}</Text>
                            <Text style={{color:'#333', fontSize:15}}>{"停留时间"}</Text>
                            <Text style={{color:'#333', fontSize:12}} onPress={()=>{
                                if ((this.vv.length+"") <= 0 || parseInt(this.vv) < 1 || parseInt(this.vv) > 255)
                                    return;
                                this._txtRef = null;
                                this.popEditSliderV.close();
                                this.popEditSliderV = null;
                                callback&&callback(this.vv);
                            }}>{"完成"}</Text>
                        </View>
                        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                            <View style={{flexDirection:"row", alignItems:"center"}}>
                                <ImageButton image={require("../assets/newads/new/btn_minus.png")} onPress={()=>{
                                    this.vv = (parseInt(this.vv) - 1);
                                    if (this.vv < 1) this.vv = 1;
                                    this._txtRef.setNativeProps({text:this.vv+""});
                                }}/>
                                <View style={{flexDirection:"row", borderWidth:1, borderColor:"#12b7f5", width:140, height:40, marginLeft:5, marginRight:5,
                                    alignItems:"center", justifyContent:"space-between", padding:6
                                }}>
                                    <Input style={{borderWidth:0, flex:1}} ref={v=>this._txtRef = v} defaultValue={this.vv+""}
                                           keyboardType="numeric" maxLength={3}
                                           onChangeText={(t)=>{
                                               if (t.length > 0) {
                                                   if (parseInt(t) > 255) t = 255;
                                                   this.vv = parseInt(t) + "";
                                                   if (this.vv == "NaN") this.vv = "";
                                               }else{
                                                   this.vv = "";
                                               }
                                               this._txtRef.setNativeProps({text:this.vv+""});
                                    }}/>
                                    <Text style={{color:"#ddd", fontSize:12}}>{"s"}</Text>
                                </View>
                                <ImageButton image={require("../assets/newads/new/btn_plus.png")} onPress={()=>{
                                    this.vv = (parseInt(this.vv) + 1);
                                    if (this.vv > 255) this.vv = 255;
                                    this._txtRef.setNativeProps({text:this.vv+""});
                                }}/>
                            </View>
                            <Text style={{color:"orange", fontSize:12}}>{"请输入数字1-255"}</Text>
                        </View>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    instance.popEditSlider = function(title, max, min, maxTitle, minTitle,value, callback){
        this.varSlider = value+"";
        if (this.popEditSliderV) {
            Overlay.show(this.popEditSliderV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditSliderV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', height:220, width:ScreenWidth}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this._txtRef = null;
                                     this.popEditSliderV.close();
                                     this.popEditSliderV = null;
                                 }}/>
                    <View style={{flexDirection:'column', justifyContent:'center', alignItems:'center', width:ScreenWidth, height:190, backgroundColor:'#eee', marginTop:8}}>
                        <View style={{flexDirection:'row', width:ScreenWidth, height:30, alignItems:'center', justifyContent:'center', }}>
                            <Text style={{color:'#333'}}>{title}</Text>
                            <Input ref={v=>(this._txtRef=v)} style={{width:50,color:'#1998e6', backgroundColor:'#0000', borderWidth:0}} editable={false} value={value+""}></Input>
                        </View>
                        <View style={{flexDirection:'row', alignItems:'center'}}>
                            <Text style={{color:'#333', margin:5}}>{minTitle}</Text>
                            <Slider
                                maximumValue={max}
                                minimumValue={min}
                                step={1}
                                value={parseInt(value)}
                                trackStyle={sliderStyle.track}
                                thumbStyle={sliderStyle.thumb}
                                minimumTrackTintColor='#00ff00'
                                onValueChange={(v)=>{
                                    this._txtRef.setNativeProps({text: ''+v});
                                    this.varSlider = v+"";
                                }}
                            />
                            <Text style={{color:'#333', margin:5}}>{maxTitle}</Text>
                        </View>
                        <Button
                            title="确定"
                            titleStyle={{color:'#fff'}}
                            style={{backgroundColor:'#1998e6', marginTop:10, width:100, borderColor:'#0000'}}
                            onPress={()=>{
                                this._txtRef = null;
                                this.popEditSliderV.close();
                                this.popEditSliderV = null;
                                callback&&callback(this.varSlider);
                            }}
                        />
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    instance.popEditAdType = function(callback){
        if (this.popEditAdTypeV) {
            Overlay.show(this.popEditAdTypeV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditAdTypeV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:130}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditAdTypeV.close();
                                     this.popEditAdTypeV = null;
                                 }}/>
                    <View style={{flexDirection:'row', alignItems:'center', flex:1, backgroundColor:'#fff', marginTop:8}}>
                        <ImageButton image={require('../assets/newads/new/ic_adtype_normal.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback(0);
                                         this.popEditAdTypeV.close();
                                         this.popEditAdTypeV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_adtype_insert.png')}
                                     style={{flex:1, borderRightWidth:1, borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback(1);
                                         this.popEditAdTypeV.close();
                                         this.popEditAdTypeV = null;
                                     }}/>
                        <ImageButton image={require('../assets/newads/new/ic_adtype_alarm.png')}
                                     style={{flex:1,borderBottomWidth:1, borderColor:'#eee'}}
                                     onPress={()=>{
                                         callback && callback(2);
                                         this.popEditAdTypeV.close();
                                         this.popEditAdTypeV = null;
                                     }}/>
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }

    instance.popEditBackground = function(type, resizeType, callback){
        if (this.popEditBackgroundV) {
            Overlay.show(this.popEditBackgroundV);
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.popEditBackgroundV = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', backgroundColor:'#0000', height:340, width:ScreenWidth}}>
                    <ImageButton image={require('../assets/newads/new/ic_arrow_down.png')} style={{height:30}}
                                 onPress={()=>{
                                     this.popEditBackgroundV.close();
                                     this.popEditBackgroundV = null;
                                     callback && callback('close');
                                 }}/>
                    <SegmentedView style={{width:ScreenWidth, height:300, backgroundColor:'#fff', marginTop:10}} type='projector'
                                   barStyle={{borderColor:'#aaa', borderBottomWidth:0.7, height:40}}
                                   onChange={(i)=>{
                                        if(i == 0){
                                            callback && callback('none');
                                        }
                                   }}>
                        <SegmentedView.Sheet title='无背景'>
                            <View style={{flex: 1}}>
                            </View>
                        </SegmentedView.Sheet>
                        <SegmentedView.Sheet title='图片'>
                            <View style={{flex: 1}}>
                                <GridBgView
                                    dataSource={DataCenter.backgroundDatas.img[4]}
                                    itemsPerRow={3}
                                    onSelect={(data)=>{callback && callback('img', data)}}
                                />
                                <Radio2Buttons
                                    titles={["平铺", "拉伸"]}
                                    selectIndex={resizeType}
                                    onSelect={(i)=>{callback && callback('imgS', i)}}
                                />
                            </View>
                        </SegmentedView.Sheet>
                        <SegmentedView.Sheet title='动画'>
                            <View style={{flex: 1}}>
                                <GridBgView
                                    dataSource={DataCenter.backgroundDatas.ani[4]}
                                    itemsPerRow={3}
                                    onSelect={(data)=>{callback && callback('ani', data)}}
                                />
                                <Radio2Buttons
                                    titles={["平铺", "拉伸"]}
                                    selectIndex={resizeType}
                                    onSelect={(i)=>{callback && callback('aniS', i)}}
                                />
                            </View>
                        </SegmentedView.Sheet>
                    </SegmentedView>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }


    ///////////////////---

    var sliderStyle = StyleSheet.create({
        track: {
            height: 10,
            width:200,
            borderRadius: 4,
            backgroundColor: '#cccccc',
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 1},
            shadowRadius: 1,
            shadowOpacity: 0.15,
        },
        thumb: {
            width: 20,
            height: 20,
            backgroundColor: '#fff',
            borderColor: '#00ff00',
            borderWidth: 5,
            borderRadius: 10,
            shadowColor: 'black',
            shadowOffset: {width: 0, height: 2},
            shadowRadius: 2,
            shadowOpacity: 0.35,
        },
    });

    var alertStyle = StyleSheet.create({
        alertCancleAndOk:{minWidth:260, height:44, flexDirection:'row', alignItems:'flex-end', justifyContent:'space-around'},
        alertCancleOrOk:{minWidth:260, height:44, flexDirection:'row', alignItems:'center', justifyContent:'center'},
    });

    instance.SliderStyle = sliderStyle;

};
const PopAlert = new PopAlertViewS();
export default PopAlert;
