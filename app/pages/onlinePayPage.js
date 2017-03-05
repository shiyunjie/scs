/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    Image,
    ActivityIndicator,
    ActivityIndicatorIOS,
    ProgressBarAndroid,
    Platform,
    NativeAppEventEmitter,
    TouchableOpacity,
    Alert,
} from 'react-native';


import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { sysInfo_feedBack,errorXhrMock } from '../mock/xhr-mock'   //mock data

import {getDeviceID,getToken} from '../lib/User'
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'

import AliPay from 'react-native-smart-alipay'



import image_alipay from '../images/alipay.png'
import image_tencent from  '../images/tencentlogo.png'
import image_union from '../images/unionPay.png'

class OnLinePay extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            id: this.props.service_id,
            payList: this.props.payList,
            hasPayList: this.props.hasPayList,
            total: this.props.total,

        };
        this._payType = 'alipay'

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
            NativeAppEventEmitter.addListener('alipay.mobile.securitypay.pay.onPaymentResult', this._onPaymentResult) //alipay
        )
    }

    _onPaymentResult = (result) => {
        //console.log(`result -> `)
        //console.log(result)
        //console.log(`result.resultStatus = ${result.resultStatus}`)
        //console.log(`result.memo = ${result.memo}`)
        //console.log(`result.result = ${result.result}`)
        this._button_alipay.setState({
            loading: false,
        })
        Alert.alert(
            '温馨提醒',
            `${result.resultStatus == 9000 ? '支付成功' : '支付失败'} `
        )
    }


    render() {
        return (
            <View
                style={styles.container}>
                <View
                    style={{flex:1,flexDirection:'column',justifyContent:'flex-start',
                    alignItems:'stretch'}}>
                    <TouchableOpacity style={styles.textTitle}
                                      onPress={()=>{
                                        //this._payType = 'union'
                                       }}>
                        <Image style={{height:30,width:45,opacity: 0.2}}
                               source={image_union}
                               />
                        <View style={styles.textContent}>
                            <Text style={{color:constants.UIBackgroundColor,
                            marginLeft:constants.MarginLeftRight}}>银联支付</Text>
                        </View>
                        <View
                            style={[styles.textIcon]}>
                            <Icon
                                name={this._payType=='union'?
                                'md-checkmark-circle':'ios-radio-button-off-outline'}  // 图标
                                size={constants.IconSize}
                                color={this._payType=='union'?
                                constants.UIActiveColor:constants.UIBackgroundColor}/>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textTitle}
                                          onPress={()=>{
                                            this._payType = 'alipay'
                                          }}>
                            <Image style={{height:35,width:35,marginRight:5,marginLeft:5,}}
                                   source={image_alipay} />
                            <View style={styles.textContent}>
                                <Text style={{color:constants.UIInActiveColor,
                                marginLeft:constants.MarginLeftRight}}>支付宝</Text>
                            </View>
                            <View
                                style={[styles.textIcon]}>
                                <Icon
                                    name={this._payType=='alipay'?
                                    'md-checkmark-circle':'ios-radio-button-off-outline'}  // 图标
                                    size={constants.IconSize}
                                    color={this._payType=='alipay'?
                                    constants.UIActiveColor:constants.UIInActiveColor}/>
                            </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.textTitle}
                                      onPress={()=>{
                                            //this._payType = 'tencent'
                                          }}>
                        <Image style={{height:35,width:35,marginRight:5,marginLeft:5,opacity: 0.2}}
                               source={image_tencent}
                               />
                        <View style={styles.textContent}>
                            <Text style={{color:constants.UIBackgroundColor,
                                marginLeft:constants.MarginLeftRight}}>微信支付</Text>
                        </View>
                        <View
                            style={[styles.textIcon]}>
                            <Icon
                                name={this._payType=='tencent'?
                                    'md-checkmark-circle':'ios-radio-button-off-outline'}  // 图标
                                size={constants.IconSize}
                                color={this._payType=='tencent'?
                                    constants.UIActiveColor:constants.UIBackgroundColor}/>
                        </View>
                    </TouchableOpacity>
                    <Button
                        ref={ component => this._button_alipay = component }
                        touchableType={Button.constants.touchableTypes.fadeContent}
                        style={styles.button}
                        textStyle={{fontSize: 17, color: 'white'}}
                        loadingComponent={
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                {
                                //this._renderActivityIndicator()
                                }
                                <Text style={{fontSize: 17, color: 'white',
                                fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>提交中...</Text>
                            </View>
                    }
                        onPress={ () => {
                        this._button_alipay.setState({

                            loading: true,
                            //disabled: true,
                        });
                        this._fetch_edit()
                       /* setTimeout( () => {
                            this._button_alipay.setState({
                            loading: false,
                            //disabled: false
                            })
                            }, 3000)*/
                    }}>
                        确认支付￥{this.props.total}
                    </Button>
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

    async _fetch_edit() {
        if(this._modalLoadingSpinnerOverLay) {
            this._modalLoadingSpinnerOverLay.show()
        }
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let ids=''
            for(let data of this.state.payList){
                if(this.state.hasPayList.indexOf(data)==-1){
                    ids+=data
                    ids+=','
                }
            }


            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.serviceCost_payCost,
                    ids: ids, //(String 账单ids),
                    total: this.props.total,//(String 支付的金额),
                    payType: this._payType,//(支付方式 微信,支付宝)
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
            if (result.code && result.code == -54) {
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {
                //正式支付
                //console.log(`获取支付宝参数成功, decodeURIComponent -> orderText = ${result.result}`);
                //let appScheme = 'ios对应URL Types中的URL Schemes的值, 会影响支付成功后是否能正确的返回app'
                let appScheme = 'scs'
                let orderText = result.result
                AliPay.payOrder({
                    orderText,
                    appScheme,
                });

                setTimeout(()=>this.props.navigator.pop(),1000)
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


        }finally {

            this._button_alipay.setState({
                loading: false,
                //disabled: false
            })
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },
    button: {
        height: 40,
        backgroundColor: constants.UIActiveColor,
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIActiveColor,
        justifyContent: 'center',
        borderRadius: 30,
        margin:constants.MarginLeftRight,
    },
    textTitle: {
        height:50,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        //borderBottomWidth: StyleSheet.hairlineWidth,
        backgroundColor: 'white',
        paddingLeft: constants.MarginLeftRight,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: constants.UIInActiveColor,
    },
    textContent: {
        flex:1,flexDirection:'column',
        alignItems:'stretch',
        justifyContent:'center',

    },
    textIcon: {
        flexDirection: 'row',
        justifyContent:'center',
        alignItems:'center',
        width:30,
        marginRight:5,

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

export default AppEventListenerEnhance(XhrEnhance(OnLinePay))