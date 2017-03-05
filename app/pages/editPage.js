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
    Alert,
} from 'react-native';


import constants from  '../constants/constant';
import Button from 'react-native-smart-button';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http
//import { sysInfo_feedBack,errorXhrMock } from '../mock/xhr-mock'   //mock data
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
import {getDeviceID,getToken,getRealName} from '../lib/User'
import Toast from 'react-native-smart-toast'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

class Edit extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            text:'',
        };
      }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
        this.props.navigator.navigationContext.addListener('willfocus', (event) => {
            console.log(`orderPage willfocus...`)
            console.log(`currentRoute`, currentRoute)
            //console.log(`event.data.route`, event.data.route)
            if (event&&currentRoute === event.data.route) {
                console.log("orderPage willAppear")
                NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
            } else {
                console.log("orderPage willDisappear, other willAppear")
            }
            //
        })
        )
    }


    render() {
        return (
            <View
                style={styles.container}>
              <View
                  style={{flex:1,}}>
                  <TextInput
                      ref={ component => this._input_text = component }
                      style={{flex:1,
                      fontSize:15,
                      backgroundColor:'white',
                      textAlignVertical:'top',
                      margin:constants.MarginLeftRight,
                      borderWidth: StyleSheet.hairlineWidth,
                      borderColor: constants.UIInActiveColor,
                      justifyContent:'flex-start'
                      }}
                      clearButtonMode="while-editing"
                      placeholder='请提供宝贵意见'
                      maxLength={300}
                      underlineColorAndroid='transparent'
                      multiline={true}//多行输入
                      numberOfLines={10}
                      editable = {true}
                      value={this.state.text}
                      onChangeText={(text) => this.setState({text:text})}/>
                  <Text style={{color:constants.UIInActiveColor,position:'absolute',bottom:constants.MarginLeftRight,
                  right:constants.MarginLeftRight,backgroundColor:'transparent',}}>300字以内</Text>
              </View>
                <View  style={{flex:1,padding:10}}>
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
                                <Text style={{fontSize: 17, color: 'white',
                                fontWeight: 'bold', fontFamily: '.HelveticaNeueInterface-MediumP4',}}>提交中...</Text>
                            </View>
                        }
                        onPress={ () => {
                        if(this.state.text==''){
                        this._toast.show({
                            position: Toast.constants.gravity.center,
                            duration: 255,
                            children: '请填写内容'
                        })
                        return
                        }

                        this.button2.setState({
                            loading: true,
                            //disabled: true,
                        });
                        this._input_text.editable=false
                        if(this._modalLoadingSpinnerOverLay){
                        this._modalLoadingSpinnerOverLay.show()
                        }
                        this._fetch_edit()
                       /* setTimeout( () => {
                            this.button2.setState({
                            loading: false,
                            //disabled: false
                            })
                            }, 3000)*/
                        } }>
                        提交
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

    async _fetch_edit(){
        try {
        let token= await getToken()
        let deviceID= await getDeviceID()
        let options = {
            method:'post',
            url: constants.api.service,
            data: {
                iType: constants.iType.feedBack,
                content:this.state.text,
                deviceId:deviceID,
                token:token,
            }
        }

        options.data=await this.gZip(options)

        //console.log(`_fetch_sendCode options:` ,options)

        let resultData = await this.fetch(options)

        let result=await this.gunZip(resultData)
            if (!result) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: '服务器打盹了,稍后再试试吧'
                })
                return
            }
            result=JSON.parse(result)
        //console.log('gunZip:',result)
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
            if(result.code&&result.code==-54){
                /**
                 * 发送事件去登录
                 */
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
        if(result.code&&result.code==10){
            /* Alert.alert('提示', '注册成功', () => {
             this.props.navigator.popToTop()
             })*/
            this._toast.show({
                position: Toast.constants.gravity.center,
                duration: 255,
                children: '提交成功'
            })
           /* Alert.alert('温馨提醒','提交成功',
                [{text:'确定',onPress:()=>this.props.navigator.pop()}]
            )*/
            setTimeout(()=>this.props.navigator.pop(),1000)

        }else{
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
            this._input_text.editable=true
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
        //console.log(`SplashScreen.close(SplashScreen.animationType.scale, 850, 500)`)
        //SplashScreen.close(SplashScreen.animationType.scale, 850, 500)
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
//        var previousRoute = navState.routeStack[ index - 1 ];
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

export default AppEventListenerEnhance(XhrEnhance(Edit))