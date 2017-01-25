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
        this.state = {
            value: this.props.value,
            showIcon: this.props.showIcon,
            backgroundColor: this.props.backgroundColor,
            height: 0,
            iconColor: this.props.iconColor,
            iconName: this.props.iconName,
        };
        this._onLayout = this._onLayout.bind(this);
    }


    static propTypes = {

        ...TextInput.propTypes, // 包含默认的View的属性
        showIcon: PropTypes.bool,
        iconName: PropTypes.string.isRequired,
        iconSize: PropTypes.number.isRequired,
        iconColor: PropTypes.string,
        validate: PropTypes.bool,
        reg: PropTypes.object,


    }

    static defaultProps = {
        secureTextEntry: false,
        showIcon: false,
        placeholderTextColor: constants.UIInActiveColor,
        iconColor: 'green',
        iconSize: constants.IconSize,
        iconName: 'md-checkmark-circle'

    }

    componentWillReceiveProps(newProps) {
        let backgroundColor = newProps.backgroundColor
        if (newProps.hasOwnProperty('backgroundColor') && backgroundColor !== this.state.backgroundColor) {
            this.setState({
                backgroundColor: backgroundColor,
            });
        }

        const newValue = newProps.value;
        if (newProps.hasOwnProperty('value') && newValue !== this.state.value) {
            this.setState({
                value: newValue,
                backgroundColor: this.props.backgroundColor
            });


            if (newValue == '') {
                this.setState({

                    showIcon: false,
                });
            } else if (this.props.reg.test(newValue)) {
                this.props.validate = true
                this.setState({
                    iconColor: 'green',
                    iconName: 'md-checkmark-circle',
                    showIcon: true,
                });
            } else {
                this.props.validate = false
                this.setState({
                    iconColor: 'red',
                    iconName: 'ios-close-circle',
                    showIcon: true,
                });
            }
        }
    }

    _onLayout(event) {
        this.setState({height: event.nativeEvent.layout.height})

    }

    render() {
        console.log(`this.props.style:`, this.props.style)
        return (
            <View style={this.props.style} onLayout={this._onLayout}>
                <View  style={[{backgroundColor:this.state.backgroundColor},
                    {flex:1,paddingLeft:0,paddingRight:0,margin:0},]}>
                    <TextInput
                        style={[{flex:1,paddingLeft:0,paddingRight:0,margin:0},]}
                        ref="input"
                        clearButtonMode={this.props.clearButtonMode}
                        placeholder={this.props.placeholder}
                        maxLength={this.props.maxLength}
                        keyboardType={this.props.keyboardType}
                        underlineColorAndroid={this.props.underlineColorAndroid}
                        editable={this.props.editable}
                        value={this.props.value}
                        onChangeText={this.props.onChangeText}/>
                    {this.state.showIcon ?
                        <View style={[styles.icon,{height:this.state.height,width:40,}]}>
                            <Icon
                                name={this.state.iconName}  // 图标
                                size={this.props.iconSize}
                                color={this.state.iconColor}
                            />
                        </View> : null}
                </View>
            </View>

        );
    }
}

var styles = StyleSheet.create({
    groupView: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',


    },
    icon: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        right: 0,
        backgroundColor: 'transparent',
    },


});