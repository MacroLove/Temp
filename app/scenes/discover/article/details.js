import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image,
    TouchableOpacity, WebView
} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage, Toast} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import {Actions} from "react-native-router-flux";
import HttpApi from "../../../network/HttpApi";
import PopAlert from "../../../widgets/PopAlertView";
import Comment from './comments';
import {VIEW_ARTICLE_COMMENT} from "../../../constants/ViewKeys";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;


class Details extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "文章详情",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            details:{
                id:0,
                title:'ewew',
                show:1,
                upvote:99,
                comment:99,
                time:'2011-11-11',
                content:'<p>ewewe</p>',
            },
        };
    }

    renderNavigationLeftView() {
        return (
            <NavigationBar.BackButton
                title={""}
                onPress={() => Actions.pop()}
            />
        );
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        if (this.state.loading)
            return null;
        return (
            <View style={{flex: 1, backgroundColor:'#fff'}}>
                <Text style={{width:ScreenWidth, height:30, fontSize:20, color:'#333', textAlign:'center'}}>{this.state.details.title+""}</Text>
                <Text style={{width:ScreenWidth, height:20, fontSize:12, color:'#999', textAlign:'center'}}>{this.state.details.time+""}</Text>
                <View style={{width:ScreenWidth, height:1, backgroundColor:'#eaeaea'}}/>
                <WebView
                    style={{flex:1}}
                    source={{html:this.state.details.content}}
                />
                <View style={{width:ScreenWidth, height:44, alignItems:'center', justifyContent:'space-around', flexDirection:'row', borderTopWidth:0.7, borderColor:'#ddd', backgroundColor:'#fff'}}>
                    <TouchableOpacity style={{alignItems:'center', justifyContent:'space-between'}} onPress={()=>{
                        this._onClickVote()
                    }}>
                        <Icon name="like" size={22} color="#666"/>
                        <Text style={{color:"#666", fontSize:11}}>{"点赞 "+this.state.details.upvote}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:'center', justifyContent:'space-between'}} onPress={()=>this._onClickSave()}>
                        <Icon name="heart" size={22} color="#666"/>
                        <Text style={{color:"#666", fontSize:11}}>{"收藏"}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{alignItems:'center', justifyContent:'space-between'}} onPress={()=>this._onClickComment()}>
                        <Icon name="comment" size={22} color="#666"/>
                        <Text style={{color:"#666", fontSize:11}}>{"评论 "+this.state.details.upvote}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    _onClickVote = ()=>{
        HttpApi.upvote({token:this.props.userInfo.token, id:this.props.articleId}, (resp, error)=>{
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                this.state.details.upvote += 1;
                this.forceUpdate();
            }
        });
    };

    _onClickSave = ()=>{
        HttpApi.saveArticle({token:this.props.userInfo.token, id:this.props.articleId}, (resp, error)=>{
            if (error) {
                PopAlert.showAlertView("错误", error+"");
            }else{
                Toast.success("已收藏");
            }
        });
    }

    _onClickComment = ()=>{
        Actions[VIEW_ARTICLE_COMMENT]({userInfo:this.props.userInfo, articleId:this.props.articleId});
    }
}

const styles = StyleSheet.create({

});

module.exports = Details;