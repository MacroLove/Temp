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
    FlatList
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
import {Utils, GPSUtils} from '../../../Utils/Utils';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let array_ = require('lodash/array');
let object_ = require('lodash/object');

/***
 * 这个是［正在发送广告］alert view。
 *
 ***/

let ImageW = 672;
let ImageH = 351;
let PaddingLeft = 10;
let PaddingRight = 20;
let ItemWidth = ScreenWidth - PaddingLeft - PaddingRight;
let PaddingBottom = 70;
let StateColors = {"1": '#fff', "2": '#0b8ded', "3": 'green', "4": 'red'};
let StateStrings = {"1": '等待发送', "2": '发送中', "3": '成功', "4": '失败'};

export default class PopAdSendIn extends Overlay.PopView {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            currOpenedDevice: null,
            countOfSuccess: 0,
            countOfFail: 0,
            countOfWait: 0,
            countOfOffline: 0,
            datas: [],
            respData: [],
            wsKey: "PopAdSendIn.js",
            isRendering: false,
        });

        this._loadDatas({token: props.token});
    }

    _loadDatas = (param) => {
        let thiz = this;
        HttpApi.sendIn(param, (resp, error) => {
            if (resp && resp.data) {
                thiz.state.respData = resp.data;
                thiz.state.isRendering = true;
                if (resp.data.length > 0) {
                    var dicAll = {};
                    resp.data.forEach(function (o, i, a) {
                        if (!dicAll[o.device]) {
                            dicAll[o.device] = [];
                        }
                        o.key = o.device;
                        dicAll[o.device].push(o);
                        if (o.status == 2) {
                            thiz.state.countOfWait += 1;
                        } else if (o.status == 3) {
                            thiz.state.countOfSuccess += 1;
                        } else if (o.status == 4) {
                            thiz.state.countOfFail += 1;
                        } else {
                            thiz.state.countOfOffline += 1;
                        }
                    });

                    object_.forIn(dicAll, function (value, key) {
                        thiz.state.datas.push({key: key, data: value});
                    });
                    thiz.state.isRendering = false;
                }
                YsWebSocket.addCallback({key:thiz.state.wsKey, cmd:'program', callback:thiz._wsCallbackProgram});
                YsWebSocket.addCallback({key:thiz.state.wsKey, cmd:'adSendProgress', callback:thiz._wsCallbackProgress});
            } else {

            }
        });
    };

    componentDidMount() {
        let thiz = this;
        this.timerReload = setInterval(() => {
            console.log(thiz.state.isRendering);
            if (!thiz.state.isRendering)
                thiz.forceUpdate();
        }, 2000);
    }

    componentWillUnmount() {
        this.timerReload && clearInterval(this.timerReload);

        YsWebSocket.removeCallback(this.state.wsKey);
    }

    _wsCallbackProgram = (msgs, cmds) => {
        var thiz = this;
        var devids = msgs.ids_dev.split(',');
        var sno = msgs.sno;
        var status = msgs.status;
        thiz.state.isRendering = true;
        devids.forEach(function (devid) {
            let o = null;
            thiz.state.countOfWait = 0;
            thiz.state.countOfSuccess = 0;
            thiz.state.countOfFail = 0;
            thiz.state.countOfOffline = 0;
            for (let i = 0; i < thiz.state.respData.length; ++i) {
                o = thiz.state.respData[i];
                if (o.device == devid && o.sno == sno) {
                    o.status = status;
                }
                if (o.status == 2) {
                    thiz.state.countOfWait += 1;
                } else if (o.status == 3) {
                    thiz.state.countOfSuccess += 1;
                } else if (o.status == 4) {
                    thiz.state.countOfFail += 1;
                } else {
                    thiz.state.countOfOffline += 1;
                }
            }
        });
        thiz.state.isRendering = false;
    };

    _wsCallbackProgress = (msgs, cmds) => {
        let thiz = this;
        thiz.state.isRendering = true;
        var devids = msgs.ids_dev;
        var sno = msgs.sno;
        var progress = msgs.progress;
        for (let i = 0; i < this.state.respData.length; ++i) {
            o = thiz.state.respData[i];
            if (o.device == devids && o.sno == sno) {
                o.progress = progress;
            }
        }
        thiz.state.isRendering = false;
    };

    renderContent() {
        let {containerStyle, children} = this.props;
        let thiz = this;
        let marginTop = 20;
        let headH = (ScreenWidth / ImageW) * ImageH;
        let bodyH = ScreenHeight - marginTop - headH - 20;

        return (
            <Animated.View style={containerStyle} pointerEvents='box-none' onLayout={(e) => this.onLayout(e)}>
                <View style={{width: ScreenWidth, height: headH, marginTop: marginTop}}>
                    <Image source={require("../../../assets/sendin/rocket_head.png")}
                           style={{width: ScreenWidth, height: headH, position: 'absolute', left: 0, top: 0}}
                           resizeMode="stretch"/>
                    <Button style={{
                        width: 30,
                        height: 30,
                        borderColor: '#0000',
                        backgroundColor: '#0000',
                        position: 'absolute',
                        right: 1,
                        top: headH * 0.52
                    }}
                            onPress={() => {
                                YsWebSocket.removeCallback(thiz.state.wsKey);
                                thiz.close();
                            }}
                    />
                </View>
                <View style={{width: ScreenWidth, height: bodyH, alignItems: 'center'}}>
                    <Image source={require("../../../assets/sendin/rocket_body.png")}
                           style={{width: ScreenWidth, height: bodyH, position: 'absolute',}} resizeMode="stretch"/>
                    <Text style={{color: '#12b7f5', fontSize: 14}}>{"正在发送广告"}</Text>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: '#efefef',
                        borderBottomWidth: 1,
                        width: ScreenWidth - 40,
                        paddingBottom: 6
                    }}>
                        <Text style={{color: 'white', fontSize: 12}}>{"成功"}<Text
                            style={{color: 'green'}}>{this.state.countOfSuccess + ""}</Text></Text>
                        <Text style={{color: 'white', fontSize: 12}}>{"条 失败"}<Text
                            style={{color: 'red'}}>{this.state.countOfFail + ""}</Text></Text>
                        <Text style={{color: 'white', fontSize: 12}}>{"条 待发送"}<Text
                            style={{color: '#0b8ded'}}>{this.state.countOfWait + ""}</Text></Text>
                        <Text style={{color: 'white', fontSize: 12}}>{"条 离线发送" + this.state.countOfOffline + "条"}</Text>
                    </View>
                    <FlatList style={{
                        flex: 1,
                        paddingLeft: PaddingLeft,
                        paddingRight: PaddingRight,
                        marginBottom: PaddingBottom
                    }}
                              data={thiz.state.datas}
                              extraData={thiz.state}
                              keyExtractor={(item, index) => {
                                  "" + index
                              }}
                              renderItem={this._renderItem}
                    />

                </View>
            </Animated.View>
        );
    }

    _renderItem = ({item, index}) => {
        //console.log(item, index);
        //return;

        let thiz = this;
        let k = item.key;
        let v = item.data;

        let arrow = k == thiz.state.currOpenedDevice ? require('../../../assets/sendin/arrow_down.png') : require('../../../assets/sendin/arrow_up.png');

        let items = [];
        if (k == thiz.state.currOpenedDevice) {
            v.forEach(function (o) {
                let pro = o.progress ? parseInt(o.progress) : 0;
                let wp = (pro / 100.0) * 80;
                items.push(
                    <View style={{
                        flexDirection: 'row',
                        width: ItemWidth - 40,
                        height: 50,
                        marginLeft:40,
                        alignItems: 'center',
                        borderBottomWidth: 0.5,
                        borderColor: '#eee'
                    }}>
                        <Image
                            style={{width: 36, height: 36, marginRight: 5}}
                            source={require('../../../assets/ic_his_cellIcon.png')}
                        />
                        <View style={{flex: 1}}>
                            <Text style={{color: '#fff', fontSize: 14}}>{'广告编号:' + o.no}</Text>
                            <Text style={{color: '#fff', fontSize: 12}}>{'名称:' + o.program_name}</Text>
                        </View>
                        <View style={{flex: 1, alignItems: 'flex-end'}}>
                            <Text style={{
                                color: StateColors[o.status],
                                fontSize: 14,
                                textAlign: 'right'
                            }}>{"" + StateStrings[o.status]}</Text>
                            {
                                o.status == 2 ?
                                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                        <Text style={{color: '#fff', fontSize: 10, margin: 2}}>{pro + "%"}</Text>
                                        <View style={{width: 80, height: 6, backgroundColor: '#fff'}}>
                                            <View style={{width: wp, height: 6, backgroundColor: '#00ca05'}}/>
                                        </View>
                                    </View>
                                    : null
                            }
                        </View>
                    </View>
                );
            });
        }
        return (
            <View style={{width: ItemWidth}}>
                <ListRow style={{width: ItemWidth, backgroundColor: '#0000'}}
                         icon={<Image source={require('../../../assets/ic_his_led.png')}
                                      style={{width: 20, height: 20}}/>}
                         title={"" + k} titleStyle={{color: '#fff', fontSize: 12, marginLeft: 6}}
                         accessory={<Image source={arrow} style={{width: 13, height: 11}}/>}
                         onPress={() => {
                             if (thiz.state.currOpenedDevice == k)
                                 thiz.setState({currOpenedDevice: null});
                             else
                                 thiz.setState({currOpenedDevice: k});
                         }}
                />
                {
                    items
                }
            </View>
        );
    };

    static show = (token) => {
        var overlayView = (
            <PopAdSendIn
                style={{alignItems: 'center'}}
                type={'zoomOut'}
                modal={true}
                token={token}
            />
        );

        Overlay.show(overlayView);

    };
};


























