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
} from 'react-native';

import image_logo from '../images/icon.png'

import constants from  '../constants/constant'

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import {getDeviceID,getToken,getVersion} from '../lib/User'


class Version extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            version:'',
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

    async _getVersion(){

        let version=await getVersion()
        this.setState({version:version})
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
                    >{this.state.version}</Text>

                </View>
                <View style={{flex:1}}/>

            </View>
        );
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

export default AppEventListenerEnhance(Version)