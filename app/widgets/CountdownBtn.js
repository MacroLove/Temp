import React from 'react';
import {
    Image,
    Text,
    View,
    StyleSheet,
    TextInput,
    TouchableHighlight,
    TouchableWithoutFeedback
} from 'react-native';
import {
    Button
} from 'teaset';

var TimerMixin = require('react-timer-mixin');

var CountDownButton = React.createClass({
    mixins: [TimerMixin],
    getInitialState: function () {
        return {
            time: this.props.time ? this.props.time : 60, //in seconds
            stop: false,
            disabled: false,
        };
    },

    componentDidMount(){
        this._onPress = this._onPress.bind(this);
    },

    componentWillUnmount(){
        this.clearTimeout();
        console.log('unm count down btn!');
    },

    render(){
        var styleBtn = this.state.disabled ? this.props.styleDisabled : this.props.style;
        var styleTxt = this.state.disabled ? this.props.titleStyleDisabled : this.props.titleStyle;
        var ttt = this.state.disabled ? (this.state.time+'') : this.props.title;
        return (<Button
            style={styleBtn}
            disabled={this.state.disabled}
            titleStyle={styleTxt}
            title={ttt}
            onPress={this._onPress} />);
    },

    stopAndReset(){
        this.state.stop = true;
        this.clearTimeout();
        this.setState({disabled: false, time: this.props.time ? this.props.time : 60}, function () {

        });
    },

    _onPress(){
        if (this.state.disabled) {
            //nothing
        } else {
            this.state.stop = false;
            this.setState({disabled: true});
            this._countdown();
            if(this.props.onPress){
                this.props.onPress();
            }
        }
    },

    _countdown(){
        var timer = function () {
            var time = this.state.time - 1;
            this.setState({time: time});
            if (time > 0 && this.state.stop == false) {
                this.setTimeout(timer, 1000);
            } else {
                this.setState({disabled: false, time: this.props.time ? this.props.time : 60});
            }
        };
        this.setTimeout(timer.bind(this), 1000);
    }
});

module.exports = CountDownButton;