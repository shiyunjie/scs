/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
    TouchableOpacity,
    AsyncStorage,
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式


import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import ValidateTextInput from '../components/validateTextInput'


class ValidatePage extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            context: this.props.context,
            label: this.props.label,
            multiline:this.props.multiline,
        };

        this._Reg = this.props.reg

    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`orderPage willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (event && currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
    }

    render() {
        return (
            <View style={{flex:1}}>
                <View style={styles.container}>
                    <View style={[{flexDirection:'row',alignItems:'center'},
                    this.state.multiline?{height:200,justifyContent:'flex-start',}:{height:40}]}>
                        {/*this.state.multiline?null:
                            <View style={{backgroundColor:'white',height:40,justifyContent:'center',
                            alignItems:'center',paddingLeft:constants.MarginLeftRight}}>
                                <Text style={{fontSize:14,color:constants.LabelColor,}}>
                                    {this.state.label}</Text>
                            </View>*/
                        }
                    <ValidateTextInput
                        ref={ component => this._input_context = component }
                        style={[styles.textInput,{ paddingLeft:10,paddingRight:10,},
                        this.state.multiline?{height:150,justifyContent:'flex-start',}:{}]}
                        clearButtonMode="while-editing"
                        placeholder={this.state.label}
                        maxLength={this.state.multiline?300:20}
                        multiline={this.state.multiline?true:false}
                        underlineColorAndroid='transparent'
                        editable={true}

                        value={this.state.context}
                        onChangeText={(text) => this.setState({context:text})}
                        reg={this._Reg}/>
                    </View>
                    <Button
                        ref={ component => this._button_2 = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={[styles.button,{ marginLeft: constants.MarginLeftRight,
                        marginRight: constants.MarginLeftRight,
                        marginTop: 20,}]}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {
                                //this._renderActivityIndicator()
                                }
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>
                                {this.state.ButtonText}</Text>
                            </View>
                    }
                        onPress={ () => {

                        if(this.state.context!=this.props.context){

                            if(!this._input_context.validate&&!this.props.multiline){
                                this._input_context.setState({
                                backgroundColor:constants.UIInputErrorColor,
                                })

                                this._toast.show({
                                    position: Toast.constants.gravity.center,
                                    duration: 255,
                                    children: `${this.props.label}格式验证不正确`
                                })
                                return
                            }
                        }

                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                        this._input_context.editable=false

                         NativeAppEventEmitter.emit('validatepage_send_value', this.state.context,this.state.label)

                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })
                            this.props.navigator.pop()
                    }}>
                        完成
                    </Button>

                </View>

                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
            </View>
        );
    }

    _renderActivityIndicator() {
        return ActivityIndicator ? (
            <ActivityIndicator
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        ) : Platform.OS == 'android' ?
            (
                <ProgressBarAndroid
                    style={{margin: 10,}}
                    color={'#fff'}
                    styleAttr={'Small'}/>

            ) : (
            <ActivityIndicatorIOS
                style={{margin: 10,}}
                animating={true}
                color={'#fff'}
                size={'small'}/>
        )


    }

}

const styles = StyleSheet.create(
    {
        container: {
            marginTop: Platform.OS == 'ios' ? 64 + 10 : 56 + 10,
            flex: 1,
            flexDirection: 'column',
            alignItems: 'stretch',
            backgroundColor: constants.UIBackgroundColor,
        },
        textInput: {
            backgroundColor: 'white',
            flex:1,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: constants.UIBackgroundColor,

        },
        button: {
            height: 40,
            backgroundColor: constants.UIActiveColor,
            borderWidth: StyleSheet.hairlineWidth,
            borderColor: constants.UIActiveColor,
            justifyContent: 'center', borderRadius: 30
        }
    });

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
};

//const navigationBarRouteMapper = {
//
//    LeftButton: function (route, navigator, index, navState) {
//        if (index === 0) {
//            return null;
//        }
//
//        var previousRoute = navState.routeStack[index - 1];
//        return (
//            <TouchableOpacity
//                onPress={() => navigator.pop()}
//                style={navigatorStyle.navBarLeftButton}>
//                <View style={navigatorStyle.navBarLeftButtonAndroid}>
//                    <Icon
//                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
//                        name={'ios-arrow-back'}
//                        size={constants.IconSize}
//                        color={'white'}/>
//                </View>
//            </TouchableOpacity>
//
//        );
//    },
//
//    RightButton: function (route, navigator, index, navState) {
//
//    },
//
//    Title: function (route, navigator, index, navState) {
//        return (
//            Platform.OS == 'ios' ?
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    {route.title}
//                </Text>
//            </View>
//        )
//    },
//
//}


export default AppEventListenerEnhance(ValidatePage)