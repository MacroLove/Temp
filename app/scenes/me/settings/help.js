import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import * as Colors from "../../../constants/Colors";
import Feedback from './feedback';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class HelpPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "帮助与反馈",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
            <ScrollView style={styles.container}>
                <View>
                    <Text style={styles.tipTitle}>
                        猜你可能有如下问题
                    </Text>
                    <ListRow title={'如何修改屏幕参数'} titleStyle={styles.cellTitle} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                    <ListRow title={'如何删除LED屏'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />

                    <ListRow title={'广告发送不成功怎么办'} titleStyle={styles.cellTitle} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                    <ListRow title={'如何设置Wi-Fi'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                    <Text style={styles.tipTitle}>
                        不是以上问题，请求助人工客服
                    </Text>
                    <ListRow title={'客服1'} titleStyle={[styles.cellTitle, {marginLeft:6}]} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             icon={<Image source={require('../../../assets/me/ic_kefu.png')}/>}
                             onPress={()=>{

                             }}
                    />
                    <Text style={styles.tipTitle}>
                        如果您有建议或意见，请告知我们
                    </Text>
                    <ListRow title={'意见反馈'} titleStyle={[styles.cellTitle, {marginLeft:6}]} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             icon={<Image source={require('../../../assets/me/ic_feedback.png')}/>}
                             onPress={()=>{
                                this.navigator.push({view: <Feedback userInfo={this.props.userInfo}/>});
                             }}
                    />
                </View>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    tipTitle: {
        color:'#aaa', fontSize:13, marginTop:10,marginLeft:14,marginBottom:4,
    },
    cellTitle: {
        color:'#555'
    },
});

module.exports = HelpPage;
