import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView,
    Animated,
    Image,
    InteractionManager,
    FlatList,
    TouchableOpacity,
    DatePickerAndroid,
    Platform
} from "react-native";
import PropTypes from 'prop-types';
import {
    ModalIndicator,
    Overlay,
    SegmentedView,
    Button,
    Input,
    Toast,
    ListRow
} from 'teaset';
import IonIcon from "react-native-vector-icons/Ionicons";
import ImageButton from '../../../widgets/ImageButton';
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import YsWebSocket from "../../../network/YsWebSocket";
import * as Utils from '../../../Utils/Utils';
import {COLOR_NAV_BG} from "../../../constants/Colors";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let array_ = require('lodash/array');
let object_ = require('lodash/object');

/***
 * 这个是［Timer的倒计时模式］alert view。
 *
 ***/

export default class PopCountDown extends Overlay.PopView {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            targetTime:props.targetTime,
            value:props.value,
        });

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderContent() {
        let {containerStyle, children} = this.props;
        let thiz = this;
        let hAll = 200, headH = 40, bodyH = 160;
        return (
            <Animated.View style={{alignItems:"center", justifyContent:"center", flex:1}} pointerEvents='box-none' onLayout={(e) => this.onLayout(e)}>
                <View style={{backgroundColor: '#fff', width: ScreenWidth-40, height: hAll, borderRadius:5}}>
                    <View style={{
                        height           : headH,
                        paddingRight: 10, paddingLeft:10,
                        flexDirection    : 'row',
                        alignItems       : 'center',
                        justifyContent   : 'space-between',
                        borderColor      : '#eee',
                        borderBottomWidth: 1
                    }}>
                        <IonIcon.Button name="md-close" size={25} color="#ddd" backgroundColor="#0000" underlayColor="#0000"
                                        onPress={() => {
                                            this.close();
                                        }}/>
                        <Text style={{
                            color      : '#666',
                            fontSize   : 15,
                            flex       : 1,
                            textAlign  : 'center',
                            marginRight:30
                        }}>{"倒计时模式"}</Text>
                    </View>

                    <View style={{flex:1, alignItems: 'center'}}>
                        <View style={{flexDirection:"row", alignItems:"center", flex:0.5}}>
                            <Text>目标文字：</Text>
                            <Input style={{width:160}} defaultValue={this.state.value} onChangeText={(t)=>this.state.value=t}/>
                        </View>
                        <TouchableOpacity style={{flexDirection:"row", alignItems:"center", flex:0.5}} onPress={()=>{
                            this._showDatePicker()
                        }}>
                            <Text>目标时间：</Text>
                            <Input style={{width:160, color:"gray"}} editable={false} defaultValue={this.state.targetTime}/>
                        </TouchableOpacity>
                        <View style={{flexDirection:"row", alignItems:"center", width:ScreenWidth-60, height:50, justifyContent:"space-around"}}>
                            <ImageButton
                                image={require('../../../assets/gaoji/btn_cancle.png')}
                                style={{borderWidth: 0}}
                                onPress={() => {
                                    this.close();
                                }}/>
                            <ImageButton
                                image={require('../../../assets/gaoji/btn_ok.png')}
                                style={{borderWidth: 0}}
                                onPress={() => {
                                    this.props.onDone && this.props.onDone(this.state.targetTime, this.state.value);
                                    this.close();
                                }}/>
                        </View>
                    </View>
                </View>
            </Animated.View>
        );
    }

    _showDatePicker = async () => {
        if (Platform.OS == 'ios') {
            if (this.dialogIosDate) {
                Overlay.show(this.dialogIosDate);
                return;
            }
            let overlayView = (
                <Overlay.PullView modal={false} rootTransform={'scale'} ref={v => this.dialogIosDate = v}>
                    {
                        this._genIosDatePickerChildren("date")
                    }
                </Overlay.PullView>
            );
            Overlay.show(overlayView);
        }else {
            try {
                const {action, year, month, day} = await DatePickerAndroid.open({
                    // 要设置默认值为今天的话，使用`new Date()`即可。
                    // 下面显示的会是2020年5月25日。月份是从0开始算的。
                    date: new Date(this.state.targetTime)
                });
                if (action !== DatePickerAndroid.dismissedAction) {
                    // 这里开始可以处理用户选好的年月日三个参数：year, month (0-11), day
                    this.setState({targetTime:year + "-" + Utils.add0(month + 1) + '-' + Utils.add0(day)});

                }
            } catch ({code, message}) {
                console.warn('Cannot open date picker', message);
            }
        }
    };

    // This is for updating the Overlay of iOS date picker.
    _genIosDatePickerChildren = (mode)=> {
        let chi = (
            <View style={{width:ScreenWidth, minHeight:320, alignItems:'center', backgroundColor:'#fff'}}>
                <View style={{width:ScreenWidth, height:44, flexDirection:'row', alignItems:'center', justifyContent:'space-between',
                    borderColor:'#aaa', borderBottomWidth:0.5, paddingLeft:20, paddingRight:20}}>
                    <Button
                        title="取消"
                        style={{borderColor:'#0000', backgroundColor:'#888'}}
                        titleStyle={{color:'#fff', fontSize:14}}
                        onPress={()=>{this.dialogIosDate&&this.dialogIosDate.close()}}
                    />
                    <Text style={{fontSize:16}}>选择日期</Text>
                    <Button
                        title="完成"
                        style={{borderColor:'#0000', backgroundColor:COLOR_NAV_BG}}
                        titleStyle={{color:'#fff', fontSize:14}}
                        onPress={()=>{
                            let d = moment_(this.state.iosDate).format("YYYY-MM-DD");
                            this.setState({targetTime:d});
                            this.dialogIosDate&&this.dialogIosDate.close();
                        }}
                    />
                </View>
                <DatePickerIOS
                    ref = {(v)=>this.iosDatePicker = v}
                    style={{width:ScreenWidth, minHeight:260}}
                    date={this.state.iosDate}
                    mode={mode}
                    onDateChange={(d)=>{
                        this.state.iosDate = d;
                        this.dialogIosDate.setReload(this._genIosDatePickerChildren(type, mode));
                    }}
                />
            </View>
        );
        return chi;
    };


    static show = (data, onDone) => {
        var overlayView = (
            <PopCountDown
                style={{alignItems: 'center'}}
                type={'zoomOut'}
                modal={true}
                targetTime={data.date}
                value={data.value}
                onDone={onDone}
            />
        );

        Overlay.show(overlayView);

    };
};


























