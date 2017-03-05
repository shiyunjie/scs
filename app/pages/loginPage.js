/**
 * Created by shiyunjie on 16/12/26.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    TouchableOpacity,
    Platform,
    NativeAppEventEmitter,
    AsyncStorage,
    BackAndroid,
} from 'react-native';

import constants from  '../constants/constant';
import InputView from '../components/loginInputView';
import ForgetPasswordPage from './forgetPasswordPage';
import Button from 'react-native-smart-button';
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式


import {getDeviceID,getToken,getAccount} from '../lib/User'
import {hex_md5} from '../lib/md5'
import XhrEnhance from '../lib/XhrEnhance' //http
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'


class Login extends Component {

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            phone: '',
            password: '',


        };
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
        this._getAccount()
    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            this.props.navigator.popToTop()
            NativeAppEventEmitter.emit('setRootPageNavigationBar.index')

            return true;
        }

    }

    async _getAccount() {
        let account = await getAccount();
        if (account && account == '') {

        } else {
            this.setState({phone: account})
        }

    }

    render() {
        return (
            <View style={styles.container}>
                <View style={styles.instructions}>
                    <InputView style={{backgroundColor:'white',height:30}}
                               ref={ component => this._input_phone = component }
                               iconName='ios-person'
                               iconSize={constants.IconSize}
                               placeholder='输入手机号/会员名/邮箱'
                               maxLength={20}
                               editable={true}
                               value={this.state.phone}
                               onChangeText={(text) => this.setState({phone:text})}/>
                    <InputView style={{backgroundColor:'white',height:30,marginTop:10}}
                               ref={ component => this._input_password = component }
                               iconName='ios-lock'
                               iconSize={constants.IconSize}
                               placeholder='输入密码'
                               maxLength={20}
                               secureTextEntry={true}
                               editable={true}
                               secureTextEntry={true}
                               value={this.state.password}
                               onChangeText={(text) => this.setState({password:text})}/>
                    <View style={{flex:1,
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    alignItems: 'stretch',}}>
                        <View style={{flex:1,flexDirection: 'row',marginRight:5,marginLeft:5}}>
                            <TouchableOpacity
                                onPress={this._onRegister}
                            >
                                <Text style={{fontSize:13,color:constants.UIActiveColor}}>立即注册</Text>
                            </TouchableOpacity>
                                <View style={{flex:1,}}></View>
                            <TouchableOpacity
                                onPress={this._onForgetPassword}
                            >
                                <Text style={{fontSize:13,color:constants.UIActiveColor}}
                                >忘记密码</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{flex:1,}}></View>

                    </View>
                    <View style={{flex:1,}}>
                        <Button
                            ref={ component => this.button2 = component }
                            touchableType={Button.constants.touchableTypes.fadeContent}
                            style={styles.button}
                            textStyle={{fontSize: 17, color: 'white'}}
                            loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {
                                //this._renderActivityIndicator()
                                }
                                <Text style={{fontSize: 17, color: 'white', fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>登录中...</Text>
                            </View>
                    }
                            onPress={ () => {
                            if(this.state.phone==''){
                            this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '请填写用户名'
                            })
                            return
                            }

                            if(this.state.password==''){
                            this._toast.show({
                                position: Toast.constants.gravity.center,
                                duration: 255,
                                children: '请填写密码'
                            })
                            return
                            }

                        this.button2.setState({

                            loading: true,
                            //disabled: true,
                        });
                        this._input_phone.editable=false
                        this._input_password.editable=false
                        if(this._modalLoadingSpinnerOverLay){
                            this._modalLoadingSpinnerOverLay.show()
                        }

                         AsyncStorage.setItem('account',this.state.phone)
                         this._fetch_Login()
                         /*setTimeout( () => {
                            this.button2.setState({
                                loading: false,
                                //disabled: false
                            })
                        }, 3000)*/
                    }}>
                            登录
                        </Button>

                    </View>
                </View>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
            </View>
        );
    }

    async _fetch_Login() {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()
            let pwd = hex_md5(this.state.password)
            //console.log(`md5_pwd`, pwd)
            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.login,
                    member_name: this.state.phone,
                    pwd: pwd,
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
            console.log('gunZip:', result)

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
                //console.log('token', result.result)
                AsyncStorage.setItem('token', result.result.token)
                AsyncStorage.setItem('phone', result.result.phone)
                //console.log('real_name:', result.result.real_name)
                AsyncStorage.setItem('realName', result.result.real_name)

               /* this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '登录成功'
                })*/

                    this.props.navigator.popToTop()

                    NativeAppEventEmitter.emit('user_login_in_need_reset_realname')
                    NativeAppEventEmitter.emit('setRootPageNavigationBar.index')



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
            this.button2.setState({
                loading: false,
                //disabled: false
            })
            this._input_phone.editable=true
            this._input_password.editable=true
            if(this._modalLoadingSpinnerOverLay){
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }

            //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
            //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
        }
    }

    _onRegister = () => {

        this.props.navigator.push({
            title: '注册',
            component: ForgetPasswordPage,
            passProps: {
                nextPageIndex: 'register'
            }
        });
    }

    _onForgetPassword = () => {

        this.props.navigator.push({
            title: '忘记密码',
            component: ForgetPasswordPage,
            passProps: {
                nextPageIndex: 'forget'
            }
        });
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

export default AppEventListenerEnhance(XhrEnhance(Login))

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: '#FDC288',
    },

    instructions: {

        height: 200,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'stretch',
        marginLeft: constants.MarginLeftRight,
        marginRight: constants.MarginLeftRight,
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
    ...navigationBar, LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[index - 1];
        return (
            <TouchableOpacity
                onPress={() => navigator.popToTop()}
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
}


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
//                onPress={() => {navigator.popToTop()
//                 NativeAppEventEmitter.emit('setRootPageNavigationBar.index')}}
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