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
    Linking,
    NativeAppEventEmitter,
} from 'react-native';
import constants from  '../constants/constant';
import ItemView from '../components/UserViewItem';
import ContactPage from './contactPage';
import EditPage from './editPage';
import HelpPage from './helpPage';
import VersionPage from './versionPage';
import Icon from 'react-native-vector-icons/Ionicons';
import navigatorStyle from '../styles/navigatorStyle'       //navigationBar样式

import XhrEnhance from '../lib/XhrEnhance' //http

import AppEventListenerEnhance from 'react-native-smart-app-event-listener-enhance'
//import { member_changePwd,errorXhrMock } from '../mock/xhr-mock'   //mock data

class More extends Component {
    // 构造
      constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            userID:''
        };
      }

    componentWillMount() {
        ////NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //let currentRoute = this.props.navigator.navigationContext.currentRoute
        //this.addAppEventListener(
        //this.props.navigator.navigationContext.addListener('willfocus', (event) => {
        //    //console.log(`orderPage willfocus...`)
        //    //console.log(`currentRoute`, currentRoute)
        //    //console.log(`event.data.route`, event.data.route)
        //    if (currentRoute === event.data.route) {
        //        //console.log("orderPage willAppear")
        //        //NativeAppEventEmitter.emit('setNavigationBar.index', navigationBarRouteMapper)
        //        NativeAppEventEmitter.emit('setRootPageNavigationBar.index')
        //    } else {
        //        //console.log("orderPage willDisappear, other willAppear")
        //    }
        //    //
        //})
        //)
    }

    render() {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onCall}>
                    <ItemView
                        name='ios-call'
                        size={constants.IconSize}
                        title='联系我们'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                        style={{height:50,}}
                        onPress={this._onHelp}>
                    <ItemView
                        name='ios-help-circle'
                        size={constants.IconSize}
                        title='帮助中心'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                        style={{height:50,}}
                        onPress={this._onEdit}>
                    <ItemView
                        name='ios-paper'
                        size={constants.IconSize}
                        title='用户反馈'
                        show={false}
                        hasCheckBox={false}/>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{height:50,}}
                    onPress={this._onVersion}>
                    <ItemView
                        name='ios-bookmarks-outline'
                        size={constants.IconSize}
                        title='版本说明'
                        show={false}
                        hasCheckBox={false}
                        hasLine={false}/>
                </TouchableOpacity>
            </View>
        );
    }


    _onCall=()=>{
        //打电话
        //return Linking.openURL(constants.Tel)
        this.props.navigator.push({
            title: '联系我们',
            component: ContactPage,

        });
    };
    _onHelp=()=>{
        this.props.navigator.push({
            title: '帮助中心',
            component: HelpPage,

        });
    };
    _onEdit=()=>{

        this.props.navigator.push({
            title: '用户反馈',
            component: EditPage,
            passProps:{
                userID:this.state.userID,
            }

        });
    };

    _onVersion=()=>{
        this.props.navigator.push({
            title: '版本说明',
            component: VersionPage,

        });
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: Platform.OS == 'ios' ? 64 : 56,
        flexDirection: 'column',
        alignItems: 'stretch',
        backgroundColor: constants.UIBackgroundColor,
    },


});
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
//                    更多
//                </Text> : <View style={navigatorStyle.navBarTitleAndroid}>
//                <Text style={[navigatorStyle.navBarText, navigatorStyle.navBarTitleText]}>
//                    更多
//                </Text>
//            </View>
//        )
//    },
//
//}


export default AppEventListenerEnhance(XhrEnhance(More))