import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, ListRow, NavigationPage} from "teaset";
import Icon from "react-native-vector-icons/Entypo";
import * as Colors from "../../../constants/Colors";
import RoundImage from '../../../widgets/RoundImage';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class AccountManager extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title         : "账号管理",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {};
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
                        当前账号
                    </Text>
                    <ListRow title={this.props.userInfo.nickname || this.props.userInfo.username} titleStyle={[styles.cellTitle, {marginLeft:6}]} accessory={<Icon name="check" color={Colors.COLOR_NAV_BG} size={26}/>}
                             icon={<RoundImage
                                 style={{width:42, height:42, borderRadius:21}}
                                 placeholder={require('../../../assets/default_user.png')}
                                 source={this.props.userInfo.head_portrait+""}
                             />}
                             onPress={()=>{
                             }}
                    />
                    <Text style={styles.tipTitle}>
                        换个账号登录
                    </Text>
                    {
                        this._getOtherAcc()
                    }
                </View>

            </ScrollView>
        );
    }

    _getOtherAcc = () => {
        var vv = [];
        vv.push(<ListRow title={'123546846'} titleStyle={[styles.cellTitle, {marginLeft:6}]}
                         accessory={<Button title="登录"
                            underlayColor="#0000"
                            style={{width:66, height:32, backgroundColor:Colors.COLOR_BUTTON_CYON, borderColor:'white'}}
                            titleStyle={{color:'white'}}
                            onPress={()=>{

                            }}/>}
                         icon={<Icon name="user" color='gray' size={26}/>}
        />);
        return vv;
    }
}

const styles = StyleSheet.create({
    container: {
        flex           : 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    tipTitle : {
        color: '#aaa', fontSize: 13, marginTop: 10, marginLeft: 14, marginBottom: 4,
    },
    cellTitle: {
        color: '#555'
    },
});

module.exports = AccountManager;
