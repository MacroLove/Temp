import React from "react";
import {View, Text, StyleSheet, Dimensions, KeyboardAvoidingView, ScrollView, TextInput, Image} from "react-native";
import {Button, TeaNavigator, NavigationBar, Label, ListRow, NavigationPage} from "teaset";
import Icon from "react-native-vector-icons/EvilIcons";
import * as Colors from "../../../constants/Colors";

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class AboutPage extends NavigationPage {

    static defaultProps = {
        ...NavigationPage.defaultProps,
        title: "关于",
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
            <View style={styles.container}>
                <View>
                    <ListRow title={'检测更新'} titleStyle={styles.cellTitle} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                    <ListRow title={'版本说明'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />

                    <ListRow title={'去评分'} titleStyle={styles.cellTitle} style={[{marginTop:4}]} accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                    <ListRow title={'自动下载LED'} titleStyle={styles.cellTitle}  accessory={<Icon name="chevron-right" color="#888" size={40}/>}
                             onPress={()=>{

                             }}
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, justifyContent:'space-between',
        backgroundColor: Colors.COLOR_VIEW_BG,
    },
    cellTitle: {
        color:'#555'
    },
});

module.exports = AboutPage;
