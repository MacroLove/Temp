import React from 'react';
import {
    View, Text, TouchableOpacity, Image
} from "react-native";

// Props: title, tag, onPress
class WCheckBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked || false,
        }
    }

    _onPress = ()=>{
        let checked = !this.state.checked;
        this.setState({checked});
        this.props.onPress && this.props.onPress(this.props.tag, checked);
    }

    render() {
        var img = this.state.checked ? require('../assets/newads/cb_red_cheched.png') : require('../assets/newads/cb_red_uncheched.png');
        return (
            <TouchableOpacity onPress={()=>this._onPress()}>
                <View  style={{flexDirection:'row', alignItems:'center', alignSelf:"stretch", height:26}} >
                    <Image style={{width:15, height:15}} source={img}/>
                    <Text style={{fontSize:14, color:'#555', marginLeft:5}}>
                        {this.props.title+""}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }
}


module.exports = WCheckBox;