import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    KeyboardAvoidingView,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity
} from "react-native";
import {Button,
    NavigationPage,
    Toast
} from "teaset";
import * as Colors from "../../../constants/Colors";
import Icon from "react-native-vector-icons/Entypo";
import PopAlert from "../../../widgets/PopAlertView";
import HttpApi from "../../../network/HttpApi";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class FeedbackPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "意见反馈",
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            comment: "",
            picCount: 0,
            photos:[], // {path:, data:} , data is base64 image data for thumbnail; for ios see the docs.
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
            <ScrollView style={styles.container} contentContainerStyle={{justifyContent: 'space-around', flexDirection:'column'}}>

                <Text style={styles.tipTitle}>
                    问题和意见
                </Text>
                <View style={{backgroundColor:'#fff', flex:1, height: 200}}>
                    <TextInput style={{flex:1}}
                               multiline={true}
                               maxLength={100}
                               placeholder="请输入您的宝贵意见"
                               placeholderTextColor='#888'
                               underlineColorAndroid='#0000'
                               onChangeText={(comment)=>{
                                   this.setState({comment});
                               }}
                               text={this.state.comment}
                    />
                    <Text style={[styles.tipTitle, {alignSelf:'flex-end'}]}>{this.state.comment.length+'/100'}</Text>
                </View>

                <View style={{backgroundColor:'#fff', flex:1, height: 100, marginTop:30}}>
                    <View style={{flexDirection:'row', justifyContent:"space-between", marginLeft:10, marginTop:2, marginRight:10}}>
                        <Text style={[{color:'#333'}]}>请提供相关问题的照片或截图</Text>
                        <Text style={[{color:'#333'}]}>{this.state.picCount + '/4'}</Text>
                    </View>
                    <View style={{flexDirection:'row', justifyContent:'space-between', padding: 10}}>
                        {
                            this._makeImages()
                        }
                    </View>
                </View>

                <Button title="提交" style={{alignSelf:'center', backgroundColor:Colors.COLOR_NAV_BG, width:ScreenWidth-80, height:40, marginTop:50, marginBottom:50}}
                        titleStyle={{color:'white'}}
                        onPress={()=>{
                        this._onPressCommit()
                    }}/>

            </ScrollView>
        );
    }

    _makeImages = ()=>{
        var imgViews = [];
        this.state.photos.map((p, i)=>{
            imgViews.push(
                <View key = {''+i}>
                    <Image
                        style={styles.imageCell}
                        source={{ uri: 'data:image/jpeg;base64,' + p.data }}
                    />
                    <View style={{position:'absolute', left: 40, top: -15}}>
                        <Icon.Button name="circle-with-minus" color="#f00" size={20}
                                     underlayColor="#0000"
                                     backgroundColor="#0000"
                                     onPress={()=>{
                                        this._onPressDel(i);
                            }}/>
                    </View>
                </View>);
        });
        if (this.state.photos.length < 4) {
            imgViews.push(<TouchableOpacity onPress={this._onPressAddButton} key="99">
            <Image
                style={styles.imageCell}
                source={require('../../../assets/ic_add_photo.png')}
            />
            </TouchableOpacity>);
        }
        var left = 4 - this.state.picCount - 1;
        for (; left > 0; left--) {
            imgViews.push(<View
                key = {'e'+left}
                style={styles.imageCell}
            />);
        }
        return imgViews;
    }

    _onPressAddButton = ()=>{
        var ImagePicker = require('react-native-image-picker');
        var options = {
            title: '',
            quality: 0.5,
            mediaType: 'photo',
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: '拍摄',
            chooseFromLibraryButtonTitle:'从相册选择',
            maxWidth: 100,
            maxHeight: 100,
            noData: false,
        };
        ImagePicker.showImagePicker(options, (response) => {
            if (response.uri){
                this.state.photos.push({path:response.path, data:response.data});
                this.setState({
                    picCount:this.state.photos.length
                });
            }
        });
    }

    _onPressDel = (i) => {
        this.state.photos = this.state.photos.slice(0, i).concat(this.state.photos.slice(i+1, this.state.photos.length));
        var picCount = this.state.picCount - 1;
        if (picCount < 0) picCount = 0;
        this.setState({
           picCount
        });
    }

    _onPressCommit = ()=>{
        if (this.state.comment.trim() == 0 && this.state.picCount == 0) {
            PopAlert.showAlertView("提示", "请输入内容或者图片！");
        }else{
            PopAlert.showLoadingView();
            var images = this.state.photos.map(function (o) {
                return ("data:image/jpeg;base64,"+o);
            });
            var thiz = this;
            HttpApi.feedback({token:this.props.userInfo.token, content:this.state.comment, images:images}, (resp, error)=>{
               PopAlert.stopLoadingView();
               if (error) {
                   PopAlert.showAlertView("错误", error+"");
               }else{
                   Toast.success("反馈成功", "short", 'center', ()=>{
                       thiz.navigator.pop();
                   });
               }
            });
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellTitle: {
        color: '#555'
    },
    tipTitle: {
        color:'#aaa', fontSize:13, marginTop:10,marginLeft:14,marginBottom:4,marginRight:10,
    },
    imageCell: {
        width: 58,
        height: 58,

    }
});

module.exports = FeedbackPage;
