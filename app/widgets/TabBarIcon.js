import React, {PropTypes} from "react";
import {
    Text,
    StyleSheet,
    Image
} from "react-native";

const propTypes = {
    selected: PropTypes.bool,
    title: PropTypes.string,
};

const TabBarIcon = (props) => { //, {tintColor: props.tintColor}
    var ic = props.focused ? (props.iconActive) : (props.iconInactive);
    return (
    <Image
        source={ic}
        style={[styles.icon]}
        resizeMode={'stretch'}
    />
    );
};

const styles = StyleSheet.create({
    icon: {
        width: 24,
        height: 24,
    },
});

TabBarIcon.propTypes = propTypes;

export default TabBarIcon;
