/**
 * Created by shiyunjie on 16/12/27.
 */
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
    NativeAppEventEmitter,
    TouchableOpacity,
    Platform,
    BackAndroid,
    AsyncStorage,
    Alert,
} from 'react-native';

import {getDeviceID,getToken} from '../lib/User'
import {hex_md5} from '../lib/md5'
import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import ValidateTextInput from '../components/validateTextInput'


class SetPassword extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: this.props.phone,
            password: '',
            confPwd: '',

        };
        this._newPassword = /^[a-zA-Z0-9]{6,}$/
        this._conformPassword = /^[a-zA-Z0-9]{6,}$/
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
        this.addAppEventListener(
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
        )
    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            Alert.alert('温馨提醒', '确定退出吗?', [
                {text: '确定', onPress: ()=>this.props.navigator.popToRoute(routes[1])},
                {text: '取消', onPress: ()=> {}},
            ])

            return true;
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <ValidateTextInput
                    ref={ component => this._input_new_password = component }
                    style={styles.textInput}
                    clearButtonMode="while-editing"
                    placeholder='请输入密码'
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable={true}
                    secureTextEntry={true}
                    value={this.state.password}
                    onChangeText={(text) => this.setState({password:text})}
                    reg={this._newPassword}/>

                <ValidateTextInput
                    ref={ component => this._input_conform_password = component }
                    style={styles.textInput}
                    clearButtonMode="while-editing"
                    placeholder='确认密码'
                    maxLength={20}
                    underlineColorAndroid='transparent'
                    editable={true}
                    secureTextEntry={true}
                    value={this.state.confPwd}
                    onChangeText={(text) => this.setState({confPwd:text})}
                    reg={this._conformPassword}/>
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
                                保存中...</Text>
                            </View>
                    }
                    onPress={ () => {
                        if(!this._input_new_password.validate){
                            this._input_new_password.setState({
                            backgroundColor:constants.UIInputErrorColor,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '密码格式错误'
                            })
                            return
                        }

                        if(!this._input_conform_password.validate||this.state.password!=this.state.confPwd){

                            this._input_conform_password.setState({
                            backgroundColor:constants.UIInputErrorColor,
                             iconColor: 'red',
                             iconName: 'ios-close-circle',
                             showIcon: true,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '两次密码不一致'
                            })
                            return
                        }

                        if(this._modalLoadingSpinnerOverLay){
                            this._modalLoadingSpinnerOverLay.show()
                        }
                        this._input_new_password.editable=false
                        this._input_conform_password=false

                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                        this._fetch_setPassword()

                        } }>
                    保存
                </Button>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
            </View>
        );
    }

    async _fetch_setPassword() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.SavePwd,
                    phone: this.state.phone,
                    pwd: hex_md5(this.state.password),
                    surePwd: hex_md5(this.state.confPwd),
                    deviceId: deviceID,
                    token: token,

                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetch_sendCode options:`, options)

            let resultData = await this.fetch(options)

            let result = await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result = JSON.parse(result)
            //console.log('gunZip:', result)
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if(!result){
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            if (result.code && result.code == 10) {
                /* Alert.alert('提示', '注册成功', () => {
                 this.props.navigator.popToTop()
                 })*/
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '保存成功'
                })

                setTimeout(()=>{
                    let routes = this.props.navigator.getCurrentRoutes();
                    this.props.navigator.popToRoute(routes[routes.length - 3])
                },1000)


            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
            }


        }
        catch (error) {
            //console.log(error)
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }


        }
        finally {
            this._button_2.setState({
                loading: false,
                //disabled: false
            })
            this._input_new_password.editable=true
            this._input_conform_password=true
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
        }
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


import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => Alert.alert('温馨提醒','确定退出吗?',[
             {text:'取消',onPress:()=>{}},
             {text:'确定',onPress:()=>this.props.navigator.popToRoute(routes[1])}
             ])}
                style={navigatorStyle.navBarLeftButton}>
                <View style={navigatorStyle.navBarLeftButtonAndroid}>
                    <Icon
                        style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText,{fontSize: 20,}]}
                        name={'ios-arrow-back'}
                        size={constants.IconSize}
                        color={'white'}/>
                </View>
            </TouchableOpacity>

        );
    },
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
//                onPress={() => Alert.alert('温馨提醒','确定退出吗?',[
//             {text:'取消',onPress:()=>{}},
//             {text:'确定',onPress:()=>this.props.navigator.popToRoute(routes[1])}
//             ])}
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

export default AppEventListenerEnhance(XhrEnhance(SetPassword))

const styles = StyleSheet.create({
    container: {
        paddingTop: Platform.OS == 'ios' ? 64 + 10 : 56 + 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
    textInput: {
        backgroundColor: 'white',
        height: 40,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIBackgroundColor,
        paddingLeft: 10,
        paddingRight: 10,

    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30,

    },
});