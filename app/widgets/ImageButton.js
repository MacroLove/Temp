import React, { Component } from 'react';
import {
    TouchableOpacity,
    Image
} from 'react-native';

class ImageButton extends TouchableOpacity {
    constructor(props) {
        super(props);

    }

    render(){
        let {image, children, ...others} = this.props;
        if (!children)
            children = <Image
                source={image}
                resizeMode='contain'
                style={{flex:1, alignSelf:'center'}}
            />;

        this.props = {children, ...others};
        return super.render()
    }
}

module.exports = ImageButton;