/**
 * by ZTB
 * @flow
 */

import React, {Component} from 'react';
import {Alert, Animated, Dimensions, Easing, Vibration, View} from 'react-native';
import Camera from 'react-native-camera';

export default class ScanQRView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            scanTranslte: new Animated.Value(0)
        }
    }

    componentDidMount() {

        this.scanLineAnimation();
    }

    scanLineAnimation() {
        Animated.sequence([
            Animated.timing(this.state.scanTranslte, {toValue: 200, duration: 3000, easing: Easing.linear}),
            Animated.timing(this.state.scanTranslte, {toValue: 0, duration: 3000, easing: Easing.linear})
        ]).start(() => this.scanLineAnimation());
    }

    componentWillUnmout() {
        this.camera && this.camera.shouldQR();
    }

    onBarCodeRead(result) {
        if (this.props.onBarCodeRead) {
            this.props.onBarCodeRead(result, () => {
                this.camera.shouldQR();
            });
        }
        else
            Alert.alert("扫描结果", result.data, [{
                text   : "ok",
                onPress: () => this.camera && this.camera.shouldQR()
            }], {cancelable: false});

    }

    render() {
        let width = Dimensions.get('window').width;
        let height = Dimensions.get('window').height;
        let scanCoverColor = '#44444488';
        let scanRectWidth = 200;

        return (
            <View style={{flex: 1}}>
                <Camera
                    style={{width: width, height: height}}
                    type={Camera.constants.Type.back}
                    ref={(cam) => {
                        this.camera = cam;
                    }}
                    onBarCodeRead={this.onBarCodeRead.bind(this)}
                />
                <View
                    style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0}}
                >
                    <View style={{width: width, height: scanRectWidth / 2, backgroundColor: scanCoverColor}}/>
                    <View style={{width: width, height: scanRectWidth, flexDirection: 'row'}}>
                        <View style={{flex: 1, backgroundColor: scanCoverColor}}/>
                        <View style={{width: scanRectWidth, borderColor:'#3BF93E', borderWidth:1}}>
                            <Animated.View style={{
                                width: scanRectWidth, height: 2, backgroundColor: "#3bf93e", transform: [
                                    {translateY: this.state.scanTranslte}
                                ]
                            }}/>
                        </View>
                        <View style={{flex: 1, backgroundColor: scanCoverColor}}/>

                    </View>
                    <View style={{flex: 1, width: width, backgroundColor: scanCoverColor}}>
                        {this.props.children}
                    </View>
                </View>
            </View>
        );
    }
}