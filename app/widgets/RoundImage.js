import React, {Component, PropTypes} from 'react';
import {Image, StyleSheet, View,} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

let DEFAULT_WIDTH = 48;
let DEFAULT_HEIGHT = 48;
let DEFAULT_RADIUS = 24;
let DEFAULT_IMG_BG_COLOR = '#FFF';

// This is used for image with placeholder.
class RoundImage extends Component {
    static propTypes = {
        source      : PropTypes.string.isRequired,
        width       : PropTypes.number,
        height      : PropTypes.number,
        borderRadius: PropTypes.number,
        imgBgColor  : PropTypes.string,
    };

    static get defaultProps() {
        return {
            source      : null,
            width       : DEFAULT_WIDTH,
            height      : DEFAULT_HEIGHT,
            borderRadius: DEFAULT_RADIUS,
            imgBgColor  : DEFAULT_IMG_BG_COLOR,
        }
    };

    constructor(props) {
        super(props);
        this.state = {
            showPlaceholder: true,
        };
        var sv = StyleSheet.flatten(props.style);
        this.width = sv.width;
        this.height = sv.height;
        this.borderRadius = sv.borderRadius;
        this.source = props.source;
        this.iconSize = this.width / 2;
        this.imgBgColor = sv.backgroundColor;
    }

    render() {
        this.source = this.props.source;
        var imgR = 0.7 * this.width - 4;
        var showDefault = this.props.placeholder && !this.props.source;
        return (

            <View style={[styles.cellImageContainer, this.props.style]}>
                {
                    this.props.placeholder && this.state.showPlaceholder ?
                        <Image
                            style={[styles.cellImage, {width: this.width, height: this.height, borderRadius:this.borderRadius, backgroundColor: '#0000'}]}
                            resizeMode={this.props.resizeMode || 'cover'}
                            source={this.props.placeholder}
                        />
                        :
                        <Icon
                            name={"help"}
                            size={this.iconSize}
                            color={"white"}
                        />
                }
                {
                    this.props.source ?
                        <Image
                            style={[styles.cellImage, {width: this.width, height: this.height, borderRadius:this.borderRadius, backgroundColor: '#0000'}]}
                            resizeMode={this.props.resizeMode || 'cover'}
                            source={{uri: this.props.source}}
                            onLoad={(e) => {
                                if (this.state.showPlaceholder) {
                                    this.setState({showPlaceholder:false});
                                }
                            }}
                        />
                        : null
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    cellImageContainer: {
        backgroundColor: '#0000',
        width          : DEFAULT_WIDTH,
        height         : DEFAULT_HEIGHT,
        borderRadius   : DEFAULT_WIDTH / 2,
        overflow       : 'hidden',
        alignItems     : 'center',
        justifyContent : 'center',
    },
    cellImage         : {
        backgroundColor: '#000',
        width          : DEFAULT_WIDTH - 25,
        height         : DEFAULT_WIDTH - 25,
        overflow       : 'hidden',
        position       : 'absolute',
    },
});

module.exports = RoundImage;
