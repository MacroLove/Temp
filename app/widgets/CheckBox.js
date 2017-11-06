import React, { Component } from 'react';
import Icon from  'react-native-vector-icons/Ionicons';

class CheckBox extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            checked: props.checked || false,
        };
    }

    componentWillReceiveProps(props) {
        this.setState({
            checked: props.checked,
        });
    }

    setChecked(checked) {
        this.setState({checked});
    }

    render() {
        let iconName = this.state.checked ? 'md-checkbox' : 'ios-checkbox-outline';
        let color = this.state.checked ? (this.props.checkedColor || this.props.color || '#000') : ('#ddd');

        return (
            <Icon.Button
                name={iconName}
                backgroundColor='rgba(0,0,0,0)'
                color={color}
                underlayColor='rgba(0,0,0,0)'
                size={this.props.size || 20}
                iconStyle={{marginLeft:0, marginRight: 0}}
                activeOpacity={1}
                borderRadius={0}
                onPress={()=>{
                    const checked = !this.state.checked;
                    this.setChecked(checked);
                    this.props.onCheckBoxPressed && this.props.onCheckBoxPressed(checked);
                }}
            >
                {
                    this.props.children ? this.props.children : null
                }
            </Icon.Button>
        );
    }
}

module.exports = CheckBox;