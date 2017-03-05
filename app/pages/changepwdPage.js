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
    TouchableOpacity,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
    AsyncStorage,
} from 'react-native';

import Button from 'react-native-smart-button';
import constants from  '../constants/constant';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
import LoginPage from './loginPage'
import {getDeviceID,getToken,getRealName} from '../lib/User'
import {hex_md5} from '../lib/md5'
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import ValidateTextInput from '../components/validateTextInput'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
//import { member_changePwd,errorXhrMock } from '../mock/xhr-mock'   //mock data

class SetPassword extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            oldPass: '',
            newPass: '',
            confPass: '',
        };
        this._oldPassword=/^[a-zA-Z0-9]{6,}$/
        this._newPassword=/^[a-zA-Z0-9]{6,}$/
        this._conformPassword=/^[a-zA-Z0-9]{6,}$/
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
            <View style={styles.container}>
                <ValidateTextInput
                    ref={ component => this._input_old_password = component }
                    style={styles.textInput}
                    placeholder='原密码'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    editable={true}
                    value={this.state.oldPass}
                    onChangeText={(text) => this.setState({oldPass:text})}
                    reg={this._oldPassword}/>


                <ValidateTextInput
                    ref={ component => this._input_new_password = component }
                    style={styles.textInput}
                    placeholder='新密码'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    editable={true}
                    value={this.state.newPass}
                    onChangeText={(text) => this.setState({newPass:text})}
                    reg={this._newPassword}/>


                <ValidateTextInput
                    ref={ component => this._input_conform_password = component }
                    style={styles.textInput}
                    placeholder='确认密码'
                    clearButtonMode="while-editing"
                    maxLength={20}
                    secureTextEntry={true}
                    underlineColorAndroid='transparent'
                    editable={true}
                    value={this.state.confPass}
                    onChangeText={(text) => this.setState({confPass:text})}
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
                        if(!this._input_old_password.validate){
                            this._input_old_password.setState({
                            backgroundColor:constants.UIInputErrorColor,
                            })
                             this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '密码格式错误'
                            })
                            return
                        }
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
                        this._input_old_password.editable=false
                        this._input_new_password.editable=false
                        this._input_conform_password.editable=false

                        this._button_2.setState({
                            loading: true,
                            //disabled: true,
                        })
                       /* setTimeout( () => {
                            this._button_2.setState({
                                loading: false,
                                //disabled: false
                            })

                        }, 3000)*/
                        this._fetch_changePassword()
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

    async _fetch_changePassword() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.changePwd,
                    old_pwd: hex_md5(this.state.oldPass),
                    new_pwd: hex_md5(this.state.newPass),
                    sure_pwd: hex_md5(this.state.confPass),
                    deviceId: deviceID,
                    token: token,

                }
            }

            options.data = await this.gZip(options)

            //console.log(`_fetch_changePassword options:`, options)

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
            if (result.code && result.code == -54) {
                /*AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.replace({
                    title: '用户登录',
                    component: LoginPage,
                })*/
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
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

               /* AsyncStorage.removeItem('token')
                AsyncStorage.removeItem('realName')
                this.props.navigator.push({
                    title: '用户登录',
                    component: LoginPage,
                })*/
                NativeAppEventEmitter.emit('getMsg_202_code_need_login')


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
            this._input_old_password.editable=true
            this._input_new_password.editable=true
            this._input_conform_password.editable=true
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
        }
    }
}

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
        justifyContent: 'center', borderRadius: 30,

    },
});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar
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


export default AppEventListenerEnhance(XhrEnhance(SetPassword))