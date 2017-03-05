/**
 * Created by shiyunjie on 16/12/31.
 */
/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    TouchableOpacity,
    NativeAppEventEmitter,
} from 'react-native';


import constants from  '../constants/constant';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import Icon from 'react-native-vector-icons/Ionicons';
import {getDeviceID,getToken} from '../lib/User'

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
import XhrEnhance from '../lib/XhrEnhance' //http

import Toast from 'react-native-smart-toast'
import ProgressView from '../components/modalProgress'

class MessageDetail extends Component {

    // 构造
    constructor(props) {
        super(props);

        // 初始状态
        this.state = {
            showProgress: true,//显示加载
            showReload: false,//显示加载更多

        }

    }

    componentWillMount() {
        NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        let currentRoute = this.props.navigator.navigationContext.currentRoute
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('willfocus', (event) => {
                //console.log(`OrderDetail willfocus...`)
                //console.log(`currentRoute`, currentRoute)
                //console.log(`event.data.route`, event.data.route)
                if (currentRoute === event.data.route) {
                    //console.log("OrderDetail willAppear")
                    NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
                } else {
                    //console.log("OrderDetail willDisappear, other willAppear")
                }
                //
            })
        )
        this.addAppEventListener(
            this.props.navigator.navigationContext.addListener('didfocus', (event) => {
                //console.log(`payPage didfocus...`)
                if (event && currentRoute === event.data.route) {
                    console.log("upload didAppear")
                    this._fetchData_read(this.props.id)

                } else {
                    //console.log("orderPage willDisappear, other willAppear")
                }

            })
        )
    }


    render() {
        /* return (
         <View style={styles.container}>
         <View style={styles.itemView}>
         <View style={{flex:3,}}>
         <Text style={{fontSize:17,marginLeft:constants.MarginLeftRight}} numberOfLines={1}>{this.props.title}</Text>
         </View>
         <View style={{flex:2,justifyContent:'flex-end',marginRight:constants.MarginLeftRight}}>
         <Text style={{flex:1,color:constants.UIInActiveColor}}>{this.props.send_time}</Text>
         </View>
         </View>
         <View
         style={{flex:1,marginTop:10,marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}>
         <Text numberOfLines={5}>{this.props.content}</Text>
         </View>
         </View>
         );*/
        return (
            <View style={styles.container}>
                {this.state.showProgress || this.state.showReload ?
                    <ProgressView
                        showProgress={this.state.showProgress}
                        showReload={this.state.showReload}
                        fetchData={()=>{
                        this.setState({
                        showProgress:true,//显示加载
                        showReload:false,//显示加载更多
                         })
                        this._fetchData_read(this.props.id)
                        }}
                    /> :
                    <View style={{flex:1}}>
                        <View style={styles.itemView}>
                            <Text style={{fontSize:17,color:constants.LabelColor,}}
                                  numberOfLines={1}>{this.props.title}</Text>
                            <Text
                                style={{fontSize:12,marginTop:5,color:constants.UIInActiveColor}}>{this.props.send_time}</Text>

                        </View>
                        <View style={{height:1,borderBottomWidth: StyleSheet.hairlineWidth,borderColor:constants.LineColor,
                                marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}/>
                        <View
                            style={{flex:1,marginTop:10,marginLeft:constants.MarginLeftRight,marginRight:constants.MarginLeftRight}}>
                            <Text numberOfLines={5}
                                  style={{fontSize:14,color:constants.PointColor}}>{this.props.content}</Text>
                        </View>
                    </View>
                }
                <Toast
                    ref={ component => this._toast = component }
                    marginTop={64}>
                </Toast>
            </View>
        );
    }

    async _fetchData_read(id) {
        try {
            let token = await getToken()
            let deviceID = await getDeviceID()

            let options = {
                method: 'post',
                url: constants.api.service,
                data: {
                    iType: constants.iType.infoDetail,
                    id: id,
                    deviceId: deviceID,
                    token: token,
                }
            }
            options.data = await this.gZip(options)

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
            if (!result) {
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
                this.props.navigator.pop()
                NativeAppEventEmitter.emit('getMsg_202_code_need_login');
                return
            }
            if (result.code && result.code == 10) {
                this.setState(
                    {
                        showProgress: false,//显示加载
                        showReload: false,//显示加载更多
                    })


            } else {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: result.msg
                })
                this.setState(
                    {
                        showProgress: false,//显示加载
                        showReload: false,//显示加载更多
                    })
            }

        }
        catch (error) {
            //console.log(error)
            if (this._toast) {
                this._toast.show({
                    position: Toast.constants.gravity.center,
                    duration: 255,
                    children: error
                })
            }

            this.setState({
                showProgress: false,//显示加载
                showReload: true,//显示加载更多
            })

        }

    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',

        justifyContent: 'flex-start',
        alignItems: 'stretch',
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: 'white',
    },
    itemView: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        paddingBottom: 15,

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

export default AppEventListenerEnhance(XhrEnhance(MessageDetail))