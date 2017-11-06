import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image,
    TouchableOpacity, WebView, Keyboard
} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage, Toast, Input} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import {Actions} from "react-native-router-flux";
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import PTRListView, {RefreshState} from '../../../widgets/PTRListView';
import RoundImage from '../../../widgets/RoundImage';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;


/**
 * List cell item.
 * */
class MyListItem extends React.PureComponent {
    _onPress = () => {
        this.props.onPress && this.props.onPress(this.props.item);
    };

    render() {
        return (
            <TouchableOpacity style={{backgroundColor:'#fff', borderColor:'#eee', borderBottomWidth:0.6, paddingLeft:10}} onPress={this._onPress()}>
                <View style={{flex:1, flexDirection:'row', padding:8}}>
                    <RoundImage
                        style={{width:48, height:48, borderRadius:24}}
                        resizeMode="contain"
                        source={this.props.item.head_portrait+""}
                    />
                    <View style={{flex:1, justifyContent:'space-between', marginLeft:8}}>
                        <Text style={{color:'#688', fontSize:14, fontWeight:'bold'}} numberOfLines={1}>{this.props.item.title+""}</Text>
                        <Text style={{color:'#000', fontSize:13}}>{this.props.item.content+""}</Text>
                        <Text style={{color:'#999', fontSize:10}}>{this.props.item.time+""}</Text>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }
}

export default class Comment extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "评论详情",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            refreshState: RefreshState.Idle,
            data: [
                {
                    id:1,
                    content:'快乐放大快乐没法看了放得开立马付款啦免费卡浪费马卡罗夫吗发蒙地卡罗份马卡罗夫马力32fdafa',
                    time:'323',
                    head_portrait:'https://www.baidu.com/img/bd_logo1.png',
                    nickname:'32323'
                }
            ],

            inputComment:'',
            canSend:false,
        };
    }

    componentDidMount() {
        this.onHeaderRefresh();
    }

    componentWillUnmount() {

    }

    renderNavigationLeftView() {
        return (
            <NavigationBar.BackButton
                title={""}
                onPress={() => Actions.pop()}
            />
        );
    }

    renderPage() {
        return (
            <View style={{flex: 1}}>
                <PTRListView
                    style={{flex: 1}}
                    data={this.state.data}
                    extraData={this.state}
                    keyExtractor={this._keyExtractor}
                    renderItem={this._renderItem}
                    refreshState={this.state.refreshState}
                    onHeaderRefresh={this.onHeaderRefresh}
                    onFooterRefresh={this.onFooterRefresh}
                />
                <View style={{flexDirection:'row', width:ScreenWidth, height:44, backgroundColor:'#fff', alignItems:'center',
                    borderTopWidth:0.7, borderColor:'#eee'}}>
                    <Input style={{flex:1, margin:5}} placeholder="写一点什么..." value={this.state.inputComment}
                        onChangeText={(t)=>{
                            let c = t.trim().length > 0;
                            this.setState({inputComment:t, canSend:c});
                        }}
                    />
                    <Button
                        title="发送"
                        onPress={()=>{this._onClickSend()}}
                    />
                </View>
            </View>
        );
    }

    _keyExtractor = (item, index) => item.id;


    onHeaderRefresh = () => {
        this.setState({refreshState: RefreshState.HeaderRefreshing})
        this.loadData(1);
    }

    onFooterRefresh = () => {
        this.setState({refreshState: RefreshState.FooterRefreshing})
        this.loadData(this.state.page+1);
    }

    loadData = (page) => {
        var thiz = this;
        HttpApi.getArticleComments({token:this.props.userInfo.token, p:page, type:1}, (resp, error)=>{
            let refreshState = resp && resp.length == 0 ? RefreshState.NoMoreData : RefreshState.Idle;
            if (error) {
                //PopAlert.showAlertView("错误", error+"");
            }else{
                if (resp && resp.length > 0) {
                    if (page <= 1) {
                        thiz.state.data = resp;
                    }else{
                        thiz.state.data = thiz.state.data.concat(resp);
                    }
                }
            }
            thiz.setState({
                page:page,
                refreshState
            });
        });
    }

    _keyExtractor = (item, index) => item.id;

    _renderItem = ({item}) => (
        <MyListItem
            item={item}
            onPress={this._onPressItem}
        />
    );

    _onPressItem = (data)=>{

    }

    _onClickSend = ()=>{
        Keyboard.dismiss();
        PopAlert.showLoadingView();
        HttpApi.comment({token:this.props.userInfo.token, id:this.props.articleId, content:this.state.inputComment}, (resp, error)=>{
            PopAlert.stopLoadingView();
            if(error) {
                Toast.fail("发送失败");
            }else{
                Toast.success("发送成功");
            }
        });
    }
}

const styles = StyleSheet.create({

});