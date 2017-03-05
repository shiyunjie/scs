/**
 * Created by shiyunjie on 16/12/6.
 */
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Alert,
    Platform,
    TouchableOpacity,
    Dimensions,
    NativeAppEventEmitter,
} from 'react-native';


import Icon from 'react-native-vector-icons/Ionicons';
import constants from  '../constants/constant';
import ItemView from '../components/UserViewItem';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式
import image_background from '../images/background.png';
import image_head from '../images/head.png';
import EditInfoPage from './changeInfoPage';
import ChangePwdPage from './changepwdPage';
import MessagePage from './messagePage';
import LoginPage from './loginPage';

import {getDeviceID,getToken,getRealName} from '../lib/User'

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'

//import XhrEnhance from '../lib/XhrEnhance' //http
//import { errorXhrMock } from '../mock/xhr-mock'   //mock data


const { width: deviceWidth } = Dimensions.get('window');



class UserPage extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            userName:'用户名',
            userID:'用户ID',
        };
      }

    componentWillMount() {
        this.addAppEventListener(
            NativeAppEventEmitter.addListener('user_login_in_need_reset_realname', () => {
                this._getUserName()
            })
        )
        ////NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //let currentRoute = this.props.navigator.navigationContext.currentRoute
        //this.addAppEventListener(
        //this.props.navigator.navigationContext.addListener('willfocus', (event) => {
        //    //console.log(`orderPage willfocus...`)
        //    //console.log(`currentRoute`, currentRoute)
        //    //console.log(`event.data.route`, event.data.route)
        //    if (event&&currentRoute === event.data.route) {
        //        //console.log("orderPage willAppear")
        //        //NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //        //NativeAppEventEmitter.emit('setRootPageNavigationBar.index')
        //        this._getUserName()
        //    } else {
        //        //console.log("orderPage willDisappear, other willAppear")
        //    }
        //    //
        //})
        //)
        this._getUserName()
    }
    async _getUserName(){
        let userName=await getRealName()
        this.setState({userName:userName})

    }

    render() {
        return (
            <View style={styles.container}>
               <Image
                   source={image_background}
                   style={styles.head}>
                   <Image
                       source={image_head}
                       style={{width:80,height:80,}}/>
                   <Text style={{color:'white',backgroundColor:'transparent',marginTop:10}}>
                       {this.state.userName}
                   </Text>
               </Image>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onProfile}>
                    <ItemView
                        name='ios-person'
                        size={constants.IconSize}
                        title='我的头像'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onMessage}>
                    <ItemView
                        name='ios-mail'
                        size={constants.IconSize}
                        title='我的消息'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onEdit}>
                    <ItemView
                        name='ios-paper'
                        size={constants.IconSize}
                        title='修改信息'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onChangePwd}>
                    <ItemView
                        name='ios-lock'
                        size={constants.IconSize}
                        title='修改密码'
                        show={false}
                        hasCheckBox={false}
                        hasLine={false}/>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{height:40,marginTop:10,backgroundColor:'white',justifyContent:'center',alignItems:'center',}}
                    onPress={this._onSingOut}>
                    <Text
                        style={{color:constants.UIActiveColor,fontSize:14}}>
                        退出
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }

    _onProfile=()=>{
        Alert.alert('温馨提醒','该功能尚未开放')
    };

    _onSingOut=()=>{
        /**
         * 退出更新掉两个订单列表
         */
        NativeAppEventEmitter.emit('user_login_out_serviceList_need_reset')
        NativeAppEventEmitter.emit('user_login_out_orderList_need_reset')
        /**
         * 发送事件去登录
         */
        NativeAppEventEmitter.emit('getMsg_202_code_need_login');
    };
    _onMessage=()=>{
        this.props.navigator.push({
            title: '消息列表',
            component: MessagePage,
            passProps:{
                userID:this.state.userID,
            }

        });
    };

    _onChangePwd=()=>{
        this.props.navigator.push({
            title: '修改密码',
            component: ChangePwdPage,
            passProps:{
                userID:this.state.userID,
            }

        });
    };
    _onEdit=()=>{
        this.props.navigator.push({
            title: '修改信息',
            component: EditInfoPage,
            passProps:{
                userID:this.state.userID,
            }

        });
    };
}

export default AppEventListenerEnhance(UserPage)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        backgroundColor: constants.UIBackgroundColor,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    head:{
        height:150,
        width:deviceWidth,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent:'center'
    }

});
const navigationBarRouteMapper = {

    LeftButton: function (route, navigator, index, navState) {
        if (index === 0) {
            return null;
        }

        var previousRoute = navState.routeStack[ index - 1 ];
        return (
            <TouchableOpacity
                onPress={() => navigator.pop()}
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

    RightButton: function (route, navigator, index, navState) {

    },

    Title: function (route, navigator, index, navState) {
        return (
            Platform.OS == 'ios' ?
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    个人中心
                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
                    个人中心
                </Text>
            </View>
        )
    },

}

//export default XhrEnhance(UserPage)