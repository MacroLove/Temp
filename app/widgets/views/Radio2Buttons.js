import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";

import {
    Button
} from 'teaset';


let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

class Radio2Buttons extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectIndex: 0,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            selectIndex: props.selectIndex,
        });
    }

    _onSelect = (i) => {
        this.setState({selectIndex:i});
        this.props.onSelect && this.props.onSelect(i);
    }

    render() {
        return (
            <View style={{width:ScreenWidth, height:44, flexDirection:'row', alignItems:'center',borderTopWidth:0.6, borderColor:'#eee'}}>
                <Button
                    title={this.props.titles[0]}
                    titleStyle={this.state.selectIndex == 0 ? styles.btnTitleSel : styles.btnTitleNor}
                    style={this.state.selectIndex == 0 ? styles.btnSel : styles.btnNor}
                    onPress={() => {
                        this._onSelect(0);
                    }}
                />
                <View style={styles.lineNor}/>
                <Button
                    title={this.props.titles[1]}
                    titleStyle={this.state.selectIndex == 1 ? styles.btnTitleSel : styles.btnTitleNor}
                    style={this.state.selectIndex == 1 ? styles.btnSel : styles.btnNor}
                    onPress={() => {
                        this._onSelect(1);
                    }}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    lineSel: {
        width:1,
        height:44,
        backgroundColor:'#0000'
    },
    lineNor: {
        width:1,
        height:44,
        backgroundColor:'#eee'
    },
    btnNor: {
        flex: 1,
        borderRadius: 0,
        borderWidth:0.6,
        borderColor:'#0000'
    },
    btnSel: {
        flex: 1,
        borderRadius: 0,
        borderWidth:0.6,
        borderColor:'#1998e6'
    },
    btnTitleSel: {
        color:'#1998e6',
        fontSize: 16,
    },
    btnTitleNor: {
        color:'#666666',
        fontSize: 16,
    },

});

module.exports = Radio2Buttons;