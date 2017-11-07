
import React from 'react';
import {
    View, Text, StyleSheet, Dimensions,
    KeyboardAvoidingView, ScrollView, TextInput, TouchableOpacity, Keyboard,
    Image, Vibration,
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

    Theme,
} from 'teaset';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scrollview';
import {COLOR_NAV_BG} from "../../constants/Colors";
import MapView from 'react-native-maps';
import HttpApi from "../../network/HttpApi";
import PopAlert from "../../widgets/PopAlertView";
import Utils from '../../Utils/Utils';
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

        this.state = {
            region: {
                latitude: LATITUDE,
                longitude: LONGITUDE,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
            },
            gotMyLoc:false,
            markersGps: [],
            selectedIds: [],

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
        PopAlert.showLoadingView("定位中");
        Utils.getLocation((loc)=>{
            PopAlert.stopLoadingView();
            if (loc && loc.lat && loc.lng) {
                this.setState({region:{
                    latitude: loc.lat,
                    longitude: loc.lng,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }, gotMyLoc:true});
            }else{
                this.setState({region:{
                    latitude: LATITUDE,
                    longitude: LONGITUDE,
                    latitudeDelta: LATITUDE_DELTA,
                    longitudeDelta: LONGITUDE_DELTA,
                }, gotMyLoc:true});
            }
        });
    }

    componentDidMount() {
        HttpApi.getGpsDevices({token:this.props.userInfo.token}, (resp, error)=>{
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                console.log(resp);
                if (resp) {
                    let arr = dic_.valuesIn(resp).map(function (o) {
                        let gd = Utils.gpsToGaodeJS(parseFloat(o.lat), parseFloat(o.lon));
                        return {
                            title: o.info,
                            key: o.id,
                            coordinate:{
                                latitude: gd.lat,
                                longitude: gd.lon,
                            },
                        };
                    });
                    if (arr && arr.length > 0) {
                        this.setState({markersGps:arr});
                    }
                }
            }
        });
    }

    componentWillUnmount() {

    }

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
                    //onPress={this.onMapPress}
                >
                    {this.state.markersGps.map(marker => (
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