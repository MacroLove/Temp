/**
 * Copyright (c) 2017-present, ZTB.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @flow
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Keyboard,
    Image,
    FlatList,
    SectionList,
} from "react-native";
import {
    SearchInput,
    ListRow,
    Overlay,
    Button
}from 'teaset'
import Toast from 'react-native-root-toast';
import Icon from 'react-native-vector-icons/Ionicons';
import PropTypes from 'prop-types';
import axios from 'axios';
import JsPicker from '../widgets/PureJSPicker';
import AreaData from '../widgets/area.json';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let DEFAULT_HEIGHT = 54;
let URL_SEARCH_POI = 'http://restapi.amap.com/v3/assistant/inputtips?key=2c6ea92b66ed486fdf8f89656b29041c&types=&location=&datatype=poi&';//keywords=西城&city=北京';

function createAreaData(area, initCity){
    let data = {};
    let initC = (initCity && (initCity.length > 1)) ? ['中国', '北京', initCity] : ['中国', '北京', '北京'];
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

var initCC = createAreaData(AreaData, null);


class LocationSearchView extends React.PureComponent {

    static defaultProps = {
        onSelectCity: PropTypes.func,
        onSelectPoi: PropTypes.func,
    };

    constructor(props) {
        super(props);
        this.state = {
            city:["中国", '北京', '北京'],
            keyword: '',
            pois:[],
            inputWidth: -1,
        };
    }

    componentWillReceiveProps(props) {

    }

    componentDidMount(){
    }

    render() {
        return (
            <View style={[{flex:1}, this.props.style]} {...this.props}>
                <View style={styles.header}>
                    <Text style={styles.city}
                          onLayout={(e)=>{
                              if (this.state.inputWidth < 0) {
                                  let {x} = e.nativeEvent.layout;
                                  let inputWidth = ScreenWidth - x - 10;
                                  this.setState({inputWidth});
                              }
                          }} onPress={()=>this._popEditCity()}>
                        {this.state.city[2]}
                    </Text>
                    <Icon name="md-arrow-dropdown" size={20} color="white"/>
                    {
                        this.state.inputWidth < 0 ? null :
                            <SearchInput
                                ref = 'searchInput'
                                style={[styles.input, {width:this.state.inputWidth}]}
                                inputStyle={{color:'white'}}
                                placeholder='手动搜索详细地址'
                                placeholderTextColor="#eee"
                                defaultValue=""
                                numberOfLines={1}
                                onChangeText={(text) => {
                                    this._onChangeKeyword(text);
                                }}
                            />
                    }
                    <TouchableOpacity style={{marginLeft:10}} onPress={()=>{this.setState({pois:[]});}}>
                        <Text style={styles.city}>取消</Text>
                    </TouchableOpacity>
                </View>
                {
                    this.state.pois.length == 0 ? null :
                        <FlatList
                            style={[styles.sectionList]}
                            extraData={this.state}
                            renderItem={this._renderItemComponent}
                            data={this.state.pois}
                        />
                }
            </View>
        );
    }


    _popEditCity(){
        if (this.overlayPullView) {
            return;
        }
        let overlayView = (
            <Overlay.PullView side={'bottom'} modal={true} ref={v => this.overlayPullView = v} containerStyle={{backgroundColor:'#0000'}}>
                <View style={{alignItems:'center', justifyContent:"center", backgroundColor:'#0000', minHeight:560}}>
                    <View style={{height:280, backgroundColor:'#fff', marginTop:8}}>
                        <View style={{flexDirection:'row', alignItems:'center', paddingLeft:10, paddingRight:10, height:40, backgroundColor:'#f5f5f5', justifyContent:'space-between'}}>
                            <Button title="取消" style={{borderColor:'#0000'}} titleStyle={{color:'#666'}} onPress={()=>{
                                this.overlayPullView && this.overlayPullView.close();
                                this.overlayPullView = null;
                            }}/>

                            <View style={{flexDirection:'row', alignItems:'center'}}>
                                <Image style={{height:40}} resizeMode="contain" source={require('../assets/newads/ic_loc_red.png')}/>
                                <Text style={{color:'#444', fontSize:16}}>选择城市</Text>
                            </View>

                            <Button title="完成" style={{borderColor:'#0000'}} titleStyle={{color:'#666'}} onPress={()=>{
                                let selectedCity = ((this.picker.pickedValue+"").split(','));
                                this.overlayPullView.close();
                                this.overlayPullView = null;
                                this.setState({city:selectedCity});
                            }}/>
                        </View>
                        <JsPicker
                            ref={picker => this.picker = picker}
                            style={{height: 240, width:ScreenWidth}}
                            showMask={false}
                            showDuration={1}
                            pickerData={initCC[0]}
                            selectedValue={this.state.city}
                        />
                    </View>
                </View>
            </Overlay.PullView>
        );
        Overlay.show(overlayView);
    }


    _renderItemComponent = ({item}) =>{
        return <ListRow
            title={item.name}
            detail={item.district}
            titlePlace='top'
            onPress={()=>{
                Toast.show(""+item.name);
                this._onSelectAddress(item);
            }}
        />
    };

    _onSelectAddress = (data) =>{
        this.setState({pois:[]});
        this.props.onSelectAddress && this.props.onSelectAddress(data);
    }

    _onClickCity = (params) => {
        this.setState({ city: `${params.city}` })
    }

    _onChangeKeyword = (text) => {
        if (text.length < 2) {
            return;
        }else if (text.length == 0) {
            this.setState({pois:[]});
            return;
        }
        var thiz = this;
        axios.get(URL_SEARCH_POI+'keywords='+text+'&city='+this.state.city[2])
            .then(function (response) {
                console.log(response);
                if (response.data && response.data.tips && response.data.tips.length > 0){
                    thiz.setState({pois:response.data.tips});
                }else{
                    thiz.setState({pois:[]});
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

const styles = StyleSheet.create({
    header: {
        width: ScreenWidth,
        height:DEFAULT_HEIGHT,
        backgroundColor:'#000000aa',
        alignItems:'center',
        flexDirection:'row',
        padding:10,
    },

    city: {
        color: 'white',
        fontSize: 15,
    },

    input: {
        borderColor:'white', flex:1, marginTop:10, marginBottom:10, borderRadius:17, marginLeft:10,backgroundColor:'#0005'
    },

    sectionList: {
        flex:1, backgroundColor:'#0000'
    }
});

module.exports = LocationSearchView;