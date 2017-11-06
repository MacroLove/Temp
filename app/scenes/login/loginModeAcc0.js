import React from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from "react-native";
import { Navigator } from 'react-native-deprecated-custom-components';
import PropTypes from 'prop-types';
import {
    Button,
    NavigationPage,
} from 'teaset';

import * as Apis from '../../actions/apis';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';


import * as Colors from '../../constants/Colors';

import LoginModeAcc from './loginModeAcc';
import Register from './register';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    }
});

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth =  Dimensions.get('window').width;
let BgImgHeight = ScreenWidth * 957 / 720;

class LoginModeAcc0 extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "",
        //scene: Navigator.SceneConfigs.FloatFromBottom,
        showBackButton: false,
    };
    constructor(props) {
        super(props);
    }

    componentDidMount(){

    }

    componentWillMount(){

    }

    componentWillUnmount(){

    }

    renderNavigationBar(){
        return null;
    }

    renderPage() {
        return (
            <View style={styles.container}>
                <Image
                    style={{width:ScreenWidth, height:BgImgHeight}}
                    source={require('../../assets/login_bg.png')}
                    resizeMode="stretch"
                />
                <View style={{flexDirection:'row', flex: 1, alignItems:'center', justifyContent:'center'}}>

                    <Button
                        title={'注册'}
                        onPress={()=>{
                            this.navigator.push({view: <Register />});
                        }}
                        style={{backgroundColor: Colors.COLOR_NAV_BG, borderColor: '#0000', width:100, height:40}}
                        titleStyle={{color:'white'}}
                    />
                    <View style={{margin:20}}>
                    </View>
                    <Button
                        title={'登录'}
                        onPress={()=>{
                            this.navigator.push({view: <LoginModeAcc navigationBarInsets={false}/>});
                        }}
                        style={{backgroundColor: Colors.COLOR_NAV_BG, borderColor: '#0000', width:100, height:40}}
                        titleStyle={{color:'white'}}
                    />
                </View>
            </View>
        );
    }
}


function mapStateToProps(state, ownProps) {
    return {
        loginInfo: state.login,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(Apis, dispatch),
        dispatch: dispatch
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginModeAcc0);
