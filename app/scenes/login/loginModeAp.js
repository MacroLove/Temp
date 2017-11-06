import React from 'react';
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput} from "react-native";
import {Navigator} from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {
    Button,
    Input,
    NavigationPage,
    NavigationBar,
    Label,
    ListRow,
} from 'teaset';
import Icon from 'react-native-vector-icons/Ionicons';

import * as Colors from '../../constants/Colors';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class LoginModeAp extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "连接设备",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            ssid: '',
            psw: '',
        };
    }

    componentDidMount() {

    }

    componentWillUnmount() {

    }

    renderPage() {
        return (
            <KeyboardAvoidingView style={{flex:1}}>
                <ScrollView style={styles.container}>
                    <View style={{width:ScreenWidth, alignItems:'center'}}>
                        <View style={[styles.cellContainer, {marginTop:30}]}>
                            <Text
                                style={{backgroundColor:'#0000', color:'#333', fontSize:14, paddingRight:4,}}>
                                {'WiFi名称：'}
                            </Text>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md'
                                value={this.state.ssid}
                                placeholder='请输入WiFi名称'
                                onChangeText={text => this.setState({ssid: text})}
                            />
                        </View>
                        <View style={[styles.cellContainer, {marginTop:10}]}>
                            <Text
                                style={{backgroundColor:'#0000', color:'#333', fontSize:14, paddingRight:4,}}>
                                {'WiFi密码：'}
                            </Text>
                            <Input
                                style={{flex:1, borderRadius:0, borderColor:'#0000', backgroundColor:'#0000'}}
                                size='md'
                                value={this.state.psw}
                                placeholder='请输入WiFi密码'
                                onChangeText={text => this.setState({psw: text})}
                            />
                        </View>


                        <Button
                            title={'连接'}
                            onPress={()=>{

                        }}
                            style={{backgroundColor: Colors.COLOR_NAV_BG, borderColor: '#0000',
                                marginTop: 40,
                                width:ScreenWidth-40, height:40}}
                            titleStyle={{color:'white'}}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellContainer: {
        flexDirection: 'row', height: 44, alignItems: 'center', backgroundColor:'white',padding:6,
    },
});

module.exports = LoginModeAp;
