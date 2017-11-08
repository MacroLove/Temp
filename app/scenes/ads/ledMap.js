
import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, Vibration, InteractionManager
} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import {Scene, Router, Actions, ActionConst} from "react-native-router-flux";
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
    TeaNavigator,
    Toast,
    Theme,
} from 'teaset';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {COLOR_NAV_BG} from "../../constants/Colors";
import MapView from 'react-native-maps';
import HttpApi from "../../network/HttpApi";
import PopAlert from "../../widgets/PopAlertView";
import {Utils, GPSUtils} from '../../Utils/Utils';
import PopMapFilter from "./xyz/PopMapFiler";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let FlagChecked = require('../../assets/map/flag_r_check.png');
let FlagUnChecked = require('../../assets/map/flag_r_uncheck.png');
let CarOnChecked = require('../../assets/map/flag_car_blue.png');
let CarOnUnChecked = require('../../assets/map/flag_car_blue.png');
let CarOffChecked = require('../../assets/map/flag_car_gray.png');
let CarOffUnChecked = require('../../assets/map/flag_car_gray.png');
const ASPECT_RATIO = ScreenWidth / ScreenHeight;
const LATITUDE = 39.902895;
const LONGITUDE = 116.427915;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

let dic_ = require('lodash/object');
let arr_ = require('lodash/array');

class LedMap extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "我的LED屏(地图模式)",
        scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);

        this.isUnmounted = false;
        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            gotMyLoc:false,
            selectedIds: [],

            datasFixed: [],
            datasGps: [],
            markersGps: [],
            markersFixed: [],

            // filter
            filterStatus: 0,
            filterType: 0,
            filterDist: 0,
        };
        //this.onMapPress = this.onMapPress.bind(this);
    }

    //onMapPress(e) {
    //    this.setState({
    //        markersGps: [
    //            ...this.state.markersGps,
    //            {
    //                coordinate: e.nativeEvent.coordinate,
    //                key: `foo${id++}`,
    //            },
    //        ],
    //    });
    //}

    componentWillMount() {
    }

    componentDidMount() {
        let thiz = this;
        InteractionManager.runAfterInteractions(() => {
            PopAlert.showLoadingView("定位中");
            Utils.getLocation((loc)=>{
                PopAlert.stopLoadingView();
                if (loc && loc.lat && loc.lng) {
                    thiz.setState({region:{
                        latitude: loc.lat,
                        longitude: loc.lng,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }, gotMyLoc:true});
                }else{
                    thiz.setState({region:{
                        latitude: LATITUDE,
                        longitude: LONGITUDE,
                        latitudeDelta: LATITUDE_DELTA,
                        longitudeDelta: LONGITUDE_DELTA,
                    }, gotMyLoc:true});
                }
            });
            thiz._loadFixDevices();
        });
    }

    componentWillUnmount() {
        this.isUnmounted = true;
        clearTimeout(this.timer30 || 0);
    }

    // id_dev,  info,   lat, lon, state, title, speed, fleet, driver, mobile, alarm
    _loadGpsDevices = ()=> {
        let thiz = this;
        HttpApi.getGpsDevices({token:thiz.props.userInfo.token}, (resp, error)=>{
            if (error) {
                //PopAlert.showAlertView("错误", error+"");
                Toast.fail(""+error);
            }else{
                //console.log(resp);
                if (Utils.typeOf(resp, "Array")) {
                    let arr = dic_.valuesIn(resp).map(function (o) {
                        let gd = Utils.gpsToGaodeJS(parseFloat(o.lat), parseFloat(o.lon));
                        o.coordinate = {
                            latitude: gd.lat,
                            longitude: gd.lon,
                        };
                        return {
                            title: o.title,
                            key: o.id_dev,
                            coordinate:{
                                latitude: gd.lat,
                                longitude: gd.lon,
                            },
                        };
                    });
                    if (arr && arr.length > 0) {
                        thiz.state.datasGps =resp;
                        thiz._filterMarkers(thiz.state.datasGps);
                    }
                }
            }
            if (!thiz.isUnmounted) {
                thiz.timer30 = setTimeout(()=>thiz._loadGpsDevices(), 30000);
            }
        });

    };

    // id_dev,  info,   lat, lon, state, title
    _loadFixDevices = ()=>{
        let thiz = this;
        HttpApi.getFixedDevices({token:this.props.userInfo.token}, (resp, error)=>{
            if (error) {
                //PopAlert.showAlertView("错误", error+"");
                Toast.fail(""+error);
            }else{
                //console.log(resp);
                if (Utils.typeOf(resp, "Array")) {
                    let arr = dic_.valuesIn(resp).map(function (o) {
                        let gd = Utils.gpsToGaodeJS(parseFloat(o.lat), parseFloat(o.lon));
                        o.coordinate = {
                            latitude: gd.lat,
                            longitude: gd.lon,
                        };
                        return {
                            title: o.title,
                            key: o.id_dev,
                            coordinate:{
                                latitude: gd.lat,
                                longitude: gd.lon,
                            },
                        };
                    });
                    if (arr && arr.length > 0) {
                        this.state.datasFixed = resp;
                        thiz._filterMarkers(thiz.state.datasFixed);
                    }
                }
            }
            thiz._loadGpsDevices();
        });
    };

    _filterMarkers = (datas) => {
        if (datas == this.state.datasFixed) {
            this.state.markersFixed = [];
            if (this.state.filterType != 2) {
                let thiz = this;
                dic_.valuesIn(this.state.datasFixed).forEach(function (o, i) {
                    let dis = GPSUtils.getGaodeDistance(thiz.state.region, o.coordinate);
                    if ((thiz.state.filterStatus == 0 || (thiz.state.filterStatus == 1 && o.state == 1) || (thiz.state.filterStatus == 2 && o.state == 0) || (thiz.state.filterStatus == 3 && o.alarm == 1))
                        && ((thiz.state.filterDist == 0 && dis <= 500) || (thiz.state.filterDist == 1 && dis <= 1000) || (thiz.state.filterDist == 2 && dis <= 2000) || (thiz.state.filterDist== 3 && dis<5000) || (thiz.state.filterDist==4&&dis<=10000) || (thiz.state.filterDist==5&&dis<=20000)))
                    {
                        thiz.state.markersFixed.push(
                            {
                                title: o.title,
                                key: o.id_dev,
                                coordinate:{
                                    latitude: o.coordinate.latitude,
                                    longitude: o.coordinate.longitude,
                                },
                            }
                        );
                    }
                });
                thiz.forceUpdate();
            }
        }else if (datas == this.state.datasGps){
            this.state.markersGps = [];
            if (this.state.filterType != 1) {
                let thiz = this;
                dic_.valuesIn(this.state.datasGps).forEach(function (o, i) {
                    let dis = GPSUtils.getGaodeDistance(thiz.state.region, o.coordinate);
                    if ((thiz.state.filterStatus == 0 || (thiz.state.filterStatus == 1 && o.state == 1) || (thiz.state.filterStatus == 2 && o.state == 0) || (thiz.state.filterStatus == 3 && o.alarm == 1))
                        && ((thiz.state.filterDist == 0 && dis <= 500) || (thiz.state.filterDist == 1 && dis <= 1000) || (thiz.state.filterDist == 2 && dis <= 2000) || (thiz.state.filterDist== 3 && dis<5000) || (thiz.state.filterDist==4&&dis<=10000) || (thiz.state.filterDist==5&&dis<=20000)))
                    {
                        thiz.state.markersGps.push(
                            {
                                title: o.title,
                                key: o.id_dev,
                                coordinate:{
                                    latitude: o.coordinate.latitude,
                                    longitude: o.coordinate.longitude,
                                },
                            }
                        );
                    }
                });
                thiz.forceUpdate();
            }
        }
    };

    renderNavigationLeftView() {
        return (
            <NavigationBar.BackButton
                title={Theme.backButtonTitle}
                onPress={() => Actions.pop()}
            />
        );
    }

    renderNavigationRightView() {
        return (
            <NavigationBar.LinkButton
                title={"筛选"}
                onPress={() => {
                    PopMapFilter.show({status:this.state.filterStatus, type:this.state.filterType, dist:this.state.filterDist}, this._onDoneFilter);
                }}
            />
        );
    }

    renderPage() {
        if (this.state.gotMyLoc == false)
            return null;
        return (
            <View style={{flex: 1, justifyContent:'space-between', alignItems:'center'}}>
                <MapView
                    style={styles.map}
                    cacheEnabled={false}
                    showsMyLocationButton={false}
                    showsUserLocation={true}
                    initialRegion={this.state.region}
                    onRegionChange={(r)=>{
                        if (r && r.latitude) {
                            this.state.region = r;
                        }
                    }}
                    //onPress={this.onMapPress}
                >
                    {this.state.markersGps.map(marker => (
                        <MapView.Marker
                            title={marker.title}
                            image={this.state.selectedIds.indexOf(marker.key+"") == -1 ? CarOnUnChecked : CarOnChecked}
                            key={marker.key+""}
                            identifier={marker.key+""}
                            coordinate={marker.coordinate}
                            onPress={(e)=>this._onClickMarker(e)}
                        />
                    ))}
                    {this.state.markersFixed.map(marker => (
                        <MapView.Marker
                            title={marker.title}
                            image={this.state.selectedIds.indexOf(marker.key+"") == -1 ? FlagUnChecked : FlagChecked}
                            key={marker.key+""}
                            identifier={marker.key+""}
                            coordinate={marker.coordinate}
                            onPress={(e)=>this._onClickMarker(e)}
                        />
                    ))}
                </MapView>
                {
                    this.state.selectedIds.length > 0 ?
                        <Text style={{width:ScreenWidth-50, height:32, backgroundColor:'#00000088', color:'#fff', borderRadius:16,
                            textAlign:'center', marginTop:14, textAlignVertical:'center'}}>
                            {'已选中' + this.state.selectedIds.length + '块屏'}
                        </Text>
                        : null
                }
                {
                    this.state.selectedIds.length > 0 ? <Button title="确定" style={{width:ScreenWidth, height:44, borderColor:'#0000',
                        borderWidth:0, backgroundColor:'#39ceff'}} titleStyle={{color:'#fff', fontSize:16}} onPress={()=>{
                        this._onClickDoneSelect();
                    }}/> : null
                }
            </View>
        );
    }

    _onClickMarker = (e) => {
        console.log(e.nativeEvent.id);
        if (this.state.selectedIds.indexOf(e.nativeEvent.id) == -1) {
            this.state.selectedIds.push(e.nativeEvent.id);
        }else{
            arr_.remove(this.state.selectedIds, function (o) {
                return o == e.nativeEvent.id;
            });
        }
        this.forceUpdate();
    }

    _onClickDoneSelect = () => {
        if (this.props.callback && this.state.selectedIds.length > 0) {
            this.props.callback(true, {selectLeds:this.state.selectedIds});
            //this.navigator.pop();
            Actions.pop();
        }
    }

    _onDoneFilter = (data) => {
        this.state.filterType = data.type;
        this.state.filterDist = data.dist;
        this.state.filterStatus =data.status;
        this._filterMarkers(this.state.datasGps);
        this._filterMarkers(this.state.datasFixed);
    };
}


var styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5FCFF',
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
});

module.exports = LedMap;