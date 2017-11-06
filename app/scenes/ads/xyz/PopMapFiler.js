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
 * 这个是［地图模式：filter
 *
 ***/

let topMargin = 44, leftMargin=80;
let panelW = ScreenWidth - leftMargin;
let padding = 10;
let innerW = panelW - padding * 2;
let gap = 6;
let itemW = (innerW - gap*2)/3;
let itemH = 36;
let titleH = 24;
let panelH = 44 + itemH * 5 + gap * 9 +padding*2 + titleH * 3;

var styles = StyleSheet.create({
    itemSelect: {
        width:itemW, height:itemH,
        backgroundColor:"#fff",
        borderWidth:1,
        borderRadius:4,
        borderColor:COLOR_NAV_BG,
        color:COLOR_NAV_BG,
        fontSize:13,
        textAlign:"center",
        textAlignVertical:"center"
    },
    itemNormal: {
        width:itemW, height:itemH,
        backgroundColor:"#eee",
        borderWidth:1,
        borderRadius:4,
        borderColor:"#fff",
        color:"#aaa",
        fontSize:13,
        textAlign:"center",
        textAlignVertical:"center"
    },
    title: {
        fontSize:15,
        color:"#888",
        height:titleH,
        textAlign:"left",
        textAlignVertical:"center",
    }
});

export default class PopMapFilter extends Overlay.PopView {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
            filterStatus: 0,
            filterLedType: 0,
            filterDistance: 0,
        });

    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderContent() {
        let {containerStyle, children} = this.props;
        let thiz = this;
        return (
            <Animated.View style={{alignItems:"flex-end", flex:1}} pointerEvents='box-none' onLayout={(e) => this.onLayout(e)}>
                <View style={{backgroundColor: '#fff', width: panelW, height: panelH, marginLeft:leftMargin, marginTop:topMargin}}>
                    <View style={{paddingLeft:15, paddingRight:15, paddingTop:padding, paddingBottom:padding, borderBottomWidth:1, borderColor:"#eee"}}>
                        <Text style={styles.title}>{"LED屏状态"}</Text>
                        <View style={{width:innerW, height:itemH, marginTop:gap, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={this.state.filterStatus == 0 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({status:0})}>{"全部"}</Text>
                            <Text style={this.state.filterStatus == 1 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({status:1})}>{"在线"}</Text>
                            <Text style={this.state.filterStatus == 2 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({status:2})}>{"离线"}</Text>
                        </View>
                        <View style={{width:innerW, height:itemH, marginTop:gap, flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}}>
                            <Text style={this.state.filterStatus == 3 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({status:3})}>{"报警"}</Text>
                        </View>
                        <Text style={[styles.title, {marginTop:gap*2}]}>{"屏类型"}</Text>
                        <View style={{width:innerW, height:itemH, marginTop:gap, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={this.state.filterLedType == 0 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({type:0})}>{"全部"}</Text>
                            <Text style={this.state.filterLedType == 1 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({type:1})}>{"普通屏"}</Text>
                            <Text style={this.state.filterLedType == 2 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({type:2})}>{"GPS屏"}</Text>
                        </View>
                        <Text style={[styles.title, {marginTop:gap*2}]}>{"距离范围"}</Text>
                        <View style={{width:innerW, height:itemH, marginTop:gap, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={this.state.filterDistance == 0 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:0})}>{"500m"}</Text>
                            <Text style={this.state.filterDistance == 1 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:1})}>{"1km"}</Text>
                            <Text style={this.state.filterDistance == 2 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:2})}>{"2km"}</Text>
                        </View>
                        <View style={{width:innerW, height:itemH, marginTop:gap, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                            <Text style={this.state.filterDistance == 3 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:3})}>{"5km"}</Text>
                            <Text style={this.state.filterDistance == 4 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:4})}>{"10km"}</Text>
                            <Text style={this.state.filterDistance == 5 ? styles.itemSelect : styles.itemNormal} onPress={()=>this._onClickItem({dist:5})}>{"20km"}</Text>
                        </View>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", width:panelW, height:44}}>
                        <Button style={{flex:0.5, borderWidth:0, height:44, backgroundColor:"#fff"}} titleStyle={{fontSize:15, color:"#aaa"}}
                                title="重置"
                                onPress={()=>this._onClickItem({btn:0})}
                        />
                        <Button style={{flex:0.5, borderWidth:0, borderRadius:0, height:44, backgroundColor:COLOR_NAV_BG}} titleStyle={{fontSize:15, color:"#fff"}}
                                title="确定"
                                onPress={()=>this._onClickItem({btn:1})}
                        />
                    </View>
                </View>
            </Animated.View>
        );
    }

    _onClickItem = (info)=>{
        if (info.status != undefined) {
            this.setState({filterStatus:info.status});
        }else if (info.type != undefined) {
            this.setState({filterLedType:info.type});
        }else if (info.dist != undefined) {
            this.setState({filterDistance:info.dist});
        }else if (info.btn != undefined) {
            
        }
    };




    static show = (data, onDone) => {
        var overlayView = (
            <PopMapFilter
                style={{alignItems: 'center'}}
                type={'zoomOut'}
                modal={false}
                data={data}
                onDone={onDone}
            />
        );

        Overlay.show(overlayView);

    };
};


























