/**
 * Created by shiyunjie on 16/12/6.
 */
import React, {
    PropTypes,
    Component } from 'react';
import {
    StyleSheet,
    Text,
    TextInput,
    View,
    PixelRatio,
    TouchableOpacity,


} from 'react-native';
//import Icon from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';

export default class InputView extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {};
    }


    static propTypes = {

        ...View.propTypes, // 包含默认的View的属性
        iconName: PropTypes.string.isRequired,
        iconSize: PropTypes.number.isRequired,
        iconColor: PropTypes.string,
        placeholder: PropTypes.string,
        placeholderTextColor: PropTypes.string,
        radius: PropTypes.number,
        maxLength: PropTypes.number,
        secureTextEntry: PropTypes.bool,
        onChangeText: PropTypes.func,

    }

    static defaultProps = {

        radius: 30,
        secureTextEntry: false,
        placeholderTextColor: constants.UIInActiveColor,
        iconColor: constants.UIActiveColor,
    }


    render() {
        return (
            <View style={[styles.groupView,{borderRadius: this.props.radius,}]}>
                <View style={styles.icon}>
                    <Icon
                        name={this.props.iconName}  // 图标
                        size={this.props.iconSize}
                        color={this.props.iconColor}
                    />
                </View>
                <TextInput
                    style={styles.textInput}
                    clearButtonMode="while-editing"
                    placeholder={this.props.placeholder}
                    maxLength={this.props.maxLength}
                    onChangeText={this.props.onChangeText}
                    underlineColorAndroid='transparent'
                />
                <View style={styles.view}/>


            </View>

        );
    }
}

var styles = StyleSheet.create({
    groupView: {
        flex:1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#FFFFFF',
        marginBottom:15,


    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textInput: {
        flex: 6,
        color: constants.UIActiveColor,
    },
    view: {
        flex: 1,



    },

});