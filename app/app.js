/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StatusBar,
    AppRegistry,
    StyleSheet,
    Navigator,
    Text,
    TouchableOpacity,
    Platform,
    View,
    NativeAppEventEmitter,
    AsyncStorage,
    NativeModules,
} from 'react-native';

import Index from './root';
import constants from  './constants/constant'
import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import CodePush from "react-native-code-push";
import SplashScreen from 'react-native-smart-splash-screen'

let codePushOptions = { checkFrequency: CodePush.CheckFrequency.ON_APP_RESUME };
//let codePushOptions = { checkFrequency: CodePush.CheckFrequency.MANUAL };

const HttpRSAModule = NativeModules.HttpRSAModule;

class Root extends Component {
    constructor (props, context) {
        super(props);
        this.state = {
            navigationBar: NavigationBarRouteMapper,
        }
    }

    /*    syncImmediate() {

     CodePush.sync(

     { installMode: CodePush.InstallMode.IMMEDIATE,//启动模式三种：ON_NEXT_RESUME、ON_NEXT_RESTART、IMMEDIATE

     updateDialog: {

     appendReleaseDescription:true,//是否显示更新description，默认为false

     descriptionPrefix:"更新内容：",//更新说明的前缀。 默认是” Description:

     mandatoryContinueButtonLabel:"立即更新",//强制更新的按钮文字，默认为continue

     mandatoryUpdateMessage:"",//- 强制更新时，更新通知. Defaults to “An update is available that must be installed.”.

     optionalIgnoreButtonLabel: '稍后',//非强制更新时，取消按钮文字,默认是ignore

     optionalInstallButtonLabel: '后台更新',//非强制更新时，确认文字. Defaults to “Install”

     optionalUpdateMessage: '有新版本了，是否更新？',//非强制更新时，更新通知. Defaults to “An update is available. Would you like to install it?”.

     title: '更新提示'//要显示的更新通知的标题. Defaults to “Update available”.

     },

     }

     );

     }*/

    codePushStatusDidChange (status) {
        switch (status) {
            case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
                console.log("Checking for updates.");
                break;
            case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
                console.log("Downloading package.");
                break;
            case CodePush.SyncStatus.INSTALLING_UPDATE:
                console.log("Installing update.");
                break;
            case CodePush.SyncStatus.UP_TO_DATE:
                console.log("Up-to-date.");
                break;
            case CodePush.SyncStatus.UPDATE_INSTALLED:
                console.log("Update installed.");
                break;
        }
    }

    codePushDownloadDidProgress (progress) {
        console.log(progress.receivedBytes + " of " + progress.totalBytes + " received.");
    }

    componentWillMount () {
        CodePush.disallowRestart();//页面加载的禁止重启，在加载完了可以允许重启
        //检查版本更新
        /* if(Platform.OS=='android'){
         //检查更新app
         HttpRSAModule.UpdateApp('http://o2o.doorto.cn/upload/app/o2o/onlineshop.apk')
         }else{
         HttpRSAModule.UpdateApp('https://itunes.apple.com/cn/app/dao-tu-sheng-huo-chao-shi/id1037683195?mt=8')
         }*/
    }

    componentWillUnmount () {
        // Reallow restarts, and optionally trigger
        // a restart if one was currently pending.
        CodePush.allowRestart();
    }

    componentDidMount () {

        //this.addAppEventListener(
        this._listener1 = NativeAppEventEmitter.addListener('setNavigationBar.index', (navigationBar) => {
            console.log(`setNavigationBar.index navigationBar -> `, navigationBar)
            this.setState({
                navigationBar: navigationBar,
            })
        })



        //)
        //SplashScreen.close(SplashScreen.animationType.scale,850,500)
        SplashScreen.close({
            animationType: SplashScreen.animationType.scale,
            duration: 850,
            delay: 500,
        })
    }

    componentWillUnmount () {
        //移除监听返回键
        if (this._listener1) {
            this._listener1.remove();
        }
        /*if (this._listener2) {
            this._listener2.remove()
        }*/

    }

    render () {
        return (
            <View style={{flex:1}}>
                <StatusBar
                    backgroundColor={constants.UIActiveColor}
                    barStyle="light-content"
                />
            <Navigator style={styles.container}
                       initialRoute={{
              component: Index,
                  title: '首页',
            }}
                       sceneStyle={styles.navigatorBg}
                       renderScene={(route, navigator) => {
              let Component = route.component;
              return (
                  <Component
                      navigator={navigator}
                      {...route.passProps}
                    />
              )}}
                /**
                * 禁用navigator手势回退
                */
                       configureScene={(route) => {
                          let conf = Navigator.SceneConfigs.HorizontalSwipeJump;
                          conf.gestures = null;
                          return conf;
                        }}
                       navigationBar={
                <Navigator.NavigationBar
                    ref={(navigationBar) => {
                      this.navigationBar = navigationBar
                    }}
                    routeMapper={this.state.navigationBar}
                    style={styles.navBar} /> }
            />
                </View>
        )
    }
}

let NavigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
                style={styles.navBarLeftButton}>
                <Text style={[styles.navBarText, styles.navBarButtonText]}>

                </Text>
            </TouchableOpacity>
        );
    },

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    {route.title}
                </Text> : <View style={{alignSelf: 'center', position: 'relative', left: -35,}}>
                <Text style={[styles.navBarText, styles.navBarTitleText]}>
                    {route.title}
                </Text>
            </View>
        )
    },

};

const styles = StyleSheet.create({
    navigatorBg: {
        backgroundColor: '#F4F4F4',
    },
    navBar: {
        backgroundColor: constants.UIActiveColor,
    },
    navBarText: {
        flex: 1,
        fontSize: 16,
        color: 'white',
        textAlign: 'center',
        textAlignVertical: 'center',

    },
    navBarTitleText: {
        color: 'white',
        fontWeight: '500',
        marginVertical: 9,
    },

    navBarLeftButton: {
        paddingLeft: 10,
    },
    navBarRightButton: {
        paddingRight: 10,
    },
    navBarButtonText: {
        color: '#5890FF',
    },
})

//codepush
Root = CodePush(codePushOptions)(Root);
//export default AppEventListenerEnhance(Root)
export default Root