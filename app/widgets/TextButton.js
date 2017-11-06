import React, { Component } from 'react';
import {
    TouchableOpacity,
    Image,
    Text,
    View
} from 'react-native';

class TextButton extends TouchableOpacity {
    constructor(props) {
        super(props);


    }

    render(){
        let {bgImage, //背景
            bgImageStyle,
            title,  //title
            titleStyle,
            textPosition, //title位置：down，middle
            tag, // tag
            onPress,
            style, ...others} = this.props;

        let children = [];
        if (bgImage) {
            if (textPosition == 'down') {
                children.push(
                    <Image
                        source={bgImage}
                        resizeMode="contain"
                        style={[{flex:1}, bgImageStyle]}
                    >
                    </Image>
                );
                children.push(
                    <Text
                        style={[{flex:1,textAlign:'center', textAlignVertical:'center', backgroundColor:'#0000'}, titleStyle]}
                    >
                        {""+title}
                    </Text>
                );
            }else {
                children.push(
                    <Image
                        source={bgImage}
                        resizeMode="contain"
                        style={[{flex: 1}, bgImageStyle]}
                    >
                        <Text
                            style={[{
                                flex: 1,
                                textAlign: 'center',
                                textAlignVertical: 'center',
                                backgroundColor: '#0000'
                            }, titleStyle]}
                        >
                            {"" + title}
                        </Text>
                    </Image>
                );
            }
        }else{ // No background
            children.push(
                <View style={{alignItems:'center', justifyContent:'center', flex:1}}>
                    <Text
                        style={[{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            backgroundColor: '#0000'
                        }, titleStyle]}
                    >
                        {"" + title}
                    </Text>
                </View>
            );
        }
        let ss = {alignItems:'center', justifyContent:'center'};
        if (this.props.width)
            ss.width = this.props.width;
        if (this.props.height)
            ss.height = this.props.height;
        style = [ss].concat(style);
        let onPress2 = ()=>{
            onPress({"tag":tag});
        };
        this.props = {children, style, onPress:onPress2, ...others};
        return super.render()
    }
}

module.exports = TextButton;