import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TextInput,
    ScrollView,
    Animated
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
import DataCenter from "../../../models/DataCenter";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;
let array_ = require('lodash/array');

/***
 * 这个是［分组管理］alert view。
 *
 ***/

var hAll = 260, hHead = 44, hTail = 60;
export default class PopEditAdsGroup extends Overlay.PopView {
    constructor(props) {
        super(props);
        Object.assign(this.state, {
           curEditIndex : -1,
           isNewingGroup: false,
            strEdittingName: "",
            strNewGroupName: "",
        });
    }

    renderContent() {
        let {containerStyle, children} = this.props;
        let thiz = this;
        return (
            <Animated.View style={containerStyle} pointerEvents='box-none' onLayout={(e) => this.onLayout(e)}>

                <View style={{backgroundColor: '#fff', width: ScreenWidth-40, height: hAll, borderRadius:5}}>
                    <View style={{
                        height           : hHead,
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
                        }}>{"分组管理"}</Text>
                        <Text style={{
                            color      : '#666',
                            fontSize   : 15,
                            textAlign  : 'center',
                            width: 50
                        }} onPress={()=>{
                            this.close();
                        }}>{"完成"}</Text>
                    </View>

                    <ScrollView style={{flex:1}}>
                        {
                            this.props.groupDatas && this.props.groupDatas.map(function (o, i) {
                                if (i == thiz.state.curEditIndex) {
                                    return thiz.makeEditingItem(o, i);
                                }else{
                                    return thiz.makeNotEditingItem(o, i);
                                }
                            })
                        }
                    </ScrollView>

                    <View style={{height:hTail, alignItems:'center', justifyContent:'center', flexDirection:'row', borderTopWidth:1, borderColor:'#eee'}}>
                        {
                            this.state.isNewingGroup ?
                                <View style={{flex:1, alignItems:'center', flexDirection:'row', paddingLeft:10, paddingRight:10}}>
                                    <Input
                                        style={{flex:1}}
                                        placeholder="请输入分组名称"
                                        onChangeText={(t)=>this.state.strNewGroupName = t}
                                    />
                                    <ImageButton image={require('../../../assets/newads/group/btn_new.png')} style={{marginLeft:5}}
                                                onPress={()=>{
                                                    this._onClickNewGroup();
                                                }}
                                    />
                                    <ImageButton image={require('../../../assets/newads/group/btn_cancel.png')} style={{marginLeft:5}}
                                                 onPress={()=>{
                                                     this.setState({isNewingGroup:false});
                                                 }}
                                    />
                                </View>
                                :
                                <ImageButton
                                    image={require('../../../assets/newads/group/btn_new_group.png')}
                                    onPress={()=>{
                                        this.setState({strNewGroupName:"", isNewingGroup:true});
                                    }}
                                />
                        }
                    </View>
                </View>
            </Animated.View>
        );
    }

     makeEditingItem = (data, i) => {
        return (
            <ListRow bottomSeparator='full' icon={<ImageButton image={require('../../../assets/newads/group/btn_del.png')} onPress={()=>{
                this._onClickDelGroup(data);
            }}/>}
                     title={<Input style={{flex:1, marginLeft:4}} defaultValue={""+data.title} onChangeText={(t)=>{this.state.strEdittingName = t}}/>}
                     accessory={<View style={{flexDirection:'row', alignItems:'center'}}>
                         <ImageButton style={{marginLeft:4}} image={require('../../../assets/newads/group/btn_ok.png')} onPress={()=>{this._onClickRename(data)}}/>
                         <ImageButton style={{marginLeft:4}} image={require('../../../assets/newads/group/btn_cancel.png')} onPress={()=>{this.setState({strEdittingName:"", curEditIndex:-1})}}/>
                     </View>}
            />
        );
    }

    makeNotEditingItem = (data, i) => {
        return (
            <ListRow bottomSeparator='full'
                     title={""+data.title+"("+data.gcount+")"}
                     accessory={<ImageButton image={require('../../../assets/newads/group/btn_edit.png')}
                                             onPress={()=>{this.setState({strEdittingName:data.title, curEditIndex:i})}}/>}
            />
        );
    }

    _onClickDelGroup = (data) => {
        if (data.gcount > 0) {
            PopAlert.showAlertView("错误", "广告组还存在广告，不能删除！");
        }else{
            PopAlert.showLoadingView();
            let p = {token:this.props.token, id:data.id};
            HttpApi.deleteGroup(p, (resp, error) => {
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    Toast.success("删除成功");
                    array_.remove(this.props.groupDatas, function (o) {
                        return o.id == data.id;
                    });
                    array_.remove(DataCenter.adGroups, function (o) {
                        return o.id == data.id;
                    });
                    this.forceUpdate();
                    this.props.onGroupChanged && this.props.onGroupChanged();
                }
            });
        }
    }

    _onClickRename = (data) => {
        if (this.state.strEdittingName.length == 0) {
            Toast.info("请输入分组名称");
        }else{
            let p = {token:this.props.token, id:data.id, title:this.state.strEdittingName};
            PopAlert.showLoadingView();
            HttpApi.createOrModifyGroup(p, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    Toast.success("修改成功");
                    data.title = this.state.strEdittingName;
                    DataCenter.adGroups.forEach(function (i, o) {
                        if (o.id == data.id){
                            o.title = data.title;
                        }
                    });
                    this.forceUpdate();
                    this.props.onGroupChanged && this.props.onGroupChanged();
                }
            });
        }
    }

    _onClickNewGroup = ()=>{
        if (this.state.strNewGroupName.length == 0) {
            Toast.info("请输入分组名称");
        }else{
            let p = {token:this.props.token, title:this.state.strNewGroupName};
            PopAlert.showLoadingView();
            HttpApi.createOrModifyGroup(p, (resp, error)=>{
                PopAlert.stopLoadingView();
                if (error) {
                    PopAlert.showAlertView("错误", error+"");
                }else{
                    Toast.success("创建成功");
                    resp.data = [];
                    this.props.groupDatas.push(resp);
                    DataCenter.adGroups.push(resp);
                    this.forceUpdate();
                    this.props.onGroupChanged && this.props.onGroupChanged();
                }
            });
        }
    }

    static show = (token, groupDatas, onGroupChanged) => {
        var overlayView = (
            <PopEditAdsGroup
                style={{alignItems: 'center', justifyContent:'center'}}
                type={'zoomOut'}
                modal={true}
                token={token}
                groupDatas={groupDatas}
                onGroupChanged={onGroupChanged}
            />
        );

        Overlay.show(overlayView);

    };
};


























