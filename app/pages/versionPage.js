/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    NativeAppEventEmitter,
    TouchableOpacity,
    Platform,
    NativeModules,
    Linking,
    Alert,
} from 'react-native';

import image_logo from '../images/icon.png'

import constants from  '../constants/constant'

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import {getDeviceID,getToken,getVersion} from '../lib/User'
import XhrEnhance from '../lib/XhrEnhance'
import Toast from 'react-native-smart-toast'
import LoadingSpinnerOverlay from 'react-native-smart-loading-spinner-overlay'
const HttpRSAModule = NativeModules.HttpRSAModule;

class Version extends Component {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            version: '',
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
                if (currentRoute === event.data.route) {
                    //console.log("orderPage willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }
                //
            })
        )
        this._getVersion()
    }

    async _getVersion() {

        let version = await getVersion()
        version = version.replace('Version: ', '')
        this.setState({version: version})
    }

    render() {
        return (
            <View style={styles.container}>
                <View
                    style={{
                    flexDirection: 'column',
                    flex: 2,
                    justifyContent: 'center',
                    alignItems: 'center',}}>
                    <Image
                        style={{width:100,height:100}}
                        source={image_logo}
                    />
                    <Text
                        style={{color:constants.UIActiveColor,marginTop:10,}}
                        //backgroundColor:'transparent'
                    >胖马贸服</Text>
                    <Text
                        style={{color:constants.UIActiveColor,marginTop:10,}}
                        //backgroundColor:'transparent'
                    >{`版本号:${this.state.version}`}</Text>
                    {Platform.OS == 'android'?
                        <TouchableOpacity style={{marginTop:10,}}
                                          onPress={()=>{
                                      if(this._modalLoadingSpinnerOverLay){
                                            this._modalLoadingSpinnerOverLay.show()
                                        }
                                      this._checkUpdate()}}>
                            <Text
                                style={{color:constants.LabelColor,}}
                                //backgroundColor:'transparent'
                            >检查更新</Text>
                        </TouchableOpacity>:null
                    }
                </View>
                <View style={{flex:1}}/>
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>

                </Toast>
                <LoadingSpinnerOverlay
                    ref={ component => this._modalLoadingSpinnerOverLay = component }/>
            </View>
        );
    }

    async _checkUpdate() {

        let token = '999'
        let deviceID = '999'
        let version= this.state.version
        let options = {
            method: 'post',
            url: constants.api.service,
            //url: constants.api.indexShowPicture,
            data: {
                iType: constants.iType.sysInfo_checkUpdate,
                type:Platform.OS == 'android'?0:1,
                deviceId: deviceID,
                token: token,

            }
        }
        options.data = await this.gZip(options)

        try {

            let resultData = await this.fetch(options)
            //console.log('resultData:', resultData)
            let result = await this.gunZip(resultData)
            if (!result) {

                return
            }
            //console.log('gunZip:', result)
            result = JSON.parse(result)

            if (!result) {

                return
            }


            if (result.code && result.code == 10) {

                if(result.result.version!=version) {
                    if (Platform.OS == 'android') {
                        //检查更新app
                        //HttpRSAModule.UpdateApp('http://o2o.doorto.cn/upload/app/o2o/onlineshop.apk')
                        HttpRSAModule.UpdateApp(result.result.url)

                    } else {
                        console.log('result.result.url:', result)
                        //HttpRSAModule.UpdateApp('https://itunes.apple.com/cn/app/dao-tu-sheng-huo-chao-shi/id1037683195?mt=8')
                        Alert.alert('升级提醒','发现新版本,现在要升级吗?',[

                            {text:'确定',onPress:()=>{
                                if(this._modalLoadingSpinnerOverLay) {
                                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                                }
                                Linking.openURL(result.result.url).catch(err => console.error('An error occurred', err))}},
                            {text:'取消',onPress:()=>{
                                if(this._modalLoadingSpinnerOverLay) {
                                    this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                                }
                            }},
                        ])
                    }
                }else{
                    if(this._modalLoadingSpinnerOverLay) {
                        this._modalLoadingSpinnerOverLay.hide({duration: 0,})
                    }
                    this._toast.show({
                        position: Toast.constants.gravity.center,
                        duration: 255,
                        children: '已是最新版本'
                    })
                }
            }
        }
        catch (error) {
            //console.log(error)
            if(this._modalLoadingSpinnerOverLay) {
                this._modalLoadingSpinnerOverLay.hide({duration: 0,})
            }
            if(this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }
        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FCF0ED',
    },

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

export default AppEventListenerEnhance(XhrEnhance(Version))