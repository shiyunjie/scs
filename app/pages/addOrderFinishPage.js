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
    BackAndroid,
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
        this.addAppEventListener(
            BackAndroid.addEventListener('hardwareBackPress', this.onBackAndroid)
        )
    }

    onBackAndroid = () => {
        const routers = this.props.navigator.getCurrentRoutes();
        if (routers.length > 1) {
            /* Alert.alert('温馨提醒','确定退出吗?',[
             {text:'取消',onPress:()=>{}},
             {text:'确定',onPress:()=>this.props.navigator.popToTop()}
             ])*/
            this.props.navigator.popToTop()
            return true;
        }

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
                    style={{color:constants.UIActiveColor,marginTop:10,marginBottom:10,fontSize:16,}}
                    //backgroundColor:'transparent'
                    >新建成功了</Text>
                    <View style={[styles.viewItem,]}>

                        <TouchableOpacity
                            style={[{justifyContent:'center',alignItems:'center',},
                            {flex:1}]}
                            onPress={ ()=> this.props.navigator.pop() }>
                            <Text style={{color:'white',
                                      fontSize:17,textAlignVertical:'center',textAlign:'center',}}>再来一单</Text>

                        </TouchableOpacity>
                        <View
                            style={[{height:30,backgroundColor:'white'},
                                {width:StyleSheet.hairlineWidth,}]}/>
                        <TouchableOpacity
                            style={[{justifyContent:'center',alignItems:'center',},
                                        {flex:1,}]}
                            onPress={ ()=>this.props.navigator.popToTop()} >
                            <Text
                                style={{color:'white',
                                    fontSize:17,
                                    textAlignVertical:'center',
                                    textAlign:'center',
                                    color:'white'}}>完成</Text>
                        </TouchableOpacity>

                    </View>

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
    viewItem: {
        height: 40,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        marginLeft: constants.MarginLeftRight*2,
        marginRight:constants.MarginLeftRight*2,
        //backgroundColor: 'transparent',
        backgroundColor:constants.UIActiveColor,
        borderRadius:3,
    },

});

import {navigationBar} from '../components/NavigationBarRouteMapper'

const navigationBarRouteMapper = {
    ...navigationBar,
    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
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
//                onPress={() => navigator.popToTop()}
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