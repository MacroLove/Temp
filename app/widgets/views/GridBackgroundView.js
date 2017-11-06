import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Image,
    TouchableOpacity,
} from "react-native";
import Icon from  'react-native-vector-icons/MaterialIcons';
import GridView from '../GridView';

let ScreenHeight = Dimensions.get('window').height;
let ScreenWidth = Dimensions.get('window').width;

/**
 *
 *  背景选择的Grid View
 *
 * **/
class GridBackgroundView extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            selectedPath: null,
        };
    }

    componentWillReceiveProps(props) {

    }

    _onClick = (data)=>{
        this.setState({selectedPath:data.path});
        this.props.onSelect && this.props.onSelect(data);
    };


    _renderItem = (data, i) => {
        return (<TouchableOpacity style={{flex: 1, height: ScreenWidth/3, margin: 1}} key={i} onPress={()=>this._onClick(data)}>
            <Image style={{flex:1}} resizeMode={'cover'} source={{uri:data.url}}/>
            <Icon name={this.state.selectedPath == data.path ? 'check-circle' : 'radio-button-unchecked'} color="#f75e53" size={18} style={{position:'absolute', right:10,bottom:10}}/>
        </TouchableOpacity>);
    };


    render() {
        return (
            <GridView {...this.props}
                style={{flex:1}}
                renderItem={this._renderItem}
                data={this.props.dataSource}
                itemsPerRow={this.props.itemsPerRow}
            />
        );
    }
}

module.exports = GridBackgroundView;